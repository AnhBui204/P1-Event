const Registration = require('../models/registrationModel');
const Student = require('../models/user');
const Event = require('../models/event');

exports.ViewAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('studentId', 'username')  
      .populate('eventId', 'name description location')        
      .sort({ registrationDate: -1 });

    res.render('listRegistrations', { registrations });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.SearchRegistrationsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const registrations = await Registration.find({
      registrationDate: { $gte: start, $lt: end }
    })
    .populate('studentId', 'username fullName')
    .populate('eventId', 'name location');

    res.render('searchRegistrations', { registrations, date });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
