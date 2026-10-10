import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Vibration,
  Animated,
} from 'react-native';
import { useAudioPlayer } from 'expo-audio';

export default function MainScreen() {
  const [isOnShift, setIsOnShift] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const player = useAudioPlayer(require('../../assets/alarm.mp3'));

  useEffect(() => {
    if (isAlert) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isAlert]);

  const playAlarm = () => {
    try {
      player.loop = true;
      player.play();
    } catch (e) {
      console.log('Ошибка звука', e);
    }
    Vibration.vibrate([0, 500, 200, 500], true);
  };

  const stopAlarm = () => {
    try {
      player.pause();
    } catch (e) {}
    Vibration.cancel();
  };

  const handleAlert = () => {
    if (!isAlert) {
      setIsAlert(true);
      playAlarm();
      Alert.alert(
        '🚨 ТРЕВОГА!',
        'Сигнал отправлен диспетчеру и ближайшим сотрудникам.',
        [{ text: 'ОСТАНОВИТЬ', onPress: stopAlert }]
      );
    } else {
      stopAlert();
    }
  };

  const stopAlert = () => {
    setIsAlert(false);
    stopAlarm();
  };

  const handleShift = () => {
    if (isOnShift) {
      Alert.alert('Выход со смены', 'Вы вышли со смены.', [
        {
          text: 'OK',
          onPress: () => {
            stopAlarm();
            setIsAlert(false);
            setIsOnShift(false);
          },
        },
      ]);
    } else {
      Alert.alert('Вход на смену', 'Вы вошли на смену. Удачи!', [
        { text: 'OK', onPress: () => setIsOnShift(true) },
      ]);
    }
  };

  useEffect(() => {
    return () => {
      Vibration.cancel();
    };
  }, []);

  // ========== ЭКРАН 1. Не на смене ==========
  if (!isOnShift) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.logo}>🛡️</Text>
        <Text style={styles.title}>BS SECURITY</Text>
        <Text style={styles.subtitle}>Мобильное приложение для ЧОП</Text>

        <TouchableOpacity
          style={styles.shiftButtonIn}
          onPress={handleShift}
          activeOpacity={0.85}
        >
          <Text style={styles.shiftButtonText}>✅ ВОЙТИ НА СМЕНУ</Text>
        </TouchableOpacity>

        <Text style={styles.hintText}>
          После входа появится тревожная кнопка и карта
        </Text>

        <Text style={styles.footer}>
          BS Security — модуль для ЧОП{'\n'}© 2026 Business Stack
        </Text>
      </View>
    );
  }

  // ========== ЭКРАН 2. На смене ==========
  const stats = [
    { label: 'Сотрудников', value: '3', icon: '👤' },
    { label: 'Объектов', value: '2', icon: '🏢' },
    { label: 'Активных тревог', value: isAlert ? '1' : '0', icon: '🚨' },
    { label: 'На смене', value: '1', icon: '🟢' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛡️ BS SECURITY</Text>
      <Text style={styles.subtitle}>Вы на смене с 14:00</Text>

      <TouchableOpacity
        style={styles.shiftButtonOut}
        onPress={handleShift}
        activeOpacity={0.85}
      >
        <Text style={styles.shiftButtonText}>🚪 ВЫЙТИ СО СМЕНЫ</Text>
      </TouchableOpacity>

      <View style={styles.statsGrid}>
        {stats.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.alertBox, isAlert && styles.alertBoxActive]}>
        <Text style={styles.alertTitle}>
          {isAlert ? '🚨 ТРЕВОГА АКТИВНА!' : '🚨 ТРЕВОЖНАЯ КНОПКА'}
        </Text>
        <Text style={styles.alertDesc}>
          {isAlert
            ? 'Сигнал отправлен. Нажмите ещё раз, чтобы остановить.'
            : 'Нажмите в экстренной ситуации — сигнал получат диспетчер и сотрудники'}
        </Text>

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.alertButton, isAlert && styles.alertButtonActive]}
            onPress={handleAlert}
            activeOpacity={0.8}
          >
            <Text style={styles.alertButtonText}>
              {isAlert ? '🛑\nСТОП' : '🚨\nТРЕВОГА'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.statusRow}>
          <Text style={styles.statusText}>🟢 1 сотрудник в зоне</Text>
          <Text style={[styles.statusText, isAlert && styles.statusTextAlert]}>
            📡 Сигнал: {isAlert ? 'АКТИВЕН' : 'готов'}
          </Text>
        </View>
      </View>

      <View style={styles.mapBox}>
        <Text style={styles.mapPlaceholder}>🗺️ Карта объектов и сотрудников</Text>
        <View style={styles.mapFake}>
          <Text style={styles.mapFakeText}>📍 Объект: Краснодар Галерея</Text>
          <Text style={styles.mapFakeText}>📍 Объект: ТЦ Озмал (Шоссе 15)</Text>
          <Text style={styles.mapFakeText}>👤 Ваня — на объекте</Text>
          <Text style={styles.mapFakeText}>👤 Петя — в пути</Text>
          <Text style={styles.mapFakeText}>👤 Саша — свободен</Text>
        </View>
        <Text style={styles.mapSubtext}>(полноценная карта будет позже)</Text>
      </View>

      <View style={styles.moduleGrid}>
        <View style={styles.moduleCard}>
          <Text style={styles.moduleIcon}>👥</Text>
          <Text style={styles.moduleTitle}>Сотрудники</Text>
          <Text style={styles.moduleDesc}>3 сотрудника</Text>
        </View>
        <View style={styles.moduleCard}>
          <Text style={styles.moduleIcon}>🏢</Text>
          <Text style={styles.moduleTitle}>Объекты</Text>
          <Text style={styles.moduleDesc}>2 объекта</Text>
        </View>
        <View style={styles.moduleCard}>
          <Text style={styles.moduleIcon}>📊</Text>
          <Text style={styles.moduleTitle}>Отчёты</Text>
          <Text style={styles.moduleDesc}>Скоро</Text>
        </View>
        <View style={styles.moduleCard}>
          <Text style={styles.moduleIcon}>⚙️</Text>
          <Text style={styles.moduleTitle}>Настройки</Text>
          <Text style={styles.moduleDesc}>Скоро</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        BS Security — модуль для ЧОП{'\n'}© 2026 Business Stack
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0f172a', paddingBottom: 40 },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: { fontSize: 80, marginBottom: 10 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 30,
  },
  hintText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  shiftButtonIn: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#16a34a',
    shadowOpacity: 0.7,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  shiftButtonOut: {
    backgroundColor: '#dc2626',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#dc2626',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  shiftButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statIcon: { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#f97316' },
  statLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2, textAlign: 'center' },
  alertBox: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#dc2626',
    marginBottom: 20,
    alignItems: 'center',
  },
  alertBoxActive: {
    borderColor: '#ef4444',
    backgroundColor: '#450a0a',
  },
  alertTitle: { fontSize: 17, fontWeight: 'bold', color: '#ef4444', marginBottom: 6 },
  alertDesc: { fontSize: 11, color: '#cbd5e1', textAlign: 'center', marginBottom: 16 },
  alertButton: {
    backgroundColor: '#dc2626',
    borderRadius: 100,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#dc2626',
    shadowOpacity: 0.9,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
  },
  alertButtonActive: { backgroundColor: '#7f1d1d' },
  alertButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 22,
    letterSpacing: 1,
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    width: '100%',
  },
  statusText: { color: '#22c55e', fontSize: 11 },
  statusTextAlert: { color: '#ef4444', fontWeight: 'bold' },
  mapBox: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  mapPlaceholder: {
    color: '#f97316',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  mapFake: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  mapFakeText: { color: '#cbd5e1', fontSize: 12, marginBottom: 6 },
  mapSubtext: { color: '#64748b', fontSize: 11, textAlign: 'center', marginTop: 8 },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  moduleIcon: { fontSize: 26, marginBottom: 6 },
  moduleTitle: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  moduleDesc: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  footer: { color: '#475569', fontSize: 10, textAlign: 'center', marginTop: 30 },
});