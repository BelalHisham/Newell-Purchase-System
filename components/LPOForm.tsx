"use client"

import { useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import numberToWords from 'number-to-words'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLayout } from './layout/layout-provider'

interface Item {
  description: string
  unit: string
  qty: number
  rate: number
}

export default function LPOForm() {
  const { materialRequests } = useLayout()

  const [items, setItems] = useState<Item[]>([
    { description: '', unit: '', qty: 0, rate: 0 },
  ])
  const [conditions, setConditions] = useState('')
  const [lpoNumber] = useState('1004')

  const [useMRF, setUseMRF] = useState(false)
  const [selectedMRF, setSelectedMRF] = useState<string>('')

 const handleItemChange = (
  index: number,
  field: keyof Item,
  value: string | number
) => {
  const updatedItems = [...items]

  if (field === 'qty' || field === 'rate') {
    updatedItems[index][field] = Number(value) as Item[typeof field]
  } else {
    updatedItems[index][field] = value as Item[typeof field]
  }

  setItems(updatedItems)
}


  const addItem = () => {
    setItems([...items, { description: '', unit: '', qty: 0, rate: 0 }])
  }

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0)
  const vat = subtotal * 0.05
  const total = subtotal + vat
  const totalInWords = numberToWords.toWords(total.toFixed(2)) + ' only'

  const exportPDF = async () => {
    const doc = new jsPDF()


    // doc.addImage(logo, 'PNG', 10, 10, 40, 20)

    doc.setFontSize(12)
    doc.text('Newell Electromechanical works LLC', 55, 15)
    doc.setFontSize(10)
    doc.text('P.O Box: 88593 Dubai, U.A.E', 55, 21)
    doc.text('Tel: +971 4 8843367', 55, 26)
    doc.text('Email: info@newellmepco.com', 55, 31)

    
    const logo = await fetch('/newell-logo.PNG')
      .then(res => res.blob())
      .then(blob => new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      }))
    doc.addImage(logo, 'PNG', 10, 10, 28, 20)

    doc.setFontSize(11)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 15)
    doc.text(`LPO No: ${lpoNumber}`, 150, 21)

    doc.setFontSize(12)
    doc.text('LOCAL PURCHASE ORDER', 80, 40)

    autoTable(doc, {
      startY: 50,
      head: [['#', 'Description', 'Unit', 'QTY', 'Rate', 'Total']],
      body: items.map((item, index) => [
        index + 1,
        item.description,
        item.unit,
        item.qty,
        item.rate.toFixed(2),
        (item.qty * item.rate).toFixed(2),
      ]),
    })

    const finalY = (doc as any).lastAutoTable.finalY

    doc.text(`SUB TOTAL: ${subtotal.toFixed(2)}`, 140, finalY + 10)
    doc.text(`VAT 5%: ${vat.toFixed(2)}`, 140, finalY + 16)
    doc.text(`TOTAL: ${total.toFixed(2)}`, 140, finalY + 22)
    doc.text(`TOTAL AMOUNT INCLUDING VAT: ${totalInWords}`, 14, finalY + 32)

    doc.setFontSize(10)
    doc.text('CONDITIONS', 14, finalY + 44)
    doc.text(conditions || '—', 14, finalY + 50)

    doc.text('Approved by:', 14, finalY + 70)
    doc.line(14, finalY + 75, 80, finalY + 75)
    doc.text('Hesham Youssef', 14, finalY + 82)
    doc.text('Managing Partner', 14, finalY + 87)

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
        rate: 0,
      }))
      setItems(mrfItems)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Local Purchase Order</h2>

        {/* MRF toggle and select */}
        <div className="flex items-center gap-3">
          <Switch  checked={useMRF} onCheckedChange={setUseMRF} />
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
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1 text-center">{index + 1}</td>
                  <td className="border px-2 py-1">
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, 'description', e.target.value)
                      }
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <Input
                      value={item.unit}
                      onChange={(e) =>
                        handleItemChange(index, 'unit', e.target.value)
                      }
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <Input
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(index, 'qty', e.target.value)
                      }
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(index, 'rate', e.target.value)
                      }
                    />
                  </td>
                  <td className="border px-2 py-1 text-right">
                    {(item.qty * item.rate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button className='bg-yellow-600 hover:bg-yellow-700' onClick={addItem}>Add Item</Button>

        <div className="mt-4 space-y-2 text-sm">
          <p><strong>Subtotal:</strong> {subtotal.toFixed(2)}</p>
          <p><strong>VAT (5%):</strong> {vat.toFixed(2)}</p>
          <p><strong>Total:</strong> {total.toFixed(2)}</p>
          <p><strong>Total (in words):</strong> {totalInWords}</p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Conditions</h3>
          <Textarea
            placeholder="Enter any conditions here..."
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
          />
        </div>

        <div className="mt-8 text-sm">
          <p><strong>Approved by:</strong></p>
          <div className="h-16 border border-gray-300 my-2" />
          <p><strong>Hesham Youssef</strong></p>
          <p>Managing Partner</p>
        </div>

        <Button className='bg-yellow-600 hover:bg-yellow-700' onClick={exportPDF}>Export as PDF</Button>
      </Card>
    </div>
  )
}
