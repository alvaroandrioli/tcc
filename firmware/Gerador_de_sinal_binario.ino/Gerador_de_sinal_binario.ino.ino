//Programa: Controle de motor brushless EMAX CF2822
//Autor : Arduino e Cia

#include <Servo.h>

Servo esc;
Servo esc2;

//Pino do potenciometro
int pino_pot = A0;
int pino_sensor = A2;
//Pino de controle do motor
int pino_motor = 10;
int pino_motor_2 = 6;
int baseRotation = 55;
int i = 0;
int sinal;
int del = 0;
int vSensor;

void setup()
{
  Serial.begin(9600);
  esc.attach(pino_motor);
  esc2.attach(pino_motor_2);
  esc.write(40);
  esc2.write(40);
  randomSeed(1);
  delay(5000);
}

void loop()
{
  if (i == del) { 
    sinal = random(0, 9);
    if (sinal <= 4) {
      sinal = -750;
    } else {
      sinal = 750;
    }
    del = random(5, 10);
    i = 0;
  }
  vSensor = analogRead(A2);
  
  
  if (sinal == 0) {
    esc.write(baseRotation);
    esc2.write(baseRotation);
  }
  if (sinal < 0) {
    esc.write(map((sinal * -1), 0, 1024, 50, 60));
    esc2.write(baseRotation);
  }
  if (sinal > 0) {
    esc.write(baseRotation);
    esc2.write(map(sinal, 0, 1024, 50, 60));
  }

  Serial.print(sinal);
  Serial.print(',');
  Serial.println(map(vSensor, 40, 620, 0, 1024));

  i ++;
  delay(10);
}

int normalize(float valor) {
  if (valor == 0)
    return 0;

  if (valor > 1024)
    return 1024;

  if (valor < -1024)
    return -1024;

  return valor;
}

