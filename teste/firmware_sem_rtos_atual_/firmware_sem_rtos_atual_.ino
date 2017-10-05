#include <Servo.h>

#define LEFT_ROTOR_PIN 6
#define RIGHT_ROTOR_PIN 10
#define ROLL_SP A0
#define ROLL_SENSOR A2
#define BASE_ROTATION 50

unsigned long mTime;

Servo left;
Servo right;

char buf[15];
int index = 0;
int rollC = 0;
boolean assingControl = false;

void setup() {
  Serial.begin(115200);
  right.attach(RIGHT_ROTOR_PIN);
  left.attach(LEFT_ROTOR_PIN);
      
  right.write(40);
  left.write(40);
  delay(2000);
}

void readSensor() {
 
  int roll_sp = analogRead(ROLL_SP);
  int roll_sensor = analogRead(ROLL_SENSOR);

  Serial.print(roll_sp);
  Serial.print(',');
  Serial.println(lowPass(normalizeSensor(round(map(roll_sensor, 40, 623, 0, 1024)))));
}

void loop() {   
  mTime = micros();
  
  while (Serial.available()) {
    char cRead = (char)Serial.read();
    
    if (cRead == 'e') {
      rollC = 0;
      
      delay(2);
      Serial.println("DESLIGANDO");
      delayMicroseconds(2000);
      
      while(Serial.available()) {
        char ignore = Serial.read();
      }
      
      exit(0);
      break;
    }

    if (cRead == '\n') {
      rollC = atoi(buf);
      clearBuffer();
      assingControl = true;
      index=0;
      break;
    }
      
    buf[index] = cRead;
    index++;
    delayMicroseconds(1000);
  }
  
  if (assingControl) {
    if (rollC == 0) {
        left.write(BASE_ROTATION);
        right.write(BASE_ROTATION);
    }
    if (rollC > 0) {
        left.write(map(BASE_ROTATION, 0, 1023, BASE_ROTATION, 60));
        right.write(map(rollC, 0, 1023, BASE_ROTATION, 60));
    } 
    if (rollC < 0) {
        left.write(map((-1 * rollC), 0, 1023, BASE_ROTATION, 60));
        right.write(map(BASE_ROTATION, 0, 1023, BASE_ROTATION, 60));
    }
    assingControl = false;
  }

  readSensor();

  //Serial.println((micros() - mTime));
  if ((micros() - mTime) < 20000)
    delayMicroseconds(20000 - (micros() - mTime));
}

void clearBuffer() {
  for (int i = 0; i < 15; i++) {
    buf[i] = '\0'; 
  }
}

long lowPass(float input) {
  float v[3] = {0, 0, 0}; 

  v[0] = v[1];
  v[1] = v[2];
  v[2] = (1 * input) + (-1 * v[0]) + (-2 * v[1]);

  return (v[0] + v[2]) + 2 * v[1];
}

int normalizeMap(int value) {
  if (value > 60)
    return 60;

  if (value < 0)
    return 0;

  return value;
}

int normalizeSensor(int value) {
  if (value > 1023)
    return 1023;

  if (value < 0)
    return 0;

  return value;
}

