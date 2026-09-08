import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { T } from '../../src/components/ui';
import { useApp } from '../../src/store/AppProvider';
import { colors } from '../../src/theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <T size={focused ? 24 : 21}>{emoji}</T>;
}

export default function TabsLayout() {
  const { ready, signedIn, account, t } = useApp();

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.teal} size="large" />
      </View>
    );
  }

  // The tab group is the private area of the app: never render it signed out.
  if (!signedIn) return <Redirect href="/" />;
  if (!account?.onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.tealLine,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabHome'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: t('tabGames'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎲" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t('tabProgress'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="📈" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: t('tabReminders'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="⏰" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabProfile'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
      {/* Reachable from Home and Profile, but not a tab of its own. */}
      <Tabs.Screen name="caregiver" options={{ href: null, title: 'Caregiver' }} />
    </Tabs>
  );
}
