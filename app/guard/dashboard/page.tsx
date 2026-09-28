"use client"

import { useState } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import toast from "react-hot-toast"
import { useEffect } from "react"


export default function GuardDashboard() {

  const [query, setQuery] = useState("")
  const [interns, setInterns] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [attendance, setAttendance] = useState<any[]>([])


  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const searchIntern = async (value: string) => {

    setQuery(value)

    if (!value) {
      setInterns([])
      setSelected(null)
      return
    }

    if (selected && value !== selected.name) {
      setSelected(null)
    }

    const res = await fetch(`/api/intern/search?q=${value}`)
    const data = await res.json()

    setInterns(data)
  }

  const selectUser = (user: any) => {
    setSelected(user)
    setQuery(user.name)
    setInterns([])
  }

  const handleCheckIn = async () => {

    if (!selected) {
      toast.error("Select Employee Name/ID First")
      return
    }

    const res = await fetch("/api/attendance/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        internId: selected.id
      })
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.message)
    } else {
      toast.success("Check-in successful")

      setSelected(null)
      setQuery("")
      loadAttendance()
    }
  }

  const handleCheckOut = async () => {

    if (!selected) {
      toast.error("Select Employee Name/ID First")
      return
    }

    const res = await fetch("/api/attendance/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        internId: selected.id
      })
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.message)
    } else {
      toast.success("Check-out successful")

      setSelected(null)
      setQuery("")
      loadAttendance()
    }

  }


  // Attendance fetch
const loadAttendance = async () => {

  const res = await fetch(`/api/attendance/today?q=${search}&page=${page}`)

  const text = await res.text()

  const data = text ? JSON.parse(text) : {}

  console.log("API status:", res.status)
  console.log("API data:", data)

  if(!res.ok){
    throw new Error("Failed to load attendance")
  }

  setAttendance(data.attendance || [])
  setTotalPages(data.totalPages || 1)

}
  // 👇 YAHAN add karo
  useEffect(() => {
    loadAttendance()

    const interval = setInterval(loadAttendance, 20000)

    return () => clearInterval(interval)

  }, [search, page])

  return (

    <div className="flex h-screen">

      <Sidebar />

      <div className="flex-1 min-w-0 p-4 sm:p-5 md:p-6 bg-gray-50 md:ml-64">

        <Header />

        {/* Search Intern */}
        <div className="mb-6 relative">

          <input
            type="text"
            placeholder="Enter Intern Name / Employee ID"
            value={query}
            onChange={(e) => searchIntern(e.target.value)}
            className="w-full border rounded-lg p-3 text-lg"
          />

          {interns.length > 0 && (

            <div className="absolute w-full bg-white border rounded-lg mt-1 shadow">

              {interns.map((user) => (
                <div
                  key={user.id}
                  onClick={() => selectUser(user)}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                >
                  {user.name} ({user.email})
                </div>
              ))}

            </div>

          )}

        </div>

        {/* Selected Intern */}
        {selected && (
          <div className="mb-6 p-3 bg-green-50 border rounded">
            Selected Intern: <b>{selected.name}</b>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

          <button
            onClick={handleCheckIn}
            className="bg-green-600 text-white p-6 rounded-xl"
          >
            <p className="text-sm">Mark Attendance</p>
            <h2 className="text-xl font-bold mt-2">
              Check-In Intern
            </h2>
          </button>

          <button
            onClick={handleCheckOut}
            className="bg-blue-600 text-white p-6 rounded-xl"
          >
            <p className="text-sm">Mark Attendance</p>
            <h2 className="text-xl font-bold mt-2">
              Check-Out Intern
            </h2>
          </button>

        </div>



        {/* Searching */}
        <div className="flex justify-between mb-4">

          <input
            placeholder="Search Intern..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="border px-3 py-2 rounded-md w-64"
          />

        </div>


        {/* Today Attendance */}
        <div className="bg-white shadow rounded-xl p-4 sm:p-5 md:p-6">

          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">

          <table className="w-full text-left min-w-125">

            <thead className="border-b">
              <tr>
                <th>Sr.</th>
                <th className="py-2">Intern Name</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Data Not Found
                  </td>
                </tr>
              ) : (
                attendance.map((row: any, index: number) => (
                  <tr key={row.id} className="border-b">
                    <td className="py-2">{index + 1}</td>

                    <td className="py-2">{row.user?.name || "-"}</td>

                    <td>{row.inTime}</td>

                    <td>{row.outTime || "-"}</td>

                    <td
                      className={
                        row.status === "Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    >
                      {row.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

          </div>

        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="border px-3 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="px-3 py-1">
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="border px-3 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>

        </div>

      </div>

    </div>

  )
}