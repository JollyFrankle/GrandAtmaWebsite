import { Button } from "@/cn/components/ui/button"
import { Link } from "react-router-dom"


export default function InlineLink({
    to,
    children,
    className = ""
}: {
    to: string,
    children: React.ReactNode,
    className?: string
}) {
    return (
        <Button asChild variant="link" className={`p-0 h-fit ${className}`}><Link to={to}>{children}</Link></Button>
    )
}