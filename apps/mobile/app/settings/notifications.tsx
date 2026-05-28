import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ScreenLayout,
  Header,
  Text,
} from '@ongo/ui';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [favoriteAlerts, setFavoriteAlerts] = useState(true);
  const [marketingAlerts, setMarketingAlerts] = useState(false);

  return (
    <ScreenLayout>
      <Header title="알림 설정" onBack={() => router.back()} />

      <View style={styles.list}>
        <View style={styles.item}>
          <View style={styles.meta}>
            <Text variant="label" bold>
              푸시 알림 받기
            </Text>
            <Text variant="caption">앱에서 보내는 중요 공지 및 푸시 알림</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#D4CFC6', true: '#FFC4A8' }}
            thumbColor={pushEnabled ? '#C85A28' : '#F5F3EF'}
          />
        </View>

        <View style={styles.item}>
          <View style={styles.meta}>
            <Text variant="label" bold>
              즐겨찾기 보양 알림
            </Text>
            <Text variant="caption">즐겨찾기한 전통 요리 추천 및 역사 스토리 알림</Text>
          </View>
          <Switch
            value={favoriteAlerts}
            onValueChange={setFavoriteAlerts}
            trackColor={{ false: '#D4CFC6', true: '#FFC4A8' }}
            thumbColor={favoriteAlerts ? '#C85A28' : '#F5F3EF'}
          />
        </View>

        <View style={styles.item}>
          <View style={styles.meta}>
            <Text variant="label" bold>
              마케팅 정보 수신
            </Text>
            <Text variant="caption">이벤트, 혜택 정보 및 전통 요리 탐구 정보 알림</Text>
          </View>
          <Switch
            value={marketingAlerts}
            onValueChange={setMarketingAlerts}
            trackColor={{ false: '#D4CFC6', true: '#FFC4A8' }}
            thumbColor={marketingAlerts ? '#C85A28' : '#F5F3EF'}
          />
        </View>
      </View>
    </ScreenLayout>
  );
}

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
    borderBottomColor: '#E8E4DD',
  },
  meta: {
    flex: 1,
    marginRight: 16,
  },
});
