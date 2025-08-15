export const handleFile = async (c) => {
  const { filename } = c.req.param();
  const image = await c.env.DB.prepare(`SELECT telegram_file_id FROM images WHERE filename = ?`).bind(filename).first();

  if (!image) {
    return c.json({ error: 'Image not found' }, 404);
  }

  // This part is a bit tricky with Cloudflare Workers.
  // We cannot directly proxy the file from Telegram's Bot API.
  // Instead, we would need to get the file path and then construct the file URL.
  // The approach below is a simplified version that illustrates the concept.
  // For a production-ready solution, you would need to handle the file path logic.

  const tgFileResponse = await fetch(
    `https://api.telegram.org/bot${c.env.BOT_TOKEN}/getFile`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_id: image.telegram_file_id }),
    }
  );

  const tgFileResult = await tgFileResponse.json();

  if (!tgFileResult.ok || !tgFileResult.result.file_path) {
    return c.json({ error: 'Failed to retrieve file path from Telegram' }, 500);
  }

  const filePath = tgFileResult.result.file_path;
  const fileUrl = `https://api.telegram.org/file/bot${c.env.BOT_TOKEN}/${filePath}`;

  // Fetch the actual file and stream it back.
  const imageResponse = await fetch(fileUrl);
  return new Response(imageResponse.body, {
    headers: {
      'Content-Type': imageResponse.headers.get('Content-Type'),
      'Content-Length': imageResponse.headers.get('Content-Length'),
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
    }
  });
};