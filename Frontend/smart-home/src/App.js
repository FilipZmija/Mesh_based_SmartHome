import React, { useEffect, useState } from "react";
import Dev from "./Dev";
import Line from "./Line";
import DeviceList from "./DeviceList";
import "./App.css"; // Make sure to have appropriate CSS file

const devicesData = [
	{ id: 1, type: "Light", icon: "💡" },
	{ id: 2, type: "Thermostat", icon: "🌡️" },
	{ id: 3, type: "AC", icon: "📷" },
	{ id: 4, type: "Speaker", icon: "🔊" },
	// Add more devices as needed
];

const App = () => {
	const [connections, setConnections] = useState([]);
	const [selectedDevices, setSelectedDevices] = useState([]);
	const [devices, setDevices] = useState([]);
	const [availableDevices, setAvailableDevices] = useState(devicesData);

	const handleAddDevice = (device) => {
		setDevices((prevDevices) => [
			...prevDevices,
			{
				...device,
				divPos: { x: 0, y: 0 },
				id: Date.now(),
				isSelected: false,
			},
		]);

		setAvailableDevices((prevDevices) =>
			prevDevices.filter((d) => d.id !== device.id)
		);
	};
	console.log(connections);
	const selectDevice = (device) => {
		if (selectedDevices?.length === 2)
			selectedDevices.splice(0, selectedDevices.length);
		console.log(device);
		if (selectedDevices?.length < 2) {
			selectedDevices.push(device);
			setDevices((prev) => {
				console.log(prev);
				const index = prev.findIndex((dev) => dev.id === device.id);
				prev[index].isSelected = true;
				return [...prev];
			});
		}
		if (selectedDevices?.length === 2) {
			console.log(selectedDevices);
			setConnections((prev) => [
				...prev,
				{
					parent: selectedDevices[0].id,
					child: selectedDevices[1].id,
				},
			]);
			const index1 = devices.findIndex(
				(dev) => dev.id === selectedDevices[0].id
			);

			const index2 = devices.findIndex(
				(dev) => dev.id === selectedDevices[1].id
			);
			console.log(index1, index2);
			devices[index1].isSelected = false;
			devices[index2].isSelected = false;
		}
	};
	console.log(connections);
	return (
		<>
			<div className='floor-plan'>
				{devices.length > 0 &&
					devices?.map((device, index) => {
						console.log(device);
						return (
							<>
								<Dev
									selectDevice={selectDevice}
									device={device}
									id={index}
									setDevices={setDevices}
								/>
							</>
						);
					})}
				{devices.length > 1 &&
					connections?.map((connection) => {
						const index1 = devices.findIndex(
							(dev) => dev.id === connection.child
						);

						const index2 = devices.findIndex(
							(dev) => dev.id === connection.parent
						);
						console.log(index1, index2);

						const div1Pos = devices[index1].divPos;
						const div2Pos = devices[index2].divPos;

						return (
							<Line
								devices={devices}
								div1Pos={div1Pos}
								div2Pos={div2Pos}
							/>
						);
					})}
			</div>
			<DeviceList
				availableDevices={availableDevices}
				onAddDevice={handleAddDevice}
			/>
		</>
	);
};

export default App;
