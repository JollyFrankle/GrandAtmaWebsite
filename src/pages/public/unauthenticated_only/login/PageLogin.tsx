import { AsteriskIcon, MailIcon } from "lucide-react"
import { Button } from "@/cn/components/ui/button"
import ReCAPTCHA from "react-google-recaptcha"
import { createRef, useState } from "react"
import { AxiosError } from "axios"
import { ApiErrorResponse as ApiErrorResponse, ApiResponse, KeyValue, UserCustomer, UserPegawai, apiPublic } from "@/utils/ApiModels"
import usePageTitle from "@/hooks/usePageTitle"

import Tugu from "@/assets/images/tugu-crop.png"
import PrambananHalfRight from "@/assets/images/prambanan-half-right.png"
import UnderDevelopment from "@/assets/images/under-dev.jpg"
import { useNavigate } from "react-router-dom"
import AuthHelper from "@/utils/AuthHelper"
import { toast } from "react-toastify"
import IconInput from "@/components/IconInput"
import useQuery from "@/hooks/useQuery"
import InlineLink from "@/components/InlineLink"

const recaptchaRef = createRef<ReCAPTCHA>()

export default function PageLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [captcha, setCaptcha] = useState<string|null>(null)
    const [errors, setErrors] = useState<KeyValue<string>|null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const query = useQuery()

    usePageTitle("Masuk – Grand Atma Hotel")

    const formSubmitHandler = (e?: React.FormEvent<HTMLFormElement>, loginUrl = `login-customer`) => {
        e?.preventDefault()
        setIsLoading(true)
        let redirectUrl = query.get("redirect")
        if (!redirectUrl) {
            redirectUrl = localStorage.getItem("afterLoginRedirect")
        } // else go to dashboard normally
        apiPublic.post<ApiResponse<{user: UserPegawai & UserCustomer, token: string }>>(loginUrl, {
            username: email,
            password,
            recaptcha_token: captcha
        }).then((res) => {
            if (res.data.data?.user?.role) {
                const data = res.data as ApiResponse<{user: UserPegawai, token: string }>
                AuthHelper.setToken(data.data.token)
                AuthHelper.setUserPegawai(data.data.user)
                toast.success(data.message)
                if (!redirectUrl) {
                    redirectUrl = "/admin"
                }
            } else {
                const data = res.data as ApiResponse<{user: UserCustomer, token: string }>
                AuthHelper.setToken(data.data.token)
                AuthHelper.setUserCustomer(data.data.user)
                toast.success(data.message)
                if (!redirectUrl) {
                    redirectUrl = "/customer"
                }
            }
            const baseURL = window.location.origin
            navigate(redirectUrl.replace(baseURL, ""), { replace: true })
            localStorage.removeItem("afterLoginRedirect")
        }).catch((err: AxiosError) => {
            if (err.response?.data) {
                const data = err.response.data as ApiErrorResponse

                setErrors(data.errors)
                recaptchaRef.current?.reset()
                setCaptcha(null)
            } else {
                console.log(err)
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return <>
        <section className="min-h-[calc(100vh-368px)] w-full relative mt-24 py-8 md:py-10">
            <img src={Tugu} className="h-full absolute left-0 top-0 pointer-events-none opacity-50 lg:opacity-75 -z-10" />
            <img src={PrambananHalfRight} className="h-full absolute right-0 -bottom-8 pointer-events-none opacity-50 lg:opacity-75 -z-10" />

            <div className="container h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full">
                    <div className="col-span-1">
                        <p className="text-2xl">Selamat datang di</p>
                        <h2 className="text-4xl font-bold mb-6"><mark>Grand Atma</mark> Hotel</h2>

                        <form onSubmit={formSubmitHandler}>
                            <IconInput
                                required
                                size="lg"
                                icon={<MailIcon />}
                                type="email"
                                label="Alamat e-mail"
                                onValueChange={setEmail}
                                errorText={errors?.username} />

                            <IconInput
                                required
                                size="lg"
                                icon={<AsteriskIcon />}
                                type="password"
                                label="Kata sandi"
                                onValueChange={setPassword}
                                errorText={errors?.password} />

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

                            <Button className="w-full h-14 text-lg font-bold mb-2" type="submit" disabled={isLoading}>Masuk sebagai Customer</Button>
                            <Button className="w-full mb-2" type="button" onClick={() => formSubmitHandler(undefined, `login-pegawai`)} variant="link" disabled={isLoading}>Masuk sebagai Pegawai</Button>

                            <div className="text-center">
                                Belum punya akun?
                                <InlineLink to="/register" className="mx-2">Buat akun</InlineLink>
                                <InlineLink to="/reset-password">Lupa Password?</InlineLink>
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