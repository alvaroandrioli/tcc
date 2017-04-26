#include <Servo.h>

Servo ServoMotor;

int pino_motor = 6;
int valor;

void setup() {
  Serial.begin(9600);
  ServoMotor.attach(10);
  Serial.println("Aguardando 5 segundos....");
  delay(5000);
}

void loop() {
  valor = analogRead(A5);
  //Converte o valor para uma faixa entre 0 e 179
  valor = map(valor, 0, 1023, 0, 179);
  //Mostra o valor no serial monitor
  Serial.print("Potenciometro: ");
  Serial.println(valor);
  //Envia o valor para o motor
  ServoMotor.write(valor);
}
