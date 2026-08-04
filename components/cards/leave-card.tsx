export default function LeaveCard() {

  return (

    <div className="p-6 rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 shadow-md">

      <h2 className="text-lg mb-4">
        Leave Management Overview
      </h2>

      <div className="space-y-2 text-sm">

        <p>🟢 On Leave : 12</p>
        <p>🟡 Pending : 8</p>
        <p>⚪ Available Pool : 145</p>

      </div>

    </div>

  )
}