export default function HRDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">HR Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mt-8">

        <div className="p-6 bg-blue-100 rounded-xl">
          Intern Attendance
        </div>

        <div className="p-6 bg-blue-100 rounded-xl">
          Leave Requests
        </div>

        <div className="p-6 bg-blue-100 rounded-xl">
          Reports
        </div>

      </div>
    </div>
  )
}