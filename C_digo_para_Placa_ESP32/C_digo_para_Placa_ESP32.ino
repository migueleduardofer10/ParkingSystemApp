#include <WiFi.h>
#include <PubSubClient.h>
#include <HardwareSerial.h>

// Definir los pines para la comunicación serial con Arduino
#define RXD2 16
#define TXD2 17

// Tus credenciales WiFi
const char* ssid = "Galaxy A12CE2E";
const char* password = "vamoscarajo";

// Dirección del servidor MQTT
const char* mqtt_server = "test.mosquitto.org";

// Crear un cliente WiFi y MQTT
WiFiClient espClient;
PubSubClient client(espClient);

// Definir una instancia de HardwareSerial
HardwareSerial nodemcu(2);

unsigned long lastMsg = 0;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);

    if (client.connect(clientId.c_str())) {
      Serial.println("Connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  nodemcu.begin(9600, SERIAL_8N1, RXD2, TXD2);
  Serial.begin(9600);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
if (now - lastMsg > 100) {
    lastMsg = now;

    if (nodemcu.available()) {
      String cdata = nodemcu.readStringUntil('\n');
      client.publish("parking/sensors", cdata.c_str());
      Serial.println(cdata);
    }
  }
}

