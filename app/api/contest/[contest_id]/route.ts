const DB_SERVICE = process.env.DB_SERVICE || "http://localhost:3002";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  try {
    const contest_id = (await params).contest_id;

    const response = await fetch(`${DB_SERVICE}/contest/${contest_id}`, {
        method: "GET",
        headers: req.headers
    })
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: response.headers,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ message: err.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  try {
    const body = await req.json();
    const contest_id = (await params).contest_id;

    const response = await fetch(`${DB_SERVICE}/contest/${contest_id}`, {
      method: "PUT",
      headers: req.headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: response.headers,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ message: err.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  try {
    const contest_id = (await params).contest_id;

    const response = await fetch(`${DB_SERVICE}/contest/${contest_id}`, {
      method: "DELETE",
      headers: req.headers,
    });
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: response.headers,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ message: err.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
