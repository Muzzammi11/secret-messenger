import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.IPINFO_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Token not set' }, { status: 500 });
  }
  try {
    const res = await fetch(`https://ipinfo.io/json?token=${token}`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch IP info' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 