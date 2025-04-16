import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(req: Request) {
  try {
    // Fetch all gigs
    const gigs = await prisma.gig.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(
      {
        gigs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching gigs:", error);
    return NextResponse.json(
      { error: "Failed to fetch gigs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, price, imageUrl } = await req.json();

    const newgig = await prisma.gig.create({
      data: {
        title,
        description,
        price,
        imageUrl,
        duration: 60, // example value, replace with actual data
        user: { connect: { id: "user-id" } }, // example value, replace with actual data
      },
    });
    return NextResponse.json(newgig, { status: 201 });
  } catch (error) {
    console.error("Error creating gig:", error);
    return NextResponse.json(
      { error: "Failed to create gig" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "gig ID is required for update" },
        { status: 400 }
      );
    }

    const { title, description, price, imageUrl } = await req.json();

    const updatedgig = await prisma.gig.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        price,
        imageUrl,
      },
    });
    return NextResponse.json(updatedgig, { status: 200 });
  } catch (error) {
    console.error("Error updating gig:", error);
    return NextResponse.json(
      { error: "Failed to update gig" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "gig ID is required for deletion" },
        { status: 400 }
      );
    }

    await prisma.gig.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      { message: "gig deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting gig:", error);
    return NextResponse.json(
      { error: "Failed to delete gig" },
      { status: 500 }
    );
  }
}
