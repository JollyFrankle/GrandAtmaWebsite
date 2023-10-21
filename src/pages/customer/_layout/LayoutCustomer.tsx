import LayoutHome from "@/pages/public/_layout/LayoutHome";
import AuthHelper from "@/utils/AuthHelper";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function LayoutCustomer() {
    const user = AuthHelper.getUserCustomer()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [])

    return user && <LayoutHome />
}