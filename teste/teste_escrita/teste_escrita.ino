#define LED 10

#include <MsTimer2.h>

void setup() {
  MsTimer2::set(40, readSensor); //10 mili segundos
  MsTimer2::start();

  randomSeed(analogRead(A0));
   
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
}

void readSensor() {
  int arfagem_sp = analogRead(A5);
  int rolagem_sp = random(0,1023);
  int arfagem_sensor = random(0,1023);
  int rolagem_sensor = random(0,1023);

  String serialValue = String(arfagem_sp);
  serialValue.concat(',');
  serialValue.concat(arfagem_sensor);
  serialValue.concat(',');
  serialValue.concat(rolagem_sp);
  serialValue.concat(',');
  serialValue.concat(rolagem_sensor);
  
  Serial.println(serialValue);
}

void loop() {
  if (Serial.available()) {
    char r = (char)Serial.read();

    if (r == 'l') {
      digitalWrite(LED, 1);
    }

    if (r == 'd') {
      digitalWrite(LED, 0);
    }
  }
}
