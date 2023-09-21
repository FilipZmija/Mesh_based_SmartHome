import React from "react";
import "./DeviceList.css";

const DeviceList = ({ availableDevices, onAddDevice }) => {
	return (
		<div className='device-list'>
			<h2>Available Devices</h2>
			{availableDevices.length ? (
				<ul>
					{availableDevices.map((device) => (
						<li key={device.node} onClick={() => onAddDevice(device)}>
							{device.mode[0].toUpperCase() +
								device.mode.slice(1) +
								" " +
								device.type +
								" "}
						</li>
					))}
				</ul>
			) : (
				<div style={{ textAlign: "center" }}>
					No devices found, please turn on a device
				</div>
			)}
		</div>
	);
};

export default DeviceList;
