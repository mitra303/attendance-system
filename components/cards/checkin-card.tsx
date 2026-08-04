export default function CheckinCard() {

  return (

    <div className="p-6 rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md">

      <h2 className="text-lg mb-4">
        Check-in / Out Activity
      </h2>

      <div className="space-y-2 text-sm">

        <div className="flex justify-between">
          <span>Baian Name</span>
          <span>07:07 AM</span>
        </div>

        <div className="flex justify-between">
          <span>James Faith</span>
          <span>07:08 AM</span>
        </div>

        <div className="flex justify-between">
          <span>Koree Seatha</span>
          <span>07:02 PM</span>
        </div>

      </div>

    </div>

  )
}