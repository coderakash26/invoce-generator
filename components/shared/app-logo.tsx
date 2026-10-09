import Link from "next/link";
import { FileText } from "lucide-react";

interface AppLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function AppLogo({ className = "", size = "md", href = "/" }: AppLogoProps) {
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg font-bold tracking-tight",
    lg: "text-2xl font-bold tracking-tight",
  };

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
        <FileText className={iconSizes[size]} />
      </div>
      <span className={`${textSizes[size]} text-zinc-900 font-bold whitespace-nowrap`}>
        Invoice<span className="text-indigo-600">Flow</span>
      </span>
    </div>
  );

  if (href) {
    return <Link href={href} className="flex items-center focus:outline-none">{content}</Link>;
  }

  return content;
}
