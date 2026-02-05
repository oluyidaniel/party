const Event = require("../models/Event");

/**
 * GET ALL EVENTS (User Website)
 */
exports.getAllEvents = async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
};

/**
 * GET SINGLE EVENT DETAILS
 */
exports.getEventById = async (req, res) => {
  const event = await Event.findOne({ eventId: req.params.id });
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  res.json(event);
};