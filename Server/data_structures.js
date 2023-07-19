class ControlDevice {
	constructor({ node, type, mode, parent, order }) {
		this.node = node;
		this.type = type;
		this.mode = mode;
		this.parent = parent;
		this.order = order;
	}
	get message() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			parent: this.parent,
			order: this.order,
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
	constructor({ node, type, mode, parent, order }) {
		super(node, type, mode, parent);
	}

	setSwitch(order, sensorsInSystem) {
		const object = { ...this, order };
		const message = new ControlDevice(object);
		if (this.parent) {
			sensorsInSystem.forEach((sensor) => {
				if (sensor.parent === this.node) {
					expectedTemperature = undefined;
				}
			});
		}
		this.order = undefined;
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
	constructor({ node, type, mode, parent, status, order }) {
		super(node, type, mode, parent, status);
	}
	setSwitch(order) {
		const object = { ...this, order };
		const message = new ControlDevice(object);
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
