var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var counterSchema = new Schema({
  count: {
    type: Number
  }
});

module.exports = mongoose.model('Counter', counterSchema);
