"use client"

import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Flower, PartyPopper, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function AttendanceView() {

    const today = new Date()

    const [month, setMonth] = useState(today.getMonth() + 1)
    const [year, setYear] = useState(today.getFullYear())
    const [attendance, setAttendance] = useState<any[]>([])
    const [leaves, setLeaves] = useState<any[]>([])


    const internId = typeof window !== "undefined"
        ? localStorage.getItem("userId")
        : null

    const holidays2026 = [
        { date: "2026-01-01", reason: "New Year's Day" },
        { date: "2026-01-26", reason: "Republic Day" },
        { date: "2026-03-04", reason: "Holi" },
        { date: "2026-08-15", reason: "Independence Day" },
        { date: "2026-08-28", reason: "Raksha Bandhan" },
        { date: "2026-09-04", reason: "Janmashtami" },
        { date: "2026-10-02", reason: "Gandhi Jayanti" },
        { date: "2026-10-20", reason: "Dussehra" },
        { date: "2026-11-09", reason: "Govardhan Puja" },
        { date: "2026-11-10", reason: "Vikram Samvat New Year" },
        { date: "2026-11-11", reason: "Bhai Dooj" }
    ]

    const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "long"
    })

    const daysInMonth = new Date(year, month, 0).getDate()

    const firstDayOfMonth = new Date(year, month - 1, 1).getDay()

    const fetchAttendance = async () => {

        if (!internId) return

        const res = await fetch(
            `/api/intern-attendance?internId=${internId}&month=${month}&year=${year}`
        )

        const data = await res.json()

        setAttendance(data)
    }


    const fetchLeaves = async () => {

        if (!internId) return

        const res = await fetch(
            `/api/intern-leaves?userId=${internId}&month=${month}&year=${year}`
        )

        const data = await res.json()

        setLeaves(data)
    }

    useEffect(() => {
        fetchAttendance()
        fetchLeaves()
    }, [month, year])

    const nextMonth = () => {
        if (month === 12) {
            setMonth(1)
            setYear(prev => prev + 1)
        } else {
            setMonth(prev => prev + 1)
        }
    }

    const prevMonth = () => {
        if (month === 1) {
            setMonth(12)
            setYear(prev => prev - 1)
        } else {
            setMonth(prev => prev - 1)
        }
    }

    const calculateHours = (inTime: string, outTime?: string) => {
        if (!outTime) return null

        const today = new Date().toDateString()

        const start = new Date(`${today} ${inTime}`)
        const end = new Date(`${today} ${outTime}`)

        const diffMs = end.getTime() - start.getTime()

        const hours = Math.floor(diffMs / (1000 * 60 * 60))
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

        return `${hours}h ${minutes}m`
    }

    return (

        <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

            <Sidebar />

            <div className="flex-1 ml-64 p-8">

                <Header />

                {/* Calendar Card */}

                <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">

                    {/* Month Navigation */}

                    <div className="bg-white/70 backdrop-blur-md shadow-md rounded-2xl p-4 flex items-center justify-between mb-6">

                        <button
                            onClick={prevMonth}
                            className="w-10 h-10 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center shadow"
                        >
                            ←
                        </button>

                        <h2 className="text-2xl font-semibold tracking-wide text-gray-700">
                            {monthName} | {year}
                        </h2>

                        <button
                            onClick={nextMonth}
                            className="w-10 h-10 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center shadow"
                        >
                            →
                        </button>

                    </div>

                    {/* Week Header */}

                    <div className="grid grid-cols-7 text-center font-semibold text-gray-500 mb-3">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>

                    {/* Calendar Grid */}

                    <div className="grid grid-cols-7 gap-4">

                        {/* Empty cells before first day */}

                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={"empty-" + i}></div>
                        ))}

                        {/* Actual days */}

                        {Array.from({ length: daysInMonth }).map((_, i) => {

                            const day = i + 1

                            const dateObj = new Date(year, month - 1, day)


                            const isWeekend = dateObj.getDay() === 0

                            // const record = attendance.find((a: any) =>
                            //     new Date(a.date).getDate() === day
                            // )

                            const record = attendance.find((a: any) => {
                                const d = new Date(a.date)
                                const current = new Date(year, month - 1, day)

                                return d.toDateString() === current.toDateString()
                            })

                            const leaveRecord = leaves.find((l: any) => {

                            //    if (l.date) {
                            //         const d = new Date(l.date)

                            //         return (
                            //             d.getDate() === day &&
                            //             d.getMonth() === month - 1 &&
                            //             d.getFullYear() === year
                            //         )
                            //     }

                                    if (l.date) {
                                        const d = new Date(l.date)
                                        const current = new Date(year, month - 1, day)

                                        return d.toDateString() === current.toDateString()
                                    }

                                // if (l.fromDate && l.toDate) {

                                //     const start = new Date(l.fromDate)
                                //     const end = new Date(l.toDate)
                                //     const current = new Date(year, month - 1, day)

                                //     return current >= start && current <= end
                                // }
                                if (l.fromDate && l.toDate) {

                                    const start = new Date(l.fromDate)
                                    const end = new Date(l.toDate)
                                    const current = new Date(year, month - 1, day)

                                    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate())
                                    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate())

                                    return current >= startDate && current <= endDate
                                }

                                return false
                            })

                            const hours = record ? calculateHours(record.inTime, record.outTime) : null
                            const isPastDate = dateObj < new Date(new Date().setHours(0,0,0,0))
                            const holiday = holidays2026.find(h => {
                                const d = new Date(h.date)
                                return (
                                    d.getDate() === day &&
                                    d.getMonth() === month - 1 &&
                                    d.getFullYear() === year
                                )
                            })

                            return (
                                <div
                                    key={day}
                                    className={`relative rounded-2xl p-3 h-28 border shadow-sm text-sm transition

                                    ${holiday
                                            ? "bg-yellow-50 border-yellow-300"
                                            : isWeekend
                                                ? "bg-rose-50 border-rose-300"
                                                : leaveRecord
                                                     ? "bg-blue-50 border-blue-300"
                                                    : record
                                                      ? "bg-emerald-50 border-emerald-300"
                                                        : "bg-white border-gray-200"}

                                    hover:shadow-lg
                                    `}
                                >

                                    {/* Day Number */}

                                    <div className="font-bold text-gray-700">{day}</div>

                                    {hours && (
                                        <div className="absolute top-2 right-2 text-[11px] px-2 py-1 rounded-md bg-amber-100 text-amber-800 shadow">
                                            ⏱ {hours}
                                        </div>
                                    )}

                                    {/* Holiday */}

                                    {holiday && (
                                        <div className="flex items-center gap-1 text-yellow-700 text-xs mt-1 font-semibold">
                                            <PartyPopper size={14} />
                                            {holiday.reason}
                                        </div>
                                     )}

                                     {/* Leave */}
                                     {leaveRecord && (
                                            <div className="flex items-center gap-1 text-blue-700 text-xs mt-1 font-semibold">
                                                🏖 On Leave
                                            </div>
                                    )}

                                    {/* Sunday */}

                                    {isWeekend && !holiday && !leaveRecord && (
                                        <div className="flex items-center gap-1 text-rose-500 text-xs mt-1 font-medium">
                                            <Flower size={14} />
                                            Sunday Off
                                        </div>
                                    )}

                                    {/* Attendance */}

                                    {record && !leaveRecord && (
                                        <div className="text-xs mt-1">

                                            <div className="flex items-center gap-1 text-green-700 font-semibold">
                                                <CheckCircle2 size={14} />
                                                Present
                                            </div>

                                            <div>In: {record.inTime}</div>

                                            {record.outTime && (
                                                <div>Out: {record.outTime}</div>
                                            )}

                                        </div>
                                    )}


                                    {/* Absent */}
                                        {!record && !leaveRecord && !isWeekend && !holiday && isPastDate && (
                                            <div className="text-xs mt-1 text-red-600 font-semibold">
                                                ❌ Absent
                                            </div>
                                        )}

                                </div>

                            )

                        })}

                    </div>

                </div>

            </div>

        </div>

    )
}