/*
	Khoi tao module
*/
var socket = io("http://locahost:3000");

// Nghe su kien tu server khi ma online
socket.on('animal-online', (data) => {
	var animal = '<a id="online-' + data.animalId + '" class="list-group-item" style="color: white; background-color: ' + data.animalColor + ';">' + data.animalName + ' ẩn danh.</a>';
	$('#animal-online').prepend(animal);
});

// Nghe su kien tu server khi ma offline
socket.on('animal-offline', (animalId) => {
	$('#online-' + animalId).remove();
});

// Nghe su kien tu server khi dong vat check input
socket.on('server-send-check', (data) => {
	$('#' + data.inputId).css('border-color', data.animalColor);
	var tooltip = '<span class="tooltiptext" style="color: white; background-color: ' + data.animalColor + ';">' + data.animalName + ' ẩn danh</span>';
	$('#td' + data.inputId).append(tooltip);
});

// Nghe su kien tu server khi dongvat uncheck input
socket.on('server-send-uncheck', (inputId) => {
	$('#' + inputId).css('border-color', '');
	$('#td-' + inputId + '>span').remove();
});

$(document).ready(()=> {
	for (var i = 0; i < 6; i++){
		var data = '<tr>';
			for(var j = 0; j < 6; j++){
				data += "<td class='td-animal' id='td-" + i + j + "'><input type='text' class='animal' id='" + i + j + "' placeholder='check me'></td>";
			}
		data += '<tr>';
		$('#animals-table>tbody').append(data);
	}

	var inputCheckedId;

	/*
	Khi client check
	*/
	$('.animal').bind('click', function () {
		/* body... */
		socket.emit('animal-check', this.id);
		inputCheckedId = this.id;
	});

	/*
	Khi client unckeck
	*/
	$('.animal').bind('blur', function () {
		/* body... */
		socket.emit('animal-uncheck', this.id);
	});

	/*
	Khi client leave trang hoac F5
	*/
	$(window).bind('beforeunload', function () {
		socket.emit('animal-uncheck', inputCheckedId);
	});

});