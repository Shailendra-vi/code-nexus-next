const DB_SERVICE = process.env.DB_SERVICE || "http://localhost:3002";


export async function POST(req: Request) {
    try {
        const headers = await req.headers;

        const response = await fetch(`${DB_SERVICE}/auth/refresh`, {
          method: "POST",
          headers: headers
        });
    
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
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
