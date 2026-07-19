
import mongoose from 'mongoose'


const User = mongoose.models.User || mongoose.model(
    "User",
    new mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        role: { type: String, default: "user" },
        birthDate:Date 
    }, {collection:"Users"})
);

export default User