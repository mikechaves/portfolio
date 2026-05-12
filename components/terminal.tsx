"use client";

import { useEffect, useState, useRef } from "react";

interface TerminalProps {
  text: string;
  typingSpeed?: number;
  className?: string;
  showPrompt?: boolean;
  onComplete?: () => void;
}

export function Terminal({
  text,
  typingSpeed = 50,
  className = "",
  showPrompt = true,
  onComplete,
}: TerminalProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentIndex = 0;
    let timer: NodeJS.Timeout;

    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
        timer = setTimeout(typeNextCharacter, typingSpeed);
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    };

    typeNextCharacter();

    return () => {
      clearTimeout(timer);
    };
  }, [text, typingSpeed, onComplete]);

  return (
    <div className={`terminal-window ${className}`} ref={containerRef}>
      <div className="terminal-header">
        <div className="terminal-button terminal-button-red"></div>
        <div className="terminal-button terminal-button-yellow"></div>
        <div className="terminal-button terminal-button-green"></div>
        <div className="terminal-title">terminal</div>
      </div>
      <div className="terminal-content grid">
        <span className="invisible col-start-1 row-start-1" aria-hidden="true">
          {showPrompt && <span className="text-primary">$ </span>}
          <span>{text}</span>
          <span className="terminal-cursor"></span>
        </span>
        <span className="col-start-1 row-start-1">
          {showPrompt && <span className="text-primary">$ </span>}
          <span>{displayedText}</span>
          {isTyping && <span className="terminal-cursor"></span>}
        </span>
      </div>
    </div>
  );
}
