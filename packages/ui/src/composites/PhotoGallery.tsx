import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';

import { useTheme } from '../../theme/useTheme';
import { Text } from '../primitives/Text';

export interface PhotoGalleryProps {
  images: string[];
}

/**
 * 커뮤니티 게시글의 여러 사진을 스와이프 형식으로 보여주는 갤러리 컴포넌트
 * @author Antigravity
 */
export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images }) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: screenWidth } = useWindowDimensions();
  const galleryWidth = screenWidth - 32;

  if (!images || images.length === 0) {
    return null;
  }

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(contentOffsetX / viewSize);
    setCurrentIndex(index);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.primaryLight, width: galleryWidth }]}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={[styles.image, { width: galleryWidth }]}
            contentFit="cover"
          />
        )}
      />
      <View style={styles.indicator}>
        <Text style={styles.indicatorText}>
          {currentIndex + 1}/{images.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 12,
  },
  image: {
    height: 240,
  },
  indicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  indicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
