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
		this.divPos;
		this.id;
	}
	addToPlan(divPos, isSelected, id) {
		this.divPos = divPos;
		this.isSelected = isSelected;
		this.id = id;
	}
	setSelected(state) {
		this.isSelected = state;
	}
	get properties() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			status: this.status,
			children: this.children,
			divPos: this.divPos,
			isSelected: this.isSelected,
			id: this.id,
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
		this.divPos;
		this.isSelected;
		this.id;
	}
	addToPlan(divPos, isSelected, id) {
		this.divPos = divPos;
		this.isSelected = isSelected;
		this.id = id;
	}
	setSelected(state) {
		this.isSelected = state;
	}
	get properties() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			status: this.status,
			parent: this.parent,
			divPos: this.divPos,
			isSelected: this.isSelected,
			id: this.id,
		};
	}
}

class TemperatureActuator extends Actuator {
	constructor({ node, type, mode, parent, divPos, isSelected, id }) {
		super(node, type, mode, parent, divPos, isSelected, id);
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
	addToPlan(divPos, isSelected, id) {
		this.divPos = divPos;
		this.isSelected = isSelected;
		this.id = id;
	}
	moveAround(divPos) {
		this.divPos = divPos;
	}
	setSelected(state) {
		this.isSelected = state;
	}

	get properties() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			status: this.status,
			parent: this.parent,
			divPos: this.divPos,
			isSelected: this.isSelected,
			id: this.id,
		};
	}
}

class LightActuator extends Actuator {
	constructor({ node, type, mode, parent, status, divPos, isSelected, id }) {
		super(node, type, mode, parent, status, divPos, isSelected, id);
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
	addToPlan(divPos, isSelected, id) {
		this.divPos = divPos;
		this.isSelected = isSelected;
		this.id = id;
	}
	moveAround(divPos) {
		this.divPos = divPos;
	}
	setSelected(state) {
		this.isSelected = state;
	}

	get properties() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			status: this.status,
			parent: this.parent,
			divPos: this.divPos,
			isSelected: this.isSelected,
			id: this.id,
		};
	}
}

class SwitchSensor extends Sensor {
	constructor({ node, type, mode, children, divPos, isSelected, id }) {
		super(node, type, mode, children, divPos, isSelected, id);
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
	addToPlan(divPos, isSelected, id) {
		this.divPos = divPos;
		this.isSelected = isSelected;
		this.id = id;
	}
	moveAround(divPos) {
		this.divPos = divPos;
	}
	setSelected(state) {
		this.isSelected = state;
	}
	get properties() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			status: this.status,
			children: this.children,
			divPos: this.divPos,
			isSelected: this.isSelected,
			id: this.id,
		};
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
		divPos,
		isSelected,
		id,
	}) {
		super(node, type, mode, children, divPos, isSelected, id);
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
	addToPlan(divPos, isSelected, id) {
		this.divPos = divPos;
		this.isSelected = isSelected;
		this.id = id;
	}
	moveAround(divPos) {
		this.divPos = divPos;
	}
	setSelected(state) {
		this.isSelected = state;
	}
	get properties() {
		return {
			node: this.node,
			type: this.type,
			mode: this.mode,
			status: this.status,
			children: this.children,
			divPos: this.divPos,
			isSelected: this.isSelected,
			id: this.id,
		};
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
