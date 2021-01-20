const upload = require("../config/multer");
const express = require("express");
const router = express.Router();
const passport = require("passport");

const { UploadFile, CommentFile } = require("../controllers/fileCtrl");

router.post(
  "/upload",
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  UploadFile
);

router.put(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  CommentFile
);

module.exports = router;
