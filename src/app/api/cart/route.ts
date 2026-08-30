import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';

const FILE_NAME = 'cart.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const carts = await readData<any>(FILE_NAME);
    
    if (userId) {
      const userCart = carts.find((c: any) => c.userId === userId) || { userId, items: [] };
      return NextResponse.json(userCart);
    }
    return NextResponse.json(carts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch carts' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedCart = await request.json();
    const carts = await readData<any>(FILE_NAME);
    
    const index = carts.findIndex((c: any) => c.userId === updatedCart.userId);
    if (index !== -1) {
      carts[index] = { ...carts[index], ...updatedCart };
    } else {
      carts.push(updatedCart);
    }
    
    await writeData(FILE_NAME, carts);
    return NextResponse.json(updatedCart);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
