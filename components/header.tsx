"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Header() {

  const router = useRouter()
  const [name, setName] = useState("")

  useEffect(() => {

    const fetchUser = async () => {

      const res = await fetch("/api/me")

      if (!res.ok) return

      const data = await res.json()

      if (data.user) {
        setName(data.user.name)
      }

    }

    fetchUser()

  }, [])

  const handleLogout = async () => {

    await fetch("/api/logout", { method: "POST" })
    router.push("/login")

  }

  return (

    <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between md:items-center gap-3 p-4 pl-16 md:pl-4 bg-gray-100">

      <h1 className="text-lg lg:text-2xl font-semibold">
        Organization Attendance System
      </h1>

      <div className="flex items-center gap-3 md:gap-4">

        <span className="text-gray-600 text-sm md:text-base truncate">
          Welcome {name}
        </span>

        <div className="w-8 h-8 shrink-0 bg-yellow-600 text-white rounded-full flex items-center justify-center">
          {name?.charAt(0)}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 whitespace-nowrap"
        >
          Logout
        </button>

      </div>

    </div>
  )
}