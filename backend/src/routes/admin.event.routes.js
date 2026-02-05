const router = require("express").Router();
const {
  createEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/adminEvent.controller");

// later you add admin auth middleware here
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;