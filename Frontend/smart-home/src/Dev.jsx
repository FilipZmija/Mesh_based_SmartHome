import React, { useState } from "react";
import Draggable from "react-draggable";

const Dev = (props) => {
	return (
		<Draggable
			position={props.device.divPos}
			onDrag={(e, data) =>
				props.setDevices((prev) => {
					const array = [...prev];
					array[props.id].divPos.x = data.x;
					array[props.id].divPos.y = data.y;
					return array;
				})
			}
		>
			<div
				className={`device ${props.device.isSelected ? "selected" : ""}`}
				onDoubleClick={() => props.selectDevice(props.device)}
			>
				{props.device.icon}
				<div>{props.device.type}</div>
			</div>
		</Draggable>
	);
};
export default Dev;
