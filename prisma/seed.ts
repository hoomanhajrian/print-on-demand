import { PrismaClient, Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create users
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        id: uuidv4(),
        role: Role.ADMIN,
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
        password_hash: '$2b$10$anLmZ2tHw6ua4Lv7b5sO.NmVMS2ROmWg1ZJESSCNNHH1RrnMZLRe',
      },
    });

    const editorUser = await prisma.user.upsert({
      where: { email: 'editor@example.com' },
      update: {},
      create: {
        id: uuidv4(),
        role: Role.EDITOR,
        email: 'editor@example.com',
        first_name: 'Editor',
        last_name: 'User',
      },
    });

    const user1 = await prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        id: uuidv4(),
        role: Role.USER,
        email: 'user1@example.com',
        first_name: 'User',
        last_name: 'One',
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        id: uuidv4(),
        role: Role.USER,
        email: 'user2@example.com',
        first_name: 'User',
        last_name: 'Two',
      },
    });

    // Create printers
    const printer1 = await prisma.printer.create({
      data: {
        id: uuidv4(),
        brand: 'Brand A',
        model: 'Model X',
        max_dimentions: { length: 200, width: 200, height: 200 },
        user_id: user1.id,
      },
    });

    const printer2 = await prisma.printer.create({
      data: {
        id: uuidv4(),
        brand: 'Brand B',
        model: 'Model Y',
        max_dimentions: { length: 300, width: 300, height: 300 },
        user_id: user2.id,
      },
    });

    // Create material charges
    await prisma.materialCharge.createMany({
      data: [
        {
          id: uuidv4(),
          material: 'PLA',
          chargePerHour: 10.0,
          printer_id: printer1.id,
        },
        {
          id: uuidv4(),
          material: 'ABS',
          chargePerHour: 15.0,
          printer_id: printer1.id,
        },
        {
          id: uuidv4(),
          material: 'PLA',
          chargePerHour: 12.0,
          printer_id: printer2.id,
        },
        {
          id: uuidv4(),
          material: 'ABS',
          chargePerHour: 18.0,
          printer_id: printer2.id,
        },
      ],
    });

    // Create gigs
    const gig1 = await prisma.gig.create({
      data: {
        id: uuidv4(),
        title: 'Custom T-Shirt',
        description: 'Design your own T-shirt with your favorite image or text.',
        duration: 2,
        price: 25.0,
        imageUrl: 'https://example.com/tshirt.jpg',
        category: 'Apparel',
        tags: ['t-shirt', 'custom', 'design'],
        user_id: user1.id,
        printers: {
          connect: [{ id: printer1.id }, { id: printer2.id }],
        },
      },
    });

    const gig2 = await prisma.gig.create({
      data: {
        id: uuidv4(),
        title: 'Ceramic Mug',
        description: 'Personalize your coffee mug with a unique design.',
        duration: 1,
        price: 15.0,
        imageUrl: 'https://example.com/mug.jpg',
        category: 'Home Goods',
        tags: ['mug', 'custom', 'coffee'],
        user_id: user2.id,
        printers: {
          connect: [{ id: printer1.id }],
        },
      },
    });

    // Create orders
    const order1 = await prisma.order.create({
      data: {
        id: uuidv4(),
        client_id: user1.id,
        printer_id: printer1.id,
        status: 'pending',
        price: 50.0,
        address: '123 Main St',
        payment_status: 'pending',
      },
    });

    const order2 = await prisma.order.create({
      data: {
        id: uuidv4(),
        client_id: user2.id,
        printer_id: printer2.id,
        status: 'accepted',
        price: 75.0,
        address: '456 Elm St',
        payment_status: 'paid',
      },
    });

    // Create reviews
    await prisma.review.createMany({
      data: [
        {
          id: uuidv4(),
          order_id: order1.id,
          from_id: user1.id,
          to_id: user2.id,
          rating: 5,
          comment: 'Great product!',
        },
        {
          id: uuidv4(),
          order_id: order2.id,
          from_id: user2.id,
          to_id: user1.id,
          rating: 4,
          comment: 'Very satisfied!',
        },
      ],
    });

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();