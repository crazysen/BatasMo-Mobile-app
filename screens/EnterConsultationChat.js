import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {appendThreadMessage, ensureThreadSeed, getThreadMessages} from '../services/chatService';

const ConsultationChat = ({navigation, route}) => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);

  const chatName = route?.params?.chatName || 'Attorney';
  const initials = route?.params?.initials || 'AT';
  const threadId = useMemo(
    () => String(route?.params?.chatId || route?.params?.chatName || 'general-chat'),
    [route?.params?.chatId, route?.params?.chatName],
  );

  const loadThread = useCallback(async () => {
    const seed = [
      {
        id: 'seed-1',
        text: `Hello! This is your secure consultation chat with ${chatName}.`,
        sender: 'client',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      },
    ];
    await ensureThreadSeed(threadId, seed);
    const rows = await getThreadMessages(threadId);
    setMessages(rows);
  }, [chatName, threadId]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadThread();
    }, 1500);

    return () => clearInterval(intervalId);
  }, [loadThread]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    const next = await appendThreadMessage(threadId, {
      text: messageText,
      sender: 'me',
    });
    setMessages(next);
    setMessageText('');
  };

  const ActionButton = ({icon, label, onPress}) => (
    <TouchableOpacity style={styles.actionChip} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chatName}</Text>
          <Text style={styles.headerStatus}>ONLINE</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.chatArea}>
        <View style={styles.encryptionBadge}>
          <Text style={styles.encryptionText}>🔒 This session is end-to-end encrypted for your privacy.</Text>
        </View>

        {messages.map(item => {
          const isMe = item.sender === 'me';
          return (
            <View key={item.id} style={isMe ? styles.userBubble : styles.aiBubble}>
              <Text style={isMe ? styles.userMessageText : styles.messageText}>{item.text}</Text>
              <Text style={isMe ? styles.userTimestamp : styles.timestamp}>{item.time}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsRow}>
          <ActionButton icon="📄" label="Send Document" onPress={() => {}} />
          <ActionButton icon="📤" label="Share Screen" onPress={() => {}} />
          <ActionButton icon="⏺" label="Record Session" onPress={() => {}} />
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={`Message ${chatName}...`}
            value={messageText}
            onChangeText={setMessageText}
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} activeOpacity={0.8}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF'},
  header: {flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9'},
  backArrow: {fontSize: 32, marginRight: 12, color: '#0F172A'},
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerInfo: {marginLeft: 12},
  headerName: {fontWeight: 'bold', fontSize: 16},
  headerStatus: {color: '#22C55E', fontSize: 10, fontWeight: 'bold'},
  chatArea: {padding: 16},
  encryptionBadge: {backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 20},
  encryptionText: {color: '#64748B', fontSize: 12, textAlign: 'center'},
  aiBubble: {backgroundColor: '#F1F5F9', padding: 16, borderRadius: 16, borderBottomLeftRadius: 4, alignSelf: 'flex-start', maxWidth: '80%', marginBottom: 12},
  userBubble: {backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderBottomRightRadius: 4, alignSelf: 'flex-end', maxWidth: '80%', marginBottom: 12},
  messageText: {color: '#1E293B', lineHeight: 20},
  userMessageText: {color: '#FFF', lineHeight: 20},
  timestamp: {fontSize: 10, color: '#94A3B8', marginTop: 4},
  userTimestamp: {fontSize: 10, color: '#94A3B8', marginTop: 4, textAlign: 'right'},
  footer: {padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9'},
  actionsRow: {marginBottom: 16},
  actionChip: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8},
  actionIcon: {marginRight: 6},
  actionLabel: {fontSize: 12, color: '#475569'},
  inputRow: {flexDirection: 'row', alignItems: 'center'},
  input: {flex: 1, backgroundColor: '#F1F5F9', height: 48, borderRadius: 24, paddingHorizontal: 20, color: '#0F172A'},
  sendButton: {backgroundColor: '#D9B041', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginLeft: 12},
  sendIcon: {color: 'white'},
});

export default ConsultationChat;
