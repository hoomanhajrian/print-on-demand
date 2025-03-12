import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user_id');

    if (userId) {
      // GET all orders for a specific user
      const orders = await prisma.order.findMany({
        where: {
          client_id: userId,
        },
      });
      return NextResponse.json(orders, { status: 200 });
    } else {
      // GET all orders
      const orders = await prisma.order.findMany();
      return NextResponse.json(orders, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { client_id, status, price, payment_status } = await req.json();

    const newOrder = await prisma.order.create({
      data: {
        client_id,
        status,
        price,
        payment_status,
      },
    });
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required for update' }, { status: 400 });
    }

    const { client_id, status, price, payment_status } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        client_id,
        status,
        price,
        payment_status,
      },
    });
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required for deletion' }, { status: 400 });
    }

    await prisma.order.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}