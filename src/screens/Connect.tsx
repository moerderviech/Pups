import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useMemo, useRef, useState } from 'react';
import { Alert, Share, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Button, Card, Field, Muted, SectionTitle, styles as ui } from '../components/ui';
import { createInvite, readInvite } from '../lib/invite';
import { useStore } from '../lib/store';
import { colors, radius, space } from '../theme';

/** Partner verbinden: eigenen Code zeigen oder teilen, Code des Partners scannen oder einfügen */
export function Connect({ onDone }: { onDone: () => void }) {
  const { state, update } = useStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [pasted, setPasted] = useState('');
  const handled = useRef(false);

  const invite = useMemo(() => createInvite(state), [state]);
  const hasPartner = state.partner !== null;

  const share = () => {
    if (!invite) return;
    Share.share({
      message:
        `Verbinde dich mit mir bei Pups 🐭💗\n\n` +
        `Öffne die App, tippe auf „Partner verbinden“ und füge diese ganze Nachricht ein:\n\n${invite}`,
    }).catch(() => undefined);
  };

  const connect = (raw: string): boolean => {
    const result = readInvite(raw);
    if (!result) {
      Alert.alert('Das ist kein Pups-Code', 'Bitte scanne den QR-Code aus der Pups-App oder füge die ganze Einladung ein.');
      return false;
    }
    update((s) => ({
      ...s,
      partner: result.partner,
      anniversary: s.anniversary || result.anniversary || '',
    }));
    // Erst die Meldung, dann das Sheet schließen: iOS zeigt keinen Hinweis, während ein Sheet zugeht
    Alert.alert(
      hasPartner ? 'Stand aktualisiert' : 'Ihr seid verbunden 💗',
      hasPartner
        ? `Du hast jetzt den neuesten Stand von ${result.partner.name}.`
        : `Das Maskottchen von ${result.partner.name} wohnt jetzt auf deinem Home-Bildschirm. Zeig ${result.partner.name} auch deinen Code.`,
      [{ text: 'OK', onPress: onDone }]
    );
    return true;
  };

  const startScan = async () => {
    const granted = permission?.granted || (await requestPermission()).granted;
    if (!granted) {
      Alert.alert('Kein Kamerazugriff', 'Erlaube Pups in den Einstellungen den Zugriff auf die Kamera oder füge den Code als Text ein.');
      return;
    }
    handled.current = false;
    setScanning(true);
  };

  return (
    <View>
      <Muted style={{ marginBottom: space.md }}>
        Jeder zeigt dem anderen seinen Code. Scannt euch gegenseitig oder schickt euch die Einladung per Nachricht.
      </Muted>

      <SectionTitle>Dein Code</SectionTitle>
      <Card style={{ alignItems: 'center' }}>
        {invite ? (
          <View style={{ padding: space.md, backgroundColor: '#FFFFFF', borderRadius: radius.sm }}>
            <QRCode value={invite} size={270} ecl="L" color={colors.ink} backgroundColor="#FFFFFF" />
          </View>
        ) : null}
        <Button label="Einladung per Nachricht teilen" onPress={share} style={{ marginTop: space.lg, alignSelf: 'stretch' }} />
        <Muted style={{ marginTop: space.sm }}>
          Der Code enthält dein Profil. Nach Änderungen an deinem Profil zeigst du ihn einfach noch einmal.
        </Muted>
      </Card>

      <SectionTitle>{hasPartner ? `Neuen Stand von ${state.partner?.name} holen` : 'Code deines Partners'}</SectionTitle>
      <Card>
        {scanning ? (
          <View>
            <View style={{ height: 300, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.ink }}>
              <CameraView
                style={{ flex: 1 }}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={(result) => {
                  if (handled.current) return;
                  handled.current = true;
                  setScanning(false);
                  connect(result.data);
                }}
              />
            </View>
            <Button label="Scannen abbrechen" variant="ghost" onPress={() => setScanning(false)} style={{ marginTop: space.sm }} />
          </View>
        ) : (
          <Button label="QR-Code scannen" onPress={startScan} />
        )}

        <Text style={[ui.muted, { textAlign: 'center', marginVertical: space.md }]}>oder</Text>
        <Field
          label="Einladung einfügen"
          value={pasted}
          onChangeText={setPasted}
          placeholder="Nachricht mit PUPS1.… hier einfügen"
          multiline
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          label="Verbinden"
          variant="secondary"
          disabled={!pasted.trim()}
          onPress={() => {
            if (connect(pasted)) setPasted('');
          }}
        />
      </Card>
    </View>
  );
}
