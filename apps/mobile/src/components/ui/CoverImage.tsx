import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Images } from '@/constants/images';

interface Props {
  uri: string;
  style?: StyleProp<ViewStyle>;
  fallbackUri?: string;
}

/** Full-bleed cover image with loading placeholder and fallback. */
export default function CoverImage({
  uri,
  style,
  fallbackUri = Images.hero_farm_aerial,
}: Props) {
  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <Image
        source={{ uri }}
        placeholder={{ uri: fallbackUri }}
        placeholderContentFit="cover"
        contentFit="cover"
        style={StyleSheet.absoluteFill}
        transition={300}
        cachePolicy="memory-disk"
      />
    </View>
  );
}
