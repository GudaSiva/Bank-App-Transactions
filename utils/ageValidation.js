/**
 * @fileoverview This file contains age validation function to check if the user is 18 years old or older
 * @param {Date} birthDate 
 * @returns {Boolean}
 */
const ageValidation = (birthDate) => {
  let today = new Date();
  let birthDateDate = new Date(birthDate);
  let age = today.getFullYear() - birthDateDate.getFullYear();
  let month = today.getMonth() - birthDateDate.getMonth();
  let day = today.getDate() - birthDateDate.getDate();

  if (age === 18) {
    if (month < 0) {
      age--;
    } else if (month === 0) {
      if (day < 0) {
        age--;
      }
    }
  }

  return age >= 18;
};

module.exports = ageValidation;
