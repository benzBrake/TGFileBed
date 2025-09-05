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
  // 获取开始ID，如果没有提供则从1开始
  const startId = parseInt(c.req.query('startId') || '1', 10);
  
  // 获取总记录数（所有图片）
  const { total: totalImages } = await c.env.DB.prepare(`SELECT COUNT(*) as total FROM images`).first();
  
  // 获取已删除的记录数（ID小于开始ID的记录）
  const { total: deletedCount } = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM images WHERE id < ?`
  ).bind(startId).first();
  
  // 如果没有记录了，重定向到管理页面
  if (deletedCount >= totalImages) {
    return c.redirect('/manage');
  }
  
  // 获取要删除的5条记录
  const { results: images } = await c.env.DB.prepare(
    `SELECT id, telegram_message_id FROM images WHERE id >= ? ORDER BY id ASC LIMIT 5`
  ).bind(startId).all();
  
  if (images.length === 0) {
    return c.redirect('/manage');
  }
  
  // 删除Telegram消息
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

  // 从数据库中删除记录
  const idsToDelete = images.map(img => img.id);
  await c.env.DB.prepare(
    `DELETE FROM images WHERE id IN (${idsToDelete.map(() => '?').join(',')})`
  ).bind(...idsToDelete).run();
  
  // 计算下一个开始ID
  const nextStartId = images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : startId;
  
  // 计算当前批次的结束ID
  const endId = images.length > 0 ? Math.max(...images.map(img => img.id)) : startId;
  
  // 计算已删除的数量（当前批次删除前的数量 + 当前批次删除的数量）
  const newDeletedCount = deletedCount + images.length;
  
  
  // 获取等待时间，默认为20秒
  const waitTime = parseInt(c.env.DELETE_WAIT_TIME || '20', 10);
  
  // 导入等待页面
  const { waitPage } = await import('../views/wait.js');
  
  // 返回等待页面，现在包含结束ID
  return c.html(waitPage(newDeletedCount, totalImages, nextStartId, endId, waitTime)
    .replace('{siteTitle}', c.env.SITE_TITLE || 'TGFileBed'));
};