import Header from "@/components/header"
import Sidebar from "@/components/sidebar"

export default function HRDashboard() {

  return (

    <div className="flex h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 overflow-auto">

        <Header />

        <h1 className="text-2xl font-semibold mb-6">
          {/* HR Dashboard */}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-blue-600 text-white p-6 rounded-xl">
            <p className="text-sm">Total Interns</p>
            <h2 className="text-3xl font-bold mt-2">24</h2>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-xl">
            <p className="text-sm">Present Today</p>
            <h2 className="text-3xl font-bold mt-2">20</h2>
          </div>

          <div className="bg-yellow-500 text-white p-6 rounded-xl">
            <p className="text-sm">Leave Requests</p>
            <h2 className="text-3xl font-bold mt-2">5</h2>
          </div>

        </div>

        {/* Leave Requests */}
        <div className="bg-white shadow rounded-xl p-6">

          <h2 className="text-lg font-semibold mb-4">
            Leave Requests
          </h2>

          <table className="w-full text-left">

            <thead className="border-b">
              <tr>
                <th className="py-2">Name</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-b">
                <td className="py-2">Rahul Kumar</td>
                <td>12 Mar</td>
                <td>Medical</td>
                <td className="text-yellow-600">Pending</td>
              </tr>

              <tr className="border-b">
                <td className="py-2">Aman Verma</td>
                <td>13 Mar</td>
                <td>Personal</td>
                <td className="text-green-600">Approved</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )
}