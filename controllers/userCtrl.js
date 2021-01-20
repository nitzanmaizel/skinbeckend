const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateEmailInput = require("../validation/userUpdateEmail");
const validatePasswordInput = require("../validation/userUpdatePassword");
const validateNameInput = require("../validation/userUpdateName");
const validateCountryInput = require("../validation/userUpdateCountry");
const validateBioInput = require("../validation/userUpdateBio");

const Register = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists!" });
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        bio: req.body.bio,
        country: req.body.country,
        email: req.body.email,
        password: req.body.password,
        isAdmin: false,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then((user) => {
            const payload = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              bio: user.bio,
              country: user.country,
              email: user.email,
              isAdmin: user.isAdmin,
            };

            jwt.sign(
              payload,
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: 31556926,
              },
              (err, token) => {
                res
                  .json({
                    success: true,
                    token: "Bearer " + token,
                  })
                  .catch((err) => {
                    return res.status(500).json("Server Error");
                  });
              }
            );
          });
        });
      });
    }
  });
};

const Login = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "Email not registered!" });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          country: user.country,
          email: user.email,
          isAdmin: user.isAdmin,
        };

        jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: 31556926,
          },
          (err, token) => {
            res
              .json({
                success: true,
                token: "Bearer " + token,
              })
              .catch((err) => {
                return res.status(500).json("Server Error");
              });
          }
        );
      } else {
        return res.status(400).json({ password: "Incorrect Password" });
      }
    });
  });
};

const UpdateEmail = (req, res) => {
  const { errors, isValid } = validateEmailInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const id = req.user.id;
  const email = req.body.email;

  User.findOne({ email }).then((user) => {
    if (user !== null) {
      if (user.id === id) {
        return res.status(400).json("This is already your email!");
      } else return res.status(400).json("Email is already beeing used!");
    } else {
      User.findOneAndUpdate(
        { _id: id },
        { $set: { email: email } },
        { new: true },
        function (err, user) {
          if (err) {
            console.log(err);
            return res.status(500).json("Server Error");
          }
          if (user) {
            const payload = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              bio: user.bio,
              country: user.country,
              email: user.email,
              isAdmin: user.isAdmin,
            };

            jwt.sign(
              payload,
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: 31556926,
              },
              (err, token) => {
                res
                  .json({
                    success: true,
                    token: "Bearer " + token,
                  })
                  .catch((err) => {
                    return res.status(500).json("Server Error");
                  });
              }
            );
          }
        }
      );
    }
  });
};

const UpdatePassword = (req, res) => {
  const { errors, isValid } = validatePasswordInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const id = req.user.id;
  const password = req.body.password;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      const passwordenc = hash;
      User.findOneAndUpdate(
        { _id: id },
        { $set: { password: passwordenc } },
        { new: true },
        function (err, user) {
          if (err) {
            console.log(err);
            return res.status(500).json("Server Error");
          }
          if (user) {
            return res.json({
              success: true,
            });
          }
        }
      );
    });
  });
};

const UpdateName = (req, res) => {
  const { errors, isValid } = validateNameInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const id = req.user.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  User.findOneAndUpdate(
    { _id: id },
    { $set: { firstName, lastName } },
    { new: true },
    function (err, user) {
      if (err) {
        return res.status(500).json({ other: "Server Error!" });
      }
      if (user) {
        const payload = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          country: user.country,
          email: user.email,
          isAdmin: user.isAdmin,
        };

        jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: 31556926,
          },
          (err, token) => {
            res
              .json({
                success: true,
                token: "Bearer " + token,
              })
              .catch((err) => {
                return res.status(500).json("Server Error");
              });
          }
        );
      }
    }
  );
};

const UpdateCountry = (req, res) => {
  const { errors, isValid } = validateCountryInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const id = req.user.id;
  const country = req.body.country;

  User.findOneAndUpdate(
    { _id: id },
    { $set: { country } },
    { new: true },
    function (err, user) {
      if (err) {
        console.log(err);
        return res.status(500).json("Server Error");
      }
      if (user) {
        const payload = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          country: user.country,
          email: user.email,
          isAdmin: user.isAdmin,
        };

        jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: 31556926,
          },
          (err, token) => {
            res
              .json({
                success: true,
                token: "Bearer " + token,
              })
              .catch((err) => {
                return res.status(500).json("Server Error");
              });
          }
        );
      }
    }
  );
};

const UpdateBio = (req, res) => {
  const { errors, isValid } = validateBioInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const id = req.user.id;
  const bio = req.body.bio;

  User.findOneAndUpdate(
    { _id: id },
    { $set: { bio } },
    { new: true },
    function (err, user) {
      if (err) {
        console.log(err);
        return res.status(500).json("Server Error");
      }
      if (user) {
        const payload = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          country: user.country,
          email: user.email,
          isAdmin: user.isAdmin,
        };
        jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: 31556926 },
          (err, token) => {
            res
              .json({
                success: true,
                token: "Bearer " + token,
              })
              .catch((err) => {
                return res.status(500).json("Server Error");
              });
          }
        );
      }
    }
  );
};

const GetUserFiles = async (req, res) => {
  User.findOne({ _id: req.user._id })
    .populate("case_files")
    .then((user) => {
      return res.json(user.case_files);
    })
    .catch((err) => {
      res.status(500).send("Server Error");
    });
};

module.exports = {
  Register: Register,
  Login: Login,
  UpdateEmail: UpdateEmail,
  UpdatePassword: UpdatePassword,
  UpdateName: UpdateName,
  UpdateCountry: UpdateCountry,
  UpdateBio: UpdateBio,
  GetUserFiles: GetUserFiles,
};
