/*
  Rui Santos
  Complete project details at https://RandomNerdTutorials.com/esp-mesh-esp32-esp8266-painlessmesh/
  
  This is a simple example that uses the painlessMesh library: https://github.com/gmag11/painlessMesh/blob/master/examples/basic/basic.ino
*/

#include "painlessMesh.h"
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Arduino_JSON.h>

#define MESH_PREFIX "MyMesh"
#define MESH_PASSWORD "12345678"
#define MESH_PORT 5555

const int TEMP_PIN = 13;

unsigned long currentTime = 0;
unsigned long timeDiff = 0;
unsigned long previousTime = 0;

OneWire oneWire(TEMP_PIN);
DallasTemperature sensors(&oneWire);

Scheduler userScheduler;  // to control your personal task
painlessMesh mesh;

// User stub
void sendMessage();  // Prototype so PlatformIO doesn't complain

//creating JSON object
String getReadings(String nodeID, String childrenID, float temperature) {
  JSONVar jsonReadings;
  jsonReadings["node"] = nodeID;
  jsonReadings["temperature"] = temperature;
  jsonReadings["children"] = childrenID;
  String readings = JSON.stringify(jsonReadings);
  return readings;
};

String nodeID = "";
String childrenID = "2808636797";
float temperature = 0;

String data = getReadings(nodeID, childrenID, temperature);

Task taskSendMessage(TASK_SECOND * 1, TASK_FOREVER, &sendMessage);

void sendMessage() {
  mesh.sendBroadcast(data);
  taskSendMessage.setInterval(TASK_SECOND * 30);
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
  Serial.begin(115200);
  sensors.begin();
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
  currentTime = millis();
  timeDiff = currentTime - previousTime;

  if (timeDiff >= 10000UL) {
      Serial.printf("Running\n");
    sensors.requestTemperatures();
    const float recivedTemperature = round(sensors.getTempCByIndex(0));
    if (recivedTemperature != temperature) {
      temperature = recivedTemperature;
      data = getReadings(nodeID, childrenID, temperature);
      mesh.sendBroadcast(data);
    }
    previousTime = currentTime;
  }
  mesh.update();
}