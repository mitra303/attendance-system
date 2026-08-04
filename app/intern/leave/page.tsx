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
    const [fromHalfDay, setFromHalfDay] = useState(false)
    const [toHalfDay, setToHalfDay] = useState(false)

    const [fromHalfType, setFromHalfType] = useState("")
    const [toHalfType, setToHalfType] = useState("")
    const [loading, setLoading] = useState(false)



    const [balance, setBalance] = useState({
        casual: 0,
        earned: 0,
        short: 0,
        totalTaken: 0,
        earnedUtilization: 0
    })

    const submitLeave = async (e: any) => {

        e.preventDefault()
        if (loading) return

        setLoading(true)

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
                    fromHalfDay,
                    fromHalfType,
                    toHalfDay,
                    toHalfType,
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
            setFromHalfDay(false)
            setToHalfDay(false)
            setFromHalfType("")
            setToHalfType("")

            fetchBalance()

        } catch (error) {

            toast.error("Server error")

        }finally {

            // ✅ loader always stop
            setLoading(false)

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

                                <div className="grid grid-cols-2 gap-4 items-start">

                                    {/* FROM */}

                                    <div>
                                        <label>From <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            className="w-full border p-2 rounded"
                                            value={fromDate}
                                            onChange={(e) => {
                                                    const value = e.target.value
                                                    setFromDate(value)

                                                    // agar toDate empty hai to same date set kar do
                                                    if (!toDate) {
                                                    setToDate(value)
                                                    }
                                                }}
                                            required
                                        />

                                        <div className="flex items-center gap-2 mt-2">
                                            <input
                                                type="checkbox"
                                                checked={fromHalfDay}
                                                onChange={(e) => setFromHalfDay(e.target.checked)}
                                            />
                                            <label>Half day</label>
                                        </div>

                                        {fromHalfDay && (
                                            <div className="flex gap-4 mt-1 text-sm">
                                                <label className="flex items-center gap-1">
                                                    <input
                                                        type="radio"
                                                        name="fromHalf"
                                                        value="First Half"
                                                        onChange={(e) => setFromHalfType(e.target.value)}
                                                    />
                                                    First
                                                </label>

                                                <label className="flex items-center gap-1">
                                                    <input
                                                        type="radio"
                                                        name="fromHalf"
                                                        value="Second Half"
                                                        onChange={(e) => setFromHalfType(e.target.value)}
                                                    />
                                                    Second
                                                </label>
                                            </div>
                                        )}

                                    </div>


                                    {/* TO */}

                                    <div>
                                        <label>To <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            className="w-full border p-2 rounded"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                            required
                                        />

                                        <div className="flex items-center gap-2 mt-2">
                                            <input
                                                type="checkbox"
                                                checked={toHalfDay}
                                                onChange={(e) => setToHalfDay(e.target.checked)}
                                            />
                                            <label>Half day</label>
                                        </div>

                                        {toHalfDay && (
                                            <div className="flex gap-4 mt-1 text-sm">
                                                <label className="flex items-center gap-1">
                                                    <input
                                                        type="radio"
                                                        name="toHalf"
                                                        value="First Half"
                                                        onChange={(e) => setToHalfType(e.target.value)}
                                                    />
                                                    First
                                                </label>

                                                <label className="flex items-center gap-1">
                                                    <input
                                                        type="radio"
                                                        name="toHalf"
                                                        value="Second Half"
                                                        onChange={(e) => setToHalfType(e.target.value)}
                                                    />
                                                    Second
                                                </label>
                                            </div>
                                        )}

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
                                {/* Submit → */}
                                {loading ? "Submitting..." : "Submit →"}
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