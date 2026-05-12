import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXTwitter } from "@fortawesome/free-brands-svg-icons"

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#e8e1d2]/10 bg-black/70 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-xs uppercase tracking-[0.18em] text-[#8f8678]">
              &copy; {new Date().getFullYear()} Mike Chaves. Built with intent. Deployed for impact.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="https://github.com/mikechaves"
              className="text-[#8f8678] hover:text-[#eee7d8] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </Link>
            <a
              href="https://x.com/mikechaves_io"
              className="text-[#8f8678] hover:text-[#eee7d8] transition-colors"
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
              className="text-[#8f8678] hover:text-[#eee7d8] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="mailto:founder@gowizzo.io"
              className="text-[#8f8678] hover:text-[#eee7d8] transition-colors"
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
