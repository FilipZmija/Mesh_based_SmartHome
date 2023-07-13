/*
  Rui Santos
  Complete project details at https://RandomNerdTutorials.com/esp-mesh-esp32-esp8266-painlessmesh/
  
  This is a simple example that uses the painlessMesh library: https://github.com/gmag11/painlessMesh/blob/master/examples/basic/basic.ino
*/

#include "painlessMesh.h"
#include <Arduino_JSON.h>

#define MESH_PREFIX "MyMesh"
#define MESH_PASSWORD "12345678"
#define MESH_PORT 5555

const int OUT_PIN = 13;

Scheduler userScheduler;  // to control your personal task
painlessMesh mesh;

// User stub
void sendMessage();  // Prototype so PlatformIO doesn't complain

String nodeID = "";
String parentID = "701010689";
String actuatorType = "lightActuator";  // "RTC";
bool status = 0;
bool switchState = 0;
double temperature = 0;

//creating JSON object
String getReadings(String nodeID, bool status) {
  JSONVar jsonReadings;
  jsonReadings["node"] = nodeID;
  jsonReadings["status"] = status;
  jsonReadings["parent"] = parentID;
  String readings = JSON.stringify(jsonReadings);
  return readings;
};

String data = getReadings(nodeID, temperature);

Task taskSendMessage(TASK_SECOND * 1, TASK_FOREVER, &sendMessage);

void sendMessage() {
  mesh.sendBroadcast(data);
  taskSendMessage.setInterval(TASK_SECOND * 120);
}

// Needed for painless library
void receivedCallback(uint32_t from, String &msg) {
  JSONVar myObject = JSON.parse(msg.c_str());
  bool recivedSwitchState = myObject["switch"];
  double recivedTemperature = myObject["temperature"];
  String recivedParentID = myObject["node"];
  String recivedSensorType = myObject["sensorType"];

  if (parentID == recivedParentID) {
    if (recivedSensorType = "switchSensor") {
      switchState = recivedSwitchState;
    } else if (recivedSensorType = "temperatureSensor")
      temperature = recivedTemperature;
  }
Serial.printf(msg.c_str());

}



void newConnectionCallback(uint32_t nodeId) {
  Serial.printf("--> startHere: New Connection, nodeId = %u\n", nodeId);
}

void changedConnectionCallback() {
  Serial.printf("Changed connections\n");
}

void nodeTimeAdjustedCallback(int32_t offset) {
  Serial.printf("Adjusted time %u. Offset = %d\n", mesh.getNodeTime(), offset);
}

void setup() {
  Serial.begin(115200);

  pinMode(OUT_PIN, OUTPUT);
  //mesh.setDebugMsgTypes( ERROR | MESH_STATUS | CONNECTION | SYNC | COMMUNICATION | GENERAL | MSG_TYPES | REMOTE ); // all types on
  mesh.setDebugMsgTypes(ERROR | STARTUP);  // set before init() so that you can see startup messages

  mesh.init(MESH_PREFIX, MESH_PASSWORD, &userScheduler, MESH_PORT);
  mesh.onReceive(&receivedCallback);
  mesh.onNewConnection(&newConnectionCallback);
  mesh.onChangedConnections(&changedConnectionCallback);
  mesh.onNodeTimeAdjusted(&nodeTimeAdjustedCallback);
  nodeID = String(mesh.getNodeId());
  userScheduler.addTask(taskSendMessage);
  taskSendMessage.enable();
}

void loop() {

  if (switchState != status) {
    if (actuatorType == "lightActuator") {
      status = switchState;
      digitalWrite(OUT_PIN, status ? HIGH : LOW);
    } else if (actuatorType == "RTC") {
      Serial.println("Not ready to serve this yet!");
    }
    data = getReadings(nodeID, status);
  mesh.sendBroadcast(data);
  }

mesh.update();
  
}
