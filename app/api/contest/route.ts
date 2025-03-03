const DB_SERVICE = process.env.DB_SERVICE || "http://localhost:3002";

export async function GET(req: Request) {
  try {
    const response = await fetch(`${DB_SERVICE}/contest`, {
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetch(`${DB_SERVICE}/contest`, {
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
