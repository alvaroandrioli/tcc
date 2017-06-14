#include <Arduino_FreeRTOS.h>
#include <semphr.h>
#include <timers.h>
#include <queue.h>

#define LED_PWM 10
#define SENSOR A1
#define LED_BLICK 8

bool ledState = false; 
SemaphoreHandle_t xSerialSemaphore;
QueueHandle_t myQueue;

void taskReadSensor(void *params);
void taskPWMWrite(void *params);
void taskSerialPrint(void *params);

void setup() {
  pinMode(LED_PWM, OUTPUT);
  pinMode(LED_BLICK, OUTPUT);
  
  BaseType_t tReadSensor, tPWMWrite, tSerialPrint;
  TimerHandle_t periodicLed;
  
  Serial.begin(9600);

  while (!Serial) {}

  if (xSerialSemaphore == NULL) {
    xSerialSemaphore = xSemaphoreCreateMutex();  
    if ((xSerialSemaphore) != NULL)
      xSemaphoreGive((xSerialSemaphore)); 
  }
  
  myQueue = xQueueCreate(5, sizeof(int));

  periodicLed = xTimerCreate("PeriodicFunction",
                pdMS_TO_TICKS(500),
                pdTRUE,
                0,
                timerBlinkLed);
                
  tSerialPrint = xTaskCreate(taskSerialPrint,
                "Pirnt Serial",
                128,
                NULL,
                2,
                NULL);

  tReadSensor = xTaskCreate(taskReadSensor,
                  "Read Sensor",
                  128,
                  NULL,
                  1,
                  NULL);
                  
  tPWMWrite = xTaskCreate(taskPWMWrite,
                  "Write Led",
                  128,
                  NULL,
                  1,
                  NULL);
                  
  xTimerCreate("PeriodicFunction",
                pdMS_TO_TICKS(500),
                pdTRUE,
                0,
                timerBlinkLed);
                                  
  if (tPWMWrite != pdPASS || tReadSensor != pdPASS || tSerialPrint == pdFAIL) {
    Serial.println("System error in creat task!");
    exit(0);
  }
  
  xTimerStart(periodicLed, 0);
  vTaskStartScheduler();
}

void taskReadSensor(void *params) {
  int sensor = 0;
  
  while (true) {
    sensor = analogRead(SENSOR);
    
    if (xSemaphoreTake(xSerialSemaphore, 1) == pdTRUE) {
      
      Serial.print("[taskReadSensor] sensor value: "); 
      Serial.println(sensor);
      
      xQueueSendToBack(myQueue, &sensor, 0);
        
      xSemaphoreGive(xSerialSemaphore); 
    }
  }
}

void taskPWMWrite(void *params) {
  int sensor = 0;
  
  while (true) {
    xQueueReceive(myQueue, &sensor, 5);
    analogWrite(LED_PWM, map(sensor,1,1023,1,255));

     if (xSemaphoreTake(xSerialSemaphore, 1) == pdTRUE) {
      
      Serial.print("[taskPWMWrite] sensor value: "); 
      Serial.println(sensor);
        
      xSemaphoreGive(xSerialSemaphore); 
    }
  }
}

void taskSerialPrint(void *param) {
  int cont = 0;
  
  while (true) {
    
    if (xSemaphoreTake(xSerialSemaphore, (TickType_t) 2) == pdTRUE) {

      Serial.print("[taskSerialPrint] cont = ");
      Serial.println(cont);

      xSemaphoreGive(xSerialSemaphore); 
    }
    cont++;
    vTaskDelay(5);
  }
}

static void timerBlinkLed(void *param) {
  ledState = !ledState;
 
  if (ledState) {
    digitalWrite(LED_BLICK, 1);
  } else {
    digitalWrite(LED_BLICK, 0);
  }
}

void loop() {
}


