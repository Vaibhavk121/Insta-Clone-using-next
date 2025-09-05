import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "Username, email and password are required" },
                { status: 400 }
            )
        }
        await connectToDatabase()

        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return NextResponse.json(
                { error: existingUser.email === email ? "Email already exists" : "Username already exists" },
                { status: 400 }
            )
        }

        await User.create({ username, email, password })

        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Failed to register User" },
            { status: 500 }
        )
    }

}

