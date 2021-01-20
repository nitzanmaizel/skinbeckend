const CaseFile = require("../models/CaseFile");
const User = require("../models/User");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CONFIG_NAME,
  api_key: process.env.CLOUDINARY_CONFIG_KEY,
  api_secret: process.env.CLOUDINARY_CONFIG_SECRET,
});

const UploadFile = async (req, res) => {
  let cloud = {};
  if (req.file) {
    cloud = await cloudinary.v2.uploader.upload(req.file.path).catch((err) => {
      return res.status(500).json("Error uploading photo");
    });
  } else {
    return res.status(400).json("No file");
  }
  if (!req.body.patientCaseFileId) {
    return res.status(400).json("Missing Information");
  }
  const newFile = new CaseFile({
    user_id: req.user._id,
    patient_case_file_id: req.body.patientCaseFileId,
    age: req.body.age,
    gender: req.body.gender,
    localization: req.body.localization,
    status: req.body.status,
    diameter: req.body.diameter,
    evolution: req.body.evolution,
    history: req.body.history,
    image_url: cloud.url,
  });

  newFile.save().catch((err) => {
    return res.status(500).json("Server Error");
  });
  User.findOne({ _id: req.user._id }).then((user) => {
    if (!user) {
      return res.status(500).json("Server Error!");
    }
    user.case_files.push(newFile._id);
    user.save().then((user) => {
      res
        .json({
          user,
        })
        .catch((err) => {
          return res.status(500).json("Server Error");
        });
    });
  });
};

const PostCommentFile = async (req, res) => {
  if (!req.body.file_id || !req.body.comment_content) {
    return res.status(400).json("Missing Information");
  }
  CaseFile.findOne({ _id: req.body.file_id }).then((casefile) => {
    const newComment = {
      user_id: req.user._id,
      date: Date.now(),
      comment: req.body.comment_content,
    };
    casefile.comments.push(newComment);
    casefile
      .save()
      .then((newcasefile) => {
        return res.json(newcasefile);
      })
      .catch((err) => {
        return res.status(500).json("Server Error");
      });
  });
};

const PostSurveyFile = async (req, res) => {
  if (!req.body.file_id || !req.body.survey_content) {
    return res.status(400).json("Missing Information");
  }
  CaseFile.findOne({ _id: req.body.file_id }).then((casefile) => {
    const newSurvey = {
      user_id: req.user._id,
      date: Date.now(),
      comment: req.body.survey_content,
    };
    casefile.survey.push(newSurvey);
    casefile
      .save()
      .then((newcasefile) => {
        return res.json(newcasefile);
      })
      .catch((err) => {
        return res.status(500).json("Server Error");
      });
  });
};

module.exports = {
  UploadFile: UploadFile,
  PostCommentFile: PostCommentFile,
  PostSurveyFile: PostSurveyFile,
};
