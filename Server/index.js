const net = require("net");
const {
	LightActuator,
	Actuator,
	TemperatureActuator,
	Sensor,
	SwitchSensor,
	TemperatureSensor,
} = require("./data_structures.js");

const {
	readDevices,
	updateInfo,
	configureDevices,
	rr,
} = require("./devices_communication.js");

const util = require("util");

//tcp server
const tcpServer = net.createServer(function (socket) {
	console.log("Arduino server running on port 1337");
	console.log("Web server running on http://localhost:8090");
	//reciving requests from devices
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
					readDevices(item.body);
					break;
				case "post/info":
					updateInfo(item.body);
					break;
			}
		});
	});

	//debugging
	const readline = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout,
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
});

const newFnc = () => {
	tcpServer.on("connection", (socket) => {
		configureDevices("2808636797", "701010689");
		socket.write(data);
	});
};

readline.question("What do you wanna see?", (yes) => {
	readline.close();

	yes ? newFnc() : newFnc();
});

tcpServer.listen(1234);
