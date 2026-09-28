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


  const [addOpen, setAddOpen] = useState(false)
  const [newAttendance, setNewAttendance] = useState({
    userId: "",
    date: "",
    inTime: "",
    outTime: "",
    status: "Completed"
  })


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

  const addAttendance = async () => {
    try {
      // ✅ Validate user
      if (!selectedUser) {
        toast.error("Please select a user")
        return
      }

      // ✅ Validate required fields
      if (!newAttendance.date || !newAttendance.inTime || !newAttendance.outTime) {
        toast.error("Date, In Time and Out Time are required")
        return
      }

      // ✅ Optional: time validation
      if (newAttendance.inTime > newAttendance.outTime) {
        toast.error("Out Time must be greater than In Time")
        return
      }

      const res = await fetch("/api/attendance/add-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          internId: selectedUser.id,
          date: newAttendance.date,
          inTime: convertTo24Hour(newAttendance.inTime),
          outTime: convertTo24Hour(newAttendance.outTime),
          status: newAttendance.status
        })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Something went wrong")
        return
      }

      toast.success("Attendance added successfully")

      // ✅ Reset form
      setAddOpen(false)

      setNewAttendance({
        userId: "",
        date: "",
        inTime: "",
        outTime: "",
        status: "Completed"
      })

      setSelectedUser(null)
      setQuery("")
      setSuggestions([])

      fetchReports()

    } catch (error) {
      console.error(error)
      toast.error("Failed to add attendance")
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

      <div className="flex-1 min-w-0 ml-0 md:ml-64 p-4 sm:p-6 md:p-8">

        <Header />

        <div className="bg-white shadow rounded-xl p-4 sm:p-5 md:p-6 mt-4 md:mt-6">

          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">

            {/* LEFT - SEARCH */}
            <input
              placeholder="Search name, email, phone, dept or date (YYYY-MM-DD)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-4 py-2 rounded-md w-full md:w-[450px]"
            />

            {/* RIGHT - BUTTONS */}
            <div className="flex gap-3">

              <button
                onClick={() => setAddOpen(true)}
                className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 whitespace-nowrap"
              >
                Add Attendance
              </button>

              <button
                onClick={() => setOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 whitespace-nowrap"
              >
                Download Report
              </button>

            </div>


             {addOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-120 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">

                  {/* Header */}
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">
                    Add Attendance
                  </h2>

                  <div className="space-y-5">

                    {/* Employee Search */}
                    <div className="relative">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">
                        Employee Name / Email <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={query}
                        onChange={(e) => searchIntern(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />

                      {suggestions.length > 0 && (
                        <div className="absolute w-full mt-2 bg-white border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">

                          {suggestions.map((user: any) => (
                            <div
                              key={user.id}
                              onClick={() => {
                                setQuery(`${user.name} (${user.email})`)
                                setSelectedUser(user)
                                setSuggestions([])
                              }}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                            >
                              {user.name} <span className="text-gray-500">({user.email})</span>
                            </div>
                          ))}

                        </div>
                      )}
                    </div>

                    {/* Date + Time in Grid */}
                    <div className="grid grid-cols-2 gap-4">

                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Date <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          value={newAttendance.date}
                          onChange={(e) =>
                            setNewAttendance({ ...newAttendance, date: e.target.value })
                          }
                          className="border border-gray-300 p-2.5 w-full rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Status <span className="text-red-500">*</span></label>
                        <select
                          value={newAttendance.status}
                          onChange={(e) =>
                            setNewAttendance({ ...newAttendance, status: e.target.value })
                          }
                          className="border border-gray-300 p-2.5 w-full rounded-xl focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Completed">Completed</option>
                          <option value="Pending">Inside</option>
                          <option value="Out Duty">Out Duty</option>
                        </select>
                      </div>

                    </div>

                    {/* Time Inputs */}
                    <div className="grid grid-cols-2 gap-4">

                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">In Time <span className="text-red-500">*</span></label>
                        <input
                          type="time"
                          value={newAttendance.inTime}
                          onChange={(e) =>
                            setNewAttendance({ ...newAttendance, inTime: e.target.value })
                          }
                          className="border border-gray-300 p-2.5 w-full rounded-xl focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Out Time <span className="text-red-500">*</span></label>
                        <input
                          type="time"
                          value={newAttendance.outTime}
                          onChange={(e) =>
                            setNewAttendance({ ...newAttendance, outTime: e.target.value })
                          }
                          className="border border-gray-300 p-2.5 w-full rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                    </div>

                  </div>

                  {/* Footer Buttons */}
                  <div className="flex justify-end gap-3 mt-6">

                    <button
                      onClick={() => setAddOpen(false)}
                      className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={addAttendance}
                      className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition shadow"
                    >
                      Add Attendance
                    </button>

                  </div>

                </div>
              </div>
            )}



            {open && (

              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-130 max-h-[90vh] overflow-y-auto">

                  <h2 className="text-lg sm:text-xl font-semibold mb-6">
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

              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-100">

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
                      <option value="Out Duty">Out Duty</option>

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