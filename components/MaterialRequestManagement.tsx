"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLayout } from "./layout/layout-provider"
import { MaterialRequestForm } from "./MaterialRequestForm"

export function MaterialRequestManagement() {
  
  const {
    materialRequests,
    addMaterialRequest,
    exportMaterialRequestsToCSV,
  } = useLayout()
  const [dialogOpen, setDialogOpen] = useState(false)

 const handleSubmit = async (data: any) => {
  try {
    await addMaterialRequest(data);
    setDialogOpen(false);
    // Refresh the page
    window.location.reload();
  } catch (error) {
    console.error("Error submitting material request:", error);
  }
};


   const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])
 

  return (
    isClient &&
    <div className="space-y-6 ">
      <Card className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Request Materials</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportMaterialRequestsToCSV}>
            <Download className="h-4 w-4 mr-2  " /> Export
          </Button>
          <Button
            className="bg-yellow-600 hover:bg-yellow-700"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> New MRF
          </Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MRF No.</TableHead>
                <TableHead>Engineer</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materialRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.mrfNumber}</TableCell>
                  <TableCell>{req.engineerName}</TableCell>
                  <TableCell>{req.projectName}</TableCell>
                  <TableCell>{req.siteLocation}</TableCell>
                  <TableCell>{req.department}</TableCell>
                  <TableCell>{req.requestDate}</TableCell>
                  <TableCell>{req.mrf_status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Material Request</DialogTitle>
          </DialogHeader>
          <MaterialRequestForm
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
