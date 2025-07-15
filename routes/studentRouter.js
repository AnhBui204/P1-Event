const express = require('express');
const router = express.Router();
const registrationController = require('../controller/StudentEventRegistration');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.get('/studentHome', authenticate, authorizeRoles('Student'), (req, res) => {
    res.render('studentNav')
});
router.get('/events', authenticate, authorizeRoles('Student'), registrationController.GetAllEvents);
router.post('/registrations', authenticate, authorizeRoles('Student'), registrationController.Registration);
router.get('/myRegistrations', authenticate, authorizeRoles('Student'), registrationController.MyRegistrations);
router.get('/unregister/:registrationId', authenticate, authorizeRoles('Student'), registrationController.Unregister);

module.exports = router;
