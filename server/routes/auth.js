const express = require('express');
const router  = express.Router();

const { isCompleteProfile } = require('../middlewares/completeProfile');

const authController = require('../controllers/auth');

router.get('/check-session', authController.checkSession);

router.get('/fetch/faculties', authController.getFaculties);
router.get('/fetch/specializations/:id', authController.getSpecializations);

router.post('/register/student', isCompleteProfile, authController.registerStudent);
router.post('/register/teacher', isCompleteProfile, authController.registerTeacher);

router.post('/refresh', authController.refreshAccessToken);

router.post('/login', isCompleteProfile, authController.login);
router.get('/logout', authController.logout);

router.get('/auth/google', authController.googleLogin);
router.get('/auth/google/callback', authController.googleCallback);


router.get('/find-user-by-token/:token', authController.findUserByToken );

router.put('/complete-profile/as-teacher', authController.completeProfileTeacher);

router.put('/complete-profile/as-student', authController.completeProfileStudent);

module.exports = router;
