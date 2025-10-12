# 🏢 Proservice Indonesia - Toilet Checklist System

Sistem monitoring dan tracking kebersihan toilet berbasis web dengan fitur real-time analytics, photo documentation, dan multi-role access management.

![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-2.75-3ecf8e)

## ✨ Features

### 🎯 Core Features
- **Multi-Role Authentication** - Admin, Supervisor, dan Cleaner dengan permission berbeda
- **Real-time Monitoring** - Dashboard checklist yang update secara real-time
- **Photo Documentation** - Upload bukti foto dengan Cloudinary integration
- **Scoring System** - Sistem penilaian 0-100 dengan color-coded indicators
- **Analytics Dashboard** - Visualisasi data dengan charts dan statistics
- **Approval Workflow** - Supervisor dapat approve dan validate data

### 📊 Dashboard Features
- Monthly checklist grid dengan 28 lokasi x 28 hari
- Color-coded scoring (Excellent: 95+, Good: 85-94, Fair: 75-84, Poor: <75)
- Photo modal preview dengan timestamp
- Export to Excel functionality
- Real-time average score calculation

### 👥 User Roles
| Role | Permissions |
|------|-------------|
| **Admin** | Full access: manage users, view all data, approve, export |
| **Supervisor** | View dashboard, analytics, photos, approve data |
| **Cleaner** | Upload photos, input scores, view own submissions |

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Custom Glass Morphism Design
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Cloudinary (Image CDN)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Supabase account
- Cloudinary account

## ⚙️ Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd toilet-checklist
```

### 2. Install Dependencies
```bash
npm install
# atau
yarn install
```

### 3. Environment Variables

Create `.env.local` file di root folder:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Supabase Setup

#### A. Create Tables

```sql
-- Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'supervisor', 'cleaner')) DEFAULT 'cleaner',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checklist Data Table
CREATE TABLE checklist_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  photo_url TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(location, day, month, year)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Checklist data is viewable by authenticated users"
ON checklist_data FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Cleaners and admins can insert checklist data"
ON checklist_data FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('cleaner', 'admin')
  )
);
```

#### B. Create Storage Bucket (Optional - if using Supabase Storage)

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('toilet-photos', 'toilet-photos', true);

-- Storage policy
CREATE POLICY "Anyone can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'toilet-photos');
```

### 5. Cloudinary Setup

1. Sign up di [Cloudinary](https://cloudinary.com)
2. Buat upload preset:
   - Settings → Upload → Add upload preset
   - Signing Mode: **Unsigned**
   - Folder: `proservice-toilet`
   - Copy preset name ke `.env.local`

## 🏃 Running the App

### Development Mode
```bash
npm run dev
# atau
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
# atau
yarn build
yarn start
```

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@proservice.com | admin123 |
| Supervisor | supervisor@proservice.com | super123 |
| Cleaner | cleaner@proservice.com | clean123 |

## 📁 Project Structure

```
toilet-checklist/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx              # Main checklist
│   │   ├── analytics/page.tsx    # Analytics dashboard
│   │   ├── photos/page.tsx       # Photo management
│   │   ├── users/page.tsx        # User management (admin)
│   │   └── layout.tsx
│   ├── layout.tsx
│   ├── page.tsx                  # Landing page
│   └── globals.css
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── ProtectedLayout.tsx
│   │   └── RoleGuard.tsx
│   ├── ChecklistTable.tsx
│   ├── Controls.tsx
│   ├── Header.tsx
│   ├── PhotoModal.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── auth/
│   │   └── auth-context.tsx      # Auth provider
│   ├── database/
│   │   └── checklist.ts          # Database functions
│   ├── storage/
│   │   ├── cloudinary-upload.ts  # Cloudinary integration
│   │   └── image-upload.ts       # Image upload utilities
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── public/
├── .env.local                    # Environment variables
├── next.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🎨 Key Components

### ChecklistTable
Grid 28 lokasi x 28 hari dengan color-coded scoring dan photo indicators.

### PhotoModal
Modal untuk preview foto dengan metadata (score, timestamp, location).

### Controls
Filter bulan dan tombol export Excel.

### Sidebar (Upload)
Form upload foto dengan location selector dan score input.

### Analytics Dashboard
Statistics cards, score distribution charts, dan compliance metrics.

## 🔐 Authentication Flow

1. User login melalui Supabase Auth
2. Profile data di-fetch dari `profiles` table
3. Role-based routing dan permission checking
4. Protected routes dengan `ProtectedLayout`
5. Role guards untuk specific features

## 📸 Image Upload Flow

1. User select image file
2. Validate file (type, size)
3. Upload ke Cloudinary
4. Get public URL
5. Save URL + metadata ke database
6. Display di checklist grid

## 🎯 Scoring System

| Score | Category | Color |
|-------|----------|-------|
| 95-100 | Excellent | Blue |
| 85-94 | Good | Green |
| 75-84 | Fair | Yellow |
| 0-74 | Poor | Red |

## 📊 Database Schema

### profiles
- id (UUID, PK)
- email (TEXT)
- full_name (TEXT)
- role (TEXT: admin/supervisor/cleaner)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)

### checklist_data
- id (UUID, PK)
- location (TEXT)
- day, month, year (INTEGER)
- score (INTEGER 0-100)
- photo_url (TEXT)
- uploaded_by (UUID, FK → profiles)
- approved_by (UUID, FK → profiles)
- approved_at (TIMESTAMP)
- created_at, updated_at (TIMESTAMP)
- UNIQUE(location, day, month, year)

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Add environment variables di Vercel dashboard
4. Deploy!

### Environment Variables di Vercel
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
```

## 🛠️ Development Tips

### Add New Location
Edit `lib/utils.ts`:
```typescript
export const locations = [
  'Toilet Lobby',
  'Your New Location', // Add here
  // ...
];
```

### Add New Role
1. Update database enum
2. Update TypeScript type di `types/index.ts`
3. Update permission checks di components

### Custom Scoring Logic
Edit `lib/utils.ts` → `getCellColor()` function

## 📝 Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 🐛 Troubleshooting

### Supabase Connection Error
- Check `.env.local` credentials
- Verify Supabase project is active
- Check RLS policies

### Image Upload Fails
- Verify Cloudinary credentials
- Check upload preset is unsigned
- Ensure file size < 10MB

### Build Errors
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## 📄 License

Copyright © 2025 Proservice Indonesia. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

Untuk pertanyaan atau support, silakan hubungi:
- Email: support@proservice.co.id
- Website: [proservice.co.id](https://proservice.co.id)

---

**Built with ❤️ by Proservice Indonesia**