import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import type { Gender } from '../types';

export type MascotMood = 'normal' | 'cozy' | 'period';

interface Props {
  gender: Gender;
  /** Lieblingsfarbe: färbt die Schleife */
  color: string;
  size?: number;
  mood?: MascotMood;
  /** Sanftes Wippen im Leerlauf */
  animated?: boolean;
  onPress?: () => void;
}

/**
 * Das Standard-Maskottchen: eine Ratte.
 * Vorerst als weich schattierte Vektorgrafik. Das echte 3D-Modell
 * ersetzt später nur diese eine Komponente.
 */
export function Mascot({ gender, color, size = 220, mood = 'normal', animated = true, onPress }: Props) {
  const bob = useRef(new Animated.Value(0)).current;
  const squish = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animated, bob]);

  const hop = () => {
    squish.setValue(0);
    Animated.sequence([
      Animated.timing(squish, { toValue: 1, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(squish, { toValue: 0, friction: 3, tension: 120, useNativeDriver: true }),
    ]).start();
    onPress?.();
  };

  const translateY = Animated.add(
    bob.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }),
    squish.interpolate({ inputRange: [0, 1], outputRange: [0, -22] })
  );
  const scaleY = squish.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const scaleX = squish.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] });

  const female = gender === 'female';
  const sleepy = mood !== 'normal';

  return (
    <Pressable onPress={hop} accessibilityRole="imagebutton" accessibilityLabel="Maskottchen">
      <Animated.View style={{ transform: [{ translateY }, { scaleX }, { scaleY }] }}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            <RadialGradient id="fur" cx="40%" cy="30%" r="75%">
              <Stop offset="0" stopColor="#DAD5E2" />
              <Stop offset="1" stopColor="#A9A2B6" />
            </RadialGradient>
            <RadialGradient id="belly" cx="50%" cy="35%" r="70%">
              <Stop offset="0" stopColor="#F5F2F8" />
              <Stop offset="1" stopColor="#D9D3E1" />
            </RadialGradient>
            <RadialGradient id="ear" cx="45%" cy="40%" r="65%">
              <Stop offset="0" stopColor="#FBD0D9" />
              <Stop offset="1" stopColor="#F0A4B5" />
            </RadialGradient>
          </Defs>

          {/* Schatten am Boden */}
          <Ellipse cx="100" cy="188" rx="58" ry="8" fill="#2B2433" opacity={0.08} />

          {/* Schwanz */}
          <Path d="M148 150 C186 152 192 116 170 104" stroke="#EBA7B6" strokeWidth={7} fill="none" strokeLinecap="round" />

          {/* Körper */}
          <Ellipse cx="100" cy="142" rx="54" ry="44" fill="url(#fur)" />
          <Ellipse cx="100" cy="150" rx="31" ry="27" fill="url(#belly)" />

          {/* Füße */}
          <Ellipse cx="78" cy="181" rx="13" ry="7" fill="#C4BDCF" />
          <Ellipse cx="122" cy="181" rx="13" ry="7" fill="#C4BDCF" />

          {/* Ohren */}
          <Circle cx="60" cy="54" r="27" fill="url(#fur)" />
          <Circle cx="60" cy="54" r="17" fill="url(#ear)" />
          <Circle cx="140" cy="54" r="27" fill="url(#fur)" />
          <Circle cx="140" cy="54" r="17" fill="url(#ear)" />

          {/* Kopf */}
          <Ellipse cx="100" cy="90" rx="49" ry="43" fill="url(#fur)" />

          {/* Augen */}
          {sleepy ? (
            <G stroke="#2B2433" strokeWidth={3} fill="none" strokeLinecap="round">
              <Path d="M74 86 Q82 92 90 86" />
              <Path d="M110 86 Q118 92 126 86" />
            </G>
          ) : (
            <G>
              <Circle cx="82" cy="85" r="7.5" fill="#2B2433" />
              <Circle cx="84.5" cy="82" r="2.5" fill="#FFFFFF" />
              <Circle cx="118" cy="85" r="7.5" fill="#2B2433" />
              <Circle cx="120.5" cy="82" r="2.5" fill="#FFFFFF" />
            </G>
          )}

          {/* Wimpern */}
          {female && (
            <G stroke="#2B2433" strokeWidth={2} strokeLinecap="round">
              <Path d="M74 80 L69 76" />
              <Path d="M77 77 L74 72" />
              <Path d="M126 80 L131 76" />
              <Path d="M123 77 L126 72" />
            </G>
          )}

          {/* Wangen, Nase, Mund */}
          <Ellipse cx="70" cy="101" rx="8" ry="4.5" fill="#F6B8C5" opacity={0.85} />
          <Ellipse cx="130" cy="101" rx="8" ry="4.5" fill="#F6B8C5" opacity={0.85} />
          <Ellipse cx="100" cy="100" rx="6" ry="4.5" fill="#E8607D" />
          <Path d="M93 108 Q100 115 107 108" stroke="#2B2433" strokeWidth={2.2} fill="none" strokeLinecap="round" />

          {/* Schnurrhaare */}
          <G stroke="#8F879C" strokeWidth={1.4} strokeLinecap="round" opacity={0.7}>
            <Path d="M62 104 L44 100" />
            <Path d="M62 108 L45 112" />
            <Path d="M138 104 L156 100" />
            <Path d="M138 108 L155 112" />
          </G>

          {/* Schleife in der Lieblingsfarbe */}
          {female && (
            <G>
              <Path d="M130 48 L108 34 L111 62 Z" fill={color} />
              <Path d="M130 48 L152 34 L150 62 Z" fill={color} />
              <Circle cx="130" cy="48" r="6.5" fill={color} />
              <Circle cx="130" cy="48" r="6.5" fill="#000000" opacity={0.15} />
            </G>
          )}

          {/* Stimmung: Kuscheldecke oder Wärmflasche */}
          {mood === 'cozy' && (
            <G>
              <Path d="M44 150 Q100 128 156 150 L160 186 Q100 196 40 186 Z" fill="#CFC3EA" />
              <Path d="M44 150 Q100 128 156 150" stroke="#B5A6DC" strokeWidth={4} fill="none" />
            </G>
          )}
          {mood === 'period' && (
            <G>
              <Rect x="78" y="140" width="44" height="38" rx="10" fill="#F28C9E" />
              <Rect x="93" y="132" width="14" height="10" rx="3" fill="#E8607D" />
              <Path d="M86 152 H114 M86 160 H114 M86 168 H114" stroke="#E8607D" strokeWidth={2} strokeLinecap="round" />
            </G>
          )}
        </Svg>
      </Animated.View>
    </Pressable>
  );
}
