#include <SoftwareSerial.h>
#include <Servo.h>

Servo myservo1;  // create servo object to control a servo
Servo myservo2;

SoftwareSerial nodemcu(2,3); // RX, TX

int parking1_slot1_ir_s = 5; // parking slot1 infrared sensor connected with pin number 4 of arduino
int parking1_slot2_ir_s = 6;
int parking1_slot3_ir_s = 7;

int parking2_slot1_ir_s = 8;
int parking2_slot2_ir_s = 9;
int parking2_slot3_ir_s = 12;

bool prevExitGateState = HIGH;
bool prevEntranceGateState = HIGH;
/*
int parking1_slot1_ir_s = 12; // parking slot1 infrared sensor connected with pin number 4 of arduino
int parking1_slot2_ir_s = 5;
int parking1_slot3_ir_s = 6;

int parking2_slot1_ir_s = 7;
int parking2_slot2_ir_s = 8;
int parking2_slot3_ir_s = 9;
*/
int entrance_gate = 11;
int exit_gate = 4;

int pos1 = 90;    // variable to store the servo position(entrance gate)
int pos2 = 0;    // exit gate

String sensor1, sensor2, sensor3, sensor4, sensor5, sensor6;
String cdata = ""; // complete data, consisting of sensors values

int occupiedSlots = 0; // Contador para los espacios de estacionamiento ocupados

void setup()
{
Serial.begin(9600); 
nodemcu.begin(9600);

pinMode(parking1_slot1_ir_s, INPUT);
pinMode(parking1_slot2_ir_s, INPUT);
pinMode(parking1_slot3_ir_s, INPUT);

pinMode(parking2_slot1_ir_s, INPUT);
pinMode(parking2_slot2_ir_s, INPUT);
pinMode(parking2_slot3_ir_s, INPUT);

pinMode(entrance_gate, INPUT);
pinMode(exit_gate, INPUT);

myservo1.attach(13);  // attaches the servo on pin 9 to the servo object
myservo2.attach(3);


}

void loop()
{
  occupiedSlots = 0; // Reiniciar el contador en cada ciclo del loop

p1slot1(); 
p1slot2();
p1slot3(); 

p2slot1();
p2slot2();
p2slot3();

  checkParkingStatus(); // Verificar el estado del estacionamiento

gates();

//conditions();

  
   // Construir el mensaje solo si todos los sensores tienen un estado definido
  if (sensor1 != "" && sensor2 != "" && sensor3 != "" && sensor4 != "" && sensor5 != "" && sensor6 != "") {
    cdata = sensor1 + "," + sensor2 + "," + sensor3 + "," + sensor4 + "," + sensor5 + "," + sensor6;
    Serial.println(cdata);
    nodemcu.println(cdata);
    cdata = ""; // Limpiar el mensaje después de enviarlo
  }
   
digitalWrite(parking1_slot1_ir_s, HIGH); 
digitalWrite(parking1_slot2_ir_s, HIGH); 
digitalWrite(parking1_slot3_ir_s, HIGH);

digitalWrite(parking2_slot1_ir_s, HIGH);
digitalWrite(parking2_slot2_ir_s, HIGH);
digitalWrite(parking2_slot3_ir_s, HIGH);

digitalWrite(entrance_gate, HIGH);
digitalWrite(exit_gate, HIGH);


}


void p1slot1() // parkng 1 slot1
{
  if( digitalRead(parking1_slot1_ir_s) == LOW) 
  {
  sensor1 = "255";
  } 
if( digitalRead(parking1_slot1_ir_s) == HIGH)
{
  sensor1 = "0";  
}
  Serial.println("Soy el sensor1 "+sensor1);

}

void p1slot2() // parking 1 slot2
{
  if( digitalRead(parking1_slot2_ir_s) == LOW) 
  {
  sensor2 = "255"; 
  }
if( digitalRead(parking1_slot2_ir_s) == HIGH)  
  {
  sensor2 = "0";  
  }
    Serial.println("Soy el sensor2 "+sensor2);
 
}


void p1slot3() // parking 1 slot3
{
  if( digitalRead(parking1_slot3_ir_s) == LOW) 
  {
  sensor3 = "255"; 
  }
if( digitalRead(parking1_slot3_ir_s) == HIGH)  
  {
  sensor3 = "0";  
  } 
    Serial.println("Soy el sensor3 "+sensor3);

}


// now for parking 2

void p2slot1() // parking 1 slot3
{
  if( digitalRead(parking2_slot1_ir_s) == LOW) 
  {
  sensor4 = "255"; 
  }
if( digitalRead(parking2_slot1_ir_s) == HIGH)  
  {
  sensor4 = "0";  
  } 
    Serial.println("Soy el sensor4 "+sensor4);
}


void p2slot2() // parking 1 slot3
{
  if( digitalRead(parking2_slot2_ir_s) == LOW) 
  {
  sensor5 = "255"; 
  }
if( digitalRead(parking2_slot2_ir_s) == HIGH)  
  {
  sensor5 = "0";  
  } 
  Serial.println("Soy el sensor5 "+sensor5);

}


void p2slot3() // parking 1 slot3
{
  if( digitalRead(parking2_slot3_ir_s) == LOW) 
  {
  sensor6 = "255"; 
  }
if( digitalRead(parking2_slot3_ir_s) == HIGH)  
  {
  sensor6 = "0";  
  } 
   Serial.println("Soy el sensor6 "+sensor6);

}

void checkParkingStatus() {
  // Incrementar el contador por cada espacio ocupado
  if (sensor1 == "255") occupiedSlots++;
  if (sensor2 == "255") occupiedSlots++;
  if (sensor3 == "255") occupiedSlots++;
  if (sensor4 == "255") occupiedSlots++;
  if (sensor5 == "255") occupiedSlots++;
  if (sensor6 == "255") occupiedSlots++;

  // Si todos los espacios están ocupados, mostrar mensaje y no abrir el portón de salida
  if (occupiedSlots == 6) {
    Serial.println("Estacionamiento totalmente ocupado");
  }
}

// Función para controlar los portones
void gates() {
  bool currentExitGateState = digitalRead(exit_gate);
  bool currentEntranceGateState = digitalRead(entrance_gate);

  // Control del portón de salida
  if (currentExitGateState == LOW && prevExitGateState == HIGH) {
    // Abre el portón de salida
    for (pos2 = 0; pos2 <= 90; pos2 += 1) {
      myservo2.write(pos2);
      delay(15);
    }
    delay(1000); // Espera con el portón abierto
    // Cierra el portón de salida
    for (pos2 = 90; pos2 >= 0; pos2 -= 1) {
      myservo2.write(pos2);
      delay(15);
    }
  }

  // Control del portón de entrada
  if (currentEntranceGateState == LOW && prevEntranceGateState == HIGH && occupiedSlots < 6) {
    // Abre el portón de entrada
    for (pos1 = 90; pos1 >= 0; pos1 -= 1) {
      myservo1.write(pos1);
      delay(15);
    }
    delay(1000); // Espera con el portón abierto
    // Cierra el portón de entrada
    for (pos1 = 0; pos1 <= 90; pos1 += 1) {
      myservo1.write(pos1);
      delay(15);
    }
  }

  // Actualización del estado anterior de los sensores
  prevExitGateState = currentExitGateState;
  prevEntranceGateState = currentEntranceGateState;
}

