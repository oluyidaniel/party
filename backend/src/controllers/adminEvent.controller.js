const Event = require("../models/Event");

/**
 * CREATE EVENT (Admin)
 */
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * UPDATE EVENT (Admin)
 */
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findOneAndUpdate(
    { eventId: id },
    req.body,
    { new: true }
  );
  res.json(event);
};

/**
 * DELETE EVENT (Admin)
 */
exports.deleteEvent = async (req, res) => {
  await Event.findOneAndDelete({ eventId: req.params.id });
  res.json({ message: "Event deleted" });
};