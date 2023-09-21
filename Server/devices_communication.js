const {
	LightActuator,
	Actuator,
	TemperatureActuator,
	Sensor,
	SwitchSensor,
	TemperatureSensor,
} = require("./data_structures.js");

const util = require("util");

//objects that store info about devices
const actuatorsInSystem = [];
const sensorsInSystem = [];
let devicesInSystem = [];
let connectionsInSystem = [];

//debugging function
const displayObject = (object) => {
	console.log(
		util.inspect(object, { showHidden: false, depth: null, colors: true })
	);
};

//function that reads the devices pinging the tcp server and stores them in object
const readDevices = (device) => {
	const isKnown = devicesInSystem.reduce(
		(acc, curr) => (curr.node === device.node ? true : acc),
		false
	);
	if (!isKnown) {
		if (device.type === "actuator") {
			switch (device.mode) {
				case "light":
					actuatorsInSystem.push(new LightActuator(device));
					break;
				case "temperature":
					actuatorsInSystem.push(new TemperatureActuator(device));
					break;
			}
		} else if (device.type === "sensor") {
			switch (device.mode) {
				case "switch":
					sensorsInSystem.push(new SwitchSensor(device));
					break;
				case "heating":
					sensorsInSystem.push(new TemperatureSensor(device));
					break;
			}
		}
	} else console.log("Device has been previously registered");

	devicesInSystem = actuatorsInSystem.concat(sensorsInSystem);
	console.log(sensorsInSystem);
	console.log(actuatorsInSystem);

	return {
		sensors: sensorsInSystem,
		actuators: actuatorsInSystem,
		connectionsInSystem: connectionsInSystem,
	};
};

//Updating info on backend about the devices depending on what arrives from mesh
const updateInfo = (device) => {
	let index;
	switch (device.type) {
		case "sensor":
			index = sensorsInSystem.findIndex(
				(oldDevice) => oldDevice.node === device.node
			);
			sensorsInSystem[index].info(device);
			displayObject(sensorsInSystem[index].properties);

			break;
		case "actuator":
			index = actuatorsInSystem.findIndex(
				(oldDevice) => oldDevice.node === device.node
			);
			actuatorsInSystem[index].update(device);
			displayObject(actuatorsInSystem[index].properties);

			break;
	}
	return {
		sensors: sensorsInSystem,
		actuators: actuatorsInSystem,
		connectionsInSystem: connectionsInSystem,
	};
};

// function to call when configuring device, returns message that is supposed to be sent to devices
const configureDevices = (actuator, sensor, connections) => {
	const sensorIndex = sensorsInSystem.findIndex(
		(oldDevice) => oldDevice.node === sensor
	);
	const actuatorIndex = actuatorsInSystem.findIndex(
		(oldDevice) => oldDevice.node === actuator
	);
	console.log(actuatorIndex, sensorIndex);
	const message = sensorsInSystem[sensorIndex].configure(actuator);
	actuatorsInSystem[actuatorIndex].configure(sensor);
	const data = JSON.stringify(message);
	console.log(data);
	connectionsInSystem = connections;
	return data;
};
//function to call when controling device,  returns message that is supposed to be sent to devices
const controlDevice = (node, order) => {
	const device = actuatorsInSystem.find((actuator) => actuator.node === node);
	const message = device.setSwitch(order);
	console.log(message);
	const request = JSON.stringify({
		headers: { type: "post/control" },
		body: message,
	});

	return request;
};

//frontend functions
const addToPlan = (data) => {
	const { node, type, divPos, isSelected, id } = data;
	if (type === "sensor") {
		const index = sensorsInSystem.findIndex(
			(oldDevice) => oldDevice.node === node
		);
		sensorsInSystem[index].addToPlan(divPos, isSelected, id);
	} else if (type === "actuator") {
		const index = actuatorsInSystem.findIndex(
			(oldDevice) => oldDevice.node === node
		);
		actuatorsInSystem[index].addToPlan(divPos, isSelected, id);
	}
	console.log(actuatorsInSystem);
};

const moveAround = (data) => {
	const { node, type, divPos } = data;
	if (type === "sensor") {
		const index = sensorsInSystem.findIndex(
			(oldDevice) => oldDevice.node === node
		);
		sensorsInSystem[index].moveAround(divPos);
	} else if (type === "actuator") {
		const index = actuatorsInSystem.findIndex(
			(oldDevice) => oldDevice.node === node
		);
		actuatorsInSystem[index].moveAround(divPos);
	}
	console.log(actuatorsInSystem);
};

const setSelected = (data) => {
	const { node, type, isSelected, divPos } = data;
	if (type === "sensor") {
		const index = sensorsInSystem.findIndex(
			(oldDevice) => oldDevice.node === node
		);
		sensorsInSystem[index].setSelected(isSelected);
	} else if (type === "actuator") {
		const index = actuatorsInSystem.findIndex(
			(oldDevice) => oldDevice.node === node
		);
		actuatorsInSystem[index].setSelected(isSelected);
	}
	console.log(actuatorsInSystem);
};

const getAllData = (data) => {
	return {
		sensors: sensorsInSystem,
		actuators: actuatorsInSystem,
		connectionsInSystem: connectionsInSystem,
	};
};

module.exports = {
	readDevices,
	updateInfo,
	configureDevices,
	controlDevice,
	addToPlan,
	moveAround,
	setSelected,
	getAllData,
};
