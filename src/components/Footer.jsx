import { navLinks, profile } from "../data/profile";
import { FiArrowUp, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { smoothScrollTo } from "../utils/scroll";

export default function Footer() {
  return (
    <footer className="relative border-t border-obsidian-line bg-obsidian pt-16 pb-12 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-emerald-glow/5 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand & Role */}
        <div>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("#hero");
            }}
            data-cursor-hover
            className="font-display text-xl font-semibold text-bone hover:text-white transition-colors"
          >
            {profile.name}
            <span className="text-emerald-glow">.</span>
          </a>
          <p className="text-xs sm:text-sm text-bone-dim mt-1 font-body">
            Full Stack Developer • React, Node.js, MongoDB &amp; AI
          </p>
        </div>

        {/* Navigation */}
        <ul className="flex flex-wrap gap-6 text-sm text-bone-dim font-body">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo(link.href);
                }}
                data-cursor-hover
                className="hover:text-emerald-glow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow rounded px-1"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Social Icons & Back to Top */}
        <div className="flex items-center gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            aria-label="GitHub Profile"
            title="GitHub"
            className="w-10 h-10 flex items-center justify-center glass rounded-xl text-bone-dim hover:text-white hover:border-emerald-glow/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
          >
            <FiGithub size={18} />
          </a>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            aria-label="LinkedIn Profile"
            title="LinkedIn"
            className="w-10 h-10 flex items-center justify-center glass rounded-xl text-bone-dim hover:text-[#5EEAD4] hover:border-diamond/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
          >
            <FiLinkedin size={18} />
          </a>

          <a
            href={`mailto:${profile.email}`}
            data-cursor-hover
            aria-label="Email Shivam"
            title="Email"
            className="w-10 h-10 flex items-center justify-center glass rounded-xl text-bone-dim hover:text-emerald-glow hover:border-emerald-glow/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
          >
            <FiMail size={18} />
          </a>

          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("#hero");
            }}
            data-cursor-hover
            aria-label="Back to top"
            title="Back to top"
            className="w-10 h-10 flex items-center justify-center glass rounded-xl text-bone-dim hover:text-emerald-glow hover:border-emerald-glow/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow ml-2"
          >
            <FiArrowUp size={18} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative max-w-6xl mx-auto mt-12 border-t border-obsidian-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-bone-dim/60 font-body">
        <p>
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p className="flex items-center gap-2">
          <span>Built with React, Vite &amp; Tailwind CSS</span>
        </p>
      </div>
    </footer>
  );
}