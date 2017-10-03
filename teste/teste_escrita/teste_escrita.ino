#include <MsTimer2.h>


#define LEFT_ROTOR_PIN 10
#define RIGHT_ROTOR_PIN 6
#define ROLL_SP A0
#define BASE_ROTATION 200

int leftC = 0;
int rightC = 0;

float kalRoll = 0;

boolean shut = false;

void setup() {
  pinMode(LEFT_ROTOR_PIN, OUTPUT);
  pinMode(RIGHT_ROTOR_PIN, OUTPUT);
  MsTimer2::set(40, readSensor); //20 mili segundos
  MsTimer2::start();
  Serial.begin(115200);

}

void readSensor() {
  if (!shut) {
    int roll_sp = analogRead(ROLL_SP);
    String serialValue = String(roll_sp);
    
    serialValue.concat(',');
    serialValue.concat(650);
    
    Serial.println(serialValue);
  }
}

void loop() {
  char buf[5];
  int index = 0;
  int rollC = 0;
  boolean test = false;
  while (Serial.available() && !shut) {
    
    char cRead = (char)Serial.read();

    if (cRead == 'e') {
       analogWrite(RIGHT_ROTOR_PIN, 0);
       analogWrite(LEFT_ROTOR_PIN, 0);
      
      delay(2);
      
      while(Serial.available()){
        char ignore = Serial.read();
      }
      
      shut = true;
      
      break;
    }

    if (cRead == '\n') {
      rollC = atoi(buf);
      clearBuffer(buf);
      test = true;
      break;
    }
    
    buf[index] = cRead;
    index++;
    delayMicroseconds(100);
  }

  if (test) {
    rollC = map(rollC, -1023, 1023, -255, 255);
    
    if (rollC == 0) {
      analogWrite(RIGHT_ROTOR_PIN, 0);
      analogWrite(LEFT_ROTOR_PIN, 0);
    }
    if (rollC > 0) {
       analogWrite(RIGHT_ROTOR_PIN, rollC);
    }  
    if (rollC < 0) {
       analogWrite(LEFT_ROTOR_PIN, (-1 * rollC));
    }

    test = false;
 }
  
}

void clearBuffer(char *vet) {
  for (int i = 0; i < 4; i++) {
    vet[i] = '\0'; 
  }
}

