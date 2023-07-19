class ControlDevice {
	constructor({ node, type, mode, parent, status }) {
		this.node = node;
		this.type = type;
		this.mode = mode;
		this.parent = parent;
		this.status = status;
	}
	get message() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			parent: this.parent,
			status: this.status,
		};
	}
}

class Actuator {
	constructor(node, type, mode, parent, status) {
		this.node = node;
		this.type = type;
		this.mode = mode;
		this.parent = parent;
		this.status = status;
	}
	configure(parent) {
		this.parent = parent;
	}
	get properties() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			status: this.status,
			parent: this.parent,
		};
	}
}

class TemperatureActuator extends Actuator {
	constructor({ node, type, mode, parent, status }) {
		super(node, type, mode, parent, status);
	}

	setSwitch(sensorsInSystem) {
		this.status = !this.status;
		const message = new ControlDevice(this);
		if (this.parent) {
			sensorsInSystem.forEach((sensor) => {
				if (sensor.parent === this.node) {
					expectedTemperature = undefined;
				}
			});
		}
		return message.message;
	}

	get properties() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			parent: this.parent,
			status: this.status,
		};
	}
}

class LightActuator extends Actuator {
	constructor({ node, type, mode, parent, status }) {
		super(node, type, mode, parent, status);
	}
	setSwitch() {
		this.status = !this.status;
		const message = new ControlDevice(this);
		return message.message;
	}
	get properties() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			parent: this.parent,
			status: this.status,
			expectedTemperature: this.expectedTemperature,
		};
	}
}

class Sensor {
	constructor(node, type, mode, children) {
		this.node = node;
		this.type = type;
		this.mode = mode;
		this.children = children;
	}
	configure(children) {
		this.children = children;
	}
	get properties() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			children: this.children,
			state: this.state,
		};
	}
}

class SwitchSensor extends Sensor {
	constructor({ node, type, mode, children }) {
		super(node, type, mode, children);
	}
}

class TemperatureSensor extends Sensor {
	constructor({
		node,
		type,
		mode,
		children,
		temperature,
		expectedTemperature,
	}) {
		super(node, type, mode, children);
		this.temperature = temperature;
		this.expectedTemperature = expectedTemperature;
	}
	setExpectedTemperature(temperature) {
		this.expectedTemperature = temperature;
	}
}

module.exports = {
	Actuator,
	TemperatureActuator,
	LightActuator,
	Sensor,
	SwitchSensor,
	TemperatureSensor,
};
