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

4.  **Configure `wrangler.toml`:**
    Open `wrangler.toml` and replace `"YOUR_ACCOUNT_ID"` with your actual Cloudflare Account ID.

5.  **Create the D1 Database:**
    Run the following command to create the D1 database. This will also update your `wrangler.toml` with the `database_id`.
    ```bash
    npx wrangler d1 create tg-filebed-db
    ```

6.  **Apply database migrations:**
    To create the `images` table, apply the migrations to your local and remote databases.
    ```bash
    # Local
    npm run db:init

    # Remote
    npm run db:deploy
    ```

7.  **Set up secrets:**
    Use Wrangler to set the required secrets for authentication and Telegram integration.
    ```bash
    npx wrangler secret put USERNAME
    npx wrangler secret put PASSWORD
    npx wrangler secret put BOT_TOKEN
    npx wrangler secret put CHAT_ID
    ```
    You will be prompted to enter the value for each secret.

8.  **Start the development server (optional):**
    To test the application locally, run:
    ```bash
    npm run dev
    ```

9.  **Deploy to Cloudflare Workers:**
    Finally, deploy your application.
    ```bash
    npm run deploy
    ```

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