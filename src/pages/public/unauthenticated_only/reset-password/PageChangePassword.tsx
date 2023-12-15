import usePageTitle from "@/hooks/usePageTitle";

import Tugu from "@/assets/images/tugu-crop.png"
import PrambananHalfRight from "@/assets/images/prambanan-half-right.png"
import Logo from "@/assets/images/gah-logo.png"
import { Card, CardContent, CardHeader, CardTitle } from "@/cn/components/ui/card";
import { Link, useSearchParams } from "react-router-dom";
import { createRef, useState } from "react";
import { AsteriskIcon, CheckCircleIcon, Loader2Icon } from "lucide-react";
import { AxiosError } from "axios";
import { ApiErrorResponse, ApiResponse, KeyValue, apiPublic } from "@/utils/ApiModels";
import { Button } from "@/cn/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import IconInput from "@/components/IconInput";

const recaptchaRef = createRef<ReCAPTCHA>()

export default function PageChangePassword() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [captcha, setCaptcha] = useState<string|null>(null)
    const [errors, setErrors] = useState<KeyValue<string>|null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    usePageTitle("Reset Password – Grand Atma Hotel")

    const onFormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password !== passwordConfirmation) {
            setErrors(err => ({
                ...err,
                password: "Kata sandi tidak sama",
                passconf: "Kata sandi tidak sama"
            }))
            return
        }
        apiPublic.patch<ApiResponse<unknown>>(`reset-password/${token}`, {
            password: password,
            recaptcha_token: captcha
        }).then(() => {
            setIsLoading(false)
            setIsSuccess(true)
        }).catch((err: AxiosError) => {
            setIsLoading(false)
            setIsSuccess(false)
            if (err.response?.data) {
                const data = err.response?.data as ApiErrorResponse
                setErrors(data.errors)
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
                            <p>Kata sandi Anda berhasil diubah.</p>
                            <Button className="mt-4" asChild>
                                <Link to="/login">Log in</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={onFormSubmitHandler}>
                            <IconInput
                                required
                                icon={<AsteriskIcon />}
                                type="password"
                                label="Kata sandi baru"
                                maxLength={100}
                                onValueChange={setPassword}
                                errorText={errors?.password} />

                            <IconInput
                                required
                                icon={<AsteriskIcon />}
                                type="password"
                                label="Konfirmasi kata sandi"
                                maxLength={100}
                                onValueChange={setPasswordConfirmation}
                                errorText={errors?.passconf} />

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

                            <Button className="w-full h-14 text-lg font-bold" type="submit">Ganti Kata Sandi</Button>
                        </form>
                    )}
                    </CardContent>
                </Card>
            </div>
        </section>
    </>
}