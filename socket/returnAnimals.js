var socketio = require('socket.io');
var DB_Animals = require('../models/database');

module.exports.listen = (app) => {
	/*
	Tao mang chua dong vat dang online
	*/
	var animalArray = [];

	/*
	Khoi tao module io
	*/
	io = socketio.listen(app);
	io.on('connection', (socket) => {
		/*
		Lay ra random dong vat de gan
		*/
		var randomAnimal = DB_Animals[Math.floor(Math.random() * DB_Animals.length)];

		/*
		Kiem tra xem con duoc truy cap hay khong, so nguoi vuot qua
		*/
		if (animalArray.length == DB_Animals.length){
			return false;
		}

		/*
		Kiem tra xem con vat dc chon co trung trong con da online khong
		*/
		while (animalArray.indexOf(randomAnimal.id) != -1) {
			// statement
			randomAnimal = DB_Animals[Math.floor(Math.random() * DB_Animals.length)];
		}

		/*
		Them vao mang
		*/
		animalArray.push(randomAnimal.id);
		console.log("Animal: " + randomAnimal.name + " connected!");

		/*
		Gui danh sach nguoi dung dang online den tat ca nguoi dung
		*/
		socket.broadcast.emit("animal-online", {
			animalId: randomAnimal.id,
			animalName: randomAnimal.name,
			animalColor: randomAnimal.color
		});

		/*
		Nghe su kien khi nguoi dung offline
		*/
		socket.on('disconnect', () => {
			console.log("User: " + randomAnimal.name + " disconnected!");
			animalArray.splice(animalArray.indexOf(randomAnimal.id), 1);
			socket.broadcast.emit('animal-offline', randomAnimal.id);
		});

		/*
		Nghe su kien tu client de check
		*/
		socket.on('animal-check', (inputId) => {
			var dataCallback = {
				inputId: inputId,
                animalName: randomAnimal.name,
                animalColor: randomAnimal.color
			};
			socket.broadcast.emit('server-send-check', dataCallback);
		});
		
		/*
		Nghe su kien tu client de uncheck
		*/
		socket.on('animal-uncheck', (inputId) =>{
			socket.broadcast.emit('server-send-uncheck', inputId);
		});

	});
	return io;
}