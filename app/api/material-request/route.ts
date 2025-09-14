// app/api/material-request/route.ts
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const endpoint = `https://ap-south-1.cdn.hygraph.com/content/${process.env.MASTER_URL_KEY}/master`;

// --- GET: Fetch all material requests ---
export async function GET() {
  const query = `
    query MyQuery {
      materialRequests {
        department
        engineerName
        materials
        mrfNumber
        mrf_id
        mrf_status
        projectName
        requestDate
        siteLocation
      }
    }
  `;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MATERIAL_REQUEST_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });

    const text = await res.text(); // read raw text for debugging
    const data = JSON.parse(text);

    if (!res.ok || !data.data || !data.data.materialRequests) {
      console.error("GraphQL error:", text);
      return NextResponse.json({ error: "Failed to fetch material requests" }, { status: 500 });
    }

    return NextResponse.json(data.data.materialRequests);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- POST: Create a new material request ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const mrf_id = uuidv4();
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const serial = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const mrfNumber = `MRF-${year}${month}-${serial}`;

    const mutation = `
      mutation CreateMaterialRequest {
        createMaterialRequest(
          data: {
            mrf_id: "${mrf_id}"
            mrfNumber: "${mrfNumber}"
            department: "${body.department}"
            engineerName: "${body.engineerName}"
            projectName: "${body.projectName}"
            requestDate: "${body.requestDate}"
            siteLocation: "${body.siteLocation}"
            mrf_status: "Pending"
            materials: ${JSON.stringify(body.materials).replace(/"([^"]+)":/g, "$1:")}
          }
        ) {
          mrf_id
          mrfNumber
        }
        publishMaterialRequest(where: { mrf_id: "${mrf_id}" }, to: PUBLISHED) {
          mrfNumber
        }
      }
    `;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MATERIAL_REQUEST_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ query: mutation }),
    });

    const text = await res.text();
    const data = JSON.parse(text);

    if (!res.ok || !data.data) {
      console.error("GraphQL POST error:", text);
      return NextResponse.json({ error: "Failed to create material request" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      materialRequest: {
        ...body,
        mrf_id,
        mrfNumber,
        status: "Pending",
      },
    });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- DELETE: Delete material request by mrfNumber ---
export async function DELETE(req: Request) {
  try {
    const { mrfNumber } = await req.json();

    if (!mrfNumber) {
      return NextResponse.json({ error: "Missing mrfNumber" }, { status: 400 });
    }

    const mutation = `
      mutation DeleteMaterialRequest {
        deleteMaterialRequest(where: { mrfNumber: "${mrfNumber}" }) {
          mrfNumber
        }
      }
    `;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MATERIAL_REQUEST_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ query: mutation }),
    });

    const text = await res.text();
    const data = JSON.parse(text);

    if (!res.ok || !data.data || !data.data.deleteMaterialRequest) {
      console.error("GraphQL DELETE error:", text);
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: data.data.deleteMaterialRequest });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- PATCH: Update material request status ---
export async function PATCH(req: Request) {
  try {
    const { mrfNumber, status } = await req.json();

    if (!mrfNumber || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const mutation = `
      mutation UpdateMaterialRequest {
        updateMaterialRequest(
          where: { mrfNumber: "${mrfNumber}" }
          data: { mrf_status: "${status}" }
        ) {
          mrfNumber
          mrf_status
        }
        publishMaterialRequest(where: { mrfNumber: "${mrfNumber}" }, to: PUBLISHED) {
          mrfNumber
          mrf_status
        }
      }
    `;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MATERIAL_REQUEST_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ query: mutation }),
    });

    const text = await res.text();
    const data = JSON.parse(text);

    if (!res.ok || !data.data || !data.data.publishMaterialRequest) {
      console.error("GraphQL PATCH error:", text);
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: data.data.publishMaterialRequest });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
