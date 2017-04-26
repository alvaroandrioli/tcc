#include <MsTimer2.h>
#include <Servo.h>

#define LED 13
#define PIN_ARFAGEM 9
#define PIN_ROLAGEM 10
#define ARFAGEM_SP A0
#define ROLAGEM_SP A1
#define ARFAGEM_SENSOR A2
#define ROLAGEM_SENSOR A3

Servo arfagem;
Servo rolagem;

void setup() {
  MsTimer2::set(10, readSensor); //10 mili segundos
  MsTimer2::start();

  arfagem.attach(PIN_ARFAGEM);
  rolagem.attach(PIN_ROLAGEM);
  
  pinMode(LED, OUTPUT);
  
  Serial.begin(115200);
}

void readSensor() {
  int arfagem_sp = analogRead(ARFAGEM_SP);
  int rolagem_sp = analogRead(ROLAGEM_SP);
  int arfagem_sensor = analogRead(ARFAGEM_SENSOR);
  int rolagem_sensor = analogRead(ROLAGEM_SENSOR);

  String serialValue = String(arfagem_sp);
  serialValue.concat(',');
  serialValue.concat(rolagem_sp);
  serialValue.concat(',');
  serialValue.concat(arfagem_sensor);
  serialValue.concat(',');
  serialValue.concat(rolagem_sensor);
  
  Serial.println(serialValue);
}

void serialEvent() {
  if (Serial.available()) {
    String serialRead = Serial.readString();

    int arfagemS = serialRead.substring(0, serialRead.indexOf(',')).toInt();
    int rolagemS = serialRead.substring(serialRead.indexOf(',') + 1).toInt();

    arfagem.write(map(arfagemS, 0, 1023, 0, 180));
    rolagem.write(map(rolagemS, 0, 1023, 0, 180));
  }
}

void loop() {
  
}
