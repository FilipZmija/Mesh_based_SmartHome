import React from "react";
import { useState } from "react";
import "./DeviceInfoCard.css"; // Make sure to have appropriate CSS styles
import io from "socket.io-client";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

const socket = io("http://127.0.0.1:8090");

const DeviceInfoCard = ({ device, onClose }) => {
	const handleToggle = () => {
		socket.emit("switch", device.node);
	};
	const [temperature, setTemperature] = useState(18);

	const handleTemperatureChange = (event) => {
		setTemperature(event.target.value);
	};
	const handleIconClick = () => {
		handleToggle();
	};

	return (
		device?.isSelected && (
			<div className='device-info-card'>
				<h3>
					{device.mode.slice(0, 1).toUpperCase() +
						device.mode.slice(1) +
						" " +
						device.type.slice(0, 1).toUpperCase() +
						device.type.slice(1)}
				</h3>

				{/* Show additional device information here */}
				{device.type === "actuator" && (
					<div className='toggrrle-container'>
						<div className='icon-container' onClick={handleIconClick}>
							{device?.status ? (
								<LightbulbIcon
									sx={{ fontSize: 80, color: "#ffd700" }}
								/>
							) : (
								<LightbulbOutlinedIcon sx={{ fontSize: 80 }} />
							)}
						</div>
					</div>
				)}
				{device.type === "sensor" && (
					<div className='sensor-container'>
						{/* Display sensor data here */}
						<p>{`Temperature: 23°C`}</p>
						<div>
							<p>{`Select expected temperature`}</p>
							<input
								type='range'
								min={18}
								max={30}
								value={temperature}
								onChange={handleTemperatureChange}
							/>
							<p>Expected temperature: {temperature}°C</p>
						</div>
					</div>
				)}
				<div>Device id: {device.node}</div>
				{device.parent && <div>Parent id: {device.parent}</div>}
				{device.children && <div>Parent id: {device.children}</div>}
			</div>
		)
	);
};

export default DeviceInfoCard;
