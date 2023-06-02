const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },

  newPassword: {
    type: String,
   
  },
  confirmPassword: {
    type: String,
  
  },

  resetToken: String,
  resetTokenExpiration: Date,
  resetOtp: Number, // Add the resetOtp field
  resetOtpExpiration: Date // Add the resetOtpExpiration field
});

module.exports = mongoose.model('Student', studentSchema);



