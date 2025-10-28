import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const { text } = await request.json();

  const model = searchParams.get('model') || 'melotts';
  const speaker = searchParams.get('speaker') || 'angus';
  const lang = searchParams.get('lang') || 'en';
  console.log('url', `https://tts.srb.codes/text-to-speech?model=${model}&speaker=${speaker}&lang=${lang}`);

  const response = await fetch(
    `https://tts.srb.codes/text-to-speech?model=${model}&speaker=${speaker}&lang=${lang}`,
    {
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