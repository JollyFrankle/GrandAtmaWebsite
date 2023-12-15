import AuthHelper from "@/utils/AuthHelper";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";


export default function UnauthenticatedMiddleware() {
    const [userType, setUserType] = useState<'c' | 'p' | null>()
    const navigate = useNavigate()

    useEffect(() => {
        const uType = AuthHelper.getUserType()
        setUserType(uType)
        if (uType === "c") {
            navigate("/customer")
        } else if (uType === "p") {
            navigate("/admin")
        }
    }, [navigate])

    return !userType && <Outlet />
}