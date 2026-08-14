"use client"

import { useEffect, useState } from "react"
import { Mail, User, Calendar } from "lucide-react"
import toast from "react-hot-toast"

export default function EditUserDialog({ user, refresh }: any) {

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

  // Prefill data when modal opens
  useEffect(() => {

    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        doj: user.doj ? user.doj.split("T")[0] : "",
        phone: user.phone || "",
        department: user.dept || "",
        manager: user.repMgr || "",
        reptMngEmail: user.repMgrEmail || "",
        status: user.status || "active"
      })
    }

  }, [user])

  const handleSubmit = async () => {

    if (!form.name || !form.email || !form.doj || !form.phone || !form.reptMngEmail) {
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

    try {
      console.log("User ID:", user?.id);
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Update failed")
        return
      }

      toast.success("User updated successfully")

      setOpen(false)

      refresh()

    } catch (error) {

      toast.error("Server error")

    }

  }

  return (
    <>

      {/* Edit Button */}

      <button
        onClick={() => setOpen(true)}
        className="bg-teal-700 text-white p-2 rounded-md hover:bg-teal-800"
      >
        Edit
      </button>

      {open && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-187.5 p-4 sm:p-8 max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl sm:text-2xl font-semibold mb-6">
              Edit User
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Name */}

              <div>
                <label>Name</label>
                <input
                  value={form.name}
                  className="w-full border rounded-lg px-3 py-2"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Email */}

              <div>
                <label>Email</label>
                <input
                  value={form.email}
                  className="w-full border rounded-lg px-3 py-2"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {/* DOJ */}

              <div>
                <label>Date of Joining</label>
                <input
                  type="date"
                  value={form.doj}
                  className="w-full border rounded-lg px-3 py-2"
                  onChange={(e) => setForm({ ...form, doj: e.target.value })}
                />
              </div>

              {/* Phone */}

              <div>
                <label>Phone</label>
                <input
                  value={form.phone}
                  className="w-full border rounded-lg px-3 py-2"
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
                <label>Department</label>
                <input
                  value={form.department}
                  className="w-full border rounded-lg px-3 py-2"
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>

              {/* Manager */}

              <div>
                <label>Reporting Manager</label>
                <input
                  value={form.manager}
                  className="w-full border rounded-lg px-3 py-2"
                  onChange={(e) => setForm({ ...form, manager: e.target.value })}
                />
              </div>


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



              <div>
                <label>Reporting Manager Email</label>
                <input
                  value={form.reptMngEmail}
                  className="w-full border rounded-lg px-3 py-2"
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
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                Update
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  )
}