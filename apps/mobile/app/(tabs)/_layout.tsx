import React from 'react';
import { Tabs } from 'expo-router';
import { BottomNav, NavItem } from '@ongo/ui';

const navItems: NavItem[] = [
  { key: 'index', label: '홈', iconName: 'home' },
  { key: 'search', label: '검색', iconName: 'search' },
  { key: 'history', label: '역사', iconName: 'history' },
  { key: 'community', label: '커뮤니티', iconName: 'community' },
  { key: 'mypage', label: '마이', iconName: 'mypage' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, navigation }) => {
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
      <Tabs.Screen name="search" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="community" />
      <Tabs.Screen name="mypage" />
    </Tabs>
  );
}
