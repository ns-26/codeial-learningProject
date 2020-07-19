const queue = require('../config/kue');

const passwordResetMailer = require('../mailers/password_reset_mailer');

//process function
queue.process('password', function(job, done) {
	console.log('password worker is processing a job', job.data);
	passwordResetMailer.newToken(job.data);
	done();
});
