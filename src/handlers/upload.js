import { generateHash, getFileExtension, getExtensionFromMimeType, getMimeTypeFromFileContent } from '../utils';

export const handleUpload = async (c) => {
  const { file } = await c.req.parseBody();
  if (!file || !(file instanceof File)) {
    return c.json({ error: 'No file uploaded' }, 400);
  }

 const maxSize = parseInt(c.env.MAX_FILE_SIZE, 10);
 if (file.size > maxSize) {
   return c.json({ error: `File size exceeds the limit of ${maxSize / 1024 / 1024}MB` }, 400);
 }

  // 从文件名获取扩展名
  const fileExtensionFromName = getFileExtension(file.name);
  
  // 添加调试日志
  console.log('调试信息:');
  console.log('- 原始文件名:', file.name);
  console.log('- 从文件名获取的扩展名:', fileExtensionFromName);
  console.log('- 文件大小:', file.size);
  console.log('- 文件类型 (从File对象):', file.type);
  
  // 从文件内容获取MIME类型
  const mimeTypeFromFile = await getMimeTypeFromFileContent(file);
  console.log('- 从文件内容获取的MIME类型:', mimeTypeFromFile);
  
  // 从MIME类型获取扩展名
  const fileExtensionFromMime = getExtensionFromMimeType(mimeTypeFromFile);
  console.log('- 从MIME类型获取的扩展名:', fileExtensionFromMime);
  
  // 确定最终使用的扩展名
  let finalExtension = fileExtensionFromName;
  
  // 如果从文件名获取的扩展名为空，或者从MIME类型获取的扩展名与文件名扩展名不同，
  // 并且从MIME类型获取的扩展名不为空，则使用MIME类型的扩展名
  if (!fileExtensionFromName || (fileExtensionFromMime && fileExtensionFromMime !== fileExtensionFromName)) {
    finalExtension = fileExtensionFromMime;
    console.log('- 扩展名不匹配或文件名无扩展名，使用MIME类型的扩展名:', finalExtension);
  } else {
    console.log('- 使用文件名的扩展名:', finalExtension);
  }
  
  // 如果最终仍无法获取扩展名，则使用通用扩展名 'bin'
  if (!finalExtension) {
    finalExtension = 'bin';
    console.log('- 无法确定扩展名，使用通用扩展名: bin');
  }
  
  const fileExtension = finalExtension;
  console.log('- 最终使用的扩展名:', fileExtension);
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

  // 添加调试日志
  console.log('- Telegram API 响应:', JSON.stringify(tgResult, null, 2));

  if (!tgResult.ok) {
    return c.json({ error: 'Failed to upload to Telegram', details: tgResult }, 500);
  }

  const messageId = tgResult.result.message_id;
  
  // 检查 Telegram 返回的是文档、照片还是贴纸
  let fileId;
  if (tgResult.result.document) {
    fileId = tgResult.result.document.file_id;
    console.log('- 文件作为文档上传，file_id:', fileId);
  } else if (tgResult.result.photo && tgResult.result.photo.length > 0) {
    // 如果是照片，使用最高分辨率的照片的 file_id
    fileId = tgResult.result.photo[tgResult.result.photo.length - 1].file_id;
    console.log('- 文件作为照片上传，file_id:', fileId);
  } else if (tgResult.result.sticker) {
    fileId = tgResult.result.sticker.file_id;
    console.log('- 文件作为贴纸上传，file_id:', fileId);
  } else if (tgResult.result.video) {
    fileId = tgResult.result.video.file_id;
    console.log('- 文件作为视频上传，file_id:', fileId);
  } else if (tgResult.result.audio) {
    fileId = tgResult.result.audio.file_id;
    console.log('- 文件作为音频上传，file_id:', fileId);
  } else if (tgResult.result.voice) {
    fileId = tgResult.result.voice.file_id;
    console.log('- 文件作为语音消息上传，file_id:', fileId);
  } else if (tgResult.result.animation) {
    fileId = tgResult.result.animation.file_id;
    console.log('- 文件作为动画上传，file_id:', fileId);
  } else {
    console.error('- Telegram API 响应中没有找到文件ID');
    console.log('- 可用的响应字段:', Object.keys(tgResult.result));
    return c.json({ error: 'No file ID received from Telegram', details: tgResult }, 500);
  }
  
  const hashId = generateHash(12);

  await c.env.DB.prepare(
    `INSERT INTO images (filename, original_filename, telegram_message_id, telegram_file_id, size, hash_id) VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(newFilename, file.name, messageId, fileId, file.size, hashId).run();

  const imageUrl = `${new URL(c.req.url).origin}/file/${newFilename}`;
  return c.json({
    message: 'File uploaded successfully',
    url: imageUrl,
    hash_id: hashId,
    filename: newFilename,
    original_filename: file.name,
  });
};