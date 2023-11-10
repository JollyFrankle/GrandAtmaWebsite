import { useEffect, useState } from "react"
import AuthHelper from "@/utils/AuthHelper"
import PageBookingStep3_C from "./subpage/PageBookingStep3_C"
import PageBookingStep3_P from "./subpage/PageBookingStep3_P"

export default function PageBookingStep3() {

    const [userType, setUserType] = useState<'c' | 'p' | null>(null)

    useEffect(() => {
        if (AuthHelper.getUserCustomer()) {
            setUserType('c')
        } else if (AuthHelper.getUserPegawai()) {
            setUserType('p')
        }
    }, [])

    return (userType === 'c' ? (
        <PageBookingStep3_C />
    ) : (
        <PageBookingStep3_P />
    ))
}