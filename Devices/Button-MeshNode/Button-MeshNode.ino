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

const int BUTTON_PIN = 13;

Scheduler userScheduler;  // to control your personal task
painlessMesh mesh;
bool buttonState;
bool prevButtonState;

String nodeID = String(mesh.getNodeId());
String childrenID = "2808636797";
String sensorType = "switchSensor";
bool toggleState = 0;
//creating JSON object

String getReadings(String nodeID, bool switchState) {
  JSONVar jsonReadings;
  jsonReadings["node"] = nodeID;
  jsonReadings["sensorType"] = sensorType;
  jsonReadings["switch"] = switchState;
  jsonReadings["children"] = childrenID;
  String readings = JSON.stringify(jsonReadings);
  return readings;
};

String data = getReadings(nodeID, toggleState);



//deboucing toggle
bool toggle(bool toggleState) {
  prevButtonState = buttonState;
  buttonState = digitalRead(BUTTON_PIN);
  if (prevButtonState == HIGH && buttonState == LOW) {
    toggleState = !toggleState;
  }
  return toggleState;
};


// User stub
void sendMessage();  // Prototype so PlatformIO doesn't complain

Task taskSendMessage(TASK_SECOND * 1, TASK_FOREVER, &sendMessage);

void sendMessage() {
  mesh.sendBroadcast(data);
  taskSendMessage.setInterval(TASK_SECOND * 120);
}


// Needed for painless library
void receivedCallback(uint32_t from, String &msg) {
  Serial.printf("startHere: Received from %u msg=%s\n", from, msg.c_str());
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
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT);
  //mesh.setDebugMsgTypes( ERROR | MESH_STATUS | CONNECTION | SYNC | COMMUNICATION | GENERAL | MSG_TYPES | REMOTE ); // all types on
  mesh.setDebugMsgTypes(ERROR | STARTUP);  // set before init() so that you can see startup messages

  mesh.init(MESH_PREFIX, MESH_PASSWORD, &userScheduler, MESH_PORT);
  mesh.onReceive(&receivedCallback);
  mesh.onNewConnection(&newConnectionCallback);
  mesh.onChangedConnections(&changedConnectionCallback);
  mesh.onNodeTimeAdjusted(&nodeTimeAdjustedCallback);
  userScheduler.addTask(taskSendMessage);
  taskSendMessage.enable();
}


void loop() {
  // it will run the user scheduler as well
  const bool newToggle = toggle(toggleState);
  if (newToggle != toggleState) {
    toggleState = newToggle;
    String msg = "You toggled button to state = ";
    msg += newToggle;
    String nodeID = "";
    nodeID += mesh.getNodeId();

    data = getReadings(nodeID, toggleState);

    mesh.sendBroadcast(data);
  }
  mesh.update();
}