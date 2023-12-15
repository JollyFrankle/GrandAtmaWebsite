import { Button } from "@/cn/components/ui/button"
import { Link } from "react-router-dom"


export default function InlineLink({
    to,
    children,
    target,
    className = "",
}: {
    to: string,
    children: React.ReactNode,
    target?: '_blank' | '_self' | '_parent' | '_top',
    className?: string
}) {
    return (
        <Button asChild variant="link" className={`p-0 h-fit ${className}`} style={{ fontSize: "inherit" }}><Link target={target} to={to}>{children}</Link></Button>
    )
}