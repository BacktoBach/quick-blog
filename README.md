# Quick Blog

Mini blog frontend built with React, React Router, Tailwind CSS, TinyMCE, Axios, Cloudinary upload, JWT auth, and role-based access.

## Features

- Register, login, logout
- JWT token and user persistence in `localStorage`
- Cross-tab auth sync with the `storage` event
- Protected routes and role-based redirects
- User/admin authorization
- Home page card grid with skeleton loading
- Search posts by title
- Create posts with a self-hosted TinyMCE editor
- Upload cover images directly to Cloudinary
- Delete posts with confirmation
- User-only post ownership view with `GET /posts?author=<userId>`
- Admin-only all-posts view
- Admin-only user management
- Toggle user/admin role
- Delete users
- Dark/light theme with saved preference

## API

Default API base URL:

```txt
https://api-blog-af3u.onrender.com/api
```

Auth header:

```txt
Authorization: Bearer <accessToken>
```

Main backend routes:

```txt
POST   /auth/register
POST   /auth/login
GET    /auth/me
GET    /posts
GET    /posts?author=<userId>
GET    /posts/:id
POST   /posts
DELETE /posts/:id
GET    /users
DELETE /users/:id
PUT    /users/:id/role
```

Cloudinary upload is handled directly from the frontend:

```txt
POST https://api.cloudinary.com/v1_1/<cloud_name>/image/upload
```

## Tech Stack

- React
- React Router
- Tailwind CSS
- Axios
- TinyMCE
- Cloudinary unsigned upload
- Vite

## Setup

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env
```

Environment values:

```env
VITE_API_URL=https://api-blog-af3u.onrender.com/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

Start the app:

```bash
npm run dev
```

## Cloudinary Setup

1. Create or login to a Cloudinary account.
2. Open Settings.
3. Go to Upload.
4. Create an unsigned upload preset.
5. Copy the cloud name and preset name into `.env`.
6. Restart the dev server after changing `.env`.

When Cloudinary is configured, cover images are uploaded to Cloudinary and the returned `secure_url` is sent to the posts API.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

- TinyMCE is self-hosted through the `tinymce` package and uses GPL license mode, so no Tiny Cloud API key is required.
- Logout is handled on the frontend by clearing `accessToken` and `user` from `localStorage`.
