//Programa: Controle de motor brushless EMAX CF2822
//Autor : Arduino e Cia

#include <Servo.h>

Servo esc1;
Servo esc2;

//Pino do potenciometro
int pino_pot = A5;
//Pino de controle do motor
int pino_motor = 10;
int valor;

void setup()
{
  Serial.begin(9600);
  esc1.attach(pino_motor);
  esc2.attach(pino_motor + 1);
  Serial.println("Aguardando 5 segundos....");
  delay(5000);
}

void loop()
{
  //Le o valor do potenciometro
  valor = analogRead(pino_pot);
  //Converte o valor para uma faixa entre 0 e 179
  valor = map(valor, 0, 1023, 0, 180);
  //Mostra o valor no serial monitor
  Serial.print("Potenciometro: ");
  Serial.println(valor);
  //Envia o valor para o motor
  esc1.write(valor);
  esc2.write(valor);
}
