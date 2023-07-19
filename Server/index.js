const net = require("net");
const {
	LightActuator,
	Actuator,
	TemperatureActuator,
	Sensor,
	SwitchSensor,
	TemperatureSensor,
} = require("./data_structures.js");

const actuatorsInSystem = [];
const sensorsInSystem = [];

const objects = [
	{
		node: "701010689",
		type: "actuator",
		mode: "light",
		parent: "2808636797",
		status: undefined,
	},
	{
		node: "2808636797",
		type: "sensor",
		mode: "switch",
		children: "701010689",
	},
];

const readDevices = (objects) => {
	objects.forEach((device) => {
		if (device.type === "actuator") {
			switch (device.mode) {
				case "light":
					actuatorsInSystem.push(new LightActuator(device));
					break;
				case "temperture":
					actuatorsInSystem.push(new TemperatureActuator(device));
					break;
			}
		} else if (device.type === "sensor") {
			switch (device.mode) {
				case "switch":
					sensorsInSystem.push(new SwitchSensor(device));
					break;
				case "temperature":
					sensorsInSystem.push(new TemperatureSensor(device));
					break;
			}
		}
	});
	console.log(actuatorsInSystem);
	console.log(sensorsInSystem);
	actuatorsInSystem[0];
};

const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});
readline.question("What do you wanna see?", (yes) => {
	readline.close();

	yes ? readDevices(objects) : readDevices(objects);
});
const tcpGuests = [];

//tcp socket server
net.createServer(function (socket) {
	console.log("Arduino server running on port 1337");
	console.log("Web server running on http://localhost:8090");
	socket.on("data", function (data) {
		console.log("received on tcp socket:" + data);
		const requests = data
			.toString()
			.trim()
			.split("#")
			.filter((item) => item.length !== 0)
			.map((item) => JSON.parse(item));

		console.log(requests);
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
