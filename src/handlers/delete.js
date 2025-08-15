export const handleDelete = async (c) => {
  const { hashid } = c.req.param();
  const image = await c.env.DB.prepare(`SELECT * FROM images WHERE hash_id = ?`).bind(hashid).first();

  if (!image) {
    return c.json({ error: 'Image not found' }, 404);
  }

  const tgResponse = await fetch(
    `https://api.telegram.org/bot${c.env.BOT_TOKEN}/deleteMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: c.env.CHAT_ID,
        message_id: image.telegram_message_id,
      }),
    }
  );

  const tgResult = await tgResponse.json();

  // We proceed to delete from DB even if Telegram deletion fails,
  // as the message might have been deleted already.
  if (!tgResult.ok) {
    console.warn(`Failed to delete message from Telegram: ${JSON.stringify(tgResult)}`);
  }

  await c.env.DB.prepare(`DELETE FROM images WHERE id = ?`).bind(image.id).run();

  return c.redirect('/manage');
};

export const handleDeleteAll = async (c) => {
  const { results: images } = await c.env.DB.prepare(`SELECT id, telegram_message_id FROM images`).all();

  const deletionPromises = images.map(image =>
    fetch(
      `https://api.telegram.org/bot${c.env.BOT_TOKEN}/deleteMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: c.env.CHAT_ID,
          message_id: image.telegram_message_id,
        }),
      }
    ).then(res => res.json())
  );

  const results = await Promise.all(deletionPromises);
  results.forEach(result => {
    if (!result.ok) {
      console.warn(`Failed to delete a message from Telegram: ${JSON.stringify(result)}`);
    }
  });

  await c.env.DB.prepare(`DELETE FROM images`).run();

  return c.redirect('/manage');
};