#include "config.h"
#include "dht_sensor.h"
#include "oled_display.h"

static unsigned long lastReadMillis = 0;
static float currentTemp = 0.0;
static float currentHum = 0.0;
static unsigned long packetCount = 0;

void setup() {
    Serial.begin(SERIAL_BAUD);
    delay(1000);
    
    Serial.println();
    Serial.println("================================================================");
    Serial.println("        PROYEK 2: DHT DENGAN TAMPILAN OLED I2C                  ");
    Serial.println("        Modul Layar: SSD1306 128x64 I2C (0x3C)                  ");
    Serial.println("================================================================");

    if (initOLED()) {
        showSplashScreen();
    }

    initDHT();

    Serial.println("[SYSTEM] Inisialisasi selesai. Menampilkan data pada OLED...");
}

void loop() {
    unsigned long now = millis();

    if (now - lastReadMillis >= SENSOR_READ_INTERVAL) {
        lastReadMillis = now;
        packetCount++;

        if (readDHT(currentTemp, currentHum)) {
            Serial.print("[DATA #");
            Serial.print(packetCount);
            Serial.print("] Suhu: ");
            Serial.print(currentTemp, 1);
            Serial.print(" °C | kelembapan: ");
            Serial.print(currentHum, 1);
            Serial.println(" %");

            drawClimateScreen(currentTemp, currentHum, packetCount);
        } else {
            Serial.println("[ERROR] Gagal membaca sensor!");
            drawSensorError();
        }
    }
}
