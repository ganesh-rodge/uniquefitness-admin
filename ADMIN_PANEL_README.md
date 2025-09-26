# Unique Fitness Gym - Admin Panel

A modern, responsive admin panel for managing the Unique Fitness Gym operations.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS with custom dark theme
- **Routing**: React Router DOM v6
- **Language**: JavaScript (ES6+)

## Features

### 🎨 UI/UX
- **Dark Theme**: Consistent dark theme throughout (#1F2937 background)
- **Custom Colors**: Primary accent color #FACC15 for buttons and highlights
- **Responsive Design**: Fully responsive for desktop, tablet, and mobile
- **Smooth Animations**: Fade-in effects, hover transitions, and subtle animations
- **Collapsible Sidebar**: Mobile-friendly navigation

### 🔐 Authentication
- **Login Page**: Clean, centered login form
- **Protected Routes**: Route protection with authentication check
- **Demo Mode**: Use any email/password combination to login

### 📊 Dashboard
- **Stats Cards**: Display total members, active members, expiring soon, expired members
- **Quick Actions**: Fast access to common tasks
- **Recent Activity**: Timeline of gym activities
- **Refresh Data**: Manual data refresh capability

### 👥 Members Management
- **Member List**: Horizontal cards with search and filter functionality
- **Status Badges**: Color-coded membership status (active/expired/expiring)
- **Detailed View**: Comprehensive member modal with tabs:
  - Personal Information (email, phone, address, DOB, etc.)
  - Custom Workout Schedule (weekly workout plans)
  - Weight History (progress tracking with charts)
  - Photos (Aadhaar and live photos)

### 📢 Announcements
- **Announcement List**: Cards displaying all gym announcements
- **CRUD Operations**: Create, edit, and delete announcements
- **Rich Content**: Support for detailed announcement content
- **Timestamps**: Creation and update timestamps

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "c:\Users\ganes\OneDrive\Desktop\Unique Fitness\Project\frontend\admin"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The app will be available at `http://localhost:5173` or `http://localhost:5174`

### Login Credentials
- **Demo Mode**: Use any email and password combination
- Example: `admin@uniquefitness.com` / `password123`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with sidebar
│   ├── Sidebar.jsx     # Navigation sidebar
│   └── MemberModal.jsx # Member details modal
├── pages/              # Page components
│   ├── Login.jsx       # Authentication page
│   ├── Dashboard.jsx   # Dashboard with stats
│   ├── Members.jsx     # Members management
│   └── Announcements.jsx # Announcements management
├── context/            # React context providers
├── utils/              # Utility functions
└── assets/             # Static assets
```

## Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (xl)

## Color Scheme

- **Primary**: #FACC15 (Buttons, accents, highlights)
- **Background**: #1F2937 (Main background)
- **Surface**: #111827/#374151 (Cards, modals)
- **Text**: #FFFFFF (Primary text)
- **Secondary Text**: #9CA3AF (Muted text)

## Key Components

### Layout System
- Responsive sidebar that collapses on mobile
- Mobile hamburger menu overlay
- Consistent spacing and typography

### Dashboard Cards
- Stats visualization with trend indicators
- Hover effects and smooth transitions
- Color-coded status indicators

### Member Management
- Search and filter functionality
- Horizontal member cards with photos
- Detailed modal with tabbed interface
- Weight history visualization

### Announcements
- CRUD interface for announcement management
- Rich text content support
- Timestamp tracking

## Future Enhancements

- [ ] Real API integration
- [ ] Advanced member analytics
- [ ] Bulk member operations
- [ ] Export functionality
- [ ] Email notifications
- [ ] Advanced workout plan builder
- [ ] Member check-in system
- [ ] Payment tracking
- [ ] Equipment management
- [ ] Staff management

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Technologies Used
- **Vite**: Fast build tool and dev server
- **React**: UI library with hooks
- **React Router DOM**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **PostCSS**: CSS processing

---

**Built for Unique Fitness Gym** 🏋️‍♂️

*This admin panel provides a complete solution for managing gym operations with a modern, user-friendly interface.*