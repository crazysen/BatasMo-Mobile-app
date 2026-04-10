import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {REFERENCE_THEME as T} from '../constants/referenceTheme';
import {getConsultationTimerDisplay} from '../services/consultationSession';

/** Banners for grace / post-grace (both client and attorney). */
export function ConsultationSessionAlerts({bounds, nowMs, isClosed}) {
  if (isClosed || !bounds) {
    return null;
  }
  const {phase} = getConsultationTimerDisplay(nowMs, bounds);

  if (phase === 'in_grace') {
    return (
      <View style={styles.alertBanner}>
        <Text style={styles.alertTitle}>Scheduled hour complete</Text>
        <Text style={styles.alertBody}>
          15-minute grace period — consultation stays open until the attorney ends it.
        </Text>
      </View>
    );
  }

  if (phase === 'after_grace') {
    return (
      <View style={[styles.alertBanner, styles.alertBannerStrong]}>
        <Text style={styles.alertTitle}>Grace period ended</Text>
        <Text style={styles.alertBody}>
          Please wrap up. Only the attorney can end the consultation and close the chat.
        </Text>
      </View>
    );
  }

  return null;
}

/** Single-line timer (primary + secondary). */
export function ConsultationSessionTimerStrip({bounds, nowMs, isClosed}) {
  if (isClosed || !bounds) {
    return null;
  }
  const {primaryLabel, secondaryLabel} = getConsultationTimerDisplay(nowMs, bounds);
  if (!primaryLabel) {
    return null;
  }
  return (
    <View style={styles.timerStrip}>
      <Text style={styles.timerPrimary}>{primaryLabel}</Text>
      {secondaryLabel ? <Text style={styles.timerSecondary}>{secondaryLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  alertBanner: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.28)',
  },
  alertBannerStrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(244, 114, 182, 0.35)',
  },
  alertTitle: {
    color: T.gold[0],
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  alertBody: {
    color: T.textSoft,
    fontSize: 11,
    lineHeight: 16,
  },
  timerStrip: {
    backgroundColor: 'rgba(12, 19, 30, 0.92)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.18)',
    marginBottom: 8,
  },
  timerPrimary: {
    color: T.text,
    fontSize: 13,
    fontWeight: '800',
  },
  timerSecondary: {
    color: T.textMuted,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
});
