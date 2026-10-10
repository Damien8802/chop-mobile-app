import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

export default function MainScreen() {
  const [isAlert, setIsAlert] = useState(false);
  const [isOnShift, setIsOnShift] = useState(false);

  const stats = [
    { label: 'Сотрудников', value: '3', icon: '👤' },
    { label: 'Объектов', value: '2', icon: '🏢' },
    { label: 'Активных тревог', value: '0', icon: '🚨' },
    { label: 'На смене', value: isOnShift ? '1' : '0', icon: '🟢' },
  ];

  const handleAlert = () => {
    setIsAlert(!isAlert);
    if (!isAlert) {
      Alert.alert(
        '🚨 ТРЕВОГА!',
        'Сигнал отправлен диспетчеру и ближайшим сотрудникам.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleShift = () => {
    if (isOnShift) {
      Alert.alert('Выход со смены', 'Вы вышли со смены.', [{ text: 'OK' }]);
    } else {
      Alert.alert('Вход на смену', 'Вы вошли на смену. Удачи!', [
        { text: 'OK' },
      ]);
    }
    setIsOnShift(!isOnShift);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛡️ BS SECURITY</Text>
      <Text style={styles.subtitle}>
        Мобильное приложение для ЧОП — контроль охраны
      </Text>

      {/* Счётчики */}
      <View style={styles.statsGrid}>
        {stats.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Кнопка вход/выход со смены */}
      <TouchableOpacity
        style={[
          styles.shiftButton,
          isOnShift ? styles.shiftButtonOut : styles.shiftButtonIn,
        ]}
        onPress={handleShift}
        activeOpacity={0.85}
      >
        <Text style={styles.shiftButtonText}>
          {isOnShift ? '🚪 ВЫЙТИ СО СМЕНЫ' : '✅ ВОЙТИ НА СМЕНУ'}
        </Text>
        {isOnShift && (
          <Text style={styles.shiftButtonSub}>
            Вы на смене с 14:00
          </Text>
        )}
      </TouchableOpacity>

      {/* Тревожная кнопка */}
      <View style={styles.alertBox}>
        <Text style={styles.alertTitle}>🚨 ТРЕВОЖНАЯ КНОПКА</Text>
        <Text style={styles.alertDesc}>
          Нажмите в экстренной ситуации — сигнал мгновенно получат диспетчер и
          ближайшие сотрудники
        </Text>
        <TouchableOpacity
          style={[styles.alertButton, isAlert && styles.alertButtonActive]}
          onPress={handleAlert}
          activeOpacity={0.8}
        >
          <Text style={styles.alertButtonText}>🚨{'\n'}ТРЕВОГА</Text>
        </TouchableOpacity>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>🟢 1 сотрудник в зоне</Text>
          <Text style={styles.statusText}>📡 Сигнал: готов</Text>
        </View>
      </View>

      {/* Карта (заглушка) */}
      <View style={styles.mapBox}>
        <Text style={styles.mapPlaceholder}>
          🗺️ Карта объектов и сотрудников
        </Text>
        <View style={styles.mapFake}>
          <Text style={styles.mapFakeText}>📍 Объект: Краснодар Галерея</Text>
          <Text style={styles.mapFakeText}>📍 Объект: ТЦ Озмал (Шоссе 15)</Text>
          <Text style={styles.mapFakeText}>👤 Ваня — на объекте</Text>
          <Text style={styles.mapFakeText}>👤 Петя — в пути</Text>
        </View>
        <Text style={styles.mapSubtext}>
          (полноценная карта будет добавлена позже)
        </Text>
      </View>

      {/* Заглушки под модули */}
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
  container: {
    padding: 16,
    backgroundColor: '#0f172a',
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
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
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    textAlign: 'center',
  },
  shiftButton: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  shiftButtonIn: {
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
  },
  shiftButtonOut: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
  },
  shiftButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  shiftButtonSub: {
    color: '#fee2e2',
    fontSize: 11,
    marginTop: 4,
  },
  alertBox: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#dc2626',
    marginBottom: 20,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 6,
  },
  alertDesc: {
    fontSize: 11,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 16,
  },
  alertButton: {
    backgroundColor: '#dc2626',
    borderRadius: 100,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#dc2626',
    shadowOpacity: 0.8,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
  },
  alertButtonActive: {
    backgroundColor: '#991b1b',
    shadowOpacity: 1,
  },
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
  mapFakeText: {
    color: '#cbd5e1',
    fontSize: 12,
    marginBottom: 6,
  },
  mapSubtext: {
    color: '#64748b',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
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
  moduleTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  moduleDesc: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    color: '#475569',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 20,
  },
});