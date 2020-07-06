const express = require('express');

const { Hotel } = require('../models/hotel.model');

const hotelRouter = express.Router();

hotelRouter.get('/', (req, res) => {
  if (!req.user) return res.send(401).send();
  return Hotel.find({ user: req.user }, { user: 0 }, (err, result) => {
    if (err) return res.status(400).send({ success: false, error: { ...err } });
    return res.status(200).send({ success: true, result });
  });
});

hotelRouter.post('/new', (req, res) => {
  if (!req.user) return res.send(401).send();
  return Hotel.create(
    { name: req.body.name, city: req.body.city, country: req.body.country, image: req.body.image, user: req.user },
    (err, result) => {
      if (err) return res.status(400).send({ success: false, error: { ...err } });
      return res.status(201).send({ success: true, result });
    }
  );
});

hotelRouter.delete('/:id', (req, res) => {
  Hotel.deleteOne({ _id: req.params.id, user: req.user }, (err) => {
    if (err) return res.status(400).send({ success: false, error: { ...err } });
    return res.status(204).send({ success: true });
  });
});

module.exports = {
  hotelRouter,
};
