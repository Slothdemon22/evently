import mongoose, { Document, Schema, Model } from "mongoose";

// Define the User interface extending mongoose's Document
interface User extends Document {
    name: string;
    email: string;
    password: string;
    isVerified?: boolean;
    organizer?: mongoose.Types.ObjectId[]; 
    events?: mongoose.Types.ObjectId[]; // Reference to Event documents
}

// Create the UserSchema using the User interface
const UserSchema: Schema<User> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    organizer: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event", // Self-referencing organizer (User model)
        }
    ],
    events: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event" // Reference to the Event model
        }
    ]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the User model
const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
