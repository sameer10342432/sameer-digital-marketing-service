# Sameer Digital Services

A professional mobile app (Expo React Native) for Muhammad Sameer's digital services business.

## Overview

This app showcases digital services (Graphic Design, SEO, Web Development, Google Ads, Facebook Ads, App Development, AI Services), allows potential clients to browse and submit inquiries, and provides an admin panel for managing those inquiries.

## Architecture

- **Frontend**: Expo Router (file-based routing), React Native, TypeScript
- **Backend**: Express.js (port 5000), in-memory storage
- **State**: React Query for API calls, AsyncStorage for admin token persistence

## File Structure

```
app/
  _layout.tsx              # Root layout with providers
  (tabs)/
    _layout.tsx            # 4-tab layout (Home, Services, About, Contact)
    index.tsx              # Home screen
    services.tsx           # Services list with expandable cards
    about.tsx              # About Muhammad Sameer
    contact.tsx            # Contact/inquiry form
  admin/
    _layout.tsx            # Admin stack layout
    index.tsx              # Admin login (default: admin/admin)
    dashboard.tsx          # Admin dashboard - view/delete inquiries, change credentials
  service/
    [category].tsx         # Service detail page

constants/
  colors.ts                # Dark theme: navy bg, electric blue accent
  services.ts              # All 7 service categories with data

server/
  index.ts                 # Express server setup
  routes.ts                # API routes (inquiries + admin auth)
  storage.ts               # In-memory storage (inquiries + admin credentials)
```

## API Routes

- `POST /api/admin/login` - Admin authentication, returns token
- `PUT /api/admin/credentials` - Update admin username/password (requires Bearer token)
- `GET /api/admin/inquiries` - Get all inquiries (requires Bearer token)
- `DELETE /api/admin/inquiries/:id` - Delete inquiry (requires Bearer token)
- `PATCH /api/admin/inquiries/:id/read` - Mark as read (requires Bearer token)
- `POST /api/inquiries` - Submit inquiry (public)

## Theme

Dark professional theme:
- Background: `#080C18` (deep dark navy)
- Surface: `#111827`
- Accent: `#4F8EFF` (electric blue)
- Cyan: `#00C9E0`
- Each service has its own accent color

## Admin

Default credentials: `admin` / `admin`
Admin can change credentials from the dashboard settings.
Token is stored in AsyncStorage and used as Bearer auth for all admin API calls.

## Services

7 categories: Graphic Design, SEO, Web Development, Google Ads, Facebook Ads, App Development, AI Services
