# InoMail - Premium AI-Powered Campaign Studio

InoMail is a high-performance, multi-tenant SaaS platform designed for professional organizations to manage and dispatch personalized bulk email campaigns. Built with Next.js 16 and Tailwind CSS v4, it features a state-of-the-art **Campaign Studio** with live AI generation and real-time visual editing.

## 🚀 Key Features

- **Creative Campaign Studio**: A transformative UX that evolves from a focused prompt center into a high-control "Creative Studio" with a dual-pane live editor.
- **Visual WYSIWYG Editor**: Directly click and edit text within the email preview. Bidirectional sync ensures your visual changes are instantly reflected in the HTML code and vice versa.
- **Smart AI Generation (OpenRouter)**: Leverages `llama-3.3-70b` via OpenRouter to generate "WOW" factor templates. Enforces "Legacy Table-Based Layouts" for 100% compatibility with Gmail, Outlook, and Apple Mail.
- **Template & Draft Management**: Save custom designs to your organization's library or keep in-progress campaigns as drafts to resume later.
- **Cloudinary Asset Management**: Professional asset upload system with organization-specific folder structures (`inomail/org_name/...`). Supports dynamic asset injection using `{{asset1}}` variables.
- **True Device Simulation**: Real-time previews for **Desktop (1600px)**, **Tablet (768px)**, and **Mobile (375px)** with fluid content reflow and scale controls.
- **Multi-Tenant Organization Management**: Full CRUD for organization members, role-based access control (Admin/Member), and plan-based seat enforcement.
- **Delivery Configuration**: Flexible delivery options including **Gmail App Passwords** (recommended) and **Custom SMTP** (Mailgun, SendGrid, SES).
- **Smart OTP Verification with Fallback**: Redis-backed security with an automatic **In-Memory Fallback** and **Build-Safe** logic for seamless production deployments.
- **Modern Tech Stack**: Built with Next.js 16, Tailwind v4, Framer Motion, and Sonner for a premium, snappy feel.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **Queueing**: [BullMQ](https://docs.bullmq.io/) + [Redis](https://redis.io/)
- **AI**: [OpenRouter API](https://openrouter.ai/) (Llama 3.3)
- **Storage**: [Cloudinary](https://cloudinary.com/) (Asset management)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Email Delivery**: [Resend](https://resend.com/) & [Nodemailer](https://nodemailer.com/)

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance
- Redis server (Optional: In-memory fallback provided)
- Cloudinary account
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
   Copy `.env.example` to `.env.local` and fill in your keys (Cloudinary, OpenRouter, MongoDB).

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `src/app`: Next.js App Router (Studio, Dashboard, Auth)
- `src/app/api`: Serverless API routes (AI Generation, Asset Upload, Org Management)
- `src/components`: Premium UI components and Layouts
- `src/lib`: Core logic (Redis client, AI prompt engineering, Auth)
- `src/models`: Mongoose schemas (User, Organization, Campaign, Template)

## 📄 License

Built with ❤️ by **Inovus Labs IEDC**.
