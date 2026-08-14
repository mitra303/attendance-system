"use client"

import { useState } from "react"

export default function EditLeaveBalanceModal({ user, close, reload }: any) {

    const [casual, setCasual] = useState(user.leaveBalance?.casual || 0)
    const [earned, setEarned] = useState(user.leaveBalance?.earned || 0)
    const [short, setShort] = useState(user.leaveBalance?.short || 0)

    async function updateLeave() {

        await fetch("/api/leave-balance-update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                casual,
                earned,
                short
            })
        })

        reload()
        close()
    }

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <div className="bg-white p-6 rounded-lg w-full max-w-105 shadow-lg">

                {/* Employee Info */}
                <div className="mb-4 border-b pb-3">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Edit Leave Balance
                    </h2>

                    <p className="text-sm text-gray-500">
                        {user.name} • {user.dept}
                    </p>

                </div>

                <div className="space-y-4">

                    {/* Casual */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Casual Leave
                        </label>

                        <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={casual}
                            onChange={(e) => setCasual(Number(e.target.value))}
                            className="border p-2 w-full rounded mt-1"
                        />
                    </div>

                    {/* Earned */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Earned Leave
                        </label>

                        <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={earned}
                            onChange={(e) => setEarned(Number(e.target.value))}
                            className="border p-2 w-full rounded mt-1"
                        />
                    </div>

                    {/* Short */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Short Leave
                        </label>

                        <input
                            type="number"
                            value={short}
                            onChange={(e) => setShort(Number(e.target.value))}
                            className="border p-2 w-full rounded mt-1"
                        />
                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={close}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={updateLeave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Update
                    </button>

                </div>

            </div>

        </div>
    )
}