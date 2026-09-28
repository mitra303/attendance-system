"use client"

import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import LeaveBalanceTable from "@/components/LeaveBalanceTable"

export default function LeaveBalance() {

    return (

        <div className="flex bg-gray-100 min-h-screen">

            <Sidebar />

            <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 ml-0 md:ml-64">

                <Header />

                {/* Card */}
               <div className="bg-gray-50 rounded-2xl shadow-md p-4 sm:p-5 md:p-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-700 mb-6 text-center">
                    User Leave Balance
                </h1>

                <LeaveBalanceTable />
                </div>
            </div>

        </div>

    )
}