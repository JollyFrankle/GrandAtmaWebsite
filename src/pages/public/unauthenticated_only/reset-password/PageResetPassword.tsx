import usePageTitle from "@/hooks/usePageTitle";

import Tugu from "@/assets/images/tugu-crop.png"
import PrambananHalfRight from "@/assets/images/prambanan-half-right.png"
import Logo from "@/assets/images/gah-logo.png"
import { Card, CardContent, CardHeader, CardTitle } from "@/cn/components/ui/card";
import { Link } from "react-router-dom";
import { createRef, useState } from "react";
import {  CheckCircleIcon, Loader2Icon, MailIcon } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiErrorResponse, BASE_URL, KeyValue } from "@/utils/ApiModels";
import { Button } from "@/cn/components/ui/button";
import { toast } from "react-toastify";
import { RadioGroup, RadioGroupItem } from "@/cn/components/ui/radio-group";
import ReCAPTCHA from "react-google-recaptcha";
import IconInput from "@/components/IconInput";

const recaptchaRef = createRef<ReCAPTCHA>()

export default function PageResetPassword() {
    const [email, setEmail] = useState("")
    const [type, setType] = useState("c")
    const [captcha, setCaptcha] = useState<string|null>(null)
    const [errors, setErrors] = useState<KeyValue<string>|null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    usePageTitle("Reset Password - Grand Atma Hotel")

    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        // Send email
        e.preventDefault()
        setIsLoading(true)
        axios.post(`${BASE_URL}/reset-password`, {
            email,
            type,
            recaptcha_token: captcha
        }).then((_) => {
            setIsLoading(false)
            setIsSuccess(true)
        }).catch((err: AxiosError) => {
            setIsLoading(false)
            setIsSuccess(false)
            if (err.response?.data) {
                const data = err.response?.data as ApiErrorResponse
                setErrors(data.errors)
                toast(data.message, {
                    type: "error"
                })
            }
            recaptchaRef.current?.reset()
            setCaptcha(null)
        })
    }

    return <>
        <section className="min-h-[calc(100vh-368px)] w-full relative mt-24 py-8 ps-10 md:py-10 lg:ps-0 flex justify-center items-center">
            <img src={Tugu} className="h-full absolute left-0 top-0 pointer-events-none opacity-75 -z-10" />
            <img src={PrambananHalfRight} className="h-full absolute right-0 -bottom-8 pointer-events-none opacity-75 -z-10" />

            <div className="container max-w-[576px]">
                <Card>
                    <CardHeader className="text-center border-b">
                        <img src={Logo} className="w-20 mb-4 mx-auto" />
                        <CardTitle>Atur Ulang Kata Sandi</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5">
                    {isLoading ? (
                        <div className="text-center">
                            <Loader2Icon className="w-20 h-20 mx-auto mb-4 animate-spin" />
                        </div>
                    ) : isSuccess ? (
                        <div className="text-center">
                            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                            <p>Email pemulihan telah dikirim ke alamat e-mail Anda.</p>
                            <Button variant="link" className="p-0 text-md" asChild>
                                <Link to="/login">Kembali ke halaman log in</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={onSubmitHandler}>
                            <IconInput
                                required
                                size="lg"
                                icon={<MailIcon />}
                                type="email"
                                label="Alamat e-mail"
                                maxLength={100}
                                onValueChange={setEmail}
                                value={email}
                                errorText={errors?.email} />

                            <RadioGroup className="flex justify-center" defaultValue="c" value={type} onValueChange={(type) => setType(type)}>
                                <div className="flex items-center space-x-2 me-2">
                                    <RadioGroupItem value="c" id="uType_c" />
                                    <label htmlFor="uType_c">Customer</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="p" id="uType_p" />
                                    <label htmlFor="uType_p">Pegawai</label>
                                </div>
                            </RadioGroup>
                            {errors?.type && (
                                <div className="text-sm text-red-500">{errors.type}</div>
                            )}

                            <div className="my-4">
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

                            <Button className="w-full h-14 text-lg font-bold mb-3" type="submit">Kirim Email Pemulihan</Button>

                            <div className="text-center">
                                <Button variant="link" className="p-0 text-md" asChild disabled={isLoading}>
                                    <Link to="/login">Log in</Link>
                                </Button>
                                <Button variant="link" className="ms-2 p-0 text-md" asChild disabled={isLoading}>
                                    <Link to="/register">Daftar akun</Link>
                                </Button>
                            </div>
                        </form>
                    )}
                    </CardContent>
                </Card>
            </div>
        </section>
    </>
}