const mongoose = require('mongoose');

const { userSchema } = require('./user.model');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  image: { type: String, required: true },
  user: { type: userSchema, required: true },
});

const Hotel = mongoose.model('hotel', hotelSchema);

module.exports = {
  Hotel,
  hotelSchema,
};
