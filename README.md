# 🐭 Pups

**Die Paar-App für iOS, die euch hilft, einander besser zu kennen, an das Wichtige zu denken und euch jeden Tag ein Lächeln zu schenken.**

> Status: 🚧 Konzeptphase / in Entwicklung

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

## Tech-Stack (geplant)

| Bereich | Technologie |
|---|---|
| App | Swift, SwiftUI (iOS 17+) |
| 3D | RealityKit / SceneKit, Modelle als USDZ (Blender) |
| Backend | Firebase oder Supabase (EU-Region) |
| Auth | Sign in with Apple, E-Mail, SMS |
| Notifications | Lokale Notifications + APNs |
| Widgets | WidgetKit |
| Distribution | TestFlight → App Store |

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

*Folgt, sobald das Xcode-Projekt angelegt ist.*

Voraussetzungen: Mac mit Xcode, Apple Developer Account (für Gerätetests & TestFlight).

---

Made with 💗 für die kleinen Dinge in der Liebe.
