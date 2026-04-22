# InoMail - AI-Powered Bulk Email Platform

InoMail is a high-performance, multi-tenant SaaS platform designed for organizations to manage and dispatch personalized bulk email campaigns. Built with Next.js 16 and Tailwind CSS v4, it leverages AI to simplify email creation and robust queue management to ensure reliable delivery.

## 🚀 Key Features

- **Multi-Step Onboarding**: A premium 3-step signup wizard (Identity, Plan, Organization) with Framer Motion animations and progress tracking.
- **Secure Authentication**: Redis-backed OTP verification, real-time password security checklist, and mismatch validation.
- **Dynamic Google OAuth**: Seamless Google integration that pre-fills profile data while ensuring all required organization details are captured.
- **AI Email Generation**: Integrated with Google Gemini Pro to generate professional HTML email templates from simple text prompts.
- **Excel Personalization**: Upload Excel files to dynamically inject recipient data into emails.
- **Smart Queue Management**: Powered by **BullMQ** and **Redis** to handle high-volume dispatch with rate limiting and automatic retries.
- **Database-Backed Sessions**: Enhanced security with server-side session validation against the database on every dashboard request.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **Queueing**: [BullMQ](https://docs.bullmq.io/) + [Redis](https://redis.io/)
- **AI**: [Google Gemini Pro](https://ai.google.dev/)
- **Email SDK**: [Resend](https://resend.com/) & [Nodemailer](https://nodemailer.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance
- Redis server
- API Keys for Google Gemini and Resend

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd inomail-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file based on `.env.example`:
   ```env
   MONGODB_URI="your_mongodb_uri"
   JWT_SECRET="your_secret_key"
   GEMINI_API_KEY="your_gemini_key"
   REDIS_URL="your_redis_url"
   RESEND_API_KEY="your_resend_key"
   CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `src/app`: Next.js App Router (Marketing, Dashboard, Auth)
- `src/components`: Reusable UI components (Layout, UI, Dashboard)
- `src/lib`: Core logic (DB connection, Queue worker, AI integration)
- `src/models`: Mongoose schemas (User, Organization, Campaign)
- `src/proxy.ts`: Next.js Proxy (previously Middleware) for auth and routing

## 📄 License

Built with ❤️ by **Inovus Labs IEDC**.
