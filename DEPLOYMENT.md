# Deployment Guide

This guide provides step-by-step instructions for deploying the TG-FileBed application to Cloudflare Workers.

## Prerequisites

- You have a Cloudflare account.
- You have `npm` and `npx` installed.
- You have authenticated Wrangler with your Cloudflare account (`npx wrangler login`).

## Step 1: Create the D1 Database

You need to create two databases: one for production and one for local development.

1.  **Create the production database:**
    ```sh
    npx wrangler d1 create tg-filebed-db
    ```

2.  **Create the development database:**
    ```sh
    npx wrangler d1 create tg-filebed-db-dev
    ```

## Step 2: Initialize the Database Schema

After creating the databases, you need to apply the initial schema from the migration file.

1.  **Initialize the production database:**
    ```sh
    npx wrangler d1 execute tg-filebed-db --file=./migrations/0000_create_images_table.sql
    ```

2.  **Initialize the development database (for local testing):**
    ```sh
    npx wrangler d1 execute tg-filebed-db-dev --local --file=./migrations/0000_create_images_table.sql
    ```

## Step 3: Configure `wrangler.toml`

You must add the unique `database_id` for each database to your `wrangler.toml` file.

1.  **Get the production database ID:**
    ```sh
    npx wrangler d1 info tg-filebed-db
    ```
    Copy the "UUID" value from the output.

2.  **Get the development database ID:**
    ```sh
    npx wrangler d1 info tg-filebed-db-dev
    ```
    Copy the "UUID" value from the output.

3.  **Update `wrangler.toml`:**
    Open the `wrangler.toml` file and fill in the `database_id` fields for both the `production` and `dev` environments.

    ```toml
    # wrangler.toml

    # ... other configurations ...

    [env.production]
    [[env.production.d1_databases]]
    binding = "DB"
    database_name = "tg-filebed-db"
    # You must specify the database_id for deployments.
    # Run `npx wrangler d1 info tg-filebed-db` to get the id.
    database_id = "YOUR_PRODUCTION_DATABASE_ID" # <-- Paste the ID here

    # ... other configurations ...

    [env.dev]
    [[env.dev.d1_databases]]
    binding = "DB"
    database_name = "tg-filebed-db-dev"
    database_id = "YOUR_DEVELOPMENT_DATABASE_ID" # <-- Paste the ID here
    
    # ... other configurations ...
    ```

## Step 4: Configure Secrets

Set the required secrets for your application. These are sensitive values that should not be committed to your repository.

```sh
npx wrangler secret put BOT_TOKEN
npx wrangler secret put CHAT_ID
npx wrangler secret put USERNAME
npx wrangler secret put PASSWORD
```
Wrangler will prompt you to enter the value for each secret.

## Step 5: Deploy the Application

Once everything is configured, you can deploy your application.

```sh
npx wrangler deploy