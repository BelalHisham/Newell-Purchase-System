"use client"

import { useState } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import numberToWords from "number-to-words"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLayout } from "@/components/layout/layout-provider"
import { Trash } from "lucide-react"

interface Item {
  description: string
  unit: string
  qty: number
  rate: number
}

interface SupplierInfo {
  companyName: string
  city: string
  poBox: string
  contactPerson: string
  phone: string
  trn: string
  project: string
  deliveryTerms: string
  deliveryContact: string
}

export default function LPOForm() {
  const { materialRequests } = useLayout()

  const [items, setItems] = useState<Item[]>([{ description: "", unit: "", qty: 0, rate: 0 }])
  const [conditions, setConditions] = useState("")
  const [lpoNumber, setLpoNumber] = useState("1004")
  const [department, setDepartment] = useState("Electrical")

  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date()
    const day = today.getDate()
    const month = today.toLocaleString("default", { month: "long" }).toUpperCase()
    const year = today.getFullYear()

    // Format as "5TH AUGUST, 2025" style
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "ST"
        : day === 2 || day === 22
          ? "ND"
          : day === 3 || day === 23
            ? "RD"
            : "TH"

    return `${day}${suffix} ${month}, ${year}`
  })

  const [supplierInfo, setSupplierInfo] = useState<SupplierInfo>({
    companyName: "",
    city: "",
    poBox: "P.O BOX: ",
    contactPerson: "",
    phone: "",
    trn: "100280249000003",
    project: "",
    deliveryTerms: "90 DAYS PDC",
    deliveryContact: "",
  })

  const [useMRF, setUseMRF] = useState(false)
  const [selectedMRF, setSelectedMRF] = useState<string>("")

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const updatedItems = [...items]

    if (field === "qty" || field === "rate") {
      updatedItems[index][field] = Number(value) as Item[typeof field]
    } else {
      updatedItems[index][field] = value as Item[typeof field]
    }

    setItems(updatedItems)
  }

  const handleSupplierChange = (field: keyof SupplierInfo, value: string) => {
    setSupplierInfo((prev) => ({ ...prev, [field]: value }))
  }

  const addItem = () => {
    setItems([...items, { description: "", unit: "", qty: 0, rate: 0 }])
  }

  const deleteItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, i) => i !== index)
      setItems(updatedItems)
    }
  }

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0)
  const vat = subtotal * 0.05
  const total = subtotal + vat

  // Improved number to words conversion
  const convertToWords = (amount: number): string => {
    const wholePart = Math.floor(amount)
    const decimalPart = Math.round((amount - wholePart) * 100)

    let result = numberToWords.toWords(wholePart) + " dirhams"
    if (decimalPart > 0) {
      result += " and " + numberToWords.toWords(decimalPart) + " fils"
    }

    return result.charAt(0).toUpperCase() + result.slice(1)
  }

  const totalInWords = convertToWords(total)

  const exportPDF = async () => {
    const doc = new jsPDF()

    // Add company header with simplified bilingual approach
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Newell Electromechanical works LLC", 14, 15)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Newell Electromechanical Works LLC", 200, 15, { align: "right" })
    doc.setFontSize(10)
    doc.text("P.O Box: BB593 Dubai,U.A.E", 200, 20, { align: "right" })
    doc.text("Tel.: +971 4 8843367", 200, 25, { align: "right" })
    doc.text("Email : info@newellmepco.com", 200, 30, { align: "right" })

    // Company details (left side)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text("P.O Box: BB593 Dubai,U.A.E", 14, 20)
    doc.text("Tel.: +971 4 8843367", 14, 25)
    doc.text("Email : info@newellmepco.com", 14, 30)

    // Add logo
    try {
      const logo = await fetch("/newell-logo.png")
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.readAsDataURL(blob)
            }),
        )
      // doc.addImage(logo, "PNG", 85, 10, 30, 20)
      doc.addImage(logo, "PNG", 90, 10, 30, 25)
    } catch (error) {
      console.log("Logo not found, continuing without it")
    }

    // Add dark blue stripe
    doc.setFillColor(41, 84, 115) // Dark blue color
    doc.rect(14, 45, 182, 3, "F")

    doc.setFontSize(11)
    doc.text(currentDate, 14, 60)
    doc.text("LPO", 160, 60)
    doc.text(`LPO NO : ${lpoNumber}`, 14, 70)

    // Supplier information (using form data)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text(supplierInfo.companyName, 14, 85)
    doc.setFont("helvetica", "normal")
    doc.text(supplierInfo.city, 14, 90)
    doc.text(supplierInfo.poBox, 14, 95)
    doc.text(`Kind Att : ${supplierInfo.contactPerson}`, 14, 100)
    doc.text(`New well TRN : ${supplierInfo.trn}`, 120, 100)
    doc.text(`PROJECT : ${supplierInfo.project}`, 14, 105)
    doc.text("Kindly supply the following as per price agreed", 14, 110)

    // Department header (previously hardcoded as ELECTRICE)
    doc.setFont("helvetica", "bold")
    doc.text(department, 14, 120)

    // Table with exact styling
    const tableData = items.map((item, index) => [
      (index + 1).toString(),
      item.description,
      item.unit,
      item.qty.toFixed(2),
      item.rate.toFixed(2),
      (item.qty * item.rate).toFixed(2),
    ])

    autoTable(doc, {
      startY: 125,
      head: [["SC NO", "DESCRIPTION", "UNIT", "QTY", "RATE", "TOTAL AMOUNT"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 1.5, // Reduced padding to fit more content
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 12 }, // Reduced width
        1: { halign: "left", cellWidth: 85 }, // Increased description width
        2: { halign: "center", cellWidth: 18 }, // Reduced width
        3: { halign: "center", cellWidth: 18 }, // Reduced width
        4: { halign: "right", cellWidth: 22 }, // Reduced width
        5: { halign: "right", cellWidth: 28 }, // Reduced width
      },
      showHead: "everyPage",
      margin: { top: 20, bottom: 60 }, // Leave space for footer content
    })

    const finalY = (doc as any).lastAutoTable.finalY

    const pageHeight = doc.internal.pageSize.height
    const remainingSpace = pageHeight - finalY
    const neededSpace = 100 // Approximate space needed for totals, conditions, and signature

    if (remainingSpace < neededSpace) {
      doc.addPage()
      const newFinalY = 20 // Start from top of new page

      // Add SUB TOTAL and VAT rows
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.text("SUB TOTAL", 120, newFinalY + 8)
      doc.text(subtotal.toFixed(2), 170, newFinalY + 8, { align: "right" })

      doc.text("VAT - 5%", 120, newFinalY + 15)
      doc.text(vat.toFixed(2), 170, newFinalY + 15, { align: "right" })

      // Total amount line with better spacing
      const wordsLines = doc.splitTextToSize(`TOTAL AMOUNT INCLUDING VAT - ${totalInWords}`, 130)
      const currentY = newFinalY + 25
      wordsLines.forEach((line: string, index: number) => {
        doc.text(line, 14, currentY + index * 6)
      })
      doc.text(total.toFixed(2), 185, newFinalY + 25, { align: "right" })

      // CONDITIONS section
      doc.setFont("helvetica", "bold")
      doc.text("CONDITIONS", 14, newFinalY + 45)
      doc.setFont("helvetica", "normal")

      doc.text(`PROJECT : ${supplierInfo.project}`, 14, newFinalY + 52)
      doc.text(`2. for delivery contact ${supplierInfo.deliveryContact}`, 14, newFinalY + 57)
      doc.text(`3. Payment terms : ${supplierInfo.deliveryTerms}`, 14, newFinalY + 62)

      // Add additional conditions if any
      if (conditions.trim()) {
        const conditionsLines = doc.splitTextToSize(conditions, 180)
        conditionsLines.forEach((line: string, index: number) => {
          doc.text(line, 14, newFinalY + 67 + index * 5)
        })
      }

      doc.text("Approved by", 14, newFinalY + 80)
      doc.line(20, newFinalY + 105, 80, newFinalY + 105)

      doc.text("Hesham Youssef", 14, newFinalY + 120)
      doc.text("Managing Partner", 14, newFinalY + 125)

      // Bottom dark stripe
      doc.setFillColor(41, 84, 115)
      doc.rect(14, newFinalY + 140, 182, 8, "F")
    } else {
      // Add SUB TOTAL and VAT rows on same page
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.text("SUB TOTAL", 120, finalY + 8)
      doc.text(subtotal.toFixed(2), 170, finalY + 8, { align: "right" })

      doc.text("VAT - 5%", 120, finalY + 15)
      doc.text(vat.toFixed(2), 170, finalY + 15, { align: "right" })

      // Total amount line with better spacing
      const wordsLines = doc.splitTextToSize(`TOTAL AMOUNT INCLUDING VAT - ${totalInWords}`, 130)
      const currentY = finalY + 25
      wordsLines.forEach((line: string, index: number) => {
        doc.text(line, 14, currentY + index * 6)
      })
      doc.text(total.toFixed(2), 185, finalY + 25, { align: "right" })

      // CONDITIONS section
      doc.setFont("helvetica", "bold")
      doc.text("CONDITIONS", 14, finalY + 45)
      doc.setFont("helvetica", "normal")

      doc.text(`PROJECT : ${supplierInfo.project}`, 14, finalY + 52)
      doc.text(`2. for delivery contact ${supplierInfo.deliveryContact}`, 14, finalY + 57)
      doc.text(`3. Payment terms : ${supplierInfo.deliveryTerms}`, 14, finalY + 62)

      // Add additional conditions if any
      if (conditions.trim()) {
        const conditionsLines = doc.splitTextToSize(conditions, 180)
        conditionsLines.forEach((line: string, index: number) => {
          doc.text(line, 14, finalY + 67 + index * 5)
        })
      }

      doc.text("Approved by", 14, finalY + 80)
      doc.line(20, finalY + 105, 80, finalY + 105)

      doc.text("Hesham Youssef", 14, finalY + 120)
      doc.text("Managing Partner", 14, finalY + 125)

      // Bottom dark stripe
      doc.setFillColor(41, 84, 115)
      doc.rect(14, finalY + 140, 182, 8, "F")
    }

    doc.save(`LPO-${lpoNumber}.pdf`)
  }

  const handleMRFSelect = (value: string) => {
    setSelectedMRF(value)
    const mrf = materialRequests.find((m) => m.mrfNumber === value)
    if (mrf) {
      const mrfItems = mrf.materials.map((mat) => ({
        description: mat.description,
        unit: mat.unit,
        qty: Number(mat.quantity),
        rate: 0, // Rate still needs to be filled manually
      }))
      setItems(mrfItems)

      // Map MRF data to form fields
      setDepartment(mrf.department.toUpperCase()) // Set department from MRF

      // Update supplier info with MRF project details
      setSupplierInfo((prev) => ({
        ...prev,
        project: `${mrf.projectName} - ${mrf.siteLocation}`, // Combine project name and site location
      }))

      // Update delivery contact to include engineer information
      setSupplierInfo((prev) => ({
        ...prev,
        deliveryContact: `${mrf.engineerName} / ${prev.deliveryContact}`, // Add engineer name to delivery contact
      }))

      // Add MRF details to conditions
      const mrfConditions = `MRF: ${mrf.mrfNumber} | Engineer: ${mrf.engineerName} | Site: ${mrf.siteLocation} | Request Date: ${mrf.requestDate}`
      setConditions((prev) => (prev ? `${prev}\n\n${mrfConditions}` : mrfConditions))
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Local Purchase Order</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">LPO Number</label>
            <Input value={lpoNumber} onChange={(e) => setLpoNumber(e.target.value)} placeholder="LPO Number" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} placeholder="Date" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <Select value={department} onValueChange={setDepartment}>
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

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Supplier Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <Input
                value={supplierInfo.companyName}
                onChange={(e) => handleSupplierChange("companyName", e.target.value)}
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input
                value={supplierInfo.city}
                onChange={(e) => handleSupplierChange("city", e.target.value)}
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">P.O Box</label>
              <Input
                value={supplierInfo.poBox}
                onChange={(e) => handleSupplierChange("poBox", e.target.value)}
                placeholder="P.O Box"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Person</label>
              <Input
                value={supplierInfo.contactPerson}
                onChange={(e) => handleSupplierChange("contactPerson", e.target.value)}
                placeholder="Contact Person"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">TRN</label>
              <Input
                value={supplierInfo.trn}
                onChange={(e) => handleSupplierChange("trn", e.target.value)}
                placeholder="TRN Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Terms</label>
              <Input
                value={supplierInfo.deliveryTerms}
                onChange={(e) => handleSupplierChange("deliveryTerms", e.target.value)}
                placeholder="Delivery Terms"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Project</label>
              <Textarea
                value={supplierInfo.project}
                onChange={(e) => handleSupplierChange("project", e.target.value)}
                placeholder="Project Details"
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Delivery Contact</label>
              <Input
                value={supplierInfo.deliveryContact}
                onChange={(e) => handleSupplierChange("deliveryContact", e.target.value)}
                placeholder="Delivery Contact Person and Phone"
              />
            </div>
          </div>
        </div>

        {/* MRF toggle and select */}
        <div className="flex items-center gap-3">
          <Switch checked={useMRF} onCheckedChange={setUseMRF} />
          <span className="text-sm">Load items from MRF</span>
        </div>

        {useMRF && (
          <div className="w-full max-w-xs">
            <Select value={selectedMRF} onValueChange={handleMRFSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select MRF number" />
              </SelectTrigger>
              <SelectContent>
                {materialRequests.map((mrf) => (
                  <SelectItem key={mrf.id} value={mrf.mrfNumber}>
                    {mrf.mrfNumber} — {mrf.projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Unit</th>
                <th className="border px-4 py-2">QTY</th>
                <th className="border px-4 py-2">Rate</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1 text-center">{index + 1}</td>
                  <td className="border px-2 py-1">
                    <Input
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <Input value={item.unit} onChange={(e) => handleItemChange(index, "unit", e.target.value)} />
                  </td>
                  <td className="border px-2 py-1">
                    <Input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1 text-right">{(item.qty * item.rate).toFixed(2)}</td>
                  <td className="border px-2 py-1 text-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteItem(index)}
                      disabled={items.length === 1}
                      className="h-8 w-8 p-0 hover:scale-110 transition-all disabled:bg-gray-200 disabled:text-gray-500 cursor-pointer"
                    >
                      <Trash className="h-4 w-4  " />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={addItem}>
          Add Item
        </Button>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            <strong>Subtotal:</strong> {subtotal.toFixed(2)}
          </p>
          <p>
            <strong>VAT (5%):</strong> {vat.toFixed(2)}
          </p>
          <p>
            <strong>Total:</strong> {total.toFixed(2)}
          </p>
          <p>
            <strong>Total (in words):</strong> {totalInWords}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Conditions</h3>
          <Textarea
            placeholder="Enter any additional conditions here..."
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
          />
        </div>

        <div className="mt-8 text-sm">
          <p>
            <strong>Approved by:</strong>
          </p>
          <div className="h-16 " />
          <p>
            <strong>Hesham Youssef</strong>
          </p>
          <p>Managing Partner</p>
        </div>

        <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={exportPDF}>
          Export as PDF
        </Button>
      </Card>
    </div>
  )
}
