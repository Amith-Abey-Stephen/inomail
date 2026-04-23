# InoMail - Ultra-Premium AI-Powered Campaign Suite

InoMail is a high-performance, multi-tenant SaaS platform designed for professional organizations to design, manage, and dispatch atmospheric bulk email campaigns. Built with Next.js 16 and Tailwind CSS v4, it features a state-of-the-art **Campaign Studio** with "Ultra-Premium" AI generation and real-time visual editing.

## 🚀 Key Features

### **1. Atmospheric Campaign Studio**
- **Ultra-Premium AI Generation**: Re-engineered prompt logic using `llama-3.3-70b` to enforce world-class design standards (Linear/Stripe aesthetics). 
- **Monochromatic Gradients & Glassmorphism**: Automatic generation of immersive environments with sophisticated gradients and translucent "Glass" cards.
- **Fluid-Hybrid Responsive Engineering**: Advanced email architecture ensuring 100% pixel-perfect reflow across iPhone, Android, and Outlook Desktop.
- **Visual WYSIWYG Editor**: Directly click and edit text within the preview. Bidirectional sync ensures changes reflect instantly in HTML and vice versa.

### **2. Data-Driven Recipient Management**
- **Dynamic Excel Template Generator**: Automatically creates personalized `.xlsx` templates based on your campaign's unique asset groups.
- **Live Spreadsheet Parsing**: Browser-side Excel/CSV parsing engine with instant recipient validation and live count feedback.
- **Variable Mapping**: Seamless 1:1 mapping between spreadsheet data and `{{asset_n}}` or `{{variable_name}}` injections.

### **3. Professional Design Library**
- **High-Fidelity Previews**: Design library with scaled `iframe` simulations for true-to-life rendering of saved templates.
- **Seamless Handshake**: One-click resumption of drafts and templates with full state restoration (HTML, Assets, Prompts).
- **Organization-Scoped Storage**: Strictly isolated data management for templates, drafts, and campaign history.

### **4. Premium Enterprise UX**
- **Custom Modal System**: Replaced native browser alerts with animated, glassmorphism-styled Framer Motion modals for a cohesive suite feel.
- **True Device Simulation**: Realistic previews for **Desktop (1200px)**, **Tablet (768px)**, and **Mobile (375px)** with scale controls.
- **Safe State Protection**: Robust "Unsaved Changes" protection with floating warning bars and exit confirmation modals.
- **Verified Delivery**: Integrated **`amith.site`** production domain for reliable OTP and system delivery.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Spreadsheets**: [XLSX](https://www.npmjs.com/package/xlsx) (Parsing & Generation)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **Queueing**: [BullMQ](https://docs.bullmq.io/) + [Redis](https://redis.io/)
- **AI**: [OpenRouter API](https://openrouter.ai/) (Llama 3.3)
- **Storage**: [Cloudinary](https://cloudinary.com/) (Asset management)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Email Delivery**: [Resend](https://resend.com/) (Production Domain: amith.site) & [Nodemailer](https://nodemailer.com/)

## ⚙️ Getting Started

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
- `src/app/api`: Serverless API routes (AI Generation, Excel Parsing, Asset Upload)
- `src/components`: Premium UI components and Layouts
- `src/lib`: Core logic (Redis client, AI prompt engineering, Auth)
- `src/models`: Mongoose schemas (User, Organization, Campaign, Template)

## 📄 License

Built with ❤️ by **Inovus Labs IEDC**.
