class Device {
	constructor(node, type) {
		this.node = node;
		this.type = type;
	}
}

class Actuator {
	constructor(node, actuatorType) {
		this.node = node;
		this.actuatorType = actuatorType;
		this.parent;
		this.status;
	}
	configureActuator(parent, actuatorType) {
		this.actuatorType = actuatorType;
		this.parent = parent;
	}
	get properties() {
		return {
			node: this.node,
			actuatorType: this.actuatorType,
			status: this.status,
			parent: this.parent,
		};
	}
}

class TemperatureActuator extends Actuator {
	constructor(node, actuatorType, parent, status, expectedTemperature) {
		super(node, actuatorType, parent, status);
		this.expectedTemperature = expectedTemperature;
	}
	setExpectedTemperature(temperature) {
		this.expectedTemperature = temperature;
	}
	get properties() {
		return {
			node: this.node,
			actuatorType: this.actuatorType,
			parent: this.parent,
			expectedTemperature: this.expectedTemperature,
			status: this.status,
		};
	}
}

class Sensor {
	constructor(node, sensorType) {
		this.node = node;
		this.sensorType = sensorType;
		this.parent;
		this.state;
	}
	configureSensor(children, sensorType) {
		this.sensorType = sensorType;
		this.children = children;
	}
	get properties() {
		return {
			node: this.node,
			actuatorType: this.actuatorType,
			children: this.children,
			state: this.state,
		};
	}
}

class SwitchSensor extends Sensor {
	constructor(node, sensorType, parent, state) {
		super(node, sensorType, parent, state);
	}
	setSwitch(state) {
		this.state = state;
	}
}

class TemperatureSensor extends Sensor {
	constructor(node, sensorType, parent, state) {
		super(node, sensorType, parent);
		this.temperature = state;
	}
	setSwitch(state) {
		this.state = state;
	}
}

module.exports = {
	Device,
	Actuator,
	TemperatureActuator,
	Sensor,
	SwitchSensor,
	TemperatureSensor,
};
