import LayoutHome from "@/pages/public/_layout/LayoutHome";
import AuthHelper from "@/utils/AuthHelper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



export default function LayoutCustomer() {
    const [isUser] = useState(AuthHelper.getUserCustomer() !== null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isUser) {
            navigate("/login")
        }
    }, [])

    return isUser && <LayoutHome />
}