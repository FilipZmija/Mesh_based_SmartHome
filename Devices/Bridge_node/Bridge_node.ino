//************************************************************
// this is a simple example that uses the painlessMesh library to
// connect to a node on another network. Please see the WIKI on gitlab
// for more details
// https://gitlab.com/painlessMesh/painlessMesh/wikis/bridge-between-mesh-and-another-network
//************************************************************
#include "painlessMesh.h"
#include <WiFiClient.h>
#include <Arduino_JSON.h>


// Create an immutable list
SimpleList<uint32_t> nodes;

#define MESH_PREFIX "MyMesh"
#define MESH_PASSWORD "12345678"
#define MESH_PORT 5555

#define STATION_SSID "Airbox-011B"
#define STATION_PASSWORD "92443498"
#define STATION_PORT 1234

IPAddress server(192, 168, 1, 187);
IPAddress myIP(0, 0, 0, 0);

WiFiClient client;

// prototypes
void receivedCallback(uint32_t from, String &msg);

painlessMesh mesh;

String createSystemDevicesMessage(String devices) {
  StaticJsonDocument<200> jsonDoc;
  JsonObject headers = jsonDoc.createNestedObject("headers");
  JsonObject body = jsonDoc.createNestedObject("body");
  headers["type"] = "post/devices";
  body["devices"] = devices;
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

void setup() {
  Serial.begin(115200);
  mesh.setDebugMsgTypes(ERROR | STARTUP | CONNECTION);  // set before init() so that you can see startup messages


  // Channel set to 6. Make sure to use the same channel for your mesh and for you other
  // network (STATION_SSID)
  mesh.init(MESH_PREFIX, MESH_PASSWORD, MESH_PORT, WIFI_AP_STA, 6);
  // Setup over the air update support
  mesh.initOTAReceive("bridge");

  mesh.stationManual(STATION_SSID, STATION_PASSWORD);
  // Bridge node, should (in most cases) be a root node. See [the wiki](https://gitlab.com/painlessMesh/painlessMesh/wikis/Possible-challenges-in-mesh-formation) for some background
  mesh.setRoot(true);
  // This node and all other nodes should ideally know the mesh contains a root, so call this on all nodes
  mesh.setContainsRoot(true);


  mesh.onReceive(&receivedCallback);
  while (!client.connected()) {
    mesh.update();
    client.connect(server, 1234);
  }
  Serial.println("Connection on port successful");
}
unsigned long currentTime = 0;
unsigned long timeDiff = 0;
unsigned long previousTime = 0;

void loop() {

  currentTime = millis();
  timeDiff = currentTime - previousTime;
  if (timeDiff >= 60000UL) {
    nodes = mesh.getNodeList();

    String nodesString = String(mesh.getNodeId());
    SimpleList<uint32_t>::iterator node = nodes.begin();
    while (node != nodes.end()) {
      nodesString += ", ";
      char buffer[11];  // Adjust the buffer size as per your requirement
      ultoa(*node, buffer, 10);
      String strNumber(buffer);
      nodesString += strNumber;
      node++;
    }
    String devicesRequest = createSystemDevicesMessage(nodesString);
    mesh.sendBroadcast("#" + devicesRequest);
    String message = "#";
    message += devicesRequest;
    client.print(message);
    previousTime = currentTime;
  }

  // komunikacja z serwerem aka odbieranie
  mesh.update();
  char paczkaClient[200];
  bool dataInBuffer = false;
  String whatToDo;

  //if you are connected and data is available


  while (client.available() > 0) {
    char c = client.read();
    whatToDo += c;
    dataInBuffer = true;
  }

  if (dataInBuffer) {
    Serial.println(whatToDo);
    mesh.sendBroadcast(whatToDo);
    dataInBuffer = false;
  }
}


void receivedCallback(uint32_t from, String &msg) {
  Serial.printf("bridge: Received from %u msg=%s\n", from, msg.c_str());
  String message = "#";
  message += msg.c_str();
  client.print(message);
}
