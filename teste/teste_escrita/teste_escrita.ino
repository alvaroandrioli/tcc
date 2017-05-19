#include <MsTimer2.h>
#include <Servo.h>

#define ARFAGEM_PIN 10
#define GUINADA_PIN 11
Servo guinada;
Servo arfagem;
int arfagemC = 0;
int guinadaC = 0;
boolean shut = false;

void setup() {
  MsTimer2::set(20, readSensor); //10 mili segundos
  MsTimer2::start();
   
  arfagem.attach(ARFAGEM_PIN);
  guinada.attach(GUINADA_PIN);

//  pinMode(ARFAGEM_LED, OUTPUT);
//  pinMode(GUINADA_LED, OUTPUT);

//  analogWrite(ARFAGEM_LED, 0);
//  analogWrite(GUINADA_LED, 0);
  
  Serial.begin(115200);
}

void readSensor() {
  int arfagem_sp = analogRead(A5);
  int guinada_sp = arfagem_sp;
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

  arfagem.write(arfagemC);
  guinada.write(guinadaC);
}

void clearBuffer(char *vet) {
  for (int i = 0; i < 4; i++) {
    vet[i] = '\0'; 
  }
}

