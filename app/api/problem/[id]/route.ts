const DB_SERVICE = process.env.DB_SERVICE || "http://localhost:3002";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const contest_id = (await params).id;
    const response = await fetch(`${DB_SERVICE}/problem/${contest_id}`, {
      method: "GET",
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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const contest_id = (await params).id;
    const body = await req.json();
    const response = await fetch(`${DB_SERVICE}/problem/${contest_id}`, {
      method: "POST",
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const problem_id = (await params).id;

    const response = await fetch(`${DB_SERVICE}/problem/${problem_id}`, {
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const problem_id = (await params).id;
    const body = await req.json();
    const response = await fetch(`${DB_SERVICE}/problem/${problem_id}`, {
      method: "PUT",
      headers: req.headers,
      body: JSON.stringify(body)
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