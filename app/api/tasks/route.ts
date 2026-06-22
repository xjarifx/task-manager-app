import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const allTasks = await prisma.tasks.findMany();
    return NextResponse.json(allTasks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, status } = await req.json();
    const addTask = await prisma.tasks.create({
      data: {
        title,
        description,
        status,
      },
    });

    return NextResponse.json(addTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title, description, status } = await req.json();
    const task = await prisma.tasks.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        status,
      },
    });
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.tasks.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 },
    );
  }
}
