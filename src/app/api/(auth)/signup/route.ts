import mongoose from "mongoose";
import User from "../../schemas/user";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt'; // For password hashing

// Connect to the database
import dbConnect from '@/helper/dbConn';

// Signup handler
export const POST = async (req: NextRequest) => {
    try {
        const { email, password, name } = await req.json();

        // Validate input
        if (!email || !password || !name) {
            return NextResponse.json({
                status: "error",
                message: "Email, password, and name are required"
            }, { status: 400 });
        }

        // Connect to the database
        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({
                status: "error",
                message: "User already exists"
            }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isVerified: false // Set initial verification status
        });

        // Save user to the database
        await newUser.save();

        // Successful signup
        return NextResponse.json({
            status: "success",
            message: "Signup successful"
        });

    } catch (error: any) {
        console.error("Error processing request:", error);
        return NextResponse.json({
            status: "error",
            message: "Internal server error"
        }, { status: 500 });
    }
};
