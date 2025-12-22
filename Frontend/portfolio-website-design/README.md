# Portfolio Website with Admin Dashboard

A modern, premium portfolio website with a full-featured admin dashboard built with Next.js, React, and TypeScript.

## Features

### Public Portfolio
- **Hero Section**: Professional introduction with animated gradient effects
- **Projects Showcase**: Grid layout of your best work with live demos and GitHub links
- **Skills Display**: Visual representation of technical skills with proficiency levels
- **Timeline**: Career journey and educational background
- **Tools & Technologies**: Showcase of development tools and frameworks
- **Contact Form**: Get in touch section with form submission

### Admin Dashboard
- **Profile Management**: Update personal information, bio, and contact details
- **Projects CRUD**: Add, edit, and delete portfolio projects
- **Skills Management**: Manage technical skills with proficiency levels
- **Timeline Editor**: Update career and education milestones
- **Tools Manager**: Add and organize development tools

## Getting Started

### Installation

1. Clone or download this project
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Accessing the Admin Panel

### Login Credentials

**URL**: [http://localhost:3000/login](http://localhost:3000/login)

**Default Admin Credentials**:
- Email: `admin@example.com`
- Password: `admin123`

### Admin Dashboard Routes

After logging in, you can access:
- **Dashboard Overview**: `/admin`
- **Profile Management**: `/admin/profile`
- **Projects Management**: `/admin/projects`
- **Skills Management**: `/admin/skills`
- **Timeline Management**: `/admin/timeline`
- **Tools Management**: `/admin/tools`

### Admin Features

1. **Profile Management**
   - Update name, title, bio
   - Change email and location
   - Update social media links (GitHub, LinkedIn, Twitter)

2. **Projects Management**
   - Add new projects with title, description, image
   - Add technologies used
   - Include live demo and GitHub repository links
   - Edit or delete existing projects

3. **Skills Management**
   - Add technical skills with categories
   - Set proficiency levels (0-100)
   - Edit or remove skills

4. **Timeline Management**
   - Add career positions or education entries
   - Set date ranges and descriptions
   - Manage your professional journey

5. **Tools Management**
   - Add development tools and technologies
   - Categorize tools (Language, Framework, Database, etc.)
   - Include tool logos and descriptions

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard pages
│   │   ├── layout.tsx      # Admin layout with sidebar
│   │   ├── page.tsx        # Dashboard overview
│   │   ├── profile/        # Profile management
│   │   ├── projects/       # Projects management
│   │   ├── skills/         # Skills management
│   │   ├── timeline/       # Timeline management
│   │   └── tools/          # Tools management
│   ├── login/              # Login page
│   ├── page.tsx            # Public portfolio homepage
│   └── layout.tsx          # Root layout
├── components/
│   ├── admin/              # Admin-specific components
│   │   ├── admin-sidebar.tsx
│   │   ├── project-dialog.tsx
│   │   ├── skill-dialog.tsx
│   │   ├── timeline-dialog.tsx
│   │   └── tool-dialog.tsx
│   ├── portfolio/          # Public portfolio sections
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── api.ts             # Mock API functions (CRUD operations)
│   ├── auth-context.tsx   # Authentication context
│   └── types.ts           # TypeScript type definitions
└── public/                # Static assets (images, icons)
```

## Customization

### Changing Login Credentials

Edit the mock authentication in `lib/auth-context.tsx`:

```tsx
if (email === 'admin@example.com' && password === 'admin123') {
  // Change email and password here
}
```

### Adding Real Backend

Currently, the app uses mock data stored in localStorage. To add a real backend:

1. Replace mock API functions in `lib/api.ts` with real API calls
2. Integrate a database (Supabase, Neon, etc.)
3. Implement proper authentication (NextAuth.js, Supabase Auth, etc.)
4. Update the auth context to use real sessions

### Styling

- Colors are defined in `app/globals.css` using CSS variables
- The theme uses a black and white color scheme with soft off-white backgrounds
- Customize by modifying the CSS variables in the `@theme` section

## Notes

- This is a mock implementation using localStorage for data persistence
- For production use, integrate a real database and authentication system
- All images are placeholders - replace with your actual project images
- Contact form submissions are currently logged to console only

## Support

If you need help or have questions, refer to the Next.js documentation at [nextjs.org/docs](https://nextjs.org/docs).

## License

This project is open source and available for personal and commercial use.
