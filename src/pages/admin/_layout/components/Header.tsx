import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/images/gah-inline-logo.png";
import DarkModeSwitcher from "./DarkModeSwitcher";
import { LogOutIcon, MenuIcon } from "lucide-react";
import { Button } from "@/cn/components/ui/button";
import AuthHelper from "@/utils/AuthHelper";
import { ApiResponse, apiAuthenticated } from "@/utils/ApiModels";
import { toast } from "react-toastify";

export default function Header(props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
}) {
    const navigate = useNavigate()

    const logout = () => {
        const logoutUrl = `pegawai/logout`
        apiAuthenticated.post<ApiResponse<unknown>>(logoutUrl).then(() => {
            toast("Berhasil log out.", {
                type: "success"
            })
        }).catch((err) => {
            console.log(err)
        })

        AuthHelper.logout()
        navigate('/login')
    }

    return (
        <header className="sticky top-0 z-10 shadow flex w-full bg-white drop-shadow-1 dark:bg-slate-900">
            <div className="flex flex-grow items-center justify-between h-16 px-4 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    {/* <!-- Hamburger Toggle BTN --> */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        className="z-99999 block rounded-sms bg-white p-2 dark:bg-transparent lg:hidden"
                    >
                        <MenuIcon size={24} />
                    </button>
                    {/* <!-- Hamburger Toggle BTN --> */}

                    <Link to="/admin/" className="bg-white py-2 px-3 rounded text-black">
                        <img src={Logo} alt="Logo" className="h-7 inline me-2" />
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