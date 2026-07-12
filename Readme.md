# Nobomallika Model Academy - School Management System

A modern, responsive, and SEO-optimized School Management System and public information portal for Nobomallika Model Academy (Sector-5, Uttara, Dhaka). The platform consists of a dynamic public frontend, student online registration, and a secure administration panel.

---

## 🌟 Key Features

### 1. 🖥️ Public Frontend Portal
* **Homepage**: Interactive slider hero banner, scrolling news ticker, history card, photo gallery, headmaster's statement, and statistics.
* **Teachers Directory**: Responsive grid/table list of teachers with search functionality.
* **Managing Committee**: Grid presentation of committee members including their messages (বাণী).
* **Notice Board**: Paginated/filtered board of events, exams, and academic announcements.
* **Results Portal**: Searchable list of examination results with class filters and secure PDF download links.
* **Online Registration**: Easy-to-use admission form with dynamic validation and sweetalert notifications.

### 2. 🔐 Administrative Dashboard (Role-Based Access)
* **Access Control**: Role-based routing (Admin vs. Viewer). Admin role has full CRUD capabilities; Viewer role is read-only.
* **Notice Board Management**: Create, edit, and delete notices.
* **Teachers Database Management**: Add, update, and remove teachers (profile pictures, contact info, qualifications).
* **Managing Committee Management**: Add, edit, and delete committee members with custom display sorting order.
* **Exam Results Management**: Upload exam results, associate them with specific classes/years, attach PDFs, and modify metadata.

### 3. 📱 Mobile & Accessibility Redesigns
* **Notice & Result Cards**: Stacked grid layouts specifically optimized for screens `<768px`.
* **Contrast Standards**: WCAG 2.2 AA compliant button styling, correcting transparent text overlaps on light background card elements.

### 4. 🚀 SEO Optimization
* **Structured Data**: JSON-LD Schema (Local School definition) implemented on the homepage.
* **Metadata**: Full Open Graph (OG) and Twitter Card tags configured across public routes.
* **Crawl Controls**: Active `robots.txt` configuration and automated `sitemap.xml` index mapping.

---

## 🛠️ Technology Stack

* **Frontend**: Vanilla HTML5, Vanilla CSS3 (custom CSS variables & tokens), Vanilla JavaScript (ES6+).
* **Backend**: Node.js, Express.js.
* **Database & ORM**: MySQL database, Sequelize ORM.
* **Authentication**: JSON Web Token (JWT) authorization middleware.
* **File Uploads**: Multer middleware.

---

## 📁 Directory Structure

```
├── admin/                  # Administrative Dashboard HTML pages
│   ├── index.html          # Admin Login & Panel Dashboard
│   ├── notices.html        # Notice board editor
│   ├── teachers.html       # Teacher manager
│   ├── results.html        # Result uploader & manager
│   └── ...
├── assets/                 # Image assets, logos, and uploaded files
├── css/                    # Frontend stylesheet (style.css, admin.css)
├── js/                     # Frontend Javascript routers and utilities
├── backend/                # Express backend application
│   ├── config/             # DB connection credentials
│   ├── controllers/        # Express route controller actions
│   ├── models/             # Sequelize database models
│   ├── routes/             # API routing endpoints
│   ├── middleware/         # Auth & upload middleware
│   ├── seed.js             # Demo database seeder
│   └── server.js           # Server runner
├── robots.txt              # SEO crawler index instructions
├── sitemap.xml             # SEO search sitemap index
└── Readme.md               # Documentation guide
```

---

## ⚙️ Getting Started & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+)
* [MySQL Server](https://www.mysql.com/)

### Database Configuration
1. Start your local MySQL server.
2. Create a database named `school_db`:
   ```sql
   CREATE DATABASE school_db;
   ```
3. Navigate to the `backend` folder and create a `.env` file containing:
   ```env
   PORT=5000
   NODE_ENV=development
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password_here
   MYSQL_DATABASE=school_db
   JWT_SECRET=your_jwt_secret_token_here
   ```

### Installation
1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Seed database records (creates mock data and default users):
   ```bash
   node seed.js
   ```
   * *Admin User*: Username: `admin` | Password: `password123`
   * *Viewer User*: Username: `user` | Password: `pass123`

3. Start the Express development server:
   ```bash
   node server.js
   ```

4. Open the public portal:
   * Launch `index.html` on your browser directly or host the root folder using any static server (e.g. Live Server).
