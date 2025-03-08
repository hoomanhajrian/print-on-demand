import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (id) {
      // GET a single order by ID
      const order = await prisma.order.findUnique({
        where: {
          id: id,
        },
      });
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json(order, { status: 200 });
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
    const { request_id, printer_id, status, price, payment_status } = await req.json();

    const newOrder = await prisma.order.create({
      data: {
        request_id,
        printer_id,
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

    const { request_id, printer_id, status, price, payment_status } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        request_id,
        printer_id,
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