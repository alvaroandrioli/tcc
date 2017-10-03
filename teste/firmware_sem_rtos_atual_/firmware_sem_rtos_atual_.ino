#include <Servo.h>
#include <Wire.h>
#include <MPU6050.h>
#include <KalmanFilter.h>

#define LEFT_ROTOR_PIN 3
#define RIGHT_ROTOR_PIN 10
#define ROLL_SP A0
#define BASE_ROTATION 0

MPU6050 mpu;

KalmanFilter kalmanX(0.001, 0.003, 0.03);
unsigned long mTime;

//Servo left;
//Servo right;

int leftC = 0;
int rightC = 0;

float kalRoll = 0;

char buf[15];
int index = 0;
int rollC = 0;
boolean assingControl = false;

void setup() {
  Serial.begin(115200);
  //right.attach(RIGHT_ROTOR_PIN);
  //left.attach(LEFT_ROTOR_PIN);
      
  //right.write(0);
 // left.write(0);
  
  //while(!mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G)) {
    //delay(250);
  //}
    Serial.println("AQUI");
  //mpu.calibrateGyro();
  delay(2000);
}

void readSensor() {
  Vector acc = mpu.readNormalizeAccel();
  Vector gyr = mpu.readNormalizeGyro();
  delayMicroseconds(1000);
  int roll_sp = analogRead(ROLL_SP);
  
  int accRoll  = (atan2(acc.YAxis, acc.ZAxis)*180.0)/M_PI;
  kalRoll = kalmanX.update(accRoll, gyr.XAxis);

  Serial.print(roll_sp);
  Serial.print(',');
  Serial.println(normalizeSensor(round(map(kalRoll, 67, -75, 0, 1024))));
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
        //left.write(normalizeMap(map(BASE_ROTATION, 0, 1023, 40, 60)));
        //right.write(map(BASE_ROTATION, 0, 1023, 40, 60));
    }
    if (rollC > 0) {
        //left.write(map(BASE_ROTATION, 0, 1023, 40, 60));
        //right.write(map(rollC, 0, 1023, 40, 60));
    } 
    if (rollC < 0) {
       // left.write(map((-1 * rollC), 0, 1023, 40, 60));
        //right.write(map(BASE_ROTATION, 0, 1023, 40, 60));
    }
    assingControl = false;
  }

  readSensor();

  //Serial.println((micros() - mTime));
  if ((micros() - mTime) < 40000)
    delayMicroseconds(40000 - (micros() - mTime));
}

void clearBuffer() {
  for (int i = 0; i < 15; i++) {
    buf[i] = '\0'; 
  }
}

//long lowPass(float input) {
//  float v[3] = {0, 0, 0}; 
//
//  v[0] = v[1];
//  v[1] = v[2];
//  v[2] = (1 * input) + (-1 * v[0]) + (-2 * v[1]);
//
//  return (v[0] + v[2]) + 2 * v[1];
//}

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

