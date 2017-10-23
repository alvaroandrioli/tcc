#include <MsTimer2.h>
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
int sinal;
int vSensor;
int r = 1;
int maxQuant = 20;
int tDelay = 350;
int exec = 0;
int cont = 0;

void setup()
{
  Serial.begin(9600);
  esc.attach(pino_motor);
  esc2.attach(pino_motor_2);
  esc.write(40);
  esc2.write(40);
  MsTimer2::set(10, readSensor);  
  delay(2000);
  esc.write(55);
  esc2.write(54);
  delay(5000);
  MsTimer2::start();
}

void loop()
{
  if (r == 1) {
    sinal = -650;
    r = 0;
  } else {
    sinal = 650;
    r = 1;  
  }
  
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

  if (cont == maxQuant) {
    maxQuant = 2 * maxQuant;
    tDelay = round(tDelay/2);
    cont = 0;
    exec ++;

    if (exec == 4) {
      exit(0);
    }
  }

  cont++;
  delay(tDelay);
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

void readSensor() {
  vSensor = analogRead(pino_sensor);

  Serial.print(sinal);
  Serial.print(',');
  Serial.println(map(vSensor, 31, 609, 0, 1024));
}

