const Appointment = require("../models/Appointment");
const Schedule = require("../models/Schedule");

// CREATE
exports.createAppointment = async (req, res) => {
  try {
    const { doctor, scheduleId, date } = req.body;

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    if (schedule.doctor.toString() !== doctor) {
      return res.status(400).json({ message: "Invalid doctor" });
    }

    // Prevent the SAME patient from booking the same exact schedule slot twice
    const existingAppointment = await Appointment.findOne({
      patient: req.user.id,
      schedule: scheduleId,
      status: { $ne: "cancelled" }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked by you." });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      schedule: scheduleId,
      date,
      consultationFee: schedule.consultationFee
    });

    res.status(201).json(appointment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 ADD THIS
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("doctor", "name email")
      .populate("schedule");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 ADD THIS
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      doctor: req.user.id,
      status: "confirmed" // Only show confirmed to doctors
    })
      .populate("patient", "name email")
      .populate("schedule");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// To fetch all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Appointment Status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) return res.status(404).json({ message: "Not found" });

    appointment.status = status;
    await appointment.save();

    if (status === "confirmed") {
      const Billing = require("../models/Billing");
      const existingBilling = await Billing.findOne({ appointment: appointment._id });
      if (!existingBilling) {
        await Billing.create({
          patient: appointment.patient,
          appointment: appointment._id,
          consultationFee: appointment.consultationFee || 0,
          medicationTotal: 0,
          totalAmount: appointment.consultationFee || 0,
          status: "unpaid"
        });
      }
    }

    if (status === "cancelled") {
      const Billing = require("../models/Billing");
      await Billing.findOneAndUpdate(
        { appointment: appointment._id },
        { status: "cancelled" }
      );
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CANCEL REQUEST (Patient)
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Request to cancel
    appointment.status = "cancel_requested";
    await appointment.save();

    res.json({ message: "Cancellation request sent to admin", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
