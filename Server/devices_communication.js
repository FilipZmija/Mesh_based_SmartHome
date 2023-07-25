//objects that store info about devices
const actuatorsInSystem = [];
const sensorsInSystem = [];
let devicesInSystem = [];

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
	} else console.log("Device has been previously registered");

	devicesInSystem = actuatorsInSystem.concat(sensorsInSystem);
	console.log(sensorsInSystem);
	console.log(devicesInSystem);
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
};

// function to call when configuring device, returns message that is supposed to be sent to devices
const configureDevices = (actuator, sensor) => {
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
	return data;
};
//function to call when controling device,  returns message that is supposed to be sent to devices
const controlDevice = (node, order) => {
	const device = actuatorsInSystem.find((actuator) => actuator.node === node);
	const message = device.setSwitch(order);
	console.log(message);
	const request = { headers: { type: "post/control" }, body: message };
	return request;
};

module.exports = { readDevices, updateInfo, configureDevices, controlDevice };
