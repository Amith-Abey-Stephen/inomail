"use client";

export default function PrivacyPage() {
  return (
    <div className="py-24 px-4 container mx-auto max-w-4xl">
      <div className="glass p-8 md:p-12 rounded-3xl">
        <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Data Usage</h2>
            <p className="leading-relaxed">
              At InoMail, we take your privacy seriously. The data you upload via Excel files or enter into the platform is used exclusively for generating and dispatching your email campaigns. We do not sell, rent, or lease your recipient data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Email Data Handling</h2>
            <p className="leading-relaxed">
              Data associated with email content and recipient addresses is stored securely in our MongoDB Atlas database. Assets uploaded for campaigns are stored securely on Cloudinary. Data is retained only as long as necessary to provide you with history and analytics, and can be deleted upon request by the Organization Admin.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Security Assurances</h2>
            <p className="leading-relaxed">
              We employ industry-standard security measures including encrypted credentials, strict input validation, and role-based access control to protect your organization's data. SMTP credentials (App Passwords) are securely encrypted before being stored.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
