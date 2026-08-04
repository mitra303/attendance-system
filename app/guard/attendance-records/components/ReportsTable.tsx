export default function ReportsTable({
  reports,
  page,
  totalPages,
  setPage
}: any) {

  return (

    <div>

      <table className="w-full text-left">

        <thead className="border-b">

          <tr>

            <th>Sr</th>
            <th>Name</th>
            <th>Email</th>
            <th>Dept</th>
            <th>Date</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {reports.length === 0 && (

            <tr>

              <td colSpan={9} className="text-center py-6 text-gray-500">
                Data Not Found
              </td>

            </tr>

          )}

          {reports.map((row: any, index: number) => (

            <tr key={row.id} className="border-b">

              <td>{(page - 1) * 10 + index + 1}</td>

              <td>{row.user?.name || "-"}</td>

              <td>{row.user?.email || "-"}</td>

              <td>{row.user?.dept || "-"}</td>

              <td>{new Date(row.date).toLocaleDateString()}</td>

              <td>{row.inTime}</td>

              <td>{row.outTime || "-"}</td>

              <td
                className={
                  row.status === "Completed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }
              >
                {row.status}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* Pagination */}

      <div className="flex justify-center gap-3 mt-5">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="border px-3 py-1 rounded"
        >
          Previous
        </button>

        <span className="px-3 py-1 bg-blue-600 text-white rounded">
          {page}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="border px-3 py-1 rounded"
        >
          Next
        </button>

      </div>

    </div>

  )

}