# InoMail - Premium AI-Powered Campaign Studio

InoMail is a high-performance, multi-tenant SaaS platform designed for professional organizations to manage and dispatch personalized bulk email campaigns. Built with Next.js 16 and Tailwind CSS v4, it features a state-of-the-art **Campaign Studio** with live AI generation and real-time editing.

## 🚀 Key Features

- **Creative Campaign Studio**: A transformative UX that evolves from a focused prompt center into a high-control "Creative Studio" with a dual-pane live editor.
- **Smart AI Generation (OpenRouter)**: Leverages `llama-3.3-70b` via OpenRouter to generate "WOW" factor templates. Supports dynamic aesthetics including **Bold Dark Premium** and **Elegant Light** themes.
- **True Device Simulation**: Real-time previews for **Desktop (1200px)**, **Tablet (768px)**, and **Mobile (375px)** with fluid content reflow.
- **Live HTML Editor**: Instantly tweak generated code with a side-by-side live preview and 100% responsiveness enforcement.
- **Multi-Tenant Organization Management**: Seamlessly switch between multiple organizations with plan-based limitations.
- **Smart OTP Verification with Fallback**: Redis-backed security with an automatic **In-Memory Fallback** and **Build-Safe** logic for seamless production deployments.
- **Excel Personalization**: Upload Excel files to dynamically inject `{{name}}`, `{{company}}`, and other custom variables.
- **Modern Tech Stack**: Built with Next.js 16, Tailwind v4, Framer Motion, and Sonner for a premium, snappy feel.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **Queueing**: [BullMQ](https://docs.bullmq.io/) + [Redis](https://redis.io/)
- **AI**: [OpenRouter API](https://openrouter.ai/) (Llama 3.3)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Email Delivery**: [Resend](https://resend.com/) & [Nodemailer](https://nodemailer.com/)

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance
- Redis server (Optional: In-memory fallback provided)
- API Keys for **OpenRouter** and **Resend**

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
   Copy `.env.example` to `.env.local` and fill in your keys.

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `src/app`: Next.js App Router (Studio, Dashboard, Auth)
- `src/components`: Premium UI components and Layouts
- `src/lib`: Core logic (Redis client, AI prompt engineering, Auth)
- `src/models`: Mongoose schemas (User, Organization, Campaign)

## 📄 License

Built with ❤️ by **Inovus Labs IEDC**.
