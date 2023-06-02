const studentModel = require('./studentmodel');
const key = '123456789trytrytry';
const encryptor = require('simple-encryptor')(key);

const createstudentDBservice = (studentDetails) => {
  return new Promise((resolve, reject) => {
    const studentModelData = new studentModel();

    studentModelData.firstname = studentDetails.firstname;
    studentModelData.lastname = studentDetails.lastname;
    studentModelData.email = studentDetails.email;
    const encrypted = encryptor.encrypt(studentDetails.password);
    studentModelData.password = encrypted;

    studentModelData
      .save()
      .then((result) => {
        resolve(true);
      })
      .catch((error) => {
        reject(false);
      });
  });
};

const loginuserDbservice = (studentDetails) => {
  return new Promise((resolve, reject) => {
    studentModel.findOne({ email: studentDetails.email })
      .then((result) => {
        if (result != undefined && result != null) {
          var decrypted = encryptor.decrypt(result.password);
          if (decrypted == studentDetails.password) {
            resolve({ status: true, msg: "Student Validated successfully" });
          } else {
            reject({ status: false, msg: "failed" });
          }
        } else {
          reject({ status: false, msg: "student error details" });
        }
      })
      .catch((error) => {
        reject({ status: false, msg: "invalid Data" });
      });
  });
};

  
module.exports = {
  createstudentDBservice,
  loginuserDbservice
 
};
