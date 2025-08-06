import React from "react";

interface Material {
  description: string;
  quantity: number;
  unit: string;
  remarks?: string;
}

interface EmailTemplateProps {
  mrfNumber: string;
  engineerName: string;
  projectName: string;
  siteLocation: string;
  department: string;
  requestDate: string;
  materials: Material[];
}

export function EmailTemplate({
  mrfNumber,
  engineerName,
  projectName,
  siteLocation,
  department,
  requestDate,
  materials,
}: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.5", color: "#333" }}>
      <h2>Material Request Approval Notification</h2>
      <p>
        Dear Supplier,
      </p>
      <p>
        We have a matrial request that has been approved and is ready for processing. Please find the details below:
      </p>
      <ul>
        <li><strong>MRF Number:</strong> {mrfNumber}</li>
        <li><strong>Engineer:</strong> {engineerName}</li>
        <li><strong>Project:</strong> {projectName}</li>
        <li><strong>Site Location:</strong> {siteLocation}</li>
        <li><strong>Department:</strong> {department}</li>
        <li><strong>Request Date:</strong> {requestDate}</li>
      </ul>

      <h3>Materials Requested:</h3>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          maxWidth: "600px",
          marginBottom: "1rem",
        }}
        border={1}
        cellPadding={8}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((mat, idx) => (
            <tr key={idx}>
              <td>{mat.description}</td>
              <td>{mat.quantity}</td>
              <td>{mat.unit}</td>
              <td>{mat.remarks || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        Please prepare and supply the materials as soon as possible.
      </p>

      <p>Best regards,<br />Newell MEP Team</p>
    </div>
  );
}
