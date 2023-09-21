//tcp socket server
var tcpServer = net.createServer(function (socket) {
	console.log("Arduino server running on port 1337");
	console.log("Web server running on http://localhost:8090");
});
var toSend = [];
var i = 0;
tcpServer.on("connection", function (socket) {
	socket.write("connected to the tcp server\r\n");
	//console.log("num of connections on port 1337: " + tcpServer.connections);

	tcpGuests.push(socket);
	socket.on("data", function (data) {
		console.log("received on tcp socket:" + data);
		toSend[i] = data.toString();
		i = i + 1;
		if (i > 2) i = 0;
		///toSend = data.toString();
		console.log(toSend[0]);
		console.log(toSend[1]);
		console.log(toSend[2]);
		io.emit("tempK", toSend[0]);
		io.emit("tempE", toSend[1]);
		io.emit("tempA", toSend[2]);
	});
});

io.on("connection", (socket) => {
	console.log("Client connected");
	chatGuests.push(socket);
	socket.on("message", function (message) {
		for (g in tcpGuests) {
			tcpGuests[g].write(message);
			console.log(message);
		}
	});
});
