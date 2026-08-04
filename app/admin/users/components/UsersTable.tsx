"use client"

import { Pencil, Eye, Trash } from "lucide-react"
import EditUserDialog from "./EditUserDialog"

export default function UsersTable({ users, editUser, deleteUser, page, totalPages, setPage,edit_refresh }: any) {

  return (

    <div className="overflow-x-auto">

      <table className="w-full rounded-xl overflow-hidden">

        {/* Header */}

        <thead className="bg-teal-700 text-white">

          <tr>
            <th className="p-4 text-left">Sr. No</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">DOJ</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Action</th>

          </tr>

        </thead>

        {/* Body */}

        <tbody className="bg-white">

          {users.map((u: any, index: number) => (

            <tr
              key={u.id}
              className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-50" : ""
                }`}
            >
              <td className="p-4">{(page - 1) * 10 + index + 1}</td>
              <td className="p-4 font-medium">{u.name}</td>

              <td className="p-4">{u.email}</td>

              <td className="p-4">
                {u.doj ? new Date(u.doj).toLocaleDateString() : "-"}
              </td>

              {/* Status */}

              <td className="p-4">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                  ${u.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {u.status}
                </span>

              </td>

              {/* Actions */}

              <td className="p-4 flex justify-center gap-2">

               <EditUserDialog user={u} refresh={edit_refresh} />

                {/* <button className="bg-gray-700 text-white p-2 rounded-md hover:bg-gray-800" onClick={() => editUser(u)}>
                  <Eye size={16} />
                </button> */}

                {/* <button className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700" onClick={() => deleteUser(u.id)}>
                  <Trash size={16} />
                </button> */}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* Pagination */}

      <div className="flex justify-center items-center gap-3 mt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded-md disabled:opacity-40"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => {

          const p = i + 1

          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded-md ${page === p
                ? "bg-teal-700 text-white"
                : "border"
                }`}
            >
              {p}
            </button>
          )
        })}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded-md disabled:opacity-40"
        >
          Next
        </button>

      </div>
    </div>

  )
}