#include <MsTimer2.h>
#include <Servo.h>
#include <Wire.h>
#include <MPU6050.h>
#include <KalmanFilter.h>

#define LEFT_ROTOR_PIN 11
#define RIGHT_ROTOR_PIN 6
#define ROLL_SP A1
#define BASE_ROTATION 200

MPU6050 mpu;

KalmanFilter kalmanX(0.001, 0.003, 0.03);
KalmanFilter kalmanY(0.001, 0.003, 0.03);

Servo left;
Servo right;

int leftC = 0;
int rightC = 0;

float kalRoll = 0;

boolean shut = false;

void setup() {
  MsTimer2::set(20, readSensor); //20 mili segundos
  MsTimer2::start();
   
  right.attach(RIGHT_ROTOR_PIN);
  left.attach(LEFT_ROTOR_PIN);
      
  right.write(40);
  left.write(40);
  
  while(!mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G)) {
    delay(250);
  }

  mpu.calibrateGyro();
  
  delay(1000);
  
  Serial.begin(115200);
}

void readSensor() {
  Vector acc = mpu.readNormalizeAccel();
  Vector gyr = mpu.readNormalizeGyro();

  float accRoll  = (atan2(acc.YAxis, acc.ZAxis)*180.0)/M_PI;

  kalRoll = kalmanX.update(accRoll, gyr.XAxis);
  
  int roll_sp = analogRead(ROLL_SP);

  String serialValue = String(roll_sp);
  serialValue.concat(',');
  serialValue.concat(kalRoll);
  
  Serial.println(serialValue);
}

void loop() {
  char buf[4];
  int index = 0;
  int rollC = 0;
  
  while (Serial.available() && !shut) {
    
    char cRead = (char)Serial.read();

    if (cRead == 'e') {
      rollC = 0;
      
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
      break;
    }
    
    buf[index] = cRead;
    index++;
    delayMicroseconds(100);
  }

  if (rollC >= 0) {
      left.write(map(BASE_ROTATION, 0, 1023, 40, 140));
      right.write(map((BASE_ROTATION + rollC), 0, 1023, 40, 140));
  } else {
      left.write(map((BASE_ROTATION + (-1 * rollC)), 0, 1023, 40, 140));
      right.write(map(BASE_ROTATION, 0, 1023, 40, 140));
  }
  
}

void clearBuffer(char *vet) {
  for (int i = 0; i < 4; i++) {
    vet[i] = '\0'; 
  }
}

