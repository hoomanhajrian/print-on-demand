import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as formidable from "formidable";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      // GET a single user by ID
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    } else {
      // GET all users
      const users = await prisma.user.findMany();
      return NextResponse.json(users, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      email,
      firstName: first_name,
      lastName: last_name,
      password: password_hash,
    } = await req.json();

    const newUser = await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        password_hash,
      },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  console.log("PUT request received");

  const form = new formidable.IncomingForm();

  try {
    // Parse the form data using formidable
    const { Readable } = require("stream");

    const formData = await new Promise((resolve, reject) => {
      const readableStream = Readable.from(req.body as any);
      form.parse(readableStream, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const { fields, files } = formData as {
      fields: Record<string, any>;
      files: Record<string, formidable.File>;
    };

    const { id, email, password } = fields;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required for update" },
        { status: 400 }
      );
    }

    let profileImage = fields.profileImage;

    // Check if a new image was uploaded
    if (files.profileImage) {
      const file = Array.isArray(files.profileImage)
        ? files.profileImage[0]
        : files.profileImage;

      // Read the file and convert it to a Base64 string
      const fs = require("fs");
      const imageBuffer = fs.readFileSync(file.filepath);
      profileImage = imageBuffer.toString("base64");
    }

    // Hash the password if provided
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: email || undefined,
        password_hash: hashedPassword,
        image: profileImage || undefined, // Store the Base64 string in the database
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error processing PUT request:", error);
    return NextResponse.json(
      { error: "Failed to process PUT request" },
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
        { error: "User ID is required for deletion" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
