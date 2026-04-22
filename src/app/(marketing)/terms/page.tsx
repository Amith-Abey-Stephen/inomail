"use client";

export default function TermsPage() {
  return (
    <div className="py-24 px-4 container mx-auto max-w-4xl">
      <div className="glass p-8 md:p-12 rounded-3xl">
        <h1 className="text-4xl font-bold mb-8 text-white">Terms of Service</h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Usage Rules</h2>
            <p className="leading-relaxed">
              By using InoMail, you agree to utilize the platform responsibly. Accounts found to be engaging in malicious activities, such as phishing, fraud, or the distribution of malware, will be immediately terminated without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Email Responsibility Clause</h2>
            <p className="leading-relaxed">
              InoMail provides the infrastructure to generate and queue emails, but the final responsibility for the content and the recipients lies with the Organization Admin. You must ensure that you have the right to contact the individuals on your mailing lists.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Anti-Spam Compliance</h2>
            <p className="leading-relaxed">
              We enforce strict anti-spam compliance. You must adhere to the CAN-SPAM Act and equivalent international regulations. Unusually high bounce rates or spam reports will trigger an automatic review of your account, which may result in a temporary suspension of sending capabilities until resolved.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
