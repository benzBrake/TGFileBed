import { Hono } from 'hono';
import { router } from './router';

const app = new Hono();

// Database initialization logic
app.use('*', async (c, next) => {
  if (!c.env.DB) {
    console.error("D1 database binding not found.");
    return c.text("Internal Server Error", 500);
  }

  try {
    // Check if the table exists by trying to query it
    await c.env.DB.prepare("SELECT 1 FROM images LIMIT 1").first();
  } catch (e) {
    // If it fails, the table likely doesn't exist. Let's create it.
    console.log("`images` table not found, creating it...");
    const migrationSql = `
      DROP TABLE IF EXISTS images;
      CREATE TABLE images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        telegram_message_id INTEGER NOT NULL,
        telegram_file_id TEXT NOT NULL,
        size INTEGER NOT NULL,
        hash_id TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_hash_id ON images (hash_id);
    `;
    
    // D1 batch executes statements sequentially
    await c.env.DB.batch(migrationSql.split(';').filter(s => s.trim()).map(s => c.env.DB.prepare(s)));
    console.log("`images` table created successfully.");
  }
  
  await next();
});

app.route('/', router);

export default app;