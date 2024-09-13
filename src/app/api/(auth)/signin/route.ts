import mongoose from "mongoose";
import User from "../../schemas/user";
import { NextResponse, NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
 // Assuming you're using bcrypt for password hashing
import dbConnect from '@/helper/dbConn';
import bcrypt from 'bcrypt';

export const POST = async (req: NextRequest) => {
    try {
        // Parse request body
        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json({
                status: "error",
                message: "Email and password are required"
            }, { status: 400 });
        }

        // Connect to the database
        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({
                status: "error",
                message: "User not found"
            }, { status: 404 });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({
                status: "error",
                message: "Invalid password"
            }, { status: 401 });
        }
   
        // Successful authentication

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET! )

        const response =  NextResponse.json({
            status: "success",
            message: "Login successful"
        });
        response.cookies.set("token", token)
        return response;



    } catch (error: any) {
        console.error("Error processing request:", error);
        return NextResponse.json({
            status: "error",
            message: "Internal server error"
        }, { status: 500 });
    }
};

// Ensure dbConnect is imported if you are using a separate file for database connection
