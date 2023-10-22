import { Button } from "@/cn/components/ui/button"
import IconInput from "@/components/IconInput"
import IconSelect from "@/components/IconSelect"
import IconTextarea from "@/components/IconTextarea"
import usePageTitle from "@/hooks/usePageTitle"
import { ApiErrorResponse, ApiResponse, BASE_URL, KeyValue, UserCustomer } from "@/utils/ApiModels"
import AuthHelper from "@/utils/AuthHelper"
import axios, { AxiosError } from "axios"
import { ArrowLeftIcon, AsteriskIcon, BanIcon, BookUserIcon, CreditCardIcon, EditIcon, MailIcon, MapPinIcon, PhoneCallIcon, SaveIcon, UserIcon } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"


export default function PageProfileCustomer() {
    const user = AuthHelper.getUserCustomer()!!
    user.password = ""
    const [isEditing, setIsEditing] = useState(false)
    const [data, setData] = useState(user)
    const [errors, setErrors] = useState<KeyValue<string> | null>(null)

    usePageTitle("Profil - Grand Atma Hotel")

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
                        <IconInput
                            required
                            disabled={!isEditing}
                            value={data.email}
                            icon={<MailIcon />}
                            type="email"
                            label="Alamat e-mail"
                            maxLength={100}
                            onValueChange={(value) => onInputChangeHandler(value, "email")}
                            errorText={errors?.email} />

                        {isEditing &&
                            <IconInput
                                disabled={!isEditing}
                                value={data.password}
                                icon={<AsteriskIcon />}
                                type="password"
                                label="Password"
                                maxLength={100}
                                onValueChange={(value) => onInputChangeHandler(value, "password")}
                                errorText={errors?.password} />
                        }
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-xl font-bold mb-2">Identitas</h4>
                        <IconInput
                            required
                            disabled={!isEditing}
                            value={data.nama}
                            icon={<UserIcon />}
                            type="text"
                            label="Nama"
                            maxLength={100}
                            onValueChange={(value) => onInputChangeHandler(value, "nama")}
                            errorText={errors?.nama} />

                        <IconSelect
                            required
                            disabled={!isEditing}
                            value={data.jenis_identitas}
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
                            disabled={!isEditing}
                            value={data.no_identitas}
                            icon={<BookUserIcon />}
                            type="text"
                            label="Nomor identitas"
                            maxLength={20}
                            onValueChange={(value) => onInputChangeHandler(value, "no_identitas")}
                            errorText={errors?.no_identitas} />
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-xl font-bold mb-2">Kontak</h4>
                        <IconInput
                            required
                            disabled={!isEditing}
                            value={data.no_telp}
                            icon={<PhoneCallIcon />}
                            type="text"
                            label="Nomor telepon"
                            maxLength={50}
                            onValueChange={(value) => onInputChangeHandler(value, "no_telp")}
                            errorText={errors?.no_telp} />

                        <IconTextarea
                            required
                            disabled={!isEditing}
                            value={data.alamat}
                            icon={<MapPinIcon />}
                            label="Alamat"
                            maxLength={254}
                            rows={3}
                            onValueChange={(value) => onInputChangeHandler(value, "alamat")}
                            errorText={errors?.alamat} />
                    </div>
                    {isEditing && (
                        <div className="col-span-3 text-center">
                            <Button className="w-full md:w-auto me-3" variant="secondary" type="button" onClick={resetToDefault}><BanIcon className="w-4 h-4 me-2" /> Batal</Button>
                            <Button className="w-full md:w-auto" type="submit"><SaveIcon className="w-4 h-4 me-2" /> Simpan</Button>
                        </div>
                    )}
                </form>
            </div>
        </section>
    </>
}