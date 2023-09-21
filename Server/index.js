const net = require("net");

const {
	readDevices,
	updateInfo,
	configureDevices,
	controlDevice,
	addToPlan,
	moveAround,
	setSelected,
	getAllData,
} = require("./devices_communication.js");

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const socketServer = http.createServer(app);
const io = socketIo(socketServer, {
	cors: {
		origin: "*",
	},
});
let tcpGuest;
// Set up a connection event
io.on("connection", (socket) => {
	console.log("A user connected");
	// Listen for 'message' events from the client
	socket.on("message", (data) => {
		console.log("Received message:", data);
	});

	// Handle disconnection
	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});

io.on("connection", (socket) => {
	socket.on("switch", (data) => {
		console.log("Received message:", data);
		const body = controlDevice(data, "toggle");
		tcpGuest.write(body);
	});
});

// fronend data modification
io.on("connection", (socket) => {
	io.emit("devices", getAllData());
	socket.on("addToPlan", (data) => {
		addToPlan(data);
	});

	socket.on("moveAround", (data) => {
		moveAround(data);
	});
	socket.on("setSelected", (data) => {
		setSelected(data);
	});
	socket.on("pair", (data) => {
		const { pairInfo, connections } = data;
		console.log(pairInfo);
		const message = configureDevices(
			pairInfo.actuator,
			pairInfo.sensor,
			connections
		);
		tcpGuest.write(message);
	});
});

const PORT = 8090;
socketServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

//tcp server
var tcpServer = net.createServer(function (socket) {
	console.log("Arduino server running on port 1337");
	console.log("Web server running on http://localhost:8090");
	//reciving requests from devices

	tcpGuest = socket;
	socket.on("end", function () {
		console.log("end");
	});

	socket.on("close", function () {
		console.log("close");
	});

	socket.on("error", function (e) {
		console.log("error ", e);
	});
});

tcpServer.on("connection", (socket) => {
	socket.on("data", function (data) {
		console.log("received on tcp socket:" + data);
		const requests = data
			.toString()
			.trim()
			.split("#")
			.filter((item) => item.length !== 0)
			.map((item) => JSON.parse(item));

		console.log(requests);

		//invoking the requests
		requests.forEach((item) => {
			switch (item.headers.type) {
				case "post/indentifyDevice":
					io.emit("devices", readDevices(item.body));
					break;
				case "post/info":
					io.emit("devices", updateInfo(item.body));
					break;
			}
		});
	});
});

tcpServer.listen(1234);
