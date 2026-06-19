import React from 'react';
import { Tabs } from 'expo-router';
import { useAtomValue } from 'jotai';

import { useTranslation } from '@ongo/i18n';
import { BottomNav, NavItem } from '@ongo/ui';
import { isHomeSearchActiveAtom } from '@ongo/store';

export function TabLayout() {
  const { t } = useTranslation();
  const isSearchActive = useAtomValue(isHomeSearchActiveAtom);

  const navItems: NavItem[] = [
    { key: 'index', label: t('tabs.home'), iconName: 'home' },
    { key: 'community', label: t('tabs.community'), iconName: 'community' },
    { key: 'mypage', label: t('tabs.mypage'), iconName: 'mypage' },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, navigation }) => {
        if (isSearchActive) {
          return null;
        }
        
        const activeKey = state.routes[state.index].name;
        
        const handleSelect = (key: string) => {
          navigation.navigate(key);
        };

        // Map standard item keys to match tab navigation route names
        const mappedItems = navItems.map(item => ({
          ...item,
          // If the key is 'index', it represents the tab home '/'
          key: item.key === 'index' ? 'index' : item.key,
        }));

        const activeItemKey = activeKey === 'index' ? 'index' : activeKey;

        return (
          <BottomNav
            items={mappedItems}
            activeKey={activeItemKey}
            onSelect={handleSelect}
          />
        );
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="community" />
      <Tabs.Screen name="mypage" />
    </Tabs>
  );
}

export { TabLayout as default };
