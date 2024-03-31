require('dotenv').config(); // This loads the .env file at the root
const { exec } = require('child_process');

// Pass the command you want to run as an argument to this script
const command = process.argv.slice(2).join(' ');

exec(command, (error, stdout, stderr) => {
	if (error) {
		console.error(`exec error: ${error}`);
		return;
	}
	console.log(stdout);
	if (stderr) console.error(stderr);
});
