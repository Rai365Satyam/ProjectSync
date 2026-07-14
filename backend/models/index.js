import mongoose from "mongoose";

// USER SCHEMA
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6 }
    },
    { timestamps: true }
);

// PROJECT SCHEMA
const projectSchema = new mongoose.Schema(
    {
        title: { type: String, unique: true },
        description: String,
        // Link project to a specific user
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        // Array containing users explicitly assigned to this workspace
        assignedUsers: [{ type: String }],
        task: [
            {
                id: Number,
                title: String,
                description: String,
                order: Number,
                stage: String, // Holds status indications: e.g. "Requested", "Ongoing", "Completed"
                index: Number,
                attachment: [{ type: String, url: String }],
                created_at: { type: Date, default: Date.now },
                updated_at: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export const Project = mongoose.model("Project", projectSchema);