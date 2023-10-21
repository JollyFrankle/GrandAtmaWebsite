import usePageTitle from "@/hooks/usePageTitle";
import { ApiErrorResponse, ApiResponse, BASE_URL, KeyValue, UserCustomer } from "@/utils/ApiModels";
import { createRef, useEffect, useState } from "react";
import InputWithIcon from "../_layout/components/InputWithIcon";
import { Input } from "@/cn/components/ui/input";
import { AsteriskIcon, BookUserIcon, CreditCardIcon, MailIcon, MapPinIcon, UserIcon } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/cn/components/ui/select";
import { Textarea } from "@/cn/components/ui/textarea";

import Tugu from "@/assets/images/tugu-crop.png"
import PrambananHalfRight from "@/assets/images/prambanan-half-right.png"
import ReCAPTCHA from "react-google-recaptcha";
import { Checkbox } from "@/cn/components/ui/checkbox";
import { Button } from "@/cn/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/cn/components/ui/card";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import AuthHelper from "@/utils/AuthHelper";

const recaptchaRef = createRef<ReCAPTCHA>()

export default function PageRegister() {
    const userC = AuthHelper.getUserCustomer()
    const userP = AuthHelper.getUserPegawai()
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

    usePageTitle("Registrasi - Grand Atma Hotel")

    const navigate = useNavigate()

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
        axios.post(`${BASE_URL}/register`, {
            ...data,
            recaptcha_token: captcha,
        }).then((res) => {
            const data = res.data as ApiResponse<UserCustomer>
            toast(data.message, {
                type: "success"
            })
            navigate("/login")
        }).catch((err: AxiosError) => {
            if (err.response?.data) {
                const data = err.response.data as ApiErrorResponse
                if (!data.errors) {
                    toast(data.message, {
                        type: "error"
                    })
                } else {
                    setErrors(data.errors)
                }
                recaptchaRef.current?.reset()
            } else {
                console.log(err)
                toast("Gagal registrasi. Silakan hubungi pengelola.", {
                    type: "error"
                })
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }

    useEffect(() => {
        if (userC) {
            navigate("/customer")
        } else if (userP) {
            navigate("/")
        }
    }, [])

    return <>
        <section className="min-h-[calc(100vh-368px)] w-full relative mt-24 py-8 ps-10 md:py-10 lg:ps-0 overflow-hidden">
            <img src={Tugu} className="h-full absolute left-0 top-0 pointer-events-none opacity-75 -z-10" />
            <img src={PrambananHalfRight} className="h-full absolute right-0 -bottom-8 pointer-events-none opacity-75 -z-10" />

            <div className="container h-full">
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full" onSubmit={doRegister}>
                    <div className="col-span-1">
                        <p className="text-2xl">Mari bergabung</p>
                        <h2 className="text-4xl font-bold mb-4"><mark>Grand Atma</mark> Hotel</h2>

                        <p className="text-lg mb-8">Buatlah Grand Atma Account Anda sekarang juga dan raih kesempatan mendapat <mark>diskon 90%</mark> hingga <strong>Rp 1.000</strong>!</p>

                        <h4 className="text-xl font-bold mb-2">Otentikasi</h4>

                        <label className="mb-4 block">
                            <div className="mb-1">Alamat e-mail</div>
                            <InputWithIcon icon={<MailIcon />}>
                                <Input required className="ps-9 w-full" placeholder="Alamat e-mail" type="text" value={data.email} onChange={(e) => onInputChangeHandler(e.target.value, "email")} />
                            </InputWithIcon>
                        {errors?.email && (
                            <div className="mt-2 text-sm text-red-500">{errors.email}</div>
                        )}
                        </label>

                        <label className="mb-4 block">
                            <div className="mb-1">Password</div>
                            <InputWithIcon icon={<AsteriskIcon />}>
                                <Input required className="ps-9 w-full" placeholder="Password" type="password" onChange={(e) => onInputChangeHandler(e.target.value, "password")} />
                            </InputWithIcon>
                        {errors?.password && (
                            <div className="mt-2 text-sm text-red-500">{errors.password}</div>
                        )}
                        </label>

                        <label className="mb-4 block">
                            <div className="mb-1">Konfirmasi password</div>
                            <InputWithIcon icon={<AsteriskIcon />}>
                                <Input required className="ps-9 w-full" placeholder="Konfirmasi password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                            </InputWithIcon>
                        {errors?.password && (
                            <div className="mt-2 text-sm text-red-500">{errors.passconf}</div>
                        )}
                        </label>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-xl font-bold mb-2">Identitas</h4>
                        <label className="mb-4 block">
                            <div className="mb-1">Nama</div>
                            <InputWithIcon icon={<UserIcon />}>
                                <Input required maxLength={100} className="ps-9 w-full" placeholder="Nama" type="text" value={data.nama} onChange={(e) => onInputChangeHandler(e.target.value, "nama")} />
                            </InputWithIcon>
                        {errors?.nama && (
                            <div className="mt-2 text-sm text-red-500">{errors.nama}</div>
                        )}
                        </label>

                        <label className="mb-4 block">
                            <div className="mb-1">Nomor telepon</div>
                            <InputWithIcon icon={<MailIcon />}>
                                <Input required maxLength={50} className="ps-9 w-full" placeholder="Nomor telepon" type="text" value={data.no_telp} onChange={(e) => onInputChangeHandler(e.target.value, "no_telp")} />
                            </InputWithIcon>
                        {errors?.no_telp && (
                            <div className="mt-2 text-sm text-red-500">{errors.no_telp}</div>
                        )}
                        </label>

                        <label className="mb-4 block">
                            <div className="mb-1">Jenis identitas</div>
                            <InputWithIcon icon={<CreditCardIcon />}>
                                <Select required value={data.jenis_identitas} onValueChange={(value) => onInputChangeHandler(value, "jenis_identitas")}>
                                    <SelectTrigger className="ps-9 w-full">
                                        <SelectValue placeholder="Pilih jenis identitas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Pilih jenis identitas</SelectLabel>
                                            <SelectItem value="ktp">KTP</SelectItem>
                                            <SelectItem value="sim">SIM</SelectItem>
                                            <SelectItem value="paspor">Paspor</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </InputWithIcon>
                        {errors?.jenis_identitas && (
                            <div className="mt-2 text-sm text-red-500">{errors.jenis_identitas}</div>
                        )}
                        </label>

                        <label className="mb-4 block">
                            <div className="mb-1">Nomor identitas</div>
                            <InputWithIcon icon={<BookUserIcon />}>
                                <Input required maxLength={20} className="ps-9 w-full" placeholder="Nomor identitas" type="text" value={data.no_identitas} onChange={(e) => onInputChangeHandler(e.target.value, "no_identitas")} />
                            </InputWithIcon>
                        {errors?.no_identitas && (
                            <div className="mt-2 text-sm text-red-500">{errors.no_identitas}</div>
                        )}
                        </label>

                        <label className="mb-4 block">
                            <div className="mb-1">Alamat</div>
                            <InputWithIcon icon={<MapPinIcon />}>
                                <Textarea required maxLength={254} className="ps-9 w-full" placeholder="Alamat" value={data.alamat} rows={5} onChange={(e) => onInputChangeHandler(e.target.value, "alamat")} />
                            </InputWithIcon>
                        {errors?.alamat && (
                            <div className="mt-2 text-sm text-red-500">{errors.alamat}</div>
                        )}
                        </label>
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
                                <Button variant="link" className="h-auto p-0 mx-1 text-sm" type="button">Syarat dan Ketentuan</Button>
                                serta
                                <Button variant="link" className="h-auto p-0 mx-1 text-sm" type="button">Kebijakan Privasi</Button>
                                yang berlaku.</label>
                        </div>

                        <Button className="w-full h-14 text-lg font-bold mb-3" type="submit" disabled={isLoading}>Buatkan Akun</Button>

                            <div className="text-center">
                                Sudah punya akun?
                                <Button variant="link" className="ms-2 p-0 text-md" asChild>
                                    <Link to="/login">Log in</Link>
                                </Button>
                            </div>
                    </div>
                </form>
            </div>
        </section>
    </>
}