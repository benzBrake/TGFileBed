import { extIsImage } from "../utils";

export const handleList = async (c) => {
  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = parseInt(c.req.query('limit') || '20', 10);
  const offset = (page - 1) * limit;

  const { results } = await c.env.DB.prepare(
    `SELECT filename, original_filename, size, hash_id, created_at FROM images ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).bind(limit, offset).all();

  const { total } = await c.env.DB.prepare(`SELECT COUNT(*) as total FROM images`).first();
  const totalPages = Math.ceil(total / limit);

  return c.json({
    images: results.map(image => {

      return {
        ...image,
        isImage : extIsImage(image.filename),
        url: `${new URL(c.req.url).origin}/${isImage ? 'images' : 'file'}/${image.filename}`
      };
    }),
    page,
    limit,
    totalPages,
    totalImages: total
  });
};