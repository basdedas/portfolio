import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    // Fetch all projects from the 'projects' collection
    const projects = await db.collection("projects").find({}).toArray();
    
    return NextResponse.json(projects);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}