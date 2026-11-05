
import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Card } from './UI';
import { C } from '../../theme/tokens';

type Props = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  features: string[];
};

export default function ModuleScreen({
  title,
  subtitle,
  icon,
  features,
}: Props) {
  return (
    <Screen>
      <Header eyebrow="OGRE // PERFORMANCE SYSTEM" title={title} />

      <Card style={{ marginBottom: 20, backgroundColor: C.deep }}>
        <Ionicons name={icon} size={34} color={C.electric} />
        <Text style={{ color: C.text, fontSize: 22, fontWeight: '900', marginTop: 15 }}>
          {title.toUpperCase()}
        </Text>
        <Text style={{ color: C.silver, fontSize: 12, marginTop: 7, lineHeight: 19 }}>
          {subtitle}
        </Text>
      </Card>

      <Text style={{ color: C.text, fontWeight: '900', fontSize: 14, marginBottom: 12 }}>
        YOUR TOOLS
      </Text>

      {features.map((feature, index) => (
        <Card key={feature} style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 13 }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.deep, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: C.electric, fontWeight: '900' }}>{String(index + 1).padStart(2, '0')}</Text>
          </View>
          <Text style={{ color: C.text, fontSize: 13, fontWeight: '700', flex: 1 }}>
            {feature}
          </Text>
          <Ionicons name="chevron-forward" color={C.muted} size={18} />
        </Card>
      ))}

      <Text style={{ color: C.muted, fontSize: 10, textAlign: 'center', marginTop: 20 }}>
        OGRE MODULE · FEATURE DEVELOPMENT IN PROGRESS
      </Text>
    </Screen>
  );
}
