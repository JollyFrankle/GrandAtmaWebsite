import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/cn/components/ui/navigation-menu';
import { Link, Outlet } from 'react-router-dom'
import React from 'react';
import { cn } from '@/cn/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact } from '@fortawesome/free-brands-svg-icons';

import './LayoutHome.css'
import { FacebookIcon, InstagramIcon, LogInIcon, MailIcon, PhoneIcon, XIcon, YoutubeIcon } from 'lucide-react';

const components: { title: string; href: string; description: string | React.ReactNode }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description: "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description: "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description: "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
]

export default function LayoutHome() {
    return <>
        <section className='fixed top-0 w-full top-nav py-4 z-50'>
            <div className="container flex justify-between">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Tentang Kami</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <a
                                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                href="/"
                                            >
                                                <FontAwesomeIcon icon={faReact} className="text-6xl" />
                                                <div className="mb-2 mt-4 text-lg font-medium">
                                                    shadcn/ui
                                                </div>
                                                <p className="text-sm leading-tight text-muted-foreground">
                                                    Beautifully designed components built with Radix UI and
                                                    Tailwind CSS.
                                                </p>
                                            </a>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem href="/docs" title="Introduction">
                                        Re-usable components built using Radix UI and Tailwind CSS.
                                    </ListItem>
                                    <ListItem href="/docs/installation" title="Installation">
                                        How to install dependencies and structure your app.
                                    </ListItem>
                                    <ListItem href="/docs/primitives/typography" title="Typography">
                                        Styles for headings, paragraphs, lists...etc
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Reservasi Kamar</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                    {components.map((component) => (
                                        <ListItem
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                        >
                                            {component.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem asChild>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                                {/* asChild: semua prop element ini akan di pass ke element child yg ada di dalamnya */}
                                <Link to="/docs">
                                    Hubungi
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <NavigationMenu>
                    <NavigationMenuItem asChild>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                            <Link to="/login">
                                <LogInIcon className="me-3 h-4 w-4" /> Log In
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenu>
            </div>
        </section>

        <Outlet />

        <div className='bg-secondary pt-8 pb-14 rounded-t-3xl'>
            <div className="container">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <h3 className="text-xl font-bold mb-3">Grand Atma Hotel</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                            Jl. Babarsari No. 43, Caturtunggal, Depok, Sleman, Daerah Istimewa Yogyakarta 55281
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <a href="tel:+62274567890">
                                <PhoneIcon className='inline h-4 w-4 me-2' />
                                +62 274 567 890
                            </a>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <a href="mailto:grandatma@notamail.com">
                                <MailIcon className='inline h-4 w-4 me-2' />
                                grandatma@notamail.com
                            </a>
                        </p>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <h3 className="text-xl font-bold mb-3">Layanan</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link to="/docs">Pesan Kamar</Link>
                            </li>
                            <li>
                                <Link to="/docs">Layanan Tambahan</Link>
                            </li>
                            <li>
                                <Link to="/docs">Cek Reservasi</Link>
                            </li>
                            <li>
                                <Link to="/docs">Hubungi Kami</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <h3 className="text-xl font-bold mb-3">Tentang Kami</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link to="/docs">Tentang Kami</Link>
                            </li>
                            <li>
                                <Link to="/docs">Karir</Link>
                            </li>
                            <li>
                                <Link to="/docs">Blog</Link>
                            </li>
                            <li>
                                <Link to="/docs">FAQ</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <h3 className="text-xl font-bold mb-3">Ikuti Kami</h3>
                        <ul className="flex flex-row gap-2">
                            <li>
                                <a href="https://facebook.com">
                                    <FacebookIcon className="w-6 h-6" />
                                </a>
                            </li>
                            <li>
                                <a href="https://instagram.com">
                                    <InstagramIcon className="w-6 h-6" />
                                </a>
                            </li>
                            <li>
                                <a href="https://twitter.com">
                                    <XIcon className="w-6 h-6" />
                                </a>
                            </li>
                            <li>
                                <a href="https://youtube.com">
                                    <YoutubeIcon className="w-6 h-6" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-secondary-foreground text-secondary py-4 text-sm text-center rounded-t-3xl -mt-6">
            <div className="container">
                &copy; 2021 Grand Atma Hotel. All rights reserved.
            </div>
        </div>
    </>
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href: to, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    to={to!!}
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"