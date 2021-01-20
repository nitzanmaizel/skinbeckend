const upload = require('../config/multer');
const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
	UploadFile,
	PostCommentFile,
	PostSurveyFile,
	GetFile,
} = require('../controllers/fileCtrl');

router.post(
	'/upload',
	upload.single('image'),
	passport.authenticate('jwt', { session: false }),
	UploadFile
);

router.put('/comment', passport.authenticate('jwt', { session: false }), PostCommentFile);

router.put('/survey', passport.authenticate('jwt', { session: false }), PostSurveyFile);
router.get('/getfile/:id', passport.authenticate('jwt', { session: false }), GetFile);

module.exports = router;
