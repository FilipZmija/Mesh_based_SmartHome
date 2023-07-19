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

unsigned long currentTime = 0;
unsigned long timeDiff = 0;
unsigned long previousTime = 0;

Scheduler userScheduler;  // to control your personal task
painlessMesh mesh;

// User stub
void sendMessage();  // Prototype so PlatformIO doesn't complain
//Device info

String nodeID = "";
String parentID = "701010689";
String type = "actuator";  // "RTC";
String mode = "light";

bool status = 0;
bool switchState = 0;
double temperature = 0;

//create headers to let know clients what is the request for
//create message for passing data to others
String createMessage(String requestType, String nodeID, String type, String mode, bool status) {
  StaticJsonDocument<200> jsonDoc;
  JsonObject headers = jsonDoc.createNestedObject("headers");
  JsonObject body = jsonDoc.createNestedObject("body");
  headers["type"] = requestType;
  body["node"] = nodeID;
  body["type"] = type;
  body["mode"] = mode;
  body["parent"] = parentID;
  body["status"] = status;
  String jsonString;
  serializeJson(jsonDoc, jsonString);
  return jsonString;
}

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

String data = createMessage("post/info", nodeID, type, mode, status);

Task taskSendMessage(TASK_SECOND * 1, TASK_FOREVER, &sendMessage);

void sendMessage() {
  mesh.sendBroadcast(data);
  taskSendMessage.setInterval(TASK_SECOND * 120);
}

// Needed for painless library
void receivedCallback(uint32_t from, String &msg) {
  StaticJsonDocument<400> jsonDoc;
  DeserializationError error = deserializeJson(jsonDoc, msg.c_str());
  String requestType = jsonDoc["headers"]["type"];

  if (requestType == "post/control") {
    JsonObject body = jsonDoc["body"];
    String jsonString;
    serializeJson(body, jsonString);

    double recivedTemperature = body["temperature"];
    String recivedChildrenID = body["children"];
    String recivedParentType = body["type"];
    String recivedParentMode = body["mode"];
    String recivedParentOrder = body["order"];

    if (nodeID == recivedChildrenID) {
      if (recivedParentMode = "switch") {
        if (recivedParentOrder == "toggle") {
          switchState = !switchState;
        } else if (recivedParentOrder == "off") {
          switchState = false;
        } else if (recivedParentOrder == "on") {
          switchState = true;
        }
      } else if (recivedParentMode = "temperature")
        temperature = recivedTemperature;
    }
  } else if (requestType == "post/devices") {
    String message = createIndentifyMessage("post/indentifyDevice ", nodeID, type, mode, parentID);
    mesh.sendBroadcast(message);
  }

  Serial.println(msg.c_str());
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

  mesh.init(MESH_PREFIX, MESH_PASSWORD, MESH_PORT, WIFI_AP_STA, 6);
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

  if (switchState != status) {
    if (mode == "light") {
      status = switchState;
      digitalWrite(OUT_PIN, status ? HIGH : LOW);
    } else if (mode == "RTC") {
      Serial.println("Not ready to serve this yet!");
    }
    data = createMessage("post/info", nodeID, type, mode, status);
    mesh.sendBroadcast(data);
  }

  mesh.update();
}
