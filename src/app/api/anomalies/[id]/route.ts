import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAnomaliesCollection } from "@/lib/mongodb";
import { anomalySchema } from "@/lib/validations";
import { ObjectId } from "mongodb";

export async function GET(request: any, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = context.params?.id || (await context.params)?.id;

    const col = await getAnomaliesCollection();
    const doc = await col.findOne({ _id: new ObjectId(id) });

    if (!doc)
      return NextResponse.json({ error: "Anomaly not found" }, { status: 404 });

    return NextResponse.json({ ...doc, _id: doc._id.toString() });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch anomaly" },
      { status: 500 },
    );
  }
}

export async function PUT(request: any, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = context.params?.id || (await context.params)?.id;
    const body = await request.json();
    const parsed = anomalySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const col = await getAnomaliesCollection();
    const result = await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...parsed.data, updatedAt: new Date().toISOString() } },
    );

    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Anomaly not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update anomaly" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: any, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = context.params?.id || (await context.params)?.id;

    const col = await getAnomaliesCollection();
    const result = await col.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Anomaly not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete artifact" },
      { status: 500 },
    );
  }
}
