import React from "react";

class ConfigureDevices extends React.Component {
	state = {
		configDevice: "",
		linkDevice: "",
	};

	handleConfigDeviceChange = (e) => {
		this.setState({ configDevice: e.target.value });
	};

	handleLinkDeviceChange = (e) => {
		this.setState({ linkDevice: e.target.value });
	};

	handleLinkDevices = () => {
		const { configDevice, linkDevice } = this.state;
		// Implement the logic to link the devices here
		console.log(`Linking ${configDevice} with ${linkDevice}...`);
	};

	render() {
		const { devices } = this.props;
		const { configDevice, linkDevice } = this.state;

		return (
			<section id='configure'>
				<h2>Configure Devices</h2>
				<p>Select a device to configure:</p>
				<select
					value={configDevice}
					onChange={this.handleConfigDeviceChange}
				>
					<option value=''>Select a device</option>
					{devices.map((device, index) => (
						<option key={index} value={device}>
							{device}
						</option>
					))}
				</select>

				<p>Link with another device:</p>
				<select value={linkDevice} onChange={this.handleLinkDeviceChange}>
					<option value=''>Select a device</option>
					{devices.map((device, index) => (
						<option key={index} value={device}>
							{device}
						</option>
					))}
				</select>

				<button onClick={this.handleLinkDevices}>Link Devices</button>
			</section>
		);
	}
}

export default ConfigureDevices;
