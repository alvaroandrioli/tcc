#include <MsTimer2.h>
#include <Servo.h>

#define ARFAGEM_PIN 6
#define GUINADA_PIN 11
#define ARFAGEM_SP A1
#define GUINADA_SP A0

Servo guinada;
Servo arfagem;
int arfagemC = 0;
int guinadaC = 0;
boolean shut = false;

void setup() {
  MsTimer2::set(40, readSensor); //20 mili segundos
  MsTimer2::start();
   
  arfagem.attach(ARFAGEM_PIN);
  guinada.attach(GUINADA_PIN);
      
  arfagem.write(40);
  guinada.write(40);

  delay(1000);
  
  Serial.begin(115200);
}

void readSensor() {
  int arfagem_sp = analogRead(ARFAGEM_SP);
  int guinada_sp = analogRead(GUINADA_SP);

  int arfagem_sensor = 0;
  int guinada_sensor = 0;

  String serialValue = String(arfagem_sp);
  serialValue.concat(',');
  serialValue.concat(arfagem_sensor);
  serialValue.concat(',');
  serialValue.concat(guinada_sp);
  serialValue.concat(',');
  serialValue.concat(guinada_sensor);
  
  Serial.println(serialValue);
}

void loop() {
  char buf[4];
  int index = 0;
  
  while (Serial.available() && !shut) {
    
    char cRead = (char)Serial.read();

    if (cRead == 'e') {
      arfagemC = 0;
      guinadaC = 0;
      
      delay(3);
      
      while(Serial.available()){
        char ignore = Serial.read();
      }
      shut = true;
      break;
    }
    
    if (cRead == ',') {
      index = 0;
      arfagemC = atoi(buf);
      clearBuffer(buf);
      continue;
    }

    if (cRead == '\n') {
      guinadaC = atoi(buf);
      clearBuffer(buf);
      break;
    }
    
    buf[index] = cRead;
    index++;
    delayMicroseconds(100);
  }

  arfagem.write(map(arfagemC, 0, 1023, 40, 140));
  guinada.write(map(guinadaC, 0, 1023, 40, 140));
}

void clearBuffer(char *vet) {
  for (int i = 0; i < 4; i++) {
    vet[i] = '\0'; 
  }
}

