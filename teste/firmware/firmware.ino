#include <MsTimer2.h>
#include <Servo.h>

#define LED 13
#define PIN_ARFAGEM 9
#define PIN_guinada 10
#define ARFAGEM_SP A0
#define GUINADA_SP A1
#define ARFAGEM_SENSOR A2
#define GUINADA_SENSOR A3

Servo arfagem;
Servo guinada;

void setup() {
  MsTimer2::set(10, readSensor); //10 mili segundos
  MsTimer2::start();

  arfagem.attach(PIN_ARFAGEM);
  guinada.attach(PIN_guinada);
  
  pinMode(LED, OUTPUT);
  
  Serial.begin(115200);
}

void readSensor() {
  int arfagem_sp = analogRead(ARFAGEM_SP);
  int GUINADA_SP = analogRead(GUINADA_SP);
  int arfagem_sensor = analogRead(ARFAGEM_SENSOR);
  int GUINADA_SENSOR = analogRead(GUINADA_SENSOR);

  String serialValue = String(arfagem_sp);
  serialValue.concat(',');
  serialValue.concat(GUINADA_SP);
  serialValue.concat(',');
  serialValue.concat(arfagem_sensor);
  serialValue.concat(',');
  serialValue.concat(GUINADA_SENSOR);
  
  Serial.println(serialValue);
}

void serialEvent() {
  if (Serial.available()) {
    String serialRead = Serial.readString();

    int arfagemS = serialRead.substring(0, serialRead.indexOf(',')).toInt();
    int guinadaS = serialRead.substring(serialRead.indexOf(',') + 1).toInt();

    arfagem.write(map(arfagemS, 0, 1023, 0, 180));
    guinada.write(map(guinadaS, 0, 1023, 0, 180));
  }
}

void loop() {
  
}
