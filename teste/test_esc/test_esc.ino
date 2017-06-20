//Programa: Controle de motor brushless EMAX CF2822
//Autor : Arduino e Cia

#include <Servo.h>

Servo esc1;
Servo esc2;

//Pino do potenciometro
int pino_pot = A0;
//Pino de controle do motor
int pino_motor = 11;
int valor;
int valor2;

void setup()
{
  Serial.begin(9600);
  esc1.attach(pino_motor);
  esc2.attach(6);
  Serial.println("Aguardando 5 segundos....");
  delay(5000);
}

void loop()
{
  //Le o valor do potenciometro
  valor = analogRead(pino_pot);
  valor2 = analogRead(A1);
  //Converte o valor para uma faixa entre 0 e 179
  valor = map(valor, 0, 1023, 40, 140);
  valor2 = map(valor2, 0, 1023, 40, 140);
  //Mostra o valor no serial monitor
  Serial.print("Potenciometro 1: ");
  Serial.println(valor);
  Serial.print("Potenciometro 2: ");
  Serial.println(valor2);
  //Envia o valor para o motor
  esc1.write(valor);
  esc2.write(valor2);
}
