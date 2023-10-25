import { useState } from "react";
import { SidebarItemChildProps } from "./Sidebar";
import { NavLink } from "react-router-dom";


export default function SidebarChildrenItems({
    items,
    role,
    onOpenChange
}: {
    items: SidebarItemChildProps[],
    role: string,
    onOpenChange: (opened: boolean) => void
}) {
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(!isOpen)
        onOpenChange(!isOpen)
    }

    return <ul className="mt-2">
        {items.map((item, index) => {
            if (item.roles && !item.roles.includes(role)) {
                return null
            }

            return <li key={index}>
                <NavLink
                    to={item.to}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    {item.label}
                </NavLink>
            </li>
        })}
}