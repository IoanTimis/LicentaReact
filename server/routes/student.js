const express = require('express');
const router  = express.Router(); 

const { isCompleteProfile } = require('../middlewares/completeProfile');
const { isStudent } = require('../middlewares/student');

router.use([isStudent]);

const studentController = require('../controllers/student'); 

router.get('/fetch/topics', studentController.studentTopics);
router.get('/fetch/topic/:id', studentController.topic);

router.get('/fetch/request-topics', studentController.getRequestTopics);
router.get('/fetch/request-topic/:id', studentController.getRequestTopic);

router.post('/request/add', studentController.newRequest);
router.delete('/request/delete/:id', studentController.deleteRequest);

module.exports = router;
