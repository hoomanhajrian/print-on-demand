import { PrismaClient, Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bycrypt from "bcryptjs";

// Add mock categories related to 3D printing
const categories = [
  { name: "Prototyping" },
  { name: "Custom Parts" },
  { name: "Art & Design" },
  { name: "Jewelry" },
  { name: "Miniatures" },
  { name: "Home Decor" },
  { name: "Engineering" },
  { name: "Medical Models" },
  { name: "Education" },
  { name: "Automotive" },
];

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create users
    const users = [];

    const adminUser = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        id: uuidv4(),
        role: Role.ADMIN,
        email: "admin@example.com",
        first_name: "Admin",
        last_name: "User",
        password_hash: bycrypt.hashSync("123456", 10), // Hash the password
      },
    });
    users.push(adminUser);

    const editorUser = await prisma.user.upsert({
      where: { email: "editor@example.com" },
      update: {},
      create: {
        id: uuidv4(),
        role: Role.EDITOR,
        email: "editor@example.com",
        first_name: "Editor",
        last_name: "User",
        password_hash: bycrypt.hashSync("123456", 10), // Hash the password
      },
    });

    users.push(editorUser);
    for (let i = 1; i <= 10; i++) {
      const user = await prisma.user.upsert({
        where: { email: `user${i}@example.com` },
        update: {},
        create: {
          id: uuidv4(),
          role: Role.USER,
          email: `user${i}@example.com`,
          first_name: `User`,
          last_name: `${i}`,
          phone: `123456789${i}`,
        },
      });
      users.push(user);
    }

    // Create printers
    const printers = [];
    for (let i = 1; i <= 10; i++) {
      const printer = await prisma.printer.create({
        data: {
          id: uuidv4(),
          brand: `Brand ${i}`,
          model: `Model ${i}`,
          max_dimentions: {
            length: 200 + i * 10,
            width: 200 + i * 10,
            height: 200 + i * 10,
          },
          user_id: users[i % users.length].id, // Assign printers to users in a round-robin fashion
        },
      });
      printers.push(printer);
    }

    // Create categories
    const createdCategories = [];
    for (const category of categories) {
      const createdCategory = await prisma.category.create({
        data: {
          id: uuidv4(),
          name: category.name,
        },
      });
      createdCategories.push(createdCategory);
    }

    // Create gigs
    const gigs = [];
    for (let i = 1; i <= 10; i++) {
      const gig = await prisma.gig.create({
        data: {
          id: uuidv4(),
          title: `Sample Gig ${i}`,
          description: `This is a description for Sample Gig ${i}.`,
          duration: Math.floor(Math.random() * 5) + 1, // Random duration between 1 and 5
          price: Math.floor(Math.random() * 50) + 10, // Random price between $10 and $60
          imageUrl: `https://example.com/sample-gig-${i}.jpg`,
          tags: i % 2 === 0 ? ["custom", "design"] : ["home", "decor"],
          user_id: users[i % users.length].id, // Assign gigs to users in a round-robin fashion
          printers: [printers[i % printers.length].id], // Assign printers to gigs in a round-robin fashion
          categories: {
            connect: [
              { id: createdCategories[i % createdCategories.length].id }, // Assign categories in a round-robin fashion
              { id: createdCategories[(i + 1) % createdCategories.length].id }, // Assign a second category
            ],
          },
        },
      });
      gigs.push(gig);
    }

    // Create orders
    const orders = [];
    for (let i = 1; i <= 10; i++) {
      const order = await prisma.order.create({
        data: {
          id: uuidv4(),
          client_id: users[i % users.length].id, // Assign orders to users in a round-robin fashion
          printer_id: printers[i % printers.length].id, // Assign printers to orders in a round-robin fashion
          status: i % 2 === 0 ? "pending" : "accepted",
          price: Math.floor(Math.random() * 100) + 20, // Random price between $20 and $120
          senderAddress: `${i} Main St`,
          receiverAddress: `${i} Elm St`,
          gigData: {
            title: `Sample Gig ${i}`,
            description: `This is a description for Sample Gig ${i}.`,
            duration: Math.floor(Math.random() * 5) + 1,
            price: Math.floor(Math.random() * 50) + 10,
            category: i % 2 === 0 ? "Apparel" : "Home Goods",
            tags: i % 2 === 0 ? ["custom", "design"] : ["home", "decor"],
          },
          payment_status: i % 2 === 0 ? "pending" : "paid",
        },
      });
      orders.push(order);
    }

    // Create gig reviews
    for (let i = 1; i <= 10; i++) {
      await prisma.gigReview.create({
        data: {
          id: uuidv4(),
          gig_id: gigs[i % gigs.length].id, // Assign reviews to gigs in a round-robin fashion
          from_id: users[(i + 1) % users.length].id, // Reviewer
          to_id: users[i % users.length].id, // Gig owner
          rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
          comment: `This is a review for Sample Gig ${i}.`,
          created_at: new Date(),
        },
      });
    }

    // Create user reviews
    for (let i = 1; i <= 10; i++) {
      await prisma.userReview.create({
        data: {
          id: uuidv4(),
          user_id: users[i % users.length].id, // User being reviewed
          from_id: users[(i + 1) % users.length].id, // Reviewer
          to_id: users[i % users.length].id, // User being reviewed
          order_id: i % 2 === 0 ? orders[i % orders.length].id : null, // Tie to an order or leave null
          rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
          comment: `This is a review for User ${i}.`,
          created_at: new Date(),
        },
      });
    }

    console.log("Seed data created successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
