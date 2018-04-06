#include "MFRC522.h"

#define SS_PIN SS
#define RST_PIN D2

// Create MFRC522 instance.
MFRC522 mfrc522(SS_PIN, RST_PIN);

// Big endian getID
unsigned int getID(byte* arr) {
    return (arr[0] << 24) + (arr[1] << 16) + (arr[2] << 8) + arr[3];
}

void setup() {
	Serial.begin(9600);
	mfrc522.setSPIConfig();
	mfrc522.PCD_Init();
}

void loop() {

	// Look for new cards
	if (!mfrc522.PICC_IsNewCardPresent()) {
		return;
	}

	// Select one of the cards
	if (!mfrc522.PICC_ReadCardSerial()) {
		return;
	}

	// Get id in hex format
	unsigned int id = getID(mfrc522.uid.uidByte);
  char str[16];
  sprintf(str, "%02x", id);

  // Publish scan event with id
  Serial.println(str);
  Particle.publish("rfid-scan", str);

  // Don't repeat the same card
  mfrc522.PICC_HaltA();
}
