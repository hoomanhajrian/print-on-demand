"use server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();
export default async function GigPage() {
  const session = await getServerSession(authOptions);

  try {
    if (!session) {
      redirect("/");
    }
    const gig = await prisma.gig.findMany({
      where: {
        id: "fc6af50d-ace8-4d15-87f1-07681de11582",
      },
    });
    console.log("Fetched gig:", gig); // Log the fetched gig
  } catch (error: any) {
    console.error("Error fetching session:", error);
    return <div>Error: {error.message}</div>;
  }

  return <></>;
}
