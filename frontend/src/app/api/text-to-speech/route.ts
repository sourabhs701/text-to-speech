import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { text } = await request.json();
  const response = await fetch("https://tts.srb.codes/text-to-speech", {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.API_TOKEN}`,
    },
  });
  const data = await response.json();
  return NextResponse.json(data);
}