import Link from "next/link";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-lg pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <div className="bg-primary/20 p-2 rounded-xl">
                <Mail className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                InoMail
              </span>
            </Link>
            <p className="text-gray-400 max-w-xs mb-6 text-sm">
              Smart AI-Powered Bulk Email Platform. Send personalized emails using structured data and intelligent generation.
            </p>
            <div className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300">
              Built with ❤️ by <span className="text-white font-medium">Inovus Labs IEDC</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-gray-400 hover:text-white text-sm transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
              <li><Link href="#about" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="#contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} InoMail. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Social links could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
