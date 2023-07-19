/*
  Rui Santos
  Complete project details at https://RandomNerdTutorials.com/esp-mesh-esp32-esp8266-painlessmesh/
  
  This is a simple example that uses the painlessMesh library: https://github.com/gmag11/painlessMesh/blob/master/examples/basic/basic.ino
*/

#include "painlessMesh.h"
#include <Arduino_JSON.h>
#include <WiFi.h>

#define MESH_PREFIX "MyMesh"
#define MESH_PASSWORD "12345678"
#define MESH_PORT 5555

const char* ssid = "Airbox-011B";
const char* password = "92443498";

IPAddress server(10, 101, 125, 3);

const int BUTTON_PIN = 13;

Scheduler userScheduler;  // to control your personal task
painlessMesh mesh;
bool buttonState;
bool prevButtonState;
bool toggleState = 0;
WiFiClient client;

//Device info
String nodeID = "";
String childrenID = "2808636797";
String type = "sensor";
String mode = "switch";
String order = "off";
String requestType = "post/control";
//creating JSON object

String createIndentifyMessage(String requestType, String nodeID, String type, String mode, String parentID) {
  StaticJsonDocument<200> jsonDoc;
  JsonObject headers = jsonDoc.createNestedObject("headers");
  JsonObject body = jsonDoc.createNestedObject("body");
  headers["type"] = requestType;
  body["node"] = nodeID;
  body["type"] = type;
  body["mode"] = mode;
  body["parent"] = parentID;
  String jsonString;
  serializeJson(jsonDoc, jsonString);
  return jsonString;
}

String createMessage(String nodeID, String order, String requestType) {

  StaticJsonDocument<200> jsonDoc;
  JsonObject headers = jsonDoc.createNestedObject("headers");
  JsonObject body = jsonDoc.createNestedObject("body");
  headers["type"] = requestType;
  body["node"] = nodeID;
  body["type"] = type;
  body["mode"] = mode;
  body["children"] = childrenID;
  body["order"] = order;
  String jsonString;
  serializeJson(jsonDoc, jsonString);
  return jsonString;
}

String data = createMessage(nodeID, order, requestType);



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
void receivedCallback(uint32_t from, String& msg) {
  StaticJsonDocument<400> jsonDoc;
  DeserializationError error = deserializeJson(jsonDoc, msg.c_str());
  String requestType = jsonDoc["headers"]["type"];

  if (requestType == "post/devices") {
    String message = createIndentifyMessage("post/indentifyDevice ", nodeID, type, mode, childrenID);
    mesh.sendBroadcast(message);
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

  // Connect to your local Wi-Fi network
  delay(1000);

  // WiFi.mode(WIFI_STA);  //Optional
  // WiFi.begin(ssid, password);
  // Serial.println("\nConnecting");

  // while (WiFi.status() != WL_CONNECTED) {
  //   Serial.print(".");
  //   delay(100);
  // }

  // Serial.println("\nConnected to the WiFi network");
  // Serial.print("Local ESP32 IP: ");
  // Serial.println(WiFi.localIP());





  pinMode(BUTTON_PIN, INPUT);
  //mesh.setDebugMsgTypes( ERROR | MESH_STATUS | CONNECTION | SYNC | COMMUNICATION | GENERAL | MSG_TYPES | REMOTE ); // all types on
  mesh.setDebugMsgTypes(ERROR | STARTUP);  // set before init() so that you can see startup messages

  mesh.init(MESH_PREFIX, MESH_PASSWORD, MESH_PORT, WIFI_AP_STA, 6);



  //passed fnc to mesh
  mesh.onReceive(&receivedCallback);
  mesh.onNewConnection(&newConnectionCallback);
  mesh.onChangedConnections(&changedConnectionCallback);
  mesh.onNodeTimeAdjusted(&nodeTimeAdjustedCallback);
  nodeID = String(mesh.getNodeId());

  userScheduler.addTask(taskSendMessage);
  mesh.setContainsRoot(true);
  taskSendMessage.enable();
}


void loop() {
  // client.print("hello here");
  // it will run the user scheduler as well
  const bool newToggle = toggle(toggleState);
  if (newToggle != toggleState) {
    order = "toggle";
    String msg = "You toggled button to state = ";
    msg += newToggle;

    data = createMessage(nodeID, order, requestType);
    mesh.sendBroadcast(data);
  }
  mesh.update();
}