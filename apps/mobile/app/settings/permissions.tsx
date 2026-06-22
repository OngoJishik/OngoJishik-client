import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Switch, AppState, AppStateStatus, Platform, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  Text,
  useTheme,
} from '@ongo/ui';
import { colors as designColors } from '@ongo/ui';

/**
 * 권한 설정 화면 컴포넌트
 * 알림 권한 및 사진 라이브러리 권한의 실제 OS 상태를 감지하고 설정할 수 있는 UI를 제공합니다.
 * @author Antigravity
 */
export const PermissionSettingsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [photoEnabled, setPhotoEnabled] = useState(false);

  // Switch Colors aligned with Figma spec
  const trackColorConfig = {
    false: designColors.toggle.trackInactive,
    true: designColors.toggle.trackActive,
  };
  const thumbColorConfig = (value: boolean) =>
    value ? designColors.primary.DEFAULT : designColors.toggle.thumbInactive;

  /**
   * 실제 기기의 권한 상태를 조회하여 React 상태를 동기화합니다.
   */
  const checkAllPermissions = useCallback(async () => {
    try {
      // 1. 알림 권한 조회
      const notificationSettings = await Notifications.getPermissionsAsync();
      setNotificationEnabled(notificationSettings.granted);

      // 2. 사진 권한 조회
      const photoSettings = await ImagePicker.getMediaLibraryPermissionsAsync();
      setPhotoEnabled(photoSettings.granted);
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to check permission status:', error);
      }
    }
  }, []);

  // 1. 최초 마운트 시 권한상태 조회
  useEffect(() => {
    checkAllPermissions();
  }, [checkAllPermissions]);

  // 2. 앱이 백그라운드에 있다가 포그라운드로 돌아왔을 때 권한 상태 최신화
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkAllPermissions();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [checkAllPermissions]);

  /**
   * 알림 권한 토글 핸들러
   */
  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      // 꺼짐 -> 켜짐 시도
      try {
        const requestResult = await Notifications.requestPermissionsAsync();
        if (requestResult.granted) {
          setNotificationEnabled(true);
        } else {
          // 권한이 거부된 경우 설정창 안내 얼럿 노출
          Alert.alert(
            t('permissions.guideTitle', '권한 설정 안내'),
            t('permissions.guideNotificationOn'),
            [
              { text: t('common.cancel', '취소'), style: 'cancel' },
              {
                text: t('common.confirm', '확인'),
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ]
          );
        }
      } catch (error) {
        if (__DEV__) {
          console.error('Request notification permission error:', error);
        }
      }
    } else {
      // 켜짐 -> 꺼짐 시도
      // OS 수준에서 직접 끌 수 없으므로 시스템 설정 이동 안내 노출
      Alert.alert(
        t('permissions.guideTitle', '권한 설정 안내'),
        t('permissions.guideNotificationOff'),
        [
          { text: t('common.cancel', '취소'), style: 'cancel' },
          {
            text: t('common.confirm', '확인'),
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
    }
  };

  /**
   * 사진 권한 토글 핸들러
   */
  const handlePhotoToggle = async (value: boolean) => {
    if (value) {
      // 꺼짐 -> 켜짐 시도
      try {
        const requestResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (requestResult.granted) {
          setPhotoEnabled(true);
        } else {
          // 권한이 거부된 경우 설정창 안내 얼럿 노출
          Alert.alert(
            t('permissions.guideTitle', '권한 설정 안내'),
            t('permissions.guidePhotoOn'),
            [
              { text: t('common.cancel', '취소'), style: 'cancel' },
              {
                text: t('common.confirm', '확인'),
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ]
          );
        }
      } catch (error) {
        if (__DEV__) {
          console.error('Request photo permission error:', error);
        }
      }
    } else {
      // 켜짐 -> 꺼짐 시도
      // OS 수준에서 직접 끌 수 없으므로 시스템 설정 이동 안내 노출
      Alert.alert(
        t('permissions.guideTitle', '권한 설정 안내'),
        t('permissions.guidePhotoOff'),
        [
          { text: t('common.cancel', '취소'), style: 'cancel' },
          {
            text: t('common.confirm', '확인'),
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
    }
  };

  return (
    <ScreenLayout>
      <Header title={t('permissions.title', '권한 설정')} onBack={() => router.back()} />

      <View style={styles.list}>
        {/* 알림 권한 */}
        <View style={[styles.item, { borderBottomColor: colors.border }]}>
          <View style={styles.meta}>
            <Text variant="label" bold>
              {t('permissions.notificationTitle', '알림 권한')}
            </Text>
            <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 4 }}>
              {t('permissions.notificationDesc')}
            </Text>
          </View>
          <Switch
            value={notificationEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={trackColorConfig}
            thumbColor={thumbColorConfig(notificationEnabled)}
          />
        </View>

        {/* 사진 및 미디어 권한 */}
        <View style={[styles.item, { borderBottomColor: colors.border }]}>
          <View style={styles.meta}>
            <Text variant="label" bold>
              {t('permissions.photoTitle', '사진 및 미디어 권한')}
            </Text>
            <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 4 }}>
              {t('permissions.photoDesc')}
            </Text>
          </View>
          <Switch
            value={photoEnabled}
            onValueChange={handlePhotoToggle}
            trackColor={trackColorConfig}
            thumbColor={thumbColorConfig(photoEnabled)}
          />
        </View>
      </View>
    </ScreenLayout>
  );
};

export { PermissionSettingsScreen as default };

const styles = StyleSheet.create({
  list: {
    marginTop: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  meta: {
    flex: 1,
    marginRight: 16,
  },
});
