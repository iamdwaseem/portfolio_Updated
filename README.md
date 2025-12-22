# Portfolio Website with Admin Dashboard

A full-stack portfolio website with a powerful admin dashboard for managing your professional profile, projects, skills, timeline, and tools. Built with modern web technologies for optimal performance and user experience.

> 📦 **Ready to deploy?** Check out the [Deployment Guide](DEPLOYMENT.md) for step-by-step instructions!

## 🌟 Features

### Public Portfolio
- **Responsive Design** - Fully responsive across all devices (mobile, tablet, desktop)
- **Hero Section** - Eye-catching introduction with your name and bio
- **Projects Showcase** - Display your best work with descriptions, tech stack, and live/code links
- **Skills Display** - Visual representation of your technical skills with proficiency levels
- **Professional Timeline** - Showcase your career journey and education
- **Tools & Technologies** - Display the software and tools you use
- **Contact Form** - Allow visitors to send you messages directly

### Admin Dashboard
- **Secure Authentication** - JWT-based authentication with HTTP-only cookies
- **Protected Routes** - Admin pages accessible only to authenticated users
- **Collapsible Sidebar** - Responsive sidebar that works on all screen sizes
- **Dashboard Overview** - Quick stats showing total projects, skills, timeline entries, and tools
- **CRUD Operations** - Full Create, Read, Update, Delete functionality for:
  - Projects (with images, descriptions, tech stack, links)
  - Skills (with proficiency levels and icons)
  - Timeline entries (education, work experience)
  - Tools/Applications (with icons)
- **Profile Management** - Update your personal information, avatar, and resume
- **Password Management** - Change password and forgot password functionality

### Authentication Features
- **Login/Logout** - Secure user authentication
- **Session Persistence** - Stay logged in across browser sessions
- **Forgot Password** - Request password reset via email
- **Reset Password** - Secure password reset with token validation
- **Protected Admin Routes** - Automatic redirect to login for unauthenticated users

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Express File Upload
- **Cloud Storage**: Cloudinary (for images and files)
- **Email**: Nodemailer (for password reset emails)
- **Security**: bcrypt (password hashing), CORS

## 📁 Project Structure

```
Pr/
├── BACKEND/
│   ├── config/
│   │   └── config.env          # Environment variables
│   ├── controller/             # Request handlers
│   ├── database/               # Database connection
│   ├── middlewares/            # Auth, error handling
│   ├── models/                 # MongoDB schemas
│   ├── router/                 # API routes
│   ├── utils/                  # Helper functions
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
│
└── Frontend/
    └── portfolio-website-design/
        ├── app/                # Next.js app directory
        │   ├── admin/          # Admin dashboard pages
        │   ├── login/          # Login page
        │   ├── forgot-password/# Password reset request
        │   └── password/reset/ # Password reset page
        ├── components/         # React components
        │   ├── admin/          # Admin-specific components
        │   ├── portfolio/      # Public portfolio components
        │   └── ui/             # Reusable UI components
        ├── lib/                # Utilities and helpers
        │   ├── api.ts          # API client functions
        │   ├── auth-context.tsx# Authentication context
        │   └── http-client.ts  # HTTP client wrapper
        └── public/             # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or remote connection)
- Cloudinary account (for image storage)
- Gmail account (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Pr
   ```

2. **Backend Setup**
   ```bash
   cd BACKEND
   npm install
   ```

3. **Configure Backend Environment**
   
   Edit `BACKEND/config/config.env`:
   ```env
   PORT=4000
   MONGO_URI=mongodb://127.0.0.1:27017
   PORTFOLIO_URI=http://localhost:3000
   DASHBOARD_URI=http://localhost:3000
   
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   JWT_SECRET_KEY=your_secret_key
   JWT_EXPIRES=10d
   COOKIE_EXPIRES=10
   
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SERVICE=gmail
   SMTP_MAIL=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

4. **Frontend Setup**
   ```bash
   cd ../Frontend/portfolio-website-design
   npm install
   ```

5. **Configure Frontend Environment**
   
   Create `Frontend/portfolio-website-design/.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd BACKEND
   npm run dev
   ```
   Backend will run on `http://localhost:4000`

3. **Start Frontend Server**
   ```bash
   cd Frontend/portfolio-website-design
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 🔐 Default Credentials

**Email**: `esh@gmail.com`  
**Password**: `admin123`

> **Note**: Change these credentials after first login for security.

## 📡 API Endpoints

### Authentication
- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - User login
- `GET /api/v1/user/logout` - User logout
- `GET /api/v1/user/me` - Get current user
- `POST /api/v1/user/password/forgot` - Request password reset
- `PUT /api/v1/user/password/reset/:token` - Reset password

### Projects
- `GET /api/v1/projects/getAllProjects` - Get all projects
- `POST /api/v1/projects/addNewProject` - Add new project (auth required)
- `PUT /api/v1/projects/updateProject/:id` - Update project (auth required)
- `DELETE /api/v1/projects/deleteProject/:id` - Delete project (auth required)

### Skills
- `GET /api/v1/skill/getAllSkills` - Get all skills
- `POST /api/v1/skill/addSkill` - Add new skill (auth required)
- `PUT /api/v1/skill/updateSkill/:id` - Update skill (auth required)
- `DELETE /api/v1/skill/deleteSkill/:id` - Delete skill (auth required)

### Timeline
- `GET /api/v1/timeline/getall` - Get all timeline entries
- `POST /api/v1/timeline/add` - Add timeline entry (auth required)
- `PUT /api/v1/timeline/update/:id` - Update timeline entry (auth required)
- `DELETE /api/v1/timeline/delete/:id` - Delete timeline entry (auth required)

### Applications/Tools
- `GET /api/v1/softwareapplication/getall` - Get all applications
- `POST /api/v1/softwareapplication/add` - Add application (auth required)
- `PUT /api/v1/softwareapplication/update/:id` - Update application (auth required)
- `DELETE /api/v1/softwareapplication/delete/:id` - Delete application (auth required)

### Messages
- `POST /api/v1/message/send` - Send contact message

## 🎨 Customization

### Styling
- Modify `Frontend/portfolio-website-design/app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.ts`
- Customize UI components in `components/ui/`

### Content
- Update portfolio content through the admin dashboard
- Modify static content in component files
- Change color scheme and theme in CSS variables

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **HTTP-Only Cookies**: Prevents XSS attacks
- **CORS Protection**: Configured allowed origins
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Middleware-based route protection

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: Mobile (< 768px), Tablet (768px - 1024px), Desktop (> 1024px)
- Collapsible sidebar for admin panel
- Touch-friendly UI elements
- Optimized images and assets

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Frontend)
npx kill-port 3000

# Kill process on port 4000 (Backend)
npx kill-port 4000
```

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `config.env`
- Verify database name is correct

### Cloudinary Upload Errors
- Verify API credentials in `config.env`
- Check file size limits
- Ensure proper file format (images: jpg, png, svg)

### Email Not Sending
- Enable "Less secure app access" in Gmail (or use App Password)
- Verify SMTP credentials in `config.env`
- Check firewall/antivirus settings

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Created with ❤️ for showcasing professional portfolios

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- Cloudinary for image hosting
- MongoDB for the database solution
