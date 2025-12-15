import { NextResponse } from "next/server";

const TARGET = "https://r8a9qdm4xg.execute-api.ap-northeast-1.amazonaws.com/Prod/";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(TARGET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    // Return proxied response as JSON so client can inspect HTTP status and body
    return NextResponse.json({ status: res.status, ok: res.ok, body: parsed });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
