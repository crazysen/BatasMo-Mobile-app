import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {appendThreadMessage, ensureThreadSeed, getThreadMessages} from '../services/chatService';

const ArrowLeft = (props) => <MaterialCommunityIcons name="arrow-left" {...props} />;
const Paperclip = (props) => <MaterialCommunityIcons name="paperclip" {...props} />;
const Send = (props) => <MaterialCommunityIcons name="send" {...props} />;
const ShieldCheck = (props) => <MaterialCommunityIcons name="shield-check" {...props} />;

const MessageBubble = ({ item }) => {
  const isMe = item.sender === 'me';

  return (
    <View style={[styles.messageContainer, isMe ? styles.myContainer : styles.clientContainer]}>
      <View style={[styles.bubble, isMe ? styles.myBubble : styles.clientBubble]}>
        <Text style={[styles.messageText, isMe ? styles.myText : styles.clientText]}>
          {item.text}
        </Text>
      </View>
      <Text style={[styles.timeText, isMe ? { textAlign: 'right' } : { textAlign: 'left' }]}>
        {item.time}
      </Text>
    </View>
  );
};

export default function ConsultationChat({ navigation, route }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const clientName = route?.params?.clientName || 'Sarah Jenkins';
  const clientInitials = route?.params?.clientInitials || 'SJ';
  const threadId = useMemo(
    () => String(route?.params?.chatId || route?.params?.clientName || 'general-chat'),
    [route?.params?.chatId, route?.params?.clientName],
  );

  const loadThread = useCallback(async () => {
    const seed = [
      {
        id: 'seed-1',
        text: `Consultation thread started with ${clientName}.`,
        sender: 'client',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      },
    ];
    await ensureThreadSeed(threadId, seed);
    const rows = await getThreadMessages(threadId);
    setMessages(rows);
  }, [clientName, threadId]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadThread();
    }, 1500);

    return () => clearInterval(intervalId);
  }, [loadThread]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const next = await appendThreadMessage(threadId, {
      text: message,
      sender: 'me',
    });
    setMessages(next);
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultation</Text>
      </View>

      {/* Client Info Bar */}
      <View style={styles.clientBar}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{clientInitials}</Text>
          </View>
          <View style={styles.onlineStatus} />
        </View>
        <Text style={styles.clientName}>{clientName}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble item={item} />}
        contentContainerStyle={styles.chatList}
        ListHeaderComponent={
          <>
            <View style={styles.encryptedBadge}>
              <ShieldCheck size={14} color="#F59E0B" />
              <Text style={styles.encryptedText}>END-TO-END ENCRYPTED SECURE CHANNEL</Text>
            </View>
          </>
        }
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachmentBtn}>
              <Paperclip size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxHeight={100}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Send size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A', // Deep navy blue
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    marginLeft: 15,
  },
  clientBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#0369A1', fontWeight: 'bold', fontSize: 16 },
  onlineStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  clientName: { marginLeft: 12, fontSize: 16, fontWeight: '700', color: '#1E3A8A' },
  encryptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
  },
  encryptedText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  chatList: { paddingHorizontal: 16, paddingBottom: 20 },
  messageContainer: { marginBottom: 16, maxWidth: '85%' },
  clientContainer: { alignSelf: 'flex-start' },
  myContainer: { alignSelf: 'flex-end' },
  bubble: {
    padding: 14,
    borderRadius: 15,
    marginBottom: 4,
  },
  clientBubble: {
    backgroundColor: '#0F172A', // Dark Navy
    borderTopLeftRadius: 2,
  },
  myBubble: {
    backgroundColor: '#FFF',
    borderBottomRightRadius: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  messageText: { fontSize: 15, lineHeight: 22 },
  clientText: { color: '#FFF' },
  myText: { color: '#1E3A8A' },
  timeText: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 25,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 15,
    color: '#1E293B',
    maxHeight: 100,
  },
  attachmentBtn: { padding: 4 },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
