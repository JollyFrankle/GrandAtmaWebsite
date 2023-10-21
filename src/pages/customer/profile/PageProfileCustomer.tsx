import { Button } from "@/cn/components/ui/button"
import { Input } from "@/cn/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/cn/components/ui/select"
import { Textarea } from "@/cn/components/ui/textarea"
import InputWithIcon from "@/pages/public/_layout/components/InputWithIcon"
import { ApiErrorResponse, ApiResponse, BASE_URL, KeyValue, UserCustomer } from "@/utils/ApiModels"
import AuthHelper from "@/utils/AuthHelper"
import axios, { AxiosError } from "axios"
import { ArrowLeftIcon, AsteriskIcon, BanIcon, BookUserIcon, CreditCardIcon, EditIcon, MailIcon, MapPinIcon, SaveIcon, UserIcon } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"



export default function PageProfileCustomer() {
    const user = AuthHelper.getUserCustomer()!!
    user.password = ""
    const [isEditing, setIsEditing] = useState(false)
    const [data, setData] = useState(user)
    const [errors, setErrors] = useState<KeyValue<string>|null>(null)

    const onInputChangeHandler = (value: string, key: keyof typeof data) => {
        setData(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const resetToDefault = () => {
        setData(user)
        setIsEditing(false)
    }

    const saveProfile = (e: React.FormEvent<HTMLFormElement>) => {
        axios.put(`${BASE_URL}/customer/user`, data, {
            headers: {
                Authorization: `Bearer ${AuthHelper.getToken()}`
            }
        }).then((res) => {
            const data = res.data as ApiResponse<UserCustomer>
            data.data.password = ""
            AuthHelper.setUserCustomer(data.data)
            setData(data.data)
            setIsEditing(false)
            toast(data.message, {
                type: "success"
            })
        }).catch((err: AxiosError) => {
            console.log(err)
            if (err.response?.data) {
                const data = err.response.data as ApiErrorResponse
                setErrors(data.errors)
                toast(data.message || "Terjadi kesalahan", {
                    type: "error"
                })
            }
        })
        e.preventDefault()
    }

    return <>
        <section className="mt-24 py-8">
            <div className="container relative">
                <div className="flex justify-between items-end">
                    <h3 className="text-3xl font-bold">
                        <Button variant="ghost" asChild className="me-2">
                            <Link to="/customer"><ArrowLeftIcon className="h-4 w-4" /></Link>
                        </Button>
                        <mark>Profil</mark> Anda
                    </h3>
                    {!isEditing && (
                        <Button onClick={() => setIsEditing(true)}>
                            <EditIcon className="h-4 w-4 me-2" /> Ubah Profil
                        </Button>
                    )}
                </div>

                <hr className="my-6" />

                <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={saveProfile}>
                    <div className="col-span-1">
                        <h4 className="text-xl font-bold mb-2">Otentikasi</h4>
                        <label className="mb-4 block">
                            <div className="mb-1">Alamat e-mail</div>
                            <InputWithIcon icon={<AsteriskIcon />}>
                                <Input required className="ps-9 w-full" placeholder="Alamat e-mail" type="text" value={data.email} disabled={!isEditing} onChange={(e) => onInputChangeHandler(e.target.value, "email")} />
                            </InputWithIcon>
                        {errors?.email && (
                            <div className="mt-2 text-sm text-red-500">{errors.email}</div>
                        )}
                        </label>

                    {isEditing && (
                        <label className="mb-4 block">
                            <div className="mb-1">Password <span className="text-sm">(kosongkan jika tidak ingin diubah)</span></div>
                            <InputWithIcon icon={<MailIcon />}>
                                <Input className="ps-9 w-full" placeholder="Password" type="password" disabled={!isEditing} onChange={(e) => onInputChangeHandler(e.target.value, "password")} />
                            </InputWithIcon>
                        {errors?.password && (
                            <div className="mt-2 text-sm text-red-500">{errors.password}</div>
                        )}
                        </label>
                    )}

                        <label className="mb-4 block">
                            <div className="mb-1">Nomor telepon</div>
                            <InputWithIcon icon={<MailIcon />}>
                                <Input required maxLength={50} className="ps-9 w-full" placeholder="Nomor telepon" type="text" value={data.no_telp} disabled={!isEditing} onChange={(e) => onInputChangeHandler(e.target.value, "no_telp")} />
                            </InputWithIcon>
                        {errors?.no_telp && (
                            <div className="mt-2 text-sm text-red-500">{errors.no_telp}</div>
                        )}
                        </label>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-xl font-bold mb-2">Identitas</h4>
                        <label className="mb-4 block">
                            <div className="mb-1">Nama</div>
                            <InputWithIcon icon={<UserIcon />}>
                                <Input required maxLength={100} className="ps-9 w-full" placeholder="Nama" type="text" value={data.nama} disabled={!isEditing} onChange={(e) => onInputChangeHandler(e.target.value, "nama")} />
                            </InputWithIcon>
                        {errors?.nama && (
                            <div className="mt-2 text-sm text-red-500">{errors.nama}</div>
                        )}
                        </label>

                        <label className="mb-4 block">
                            <div className="mb-1">Jenis identitas</div>
                            <InputWithIcon icon={<CreditCardIcon />}>
                                <Select required value={data.jenis_identitas} disabled={!isEditing} onValueChange={(value) => onInputChangeHandler(value, "jenis_identitas")}>
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
                                <Input required maxLength={20} className="ps-9 w-full" placeholder="Nomor identitas" type="text" value={data.no_identitas} disabled={!isEditing} onChange={(e) => onInputChangeHandler(e.target.value, "no_identitas")} />
                            </InputWithIcon>
                        {errors?.no_identitas && (
                            <div className="mt-2 text-sm text-red-500">{errors.no_identitas}</div>
                        )}
                        </label>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-xl font-bold mb-2">Identitas</h4>

                        <label className="mb-4 block">
                            <div className="mb-1">Alamat</div>
                            <InputWithIcon icon={<MapPinIcon />}>
                                <Textarea required maxLength={254} className="ps-9 w-full" placeholder="Alamat" value={data.alamat} disabled={!isEditing} rows={5} onChange={(e) => onInputChangeHandler(e.target.value, "alamat")} />
                            </InputWithIcon>
                        {errors?.alamat && (
                            <div className="mt-2 text-sm text-red-500">{errors.alamat}</div>
                        )}
                        </label>
                    </div>
                {isEditing && (
                    <div className="col-span-3 text-center">
                        <Button className="w-full md:w-auto me-3" variant="secondary" onClick={resetToDefault}><BanIcon className="w-4 h-4 me-2" /> Batal</Button>
                        <Button className="w-full md:w-auto" type="submit"><SaveIcon className="w-4 h-4 me-2" /> Simpan</Button>
                    </div>
                )}
                </form>
            </div>
        </section>
    </>
}