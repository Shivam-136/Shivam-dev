import { navLinks, profile } from "../data/profile";
import { FiArrowUp, FiGithub } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative border-t border-obsidian-line bg-obsidian pt-16 pb-8 px-6 overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-emerald-deep/10 to-transparent" />

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Logo */}
        <div>
          <p className="font-display text-xl font-semibold text-bone">
            {profile.name}
            <span className="text-emerald-glow">.</span>
          </p>

          <p className="text-sm text-bone-dim mt-1 font-body">
            {profile.role}
          </p>
        </div>

        {/* Navigation */}
        <ul className="flex flex-wrap gap-6 text-sm text-bone-dim">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                data-cursor-hover
                className="hover:text-diamond transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Social */}
        <div className="flex items-center gap-4">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="w-10 h-10 flex items-center justify-center glass rounded-xl text-bone-dim hover:text-diamond transition-colors"
          >
            <FiGithub size={18} />
          </a>

          <a
            href="#hero"
            data-cursor-hover
            aria-label="Back to top"
            className="w-10 h-10 flex items-center justify-center glass rounded-xl text-bone-dim hover:text-emerald-glow transition-colors"
          >
            <FiArrowUp size={18} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative max-w-6xl mx-auto mt-12 border-t border-obsidian-line pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-bone-dim/60">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built block by block.
        </p>

        <p>
          Made with ❤️ using React, GSAP & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}