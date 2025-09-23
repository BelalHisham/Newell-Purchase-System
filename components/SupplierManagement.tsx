"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLayout } from "./layout/layout-provider";

// All supplier sub-departments
const subDepartments = [
  "Electrical - PVC Conduit And accessories",
  "Electrical - GIBox",
  "Electrical - Cables and single",
  "Electrical - Core Wires",
  "Electrical - Light fitting",
  "Electrical - Switch Gear",
  "Electrical - Switches and Sockets",
  "Electrical - GI Conduits",
  "Plumbing - Upvc pipes and fittings",
  "Plumbing - Manhole covers",
  "Plumbing - PPR and Pex pipes",
  "Plumbing - Sound proof pipes & fittings",
  "Plumbing - Insulation for sound proof",
  "HVAC - AC Duct GI",
  "HVAC - VcD and Dumbers",
  "HVAC - AC Duct PI / phenolic",
  "HVAC - Grilles and diffusers",
  "HVAC - Duct insulation",
  "HVAC - Duct connector",
  "HVAC - Acoustic linear",
  "HVAC - Flexible duct",
  "HVAC - Copper pipes and fittings",
  "HVAC - Insulation for copper pipes",
  "Fire Fighting - Fire alarm system",
  "Fire Fighting - GI conduits",
  "Fire Fighting - Fire fighting material",
  "Fire Fighting - Emergency / Exit lights",
  "Hardware - Any",
];

// Extract unique main departments from sub-departments
const mainDepartments = ["All", ...Array.from(new Set(subDepartments.map((d) => d.split(" - ")[0])))];

export function SupplierManagement() {
  const { suppliers, addSupplier, deleteSupplier } = useLayout();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    department: subDepartments[0],
    location: "",
    phoneNumber: "",
  });

  // Group suppliers by main department
  const filteredSuppliers = (mainDept: string) =>
    mainDept === "All"
      ? suppliers
      : suppliers.filter((s) => s.department.split(" - ")[0] === mainDept);

  const handleAddSupplier = async () => {
    if (!newSupplier.name || !newSupplier.email) return;
    await addSupplier(newSupplier);
    setDialogOpen(false);
    setNewSupplier({ name: "", email: "", department: subDepartments[0], location: "", phoneNumber: "" });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Suppliers Management</h3>
        <Button
          className="bg-yellow-600 hover:bg-yellow-700"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Supplier
        </Button>
      </Card>

      <Tabs defaultValue="All" className="w-full">
        <TabsList className="flex flex-wrap justify-start overflow-x-auto">
          {mainDepartments.map((dept) => (
            <TabsTrigger key={dept} value={dept}>
              {dept}
            </TabsTrigger>
          ))}
        </TabsList>

        {mainDepartments.map((dept) => (
          <TabsContent key={dept} value={dept}>
            <Card className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Department</th>
                    <th className="py-2">Location</th>
                    <th className="py-2">Phone</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers(dept).map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="py-2">{s.name}</td>
                      <td className="py-2">{s.email}</td>
                      <td className="py-2">{s.department}</td>
                      <td className="py-2">{s.location}</td>
                      <td className="py-2">{s.phoneNumber}</td>
                      <td className="py-2">
                        <Button variant="destructive" size="sm" onClick={() => deleteSupplier(s.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredSuppliers(dept).length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-muted-foreground">
                        No suppliers for {dept}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Supplier Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="py-2">Name</Label>
              <Input
                value={newSupplier.name}
                onChange={(e) => setNewSupplier((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label className="py-2">Email</Label>
              <Input
                type="email"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label className="py-2">Department</Label>
              <select
                className="w-full border rounded px-3 py-2"
                value={newSupplier.department}
                onChange={(e) => setNewSupplier((prev) => ({ ...prev, department: e.target.value }))}
              >
                {mainDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="py-2">Location</Label>
              <Input
                value={newSupplier.location}
                onChange={(e) => setNewSupplier((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <Label className="py-2">Phone Number</Label>
              <Input
                value={newSupplier.phoneNumber}
                onChange={(e) => setNewSupplier((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleAddSupplier} className="bg-sky-600 hover:bg-sky-700">
                Add Supplier
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
