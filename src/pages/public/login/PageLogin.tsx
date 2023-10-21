import { Input } from "@/cn/components/ui/input"
import { Label } from "@/cn/components/ui/label"
import InputWithIcon from "../_layout/components/InputWithIcon"
import { AsteriskIcon, MailIcon } from "lucide-react"
import { Button } from "@/cn/components/ui/button"
import ReCAPTCHA from "react-google-recaptcha"
import { createRef, useState } from "react"
import axios, { AxiosError } from "axios"
import { ApiError as ApiErrorResponse, ApiResponse, BASE_URL, KeyValue, UserCustomer, UserPegawai } from "@/utils/ApiModels"
import { useToast } from "@/cn/components/ui/use-toast"
import usePageTitle from "@/hooks/usePageTitle"

import Tugu from "@/assets/images/tugu-crop.png"
import PrambananHalfRight from "@/assets/images/prambanan-half-right.png"
import UnderDevelopment from "@/assets/images/under-dev.jpg"
import { Link, useNavigate } from "react-router-dom"
import AuthHelper from "@/utils/AuthHelper"

const recaptchaRef = createRef<ReCAPTCHA>()

export default function PageLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [captcha, setCaptcha] = useState<string|null>(null)
    const [errors, setErrors] = useState<KeyValue<string>|null>(null)

    const { toast } = useToast()
    const navigate = useNavigate()

    usePageTitle("Masuk - Grand Atma Hotel")

    const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        axios.post(`${BASE_URL}/login`, {
            username: email,
            password,
            recaptcha_token: captcha
        }).then((res) => {
            if (res.data.message === "Berhasil masuk sebagai pegawai") {
                const data = res.data as ApiResponse<{user: UserPegawai, token: string }>
                AuthHelper.setToken(data.data.token)
                AuthHelper.setUserPegawai(data.data.user)
                // TODO: create dashboard for pegawai
            } else {
                const data = res.data as ApiResponse<{user: UserCustomer, token: string }>
                AuthHelper.setToken(data.data.token)
                AuthHelper.setUserCustomer(data.data.user)
                navigate("/customer")
            }
            toast({
                title: "Berhasil",
                content: "Anda berhasil masuk",
            })
        }).catch((err: AxiosError) => {
            if (err.response?.data) {
                const data = err.response.data as ApiErrorResponse
                setErrors(data.errors)

                if (!data.errors) {
                    toast({
                        title: data.message,
                        content: err.message,
                        variant: "destructive"
                    })
                    recaptchaRef.current?.reset()
                }
            } else {
                console.log(err)
                toast({
                    title: "Unknown error. Silakan hubungi pengembang.",
                    content: err.message,
                    variant: "destructive"
                })
            }
        })
        e.preventDefault()
    }

    return <>
        <section className="min-h-[calc(100vh-368px)] w-full relative mt-24 py-8 ps-10 md:py-10 lg:ps-0">
            <img src={Tugu} className="h-full absolute left-0 top-0 pointer-events-none opacity-75 -z-10" />
            <img src={PrambananHalfRight} className="h-full absolute right-0 -bottom-8 pointer-events-none opacity-75 -z-10" />

            <div className="container h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full">
                    <div className="col-span-1">
                        <p className="text-2xl">Selamat datang di</p>
                        <h2 className="text-4xl font-bold mb-6"><mark>Grand Atma</mark> Hotel</h2>

                        <form onSubmit={formSubmitHandler}>
                            <Label className="mb-4 block">
                                <div className="mb-1 text-lg">Alamat e-mail</div>
                                <InputWithIcon icon={<MailIcon />} className="w-full mb-2">
                                    <Input className="text-lg h-14 ps-9" placeholder="Alamat e-mail" type="email" onChange={(e) =>setEmail(e.target.value)} />
                                </InputWithIcon>
                                {errors?.username && (
                                    <div className="text-sm text-red-500">{errors.username}</div>
                                )}
                            </Label>

                            <Label className="mb-4 block">
                                <div className="mb-1 text-lg">Kata sandi</div>
                                <InputWithIcon icon={<AsteriskIcon />} className="w-full mb-2">
                                    <Input className="text-lg h-14 ps-9" placeholder="Kata sandi" type="password" onChange={(e) => setPassword(e.target.value)} />
                                </InputWithIcon>
                                {errors?.password && (
                                    <div className="text-sm text-red-500">{errors.password}</div>
                                )}
                            </Label>

                            <div className="mb-4">
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    className="w-fit mx-auto"
                                    sitekey="6LdLqLkoAAAAAIloQSNV8P0GrwsGCLZPFq8Ii9Rr"
                                    onChange={setCaptcha}
                                    hl="id" />
                                {errors?.recaptcha_token && (
                                    <div className="text-sm text-center text-red-500">{errors.recaptcha_token}</div>
                                )}
                            </div>

                            <Button className="w-full h-14 text-lg font-bold mb-3" type="submit">Masuk</Button>

                            <div className="text-center">
                                Belum punya akun?
                                <Button variant="link" className="ms-2 p-0 text-md" asChild>
                                    <Link to="/register">Daftar</Link>
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className="col-span-1 lg:col-span-2 flex items-center">
                        <img src={UnderDevelopment} className="w-full h-auto my-auto shadow-lg" />
                    </div>
                </div>
            </div>
        </section>
    </>
}