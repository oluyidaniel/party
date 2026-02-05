const router = require("express").Router();
const {
  getAllEvents,
  getEventById
} = require("../controllers/userEvent.controller");

router.get("/", getAllEvents);
router.get("/:id", getEventById);

module.exports = router;