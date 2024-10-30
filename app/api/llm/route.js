import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
const apiKey = process.env.API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export async function POST(req) {
  try {
    const body = await req.json();

    const { prompt } = body;
    // console.log(prompt);

    if (!prompt) return new NextResponse("MESSAGE REQUIRED", { status: 400 });
    // console.log(freeTrial);
    const result = await model.generateContent(prompt);
    // console.log(result.response.text());

    return NextResponse.json(result.response.text());
  } catch (error) {
    console.log("CONVERSATION PAGE AAPI ", error);
    return new NextResponse("INTERNAL CONVO ERROR", { status: 500 });
  }
}
