# AmarilloNegro.com - Portal Taxi Barcelona

## Original Problem Statement
Create a service portal for taxi drivers in Barcelona named "amarillonegro.com" with 8 service categories, service submission forms, newsletter signup, news section, and admin dashboard.

## User Personas
- **Taxi Drivers in Barcelona**: Primary users looking for services
- **Service Providers**: Businesses wanting to list their services
- **Admin**: Portal administrator managing submissions and subscribers

## Core Requirements

### 1. Main Directory (8 Categories)
- Bolsa de licencias de taxi (Taxi License Market)
- Gestorías (Management Services)
- Talleres Mecánicos (Mechanics)
- Elementos del taxi (Taxi Equipment Installers)
- Escuelas de taxistas (Taxi Driver Schools)
- Bolsa de trabajo (Job Board)
- Emisoras y APPS (Radio/Apps)
- Seguros para taxistas (Insurance)

### 2. Service Submission Form
- Form for businesses to submit their services
- Saves to MongoDB database
- Email notification to info@taxis.cat via Resend (requires API key)

### 3. Newsletter Signup
- Collects: name, email, phone
- Stores in database
- Mentions WhatsApp channel subscription

### 4. Static Content
- News section with static HTML pages
- 48 static company profile pages (6 per category) in `/app/frontend/public/fichas/`

### 5. Admin Dashboard
- Password protected (Password: `Amarillonegro1?`)
- Displays newsletter subscribers with phone numbers
- Displays submitted services with delete option
- Accessible via Admin link in footer

### 6. Design
- Barcelona taxi colors: yellow (#FFCC00) and black
- Brutalist design style
- Scroll-to-top on navigation

## Tech Stack
- **Frontend**: React
- **Backend**: FastAPI
- **Database**: MongoDB
- **Email**: Resend (optional, requires API key)

## What's Been Implemented ✅

### Backend
- `/api/newsletter-subscribe` - Saves name, email, phone (optional) to DB
- `/api/contact-submission` - Saves service submissions + sends email
- `/api/services` - CRUD for services
- `/api/admin/newsletter-subscriptions` - List subscribers (protected)
- `/api/admin/contact-submissions` - List/delete submissions (protected)
- `/api/admin/verify` - Admin authentication

### Frontend
- Homepage with category cards
- Category pages linking to 48 static company profiles
- News section with static articles
- Service submission form (Publicar Servicio) with scroll-to-top on success
- Newsletter signup in footer with:
  - Phone field is OPTIONAL
  - Message about WhatsApp channel if phone provided
- Admin dashboard with:
  - Login screen
  - Stats cards (services count, subscribers count)
  - Tabs for Services and Newsletter
  - Teléfono column in subscribers table
  - Delete functionality for services
- Logo reduced to h-10 size
- Yellow color #FFCC00 throughout

### Static Content
- 48 HTML company profiles in `/app/frontend/public/fichas/`
- Static news pages

## Database Schema (MongoDB)

### newsletter_subscriptions
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String (unique),
  "phone": String,
  "subscribed_at": DateTime
}
```

### contact_submissions
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "phone": String,
  "service_category": String,
  "business_name": String,
  "description": String,
  "website": String (optional),
  "submitted_at": DateTime
}
```

### services
```json
{
  "_id": ObjectId,
  "category": String,
  "name": String,
  "description": String,
  "contact_name": String,
  "email": String,
  "phone": String,
  "website": String,
  "address": String,
  "image_url": String,
  "created_at": DateTime
}
```

## Key Files
- `backend/server.py` - All API endpoints
- `frontend/src/pages/AdminDashboard.js` - Admin panel
- `frontend/src/components/Footer.js` - Newsletter form
- `frontend/src/pages/CategoryPage.js` - Category listings
- `frontend/public/fichas/` - 48 static company pages

## Credentials
- **Admin URL**: `/admin`
- **Password**: `Amarillonegro1?`

## 3rd Party Integrations
- **Resend**: Email notifications (requires RESEND_API_KEY in .env)

## Pending/Backlog
- None - All core features implemented

## Notes
- Database migrated from MySQL/MariaDB to MongoDB for stability
- Email functionality requires user to provide RESEND_API_KEY
