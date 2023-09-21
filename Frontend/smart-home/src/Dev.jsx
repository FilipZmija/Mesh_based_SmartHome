import React, { useState } from "react";
import Draggable from "react-draggable";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:8090");
const Dev = (props) => {
	const [isDragging, setDragging] = useState(false);
	const handleClick = () => {
		if (isDragging === true) {
			return;
		}
		const array = props.selectDevice(props.device);
		socket.emit("setSelected", props.device);

		props.handleDeviceClick(props.device, props.id);
		props.setSelectedDevices(array);
	};

	return (
		<>
			<Draggable
				position={props.device.divPos}
				onStart={() => setTimeout(() => setDragging(true), 100)}
				onDrag={(e, data) =>
					props.setDevices((prev) => {
						const array = [...prev];
						array[props.id].divPos.x = data.x;
						array[props.id].divPos.y = data.y;
						return array;
					})
				}
				onStop={() =>
					setTimeout(() => {
						setDragging(false);
						socket.emit("moveAround", props.device);
					}, 500)
				}
			>
				<div
					className={`device ${props.device.isSelected ? "selected" : ""}`}
					onClick={() => handleClick(isDragging)}
				>
					{props.device.icon}
					{props.device.mode !== "switch" ? (
						<div>{props.device.mode === "light" ? "💡" : "🌡️"}</div>
					) : (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='16'
							height='16'
							fill='currentColor'
							class='bi bi-power'
							viewBox='0 0 16 16'
						>
							<path d='M7.5 1v7h1V1h-1z' />
							<path d='M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z' />
						</svg>
					)}
				</div>
			</Draggable>
		</>
	);
};
export default Dev;
