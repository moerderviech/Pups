# 📖 User Stories – Pups

Die User Stories folgen dem Format **„Als … möchte ich …, damit …“**. Jede Story hat Akzeptanzkriterien und eine Priorität.

| Priorität | Bedeutung |
|---|---|
| 🟥 **MVP** | Muss in die erste Version für uns zwei |
| 🟧 **v1.0** | Für die erste öffentliche Version |
| 🟩 **Später** | Nice-to-have / Ausbau |

**Rollen**

- **Nutzer:in**: jede Person mit einem Pups-Konto
- **Partner:in**: die verbundene zweite Person im Paar
- **Partnerin mit Zyklus**: Nutzerin, die den Zyklus-Begleiter verwendet

> ✳️ = Ergänzung, die über die ursprüngliche Projektbeschreibung hinausgeht

---

## Inhalt

1. [Epic 1 – Registrierung & Konto](#epic-1--registrierung--konto)
2. [Epic 2 – Eigenes Profil](#epic-2--eigenes-profil)
3. [Epic 3 – Partner verbinden](#epic-3--partner-verbinden)
4. [Epic 4 – Home-Bildschirm & Maskottchen](#epic-4--home-bildschirm--maskottchen)
5. [Epic 5 – Partner-Buch](#epic-5--partner-buch)
6. [Epic 6 – Geschenkideen-Moodboard](#epic-6--geschenkideen-moodboard)
7. [Epic 7 – Erinnerungen & Kalender](#epic-7--erinnerungen--kalender)
8. [Epic 8 – Zyklus-Begleiter](#epic-8--zyklus-begleiter)
9. [Epic 9 – Aufgaben](#epic-9--aufgaben)
10. [Epic 10 – Belohnungen & Gamification](#epic-10--belohnungen--gamification)
11. [Epic 11 – Datenschutz & Einstellungen](#epic-11--datenschutz--einstellungen)
12. [Epic 12 – iOS-Extras](#epic-12--ios-extras)
13. [Übersicht nach Priorität](#übersicht-nach-priorität)

---

## Epic 1 – Registrierung & Konto

### US-1.1 Registrieren mit E-Mail 🟥 MVP
**Als** neue Nutzer:in **möchte ich** mich mit meiner E-Mail-Adresse und einem Passwort registrieren, **damit** ich ein eigenes Konto habe.

- [ ] Eingabe von E-Mail und Passwort (mind. 8 Zeichen)
- [ ] Bestätigungslink wird per E-Mail verschickt
- [ ] Ohne Bestätigung kann das Konto nicht vollständig genutzt werden
- [ ] Verständliche Fehlermeldung bei bereits vergebener E-Mail

### US-1.2 Mit Apple anmelden 🟥 MVP
**Als** iPhone-Nutzer:in **möchte ich** mich mit „Sign in with Apple“ anmelden, **damit** ich kein neues Passwort brauche.

- [ ] Button „Mit Apple anmelden“ auf dem Startbildschirm
- [ ] „E-Mail verbergen“ von Apple wird unterstützt
- [ ] Konto gilt nach Apple-Login als verifiziert

### US-1.3 Verifizierung per SMS 🟩 Später
**Als** Nutzer:in **möchte ich** mich alternativ mit meiner Telefonnummer und einem SMS-Code verifizieren, **damit** ich keine E-Mail nutzen muss.

- [ ] 6-stelliger Code per SMS, 10 Minuten gültig
- [ ] Code erneut anfordern möglich (mit Wartezeit)

### US-1.4 Anmelden & angemeldet bleiben 🟥 MVP
**Als** Nutzer:in **möchte ich** angemeldet bleiben, **damit** ich mich nicht bei jedem Öffnen neu einloggen muss.

- [ ] Sitzung bleibt bestehen, bis ich mich abmelde
- [ ] Abmelden in den Einstellungen möglich

### US-1.5 Passwort vergessen 🟥 MVP
**Als** Nutzer:in **möchte ich** mein Passwort zurücksetzen können, **damit** ich mein Konto nicht verliere.

- [ ] Link „Passwort vergessen“ auf dem Login-Bildschirm
- [ ] Reset-Link per E-Mail

### US-1.6 ✳️ Onboarding-Tour 🟧 v1.0
**Als** neue Nutzer:in **möchte ich** beim ersten Start kurz sehen, was die App kann, **damit** ich weiß, wo ich anfangen soll.

- [ ] 3–4 Slides mit Maskottchen (Profil → Partner → Buch → Aufgaben)
- [ ] Überspringen möglich

---

## Epic 2 – Eigenes Profil

### US-2.1 Grunddaten eingeben 🟥 MVP
**Als** Nutzer:in **möchte ich** Name, Geburtstag und Geschlecht angeben, **damit** mein Profil und mein Maskottchen zu mir passen.

- [ ] Felder: Name/Spitzname, Geburtstag, Geschlecht (weiblich / männlich / divers)
- [ ] Alter wird aus dem Geburtstag berechnet
- [ ] Geburtstag erzeugt automatisch eine Erinnerung für den Partner (→ US-7.1)

### US-2.2 Lieblingsfarbe wählen 🟥 MVP
**Als** Nutzer:in **möchte ich** meine Lieblingsfarbe auswählen, **damit** mein Partner sie kennt und mein Maskottchen sie trägt.

- [ ] Farbwähler mit vorgeschlagenen Farben + freie Auswahl
- [ ] Schleife/Accessoire des Maskottchens übernimmt die Farbe

### US-2.3 Vorlieben per Auswahl-Chips 🟥 MVP
**Als** Nutzer:in **möchte ich** meine Lieblingsgetränke und -süßigkeiten aus Vorschlägen antippen, **damit** das Ausfüllen schnell geht (wie die Interessen bei Tinder).

- [ ] Vorgeschlagene Chips je Kategorie (z. B. Cola, Red Bull, Eistee, Iced Latte …)
- [ ] Mehrfachauswahl möglich
- [ ] Ausgewählte Chips sind farblich hervorgehoben

### US-2.4 Eigene Einträge unter „Andere“ 🟥 MVP
**Als** Nutzer:in **möchte ich** über „+ Andere“ eigene Einträge anlegen, **damit** auch meine speziellen Vorlieben drin sind.

- [ ] Freitext-Eingabe, wird danach als eigener Chip angezeigt
- [ ] Eigene Chips können wieder gelöscht werden

### US-2.5 Weitere Kategorien 🟧 v1.0
**Als** Nutzer:in **möchte ich** weitere Vorlieben angeben (Essen, Blumen, Musik, Filme, Hobbys), **damit** mein Partner mich noch besser kennt.

- [ ] Optional, auch später im Profil ergänzbar
- [ ] Gleiche Chip-Logik wie US-2.3

### US-2.6 ✳️ Größen, Allergien & No-Gos 🟧 v1.0
**Als** Nutzer:in **möchte ich** Kleidergrößen, Allergien und Dinge, die ich nicht mag, eintragen, **damit** Geschenke passen und nichts schiefgeht.

- [ ] Felder für Kleidung, Schuhe, Ring
- [ ] Bereich „Mag ich nicht / Allergien“

### US-2.7 Profil bearbeiten 🟥 MVP
**Als** Nutzer:in **möchte ich** mein Profil jederzeit ändern können, **damit** es aktuell bleibt.

- [ ] Alle Felder nachträglich bearbeitbar
- [ ] Änderungen sind sofort für den Partner sichtbar

---

## Epic 3 – Partner verbinden

### US-3.1 Einladungscode erhalten 🟥 MVP
**Als** Nutzer:in **möchte ich** einen persönlichen Einladungscode bekommen, **damit** sich mein Partner mit mir verbinden kann.

- [ ] Kurzer, gut lesbarer Code (z. B. `PUPS-7K3F`)
- [ ] Code läuft nach 48 Stunden ab und kann neu erzeugt werden

### US-3.2 Einladung teilen 🟥 MVP
**Als** Nutzer:in **möchte ich** meine Einladung per SMS, WhatsApp, iMessage oder Link verschicken, **damit** mein Partner sie bequem öffnen kann.

- [ ] iOS-Teilen-Menü mit vorformulierter Nachricht + Link
- [ ] Link öffnet die App direkt bzw. den App Store, falls nicht installiert

### US-3.3 QR-Code anzeigen & scannen 🟥 MVP
**Als** Nutzer:in **möchte ich** einen QR-Code zeigen bzw. scannen, **damit** wir uns verbinden können, wenn wir nebeneinander sitzen.

- [ ] QR-Code wird in der App angezeigt
- [ ] Scanner in der App (Kamera-Berechtigung wird erklärt)

### US-3.4 Einladung annehmen 🟥 MVP
**Als** eingeladene Person **möchte ich** die Einladung annehmen, **damit** wir als Paar verbunden sind.

- [ ] Vorschau: „Lea möchte sich mit dir verbinden“ inkl. Maskottchen
- [ ] Annehmen / Ablehnen
- [ ] Beide erhalten eine Bestätigung (Push)

### US-3.5 Verbindung lösen 🟧 v1.0
**Als** Nutzer:in **möchte ich** die Verbindung zu meinem Partner trennen können, **damit** ich die Kontrolle über meine Daten behalte.

- [ ] Sicherheitsabfrage vor dem Trennen
- [ ] Nach dem Trennen sieht keiner mehr die Daten des anderen
- [ ] ✳️ Selbst erstellte Einträge über den Ex-Partner werden gelöscht

### US-3.6 ✳️ Jahrestag festlegen 🟥 MVP
**Als** Paar **möchten wir** unseren Jahrestag eintragen, **damit** die App daran erinnert und „Tage zusammen“ zählt.

- [ ] Datum beim Verbinden oder später eintragbar
- [ ] Anzeige „Seit 523 Tagen zusammen 💗“

---

## Epic 4 – Home-Bildschirm & Maskottchen

### US-4.1 Maskottchen des Partners sehen 🟥 MVP
**Als** Nutzer:in **möchte ich** auf dem Home-Bildschirm das Maskottchen meines Partners sehen, **damit** ich mich beim Öffnen der App direkt mit ihm/ihr verbunden fühle.

- [ ] 3D-Maskottchen (Standard: Ratte) zentral auf dem Home-Bildschirm
- [ ] Name des Partners darüber
- [ ] Vor dem Verbinden: eigenes Maskottchen + Hinweis „Lade deinen Partner ein“

### US-4.2 Weibliche Variante 🟥 MVP
**Als** Nutzerin **möchte ich**, dass mein Maskottchen eine Schleife und Wimpern hat, wenn ich „weiblich“ wähle, **damit** es zu mir passt.

- [ ] Automatisch bei Geschlecht „weiblich“
- [ ] ✳️ Accessoires auch unabhängig vom Geschlecht frei wählbar

### US-4.3 Mit dem Maskottchen interagieren 🟧 v1.0
**Als** Nutzer:in **möchte ich** das Maskottchen antippen können, **damit** es reagiert und die App Spaß macht.

- [ ] Antippen: winken, hüpfen oder kichern (zufällig)
- [ ] Leichte Bewegung beim Neigen des iPhones
- [ ] Langes Drücken öffnet das Partner-Buch

### US-4.4 Tagesübersicht 🟥 MVP
**Als** Nutzer:in **möchte ich** unter dem Maskottchen die heutige Aufgabe und die nächste Erinnerung sehen, **damit** ich alles Wichtige auf einen Blick habe.

- [ ] Karte „Tagesaufgabe“
- [ ] Karte „Nächster Anlass“ (z. B. „Noch 54 Tage bis zu Leas Geburtstag“)
- [ ] Karte „Zyklusphase“ (nur wenn freigegeben, → US-8.5)

### US-4.5 ✳️ Stimmung des Maskottchens 🟩 Später
**Als** Nutzer:in **möchte ich**, dass das Maskottchen die Phase oder Stimmung meines Partners zeigt, **damit** ich ohne Worte merke, wie es ihm/ihr geht.

- [ ] Z. B. Wärmflasche in der Periode, Kuscheldecke in der Lutealphase
- [ ] ✳️ Partner kann eine Stimmung setzen („müde“, „brauche Umarmung“, „gut drauf“)

### US-4.6 Eigenes Tier wählen 🟩 Später
**Als** Nutzer:in **möchte ich** statt der Ratte ein anderes Tier wählen, **damit** das Maskottchen zu mir passt.

- [ ] Auswahl z. B. Hamster, Katze, Hase, Bär
- [ ] Wechsel jederzeit in den Einstellungen

---

## Epic 5 – Partner-Buch

### US-5.1 Buch über den Partner öffnen 🟥 MVP
**Als** Nutzer:in **möchte ich** ein Buch mit allen Infos über meinen Partner öffnen, **damit** ich nachschauen kann, was er/sie mag.

- [ ] Buch startet mit den Profildaten des Partners
- [ ] Optik wie ein Freundebuch / Scrapbook

### US-5.2 Kategorien 🟥 MVP
**Als** Nutzer:in **möchte ich**, dass das Buch nach Kategorien geordnet ist, **damit** ich schnell finde, was ich suche.

- [ ] Standard-Kapitel: Über mich, Essen & Trinken, Stil & Farben, Freizeit, Mag ich nicht, Liebessprache, Unsere Momente, Geschenkideen
- [ ] Inhaltsverzeichnis zum Springen

### US-5.3 Infos ergänzen 🟥 MVP
**Als** Nutzer:in **möchte ich** selbst Infos über meinen Partner hinzufügen, **damit** das Buch mit der Zeit wächst.

- [ ] Neuer Eintrag in jeder Kategorie möglich
- [ ] Sichtbar, wer den Eintrag erstellt hat („von dir entdeckt“ / „von Lea“)

### US-5.4 Bilder & Screenshots hochladen 🟥 MVP
**Als** Nutzer:in **möchte ich** Bilder und Screenshots zu Einträgen hinzufügen, **damit** ich mir Dinge auch visuell merken kann.

- [ ] Auswahl aus der Fotomediathek oder Kamera
- [ ] Mehrere Bilder pro Eintrag
- [ ] Bilder werden komprimiert gespeichert

### US-5.5 ✳️ Einträge bestätigen oder korrigieren 🟧 v1.0
**Als** Partner:in **möchte ich** sehen, was mein Partner über mich eingetragen hat, und es bestätigen oder korrigieren, **damit** die Infos stimmen.

- [ ] Benachrichtigung „Max hat etwas Neues über dich eingetragen“
- [ ] Reaktion: ✅ stimmt / ✏️ korrigieren

### US-5.6 Eigene Kapitel 🟧 v1.0
**Als** Nutzer:in **möchte ich** eigene Kapitel anlegen, **damit** ich auch Themen wie „Reiseziele“ oder „Insider“ sammeln kann.

- [ ] Name + Emoji frei wählbar
- [ ] Reihenfolge per Drag & Drop

### US-5.7 ✳️ Private Notizen 🟧 v1.0
**Als** Nutzer:in **möchte ich** Notizen anlegen, die nur ich sehe, **damit** ich Überraschungen planen kann.

- [ ] Schalter „Nur für mich“ pro Eintrag
- [ ] Deutlich gekennzeichnet (🔒)

### US-5.8 ✳️ Suche 🟧 v1.0
**Als** Nutzer:in **möchte ich** im Buch suchen, **damit** ich z. B. im Supermarkt schnell die Lieblingssüßigkeit finde.

- [ ] Volltextsuche über alle Kapitel

---

## Epic 6 – Geschenkideen-Moodboard

### US-6.1 Ideen sammeln 🟧 v1.0
**Als** Nutzer:in **möchte ich** Geschenkideen für meinen Partner auf einem Moodboard sammeln, **damit** ich zum Geburtstag nicht ratlos bin.

- [ ] Karte mit Bild, Titel, optional Link, Preis, Notiz
- [ ] Pinterest-ähnliches Raster

### US-6.2 Eigene Wunschliste 🟧 v1.0
**Als** Partner:in **möchte ich** selbst Wünsche auf mein Moodboard pinnen, **damit** mein Partner weiß, was ich mir wünsche.

- [ ] Bereich „Wünsche von Lea“ vs. „Meine geheimen Ideen“

### US-6.3 Geheime Ideen 🟧 v1.0
**Als** Nutzer:in **möchte ich**, dass meine gesammelten Ideen für meinen Partner unsichtbar sind, **damit** die Überraschung bleibt.

- [ ] Ideen sind standardmäßig privat

### US-6.4 Status „gekauft“ 🟧 v1.0
**Als** Nutzer:in **möchte ich** Ideen als „gekauft“ und „verschenkt“ markieren, **damit** ich den Überblick behalte.

- [ ] Status: Idee → gekauft → verschenkt
- [ ] Gekaufte Wünsche verschwinden für den Partner von seiner Wunschliste (Überraschung bleibt)

### US-6.5 Anlass & Budget 🟩 Später
**Als** Nutzer:in **möchte ich** Ideen einem Anlass und Preis zuordnen und filtern, **damit** ich passende Geschenke finde.

- [ ] Anlässe: Geburtstag, Weihnachten, Jahrestag, Valentinstag, einfach so
- [ ] Filter nach Preisrahmen

### US-6.6 ✳️ Aus anderen Apps teilen 🟩 Später
**Als** Nutzer:in **möchte ich** einen Link oder Screenshot direkt aus Instagram, Safari oder Amazon an Pups teilen, **damit** ich Ideen sofort speichern kann.

- [ ] iOS Share Extension „Zu Pups hinzufügen“
- [ ] Auswahl: Moodboard oder Buch-Kapitel

---

## Epic 7 – Erinnerungen & Kalender

### US-7.1 Geburtstags-Erinnerung 🟥 MVP
**Als** Nutzer:in **möchte ich** rechtzeitig an den Geburtstag meines Partners erinnert werden, **damit** ich in Ruhe ein Geschenk besorgen kann.

- [ ] Standard: 2 Monate, 6 Wochen, 2 Wochen, 3 Tage vorher und am Tag selbst
- [ ] Automatisch angelegt aus dem Profil des Partners
- [ ] Erinnerung verlinkt auf das Moodboard

### US-7.2 Vorlaufzeiten anpassen 🟧 v1.0
**Als** Nutzer:in **möchte ich** einstellen, wann ich erinnert werde, **damit** es zu mir passt.

- [ ] Vorlaufzeiten an/aus und eigene hinzufügen
- [ ] Uhrzeit der Benachrichtigung wählbar

### US-7.3 Jahrestag & Feiertage 🟧 v1.0
**Als** Nutzer:in **möchte ich** auch an Jahrestag, Valentinstag und Weihnachten erinnert werden, **damit** ich keinen wichtigen Tag verpasse.

- [ ] Vorlagen zum Aktivieren
- [ ] ✳️ Meilensteine: „100 Tage zusammen“, „1.000 Tage zusammen“

### US-7.4 Eigene Erinnerungen 🟧 v1.0
**Als** Nutzer:in **möchte ich** eigene Termine anlegen (z. B. „Prüfung von Lea“), **damit** ich meinem Partner Glück wünschen oder nachfragen kann.

- [ ] Titel, Datum, Uhrzeit, Vorlauf
- [ ] Wiederholung optional

### US-7.5 Gemeinsamer Kalender 🟩 Später
**Als** Paar **möchten wir** einen Kalender mit allen Anlässen, Aufgaben und (falls freigegeben) dem Zyklus sehen, **damit** wir planen können.

- [ ] Monatsansicht mit farbigen Markierungen
- [ ] ✳️ Export in den iOS-Kalender

---

## Epic 8 – Zyklus-Begleiter

### US-8.1 Zyklus-Begleiter aktivieren 🟧 v1.0
**Als** Partnerin mit Zyklus **möchte ich** den Zyklus-Begleiter bewusst aktivieren, **damit** ich selbst entscheide, ob ich ihn nutze.

- [ ] Wird bei „weiblich“ angeboten, aber nicht automatisch aktiviert
- [ ] ✳️ Auch für divers / unabhängig vom Geschlecht aktivierbar
- [ ] Ausdrückliche Einwilligung zur Verarbeitung von Gesundheitsdaten

### US-8.2 Periodenbeginn eintragen 🟧 v1.0
**Als** Partnerin mit Zyklus **möchte ich** den ersten Tag meiner Periode mit einem Tipp eintragen, **damit** die App meinen Zyklus grob berechnen kann.

- [ ] Button „Periode hat heute begonnen“ + Datum nachträglich wählbar
- [ ] Einträge bearbeiten und löschen möglich

### US-8.3 Phase & Prognose 🟧 v1.0
**Als** Partnerin mit Zyklus **möchte ich** sehen, in welcher Phase ich bin und wann die nächste Periode kommt, **damit** ich mich darauf einstellen kann.

- [ ] Durchschnittliche Zykluslänge aus den letzten Einträgen (Start: 28 Tage)
- [ ] Phasen: Menstruation, Follikelphase, Eisprung, Lutealphase
- [ ] Hinweis: nur Schätzung, kein Verhütungsmittel

### US-8.4 Über mich selbst lesen 🟧 v1.0
**Als** Partnerin mit Zyklus **möchte ich** lesen, was die aktuelle Phase biologisch und körperlich für mich bedeutet, **damit** ich mich besser verstehe.

- [ ] Erklärtext pro Phase + Tipps zu Ernährung, Bewegung, Schlaf
- [ ] Texte fachlich gegengelesen

### US-8.5 Freigabe für den Partner 🟧 v1.0
**Als** Partnerin mit Zyklus **möchte ich** festlegen, was mein Partner sieht, **damit** ich die Kontrolle über meine Daten behalte.

- [ ] Stufen: nichts / nur Phase / Phase + Tipps
- [ ] Jederzeit änderbar und widerrufbar

### US-8.6 Update für den Partner 🟧 v1.0
**Als** Partner:in **möchte ich** ein Update zur Zyklusphase meiner Freundin bekommen, **damit** ich weiß, wie es ihr gerade geht.

- [ ] Push bei Phasenwechsel („Lea ist jetzt in der Lutealphase 🌙“)
- [ ] Nur wenn freigegeben (US-8.5)

### US-8.7 Tipps für den Umgang 🟧 v1.0
**Als** Partner:in **möchte ich** konkrete Tipps bekommen, wie ich meine Freundin in der aktuellen Phase unterstützen kann, **damit** ich einfühlsam reagieren kann.

- [ ] Erklärung + 3–5 Tipps pro Phase (z. B. Lutealphase: Geduld, Lieblingssnack, gemütlicher Abend)
- [ ] Tipps nutzen Daten aus dem Partner-Buch („Bring ihr Kinder Bueno mit“)

### US-8.8 ✳️ Symptome & Stimmung notieren 🟩 Später
**Als** Partnerin mit Zyklus **möchte ich** optional Stimmung, Energie und Beschwerden notieren, **damit** die Tipps besser zu mir passen.

- [ ] Schnellauswahl per Emoji
- [ ] Wird nur geteilt, wenn ich es erlaube

### US-8.9 ✳️ Erinnerung an die Periode 🟩 Später
**Als** Partnerin mit Zyklus **möchte ich** kurz vor der erwarteten Periode erinnert werden, **damit** ich vorbereitet bin.

- [ ] Push „Deine Periode kommt voraussichtlich in 2 Tagen“

---

## Epic 9 – Aufgaben

### US-9.1 Tagesaufgabe erhalten 🟥 MVP
**Als** Nutzer:in **möchte ich** jeden Tag eine kleine Aufgabe für meinen Partner bekommen, **damit** ich ihm/ihr regelmäßig eine Freude mache.

- [ ] Eine neue Aufgabe pro Tag (z. B. „Mach deinem Partner ein Kompliment“)
- [ ] Morgens per Push (Uhrzeit einstellbar)

### US-9.2 Personalisierte Aufgaben 🟥 MVP
**Als** Nutzer:in **möchte ich**, dass Aufgaben die Vorlieben meines Partners nutzen, **damit** sie konkret sind.

- [ ] Platzhalter werden aus dem Buch befüllt: „Bring Lea einen **Iced Latte** mit“
- [ ] Fallback auf allgemeine Formulierung, wenn keine Daten vorhanden

### US-9.3 Aufgabe abhaken 🟥 MVP
**Als** Nutzer:in **möchte ich** eine Aufgabe als erledigt markieren, **damit** ich meinen Fortschritt sehe.

- [ ] Abhaken mit kleiner Animation des Maskottchens
- [ ] Optional mit Foto

### US-9.4 Wöchentliche Aufgaben 🟧 v1.0
**Als** Nutzer:in **möchte ich** jede Woche eine größere Aufgabe bekommen (z. B. „Geht auf ein Date“, „Plane eine spaßige Aktivität“), **damit** wir regelmäßig Zeit miteinander verbringen.

- [ ] Neue Aufgabe jeden Montag, gültig bis Sonntag

### US-9.5 Monatliche Aufgaben 🟧 v1.0
**Als** Nutzer:in **möchte ich** jeden Monat eine besondere Aufgabe bekommen (z. B. Ausflug, Brief schreiben), **damit** auch größere Erlebnisse nicht zu kurz kommen.

- [ ] Neue Aufgabe am 1. des Monats

### US-9.6 Aufgabe tauschen 🟧 v1.0
**Als** Nutzer:in **möchte ich** eine Aufgabe tauschen können, wenn sie gerade nicht passt, **damit** ich nicht frustriert bin.

- [ ] Einmal pro Tag / Woche / Monat tauschbar

### US-9.7 Partner reagiert 🟧 v1.0
**Als** Partner:in **möchte ich** sehen, welche Aufgabe mein Partner für mich erledigt hat, und mit einem Herz reagieren, **damit** er/sie merkt, dass ich es schätze.

- [ ] Push „Max hat eine Aufgabe für dich erledigt 💗“
- [ ] Reaktionen: ❤️ 😍 🥹 😂

### US-9.8 ✳️ Aufgaben wünschen 🟩 Später
**Als** Partner:in **möchte ich** mir eine Aufgabe von meinem Partner wünschen (z. B. „Picknick“), **damit** er/sie weiß, was mir gerade guttun würde.

- [ ] Eigene Aufgabe erstellen und an Partner senden

### US-9.9 Phasenbezogene Aufgaben 🟩 Später
**Als** Partner:in **möchte ich** Aufgaben passend zur Zyklusphase bekommen, **damit** sie zur Situation passen.

- [ ] Nur bei Freigabe (US-8.5)
- [ ] Z. B. Periode: „Bring ihr eine Wärmflasche“; Follikelphase: „Plant ein aktives Date“

---

## Epic 10 – Belohnungen & Gamification

### US-10.1 Herzen sammeln 🟧 v1.0
**Als** Nutzer:in **möchte ich** für erledigte Aufgaben Herzen bekommen, **damit** es motiviert, dranzubleiben.

- [ ] Täglich = 1, wöchentlich = 5, monatlich = 15 Herzen (Werte anpassbar)

### US-10.2 Streaks 🟧 v1.0
**Als** Nutzer:in **möchte ich** sehen, wie viele Tage in Folge ich meine Tagesaufgabe erledigt habe, **damit** ich motiviert bleibe.

- [ ] Streak-Anzeige mit Flamme 🔥
- [ ] Ein Pausentag pro Woche ohne Streak-Verlust (kein Druck)

### US-10.3 Accessoires freischalten 🟩 Später
**Als** Nutzer:in **möchte ich** mit Herzen Accessoires für das Maskottchen meines Partners freischalten, **damit** ich es verschönern kann.

- [ ] Z. B. Mütze, Brille, Schal, saisonale Outfits (Weihnachtsmütze, Hasenohren)
- [ ] Partner sieht das neue Accessoire auf seinem eigenen Maskottchen

### US-10.4 ✳️ Paar-Level 🟩 Später
**Als** Paar **möchten wir** gemeinsam aufsteigen statt gegeneinander zu spielen, **damit** es ein Teamgefühl gibt.

- [ ] Gemeinsames Level aus den Herzen beider Partner
- [ ] Kein Ranking, das einen Partner „schlechter“ aussehen lässt

### US-10.5 ✳️ Rückblick 🟩 Später
**Als** Paar **möchten wir** einen Monats-/Jahresrückblick sehen (erledigte Aufgaben, Fotos, Dates), **damit** wir uns an schöne Momente erinnern.

- [ ] Automatisch erstellte Story im Instagram-Stil

---

## Epic 11 – Datenschutz & Einstellungen

### US-11.1 App-Sperre 🟧 v1.0
**Als** Nutzer:in **möchte ich** die App mit Face ID oder Code sperren, **damit** niemand anderes meine Daten sieht.

- [ ] Optional in den Einstellungen

### US-11.2 Benachrichtigungen steuern 🟥 MVP
**Als** Nutzer:in **möchte ich** einstellen, welche Benachrichtigungen ich bekomme, **damit** mich die App nicht nervt.

- [ ] Einzeln schaltbar: Aufgaben, Erinnerungen, Partner-Aktivität, Zyklus

### US-11.3 Daten exportieren 🟩 Später
**Als** Nutzer:in **möchte ich** meine Daten exportieren können, **damit** ich sie sichern kann (DSGVO).

- [ ] Export als ZIP (JSON + Bilder)

### US-11.4 Konto löschen 🟥 MVP
**Als** Nutzer:in **möchte ich** mein Konto mit allen Daten löschen können, **damit** nichts von mir zurückbleibt.

- [ ] Direkt in der App (Pflicht laut App-Store-Richtlinien)
- [ ] Sicherheitsabfrage, Löschung inkl. Bilder und Zyklusdaten

### US-11.5 Datenschutzinfos 🟧 v1.0
**Als** Nutzer:in **möchte ich** verständlich lesen, was mit meinen Daten passiert, **damit** ich der App vertrauen kann.

- [ ] Datenschutzerklärung und Impressum in der App
- [ ] Kurzfassung in einfacher Sprache

---

## Epic 12 – iOS-Extras

### US-12.1 Home-Screen-Widget 🟩 Später
**Als** Nutzer:in **möchte ich** ein Widget mit dem Maskottchen meines Partners und der Tagesaufgabe, **damit** ich es sehe, ohne die App zu öffnen.

- [ ] Kleine und mittlere Widget-Größe
- [ ] ✳️ Lockscreen-Widget mit Countdown zum nächsten Anlass

### US-12.2 Apple Watch 🟩 Später
**Als** Nutzer:in **möchte ich** Tagesaufgabe und Erinnerungen auf meiner Apple Watch sehen, **damit** ich sie auch unterwegs mitbekomme.

### US-12.3 ✳️ „Ich denk an dich“-Stupser 🟩 Später
**Als** Nutzer:in **möchte ich** meinem Partner mit einem Tipp auf sein Maskottchen einen Stupser schicken, **damit** er/sie weiß, dass ich an ihn/sie denke.

- [ ] Push mit kleiner Animation („Max hat dich gestupst 🐭“)
- [ ] Limit gegen Spam (z. B. 10 pro Tag)

### US-12.4 ✳️ Dark Mode & Sprache 🟧 v1.0
**Als** Nutzer:in **möchte ich**, dass die App Dark Mode und Englisch unterstützt, **damit** sie zu meinen Einstellungen passt.

- [ ] Folgt den iOS-Systemeinstellungen

---

## Übersicht nach Priorität

### 🟥 MVP (erste Version für uns zwei)
US-1.1, 1.2, 1.4, 1.5 · US-2.1, 2.2, 2.3, 2.4, 2.7 · US-3.1, 3.2, 3.3, 3.4, 3.6 · US-4.1, 4.2, 4.4 · US-5.1, 5.2, 5.3, 5.4 · US-7.1 · US-9.1, 9.2, 9.3 · US-11.2, 11.4

### 🟧 v1.0
US-1.6 · US-2.5, 2.6 · US-3.5 · US-4.3 · US-5.5, 5.6, 5.7, 5.8 · US-6.1–6.4 · US-7.2, 7.3, 7.4 · US-8.1–8.7 · US-9.4–9.7 · US-10.1, 10.2 · US-11.1, 11.5 · US-12.4

### 🟩 Später
US-1.3 · US-4.5, 4.6 · US-6.5, 6.6 · US-7.5 · US-8.8, 8.9 · US-9.8, 9.9 · US-10.3, 10.4, 10.5 · US-11.3 · US-12.1, 12.2, 12.3
