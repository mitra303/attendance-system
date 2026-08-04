"use client"

import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export default function Leave() {

    const [leaveType, setLeaveType] = useState("")
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [date, setDate] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [reason, setReason] = useState("")



    const [balance, setBalance] = useState({
        casual: 0,
        earned: 0,
        short: 0,
        totalTaken: 0,
        earnedUtilization: 0
    })

    const submitLeave = async (e: any) => {

        e.preventDefault()

        const userId = Number(localStorage.getItem("userId"))

        const payload =
            leaveType === "Short Leave"
                ? {
                    userId,
                    leaveType,
                    date,
                    startTime,
                    endTime,
                    reason
                }
                : {
                    userId,
                    leaveType,
                    fromDate,
                    toDate,
                    reason
                }

        try {

            const res = await fetch("/api/leave", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            const result = await res.json()

            if (!res.ok) {
                toast.error(result.error)
                return
            }

            toast.success("Leave submitted successfully")

            // form reset
            setLeaveType("")
            setFromDate("")
            setToDate("")
            setDate("")
            setStartTime("")
            setEndTime("")
            setReason("")

            fetchBalance()

        } catch (error) {

            toast.error("Server error")

        }
    }

    const fetchBalance = () => {

        const userId = localStorage.getItem("userId")

        fetch(`/api/leave/balance?userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                setBalance(data)
            })

    }

    useEffect(() => {
        fetchBalance()
    }, [])

    return (
        <div className="flex bg-gray-100 min-h-screen">

            <Sidebar />

            <div className="flex-1 p-8 ml-64">

                <Header />

                <div className="grid grid-cols-2 gap-8">

                    {/* LEFT SIDE FORM */}

                    <div className="bg-white rounded-xl shadow-lg border-t-4 border-yellow-500 p-6">

                        <h2 className="text-2xl font-semibold mb-6">
                            Apply Leave
                        </h2>

                        <form onSubmit={submitLeave} className="space-y-4">

                            {/* Leave Type */}

                            <div>
                                <label className="block mb-1">
                                    Leave type <span className="text-red-500">*</span>
                                </label>

                                <select
                                    className="w-full border p-2 rounded"
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)} required
                                >
                                    <option value="">Select</option>
                                    <option value="Casual Leave">Casual Leave</option>
                                    <option value="Earned Leave">Earned Leave</option>
                                    <option value="Short Leave">Short Leave</option>
                                </select>
                            </div>

                            {/* NORMAL LEAVE */}

                            {leaveType !== "Short Leave" && leaveType !== "" && (

                                <div className="flex gap-4">

                                    <div className="flex-1">
                                        <label>From <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            className="w-full border p-2 rounded"
                                            onChange={(e) => setFromDate(e.target.value)} required
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label>To <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            className="w-full border p-2 rounded"
                                            onChange={(e) => setToDate(e.target.value)} required
                                        />
                                    </div>

                                </div>
                            )}

                            {/* SHORT LEAVE */}

                            {leaveType === "Short Leave" && (

                                <div className="space-y-4">

                                    <div>
                                        <label>Date <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            className="w-full border p-2 rounded"
                                            onChange={(e) => setDate(e.target.value)} required
                                        />
                                    </div>

                                    <div className="flex gap-4">

                                        <div className="flex-1">
                                            <label>I will be away between <span className="text-red-500">*</span></label>
                                            <input
                                                type="time"
                                                className="w-full border p-2 rounded"
                                                onChange={(e) => setStartTime(e.target.value)} required
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <label>and <span className="text-red-500">*</span></label>
                                            <input
                                                type="time"
                                                className="w-full border p-2 rounded"
                                                onChange={(e) => setEndTime(e.target.value)} required
                                            />
                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* Reason */}

                            <div>
                                <label>Reason <span className="text-red-500">*</span></label>

                                <textarea
                                    className="w-full border p-2 rounded h-24"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Reason..."
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-teal-700 text-white py-3 rounded hover:bg-teal-800 transition duration-200"
                            >
                                Submit →
                            </button>

                        </form>

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="bg-white rounded-xl shadow-lg border-t-4 border-yellow-500 p-6">

                        <h2 className="text-2xl font-semibold text-center mb-6">
                            My Leave Balance
                        </h2>

                        <table className="w-full text-sm">

                            <thead className="bg-teal-700 text-white">
                                <tr>
                                    <th className="p-2 text-left">Leave Type</th>
                                    <th className="p-2">Balance</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr className="border-b">
                                    <td className="p-2">🌴 Casual Leave</td>
                                    <td className="text-center font-semibold">{balance.casual}</td>

                                </tr>


                                <tr className="border-b">
                                    <td className="p-2">💰 Earned</td>
                                    <td className="text-center font-semibold">{balance.earned}</td>

                                </tr>

                                <tr>
                                    <td className="p-2">⏱ Short</td>
                                    <td className="text-center font-semibold">{balance.short}</td>
                                </tr>

                            </tbody>

                        </table>

                        <p className="mt-4 text-sm">
                            Total Leave Taken: <span className="font-semibold">{balance.totalTaken} Days</span>
                        </p>

                        <div className="mt-4">

                            <p className="text-sm mb-1">
                                Earned Leave Utilization
                            </p>

                            <div className="w-full bg-gray-200 rounded-full h-4">

                                <div
                                    className="bg-teal-700 h-4 rounded-full text-xs text-white text-center"
                                    style={{ width: `${Math.min(balance.earnedUtilization, 100)}%` }}
                                >
                                    {balance.earnedUtilization}%
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}