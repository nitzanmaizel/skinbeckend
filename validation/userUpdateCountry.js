const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateCountryInput(data) {
  let errors = "";

  data.country = !isEmpty(data.country) ? data.country : "";

  if (Validator.isEmpty(data.country)) {
    errors = "Country is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
