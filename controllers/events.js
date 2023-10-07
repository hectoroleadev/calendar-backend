const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async (request, res = response) => {
  const { uid } = request.body;

  let events = await Event.find({ user: uid }).populate('user', 'name');

  res.status(200).json([events]);
};

const createEvent = async (request, res = response) => {
  const { title, notes, start, end, uid } = request.body;

  const event = new Event({ title, notes, start, end });
  event.user = uid;

  try {
    const eventCreated = await event.save();

    res.status(201).json({ event: eventCreated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Please, contact to your admin' });
  }
};

const updateEvent = async (request, res = response) => {
  const eventId = request.params.id;
  const { uid } = request.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event is not valid' });
    }

    if (uid !== event.user.toString()) {
      return res.status(401).json({ message: 'User cannot edit this event' });
    }

    const newEvent = { ...request.body, user: uid };

    const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.status(200).json(eventUpdated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Please, contact to your admin' });
  }
};

const deleteEvent = async (request, res = response) => {
  const eventId = request.params.id;
  const { uid } = request.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event is not found' });
    }

    if (uid !== event.user.toString()) {
      return res.status(401).json({ message: 'User cannot delete this event' });
    }

    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Please, contact to your admin' });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
