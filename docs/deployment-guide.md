# Querify Deployment Guide

This guide walks you through deploying **Querify** to the cloud:
- **Frontend (React + Vite):** Deployed to **Vercel** (Global CDN, free, custom domain, automatic HTTPS).
- **Backend (Spring Boot 3 + Java):** Deployed to **Render.com** (Free Web Service) or **Railway.app**.

---

## Architecture Overview

```
                      +-----------------------------+
                      |       User's Browser        |
                      +--------------+--------------+
                                     |
               HTTPS (Static Assets) | HTTPS (API Calls)
                                     v
       +-----------------------------+-----------------------------+
       |                                                           |
       v                                                           v
+--------------+                                            +--------------+
|    VERCEL    |                                            |  RENDER.COM  |
| Frontend CDN |                                            | Spring Boot  |
| (React+Vite) |                                            | Backend API  |
+--------------+                                            +--------------+
                                                                   |
                                                            +------+------+
                                                            | In-Memory / |
                                                            |   MySQL 8   |
                                                            +-------------+
```

---

## Part 1: Deploying the Frontend to Vercel

Vercel provides the fastest and easiest way to host React + Vite applications with zero server configuration.

### Option A: Deploy via GitHub (Recommended & Simplest)

1. **Push your code to GitHub:**
   ```bash
   cd D:\Querify
   git init
   git add .
   git commit -m "Initial commit of Querify"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/querify.git
   git push -u origin main
   ```

2. **Log into Vercel:**
   - Go to [vercel.com](https://vercel.com) and log in with your GitHub account.

3. **Import Project:**
   - Click **"Add New..."** > **"Project"**.
   - Select your `querify` repository from the list.

4. **Configure Project Settings:**
   - **Root Directory:** Click "Edit" and choose `frontend`.
   - **Framework Preset:** `Vite` (Vercel automatically detects this).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Environment Variables:**
   - Add a variable:
     - **Name:** `VITE_API_URL`
     - **Value:** `https://your-backend-url.onrender.com` *(You can leave this blank initially or update it once Part 2 is complete)*.

6. **Click "Deploy":**
   - Vercel will install dependencies, build the Vite bundle, and deploy to a live URL like:
     `https://querify-frontend.vercel.app`

---

### Option B: Deploy via Vercel CLI

If you prefer using the command line:

1. Open PowerShell and navigate to the frontend directory:
   ```powershell
   cd D:\Querify\frontend
   ```

2. Log in to Vercel:
   ```powershell
   npx vercel login
   ```
   *(A browser window will open to confirm your login)*

3. Deploy to production:
   ```powershell
   npx vercel --prod
   ```
   - Set up and deploy `D:\Querify\frontend`? `Y`
   - Which scope? `Your account`
   - Link to existing project? `N`
   - What's your project's name? `querify`
   - In which directory is your code located? `./`
   - Want to modify settings? `N`

4. Vercel will build and output your live production URL!

---

## Part 2: Deploying the Java Spring Boot Backend (Free)

Since Vercel is a serverless frontend platform that does not run long-running Java JVM applications, the Spring Boot backend can be deployed for free on **Render.com** or **Railway.app**.

### Deploy on Render.com (Free Web Service)

1. Log into [Render.com](https://render.com) using your GitHub account.
2. Click **"New +"** > **"Web Service"**.
3. Select your GitHub repository (`querify`).
4. Fill in the details:
   - **Name:** `querify-backend`
   - **Region:** Choose the region closest to you (e.g. Frankfurt, Oregon, Singapore)
   - **Language:** `Docker`
   - **Dockerfile Path:** `backend/Dockerfile`
   - **Docker Context:** `backend`
   - **Instance Type:** `Free`
5. **Environment Variables:**
   - `PORT`: `8080`
   - `AI_MODE`: `demo` *(or `live` if providing `AI_API_KEY`)*
   - `AI_PROVIDER`: `gemini`
   - `AI_API_KEY`: *(Optional: your Gemini API key)*
6. Click **"Create Web Service"**.
   - Render will build the container using Maven and boot Spring Boot.
   - Once live, you will receive a public HTTPS URL like:
     `https://querify-backend.onrender.com`

---

## Part 3: Connecting Frontend and Backend

Once your backend is live on Render:
1. Go back to your [Vercel Dashboard](https://vercel.com).
2. Click on your `querify` project > **Settings** > **Environment Variables**.
3. Add or edit:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://querify-backend.onrender.com` (your actual backend URL, without trailing slash).
4. Go to **Deployments** > Click the three dots `...` on the latest deployment > **Redeploy**.
5. Your Vercel frontend is now fully connected to your cloud Spring Boot backend!
