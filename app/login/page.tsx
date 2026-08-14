"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"

export default function LoginPage() {
    const router = useRouter()
    const [employeeId, setEmployeeId] = useState("")
    const [accessCode, setAccessCode] = useState("")

    const handleLogin = async (e: any) => {
        e.preventDefault()

        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                employeeId,
                password: accessCode
            })
        })

        const data = await res.json()
        console.log("Login API Response:", data)
        if (res.ok) {

             localStorage.setItem("userId", data.id)

            if (data.role === 1) router.push("/admin/users")
            if (data.role === 2) router.push("/hr/dashboard")
            if (data.role === 3) router.push("/intern/attendance-view")
            if (data.role === 4) router.push("/guard/dashboard")

        } else {
            toast.error(data.message);
        }
    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-900 p-4 sm:p-6">

            <div className="flex flex-col md:flex-row w-full max-w-275 bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">

                {/* LEFT SIDE */}

                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-12 flex-col justify-center items-center text-center">

                    <img
                        src="/Online-report-amico.png"
                        className="w-72 mb-8"
                    />

                    <h1 className="text-2xl font-semibold">
                        MIPL Attendance Portal
                    </h1>

                    <p className="text-sm mt-4 opacity-90">
                        Clock in, check your hours, and manage your team's presence.
                        Access the Attendance Management System.
                    </p>

                </div>

                {/* MOBILE HEADER */}

                <div className="md:hidden bg-gradient-to-br from-purple-500 to-indigo-600 text-white px-6 py-8 text-center">

                    <h1 className="text-xl font-semibold">
                        MIPL Attendance Portal
                    </h1>

                    <p className="text-xs mt-2 opacity-90">
                        Clock in, check your hours, and manage your team's presence.
                    </p>

                </div>


                {/* RIGHT SIDE */}

                <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center">

                    <div className="bg-purple-600 text-white px-6 py-2 rounded-full w-fit mb-6">
                        Welcome back
                    </div>

                    <h2 className="text-xl sm:text-2xl font-semibold mb-6">
                        Login your account
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Employee ID */}

                        <div>

                            <label className="text-sm text-gray-500">
                                Email ID
                            </label>

                            <input
                                type="text"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                className="w-full border-b-2 border-gray-300 focus:border-purple-600 outline-none p-2"
                                required
                            />

                        </div>


                        {/* Access Code */}

                        <div>

                            <label className="text-sm text-gray-500">
                                Password
                            </label>

                            <input
                                type="password"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                className="w-full border-b-2 border-gray-300 focus:border-purple-600 outline-none p-2"
                                required
                            />

                        </div>


                        {/* Login Button */}

                        <button
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full transition"
                        >
                            Login
                        </button>

                    </form>


                    {/* Links */}

                    <div className="flex justify-between text-sm mt-6 text-gray-500">

                        <a href="#"></a>

                        <Link href="/forgot-password">Forgot Password?</Link>

                    </div>

                </div>

            </div>

        </div>
    )
}