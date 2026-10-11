import React from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { wayuuglishSvg } from '../assets/wayuuglishSvg';

interface WayuuglishLogoProps {
  width?: number;
  height?: number;
}

export const WayuuglishLogo: React.FC<WayuuglishLogoProps> = ({
  width = 150,
  height = 34,
}) => {
  return (
    <View style={{ width, height, justifyContent: 'center' }}>
      <SvgXml xml={wayuuglishSvg} width={width} height={height} />
    </View>
  );
};
