// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";
// Custom SVGs for brand icons
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.6 5 2 5 2a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 3 9.6c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-[#030407] pt-16 pb-8 overflow-hidden">
      {/* Subtle background glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(ellipse at top, #00F0FF 0%, transparent 70%)" }}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/praman-logo.png"
                alt="Praman"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
              Replacing Trust with <span className="text-[#00F0FF]">Proof</span>. The decentralized protocol for verifiable talent, code, and zero dead-link hiring.
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              <a href="https://x.com/PramanNetwork" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-[#00F0FF] hover:border-[#00F0FF]/30 transition-all">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/company/praman-network/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-[#00F0FF] hover:border-[#00F0FF]/30 transition-all">
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="https://github.com/Praman-Network" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-[#00F0FF] hover:border-[#00F0FF]/30 transition-all">
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="font-mono-brand text-xs uppercase tracking-widest text-zinc-300">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/jobs" className="text-zinc-500 hover:text-[#00F0FF] transition-colors">Browse Jobs</Link>
              </li>
              <li>
                <Link href="/post-job" className="text-zinc-500 hover:text-[#00F0FF] transition-colors">Hire Talent</Link>
              </li>
              <li>
                <a href="#" className="text-zinc-500 hover:text-[#00F0FF] transition-colors">Protocol V2</a>
              </li>
              <li>
                <a href="#" className="text-zinc-500 hover:text-[#00F0FF] transition-colors">Pricing</a>
              </li>
            </ul>
          </div>

          {/* Legal / Company */}
          <div className="space-y-4">
            <h4 className="font-mono-brand text-xs uppercase tracking-widest text-zinc-300">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-zinc-500 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-zinc-500 hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-zinc-500 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-zinc-500 hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-xs font-mono-brand tracking-wider">
            © {currentYear} PRAMAN NETWORK. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
            <span className="text-xs font-mono-brand text-emerald-400 tracking-wider">SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
