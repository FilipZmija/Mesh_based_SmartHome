class ControlDevice {
	constructor({ node, type, mode, order }) {
		this.node = "server";
		this.type = type;
		this.mode = mode;
		this.children = node;
		this.order = order;
	}
	get message() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			children: this.children,
			order: this.order,
		};
	}
}

function sendConfigurationMessage(actuator, sensor) {
	const message = {
		headers: { type: "post/configure" },
		body: {
			childrenID: actuator,
			parentID: sensor,
		},
	};
	return message;
}

class Sensor {
	constructor(node, type, mode, children) {
		this.node = node;
		this.type = type;
		this.mode = mode;
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
	constructor({ node, type, mode, parent }) {
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
	update({ node, type, mode, parent, status }) {
		this.node = node;
		this.type = type;
		this.mode = mode;
		this.parent = parent;
		this.status = status;
	}
	configure(sensor) {
		this.parent = sensor;
		return sendConfigurationMessage(this.node, this.parent);
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
	setSwitch(order) {
		const object = { ...this, order };
		const message = new ControlDevice(object);
		return message.message;
	}
	update({ node, type, mode, parent, status }) {
		this.node = node;
		this.type = type;
		this.mode = mode;
		this.parent = parent;
		this.status = status;
	}
	configure(sensor) {
		this.parent = sensor;
		return sendConfigurationMessage(this.node, this.parent);
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

class SwitchSensor extends Sensor {
	constructor({ node, type, mode, children }) {
		super(node, type, mode, children);
	}
	configure(actuator) {
		this.children = actuator;
		return sendConfigurationMessage(this.children, this.node);
	}

	update({ node, type, mode, children }) {
		this.node = node;
		this.type = type;
		this.mode = mode;
		this.children = children;
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
	configure(children) {
		this.children = children;
		return sendConfigurationMessage(this.children, this.node);
	}
	setExpectedTemperature(temperature) {
		this.expectedTemperature = temperature;
	}
	update({ node, type, mode, children }) {
		this.node = node;
		this.type = type;
		this.mode = mode;
		this.children = children;
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
