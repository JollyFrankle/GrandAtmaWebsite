import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";


export default function DarkModeSwitcher() {
    const [colorMode, setColorMode] = useState(localStorage.getItem('color-theme') || 'light');

    useEffect(() => {
        const className = 'dark';
        const bodyClass = window.document.body.classList;

        colorMode === 'dark'
            ? bodyClass.add(className)
            : bodyClass.remove(className);

        localStorage.setItem('color-theme', colorMode);

        return () => {
            bodyClass.remove(className);
            // agar saat pindah ke halaman lain, kembali ke theme default (light)
        }
    }, [colorMode]);

    return (
        <li>
            <label className={`relative m-0 block h-7.5 w-14 rounded-full ${colorMode === 'dark' ? 'bg-primary' : 'bg-stroke'}`}>
                <input
                    type="checkbox"
                    onChange={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
                    className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
                />
                <span className={`left-[3px] flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${colorMode === 'dark' && '!right-[3px] !translate-x-full'}`}>
                    <span className="dark:hidden">
                        <SunIcon className="w-5 h-5" />
                    </span>
                    <span className="hidden dark:inline-block text-background">
                        <MoonIcon className="w-5 h-5" />
                    </span>
                </span>
            </label>
        </li>
    );
}