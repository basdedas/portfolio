import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb"; // <--- Add this!

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await request.json();
    const userEmail = session.user.email;

    const client = await clientPromise;
    const db = client.db("portfolio");

    // Fix: Use _id and wrap projectId in new ObjectId()
    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(projectId) }, 
      { 
        $addToSet: { likedBy: userEmail } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Already liked!" }, { status: 200 });
    }

    // Fix: Use _id here too
    await db.collection("projects").updateOne(
      { _id: new ObjectId(projectId) },
      { $inc: { likes: 1 } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Like Error:", error);
    return NextResponse.json({ error: "Failed to like" }, { status: 500 });
  }
}