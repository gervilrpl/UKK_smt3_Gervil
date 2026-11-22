/*
============================================================
FOLDER PEMBELAJARAN: KONSEP MODULAR C++ / ARDUINO
File: 00-Konsep-Modular.ino

File ini adalah FILE PENGENDALI UTAMA.
File .ino boleh dipakai sebagai panduan alur program:
setup() menyiapkan perangkat, loop() menjalankan tugas.
============================================================

PERBANDINGAN SEDERHANA DENGAN HTML + CSS:

- class pada HTML adalah nama elemen.
- class pada CSS menentukan gaya.
- Di Arduino, nama fungsi pada file .ino juga adalah wadah.
- Definisi fungsi dicari pada file header .h yang dipanggil
  melalui #include.

CONTOH YANG SERING TIMBUL:

File ini memakai:
readDHT(currentTemperature, currentHumidity)

Nama readDHT berasal dari fungsi yang DIDEFINISIKAN
dalam dht_sensor.h.

Jadi urutannya:

1. .ino menyertakan header: #include "dht_sensor.h"
2. dht_sensor.h berisi deklarasi/definisi fungsi.
3. .ino memanggil nama readDHT(...)
4. Compiler membaca kembali kode fungsi tersebut lalu
   menggabungkannya menjadi satu program ESP32.

Pada Arduino, modul sensor bekerja seperti ini:

#include "dht_sensor.h"  -> membuka daftar modul
readDHT(...)             -> memanggil fungsi dari modul
inline bool readDHT(...) -> mencari kode fungsi yang dituju
============================================================
*/

// [1] Sertakan konfigurasi dan modul yang akan dipakai.
#include "config.h"
#include "dht_sensor.h"

// [2] Variabel milik file utama.
// Nilai dibaca oleh modul lalu disimpan di sini.

float currentTemperature = 0.0;
float currentHumidity = 0.0;

unsigned long lastReadMillis = 0;
unsigned long readCount = 0;

void setup() {

    Serial.begin(SERIAL_BAUD);
    delay(500);

    Serial.println(
        "=========================================="
    );

    Serial.println(
        "BELAJAR KONSEP MODULAR ESP32 + HEADER .h"
    );

    Serial.println(
        "=========================================="
    );

    Serial.println(
        "config.h       : sumber pin dan interval"
    );

    Serial.println(
        "dht_sensor.h   : tempat fungsi readDHT() dibuat"
    );

    Serial.println(
        "file .ino      : tempat fungsi setup() dan loop() mengatur alur"
    );

    // Fungsi initDHT() berasal dari dht_sensor.h.
    // Fungsi ini dipanggil hanya sekali karena .ino ini
    // berada dalam setup().

    initDHT();
}

void loop() {

    unsigned long nowMillis = millis();

    // Pewaktuan non-blocking, sama seperti berkonsultasi
    // waktu dengan millis().

    if (nowMillis - lastReadMillis >= SENSOR_READ_INTERVAL) {

        lastReadMillis = nowMillis;
        readCount++;

        /*
        FUNGSI DIPANGGIL DI SINI:

        readDHT adalah nama fungsi yang didefinisikan
        pada dht_sensor.h.

        Dua variabel diteruskan dengan tanda &,
        sehingga dht_sensor.h dapat mengubah nilai
        currentTemperature dan currentHumidity
        secara langsung.

        Setelah return true:
        - currentTemperature berisi suhu Celsius.
        - currentHumidity berisi kelembapan persen RH.

        Setelah return false:
        - Pembacaan dianggap gagal, misalnya checksum
          sensor atau pembacaan NaN.
        */

        if (readDHT(currentTemperature, currentHumidity)) {

            Serial.print("Pembacaan #");
            Serial.print(readCount);

            Serial.print(" | Suhu: ");
            Serial.print(currentTemperature, 1);

            Serial.print(" C | Kelembapan: ");
            Serial.print(currentHumidity, 1);

            Serial.println(" %RH");

        } else {

            Serial.println(
                "Sensor gagal dibaca; periksa DHT11 dan kabel data."
            );
        }
    }
}
