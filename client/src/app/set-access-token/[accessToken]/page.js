"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "@/store/features/user/userSlice";
import { jwtDecode } from "jwt-decode";

export default function SetAccessToken() {
    const { accessToken } = useParams(); 
    const router = useRouter(); 
    const dispatch = useDispatch();

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken)
            const user = jwtDecode(accessToken);
            dispatch(setUser({ user }));
            const role = user.role;
            const lastAttemptedPath = localStorage.getItem("lastAttemptedPath");

            router.push(lastAttemptedPath || `/${role}`);
            localStorage.removeItem("lastAttemptedPath");
        } else {
            router.push("/auth/login");
        }
    }, [accessToken, dispatch, router]);

    return (
        <h1 className="text-2xl text-center font-bold text-gray-800">
            Setting Access Token...
        </h1>
    );
}
