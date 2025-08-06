"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLayout } from "./layout/layout-provider"

export default function Dashboard() {
  const { materialRequests } = useLayout()

  // Calculated stats
  const total = materialRequests.length
  const pending = materialRequests.filter((r) => r.status === "Pending").length
  const approved = materialRequests.filter((r) => r.status === "Approved").length
  const rejected = materialRequests.filter((r) => r.status === "Rejected").length

  const byDepartment: { [dept: string]: number } = {}
  materialRequests.forEach((req) => {
    byDepartment[req.department] = (byDepartment[req.department] || 0) + 1
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">Total MRF Requests</h2>
          <p className="text-3xl font-bold mt-2">{total}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">Pending Requests</h2>
          <p className="text-3xl font-bold mt-2 text-yellow-500">{pending}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">Approved Requests</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">{approved}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">Rejected Requests</h2>
          <p className="text-3xl font-bold mt-2 text-red-500">{rejected}</p>
        </CardContent>
      </Card>

      {Object.keys(byDepartment).length > 0 && (
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Requests by Department</h2>
            <ul className="space-y-2">
              {Object.entries(byDepartment).map(([dept, count]) => (
                <li key={dept} className="flex justify-between">
                  <span>{dept}</span>
                  <span className="font-medium">{count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
