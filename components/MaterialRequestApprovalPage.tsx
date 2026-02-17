"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useLayout } from "@/components/layout/layout-provider";
import { Eye, CheckCircle, XCircle, Trash } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export default function MaterialRequestApprovalPage() {
  const {
    materialRequests,
    updateMaterialRequest,
    deleteMaterialRequest,
    suppliers,
  } = useLayout();

  const [selectedMRF, setSelectedMRF] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpenDialog = (mrf: any) => {
    setSelectedMRF(mrf);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMRF(null);
  };

  const handleApprove = async () => {
    if (!selectedMRF) return;

    const department = selectedMRF.department;
    const emails = suppliers
      .filter((s) => s.department === department)
      .map((s) => s.email);

    try {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: emails,
          mrfNumber: selectedMRF.mrfNumber,
          engineerName: selectedMRF.engineerName,
          projectName: selectedMRF.projectName,
          siteLocation: selectedMRF.siteLocation,
          department: selectedMRF.department,
          requestDate: selectedMRF.requestDate,
          materials: selectedMRF.materials,
        }),
      });

      updateMaterialRequest({ ...selectedMRF, mrf_status: "Approved" });
    } catch (err) {
      console.error("Error sending email:", err);
    } finally {
      handleCloseDialog();
      
    }
  };

  const handleReject = () => {
    if (!selectedMRF) return;
    updateMaterialRequest({ ...selectedMRF, mrf_status: "Rejected" });
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this material request?")) {
      deleteMaterialRequest(id);
      if (selectedMRF?.id === id) {
        handleCloseDialog();
      }
    }
  };

  const renderStatusBadge = (status?: string) => {
    const base = "rounded px-2 py-1 text-xs font-medium";
    switch (status) {
      case "Approved":
        return (
          <Badge className={`${base} bg-green-100 text-green-700`}>Approved</Badge>
        );
      case "Rejected":
        return (
          <Badge className={`${base} bg-red-100 text-red-700`}>Rejected</Badge>
        );
      default:
        return (
          <Badge className={`${base} bg-yellow-100 text-yellow-700`}>Pending</Badge>
        );
    }
  };

  const filteredMRFs = (status: string | "all") =>
    status === "all"
      ? materialRequests
      : materialRequests.filter((req) => req.mrf_status === status);

  return (
    isClient && (
      <div className="space-y-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Material Request Approvals</h2>
        </Card>

        <Card className="p-0">
          <Tabs defaultValue="all">
            <TabsList className="border-b rounded-none justify-start w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Pending">Pending</TabsTrigger>
              <TabsTrigger value="Approved">Approved</TabsTrigger>
              <TabsTrigger value="Rejected">Rejected</TabsTrigger>
            </TabsList>

            {["all", "Pending", "Approved", "Rejected"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>MRF No</TableHead>
                        <TableHead>Engineer</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMRFs(tab).map((req) => (
                        <TableRow key={req.mrf_id}>
                          <TableCell>{req.mrfNumber}</TableCell>
                          <TableCell>{req.engineerName}</TableCell>
                          <TableCell>{req.projectName}</TableCell>
                          <TableCell>{req.department}</TableCell>
                          <TableCell>{req.requestDate}</TableCell>
                          <TableCell>{renderStatusBadge(req.mrf_status)}</TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(req)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(req.mrfNumber)}
                              title="Delete"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>

        {/* MRF Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Material Request Details</DialogTitle>
            </DialogHeader>

            {selectedMRF && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <strong>MRF Number:</strong> {selectedMRF.mrfNumber}
                  </div>
                  <div>
                    <strong>Engineer:</strong> {selectedMRF.engineerName}
                  </div>
                  <div>
                    <strong>Project:</strong> {selectedMRF.projectName}
                  </div>
                  <div>
                    <strong>Site:</strong> {selectedMRF.siteLocation}
                  </div>
                  <div>
                    <strong>Department:</strong> {selectedMRF.department}
                  </div>
                  <div>
                    <strong>Date:</strong> {selectedMRF.requestDate}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mt-4 mb-2">Materials</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedMRF.materials.map((item: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.remarks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {selectedMRF.mrf_status === "Pending" && (
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="destructive" onClick={handleReject}>
                      <XCircle className="h-4 w-4 mr-2" /> Reject
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleApprove}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Request quotation
                    </Button>
                  </div>
                )}

                <div className="flex justify-start mt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedMRF.mrfNumber)}
                  >
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  );
}
