import { Server } from 'socket.io';
import * as http from 'http';
import * as https from 'https';

interface ConnectedUsers {
	[userId: string]: string;
}

export const socket = (server: http.Server | https.Server) => {
	const io = new Server(server, {
		cors: {
			origin: '*',
			credentials: true,
			methods: ['GET', 'POST'],
		},
	});

	const users = {} as ConnectedUsers;
	io.on('connection', socket => {
		console.log(`⚡: ${socket.id} user just connected!`);

		socket.on('message', data => {
			io.emit('messageResponse', data);
		});

		socket.on('login', function (data) {
			users[socket.id] = data.userId;
			io.emit('loginResponse', users);
		});

		socket.on('typing', data => {
			socket.broadcast.emit('typingResponse', data);
		});

		socket.on('disconnect', () => {
			console.log('🔥: A user disconnected');
			delete users[socket.id];
			io.emit('loginResponse', users);
		});
	});
};
