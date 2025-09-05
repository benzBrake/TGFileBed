import { Hono } from 'hono';
import { basicAuth } from './auth';
import { handleUpload } from './handlers/upload';
import { handleList } from './handlers/list';
import { handleDelete, handleDeleteAll } from './handlers/delete';
import { handleFile } from './handlers/image';
import { uploadPage } from './views/upload';
import { managePage } from './views/manage';
import { extIsImage } from './utils';

export const router = new Hono();

// Public route for displaying images
router.get('/file/:filename', handleFile);
router.get('/images/:filename', handleFile);

// Page for uploading images, protected by basic auth
router.get('/', basicAuth, (c) => {
    const siteTitle = c.env.SITE_TITLE || 'TGFileBed';
    return c.html(uploadPage
        .replace(/{siteTitle}/g, siteTitle)
    );
});

// API endpoint for uploading files, protected by basic auth
router.post('/upload', basicAuth, handleUpload);

// API endpoint to list all images, protected by basic auth
router.get('/list', basicAuth, handleList);

// Page for managing images, protected by basic auth
router.get('/manage.html', basicAuth, async (c) => {
    const page = parseInt(c.req.query('page') || '1', 10);
    const limit = 20;
    const offset = (page - 1) * limit;

    let { results } = await c.env.DB.prepare(
        `SELECT * FROM images ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).bind(limit, offset).all();

    results = results.map((row) => {
        row.isImage = extIsImage(row.filename);
        let e = row.filename.split('.');
        if (e.length > 1) {
            row.ext = e[e.length - 1];
        } else {
            row.ext = '';
        }
        return row;
    });

    const { total } = await c.env.DB.prepare(`SELECT COUNT(*) as total FROM images`).first();
    const totalPages = Math.ceil(total / limit);

    return c.html(managePage(results, page, totalPages)
        .replace('{siteTitle}', c.env.SITE_TITLE || 'TGFileBed')
    );
});

// API endpoint to delete all images, protected by basic auth
router.get('/delete/all', basicAuth, handleDeleteAll);

// API endpoint to delete a specific image, protected by basic auth
router.get('/delete/:hashid', basicAuth, handleDelete);
