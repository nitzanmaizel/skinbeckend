const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  Register,
  Login,
  UpdateEmail,
  UpdatePassword,
  UpdateName,
  UpdateCountry,
  UpdateBio,
} = require("../controllers/userCtrl");

router.post("/register", Register);
router.post("/login", Login);
router.put(
  "/updateemail",
  passport.authenticate("jwt", { session: false }),
  UpdateEmail
);
router.put(
  "/updatepassword",
  passport.authenticate("jwt", { session: false }),
  UpdatePassword
);
router.put(
  "/updatename",
  passport.authenticate("jwt", { session: false }),
  UpdateName
);
router.put(
  "/updatecountry",
  passport.authenticate("jwt", { session: false }),
  UpdateCountry
);
router.put(
  "/updatebio",
  passport.authenticate("jwt", { session: false }),
  UpdateBio
);

module.exports = router;
