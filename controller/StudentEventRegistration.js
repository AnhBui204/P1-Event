const Registration = require('../models/registrationModel');
const Student = require('../models/user');
const Event = require('../models/event');

exports.Registration = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.session.user.id;

    const event = await Event.findById(eventId);
    const registeredCount = await Registration.countDocuments({ eventId });

    if (registeredCount >= event.maxCapacity) {
      return res.status(400).send('Event is full');
    }

    // Check if already registered
    const exists = await Registration.findOne({ eventId, studentId });
    if (exists) {
      return res.status(400).send('Already registered');
    }

    const newReg = new Registration({ studentId, eventId });
    await newReg.save();

    res.redirect('/students/myRegistrations');
  } catch (err) {
    res.status(500).send(err.message);
  }
};


exports.Unregister = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const studentId = req.session.user.id;

    const reg = await Registration.findById(registrationId);

    if (!reg || reg.studentId.toString() !== studentId) {
      return res.status(403).send('Not allowed');
    }

    await Registration.findByIdAndDelete(registrationId);
    res.redirect('/students/myRegistrations');
  } catch (err) {
    res.status(500).send(err.message);
  }
};


exports.MyRegistrations = async (req, res) => {
  try {
    const studentId = req.session.user.id;

    const registrations = await Registration.find({ studentId })
      .populate('eventId');

    res.render('myRegistrations', { registrations });
  } catch (err) {
    res.status(500).send(err.message);
  }
};


exports.GetAllEvents = async (req, res) => {
  try {
    const studentId = req.session.user.id;

    const events = await Event.find();
    const myRegs = await Registration.find({ studentId });
    const registeredEventIds = myRegs.map(r => r.eventId.toString());
    const regMap = new Map(myRegs.map(r => [r.eventId.toString(), r._id])); 

    const eventData = await Promise.all(events.map(async (event) => {
      const count = await Registration.countDocuments({ eventId: event._id });
      return {
        ...event.toObject(),
        registeredCount: count,
        isRegistered: registeredEventIds.includes(event._id.toString()),
        regId: regMap.get(event._id.toString()) || null
      };
    }));

    res.render('registerEvent', { events: eventData });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

