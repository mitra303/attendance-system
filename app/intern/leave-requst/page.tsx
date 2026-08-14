"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

export default function LeaveRequestPage() {

    const [leaves, setLeaves] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const limit = 5

    useEffect(() => {
        fetchLeaves()
    }, [page, search])

    const fetchLeaves = async () => {

        const userId = localStorage.getItem("userId")

        const res = await fetch(
            `/api/leave-requst?userId=${userId}&page=${page}&limit=${limit}&search=${search}`
        )

        const data = await res.json()

        setLeaves(data.leaves)
        setTotalPages(Math.ceil(data.total / limit))
    }

    return (
        <div className="flex bg-gray-100 min-h-screen">

            <Sidebar />

            <div className="flex-1 min-w-0 p-4 md:p-8 ml-0 md:ml-64">

                <Header />

                <div className="bg-white p-4 md:p-6 rounded shadow mt-4">

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">

                        <h2 className="text-lg font-semibold">
                            My Leave Requests
                        </h2>

                        <input
                            type="text"
                            placeholder="Search leave..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-3 py-2 rounded w-full md:w-60"
                        />

                    </div>

                    <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">

                    <table className="w-full border min-w-160">

                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 border">Sr.No</th>
                                <th className="p-2 border">Leave Type</th>
                                <th className="p-2 border">From</th>
                                <th className="p-2 border">To</th>
                                <th className="p-2 border">Reason</th>
                                <th className="p-2 border">Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {leaves.length === 0 ? (

                                <tr>
                                    <td colSpan={6} className="text-center p-6 text-gray-500">
                                        No data found
                                    </td>
                                </tr>

                            ) : (

                                leaves.map((leave, index) => (

                                    <tr key={leave.id}>

                                        <td className="p-2 border">
                                            {(page - 1) * limit + index + 1}
                                        </td>

                                        <td className="p-2 border">
                                            {leave.leaveType}
                                        </td>

                                         <td className="p-2 border">
                                            {leave.fromDate
                                                ? new Date(leave.fromDate).toLocaleDateString("en-IN")
                                                : leave.date
                                                    ? new Date(leave.date).toLocaleDateString("en-IN")
                                                    : "-"
                                            }
                                        </td>

                                        <td className="p-2 border">
                                            {leave.toDate
                                                ? new Date(leave.toDate).toLocaleDateString("en-IN")
                                                : leave.date
                                                    ? new Date(leave.date).toLocaleDateString("en-IN")
                                                    : "-"
                                            }
                                        </td>

                                        <td className="p-2 border">
                                            {leave.reason}
                                        </td>

                                        <td className="p-2 border">

                                            <span
                                                className={`px-2 py-1 rounded text-white text-xs
                                                ${leave.status === "approved"
                                                        ? "bg-green-500"
                                                        : leave.status === "rejected"
                                                            ? "bg-red-500"
                                                            : "bg-yellow-500"
                                                    }`}
                                            >
                                                {leave.status}
                                            </span>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                    </div>

                    {/* PAGINATION */}

                    <div className="flex flex-wrap justify-center gap-4 mt-6">

                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="px-3 py-2">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}