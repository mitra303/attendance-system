import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import AttendanceCard from "@/components/cards/attendance-card"
import CheckinCard from "@/components/cards/checkin-card"
import LeaveCard from "@/components/cards/leave-card"

export default function Dashboard() {

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8 ml-64">

        <Header />

        <div className="grid grid-cols-3 gap-6">

          <AttendanceCard />
          <CheckinCard />
          <LeaveCard />

        </div>

      </div>

    </div>

  )
}