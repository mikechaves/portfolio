import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="terminal-window max-w-md w-full">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">error.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-2">
            <span className="text-primary">$</span> cat error.log
          </p>
          <div className="mb-4">
            <p className="text-destructive">Error 404: Page Not Found</p>
            <p className="mt-2">The requested resource could not be located on this server.</p>
          </div>
        </div>
      </div>

      <Link href="/" className="mt-8 inline-flex items-center gap-2 text-primary hover:underline">
        Return to home
      </Link>
    </div>
  )
}

