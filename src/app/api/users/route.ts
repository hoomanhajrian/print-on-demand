import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import formidable from "formidable";
import fs from "fs";
import path from "path";

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
  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), "public", "uploads"),
    filename: (name, ext, part, form) => {
      return `${Date.now()}-${part.originalFilename}`;
    },
  });

  return new Promise(async (resolve, reject) => {
    try {
      const chunks = [];
      for await (const chunk of req.body as any) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      const incomingMessage = {
        ...req,
        headers: Object.fromEntries(req.headers.entries()),
        body: buffer,
        on: (event: string, callback: (chunk: any) => void) => {
          if (event === "data") {
            callback(buffer);
          } else if (event === "end") {
            callback(null);
          }
        },
      } as any;

      form.parse(incomingMessage, async (err, fields, files) => {
        if (err) {
          console.error("Error parsing form:", err);
          resolve(
            NextResponse.json(
              { error: "Failed to parse form" },
              { status: 500 }
            )
          );
          return;
        }

        const { id, email, password, role } = fields;
        let profileImage = fields.profileImage as string[];

        if (!id) {
          resolve(
            NextResponse.json(
              { error: "User ID is required for update" },
              { status: 400 }
            )
          );
          return;
        }

        // Check if a new image was uploaded
        if (files.profileImage) {
          let file: formidable.File;
          if (Array.isArray(files.profileImage)) {
            file = files.profileImage[0];
          } else {
            file = files.profileImage as formidable.File;
          }
          profileImage = [`/uploads/${file.newFilename}`];
        } else {
          // if no new image, we need to get the existing image url from the database.
          const existingUser = await prisma.user.findUnique({
            where: { id: Array.isArray(id) ? id[0] : id },
          });
          if (existingUser) {
            profileImage = existingUser?.image ? [existingUser.image] : [];
          }
        }

        try {
          const hashedPassword = password
            ? await bcrypt.hash(
                Array.isArray(password) ? password[0] : password,
                10
              )
            : undefined;

          const updatedUser = await prisma.user.update({
            where: { id: Array.isArray(id) ? id[0] : id },
            data: {
              email: Array.isArray(email) ? email[0] : email || "",
              password_hash: hashedPassword,
              image: profileImage[0],
            },
          });
          resolve(NextResponse.json(updatedUser, { status: 200 }));
        } catch (error) {
          console.error("Error updating user:", error);
          resolve(
            NextResponse.json(
              { error: "Failed to update user" },
              { status: 500 }
            )
          );
        }
      });
    } catch (error) {
      console.error("Error processing request:", error);
      resolve(
        NextResponse.json(
          { error: "Failed to process request" },
          { status: 500 }
        )
      );
    }
  });
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
