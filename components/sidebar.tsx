"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, FileText, Settings, Clock, Calendar, Menu, X,ClipboardList,FilePlus } from "lucide-react"

export default function Sidebar() {

  const [role, setRole] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  const pathname = usePathname()

  useEffect(() => {

    const fetchUser = async () => {

      const res = await fetch("/api/me")
      const data = await res.json()

      if (data.user) {
        setRole(data.user.role)
      }

    }

    fetchUser()

  }, [])

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden bg-white shadow p-2 rounded-lg"
        >
          <Menu size={22} />
        </button>
      )}

      {/* SIDEBAR */}
      <div
        className={`
        fixed top-0 left-0 h-screen w-64 bg-[#243b8a] text-white p-6 flex flex-col
        transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >

        {/* CLOSE BUTTON (mobile) */}
        <div className="flex justify-between items-center md:hidden mb-6">
          <h1 className="text-lg font-bold">Menu</h1>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <h1 className="text-xl font-bold mb-10 hidden md:block">
          {role === 1 && "Admin Panel"}
          {role === 2 && "HR Panel"}
          {role === 3 && "Intern Panel"}
          {role === 4 && "Guard Panel"}
        </h1>

        <div className="space-y-3">

          {/* ADMIN */}
          {role === 1 && (
            <>
              {/* <MenuItem href="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" pathname={pathname} /> */}
              <MenuItem href="/admin/users" icon={<Users size={18} />} label="Users" pathname={pathname} />
              <MenuItem href="/admin/attendance-records" icon={<FileText size={18} />} label="Attendance Records" pathname={pathname} />
              <MenuItem href="/admin/leave-balance" icon={<Settings size={18} />} label="Leave Balance" pathname={pathname} />
            </>
          )}

          {/* HR */}
          {role === 2 && (
            <>
              <MenuItem href="/hr/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" pathname={pathname} />
              <MenuItem href="/hr/leaves" icon={<FilePlus size={18} />} label="Leave Requests" pathname={pathname} />
              <MenuItem href="/hr/reports" icon={<FileText size={18} />} label="Reports" pathname={pathname} />
            </>
          )}

          {/* INTERN */}
          {role === 3 && (
            <>
              {/* <MenuItem href="/intern/dashboard" icon={<Calendar size={18} />} label="Dashboard" pathname={pathname} /> */}
              <MenuItem href="/intern/attendance-view" icon={<Calendar size={18} />} label="My Attendance" pathname={pathname} />
              <MenuItem href="/intern/leave" icon={<FileText size={18} />} label="Apply Leave" pathname={pathname} />
              <MenuItem href="/intern/leave-requst" icon={<ClipboardList  size={18} />} label="My Leave Request" pathname={pathname} />
            </>
          )}

          {/* GUARD */}
          {role === 4 && (
            <>
              <MenuItem href="/guard/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" pathname={pathname} />
              <MenuItem href="/guard/attendance-records" icon={<Clock size={18} />} label="Attendance Records" pathname={pathname} />
            </>
          )}

        </div>

        <div className="mt-auto">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            N
          </div>
        </div>

      </div>
    </>
  )
}

function MenuItem({ href, icon, label, pathname }: any) {

  const active =
    pathname === href || pathname.startsWith(href + "/")

  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
        ${
          active
            ? "bg-white text-[#243b8a] font-semibold"
            : "text-gray-200 hover:bg-white/10"
        }`}
      >
        {icon}
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  )
}