"use client"

import { useState } from "react"
import { Mail, User, Calendar } from "lucide-react"
import toast from "react-hot-toast"

export default function AddUserDialog({ refresh }: any) {

  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    doj: "",
    phone: "",
    department: "",
    manager: "",
    reptMngEmail: "",
    status: "active"
  })

  const handleSubmit = async () => {

    if (
      !form.name ||
      !form.email ||
      !form.doj ||
      !form.phone ||
      !form.manager
    ) {
      toast.error("Please fill all required fields")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(form.email)) {
      toast.error("Enter valid email address")
      return
    }

    const phoneRegex = /^[0-9]{10}$/

    if (!phoneRegex.test(form.phone)) {
      toast.error("Phone number must be 10 digits")
      return
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
    
    const data = await res.json()

    if (!res.ok) {
      toast.error(data.message)
    } else {
      toast.success(data.message)
    }
    setForm({
      name: "",
      email: "",
      doj: "",
      phone: "",
      department: "",
      manager: "",
      reptMngEmail: "",
      status: "active"
    })

    setOpen(false)
    refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Add User
      </button>

      {open && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-187.5 p-4 sm:p-8 max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl sm:text-2xl font-semibold mb-6">
              Add User
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Name */}

              <div>
                <label className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </label>

                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    value={form.name}
                    className="w-full border rounded-lg pl-10 pr-3 py-2"
                    placeholder="Enter name"
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>

                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={form.email}
                    className="w-full border rounded-lg pl-10 pr-3 py-2"
                    placeholder="Enter email"
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* DOJ */}

              <div>
                <label className="text-sm font-medium">
                  Date of Joining <span className="text-red-500">*</span>
                </label>

                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="date"
                    value={form.doj}
                    className="w-full border rounded-lg pl-10 pr-3 py-2"
                    onChange={(e) =>
                      setForm({ ...form, doj: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Phone */}

              <div>
                <label className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>

                <input
                  type="tel"
                  value={form.phone}
                  maxLength={10}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="Enter phone"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value.replace(/\D/g, "")
                    })
                  }
                />
              </div>

              {/* Department */}

              <div>
                <label className="text-sm font-medium">
                  Department
                </label>

                <input
                  value={form.department}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="Department Name"
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                />
              </div>

              {/* Manager */}

              <div>
                <label className="text-sm font-medium">
                  Reporting Manager <span className="text-red-500">*</span>
                </label>

                <input
                  value={form.manager}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="Manager name"
                  onChange={(e) =>
                    setForm({ ...form, manager: e.target.value })
                  }
                />
              </div>

              {/* Status */}

              <div>
                <label className="text-sm font-medium">
                  Status
                </label>

                <select
                  value={form.status}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>



               {/* Reporting Manager Email */}
              <div>
                <label className="text-sm font-medium">
                  Reporting Manager  Email<span className="text-red-500">*</span>
                </label>

                 <input
                    type="email"
                    value={form.reptMngEmail}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    placeholder="Enter manager email"
                    onChange={(e) =>
                      setForm({ ...form, reptMngEmail: e.target.value })
                    }
                  />
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}
    </>
  )
}