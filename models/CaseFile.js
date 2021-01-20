const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CaseFileSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    patient_case_file_id: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    localization: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    doctor_diagnosis: {
      type: String,
      required: false,
    },
    diameter: {
      type: Number,
      required: false,
    },
    evolution: {
      type: Boolean,
      required: false,
    },
    history: {
      type: String,
      required: false,
    },
    ai_diagnosis: {
      type: Object,
      required: false,
    },
    image_url: {
      type: String,
      required: true,
    },
    comments: {
      type: Array,
      required: false,
    },
    survey: {
      type: Array,
      required: false,
    },
    date_created: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

module.exports = CaseFile = mongoose.model("caseFile", CaseFileSchema);
