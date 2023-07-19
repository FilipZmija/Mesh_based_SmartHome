const net = require("net");
const {
	Device,
	Actuator,
	TemperatureActuator,
	Sensor,
	SwitchSensor,
	TemperatureSensor,
} = require("./data_structures.js");

const newDevOne = new Device("701010689", "sensor");
const newDeviceTwo = new Device("2808636797", "actuator");
const devicesInSystem = [newDevOne, newDeviceTwo];

const actuatorsInSystem = [];
const sensorsInSystem = [];

const adjustDevices = () => {
	const actuators = devicesInSystem.filter(
		(device) => device.type === "actuator"
	);
	actuators.forEach((actuator) =>
		actuatorsInSystem.push(new Actuator(actuator.node))
	);
	const sensors = devicesInSystem.filter((device) => device.type === "sensor");
	sensors.forEach((sensor) => sensorsInSystem.push(new Sensor(sensor.node)));
	console.log(actuatorsInSystem);
	console.log(sensorsInSystem);
	console.log(devicesInSystem);
	actuatorsInSystem[0].configure("701010689", "lightActuator");
	console.log(actuatorsInSystem);
};
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});
readline.question("What do you wanna see?", (yes) => {
	readline.close();

	yes ? adjustDevices() : adjustDevices();
});
const tcpGuests = [];

//tcp socket server
net.createServer(function (socket) {
	console.log("Arduino server running on port 1337");
	console.log("Web server running on http://localhost:8090");
	socket.on("data", function (data) {
		console.log("received on tcp socket:" + data);
		// setTimeout(
		// 	() =>
		// 		readline.question("Who are you?", (yes) => {
		// 			yes
		// 				? socket.write(
		// 						`{"node":"701010689","sensorType":"switchSensor","switch":${yes},"children":"2808636797"}`
		// 				  )
		// 				: console.log(devicesInSystem);
		// 			readline.close();
		// 		}),
		// 	2000
		// );
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
