import { Hono } from 'hono';
import { router } from './router';

const app = new Hono();

// Database initialization logic
app.use('*', async (c, next) => {
  if (!c.env.DB) {
    console.error("D1 database binding not found.");
    return c.text("Internal Server Error", 500);
  }

  // More robust database initialization using "IF NOT EXISTS"
  const migrationSql = `
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_filename TEXT,
      telegram_message_id INTEGER NOT NULL,
      telegram_file_id TEXT NOT NULL,
      size INTEGER NOT NULL,
      hash_id TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_hash_id ON images (hash_id);
  `;
  
  // D1 batch executes statements sequentially. This is idempotent.
  await c.env.DB.batch(migrationSql.split(';').filter(s => s.trim()).map(s => c.env.DB.prepare(s)));
  
  await next();
});

app.route('/', router);

export default app;