# NUS Freedive Website

## 📌 Project Overview

This is the official code repository for the **NUS Freedive** website. It is designed to streamline and digitize club administrative processes, such as:

* Member registration
* Session sign-ups
* Attendance tracking
* Scheduling sessions and IC members

---

## ⚙️ Tech Stack

This is a **full-stack TypeScript project** built using the following technologies:

| Layer        | Tech Stack                                      |
| ------------ | ----------------------------------------------- |
| **Frontend** | Next.js 16, Redux, React Query, Tailwind CSS v3 |
| **Backend**  | Next.js API Routes, Supabase, Prisma ORM        |
| **Database** | Supabase Postgres                               |
| **Auth**     | Supabase Auth                                   |

This project is based on the official [Supabase Next.js Starter Template](https://vercel.com/templates/next.js/supabase).

---

## 🖼️ Frontend

The frontend is built entirely with **Next.js App Router** and styled using **Tailwind CSS**.

State management and data fetching are handled by a combination of:

* **Redux Toolkit** – for global client-side state
* **React Query** – for caching and async server-state management

---

## 🗄️ Backend & API

The backend leverages **Next.js API routes** to run server-side operations, including complex database queries and session validation.

Authentication and session management are handled through **Supabase Auth**, using the built-in proxy (middleware) provided in the Supabase starter template.

---

## 🛢️ Database and ORM

* The database is managed through **Supabase Postgres**.
* **Prisma ORM** is used for modeling, schema management, and database migrations.
* **Important**: We use **Prisma migrations** to manage the schema. Avoid making manual changes through the Supabase web GUI (see below).

---

## ⚠️ Do Not Mix Prisma and Supabase GUI

While Supabase allows schema changes via its GUI, **this should be avoided** to prevent schema drift and inconsistencies with Prisma.

### Why Use Prisma?

1. **Version Control**: Prisma migrations are tracked in Git, ensuring full traceability and collaboration.
2. **Portability**: If the project ever moves away from Supabase, Prisma allows us to migrate to other databases with minimal friction.

### Risks of Mixing GUI and Prisma

* Direct schema changes on Supabase will **cause a drift**, making Prisma unable to apply future migrations without a full reset.
* Resolving drift is **non-trivial** and may involve:

  * Resetting the database (resulting in data loss)
  * Creating a new base schema and losing migration history

**In summary**: *All schema modifications should be done using Prisma and committed via Git to ensure consistency.*

---

## 🛠️ Getting Started

### Prerequisites

* Node.js + Yarn (Install yarn [here](https://classic.yarnpkg.com/lang/en/docs/install/))
* Access to the `.env` file (ask a team member)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/jasonchristopher21/freedive-website.git

# 2. Navigate into the directory
cd freedive-website

# 3. Install dependencies
yarn install

# 4. Setup Prisma (ALT: yarn prisma generate)
yarn build

# 5. Start the development server
yarn dev
```

---

## 🚀 Deployment

This project can be deployed using **Vercel**, **Netlify**, or any other Next.js-compatible hosting service.

Make sure to:

* Set up the same `.env` variables on the platform
* Ensure your Supabase and Prisma project URL and keys are properly configured
