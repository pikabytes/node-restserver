const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
  description: { type: String, unique: true, required: [true, ' description is requiered...!! ']},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Category', categorySchema);
