export default function ReportsTable({
  reports,
  page,
  totalPages,
  setPage,
  onEdit
}:any){


  return(

    <div>

      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">

      <table className="w-full text-left min-w-175">

        <thead className="border-b">

          <tr>

            <th>Sr</th>
            <th>Name</th>
            <th>Email</th>
            <th>Dept</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Status</th>
            <th>Action</th>

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

          {reports.map((row:any,index:number)=>(

            <tr key={row.id} className="border-b">

              <td>{(page-1)*10 + index + 1}</td>

                <td>{row.user?.name || "-"}</td>

                <td>{row.user?.email || "-"}</td>

                <td>{row.user?.dept || "-"}</td>

                <td>{row.user?.phone || "-"}</td>

                <td>
                  {new Date(row.date).toISOString().split("T")[0]}
                </td>

              <td>{row.inTime}</td>

              <td>{row.outTime || "-"}</td>

              <td
                className={
                  row.status === "Completed"
                  ? "text-green-600"
                  : row.status === "Out Duty"
                  ? "text-blue-600"
                  : "text-yellow-600"
                }
              >
                {row.status}
              </td>

              <td>
                <button
                  onClick={()=>onEdit(row)}
                  className="bg-blue-500 text-white px-2 py-[2px] text-xs rounded hover:bg-blue-600"
                >
                Edit
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      </div>

      {/* Pagination */}

      <div className="flex flex-wrap justify-center gap-3 mt-5">

        <button
          disabled={page===1}
          onClick={()=>setPage(page-1)}
          className="border px-3 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="px-3 py-1">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page===totalPages || totalPages===0}
          onClick={()=>setPage(page+1)}
          className="border px-3 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>

      </div>

    </div>

  )

}