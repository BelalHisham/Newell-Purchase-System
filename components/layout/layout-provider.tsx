"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { v4 as uuidv4 } from "uuid"

// --- Types ---
export type MaterialRequest = {
  id: string
  requestDate: string
  mrfNumber: string
  engineerName: string
  projectName: string
  siteLocation: string
  department: string
  status?: "Pending" | "Approved" | "Rejected"
  materials: {
    description: string
    quantity: string
    unit: string
    remarks: string
  }[]
}

export type Supplier = {
  id: string
  name: string
  email: string
  department: string
}

// --- Context Type ---
type LayoutContextType = {
  materialRequests: MaterialRequest[]
  suppliers: Supplier[]
  addMaterialRequest: (request: Omit<MaterialRequest, "id" | "mrfNumber">) => void
  updateMaterialRequest: (request: MaterialRequest) => void
  deleteMaterialRequest: (id: string) => void
  addSupplier: (supplier: Omit<Supplier, "id">) => void
  deleteSupplier: (id: string) => void
  exportMaterialRequestsToCSV: () => void
}

// --- Create Context ---
const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

// --- Provider Component ---
export function LayoutProvider({ children }: { children: ReactNode }) {
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  // --- Load from localStorage on mount ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMRFs = localStorage.getItem("materialRequests")
      const savedSuppliers = localStorage.getItem("suppliers")
      if (savedMRFs) setMaterialRequests(JSON.parse(savedMRFs))
      if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers))
    }
  }, [])

  // --- Save to localStorage on change ---
  useEffect(() => {
    localStorage.setItem("materialRequests", JSON.stringify(materialRequests))
  }, [materialRequests])

  useEffect(() => {
    localStorage.setItem("suppliers", JSON.stringify(suppliers))
  }, [suppliers])

  // --- MRF Number Generator ---
  const generateMRFNumber = () => {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const count = materialRequests.length + 1
    const serial = count.toString().padStart(4, "0")
    return `MRF-${year}${month}-${serial}`
  }

  // --- Material Requests Methods ---
  const addMaterialRequest = (request: Omit<MaterialRequest, "id" | "mrfNumber">) => {
    const newRequest: MaterialRequest = {
      ...request,
      id: uuidv4(),
      mrfNumber: generateMRFNumber(),
      status: "Pending",
    }
    setMaterialRequests((prev) => [...prev, newRequest])
  }

  const updateMaterialRequest = (request: MaterialRequest) => {
    setMaterialRequests((prev) =>
      prev.map((r) => (r.id === request.id ? request : r))
    )
  }

  const deleteMaterialRequest = (id: string) => {
    setMaterialRequests((prev) => prev.filter((r) => r.id !== id))
  }

  // --- Supplier Methods ---
  const addSupplier = (supplier: Omit<Supplier, "id">) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: uuidv4(),
    }
    setSuppliers((prev) => [...prev, newSupplier])
  }

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id))
  }

  // --- CSV Export Logic ---
  const exportMaterialRequestsToCSV = () => {
    const headers = [
      "MRF Number",
      "Engineer Name",
      "Project Name",
      "Site Location",
      "Department",
      "Request Date",
      "Status",
    ]

    const rows = materialRequests.map((req) => [
      req.mrfNumber,
      req.engineerName,
      req.projectName,
      req.siteLocation,
      req.department,
      req.requestDate,
      req.status || "Pending",
    ])

    const csvContent =
      [headers, ...rows]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `material_requests_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <LayoutContext.Provider
      value={{
        materialRequests,
        suppliers,
        addMaterialRequest,
        updateMaterialRequest,
        deleteMaterialRequest,
        addSupplier,
        deleteSupplier,
        exportMaterialRequestsToCSV,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

// --- Hook ---
export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}
