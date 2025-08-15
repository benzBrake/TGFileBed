import { generateHash, getFileExtension } from '../utils';

export const handleUpload = async (c) => {
  const { file } = await c.req.parseBody();
  if (!file || !(file instanceof File)) {
    return c.json({ error: 'No file uploaded' }, 400);
  }

  const fileExtension = getFileExtension(file.name);
  let newFilename;
  let isUnique = false;

  while (!isUnique) {
    const hash = generateHash(12);
    newFilename = `${hash}.${fileExtension}`;
    const existing = await c.env.DB.prepare(
      `SELECT id FROM images WHERE filename = ?`
    ).bind(newFilename).first();
    if (!existing) {
      isUnique = true;
    }
  }

  const formData = new FormData();
  formData.append('chat_id', c.env.CHAT_ID);
  formData.append('document', file, newFilename);

  const tgResponse = await fetch(
    `https://api.telegram.org/bot${c.env.BOT_TOKEN}/sendDocument`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const tgResult = await tgResponse.json();

  if (!tgResult.ok) {
    return c.json({ error: 'Failed to upload to Telegram', details: tgResult }, 500);
  }

  const messageId = tgResult.result.message_id;
  const fileId = tgResult.result.document.file_id;
  const hashId = generateHash(12);

  await c.env.DB.prepare(
    `INSERT INTO images (filename, telegram_message_id, telegram_file_id, size, hash_id) VALUES (?, ?, ?, ?, ?)`
  ).bind(newFilename, messageId, fileId, file.size, hashId).run();

  const imageUrl = `${new URL(c.req.url).origin}/file/${newFilename}`;
  return c.json({
    message: 'File uploaded successfully',
    url: imageUrl,
    hash_id: hashId,
  });
};