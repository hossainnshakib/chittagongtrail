# Chittagong Trail Project

A Next.js exploration and journal web application for Chittagong trails.

## Environment Variables Configuration

Server-only configuration variables must be kept secure. Never commit real credentials or expose secrets via `NEXT_PUBLIC_*` variables.

### Local Development
Create a `.env` or `.env.local` file in the project root based on `.env.example`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/chittagong_trail"
AUTH_SECRET="your-secure-random-secret"
ADMIN_EMAIL="admin@chittagongtrail.com"
ADMIN_PASSWORD_HASH="$2a$12$..."
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_SITE_URL="https://chittagongtrail.com"
```

### Production Deployment (cPanel Node.js & MySQL)
1. Configure production environment variables directly within the cPanel Node.js application manager / environment settings.
2. Set `DATABASE_URL` to your cPanel MySQL connection string.
3. Set `AUTH_SECRET` using a securely generated random string.
4. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`.
5. Set `CLOUDINARY_*` variables for production media handling.

### AUTH_SECRET Generation
On your local machine, generate a secure secret using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```
Place the generated value into your local environment file and separately into cPanel.

## Media Infrastructure (Cloudinary)
Uploads are routed securely to Cloudinary under the `chittagong-trail/` namespace (`chittagong-trail/trails`, `chittagong-trail/journal`, `chittagong-trail/general`).
