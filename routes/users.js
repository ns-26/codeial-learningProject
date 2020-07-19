const express = require('express');

const router = express.Router();

const usersController = require('../controllers/user_controller');

const passport = require('passport');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);

router.get('/sign-in', usersController.signIn);

router.get('/sign-up', usersController.signUp);

router.post('/create', usersController.create);
//use passport as a middle ware to authenticate
router.post(
	'/create-session',
	passport.authenticate('local', { failureRedirect: '/users/sign-in' }),
	usersController.createSession
);

router.get('/sign-out', usersController.destroySession);

router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/auth/google', passport.authenticate('google', { scope: [ 'profile', 'email' ] }));

router.get(
	'/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/users/sign-in' }),
	usersController.createSession
);

router.get('/forgot-password', usersController.forgotPassword);

router.post('/generate-token', usersController.generateToken);

module.exports = router;
