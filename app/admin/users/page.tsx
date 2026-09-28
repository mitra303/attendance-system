"use client"

import { useEffect, useState } from "react"
import UsersTable from "./components/UsersTable"
import AddUserDialog from "./components/AddUserDialog"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

export default function UsersPage() {

  const [users,setUsers] = useState([])
  const [search,setSearch] = useState("")
  const [page,setPage] = useState(1)
  const [totalPages,setTotalPages] = useState(1)

  const fetchUsers = async () => {

    const res = await fetch(`/api/users?q=${search}&page=${page}`)
    const data = await res.json()

    setUsers(data.users || [])
    setTotalPages(data.totalPages || 1)

  }

  useEffect(()=>{
    fetchUsers()
  },[search,page])

  return(

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar/>

      <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 ml-0 md:ml-64">

        <Header/>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 md:p-6 mt-4 md:mt-6">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">

            <input
              placeholder="Search user..."
              className="border px-3 py-2 rounded-md w-full sm:w-64"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />

            <AddUserDialog refresh={fetchUsers}/>

          </div>

          <UsersTable
            users={users}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            edit_refresh={fetchUsers}
          />

        </div>

      </div>

    </div>
  )
}