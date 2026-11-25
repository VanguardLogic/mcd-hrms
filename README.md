# MCD Workforce Accountability Platform (HRMS)

A civic-tech Human Resource Management System built for the **Municipal Corporation of Delhi (MCD)** to streamline workforce management, attendance tracking, payroll transparency, leave administration, recruitment, and public/employee grievance redressal.

---

## 🧪 Test Credentials (Try the App)

Use the following pre-configured accounts to explore each role in the platform:

### 🔑 Administrator Access
| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Main Admin** | `admin@mcd.in` | `12345678` | Full console, staff, payroll, appraisals, leaves, role settings |
| **Office Manager** | `vikram@mcd.in` | `demo123` | Admin department account (`MCD005`) |

### 👥 HR & Employee Demo Accounts
All demo staff accounts share the password **`demo123`**:

| Name | Role / Post | Department | Employee ID | Email | Password |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sonia Sharma** | HR Manager | HR | `MCD002` | `sonia@mcd.in` | `demo123` |
| **Raj Kumar** | Senior Developer | IT | `MCD001` | `raj@mcd.in` | `demo123` |
| **Amit Singh** | Accountant | Finance | `MCD003` | `amit@mcd.in` | `demo123` |
| **Priya Gupta** | UI Designer | IT | `MCD004` | `priya@mcd.in` | `demo123` |
| **Vikram Patel** | Office Manager | Admin | `MCD005` | `vikram@mcd.in` | `demo123` |

> **Tip:** Logged in as an Admin or HR Manager, you can also click **Demo Data** on the **Employees** page to regenerate these demo accounts if setting up a fresh Firebase project, or click any demo employee's name to copy their login email.

### 🌐 Public Portals (No Login Required)
Available directly from the sign-in screen:
- **MCD Careers (`Looking for a job? View Careers`)**: Browse open positions and submit candidate applications.
- **Public Grievance Redressal (`Report an Issue / Complaint`)**: Citizens can file complaints regarding municipal staff or services without logging in.

---

## 🚀 Key Features

### 🏛️ Governance & Accountability
- **Ward-Level Attendance**: Real-time Present, Absent, and Leave tracking with timestamps.
- **Role-Based Access Control**: Dedicated views and permissions for **Administrators**, **HR Managers**, and **Employees**.
- **Daily Workforce Deployment**: Assign field duties with reporting deadlines and live employee status updates.

### 📊 Administrative Console
- **Workforce Analytics**: Live headcount, department distribution, and governance indicators.
- **Payroll Management**: Automated Basic + DA + HRA monthly & annual compensation breakdown.
- **Performance Appraisals**: 5-point rating scale and structured manager feedback.
- **Leave Administration**: Configurable leave categories and approval/rejection workflows with admin notes.

### 🤝 Employee Self-Service & Recruitment
- **Employee Portal**: Personal ID card modal, attendance history, salary slips, leave applications, and task updates.
- **Transfers & Grievances**: Digital inter-departmental transfer requests and transparent complaint resolution.
- **Contractual Recruitment**: Create/manage job postings and review incoming candidate resumes.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5
- **Styling**: Bootstrap 5 + Custom Responsive CSS
- **Backend & Auth**: Firebase Authentication & Cloud Firestore
- **Hosting**: Firebase Hosting
- **CI & Maintenance**: GitHub Actions + Dependabot

---

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/VanguardLogic/mcd-hrms.git
cd mcd-hrms
npm install
```

### 2. Environment Configuration (Optional Override)
Copy `.env.example` to `.env` if connecting to your own Firebase project:
```bash
cp .env.example .env
```
Populate the `VITE_FIREBASE_*` keys from your Firebase Console (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for step-by-step setup).

### 3. Run Locally
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production bundle into `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint with zero-warning enforcement |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run check` | Run full lint + production build check |
| `npm run deploy` | Build and deploy to Firebase Hosting |

---

## 🤖 Automated Maintenance

This repository includes automated maintenance and quality gates under `.github/`:
- **Continuous Integration ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml))**: Automatically runs `npm ci`, `npm run lint`, and `npm run build` on every push and pull request to `main`.
- **Dependabot ([`.github/dependabot.yml`](./.github/dependabot.yml))**: Weekly automated dependency and security updates for both `npm` packages (grouped minor/patch updates) and GitHub Actions.
- **Scheduled Maintenance ([`.github/workflows/maintenance.yml`](./.github/workflows/maintenance.yml))**: Weekly scheduled build health verification, production `npm audit` & outdated package summary report, and automatic cleanup of stale issues/PRs.

---

## 👥 Project Team

- **Smarth & Kuber**: Frontend Development & UI Logic
- **Kuber**: Lead Developer — UI/UX, Backend & Documentation
- **Akshara & Bhaskar**: QA, Strategy, PPT, Testing & Improvements

---

*Built for the Future of Civic Governance.*
