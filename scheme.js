const socket = io("http://127.0.0.1:8090");

socket.on("devices", (data) => {
	console.log(data);
});
