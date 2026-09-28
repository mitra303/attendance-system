import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import AttendanceCard from "@/components/cards/attendance-card"
import CheckinCard from "@/components/cards/checkin-card"
import LeaveCard from "@/components/cards/leave-card"

export default function Dashboard() {

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 ml-0 md:ml-64">

        <Header />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <AttendanceCard />
          <CheckinCard />
          <LeaveCard />

        </div>

      </div>

    </div>

  )
}