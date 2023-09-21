import React, { useState, useEffect } from "react";
import Dev from "./Dev";
import Line from "./Line";
import DeviceList from "./DeviceList";
import "./App.css"; // Make sure to have appropriate CSS file
import DeviceInfoCard from "./DeviceInfoCard";
import io from "socket.io-client";
import Grid from "@mui/material/Grid";
import NavBar from "./NavBar";
import MobileDeviceList from "./MobileDeviceList";
import Login from "./Login";
const socket = io("http://127.0.0.1:8090");

function App() {
	const [connections, setConnections] = useState([]);
	const [selectedDevices, setSelectedDevices] = useState([]);
	const [devices, setDevices] = useState([]);
	const [availableDevices, setAvailableDevices] = useState([]);

	const [latestClickedDevice, setLatestClickedDevice] = useState(null);

	useEffect(() => {
		// Listen for 'message' events from the server
		socket.on("devices", (data) => {
			console.log(data);
			const { sensors, actuators, connectionsInSystem } = data;
			const setUpDevices = [...sensors, ...actuators].filter((device) => {
				if (device.divPos) return device;
			});
			const notSetUpDevices = [...sensors, ...actuators].filter((device) => {
				if (!device.divPos) return device;
			});
			setAvailableDevices(
				notSetUpDevices.map((device) => {
					return { ...device, id: device.node };
				})
			);
			setDevices(setUpDevices);
			setConnections(connectionsInSystem);
			console.log(setUpDevices, notSetUpDevices);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleDeviceClick = (device, id) => {
		setLatestClickedDevice(id);
	};

	const handleAddDevice = (device) => {
		const newDevice = {
			...device,
			divPos: { x: 0, y: 0 },
			id: Date.now(),
			isSelected: false,
		};
		setDevices((prevDevices) => [...prevDevices, newDevice]);
		setAvailableDevices((prevDevices) =>
			prevDevices.filter((d) => d.id !== device.id)
		);
		console.log(newDevice);

		socket.emit("addToPlan", newDevice);
	};

	const selectDevice = (device) => {
		console.log(selectedDevices);
		if (selectedDevices?.length < 2) {
			if (selectedDevices.find((d) => d.id === device.id)) {
				selectedDevices.pop();
				setDevices((prev) => {
					const index = prev.findIndex((dev) => dev.id === device.id);
					prev[index].isSelected = false;
					return [...prev];
				});
			} else {
				selectedDevices.push(device);
				setDevices((prev) => {
					const index = prev.findIndex((dev) => dev.id === device.id);
					prev[index].isSelected = true;
					return [...prev];
				});
			}
		}

		if (selectedDevices?.length === 2) {
			const actuator = selectedDevices.filter((d) => d.type === "actuator");
			const sensor = selectedDevices.filter((d) => d.type === "sensor");
			setConnections((prev) => {
				console.log(prev);
				const array = [...prev];
				const isConnected = prev.find(
					(connection) =>
						connection.parent === actuator[0].id &&
						connection.children === sensor[0].id
				);
				if (!isConnected) {
					array.push({
						parent: actuator[0].id,
						children: sensor[0].id,
					});
					console.log(actuator[0].node, sensor[0].node);
					console.log(actuator, sensor);
					socket.emit("pair", {
						pairInfo: {
							actuator: actuator[0].node,
							sensor: sensor[0].node,
						},
						connections: array,
					});
				}
				return array;
			});
			const index1 = devices.findIndex(
				(dev) => dev.id === selectedDevices[0].id
			);

			const index2 = devices.findIndex(
				(dev) => dev.id === selectedDevices[1].id
			);
			devices[index1].isSelected = false;
			devices[index2].isSelected = false;
			socket.emit("setSelected", devices[index1]);

			setDevices((prev) => {
				prev[index2].isSelected = true;
				socket.emit("setSelected", prev[index2]);

				return [...prev];
			});
		}
		return () => {
			const array = [...selectedDevices];
			console.log(array);
			if (array?.length === 2) array.splice(0, 1);
			return array;
		};
	};
	console.log(connections);
	return (
		<>
			{false ? (
				<>
					<NavBar />
					<div className='app-container'>
						<Grid container direction='row' justifyContent='center'>
							<Grid item xl={3}>
								<div className='device-info-container'>
									{devices[latestClickedDevice] ? (
										<DeviceInfoCard
											device={devices[latestClickedDevice]}
										/>
									) : (
										<DeviceInfoCard />
									)}
								</div>
							</Grid>
							<Grid item xl={6}>
								<div className='floor-plan-container'>
									<div className='floor-plan'>
										{devices.length > 0 &&
											devices?.map((device, index) => {
												return (
													<>
														<Dev
															selectDevice={selectDevice}
															device={device}
															id={index}
															setDevices={setDevices}
															handleDeviceClick={
																handleDeviceClick
															}
															setSelectedDevices={
																setSelectedDevices
															}
														/>
													</>
												);
											})}
										{devices.length > 1 &&
											connections?.map((connection) => {
												const index1 = devices.findIndex(
													(dev) => dev.id === connection.children
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
								</div>
							</Grid>
							<Grid item xl={3}>
								<div className='device-list-container'>
									<DeviceList
										availableDevices={availableDevices}
										onAddDevice={handleAddDevice}
									/>
								</div>
							</Grid>
						</Grid>
					</div>
				</>
			) : (
				<MobileDeviceList devices={devices} selectDevice={selectDevice} />
			)}
		</>
	);
}

export default App;
