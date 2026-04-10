import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';

const ConsultationChat = () => {
  const ActionButton = ({ icon, label }) => (
    <TouchableOpacity style={styles.actionChip}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity><Text style={styles.backArrow}>‹</Text></TouchableOpacity>
        <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.headerAvatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Dr. Sarah Johnson</Text>
          <Text style={styles.headerStatus}>ONLINE</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.chatArea}>
        <View style={styles.encryptionBadge}>
          <Text style={styles.encryptionText}>🔒 This session is end-to-end encrypted for your privacy.</Text>
        </View>

        <TouchableOpacity style={styles.videoCallBtn} onPress={() => alert('Opening Zoom link...')}>
          <Text style={styles.videoCallText}>📹 Join Video Call (Zoom)</Text>
        </TouchableOpacity>

        <View style={styles.aiBubble}>
          <Text style={styles.messageText}>Hello! I'm ready to discuss your corporate law matter. Please feel free to share any specific questions you have about the contract.</Text>
          <Text style={styles.timestamp}>10:05 AM</Text>
        </View>

        <View style={styles.userBubble}>
          <Text style={styles.userMessageText}>Thank you, Dr. Johnson. I wanted to clarify the termination clause on page 4.</Text>
          <Text style={styles.userTimestamp}>10:07 AM</Text>
        </View>

        <View style={styles.aiBubble}>
          <Text style={styles.messageText}>Certainly, let's look at that together.</Text>
          <Text style={styles.timestamp}>10:08 AM</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsRow}>
          <ActionButton icon="📄" label="Send Document" />
          <ActionButton icon="📤" label="Share Screen" />
          <ActionButton icon="⏺" label="Record Session" />
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput style={styles.input} placeholder="Message Dr. Sarah Johnson..." />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backArrow: { fontSize: 32, marginRight: 12 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20 },
  headerInfo: { marginLeft: 12 },
  headerName: { fontWeight: 'bold', fontSize: 16 },
  headerStatus: { color: '#22C55E', fontSize: 10, fontWeight: 'bold' },
  chatArea: { padding: 16 },
  encryptionBadge: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 20 },
  encryptionText: { color: '#64748B', fontSize: 12, textAlign: 'center' },
  aiBubble: { backgroundColor: '#F1F5F9', padding: 16, borderRadius: 16, borderBottomLeftRadius: 4, alignSelf: 'flex-start', maxWidth: '80%', marginBottom: 12 },
  userBubble: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderBottomRightRadius: 4, alignSelf: 'flex-end', maxWidth: '80%', marginBottom: 12 },
  messageText: { color: '#1E293B', lineHeight: 20 },
  userMessageText: { color: '#FFF', lineHeight: 20 },
  timestamp: { fontSize: 10, color: '#94A3B8', marginTop: 4 },
  userTimestamp: { fontSize: 10, color: '#94A3B8', marginTop: 4, textAlign: 'right' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  actionsRow: { marginBottom: 16 },
  actionChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  actionIcon: { marginRight: 6 },
  actionLabel: { fontSize: 12, color: '#475569' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F1F5F9', height: 48, borderRadius: 24, paddingHorizontal: 20 },
  sendButton: { backgroundColor: '#D9B041', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  sendIcon: { color: 'white' },
  videoCallBtn: { backgroundColor: '#2563EB', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  videoCallText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 }
});