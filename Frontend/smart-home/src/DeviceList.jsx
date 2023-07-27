import React from "react";
import "./DeviceList.css";

const DeviceList = ({ availableDevices, onAddDevice }) => {
	return (
		<div className='device-list'>
			<h2>Available Devices</h2>
			<ul>
				{availableDevices.map((device) => (
					<li key={device.id} onClick={() => onAddDevice(device)}>
						{device.type}
					</li>
				))}
			</ul>
		</div>
	);
};

export default DeviceList;
