# 🏨 Solvex Hotel Booking Frontend

This is the frontend application for the **Solvex Hotel Booking Manager**, built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/). It provides a interface for hotel booking operations, including real-time data synchronization, reservation management, and seamless integration with the backend services.

---

## 🚀 Features

- 📦 Modern build system with Vite
- 🌐 API integration with backend for booking data
- 🔐 Authentication (Passport / JWT integration)
- 📝 Code linting and formatting via ESLint + Prettier

---

## 🛠️ Tech Stack

- **Framework:** React (with Hooks)
- **Tooling:** Vite
- **Routing:** React Router v6+
- **Auth:** JWT tokens (via backend)
- **CI/CD:** GitHub Actions (optional)
- **Deployment:** PM2+

---

## ✅ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) >= 18.x
- [Yarn](https://yarnpkg.com/) >= 1.22
- Git CLI

---

## 📦 Getting Started

Clone the repository:

```bash
git clone git@github.com:your-org/hotel-booking-frontend.git
cd hotel-booking-frontend
```

Install dependencies:

```bash
yarn install
```

Setup PM2:

```bash
pm2 deploy production setup
```

##📜 Scripts ##
Start the dev server:

```bash
yarn dev
```

Build for production

```bash
yarn build
```

PM2 deployment - run locally

```bas
pm2 deploy ecosystem.config.cjs production
```
