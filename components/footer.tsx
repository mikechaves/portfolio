import Link from "next/link"
import { Github, Linkedin } from "lucide-react"
import { AnalyticsPreferencesButton } from "@/components/analytics-preferences-button"
import { XIcon } from "@/components/x-icon"

export function Footer({ analyticsPreferencesEnabled = false }: { analyticsPreferencesEnabled?: boolean }) {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/90 py-4 backdrop-blur-sm">
      <div className="site-shell">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.1em] text-zinc-400">
              &copy; {new Date().getFullYear()} MIKE_CHAVES. All rights
              reserved.
            </p>
            <Link
              href="/archive"
              className="inline-flex min-h-11 items-center text-[0.62rem] uppercase tracking-[0.1em] text-zinc-400 transition-colors hover:text-primary"
            >
              Archive
            </Link>
            {analyticsPreferencesEnabled ? <AnalyticsPreferencesButton /> : null}
          </div>
          <p className="hidden text-[0.58rem] uppercase tracking-[0.12em] text-zinc-500 lg:block">
            Built with human curiosity and machine leverage.
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://github.com/mikechaves"
              className="inline-flex h-11 w-11 items-center justify-center text-zinc-500 transition-colors hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </Link>
            <a
              href="https://x.com/mikechaves_io"
              className="inline-flex h-11 w-11 items-center justify-center text-zinc-500 transition-colors hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <XIcon className="h-4 w-4" />
              </span>
              <span className="sr-only">X</span>
            </a>
            <Link
              href="https://www.linkedin.com/in/mikejchaves"
              className="inline-flex h-11 w-11 items-center justify-center text-zinc-500 transition-colors hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
