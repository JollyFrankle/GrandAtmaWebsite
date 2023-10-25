import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/cn/components/ui/navigation-menu';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react';
import { cn } from '@/cn/lib/utils';
import { FacebookIcon, InstagramIcon, LayoutDashboardIcon, LogInIcon, LogOutIcon, MenuIcon, YoutubeIcon } from 'lucide-react';

import './LayoutHome.css'
import Logo from "@/assets/images/gah-logo.png"
import { Button } from '@/cn/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/cn/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/cn/components/ui/accordion';
import ScrollToTop from '@/utils/ScrollToTop';
import { BASE_URL, UserCustomer, UserPegawai } from '@/utils/ApiModels';
import AuthHelper from '@/utils/AuthHelper';
import axios from 'axios';
import { toast } from 'react-toastify';

interface MenuItemProps {
    title: string
    href: string
    description: string | React.ReactNode
    children?: MenuItemProps[]
}

const components: MenuItemProps[] = [
    {
        title: "Tentang Kami",
        href: "#",
        description: "Tentang Grand Atma Hotel",
        children: [
            {
                title: "Sejarah",
                href: "/sejarah",
                description: "Grand Atma Hotel dari masa ke masa",
            },
            {
                title: "Visi & Misi",
                href: "/visi-misi",
                description: "Visi & Misi Grand Atma Hotel",
            },
            {
                title: "Lokasi",
                href: "/lokasi",
                description: "Lokasi Grand Atma Hotel",
            }
        ]
    },
    {
        title: "Reservasi",
        href: "#",
        description: "Pesan kamar di Grand Atma Hotel",
        children: [
            {
                title: "Pemesanan Kamar",
                href: "/reservasi",
                description: "Rencanakan liburan Anda bersama kami",
            },
            {
                title: "Pemesanan Kamar Grup",
                href: "/reservasi-grup",
                description: "Grand Atma Hotel siap melayani rombongan Anda",
            },
            {
                title: "Informasi Kamar",
                href: "/kamar",
                description: "Temukan kamar yang nyaman untuk Anda",
            }
        ]
    }
]

function generateChildNavLG(children: MenuItemProps[]) {
    return <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
        {children.map((component) => (
            <ListItem
                key={component.title}
                title={component.title}
                href={component.href}
            >
                {component.description}
            </ListItem>
        ))}
    </ul>
}

function generateNavLG() {
    return <NavigationMenu className="hidden lg:block">
        <NavigationMenuList>
            <NavigationMenuItem asChild>
                <Link to="/" className='me-2 bg-background p-2 rounded hover:bg-accent duration-300'>
                    <img src={Logo} className="h-12" />
                </Link>
            </NavigationMenuItem>
            {components.map((component, i) => (
                <NavigationMenuItem key={i}>
                    <NavigationMenuTrigger>{component.title}</NavigationMenuTrigger>
                    {component.children && (
                        <NavigationMenuContent>
                            {generateChildNavLG(component.children)}
                        </NavigationMenuContent>
                    )}
                </NavigationMenuItem>
            ))}
        </NavigationMenuList>
    </NavigationMenu>
}

function generateChildNavSM(children: MenuItemProps[]) {
    return <ul>
        {children.map((component, i) => (
            <li key={i}>
                <Button variant="link" asChild className="p-0 w-full justify-start">
                    <Link to={component.href}>
                        {component.title}
                    </Link>
                </Button>
                <p className="text-muted-foreground">{component.description}</p>
            </li>
        ))}
    </ul>
}

function generateNavSM() {
    return <Sheet>
        <SheetTrigger asChild>
            <Button variant="secondary" className="lg:hidden">
                <MenuIcon className="w-6 h-6" />
            </Button>
        </SheetTrigger>
        <SheetContent className="w-full">
            <div className='flex justify-between items-center mb-3'>
                <Link to="/">
                    <img src={Logo} className="h-12" />
                </Link>
                <div className='text-end'>
                    <p className="text-lg font-bold">Grand Atma Hotel</p>
                    <p className="text-muted-foreground">Tempat Ternyaman Anda di Yogyakarta</p>
                </div>
            </div>
            <Accordion type="single" collapsible className="w-full">
                {components.map((component, i) => (
                    <AccordionItem value={'sheet' + i} key={i}>
                        <AccordionTrigger>
                            {component.title}
                        </AccordionTrigger>
                        <AccordionContent>
                            {component.children && generateChildNavSM(component.children)}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </SheetContent>
    </Sheet>
}

export default function LayoutHome() {
    const [userCustomer, setUserCustomer] = React.useState<UserCustomer | null>(null)
    const [userPegawai, setUserPegawai] = React.useState<UserPegawai | null>(null)

    const navigate = useNavigate()

    const logout = () => {
        const token = AuthHelper.getToken()
        const type = localStorage.getItem("type")
        AuthHelper.logout()
        navigate('/login')

        const logoutUrl = type === "c" ? `${BASE_URL}/customer/logout` : `${BASE_URL}/pegawai/logout`
        axios.post(logoutUrl, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            toast("Berhasil log out.", {
                type: "success"
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        setUserCustomer(AuthHelper.getUserCustomer())
        setUserPegawai(AuthHelper.getUserPegawai())
    }, [])

    return <>
        <ScrollToTop />
        <section className='fixed top-0 w-full top-nav py-3 z-50'>
            <div className="container flex justify-between">
                {generateNavLG()}
                {generateNavSM()}

                <NavigationMenu>
                    {userCustomer ? (
                        <>
                            <NavigationMenuItem asChild>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                                    <Link to="/customer">
                                        <LayoutDashboardIcon className="me-3 h-4 w-4" /> Dashboard
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem asChild>
                                <NavigationMenuLink className='ms-2' onClick={logout} asChild>
                                    <Button variant="destructive">
                                        <LogOutIcon className="h-4 w-4" />
                                    </Button>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </>
                    ) : userPegawai ? (
                        <>
                            <NavigationMenuItem asChild>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                                    <Button variant="secondary" asChild>
                                        <Link to="/admin">
                                            <LayoutDashboardIcon className="me-3 h-4 w-4" /> Admin Panel
                                        </Link>
                                    </Button>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem asChild>
                                <NavigationMenuLink className='ms-2' onClick={logout} asChild>
                                    <Button variant="destructive">
                                        <LogOutIcon className="h-4 w-4" />
                                    </Button>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </>
                    ) : (
                        <NavigationMenuItem asChild>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                                <Link to="/login">
                                    <LogInIcon className="me-3 h-4 w-4" /> Log In
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                </NavigationMenu>
            </div>
        </section>

        <Outlet />

        <div className='bg-secondary pt-8 pb-14 rounded-t-3xl'>
            <div className="container">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <Link to="/">
                            <img src={Logo} className="h-12" />
                        </Link>
                        <h3 className="text-xl font-bold my-3">Grand Atma Hotel</h3>
                        <p className="text-muted-foreground mb-2">
                            Jl. Babarsari No. 43, Caturtunggal, Depok, Sleman, Daerah Istimewa Yogyakarta 55281
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
                                    𝕏
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
                &copy; 2023 Grand Atma Hotel. All rights reserved.
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