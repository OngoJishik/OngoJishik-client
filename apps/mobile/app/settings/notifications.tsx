import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  Text,
  useTheme,
} from '@ongo/ui';
import { colors as designColors } from '@ongo/ui';

/**
 * 알림 설정 화면 컴포넌트
 * 푸시 알림, 즐겨찾기 알림, 마케팅 알림 설정을 관리하며 토글 스위치 형태의 UI를 제공합니다.
 * @author Antigravity
 */
export const NotificationSettingsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [favoriteAlerts, setFavoriteAlerts] = useState(true);
  const [marketingAlerts, setMarketingAlerts] = useState(false);

  // Switch Colors aligned with Figma spec (active: brand primary red, inactive: grey/border)
  const trackColorConfig = {
    false: designColors.toggle.trackInactive,
    true: designColors.toggle.trackActive,
  };
  const thumbColorConfig = (value: boolean) => 
    value ? designColors.primary.DEFAULT : designColors.toggle.thumbInactive;

  return (
    <ScreenLayout>
      <Header title={t('notifications.title')} onBack={() => router.back()} />

      <View style={styles.list}>
        <View style={[styles.item, { borderBottomColor: colors.border }]}>
          <View style={styles.meta}>
            <Text variant="label" bold>
              {t('notifications.pushTitle')}
            </Text>
            <Text variant="caption" style={{ color: colors.textSecondary }}>{t('notifications.pushDesc')}</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={trackColorConfig}
            thumbColor={thumbColorConfig(pushEnabled)}
          />
        </View>

        <View style={[styles.item, { borderBottomColor: colors.border }]}>
          <View style={styles.meta}>
            <Text variant="label" bold>
              {t('notifications.favoriteTitle')}
            </Text>
            <Text variant="caption" style={{ color: colors.textSecondary }}>{t('notifications.favoriteDesc')}</Text>
          </View>
          <Switch
            value={favoriteAlerts}
            onValueChange={setFavoriteAlerts}
            trackColor={trackColorConfig}
            thumbColor={thumbColorConfig(favoriteAlerts)}
          />
        </View>

        <View style={[styles.item, { borderBottomColor: colors.border }]}>
          <View style={styles.meta}>
            <Text variant="label" bold>
              {t('notifications.marketingTitle')}
            </Text>
            <Text variant="caption" style={{ color: colors.textSecondary }}>{t('notifications.marketingDesc')}</Text>
          </View>
          <Switch
            value={marketingAlerts}
            onValueChange={setMarketingAlerts}
            trackColor={trackColorConfig}
            thumbColor={thumbColorConfig(marketingAlerts)}
          />
        </View>
      </View>
    </ScreenLayout>
  );
};

export { NotificationSettingsScreen as default };

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
