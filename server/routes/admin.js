const express = require('express');

const router  = express.Router(); 

const { isAdmin } = require('../middlewares/admin');

router.use([isAdmin]);

const adminController = require('../controllers/admin'); 

router.get('/faculties', adminController.getFaculties);
router.get('/faculty/get/:id', adminController.getFaculty);
router.post('/faculty/add', adminController.addFaculty);
router.put('/faculty/edit/:id', adminController.updateFaculty);
router.delete('/faculty/delete/:id', adminController.deleteFaculty);

router.get('/specializations', adminController.getSpecializations);
router.get('/fetch/specializations/:id', adminController.getFacultySpecializations);
router.get('/specialization/get/:id', adminController.getSpecialization);
router.post('/specialization/add', adminController.addSpecialization);
router.put('/specialization/edit/:id', adminController.editSpecialization);
router.delete('/specialization/delete/:id', adminController.deleteSpecialization);

router.get('/users', adminController.getUsers);
router.get('/user/get/:id', adminController.getUser);
router.put('/user/edit/:id', adminController.editUser);
router.delete('/user/delete/:id', adminController.deleteUser);

module.exports = router;

