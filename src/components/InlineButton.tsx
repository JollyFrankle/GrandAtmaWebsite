import { Button } from "@/cn/components/ui/button"


export default function InlineButton({
    children,
    onClick,
    type = "button",
    className = ""
}: {
    children: React.ReactNode,
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    type?: "button" | "submit" | "reset",
    className?: string
}) {
    return (
        <Button variant="link" type={type} className={`p-0 h-fit ${className}`} style={{ fontSize: "inherit" }} onClick={onClick}>{children}</Button>
    )
}