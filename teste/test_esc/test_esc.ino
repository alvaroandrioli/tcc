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
int valor;
int vSensor;
int baseRotation = 50;

void setup()
{
  Serial.begin(9600);
  esc.attach(pino_motor);
  esc2.attach(pino_motor_2);
  Serial.println("Aguardando 2 segundos....");
  esc.write(40);
  esc2.write(40);
  delay(2000);
}

void loop()
{
  //Le o valor do potenciometro
  valor = analogRead(pino_pot);
  vSensor = map(analogRead(pino_sensor), 44, 625, 0, 1024);
  float erro = normalize((vSensor - valor));
  float buff = 0;
  float diff = 0;
  diff = erro - buff;
  float c = erro + buff * 1.4 + diff;
  Serial.print(c);
  
  if (c == 0) {
    Serial.println("NEUTRO");
    esc.write(baseRotation);
    esc2.write(baseRotation);
  }
  if (c < 0) {
    Serial.println("DIREITA");
    esc.write(map((c * -1), 0, 1024, baseRotation, 60));
    esc2.write(baseRotation);
  }
  if (c > 0) {
    Serial.println("ESQUERDA");
    esc.write(baseRotation);
    esc2.write(map(c, 0, 1024, baseRotation, 60));
  }
  
  delay(1);
  buff = erro;
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

