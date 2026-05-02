const Schedule = require("../models/Schedule");

// CREATE schedule (Admin)
exports.createSchedule = async (req, res) => {
  try {
    const { doctorId, date, startTime, endTime, consultationFee } = req.body;

    const schedule = await Schedule.create({
      doctor: doctorId,
      date,
      startTime,
      endTime,
      consultationFee
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all schedules (Admin)
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("doctor", "name email specialization");
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE schedule (Admin)
exports.updateSchedule = async (req, res) => {
  try {
    const { date, startTime, endTime, consultationFee } = req.body;
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { date, startTime, endTime, consultationFee },
      { new: true }
    );
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE schedule (Admin)
exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET my schedule (Doctor)
exports.getMySchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find({ doctor: req.user.id }).populate("doctor", "name email specialization");
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET doctor schedule (Patient)
exports.getDoctorSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find({ doctor: req.params.doctorId }).populate("doctor", "name email specialization");
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};