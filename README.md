# Quick Blog

Mini blog frontend built with React, React Router, Tailwind CSS, TinyMCE, Axios, and Cloudinary upload support.

The app uses the provided public blog API for the home feed and a browser-based mock API for authentication, role-based access, post ownership, and user management. This keeps the frontend flow complete even when the provided backend does not expose user/auth endpoints.

## Features

- Register, login, logout
- Token and user persistence in `localStorage`
- Cross-tab auth sync with the `storage` event
- Protected routes and role-based redirects
- User/admin authorization
- Home page card grid with skeleton loading
- Search posts by title
- Create posts with a self-hosted TinyMCE editor
- Upload cover images to Cloudinary with an unsigned preset
- Delete posts with confirmation
- User-only post ownership view
- Admin-only all-posts view
- Admin-only user management
- Toggle user/admin role
- Delete users
- Dark/light theme with saved preference

## Demo Accounts

```txt
Admin
Email: admin@quickblog.dev
Password: admin123

User
Email: user@quickblog.dev
Password: user123
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

Add Cloudinary values:

```env
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

When Cloudinary is configured, cover images are uploaded to Cloudinary and the returned `secure_url` is stored with the created post.

If Cloudinary env values are missing, the app falls back to a local preview URL so the create-post flow can still be tested.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

- TinyMCE is self-hosted through the `tinymce` package and uses the GPL license mode, so no Tiny Cloud API key is required.
- The public backend used for the home feed does not include register/login/user-role APIs.
- Auth, role, ownership, local post creation, and user management are implemented with a mock API stored in `localStorage`.
- Remote public API posts are shown on the home page. Local mock posts are used for create/delete/ownership flows.
