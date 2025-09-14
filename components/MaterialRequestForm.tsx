"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MaterialItem {
  description: string;
  quantity: string;
  unit: string;
  remarks: string;
}

interface MaterialRequestFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function MaterialRequestForm({ onSubmit, onCancel }: MaterialRequestFormProps) {
  const [form, setForm] = useState({
    requestDate: new Date().toISOString().slice(0, 10),
    engineerName: "",
    projectName: "",
    siteLocation: "",
    department: "Electrical",
  });

  const [materials, setMaterials] = useState<MaterialItem[]>([
    { description: "", quantity: "", unit: "", remarks: "" },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaterialChange = (index: number, name: string, value: string) => {
    const updated = [...materials];
    updated[index][name as keyof MaterialItem] = value;
    setMaterials(updated);
  };

  const addMaterialRow = () => {
    setMaterials((prev) => [...prev, { description: "", quantity: "", unit: "", remarks: "" }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, materials });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 h-[80vh] md:h-full overflow-y-auto p-4"
    >
      {/* General Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full min-w-0">
          <Label className="my-2">Request Date</Label>
          <Input
            type="date"
            name="requestDate"
            value={form.requestDate}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="w-full min-w-0">
          <Label className="my-2">Engineer Name</Label>
          <Input
            name="engineerName"
            value={form.engineerName}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="w-full min-w-0">
          <Label className="my-2">Project Name</Label>
          <Input
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="w-full min-w-0">
          <Label className="my-2">Site Location</Label>
          <Input
            name="siteLocation"
            value={form.siteLocation}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="w-full min-w-0">
          <Label className="my-2">Department</Label>
          <Select
            value={form.department}
            onValueChange={(value) => setForm((prev) => ({ ...prev, department: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Electrical - PVC Conduit And accessories">Electrical - PVC Conduit And accessories</SelectItem>
              <SelectItem value="Electrical - GIBox">Electrical - GIBox</SelectItem>
              <SelectItem value="Electrical - Cables and single">Electrical - Cables and single</SelectItem>
              <SelectItem value="Electrical - Core Wires">Electrical - Core Wires</SelectItem>
              <SelectItem value="Electrical - Light fitting">Electrical - Light fitting</SelectItem>
              <SelectItem value="Electrical - Switch Gear">Electrical - Switch Gear</SelectItem>
              <SelectItem value="Electrical - Switches and Sockets">Electrical - Switches and Sockets</SelectItem>
              <SelectItem value="Electrical - GI Conduits">Electrical - GI Conduits</SelectItem>

              <SelectItem value="Plumbing - Upvc pipes and fittings">Plumbing - Upvc pipes and fittings</SelectItem>
              <SelectItem value="Plumbing - Manhole covers">Plumbing - Manhole covers</SelectItem>
              <SelectItem value="Plumbing - PPR and Pex pipes">Plumbing - PPR and Pex pipes</SelectItem>
              <SelectItem value="Plumbing - Sound proof pipes & fittings">Plumbing - Sound proof pipes & fittings</SelectItem>
              <SelectItem value="Plumbing - Insulation for sound proof">Plumbing - Insulation for sound proof</SelectItem>

              <SelectItem value="HVAC - AC Duct GI">HVAC - AC Duct GI</SelectItem>
              <SelectItem value="HVAC - VcD and Dumbers">HVAC - VcD and Dumbers</SelectItem>
              <SelectItem value="HVAC - AC Duct PI / phenolic">HVAC - AC Duct PI / phenolic</SelectItem>
              <SelectItem value="HVAC - Grilles and diffusers">HVAC - Grilles and diffusers</SelectItem>
              <SelectItem value="HVAC - Duct insulation">HVAC - Duct insulation</SelectItem>
              <SelectItem value="HVAC - Duct connector">HVAC - Duct connector</SelectItem>
              <SelectItem value="HVAC - Acoustic linear">HVAC - Acoustic linear</SelectItem>
              <SelectItem value="HVAC - Flexible duct">HVAC - Flexible duct</SelectItem>
              <SelectItem value="HVAC - Copper pipes and fittings">HVAC - Copper pipes and fittings</SelectItem>
              <SelectItem value="HVAC - Insulation for copper pipes">HVAC - Insulation for copper pipes</SelectItem>

              <SelectItem value="Fire Fighting - Fire alarm system">Fire Fighting - Fire alarm system</SelectItem>
              <SelectItem value="Fire Fighting - GI conduits">Fire Fighting - GI conduits</SelectItem>
              <SelectItem value="Fire Fighting - Fier fighting material">Fire Fighting - Fier fighting material</SelectItem>
              <SelectItem value="Fire Fighting - Emergncy / Exit lights">Fire Fighting - Emergncy / Exit lights</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Materials Section */}
      <div>
        <Label className="mt-4">Materials</Label>
        <div className="space-y-4">
          {materials.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5"
            >
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleMaterialChange(index, "description", e.target.value)}
                className="w-full min-w-0"
              />
              <Input
                placeholder="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) => handleMaterialChange(index, "quantity", e.target.value)}
                className="w-full min-w-0"
              />
              <Input
                placeholder="Unit"
                value={item.unit}
                onChange={(e) => handleMaterialChange(index, "unit", e.target.value)}
                className="w-full min-w-0"
              />
              <Input
                placeholder="Remarks"
                value={item.remarks}
                onChange={(e) => handleMaterialChange(index, "remarks", e.target.value)}
                className="w-full min-w-0"
              />
            </div>
          ))}
        </div>

        <Button
          type="button"
          onClick={addMaterialRow}
          className="mt-4 bg-yellow-600 hover:bg-yellow-700"
        >
          Add Material
        </Button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 md:flex-row md:justify-end mt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full md:w-auto">
          Cancel
        </Button>
        <Button type="submit" className="w-full md:w-auto bg-yellow-600 hover:bg-yellow-700">
          Submit Request
        </Button>
      </div>
    </form>
  );
}
