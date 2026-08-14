"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"
import Link from "next/link"


export default function ResetPassword() {

  const params = useParams()
  const token = params.token
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")


  const handleReset = async (e: any) => {
    e.preventDefault()


    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token,
        password
      })
    })

    const data = await res.json()

    if (res.ok) {
      toast.success(data.message)
    } else {
      toast.error(data.message)
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-900 p-4 sm:p-6">

      <div className="flex flex-col md:flex-row w-full max-w-225 bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT SIDE */}

        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-12 flex-col justify-center items-center text-center">

          <img
            src="/Online-report-amico.png"
            className="w-64 mb-8"
          />

          <h1 className="text-2xl font-semibold">
            Create new password
          </h1>

          <p className="text-sm mt-4 opacity-90">
            Enter a strong password to secure your account.
          </p>

        </div>

        {/* MOBILE HEADER */}

        <div className="md:hidden bg-gradient-to-br from-purple-500 to-indigo-600 text-white px-6 py-8 text-center">

          <h1 className="text-xl font-semibold">
            Create new password
          </h1>

          <p className="text-xs mt-2 opacity-90">
            Enter a strong password to secure your account.
          </p>

        </div>


        {/* RIGHT SIDE */}

        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center">

          <div className="bg-purple-600 text-white px-6 py-2 rounded-full w-fit mb-6">
            Reset Password
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            Set your new password
          </h2>

          <form onSubmit={handleReset} className="space-y-6">

            {/* New Password */}

            <div>
              <label className="text-sm text-gray-500">
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-gray-300 focus:border-purple-600 outline-none p-2"
              />
            </div>


            {/* Confirm Password */}

            <div>
              <label className="text-sm text-gray-500">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-b-2 border-gray-300 focus:border-purple-600 outline-none p-2"
              />
            </div>


            <button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full transition"
            >
              Reset Password
            </button>

          </form>

          <div className="text-sm mt-6 text-gray-500">

            <Link
              href="/login"
              className="hover:text-purple-600"
            >
              Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  )


}