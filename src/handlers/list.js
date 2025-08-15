export const handleList = async (c) => {
  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = parseInt(c.req.query('limit') || '20', 10);
  const offset = (page - 1) * limit;

  const { results } = await c.env.DB.prepare(
    `SELECT filename, size, hash_id, created_at FROM images ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).bind(limit, offset).all();

  const { total } = await c.env.DB.prepare(`SELECT COUNT(*) as total FROM images`).first();
  const totalPages = Math.ceil(total / limit);

  return c.json({
    images: results.map(image => ({
      ...image,
      url: `${new URL(c.req.url).origin}/images/${image.filename}`
    })),
    page,
    limit,
    totalPages,
    totalImages: total
  });
};