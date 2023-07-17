const net = require("net");
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});

const tcpGuests = [];

//tcp socket server
net.createServer(function (socket) {
	console.log("Arduino server running on port 1337");
	console.log("Web server running on http://localhost:8090");
	socket.on("data", function (data) {
		console.log("received on tcp socket:" + data);
		setTimeout(
			() =>
				readline.question("Who are you?", (yes) => {
					yes
						? socket.write(
								`{"node":"701010689","sensorType":"switchSensor","switch":${yes},"children":"2808636797"}`
						  )
						: console.log("nah");
					// readline.close();
				}),
			2000
		);
	});
	socket.on("end", function () {
		console.log("end");
	});
	socket.on("close", function () {
		console.log("close");
	});
	socket.on("error", function (e) {
		console.log("error ", e);
	});
}).listen(1234);
