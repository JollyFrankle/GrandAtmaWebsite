import usePageTitle from "@/hooks/usePageTitle";

import Tugu from "@/assets/images/tugu-crop.png"
import PrambananHalfRight from "@/assets/images/prambanan-half-right.png"
import Logo from "@/assets/images/gah-logo.png"
import { Card, CardContent, CardHeader, CardTitle } from "@/cn/components/ui/card";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlertCircleIcon, CheckCircleIcon, Loader2Icon, UserIcon } from "lucide-react";
import { apiPublic } from "@/utils/ApiModels";
import { Button } from "@/cn/components/ui/button";

export default function PageEmailVerification() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    const [isLoading, setIsLoading] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)

    usePageTitle("Verifikasi Email - Grand Atma Hotel")

    const fetchData = () => {
        apiPublic.post(`confirm-email`, {
            token
        }).then((_) => {
            setIsLoading(false)
            setIsSuccess(true)
        }).catch((_) => {
            setIsLoading(false)
            setIsSuccess(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    return <>
        <section className="min-h-[calc(100vh-368px)] w-full relative mt-24 py-8 ps-10 md:py-10 lg:ps-0 flex justify-center items-center">
            <img src={Tugu} className="h-full absolute left-0 top-0 pointer-events-none opacity-75 -z-10" />
            <img src={PrambananHalfRight} className="h-full absolute right-0 -bottom-8 pointer-events-none opacity-75 -z-10" />

            <div className="container max-w-[576px]">
                <Card>
                    <CardHeader className="text-center border-b">
                        <img src={Logo} className="w-20 mb-4 mx-auto" />
                        <CardTitle>Verifikasi Email</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5">
                        {isLoading ? (
                            <div className="text-center">
                                <Loader2Icon className="w-20 h-20 mx-auto mb-4 animate-spin" />
                                <p>Sedang memverifikasi email...</p>
                            </div>
                        ) : (
                            isSuccess ? (
                                <div className="text-center">
                                    <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                    <p className="mb-4">Terima kasih sudah memverifikasi email Anda!</p>
                                    <Button asChild>
                                        <Link to="/login">
                                            <UserIcon className="w-5 h-5 me-2" /> Masuk
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <AlertCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
                                    <p>Verifikasi email gagal.</p>
                                    <p>Silakan hubungi Admin untuk memverifikasi email secara manual.</p>
                                </div>
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    </>
}