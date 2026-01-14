import Event from "../models/Event.js";

/* =========================
   CREATE EVENT (ADMIN)
========================= */
export const createEvent = async (req, res) => {
  const {
    title,
    location,
    eventTime,
    image,
    description,
    tickets,
  } = req.body;

  if (!title || !location || !eventTime || !image || !description || !tickets) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const event = await Event.create({
    title,
    location,
    eventTime,
    image,
    description,
    tickets,
    createdBy: req.user.id,
  });

  res.status(201).json({
    message: "Event created successfully",
    event,
  });
};

/* =========================
   GET ALL EVENTS (USER)
========================= */
export const getEvents = async (req, res) => {
  const events = await Event.find({ published: true }).sort("-createdAt");
  res.json(events);
};

/* =========================
   GET SINGLE EVENT
========================= */
export const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
};
