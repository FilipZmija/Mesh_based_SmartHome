//************************************************************
// this is a simple example that uses the painlessMesh library to
// connect to a node on another network. Please see the WIKI on gitlab
// for more details
// https://gitlab.com/painlessMesh/painlessMesh/wikis/bridge-between-mesh-and-another-network
//************************************************************
#include "painlessMesh.h"
#include <WiFiClient.h>
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
  client.print("hello world I am connected");
  Serial.println("Connection on port successful");
}

void loop() {

  mesh.update();
}

void receivedCallback(uint32_t from, String &msg) {
  Serial.printf("bridge: Received from %u msg=%s\n", from, msg.c_str());
  client.printf(msg.c_str());
  // komunikacja z serwerem aka odbieranie
  char c;
  char paczkaClient[200];
  String DoSo;
  //if you are connected and data is available
  if (client.available() > 0) {

    String whatToDo;
    for (int i = 0; i < 3; i = i + 1) {
      if (i == 0) {
        memset(paczkaClient, 0, sizeof(paczkaClient));
      }
      c = client.read();
      paczkaClient[i] = c;
    }
    whatToDo = String(paczkaClient);
    Serial.print(whatToDo);w
  }
}
