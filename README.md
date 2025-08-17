# Telegram Filebed on Cloudflare Workers

This project provides a self-hosted image hosting service using Telegram as storage, running on Cloudflare Workers with D1 as the database.

## Features

- File upload via web interface and API
- Image listing with pagination
- Image deletion (single or all)
- Basic Authentication protection for all management endpoints
- Easy deployment with Wrangler

## Prerequisites

- A Cloudflare account
- Node.js and npm installed
- A Telegram Bot and its token
- A Telegram Chat ID where the bot has permission to send messages

## Setup and Deployment

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd tg-filebed
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Log in to Wrangler:**
    ```bash
    npx wrangler login
    ```

For detailed instructions on creating the database, running migrations, and deploying the application, please see the [Deployment Guide](DEPLOYMENT.md).

After deployment, you can access your filebed at the URL provided by Wrangler.

## API Endpoints

-   `GET /`: The file upload page.
-   `POST /upload`: The file upload API endpoint.
-   `GET /list`: Lists all uploaded images (JSON response).
-   `GET /manage`: The image management page with pagination.
-   `GET /delete/:hashid`: Deletes a specific image.
-   `GET /delete/all`: Deletes all images.
-   `GET /images/:filename`: Serves the uploaded image.

All management endpoints (`/`, `/upload`, `/list`, `/manage`, `/delete/*`) are protected by Basic Authentication.

## Support

If you find this project helpful, consider buying me a coffee:

[![Buy me a coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/buyryanacoffie)