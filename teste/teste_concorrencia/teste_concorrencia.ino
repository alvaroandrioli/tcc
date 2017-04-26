#include <MsTimer2.h>

#define ARFAGEM_LED 10
#define GUINADA_LED 9
#define POTENCIOMETRO A5

boolean serialReadComplete = false;
String num1;
String num2;

void setup() {
  MsTimer2::set(10, readSensor); //10 mili segundos
  MsTimer2::start();

  randomSeed(analogRead(A0));
  
  num1.reserve(4);
  num2.reserve(4);
  
  pinMode(ARFAGEM_LED, OUTPUT);
  pinMode(GUINADA_LED, OUTPUT);

  digitalWrite(ARFAGEM_LED, 0);
  digitalWrite(GUINADA_LED, 0);
  
  Serial.begin(115200);
}

void readSensor() {
  int arfagem_sp = analogRead(POTENCIOMETRO);
  int GUINADA_SP = random(0,1023);
  int arfagem_sensor = random(0,1023);
  int GUINADA_SENSOR = random(0,1023);

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
  boolean isNumber1 = true;
  char serialReadData;
  boolean ignore = false;
  
  while (Serial.available()) {
    serialReadData = (char)Serial.read();
//    Serial.println();
//    Serial.print("serialReadData - ");
//    Serial.println(serialReadData);
    
    if (serialReadData == ',') {
//      Serial.println("achei um ,");
      isNumber1 = false;
      ignore = true;
    }
     
    if (serialReadData == '\n') {
      serialReadComplete = true;
      ignore = true;
    }

     
   
//    Serial.print("isNumber1 - ");
//    Serial.println(isNumber1);
//
//    Serial.print("ignore - ");
//    Serial.println(ignore);

    if (isNumber1 && !ignore) { 
      num1 += serialReadData;
    }
    
    if (!isNumber1 && !ignore) {
      num2 += serialReadData;
    }

//    Serial.print("num1 - ");
//    Serial.println(num1);
//
//    Serial.print("num2 - ");
//    Serial.println(num2);
    
    ignore = false;
    delay(1);
  }
}

void loop() { 
  if (serialReadComplete) {
    analogWrite(ARFAGEM_LED, num1.toInt());
    analogWrite(GUINADA_LED, num2.toInt());
    
    num1 = "";
    num2 = "";

    serialReadComplete = false;
  }
}
