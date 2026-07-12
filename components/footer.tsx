import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXTwitter } from "@fortawesome/free-brands-svg-icons"

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/90 py-4 backdrop-blur-sm">
      <div className="site-shell">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.1em] text-zinc-600">
              &copy; {new Date().getFullYear()} MIKE_CHAVES. All rights
              reserved.
            </p>
            <Link
              href="/archive"
              className="text-[0.62rem] uppercase tracking-[0.1em] text-zinc-500 transition-colors hover:text-primary"
            >
              Archive
            </Link>
          </div>
          <p className="hidden text-[0.58rem] uppercase tracking-[0.12em] text-zinc-700 lg:block">
            Built with human curiosity and machine leverage.
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://github.com/mikechaves"
              className="text-zinc-500 transition-colors hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </Link>
            <a
              href="https://x.com/mikechaves_io"
              className="text-zinc-500 transition-colors hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
              </span>
              <span className="sr-only">X</span>
            </a>
            <Link
              href="https://www.linkedin.com/in/mikejchaves"
              className="text-zinc-500 transition-colors hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="mailto:founder@gowizzo.io"
              className="text-zinc-500 transition-colors hover:text-primary"
            >
              <Mail size={20} />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
