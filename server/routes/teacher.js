const express = require('express');
const router  = express.Router(); 

const { isCompleteProfile } = require('../middlewares/completeProfile');
const { isTeacher } = require('../middlewares/teacher');

router.use([isTeacher]);

const teacherController = require('../controllers/teacher'); 

router.get('/fetch/topics', teacherController.teacherTopics);
router.get('/fetch/topic/:id', teacherController.teacherTopic);
router.get('/fetch/getSpecializations/:id', teacherController.getSpecializations);

router.post('/topic/add', teacherController.addTopic);
router.put('/topic/edit/:id', teacherController.editTopic);
router.delete('/topic/delete/:id', teacherController.deleteTopic);

router.get('/fetch/student-requests', teacherController.studentRequests);
router.get('/fetch/student-request/:id', teacherController.studentRequest);

router.put('/student-request/response/:id', teacherController.teacherResponse);
router.delete('/student-request/delete/:id', teacherController.deleteRequest);

router.get('/fetch/my-students', teacherController.getMyStudents);

module.exports = router;
