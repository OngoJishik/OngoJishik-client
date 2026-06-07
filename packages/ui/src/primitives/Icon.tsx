import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

export interface IconProps extends Omit<RNTextProps, 'children'> {
  name:
    | 'home'
    | 'search'
    | 'history'
    | 'community'
    | 'mypage'
    | 'back'
    | 'share'
    | 'heart'
    | 'heart-filled'
    | 'bell'
    | 'mic'
    | 'close'
    | 'write'
    | 'settings'
    | 'chevron-right'
    | 'thumbs-up'
    | 'thumbs-down'
    | 'star'
    | 'star-filled'
    | 'info';
  size?: number;
  color?: string;
}

const iconMap: Record<IconProps['name'], string> = {
  home: '🏠',
  search: '🔍',
  history: '📖',
  community: '💬',
  mypage: '👤',
  back: '←',
  share: '↗',
  heart: '♡',
  'heart-filled': '❤️',
  bell: '🔔',
  mic: '🎤',
  close: '✕',
  write: '✏️',
  settings: '⚙️',
  'chevron-right': '→',
  'thumbs-up': '👍',
  'thumbs-down': '👎',
  star: '☆',
  'star-filled': '★',
  info: 'ℹ️',
};

export const Icon: React.FC<IconProps> = ({ name, size = 20, color, style, ...props }) => {
  const symbol = iconMap[name] || '•';

  return (
    <RNText
      style={[
        {
          fontSize: size,
          color: color || '#1C1A16',
          textAlign: 'center',
        },
        style,
      ]}
      {...props}
    >
      {symbol}
    </RNText>
  );
};
