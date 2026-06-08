import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';

import { useTheme } from '../../../theme/useTheme';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: number | `${number}%`;
};

const ANIM_DURATION = 250;
const TRANSLATE_Y_INITIAL = 600;

/**
 * 오버레이 페이드인 + 시트 슬라이드업 애니메이션이 적용된 바텀시트 공통 컴포넌트
 * @author Antigravity
 */
export const BottomSheet = ({ visible, onClose, children, maxHeight }: BottomSheetProps) => {
  const { colors } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const isMountedRef = useRef(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(TRANSLATE_Y_INITIAL)).current;

  useEffect(() => {
    if (visible) {
      overlayOpacity.setValue(0);
      sheetTranslateY.setValue(TRANSLATE_Y_INITIAL);
      isMountedRef.current = true;
      setIsMounted(true);
      // open animation은 Modal의 onShow에서 실행 (Modal이 실제 렌더된 후)
    } else if (isMountedRef.current) {
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: true }),
        Animated.timing(sheetTranslateY, { toValue: TRANSLATE_Y_INITIAL, duration: ANIM_DURATION, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) {
          isMountedRef.current = false;
          setIsMounted(false);
        }
      });
    }
  }, [visible, overlayOpacity, sheetTranslateY]);

  const handleShow = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 1, duration: ANIM_DURATION, useNativeDriver: true }),
      Animated.timing(sheetTranslateY, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      onShow={handleShow}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: colors.background, transform: [{ translateY: sheetTranslateY }] },
            maxHeight != null && { maxHeight },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
});
