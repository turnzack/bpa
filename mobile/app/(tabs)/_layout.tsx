import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.navBar,
            borderTopColor: '#1A1A1A',
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 5,
          },
          tabBarActiveTintColor: Colors.accentBlue,
          tabBarInactiveTintColor: Colors.iconInactive,
          tabBarLabelStyle: {
            fontSize: 10,
            marginBottom: 5,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Assistant',
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'Clients',
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "people" : "people-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: 'Bibliothèque',
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "library" : "library-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Compte',
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null, // Hide settings from tab bar but keep the route
          }}
        />
    </Tabs>
  );
}
