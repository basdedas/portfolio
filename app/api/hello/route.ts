export const dynamic = 'force-dynamic'; // CRITICAL for Next.js 15 on Vercel

import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET() {
  try {
    // 1. Connect to the client
    const client = await clientPromise;
    
    // 2. Select the database (Double check this name matches Compass!)
    const db = client.db("portfolio"); 
    
    // 3. Fetch the projects
    const projects = await db.collection("projects").find({}).toArray();
    
    return NextResponse.json(projects);
  } catch (e: any) {
    console.error("DATABASE_ERROR:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}