const express = require('express');
const router = express.Router();
const registrationController = require('../controller/adminManagement');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.get('/adminHome', authenticate, authorizeRoles('Admin'), (req, res) => {
    res.render('admin')
});
router.get('/listRegistrations', authenticate, authorizeRoles('Admin'), registrationController.ViewAllRegistrations);
router.get('/getRegistrationsByDate', authenticate, authorizeRoles('Admin'), registrationController.SearchRegistrationsByDate);

module.exports = router;
