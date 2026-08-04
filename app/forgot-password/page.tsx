"use client"

import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"

export default function ForgotPassword() {

  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(data.message || "Reset link sent to your email")
        setEmail("") // optional: clear input
      } else {
        toast.error(data.message || "Something went wrong")
      }

    } catch (error) {
      toast.error("Server error. Please try again.")
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-900 p-6">

      <div className="flex w-[900px] bg-white rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT SIDE */}

        <div className="w-1/2 bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-12 flex flex-col justify-center items-center text-center">

          <img
            src="/Online-report-amico.png"
            className="w-64 mb-8"
          />

          <h1 className="text-2xl font-semibold">
            Reset your password
          </h1>

          <p className="text-sm mt-4 opacity-90">
            Enter your registered email to receive a password reset link.
          </p>

        </div>


        {/* RIGHT SIDE */}

        <div className="w-1/2 p-12 flex flex-col justify-center">

          <div className="bg-purple-600 text-white px-6 py-2 rounded-full w-fit mb-6">
            Forgot Password
          </div>

          <h2 className="text-2xl font-semibold mb-6">
            Reset your account password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>

              <label className="text-sm text-gray-500">
                Email ID
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-gray-300 focus:border-purple-600 outline-none p-2"
              />

            </div>


            <button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full transition"
            >
              Send Reset Link
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