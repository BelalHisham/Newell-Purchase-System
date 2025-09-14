// app/api/supplier/route.ts
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const endpoint = `https://ap-south-1.cdn.hygraph.com/content/${process.env.MASTER_URL_KEY}/master`;

// --- GET Suppliers ---
export async function GET() {
  const query = `
    query {
      suppliers {
        id
        name
        email
        department
        location
        phoneNumber
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

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data.data.suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- POST (Add Supplier) ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = uuidv4();

    const mutation = `
      mutation {
        createSupplier(
          data: {
            name: "${body.name}"
            email: "${body.email}"
            department: "${body.department}"
            location: "${body.location || ""}"
            phoneNumber: "${body.phoneNumber || ""}"
          }
        ) {
          id
        }
        publishManySuppliers(to: PUBLISHED) {
          count
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

    if (!res.ok) {
      const errorText = await res.text();
      console.error("GraphQL Error:", errorText);
      return NextResponse.json({ error: "Failed to create supplier" }, { status: res.status });
    }

    const result = await res.json();
    return NextResponse.json({
      success: true,
      supplier: { id, ...body },
    });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- DELETE Supplier ---
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing supplier ID" }, { status: 400 });

    const mutation = `
      mutation {
        deleteSupplier(where: { id: "${id}" }) {
          id
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

    if (!res.ok) {
      const errorText = await res.text();
      console.error("GraphQL Error:", errorText);
      return NextResponse.json({ error: "Failed to delete supplier" }, { status: res.status });
    }

    const result = await res.json();
    return NextResponse.json({ success: true, deleted: result.data.deleteSupplier });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
