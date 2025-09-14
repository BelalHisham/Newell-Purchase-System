"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLayout } from "./layout/layout-provider";

const departments = ["All", "Electrical", "Plumbing", "HVAC", "Fire Fighting"];

export function SupplierManagement() {
  const { suppliers, addSupplier, deleteSupplier } = useLayout();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    department: "Electrical",
    location: "",
    phoneNumber: "",
  });

  const handleAddSupplier = async () => {
    if (!newSupplier.name || !newSupplier.email) return;
    await addSupplier(newSupplier); // API call
    setDialogOpen(false);
    setNewSupplier({ name: "", email: "", department: "Electrical", location: "", phoneNumber: "" });
  };

  const filteredSuppliers = (department: string) =>
    department === "All" ? suppliers : suppliers.filter((s) => s.department === department);

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
          {departments.map((dept) => (
            <TabsTrigger key={dept} value={dept}>
              {dept}
            </TabsTrigger>
          ))}
        </TabsList>

        {departments.map((dept) => (
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
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteSupplier(s.id)}
                        >
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
                onChange={(e) =>
                  setNewSupplier((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="py-2">Email</Label>
              <Input
                type="email"
                value={newSupplier.email}
                onChange={(e) =>
                  setNewSupplier((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="py-2">Department</Label>
              <select
                className="w-full border rounded px-3 py-2"
                value={newSupplier.department}
                onChange={(e) =>
                  setNewSupplier((prev) => ({ ...prev, department: e.target.value }))
                }
              >
                {departments.slice(1).map((dept) => (
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
                onChange={(e) =>
                  setNewSupplier((prev) => ({ ...prev, location: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="py-2">Phone Number</Label>
              <Input
                value={newSupplier.phoneNumber}
                onChange={(e) =>
                  setNewSupplier((prev) => ({ ...prev, phoneNumber: e.target.value }))
                }
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
