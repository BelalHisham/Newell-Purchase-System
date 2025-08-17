"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MaterialItem {
  description: string
  quantity: string
  unit: string
  remarks: string
}

interface MaterialRequestFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function MaterialRequestForm({ onSubmit, onCancel }: MaterialRequestFormProps) {
  const [form, setForm] = useState({
    requestDate: new Date().toISOString().slice(0, 10),
    engineerName: "",
    projectName: "",
    siteLocation: "",
    department: "Electrical",
  })

  const [materials, setMaterials] = useState<MaterialItem[]>([
    { description: "", quantity: "", unit: "", remarks: "" },
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleMaterialChange = (index: number, name: string, value: string) => {
    const updated = [...materials]
    updated[index][name as keyof MaterialItem] = value
    setMaterials(updated)
  }

  const addMaterialRow = () => {
    setMaterials((prev) => [...prev, { description: "", quantity: "", unit: "", remarks: "" }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...form, materials })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/** Each input wrapper gets w-full and min-w-0 to prevent overflow */}
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
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Plumbing">Plumbing</SelectItem>
              <SelectItem value="HVAC">HVAC</SelectItem>
              <SelectItem value="Fire Fighting">Fire Fighting</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Materials</Label>
        {materials.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5 mt-4"
          >
            <Input
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleMaterialChange(index, "description", e.target.value)}
              className="w-full min-w-0 "
            />
            <Input
              placeholder="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e) => handleMaterialChange(index, "quantity", e.target.value)}
              className="w-full min-w-0 "
            />
            <Input
              placeholder="Unit"
              value={item.unit}
              onChange={(e) => handleMaterialChange(index, "unit", e.target.value)}
              className="w-full min-w-0 "
            />
            <Input
              placeholder="Remarks"
              value={item.remarks}
              onChange={(e) => handleMaterialChange(index, "remarks", e.target.value)}
              className="w-full min-w-0 "
            />
          </div>
        ))}
        <Button type="button" onClick={addMaterialRow} className="mt-4 bg-yellow-600 hover:bg-yellow-700 ">
          Add Material
        </Button>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full md:w-auto">
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full md:w-auto bg-yellow-600 hover:bg-yellow-700"
        >
          Submit Request
        </Button>
      </div>
    </form>
  )
}
