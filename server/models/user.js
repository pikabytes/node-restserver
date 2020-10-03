const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidated  = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} does not valid role...!!'
};


let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required....!!']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'email is required...!!']
  },
  password: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidated
  },
  status: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

// edit response from schema 
// remove password field
userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.plugin( uniqueValidator, {
  message: '{PATH} must be unique..>!!'
} );

module.exports = mongoose.model('user', userSchema);



