'use strict';
const fs   = require('fs');
const path = require('path');

// ─── helpers ──────────────────────────────────────────────────────────────────
function write(base, relPath, content) {
  const full = path.join(base, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf-8');
}
function hex2rgb(hex) {
  const h = hex.replace('#','');
  const n = parseInt(h.length===3 ? h.split('').map(x=>x+x).join('') : h, 16);
  return `${(n>>16)&255}, ${(n>>8)&255}, ${n&255}`;
}

// ─── package.json ─────────────────────────────────────────────────────────────
function genPackage(name, features=[]) {
  const deps = {
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.5",
    "nativewind": "^4.0.1",
    "tailwindcss": "3.4.3",
    "zustand": "^4.5.2",
    "@tanstack/react-query": "^5.40.0",
    "@expo/vector-icons": "^14.0.2",
    "react-native-safe-area-context": "4.10.5",
    "react-native-screens": "~3.31.1",
    "expo-font": "~12.0.9",
    "expo-splash-screen": "~0.27.5",
    "expo-constants": "~16.0.2"
  };
  if (features.includes('api'))      deps["axios"] = "^1.7.2";
  if (features.includes('camera'))   deps["expo-camera"] = "~15.0.15";
  if (features.includes('map'))      deps["react-native-maps"] = "1.14.0";
  if (features.includes('upload'))   deps["expo-image-picker"] = "~15.0.7";
  if (features.includes('realtime')) deps["@supabase/supabase-js"] = "^2.43.4";
  return JSON.stringify({
    name: name.toLowerCase().replace(/[^a-z0-9-]/g,'-'),
    version: "1.0.0",
    main: "expo-router/entry",
    scripts: {
      start: "expo start",
      android: "expo start --android",
      ios: "expo start --ios",
      web: "expo start --web",
      "type-check": "tsc --noEmit",
      lint: "eslint src --ext .ts,.tsx"
    },
    dependencies: deps,
    devDependencies: {
      "@babel/core": "^7.24.0",
      "@types/react": "~18.2.79",
      "typescript": "^5.3.3",
      "eslint": "^8.57.0",
      "@typescript-eslint/eslint-plugin": "^7.13.0"
    }
  }, null, 2);
}

// ─── app.json ─────────────────────────────────────────────────────────────────
function genAppJson(name, tokens) {
  return JSON.stringify({
    expo: {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9-]/g,'-'),
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "automatic",
      splash: { image: "./assets/splash.png", resizeMode: "contain", backgroundColor: tokens.background },
      ios: { supportsTablet: false, bundleIdentifier: `com.sovereign.${name.toLowerCase().replace(/[^a-z0-9]/g,'')}` },
      android: { adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: tokens.background }, package: `com.sovereign.${name.toLowerCase().replace(/[^a-z0-9]/g,'')}` },
      web: { favicon: "./assets/favicon.png" },
      plugins: ["expo-router", "expo-font"],
      scheme: name.toLowerCase().replace(/[^a-z0-9]/g,''),
      experiments: { typedRoutes: true }
    }
  }, null, 2);
}

// ─── tsconfig.json ─────────────────────────────────────────────────────────────
const TSCONFIG = JSON.stringify({
  extends: "expo/tsconfig.base",
  compilerOptions: {
    strict: true,
    paths: { "@/*": ["./src/*"] }
  },
  include: ["**/*.ts","**/*.tsx",".expo/types/**/*.d.ts","expo-env.d.ts"]
}, null, 2);

// ─── babel.config.js ──────────────────────────────────────────────────────────
const BABEL = `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};`;

// ─── metro.config.js ──────────────────────────────────────────────────────────
const METRO = `const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './src/global.css' });`;

// ─── tailwind.config.js ───────────────────────────────────────────────────────
function genTailwind(tokens) {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}","./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary:    '${tokens.primary}',
        secondary:  '${tokens.secondary}',
        background: '${tokens.background}',
        surface:    '${tokens.surface}',
        foreground: '${tokens.text}',
        muted:      '${tokens.textMuted}',
        danger:     '${tokens.error}',
        success:    '${tokens.success}',
      },
      fontFamily: { sans: ['${tokens.fontFamily}'] },
    },
  },
  plugins: [],
};`;
}

// ─── global.css ───────────────────────────────────────────────────────────────
function genGlobalCss(tokens) {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary:    ${tokens.primary};
  --secondary:  ${tokens.secondary};
  --background: ${tokens.background};
  --surface:    ${tokens.surface};
  --text:       ${tokens.text};
  --muted:      ${tokens.textMuted};
  --error:      ${tokens.error};
  --success:    ${tokens.success};
  --radius:     ${tokens.borderRadius};
}`;
}

// ─── expo-env.d.ts ────────────────────────────────────────────────────────────
const EXPO_ENV = `/// <reference types="expo-router/types" />`;

// ─── src/global.css ───────────────────────────────────────────────────────────
// (same as root global.css but in src/)

// ─── DESIGN SYSTEM ───────────────────────────────────────────────────────────
function genColors(tokens) {
  return `export const Colors = {
  primary:    '${tokens.primary}',
  secondary:  '${tokens.secondary}',
  background: '${tokens.background}',
  surface:    '${tokens.surface}',
  text:       '${tokens.text}',
  textMuted:  '${tokens.textMuted}',
  error:      '${tokens.error}',
  success:    '${tokens.success}',
  white:      '#FFFFFF',
  black:      '#000000',
} as const;
export type ColorKey = keyof typeof Colors;`;
}

function genSpacing() {
  return `export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
} as const;
export const Radius = {
  sm: 6, md: 10, lg: 16, full: 9999,
} as const;`;
}

function genTypography(tokens) {
  return `import { StyleSheet } from 'react-native';
export const Typography = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: '400' },
  button: { fontSize: 16, fontWeight: '600' },
});`;
}

function genButtonComponent(tokens) {
  return `import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../colors';

type Variant = 'primary'|'secondary'|'outline'|'ghost'|'destructive';
interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({ title, onPress, variant='primary', loading=false, disabled=false }: Props) {
  const bg: Record<Variant,string> = {
    primary:     Colors.primary,
    secondary:   Colors.secondary,
    outline:     'transparent',
    ghost:       'transparent',
    destructive: Colors.error,
  };
  const txtColor: Record<Variant,string> = {
    primary:     '#fff',
    secondary:   '#fff',
    outline:     Colors.primary,
    ghost:       Colors.text,
    destructive: '#fff',
  };
  const border = variant==='outline' ? { borderWidth:1.5, borderColor:Colors.primary } : {};

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled||loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg[variant], opacity: pressed||disabled ? 0.7 : 1 },
        border,
      ]}
    >
      {loading
        ? <ActivityIndicator color={txtColor[variant]} />
        : <Text style={[styles.label, { color:txtColor[variant] }]}>{title}</Text>
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base:  { height:48, borderRadius:10, alignItems:'center', justifyContent:'center', paddingHorizontal:20 },
  label: { fontSize:16, fontWeight:'600' },
});`;
}

function genScreenComponent(tokens) {
  return `import React from 'react';
import { SafeAreaView, View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Colors } from '../colors';

interface Props {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: object;
}

export function Screen({ children, scrollable=false, style }: Props) {
  const Inner = scrollable ? ScrollView : View;
  return (
    <SafeAreaView style={[styles.safe, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <Inner style={styles.content} contentContainerStyle={scrollable ? styles.scroll : undefined}>
        {children}
      </Inner>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex:1, backgroundColor: Colors.background },
  content: { flex:1 },
  scroll:  { flexGrow:1, paddingBottom:24 },
});`;
}

function genCardComponent(tokens) {
  return `import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../colors';

interface Props {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: object;
}

export function Card({ title, subtitle, onPress, children, style }: Props) {
  const Container = onPress ? Pressable : View;
  return (
    <Container
      style={({ pressed }) => [styles.card, style, onPress && { opacity: pressed ? 0.85 : 1 }]}
      {...(onPress ? { onPress } : {})}
    >
      {title    && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card:     { backgroundColor:Colors.surface, borderRadius:12, padding:16, marginVertical:6, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, shadowOffset:{width:0,height:2}, elevation:2 },
  title:    { fontSize:16, fontWeight:'600', color:Colors.text, marginBottom:4 },
  subtitle: { fontSize:13, color:Colors.textMuted },
});`;
}

function genInputComponent(tokens) {
  return `import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../colors';

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (v:string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default'|'email-address'|'numeric'|'phone-pad';
}

export function Input({ label, placeholder, value, onChangeText, secureTextEntry=false, error, keyboardType='default' }: Props) {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.row, error && styles.rowError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !show}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShow(v=>!v)} style={styles.eye}>
            <Ionicons name={show ? 'eye-off' : 'eye'} size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:  { marginBottom:16 },
  label:    { fontSize:14, fontWeight:'500', color:Colors.text, marginBottom:6 },
  row:      { flexDirection:'row', alignItems:'center', borderWidth:1.5, borderColor:'#E2E8F0', borderRadius:10, paddingHorizontal:14, height:48, backgroundColor:Colors.surface },
  rowError: { borderColor:Colors.error },
  input:    { flex:1, fontSize:16, color:Colors.text },
  eye:      { paddingLeft:8 },
  error:    { fontSize:12, color:Colors.error, marginTop:4 },
});`;
}

function genHeaderComponent(tokens) {
  return `import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../colors';

interface Props {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

export function Header({ title, showBack=false, right }: Props) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack && (
          <Pressable onPress={() => router.back()} style={styles.back} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </Pressable>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection:'row', alignItems:'center', height:56, paddingHorizontal:16, backgroundColor:Colors.background, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#E2E8F0' },
  left:   { width:48, alignItems:'flex-start' },
  right:  { width:48, alignItems:'flex-end' },
  title:  { flex:1, textAlign:'center', fontSize:17, fontWeight:'600', color:Colors.text },
  back:   { padding:4 },
});`;
}

// ─── ROOT LAYOUT ─────────────────────────────────────────────────────────────
function genRootLayout(nav, tokens) {
  const hasTabs = nav.hasBottomBar || nav.type.includes('tabs');
  return `import { useEffect } from 'react';
import { Stack, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import '../src/global.css';

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => { SplashScreen.hideAsync(); }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      ${hasTabs ? '<Tabs screenOptions={{ headerShown:false, tabBarStyle:{ backgroundColor:"'+tokens.background+'" } }}>' : '<Stack screenOptions={{ headerShown:false }}>'}
      ${hasTabs ? '</Tabs>' : '</Stack>'}
    </QueryClientProvider>
  );
}`;
}

// ─── INDEX SCREEN ─────────────────────────────────────────────────────────────
function genIndexScreen(spec) {
  const firstScreen = spec.screens[0];
  return `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Screen } from '@/design-system/Screen';
import { Button } from '@/design-system/Button';
import { Card } from '@/design-system/Card';
import { Colors } from '@/design-system/colors';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <Screen scrollable>
      <View style={styles.container}>
        <Text style={styles.title}>${firstScreen?.title || spec.projectName}</Text>
        <Text style={styles.subtitle}>Bienvenue dans votre application</Text>
        ${spec.screens.slice(1, 4).map(s =>
          `<Card title="${s.title}" subtitle="Accéder à ${s.title}" onPress={() => router.push('${s.route}')} />`
        ).join('\n        ')}
        <Button title="Commencer" onPress={() => {}} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  title:     { fontSize:28, fontWeight:'700', color:Colors.text, marginBottom:8, marginTop:24 },
  subtitle:  { fontSize:16, color:Colors.textMuted, marginBottom:24 },
});`;
}

// ─── ZUSTAND STORE ────────────────────────────────────────────────────────────
function genAppStore(name) {
  return `import { create } from 'zustand';

interface AppState {
  isLoading:   boolean;
  user:        null | { id:string; name:string; email:string };
  setLoading:  (v:boolean) => void;
  setUser:     (u:AppState['user']) => void;
  logout:      () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  user:      null,
  setLoading: (isLoading) => set({ isLoading }),
  setUser:    (user)      => set({ user }),
  logout:     ()          => set({ user:null }),
}));`;
}

// ─── API CLIENT ──────────────────────────────────────────────────────────────
function genApiClient() {
  return `import { create } from 'zustand';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com';

interface RequestOptions {
  method?: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
  body?: unknown;
  headers?: Record<string,string>;
}

export async function apiRequest<T = unknown>(endpoint: string, opts: RequestOptions = {}): Promise<T> {
  const { method='GET', body, headers={} } = opts;
  const res = await fetch(\`\${BASE_URL}\${endpoint}\`, {
    method,
    headers: { 'Content-Type':'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Erreur réseau');
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(ep:string, h={}) => apiRequest<T>(ep, { method:'GET', headers:h }),
  post:   <T>(ep:string, b:unknown) => apiRequest<T>(ep, { method:'POST', body:b }),
  put:    <T>(ep:string, b:unknown) => apiRequest<T>(ep, { method:'PUT', body:b }),
  delete: <T>(ep:string) => apiRequest<T>(ep, { method:'DELETE' }),
};`;
}

// ─── .env ─────────────────────────────────────────────────────────────────────
const DOTENV = `EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_NAME=MonApplication`;

// ─── README ──────────────────────────────────────────────────────────────────
function genReadme(spec) {
  const routes = spec.screens.map(s => `- \`${s.route}\` → ${s.title}`).join('\n');
  return `# ${spec.projectName}

Projet Expo React Native généré par Tiger IA — Moteur Souverain.

## Stack
- Expo ~51 + Expo Router
- TypeScript strict
- NativeWind (Tailwind → React Native)
- Zustand (state)
- TanStack Query (data fetching)
- @expo/vector-icons (Ionicons)

## Installation
\`\`\`bash
pnpm install
npx expo start
\`\`\`

## Routes (Expo Router)
${routes}

## Design Tokens
- Primary : ${spec.designTokens.primary}
- Background : ${spec.designTokens.background}
- Font : ${spec.designTokens.fontFamily}

---
*Généré le ${new Date().toLocaleDateString('fr-FR')}*`;
}

// ─── MAIN SCAFFOLD FUNCTION ───────────────────────────────────────────────────
/**
 * Scaffolde un projet Expo complet dans projectDir.
 * @param {string} projectDir  Chemin absolu du dossier cible
 * @param {import('./stitch-parser').StitchSpec} spec
 * @returns {{ files: string[], warnings: string[] }}
 */
function scaffold(projectDir, spec) {
  const { projectName, designTokens: tokens, navigation, features, screens } = spec;
  const files    = [];
  const warnings = [];

  const w = (rel, content) => { write(projectDir, rel, content); files.push(rel); };

  // Root config files
  w('package.json',      genPackage(projectName, features));
  w('app.json',          genAppJson(projectName, tokens));
  w('tsconfig.json',     TSCONFIG);
  w('babel.config.js',   BABEL);
  w('metro.config.js',   METRO);
  w('tailwind.config.js',genTailwind(tokens));
  w('global.css',        genGlobalCss(tokens));
  w('expo-env.d.ts',     EXPO_ENV);
  w('.env',              DOTENV);

  // Expo Router app layout
  w('app/_layout.tsx',   genRootLayout(navigation, tokens));
  w('app/index.tsx',     genIndexScreen(spec));

  // Generate a screen file per detected screen (skip home = index)
  for (const screen of screens.slice(1)) {
    const fname = screen.name.replace(/\//g,'-');
    w(`app/${fname}.tsx`, genScreenFile(screen, tokens));
  }

  // src/global.css (NativeWind entry)
  w('src/global.css', genGlobalCss(tokens));

  // Design system
  w('src/design-system/colors.ts',   genColors(tokens));
  w('src/design-system/spacing.ts',  genSpacing());
  w('src/design-system/typography.ts', genTypography(tokens));
  w('src/design-system/Button.tsx',  genButtonComponent(tokens));
  w('src/design-system/Screen.tsx',  genScreenComponent(tokens));
  w('src/design-system/Card.tsx',    genCardComponent(tokens));
  w('src/design-system/Input.tsx',   genInputComponent(tokens));
  w('src/design-system/Header.tsx',  genHeaderComponent(tokens));
  w('src/design-system/index.ts',    `export * from './colors';\nexport * from './spacing';\nexport * from './typography';\nexport { Button } from './Button';\nexport { Screen } from './Screen';\nexport { Card } from './Card';\nexport { Input } from './Input';\nexport { Header } from './Header';`);

  // Stores
  w('src/stores/useAppStore.ts', genAppStore(projectName));

  // Services
  if (features.includes('api')) {
    w('src/services/api.ts', genApiClient());
  } else {
    w('src/services/api.ts', '// API client — à configurer\nexport {};');
  }

  // Hooks placeholder
  w('src/hooks/index.ts', '// Hooks personnalisés\nexport {};');

  // Types
  w('src/types/index.ts', `export interface User { id:string; name:string; email:string; }\nexport interface ApiResponse<T> { data:T; success:boolean; message?:string; }`);

  // Assets placeholder (empty file so dossier existe)
  w('assets/.gitkeep', '');

  // README
  w('README.md', genReadme(spec));

  return { files, warnings };
}

/** Génère un écran générique à partir d'un Screen de la spec. */
function genScreenFile(screen, tokens) {
  const title    = screen.title;
  const elements = screen.elements || [];
  const inputs   = elements.filter(e=>e.type==='input');
  const buttons  = elements.filter(e=>e.type==='button');
  const headings = elements.filter(e=>e.type==='heading');

  return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/design-system/Screen';
import { Header } from '@/design-system/Header';
import { Button } from '@/design-system/Button';
${inputs.length ? "import { Input } from '@/design-system/Input';" : ''}
import { Colors } from '@/design-system/colors';

export default function ${toPascal(screen.name)}Screen() {
  return (
    <Screen scrollable>
      <Header title="${title}" showBack />
      <View style={styles.container}>
        ${headings.map(h=>`<Text style={styles.heading}>${h.text}</Text>`).join('\n        ')}
        ${inputs.map(i=>`<Input label="${i.placeholder||i.name||'Champ'}" placeholder="${i.placeholder||''}" value="" onChangeText={()=>{}} />`).join('\n        ')}
        ${buttons.map(b=>`<Button title="${b.text}" onPress={()=>{}} variant="${b.variant||'primary'}" />`).join('\n        ')}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  heading:   { fontSize:22, fontWeight:'700', color:Colors.text, marginBottom:12 },
});`;
}

function toPascal(str) {
  return str.replace(/(^\w|-\w)/g, m => m.replace('-','').toUpperCase());
}

module.exports = { scaffold, genPackage, genAppJson, genReadme };
