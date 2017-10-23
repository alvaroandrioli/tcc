//Programa: Controle de motor brushless EMAX CF2822
//Autor : Arduino e Cia

#include <Servo.h>

#define pino_pot A0
#define pino_sensor A2

#define pino_motor 11
#define pino_motor_2 5

Servo esc;
Servo esc2;

//Pino do potenciometro

//Pino de controle do motor

int ref;
int vSensor;
int baseRotation = 50;
int cont = 0;
int rep = 0;
int off = 0;

void setup()
{
  Serial.begin(115200);
  
  esc.attach(pino_motor);
  esc2.attach(pino_motor_2);
  
  esc.write(40);
  esc2.write(40);
  delay(2000);
  esc.write(52);
  esc2.write(52);
  delay(3000);
}

void loop()
{
  vSensor = map(analogRead(pino_sensor), 31, 590, 0, 1024);
  //vSensor = analogRead(pino_sensor);
  ref = analogRead(pino_pot);

  float erro = normalize(ref - vSensor);
  float c = erro * 1.01 ;
  
  if (c == 0) {
    esc.write(baseRotation);
    esc2.write(baseRotation);
  }
  if (c < 0) {
    esc2.write(map((c * -1), 0, 1024, baseRotation, 60));
    esc.write(baseRotation);
  }
  if (c > 0) {
    esc2.write(baseRotation);
    esc.write(map(c, 0, 1024, baseRotation, 60));
  }

  Serial.print(ref);
  Serial.print(",");
  Serial.println(vSensor);

  delay(20);
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

