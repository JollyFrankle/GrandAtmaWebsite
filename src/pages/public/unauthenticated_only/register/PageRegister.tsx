import usePageTitle from "@/hooks/usePageTitle";
import { ApiErrorResponse, ApiResponse, KeyValue, UserCustomer, apiPublic } from "@/utils/ApiModels";
import { createRef, useState } from "react";
import { AsteriskIcon, BookUserIcon, CreditCardIcon, MailIcon, MapPinIcon, PhoneCallIcon, UserIcon } from "lucide-react";

import Tugu from "@/assets/images/tugu-crop.png"
import PrambananHalfRight from "@/assets/images/prambanan-half-right.png"
import ReCAPTCHA from "react-google-recaptcha";
import { Checkbox } from "@/cn/components/ui/checkbox";
import { Button } from "@/cn/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/cn/components/ui/card";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import IconInput from "@/components/IconInput";
import IconSelect from "@/components/IconSelect";
import IconTextarea from "@/components/IconTextarea";
import InlineButton from "@/components/InlineButton";
import InlineLink from "@/components/InlineLink";

const recaptchaRef = createRef<ReCAPTCHA>()

export default function PageRegister() {
    const [data, setData] = useState<UserCustomer>({
        id: 0,
        type: 'p',
        nama: "",
        email: "",
        password: "",
        alamat: "",
        no_telp: "",
        no_identitas: "",
        jenis_identitas: ""
    })
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState<KeyValue<string>>({})
    const [captcha, setCaptcha] = useState<string|null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    usePageTitle("Registrasi – Grand Atma Hotel")

    const onInputChangeHandler = (value: string, key: keyof typeof data) => {
        setData(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const doRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (data.password !== confirmPassword) {
            setErrors(prev => ({
                ...prev,
                password: "Password dan konfirmasi password tidak sama",
                passconf: "Password dan konfirmasi password tidak sama"
            }))
            return
        }

        setIsLoading(true)
        apiPublic.post<ApiResponse<UserCustomer>>(`register`, {
            ...data,
            recaptcha_token: captcha,
        }).then((res) => {
            const data = res.data
            toast.success(data.message)
            navigate("/login")
        }).catch((err: AxiosError) => {
            if (err.response?.data) {
                const data = err.response.data as ApiErrorResponse
                if (data.errors) {
                    setErrors(data.errors)
                }
                recaptchaRef.current?.reset()
                setCaptcha(null)
            } else {
                console.log(err)
                toast.error("Gagal registrasi. Silakan hubungi pengelola.")
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return <>
        <section className="min-h-[calc(100vh-368px)] w-full relative mt-24 py-8 md:py-10 overflow-hidden">
            <img src={Tugu} className="h-full absolute left-0 top-0 pointer-events-none opacity-50 lg:opacity-75 -z-10" />
            <img src={PrambananHalfRight} className="h-full absolute right-0 -bottom-8 pointer-events-none opacity-50 lg:opacity-75 -z-10" />

            <div className="container h-full">
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full" onSubmit={doRegister}>
                    <div className="col-span-1">
                        <p className="text-2xl">Mari bergabung</p>
                        <h2 className="text-4xl font-bold mb-4"><mark>Grand Atma</mark> Hotel</h2>

                        <p className="text-lg mb-8">Buatlah Grand Atma Account Anda sekarang juga dan raih kesempatan mendapat <mark>diskon 90%</mark> hingga <strong>Rp 1.000</strong>!</p>

                        <h4 className="text-xl font-bold mb-2">Otentikasi</h4>
                        <IconInput
                            required
                            icon={<MailIcon />}
                            type="email"
                            label="Alamat e-mail"
                            maxLength={100}
                            onValueChange={(value) => onInputChangeHandler(value, "email")}
                            errorText={errors?.email} />

                        <IconInput
                            required
                            icon={<AsteriskIcon />}
                            type="password"
                            label="Password"
                            maxLength={100}
                            onValueChange={(value) => onInputChangeHandler(value, "password")}
                            errorText={errors?.password} />

                        <IconInput
                            required
                            icon={<AsteriskIcon />}
                            type="password"
                            label="Konfirmasi password"
                            maxLength={100}
                            onValueChange={(value) => setConfirmPassword(value)}
                            errorText={errors?.passconf} />
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-xl font-bold mb-2">Identitas & Kontak</h4>

                        <IconInput
                            required
                            icon={<UserIcon />}
                            type="text"
                            label="Nama"
                            maxLength={100}
                            onValueChange={(value) => onInputChangeHandler(value, "nama")}
                            errorText={errors?.nama} />

                        <IconSelect
                            required
                            icon={<CreditCardIcon />}
                            label="Jenis identitas"
                            onValueChange={(value) => onInputChangeHandler(value, "jenis_identitas")}
                            errorText={errors?.jenis_identitas}
                            values={[
                                { value: "ktp", label: "KTP" },
                                { value: "sim", label: "SIM" },
                                { value: "paspor", label: "Paspor" }
                            ]} />

                        <IconInput
                            required
                            icon={<BookUserIcon />}
                            type="text"
                            label="Nomor identitas"
                            maxLength={20}
                            onValueChange={(value) => onInputChangeHandler(value, "no_identitas")}
                            errorText={errors?.no_identitas} />

                        <IconInput
                            required
                            icon={<PhoneCallIcon />}
                            type="text"
                            label="Nomor telepon"
                            maxLength={50}
                            onValueChange={(value) => onInputChangeHandler(value, "no_telp")}
                            errorText={errors?.no_telp} />

                        <IconTextarea
                            required
                            icon={<MapPinIcon />}
                            label="Alamat"
                            maxLength={254}
                            rows={3}
                            onValueChange={(value) => onInputChangeHandler(value, "alamat")}
                            errorText={errors?.alamat} />
                    </div>

                    <div className="col-span-1">
                        <h4 className="text-xl font-bold mb-2">Finalisasi</h4>

                        <Card className="mb-4">
                            <CardHeader>
                                <CardTitle>Grand Atma Account</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Grand Atma Account Anda akan digunakan untuk login ke website ini. Pastikan Anda mengingat alamat e-mail dan password Anda.
                            </CardContent>
                        </Card>
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

                        <div className="flex items-center space-x-2 mb-4">
                            <Checkbox required id="terms" />
                            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Saya telah membaca dan menyetujui
                                <InlineButton>Syarat dan Ketentuan</InlineButton>
                                serta
                                <InlineButton>Kebijakan Privasi</InlineButton>
                                yang berlaku.
                            </label>
                        </div>

                        <Button className="w-full h-14 text-lg font-bold mb-3" type="submit" disabled={isLoading}>Buatkan Akun</Button>

                        <div className="text-center">
                            Sudah punya akun?
                            <InlineLink to="/login" className="mx-2">Masuk akun</InlineLink>
                            <InlineLink to="/reset-password">Lupa Password?</InlineLink>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    </>
}