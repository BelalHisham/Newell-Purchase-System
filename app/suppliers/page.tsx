import { SupplierManagement } from "@/components/SupplierManagement"

export default function SuppliersPage() {
  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold mb-4">Suppliers</h1>
      <SupplierManagement />
    </div>
  )
}
