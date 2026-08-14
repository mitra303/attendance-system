"use client"

import { useEffect, useState } from "react"
import EditLeaveBalanceModal from "./EditLeaveBalanceModal"

export default function LeaveBalanceTable() {

  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [currentPage, setCurrentPage] = useState(1)

  const rowsPerPage = 5

  async function loadData() {

    const res = await fetch("/api/leave-balance")
    const data = await res.json()

    setUsers(data)

  }

  useEffect(() => {
    loadData()
  }, [])

  // 🔎 Search filter
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  )

  // 📄 Pagination
  const indexOfLast = currentPage * rowsPerPage
  const indexOfFirst = indexOfLast - rowsPerPage

  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast)

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage)

  return (

   <div className="bg-blue-50 border border-blue-100 rounded-xl shadow p-3 md:p-4">

      {/* Search */}
      <div className="flex justify-between mb-4">

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />

      </div>

      <div className="overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0">

      <table className="w-full min-w-140">

        <thead className="bg-gray-50 border-b">

          <tr>

            <th className="p-3 text-left">S.No</th>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-left">Dept</th>
            <th className="p-3 text-left">Casual</th>
            <th className="p-3 text-left">Earned</th>
            <th className="p-3 text-left">Short</th>
            <th className="p-3 text-left">Action</th>

          </tr>

        </thead>

        <tbody>

          {currentUsers.map((user, index) => (

            <tr key={user.id} className="border-b hover:bg-gray-50">

              {/* Serial Number */}
              <td className="p-3">
                {(currentPage - 1) * rowsPerPage + index + 1}
              </td>

              <td className="p-3 font-medium">
                {user.name}
              </td>

              <td className="p-3">
                {user.dept}
              </td>

              <td className="p-3 text-blue-600 font-semibold">
                {user.leaveBalance?.casual}
              </td>

              <td className="p-3 text-green-600 font-semibold">
                {user.leaveBalance?.earned}
              </td>

              <td className="p-3 text-purple-600 font-semibold">
                {user.leaveBalance?.short}
              </td>

              <td className="p-3">

                <button
                  onClick={()=>setSelectedUser(user)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      </div>

      {/* Pagination */}

<div className="flex flex-wrap justify-center mt-6 gap-2">

{Array.from({ length: totalPages }, (_, i) => (

<button
key={i}
onClick={()=>setCurrentPage(i+1)}
className={`w-8 h-8 rounded-lg text-sm font-medium
${currentPage === i+1
? "bg-blue-600 text-white shadow"
: "bg-gray-200 hover:bg-gray-300"
}`}
>

{i+1}

</button>

))}

</div>

      {selectedUser && (

        <EditLeaveBalanceModal
          user={selectedUser}
          close={()=>setSelectedUser(null)}
          reload={loadData}
        />

      )}

    </div>

  )
}