import { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children: React.ReactNode
  vertical?: boolean
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "relative overflow-hidden [--gap:1rem] [--duration:40s] p-2",
        vertical ? "flex flex-col h-full" : "flex w-full",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 justify-around gap-[var(--gap)]",
          vertical ? "flex-col animate-marquee-vertical" : "flex-row animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {/* Duplicate once for seamless infinite effect */}
        <div className="flex shrink-0 justify-around gap-[var(--gap)]">
          {children}
        </div>
        <div className="flex shrink-0 justify-around gap-[var(--gap)]">
          {children}
        </div>
      </div>
    </div>
  )
}
