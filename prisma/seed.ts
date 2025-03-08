// filepath: c:\Users\hooma\Desktop\projects\print-on-demand\prisma\seed.ts
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

    const client1User = await prisma.user.upsert({
      where: { email: 'client1@example.com' },
      update: {},
      create: {
        id: uuidv4(),
        role: Role.CLIENT,
        email: 'client1@example.com',
        first_name: 'Client',
        last_name: 'One',
      },
    });

    const client2User = await prisma.user.upsert({
      where: { email: 'client2@example.com' },
      update: {},
      create: {
        id: uuidv4(),
        role: Role.CLIENT,
        email: 'client2@example.com',
        first_name: 'Client',
        last_name: 'Two',
      },
    });

    const printer1User = await prisma.user.upsert({
      where: { email: 'printer1@example.com' },
      update: {},
      create: {
        id: uuidv4(),
        role: Role.PRINTER,
        email: 'printer1@example.com',
        first_name: 'Printer',
        last_name: 'One',
      },
    });

    const printer2User = await prisma.user.upsert({
      where: { email: 'printer2@example.com' },
      update: {},
      create: {
        id: uuidv4(),
        role: Role.PRINTER,
        email: 'printer2@example.com',
        first_name: 'Printer',
        last_name: 'Two',
      },
    });

    // Create printer profiles
    const printerProfiles = await prisma.printerProfile.createMany({
      data: [
        {
          user_id: printer1User.id,
          bio: 'Experienced 3D printing service.',
          location: 'New York',
          technologies: ['FDM', 'SLA'],
          materials: ['PLA', 'ABS', 'Resin'],
          hourly_rate: 25.00,
        },
        {
          user_id: printer2User.id,
          bio: 'High-quality prints, fast turnaround.',
          location: 'Los Angeles',
          technologies: ['FDM'],
          materials: ['PLA+'],
          hourly_rate: 30.00,
        },
      ],
    });

    // Create print requests
    const printRequests = await prisma.printRequest.createMany({
      data: [
        {
          client_id: client1User.id,
          model_url: 'https://example.com/model1.stl',
          material: 'PLA',
          quantity: 1,
          size: '10x10x10 cm',
          details: 'Need a high-resolution print.',
        },
        {
          client_id: client2User.id,
          model_url: 'https://example.com/model2.obj',
          material: 'ABS',
          quantity: 3,
          size: '5x5x5 cm',
        },
      ],
    });

    // Create orders
    const printRequestsData = await prisma.printRequest.findMany();

    const orders = await prisma.order.createMany({
      data: printRequestsData.map((request, index) => ({
        request_id: request.id,
        printer_id: index % 2 === 0 ? printer1User.id : printer2User.id,
        status: 'pending',
        price: 30.00,
        payment_status: 'pending',
      })),
    });

    // Create products
    const products = await prisma.product.createMany({
      data: [
        {
          name: 'Custom T-Shirt',
          description: 'Design your own T-shirt with your favorite image or text.',
          price: 25.00,
          imageUrl: 'https://example.com/tshirt.jpg',
          category: 'Apparel',
          tags: ['t-shirt', 'custom', 'design'],
          availableMaterials: ['Cotton', 'Polyester'],
          availableSizes: ['S', 'M', 'L', 'XL'],
        },
        {
          name: 'Ceramic Mug',
          description: 'Personalize your coffee mug with a unique design.',
          price: 15.00,
          imageUrl: 'https://example.com/mug.jpg',
          category: 'Home Goods',
          tags: ['mug', 'custom', 'coffee'],
          availableMaterials: ['Ceramic'],
          availableSizes: [],
        },
        {
          name: '3D Printed Phone Case',
          description: 'Protect your phone with a custom 3D printed case.',
          price: 35.00,
          imageUrl: 'https://example.com/phonecase.jpg',
          category: 'Electronics',
          tags: ['phone case', '3d printed', 'custom'],
          availableMaterials: ['PLA', 'ABS'],
          availableSizes: [],
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