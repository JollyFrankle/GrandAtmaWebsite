import { cn } from "@/cn/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-400 cursor-wait", className)}
      {...props}
    />
  )
}

export { Skeleton }
