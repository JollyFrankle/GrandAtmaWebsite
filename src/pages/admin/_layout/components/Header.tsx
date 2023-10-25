import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/images/gah-logo.png";
import DarkModeSwitcher from "./DarkModeSwitcher";
import { LogOutIcon, MenuIcon } from "lucide-react";
import { Button } from "@/cn/components/ui/button";
import AuthHelper from "@/utils/AuthHelper";
import { BASE_URL } from "@/utils/ApiModels";
import axios from "axios";
import { toast } from "react-toastify";

export default function Header(props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
}) {
    const navigate = useNavigate()

    const logout = () => {
        const token = AuthHelper.getToken()
        AuthHelper.logout()
        navigate('/login')

        const logoutUrl = `${BASE_URL}/pegawai/logout`
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

    return (
        <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-black">
            <div className="flex flex-grow items-center justify-between h-16 px-4 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    {/* <!-- Hamburger Toggle BTN --> */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
                    >
                        <MenuIcon size={24} />
                    </button>
                    {/* <!-- Hamburger Toggle BTN --> */}

                    <Link className="block flex-shrink-0 lg:hidden" to="/">
                        <img src={Logo} alt="Logo" className="w-12" />
                    </Link>
                </div>

                <div className="hidden sm:block"></div>

                <div className="flex items-center gap-3 2xsm:gap-7">
                    <ul className="flex items-center gap-2 2xsm:gap-4">
                        {/* <!-- Dark Mode Toggler --> */}
                        <DarkModeSwitcher />
                        {/* <!-- Dark Mode Toggler --> */}

                        {/* <!-- Notification Menu Area --> */}
                        {/* <DropdownNotification /> */}
                        {/* <!-- Notification Menu Area --> */}

                        {/* <!-- Chat Notification Area --> */}
                        {/* <DropdownMessage /> */}
                        {/* <!-- Chat Notification Area --> */}
                    </ul>

                    {/* <!-- User Area --> */}
                    {/* <DropdownUser /> */}
                    {/* <!-- User Area --> */}

                    <Button variant="destructive" onClick={logout} className="ms-2">
                        <LogOutIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}