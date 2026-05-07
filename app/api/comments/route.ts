import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; 
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    const { projectId, text } = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    const newComment = {
      projectId,
      text,
      user: session.user?.name,
      image: session.user?.image,
      email: session.user?.email, // <--- ADDED THIS (Critical for Delete)
      createdAt: new Date(),
    };

    const result = await db.collection("comments").insertOne(newComment);
    
    // Return the new comment including the ID MongoDB generated
    return NextResponse.json({ ...newComment, _id: result.insertedId });
  } catch (e) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const client = await clientPromise;
  const db = client.db("portfolio");
  const comments = await db.collection("comments")
    .find({ projectId })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(comments);
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { commentId } = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    // This query ensures the comment ID exists AND the person deleting it owns it
    const result = await db.collection("comments").deleteOne({
      _id: new ObjectId(commentId),
      email: session.user?.email, 
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Deleted" });
    } else {
      return NextResponse.json({ error: "Unauthorized or not found" }, { status: 403 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}