// DeviceList.js
import React from "react";
import "./MobileDeviceList.css"; // Import your CSS file
import Switch from "@mui/material/Switch";
const MobileDeviceList = ({ devices }) => {
	console.log(devices);
	return (
		<div className='deviceee-list'>
			<h2>Devices in smart home</h2>
			<ul>
				{devices.map((device) => (
					<li key={device.id}>
						<div className='deviceee'>
							<div>
								<h3>
									{device.mode[0].toUpperCase() +
										device.mode.slice(1) +
										" " +
										device.type}
								</h3>
								<p>Status: {"on"}</p>
							</div>

							<div className='temp'>
								<div className='tempp'>
									{device.mode === "heating" && "Temperature: 23°C"}
									<div className='temppp'>
										{device.mode === "heating" && (
											<>
												<button>+</button>
												27°C
												<button>-</button>
											</>
										)}
									</div>
								</div>

								{device.mode === "light" && (
									<Switch checked={device.status} />
								)}
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default MobileDeviceList;
