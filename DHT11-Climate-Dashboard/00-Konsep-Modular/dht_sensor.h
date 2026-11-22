/*
============================================================
File: dht_sensor.h

File ini berisi definisi modul sensor DHT11.
File .ino hanya memanggil:
- initDHT();
- readDHT(currentTemperature, currentHumidity);

File ini mirip daftar modul/cetak biru yang menyediakan
fungsi kepada .ino.
============================================================
*/

// INCLUDE GUARD / PENGAMAN DUPLIKAT

#ifndef CONTOH_DHT_SENSOR_H
#define CONTOH_DHT_SENSOR_H

#include <DHT.h>
#include "config.h"

// static di sini membatasi objek agar tidak bertabrakan
// pada unit kompilasi.

static DHT sensorExample(DHT_PIN, DHT_TYPE);

/*
initDHT()

Dipanggil dari setup() pada file .ino.
Mengaktifkan komunikasi sensor pada pin yang telah
ditentukan config.h.
*/

inline void initDHT() {
    sensorExample.begin();

    Serial.println(
        "[dht_sensor.h] Sensor DHT11 dimulai pada GPIO "
        + String(DHT_PIN)
    );
}

/*
readDHT()

Ini adalah satu-satunya tempat fungsi readDHT()
dibuat pada contoh ini.

Tempat pemanggilan tidak menentukan tempat pembuatannya.
*/

// Parameter menggunakan referensi (&)
inline bool readDHT(float &temp, float &hum) {

    float temperature = sensorExample.readTemperature();
    float humidity = sensorExample.readHumidity();

    // Library mengembalikan NaN jika pembacaan tidak valid.
    if (isnan(temperature) || isnan(humidity)) {

        Serial.println(
            "[dht_sensor.h] ERROR: pembacaan DHT11 tidak valid"
        );

        return false;
    }

    temp = temperature;
    hum = humidity;

    return true;
}

#endif // CONTOH_DHT_SENSOR_H