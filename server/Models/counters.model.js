import mongoose from 'mongoose'

// מונה רץ לפי מפתח (למשל מספר הזמנה יומי: "orders-2026-10-20")
const Counter = mongoose.models.Counter || mongoose.model(
    "Counter",
    new mongoose.Schema(
        {
            _id: { type: String, required: true },
            seq: { type: Number, default: 0 }
        }, { collection: "counters" })
);

// מחזיר את המספר הבא בצורה אטומית, כך ששתי הזמנות באותו רגע לא יקבלו אותו מספר
export async function nextSequence(key) {
    const counter = await Counter.findByIdAndUpdate(key, { $inc: { seq: 1 } }, { new: true, upsert: true })
    return counter.seq
}

export default Counter
