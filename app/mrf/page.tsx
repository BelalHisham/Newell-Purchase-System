import { MaterialRequestManagement } from "@/components/MaterialRequestManagement";

export default function MrfPage() {
  return (
    <div className="space-y-6 w-full mt-20 ">
      <h1 className="text-2xl font-bold tracking-widest text-center uppercase  ">Material request form </h1>
      <div>
        <MaterialRequestManagement />
      </div>
    </div>
  )
}
