

export default function InputWithIcon({
    icon,
    children,
    className = ""
}: {
    icon: React.ReactNode,
    children: React.ReactNode,
    className?: string
}) {
    return <div className={`relative ${className}`}>
        <div className="absolute top-2 bottom-2 flex items-center justify-center ps-3 w-7 pointer-events-none">
            {icon}
        </div>
        {children}
    </div>
}