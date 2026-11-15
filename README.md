# 🐭 Pups

**Die Paar-App für iOS, die euch hilft, einander besser zu kennen, an das Wichtige zu denken und euch jeden Tag ein Lächeln zu schenken.**

> Status: 🚧 Erste lauffähige Version (lokal, noch ohne Server)

---

## Über das Projekt

Pups ist eine iPhone-App für Paare. Beide Partner legen ein Profil mit ihren Vorlieben an und verbinden sich miteinander. Danach steht das süße 3D-Maskottchen des Partners auf dem Home-Bildschirm (Standard: eine Ratte, in der weiblichen Variante mit Schleife und Wimpern).

Hinter dem Maskottchen steckt ein „Buch“ über den Partner mit allen Infos, Lieblingsdingen, Bildern und Geschenkideen. Die App erinnert rechtzeitig an wichtige Tage, begleitet auf Wunsch den Zyklus der Partnerin und macht mit kleinen Aufgaben die Beziehung im Alltag schöner.

## Features

- **Registrierung & Profil:** Anmeldung mit Verifizierung (E-Mail/SMS, Sign in with Apple). Vorlieben wie Lieblingsfarbe, -getränke und -süßigkeiten über vorgegebene Auswahl-Chips oder eigene Einträge
- **Partner verbinden:** Einladung per Code, Link (SMS, WhatsApp …) oder QR-Code
- **3D-Maskottchen:** Interaktiver Avatar des Partners auf dem Home-Bildschirm
- **Partner-Buch:** Nach Kategorien geordnete Infos über den Partner, von beiden ergänzbar, inkl. Bilder & Screenshots
- **Geschenkideen-Moodboard:** Wünsche und Ideen über das Jahr sammeln
- **Erinnerungen:** Geburtstag, Jahrestag & Co. mit Vorlauf (z. B. 2 Monate / 6 Wochen vorher)
- **Zyklus-Begleiter:** Grobes Tracking über den ersten Periodentag, Erklärungen zu jeder Phase und Tipps für den Partner. Die Partnerin entscheidet, was geteilt wird
- **Aufgaben:** Tägliche, wöchentliche und monatliche Aufgaben für den Partner (z. B. „Mach ein Kompliment“, „Geht auf ein Date“) mit Herzen, Streaks und Belohnungen fürs Maskottchen

## Stand der Umsetzung

Die App läuft komplett auf dem Handy, einen Server gibt es noch nicht.

| Bereich | Stand |
|---|---|
| Profil mit Auswahl-Chips und „+ Andere“ | ✅ |
| Maskottchen (Ratte, weiblich mit Schleife und Wimpern) | ✅ als Vektorgrafik, echtes 3D-Modell folgt |
| Partner verbinden per QR-Code oder Nachricht | ✅ das Profil steckt im Code, kein Live-Abgleich |
| Partner-Buch mit Kapiteln, Einträgen und Bildern | ✅ |
| Geschenke-Board | ✅ |
| Termine und Erinnerungen mit Vorlauf | ✅ lokale Mitteilungen |
| Zyklus-Begleiter mit Freigabe | ✅ |
| Aufgaben (täglich, wöchentlich, monatlich), Herzen, Serie | ✅ |
| Registrierung mit Verifizierung | ⏳ braucht den Server |
| Live-Abgleich zwischen beiden Handys, Push vom Partner | ⏳ braucht den Server |

## Tech-Stack

| Bereich | Technologie |
|---|---|
| App | React Native mit Expo SDK 58, TypeScript |
| Maskottchen | react-native-svg (später 3D-Modell) |
| Speicher | AsyncStorage auf dem Gerät |
| QR-Code | react-native-qrcode-svg, expo-camera |
| Bilder | expo-image-picker |
| Erinnerungen | expo-notifications (lokal) |
| Backend (geplant) | Firebase oder Supabase (EU-Region) |
| Verteilung | Expo Go zum Testen, später EAS Build → TestFlight → App Store |

Ursprünglich war Swift/SwiftUI geplant. Weil die Entwicklung unter Windows läuft, ist die App mit Expo umgesetzt: Sie lässt sich in VS Code bauen und direkt auf dem iPhone testen.

## Projektstruktur

```
App.tsx              Einstieg: Tabs, Sheets, Erinnerungen
src/screens/         Home, Buch, Geschenke, Aufgaben, Termine, Zyklus, Ich, Verbinden, Onboarding
src/components/      Maskottchen und Bausteine (Buttons, Chips, Felder)
src/lib/             Speicher, Datum, Zyklus, Aufgaben, Einladungscode, Erinnerungen
src/data/            Auswahl-Chips, Aufgaben-Pool, Texte zu den Zyklusphasen
```

## Roadmap

- [ ] **Phase 0:** Konzept, Klick-Prototyp (Figma), Maskottchen-Design
- [ ] **Phase 1 – MVP:** Registrierung, Profil, Partner verbinden, Home mit Maskottchen, Partner-Buch, Geburtstags-Erinnerung, Tagesaufgaben
- [ ] **Phase 2 – v1.0:** Moodboard, Zyklus-Begleiter, Wochen- & Monatsaufgaben, Herzen & Streaks, Kalender
- [ ] **Phase 3 – Ausbau:** Weitere Tiere & Accessoires, Widgets, Apple Watch, Share Extension, Englisch
- [ ] **Phase 4:** Beta via TestFlight, App-Store-Release

## Datenschutz

Pups verarbeitet sehr persönliche Daten, darunter Zyklusdaten (Gesundheitsdaten nach DSGVO Art. 9). Geplant sind ausdrückliche Einwilligung, verschlüsselte Speicherung, Server in der EU, kein Werbe-Tracking sowie Konto-Löschung und Datenexport direkt in der App.

> ⚠️ Die Zyklusfunktion liefert nur Schätzungen. Sie ist kein Verhütungsmittel und ersetzt keine ärztliche Beratung.

## Setup

Voraussetzungen: [Node.js](https://nodejs.org) (LTS) auf dem Rechner und die App **Expo Go** auf dem iPhone.

```bash
npm install
npx expo start
```

Danach den QR-Code aus dem Terminal mit der iPhone-Kamera scannen. Rechner und iPhone müssen im selben WLAN sein. Klappt die Verbindung nicht, hilft `npx expo start --tunnel`.

Zum Verbinden zeigt jeder dem anderen unter „Partner verbinden“ seinen Code.

---

Made with 💗 für die kleinen Dinge in der Liebe.
