import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  ticketType: {
    type: String,
    required: true, // VIP, VVIP, Regular
  },
  price: {
    type: Number,
    required: true,
  },
  benefits: {
    type: String,
    required: true,
  },
});

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    eventTime: {
      type: Date,
      required: true,
    },
    image: {
      type: String, // Cloudinary URL
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tickets: [TicketSchema],
    published: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", EventSchema);
