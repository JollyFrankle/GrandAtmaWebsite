import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "@/assets/images/gah-inline-logo.png";
import React from "react";
import { BedIcon, BookMarkedIcon, CalendarClockIcon, ChevronDownIcon, HelpingHandIcon, HomeIcon, LayoutDashboardIcon, MenuIcon, UsersIcon } from "lucide-react";
import AuthHelper from "@/utils/AuthHelper";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

interface SidebarGroupProps {
    label: string
    children: SidebarItemProps[]
}

interface SidebarItemProps {
    icon: React.ReactElement
    label: string
    to: string
    roles?: string[]
    children?: SidebarItemChildProps
}

export interface SidebarItemChildProps {
    label: string
    to: string
    roles?: string[]
}

const sidebarItems: SidebarGroupProps[] = [
    {
        label: "Menu",
        children: [
            {
                icon: <LayoutDashboardIcon />,
                label: "Dashboard",
                to: "/"
            },
            {
                icon: <BedIcon />,
                label: "Kamar",
                to: "/kamar",
                roles: ["admin"]
            },
            {
                icon: <CalendarClockIcon />,
                label: "Season & Tarif",
                to: "/season",
                roles: ["sm"]
            },
            {
                icon: <HelpingHandIcon />,
                label: "Layanan Berbayar",
                to: "/fasilitas",
                roles: ["sm"]
            },
            {
                icon: <UsersIcon />,
                label: "Customer Group",
                to: "/cg",
                roles: ["sm"]
            },
            {
                icon: <BookMarkedIcon />,
                label: "Reservasi Group",
                to: "/reservasi",
                roles: ["sm"]
            }
        ]
    },
    {
        label: "Administrasi",
        children: [
            {
                icon: <UsersIcon />,
                label: "User Pegawai",
                to: "/user-p",
                roles: ["admin"]
            },
            // {
            //     icon: <UsersIcon />,
            //     label: "User Customer",
            //     to: "/user-c",
            //     roles: ["admin"]
            // }
        ]
    }
]

function generateSidebar(role: string) {
    return sidebarItems.map((group, i) => (
        <div key={i} className="mb-4 last:mb-0">
            <p className="uppercase font-bold mb-2">{group.label}</p>
            <ul>
                {group.children.map((item, j) => (!item.roles || (item.roles.includes(role))) && (
                    <li key={j} className="mb-1">
                        <NavLink
                            to={'/admin' + item.to}
                            className={({ isActive }) => `${isActive ? 'bg-primary' : 'hover:bg-white hover:bg-opacity-10'} flex items-center gap-2 rounded p-2`}
                        >
                            {item.icon && React.cloneElement(item.icon, { className: "w-4 h-4" })}
                            {item.label}
                            {item.children && <ChevronDownIcon className="w-4 h-4 ms-auto" />}
                        </NavLink>
                    </li>
                )
                )}
            </ul>
        </div>
    ))
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    const [adminData] = useState(AuthHelper.getUserPegawai())

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
    );

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    useEffect(() => {
        localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector('body')?.classList.add('sidebar-expanded');
        } else {
            document.querySelector('body')?.classList.remove('sidebar-expanded');
        }
    }, [sidebarExpanded]);

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-slate-800 dark:bg-slate-900 duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 h-16 lg:py-3">
                <Link to="/admin/" className="bg-white py-2 px-3 rounded text-black">
                    <img src={Logo} alt="Logo" className="h-7 inline me-2" />
                </Link>

                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden"
                >
                    <MenuIcon size={24} />
                </button>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* <!-- Sidebar Menu --> */}
                <nav className="py-4 px-4 lg:px-6 text-white">
                    {/* Lihat situs utama */}
                    <NavLink
                        to="/"
                        className="hover:bg-white hover:bg-opacity-10 flex items-center gap-2 rounded p-2 mb-4"
                    >
                        <HomeIcon className="w-4 h-4" />
                        Kembali ke Situs Utama
                    </NavLink>

                    {/* <!-- Menu Group --> */}
                    {generateSidebar(adminData?.role ?? "none")}
                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </aside>
    );
};

export default Sidebar;