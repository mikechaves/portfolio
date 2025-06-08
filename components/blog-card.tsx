import Link from "next/link";
import { CalendarIcon, Clock, ArrowRight } from "lucide-react";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  url?: string;
  publication?: string;
}

export function BlogCard({
  id,
  title,
  excerpt,
  date,
  readingTime,
  url,
  publication,
}: BlogCardProps) {
  // If URL is provided, use an anchor tag that opens in a new tab
  // Otherwise, use Next.js Link for internal navigation
  const Component = url ? "a" : Link;
  const linkProps = url
    ? { href: url, target: "_blank", rel: "noopener noreferrer" }
    : { href: `/blog/${id}` };

  return (
    <Component {...linkProps} className="block h-full">
      <div className="card-hover bg-card p-4 rounded-md h-full flex flex-col">
        {publication && (
          <div className="inline-block px-2 py-1 mb-2 text-xs border border-zinc-700 rounded-full text-zinc-400">
            {publication}
          </div>
        )}
        <div className="flex items-center gap-4 text-xs text-zinc-400 mb-2">
          <div className="flex items-center">
            <CalendarIcon size={12} className="mr-1" />
            {date}
          </div>
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            {readingTime}
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2 glitch" data-text={title}>
          {title}
        </h3>
        <p className="text-sm text-zinc-400 mb-4 flex-grow line-clamp-3">
          {excerpt}
        </p>
        {url && (
          <div className="text-primary text-sm flex items-center gap-1 mt-auto">
            Read on Medium <ArrowRight size={14} />
          </div>
        )}
      </div>
    </Component>
  );
}
