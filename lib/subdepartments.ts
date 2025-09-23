// lib/subdepartments.ts

export const SUBDEPARTMENTS = [
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
] as const

export const DEPARTMENTS = [
  "Electrical",
  "Plumbing",
  "HVAC",
  "Fire Fighting",
  "Hardware",
] as const

// ✅ Get all subdepartments belonging to a department
export function getSubdepartmentsByDepartment(department: string): string[] {
  if (!department) return []
  return SUBDEPARTMENTS.filter((sub) =>
    sub.startsWith(department + " - ")
  )
}

// ✅ Extract department name from a subdepartment string
export function getDepartmentFromSubdepartment(subdepartment: string): string {
  if (!subdepartment || typeof subdepartment !== "string") return ""
  return subdepartment.split(" - ")[0]
}

// ✅ Safely check if supplier covers any requested subdepartments
export function hasMatchingSubdepartments(
  supplierSubdepts: string[] | undefined | null,
  requestedSubdepts: string[] | undefined | null
): boolean {
  const safeSupplier = Array.isArray(supplierSubdepts)
    ? supplierSubdepts
    : []
  const safeRequested = Array.isArray(requestedSubdepts)
    ? requestedSubdepts
    : []
  return safeSupplier.some((supplierSub) =>
    safeRequested.includes(supplierSub)
  )
}
