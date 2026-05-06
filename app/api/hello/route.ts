import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    // Test: Can we even list the collections?
    const collections = await db.listCollections().toArray();
    console.log("Collections found:", collections);

    const projects = await db.collection("projects").find({}).toArray();
    return NextResponse.json(projects);
  } catch (e: any) {
    console.error("THE EXACT ERROR:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}