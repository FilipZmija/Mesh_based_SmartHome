const net = require("net");

const tcpGuests = [];

//tcp socket server
net.createServer(function (socket) {
	console.log("Arduino server running on port 1337");
	console.log("Web server running on http://localhost:8090");
	socket.write("connected to the tcp server\r\n");
	socket.on("data", function (data) {
		console.log("received on tcp socket:" + data);
		socket.emit("thank you for data :D");
	});
	socket.on("end", function () {
		console.log("end");
	});
	socket.on("close", function () {
		console.log("close");
	});
	socket.on("error", function (e) {
		console.log("error ", e);
	});
}).listen(1234);
