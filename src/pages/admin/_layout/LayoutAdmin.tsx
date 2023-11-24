import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import AuthHelper from '@/utils/AuthHelper';

export default function LayoutAdmin() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAdmin] = useState(AuthHelper.getUserPegawai() !== null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAdmin) {
            navigate(`/login?${new URLSearchParams({ redirect: window.location.href }).toString()}`)
        }
    }, [])

    return isAdmin && (
        <section className="">
            {/* <!-- ===== Page Wrapper Start ===== --> */}
            <div className="flex h-screen overflow-hidden">
                {/* <!-- ===== Sidebar Start ===== --> */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                {/* <!-- ===== Sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    {/* <!-- ===== Header Start ===== --> */}
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    {/* <!-- ===== Header End ===== --> */}

                    {/* <!-- ===== Main Content Start ===== --> */}
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            <Outlet />
                        </div>
                    </main>
                    {/* <!-- ===== Main Content End ===== --> */}
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
            </div>
            {/* <!-- ===== Page Wrapper End ===== --> */}
        </section>
    );
}