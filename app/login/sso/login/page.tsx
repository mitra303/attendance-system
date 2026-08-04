"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function SsoLoginHandler() {

    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState("")

    useEffect(() => {

        const token = searchParams.get("token")

        if (!token) {
            setError("Missing SSO token")
            return
        }

        const doSsoLogin = async () => {

            const res = await fetch("/api/sso-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token })
            })

            const data = await res.json()

            if (res.ok) {

                localStorage.setItem("userId", data.id)

                if (data.role === 1) router.push("/admin/users")
                if (data.role === 2) router.push("/hr/dashboard")
                if (data.role === 3) router.push("/intern/attendance-view")
                if (data.role === 4) router.push("/guard/dashboard")

            } else {
                setError(data.message || "SSO login failed")
            }

        }

        doSsoLogin()

    }, [searchParams, router])

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-900 p-6">

            <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm w-full">

                {error ? (
                    <>
                        <p className="text-red-600 font-medium mb-4">{error}</p>
                        <a href="/login" className="text-purple-600 underline">
                            Go to login
                        </a>
                    </>
                ) : (
                    <p className="text-gray-600">Signing you in...</p>
                )}

            </div>

        </div>

    )

}

export default function SsoLoginPage() {

    return (
        <Suspense fallback={null}>
            <SsoLoginHandler />
        </Suspense>
    )

}
