"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import ReportsTable from "./components/ReportsTable"

type User = {
  id: number
  name?: string
  email?: string
}

export default function ReportsPage() {

  const [reports, setReports] = useState([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [open, setOpen] = useState(false)

  const [query, setQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [suggestions, setSuggestions] = useState([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)


  const downloadCSV = async () => {

    const res = await fetch(
      `/api/reports/download?userId=${selectedUser?.id || ""}&start=${startDate}&end=${endDate}`
    )

    const blob = await res.blob()

    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")

    const employeeName = selectedUser?.name?.replace(/\s+/g, "_") || "all_users"
    const start = startDate || "start"
    const end = endDate || "end"

    const fileName = `${employeeName}_${start}_to_${end}_attendance.csv`

    a.href = url
    a.download = fileName

    document.body.appendChild(a)
    a.click()
    a.remove()

    // CLEAR MODAL DATA
    setQuery("")
    setSelectedUser(null)
    setStartDate("")
    setEndDate("")
    setSuggestions([])

    setOpen(false)

  }

  const searchIntern = async (value: string) => {

    setQuery(value)

    if (!value) {
      setSuggestions([])
      return
    }

     const res = await fetch(`/api/intern/search/all-intern-users?q=${value}`)
    const data = await res.json()

    setSuggestions(data)

  }

  const fetchReports = async () => {

    const res = await fetch(`/api/reports?q=${search}&page=${page}`)
    const data = await res.json()

    setReports(data.reports)
    setTotalPages(data.totalPages)

  }

  useEffect(() => {
    fetchReports()
  }, [search, page])

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 md:ml-64 p-8">

        <Header />

        <div className="bg-white shadow rounded-xl p-6 mt-6">

          <div className="flex justify-between mb-5">

            <input
              placeholder="Search intern..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-2 rounded-md w-64"
            />

            <button
              onClick={() => setOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Download Report
            </button>


            {open && (

              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                <div className="bg-white rounded-xl shadow-lg p-8 w-[520px]">

                  <h2 className="text-xl font-semibold mb-6">
                    Download Attendance Report
                  </h2>

                  {/* Search Intern */}

                  <div className="mb-5 relative">

                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Employee Name / Email ID
                    </label>

                    <input
                      type="text"
                      placeholder="Enter Intern Name / Email"
                      value={query}
                      onChange={(e) => searchIntern(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {suggestions.length > 0 && (

                      <div className="absolute bg-white border w-full mt-1 rounded-md shadow-md z-50 max-h-48 overflow-y-auto">

                        {suggestions.map((user: any) => (

                          <div
                            key={user.id}
                            onClick={() => {
                              setQuery(`${user.name} (${user.email})`)
                              setSelectedUser(user)
                              setSuggestions([])
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >

                            {user.name} ({user.email})

                          </div>

                        ))}

                      </div>

                    )}

                  </div>

                  {/* Date Range */}

                  <div className="grid grid-cols-2 gap-4 mb-6">

                    <div>

                      <label className="text-sm font-medium text-gray-600 block mb-2">
                        Start Date
                      </label>

                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                    <div>

                      <label className="text-sm font-medium text-gray-600 block mb-2">
                        End Date
                      </label>

                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                  </div>

                  {/* Buttons */}

                  <div className="flex justify-end gap-3">

                    <button
                      onClick={() => {
                        setOpen(false)
                        setQuery("")
                        setSelectedUser(null)
                        setStartDate("")
                        setEndDate("")
                        setSuggestions([])
                      }}
                      className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={downloadCSV}
                      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Download CSV
                    </button>

                  </div>

                </div>

              </div>

            )}

          </div>

          <ReportsTable
            reports={reports}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />

        </div>

      </div>

    </div>

  )

}