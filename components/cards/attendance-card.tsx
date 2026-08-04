export default function AttendanceCard() {
  return (

    <div className="p-6 rounded-xl text-white bg-gradient-to-r from-cyan-600 to-teal-500 shadow-md">

      <h2 className="text-lg mb-4">
        Overall Attendance Status
      </h2>

      <div className="text-5xl font-bold mb-3">
        94%
      </div>

      <div className="text-sm space-y-1">
        <p>Present: 282</p>
        <p>Absent: 18</p>
        <p>Total: 300</p>
      </div>

    </div>

  )
}