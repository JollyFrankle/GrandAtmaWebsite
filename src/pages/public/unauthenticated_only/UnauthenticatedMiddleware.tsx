import AuthHelper from "@/utils/AuthHelper";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";


export default function UnauthenticatedMiddleware() {
    const userType = AuthHelper.getUserType()
    const navigate = useNavigate()

    useEffect(() => {
        if (userType === "c") {
            navigate("/customer")
        } else if (userType === "p") {
            navigate("/admin")
        }
    }, [userType])

    return !userType && <Outlet />
}