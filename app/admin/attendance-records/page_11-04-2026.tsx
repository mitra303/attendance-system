"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import ReportsTable from "./components/ReportsTable"
import toast from "react-hot-toast"

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
  const [editData, setEditData] = useState<any>(null)
  const [editOpen, setEditOpen] = useState(false)



  const downloadCSV = async () => {
    try {
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
    } catch (error) {

      toast.error("Failed to download report")

    }

  }

  const searchIntern = async (value: string) => {

    setQuery(value)

    if (!value) {
      setSuggestions([])
      return
    }

    try {
      const res = await fetch(`/api/intern/search/all-intern-users?q=${value}`)
      const data = await res.json()

      setSuggestions(data)
    } catch {

      toast.error("Failed to fetch users")

    }

  }


  const handleEdit = (row: any) => {

    setEditData(row)

    setEditOpen(true)

  }


  const updateAttendance = async () => {

    try {


      await fetch(`/api/attendance/${editData.id}`, {

        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          inTime: editData.inTime,
          outTime: editData.outTime,
          status: editData.status

        })

      })

      toast.success("Attendance updated successfully")
      setEditOpen(false)

      fetchReports()
    } catch (error) {

      toast.error("Failed to update attendance")

    }

  }


  function convertTo24Hour(time: string) {

    if (!time) return ""

    const [timePart, modifier] = time.split(" ")

    let [hours, minutes] = timePart.split(":")

    if (modifier === "PM" && hours !== "12") {
      hours = String(Number(hours) + 12)
    }

    if (modifier === "AM" && hours === "12") {
      hours = "00"
    }

    return `${hours.padStart(2, "0")}:${minutes}`

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

      <div className="flex-1 ml-64 p-8">

        <Header />

        <div className="bg-white shadow rounded-xl p-6 mt-6">

          <div className="flex justify-between mb-5">

            <input
              placeholder="Search name, email, phone, dept or date (YYYY-MM-DD)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-2 rounded-md w-120"

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



            {editOpen && (

              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                <div className="bg-white rounded-xl shadow-lg p-8 w-[400px]">

                  <h2 className="text-lg font-semibold mb-4">
                    Edit Attendance
                  </h2>

                  <div className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">

                      <input
                        type="time"
                        value={convertTo24Hour(editData?.inTime)}
                        onChange={(e) => setEditData({ ...editData, inTime: e.target.value })}
                        className="border rounded-lg px-4 py-3 w-full text-lg"
                      />

                      <input
                        type="time"
                        value={convertTo24Hour(editData?.outTime)}
                        onChange={(e) => setEditData({ ...editData, outTime: e.target.value })}
                        className="border rounded-lg px-4 py-3 w-full text-lg"
                      />

                    </div>

                    <select
                      value={editData?.status}
                      onChange={(e) =>
                        setEditData({ ...editData, status: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    >

                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>

                    </select>

                  </div>

                  <div className="flex justify-end gap-3 mt-5">

                    <button
                      onClick={() => setEditOpen(false)}
                      className="border px-4 py-2 rounded"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={updateAttendance}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Update
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
            onEdit={handleEdit}
          />

        </div>

      </div>

    </div>

  )

}