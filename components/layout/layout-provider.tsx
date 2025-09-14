"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// --- Types ---
export type MaterialRequest = {
  mrf_id: string;
  requestDate: string;
  mrfNumber: string;
  engineerName: string;
  projectName: string;
  siteLocation: string;
  department: string;
  mrf_status?: "Pending" | "Approved" | "Rejected";
  materials: {
    description: string;
    quantity: string;
    unit: string;
    remarks: string;
  }[];
};

export type Supplier = {
  id: string;
  name: string;
  email: string;
  department: string;
  location: string;
  phoneNumber: string;
};

// --- Context Type ---
type LayoutContextType = {
  materialRequests: MaterialRequest[];
  suppliers: Supplier[];
  addMaterialRequest: (request: Omit<MaterialRequest, "mrf_id" | "mrfNumber">) => void;
  updateMaterialRequest: (request: MaterialRequest) => void;
  deleteMaterialRequest: (mrfNumber: string) => void;
  addSupplier: (supplier: Omit<Supplier, "id">) => void;
  deleteSupplier: (id: string) => void;
  exportMaterialRequestsToCSV: () => void;
};

// --- Create Context ---
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// --- Provider Component ---
export function LayoutProvider({ children }: { children: ReactNode }) {
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // --- Load Material Requests ---
  useEffect(() => {
    const fetchMaterialRequests = async () => {
      try {
        const res = await fetch("/api/material-request");
        if (!res.ok) throw new Error("Failed to fetch material requests");
        const data = await res.json();
        setMaterialRequests(data);
      } catch (error) {
        console.error("Error loading material requests:", error);
      }
    };
    fetchMaterialRequests();
  }, []);

  // --- Material Request Methods ---
  const addMaterialRequest = async (request: Omit<MaterialRequest, "mrf_id" | "mrfNumber">) => {
    try {
      const res = await fetch("/api/material-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!res.ok) throw new Error("Failed to add material request");
      const data = await res.json();
      setMaterialRequests((prev) => [...prev, data.materialRequest]);
    } catch (error) {
      console.error("Error adding material request:", error);
    }
  };

  const deleteMaterialRequest = async (mrfNumber: string) => {
    try {
      const res = await fetch("/api/material-request", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mrfNumber }),
      });
      if (!res.ok) throw new Error("Failed to delete material request");
      setMaterialRequests((prev) => prev.filter((r) => r.mrfNumber !== mrfNumber));
    } catch (error) {
      console.error("Error deleting material request:", error);
    }
  };

  const updateMaterialRequest = async (request: MaterialRequest) => {
    try {
      const res = await fetch("/api/material-request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mrfNumber: request.mrfNumber, status: request.mrf_status }),
      });
      if (!res.ok) throw new Error("Failed to update material request");
      setMaterialRequests((prev) =>
        prev.map((r) => (r.mrfNumber === request.mrfNumber ? request : r))
      );
    } catch (error) {
      console.error("Error updating material request:", error);
    }
  };

  // --- Supplier Methods ---
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("/api/supplier");
        if (!res.ok) throw new Error("Failed to fetch suppliers");
        const data = await res.json();
        setSuppliers(data);
      } catch (error) {
        console.error("Error loading suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  const addSupplier = async (supplier: Omit<Supplier, "id">) => {
    try {
      const res = await fetch("/api/supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplier),
      });
      if (!res.ok) throw new Error("Failed to add supplier");
      const data = await res.json();
      setSuppliers((prev) => [...prev, data.supplier]);
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const res = await fetch("/api/supplier", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete supplier");
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  // --- CSV Export ---
  const exportMaterialRequestsToCSV = () => {
    const headers = [
      "MRF Number",
      "Engineer Name",
      "Project Name",
      "Site Location",
      "Department",
      "Request Date",
      "Status",
    ];
    const rows = materialRequests.map((req) => [
      req.mrfNumber,
      req.engineerName,
      req.projectName,
      req.siteLocation,
      req.department,
      req.requestDate,
      req.mrf_status || "Pending",
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `material_requests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
  );
}

// --- Hook ---
export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within a LayoutProvider");
  return context;
}
