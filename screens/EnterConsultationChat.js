import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import ChatMessageBody from '../components/ChatMessageBody';
import {
  appendThreadAttachment,
  appendThreadMessage,
  attachThreadRealtime,
  getThreadMessages,
} from '../services/chatService';

const ConsultationChat = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isClosed, setIsClosed] = useState(false);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  const chatName = route?.params?.chatName || 'Attorney';
  const initials = route?.params?.initials || 'AT';
  const threadId = useMemo(
    () => String(route?.params?.chatId || route?.params?.chatName || 'general-chat'),
    [route?.params?.chatId, route?.params?.chatName],
  );

  const loadThread = useCallback(async () => {
    try {
      const {messages: rows, isClosed: closed} = await getThreadMessages(threadId);
      setMessages(rows);
      setIsClosed(closed);
    } catch {
      setMessages([]);
      setIsClosed(false);
    }
  }, [threadId]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;
    (async () => {
      try {
        const unsub = await attachThreadRealtime(threadId, setMessages);
        if (!cancelled) {
          unsubscribe = unsub;
        }
      } catch {
        // offline / no room
      }
    })();
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [threadId]);

  useEffect(() => {
    listRef.current?.scrollToEnd({animated: true});
  }, [messages.length]);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        listRef.current?.scrollToEnd({animated: true});
      },
    );
    return () => showSub.remove();
  }, []);

  const handleSendMessage = async () => {
    if (!messageText.trim() || isClosed || sending) {
      return;
    }
    try {
      setSending(true);
      const {messages: next, isClosed: closed} = await appendThreadMessage(threadId, {
        text: messageText,
        sender: 'me',
      });
      setMessages(next);
      setIsClosed(closed);
      setMessageText('');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Could not send message.');
    } finally {
      setSending(false);
    }
  };

  const handlePickImage = async () => {
    if (isClosed || sending) {
      return;
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission', 'Photo library access is needed to send images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.[0]) {
      return;
    }
    const asset = result.assets[0];
    try {
      setSending(true);
      const {messages: next, isClosed: closed} = await appendThreadAttachment(threadId, {
        uri: asset.uri,
        fileName: asset.fileName || 'photo.jpg',
        mime: asset.mimeType || 'image/jpeg',
        size: asset.fileSize ?? 0,
        caption: messageText.trim() || undefined,
      });
      setMessages(next);
      setIsClosed(closed);
      setMessageText('');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Could not send image.');
    } finally {
      setSending(false);
    }
  };

  const handlePickFile = async () => {
    if (isClosed || sending) {
      return;
    }
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: '*/*',
    });
    if (result.canceled) {
      return;
    }
    const asset =
      result.assets?.[0] ??
      (result.uri
        ? {
            uri: result.uri,
            name: result.name,
            mimeType: result.mimeType,
            size: result.size,
          }
        : null);
    if (!asset?.uri) {
      return;
    }
    try {
      setSending(true);
      const {messages: next, isClosed: closed} = await appendThreadAttachment(threadId, {
        uri: asset.uri,
        fileName: asset.name || 'file',
        mime: asset.mimeType || 'application/octet-stream',
        size: asset.size ?? 0,
        caption: messageText.trim() || undefined,
      });
      setMessages(next);
      setIsClosed(closed);
      setMessageText('');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Could not send file.');
    } finally {
      setSending(false);
    }
  };

  const ActionButton = ({icon, label, onPress}) => (
    <TouchableOpacity style={styles.actionChip} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    const isMe = item.sender === 'me';
    return (
      <View style={isMe ? styles.userBubble : styles.aiBubble}>
        <ChatMessageBody
          item={item}
          textStyle={isMe ? styles.userMessageText : styles.messageText}
        />
        <Text style={isMe ? styles.userTimestamp : styles.timestamp}>{item.time}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}>
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

        <FlatList
          ref={listRef}
          style={styles.messagesList}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatList}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          onContentSizeChange={() => listRef.current?.scrollToEnd({animated: true})}
          ListHeaderComponent={
            <>
              <View style={styles.encryptionBadge}>
                <Text style={styles.encryptionText}>
                  🔒 This session is end-to-end encrypted for your privacy.
                </Text>
              </View>
              {isClosed && (
                <View style={styles.closedBadge}>
                  <Text style={styles.closedText}>
                    ⚠️ This consultation has ended. You can no longer send messages.
                  </Text>
                </View>
              )}
            </>
          }
        />

        <View style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 16)}]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsRow}>
            <ActionButton icon="🖼" label="Photo" onPress={handlePickImage} />
            <ActionButton icon="📄" label="File" onPress={handlePickFile} />
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, isClosed && styles.inputDisabled]}
              placeholder={isClosed ? 'Consultation closed' : `Message ${chatName}...`}
              value={messageText}
              onChangeText={setMessageText}
              placeholderTextColor="#94A3B8"
              editable={!isClosed}
            />
            {sending ? (
              <ActivityIndicator style={{marginLeft: 12}} />
            ) : (
              <TouchableOpacity
                style={[styles.sendButton, (isClosed || !messageText.trim()) && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                activeOpacity={0.8}
                disabled={isClosed || !messageText.trim()}>
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF'},
  keyboardAvoid: {flex: 1},
  messagesList: {flex: 1},
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
  chatList: {padding: 16, paddingBottom: 24},
  encryptionBadge: {backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 20},
  encryptionText: {color: '#64748B', fontSize: 12, textAlign: 'center'},
  aiBubble: {backgroundColor: '#F1F5F9', padding: 16, borderRadius: 16, borderBottomLeftRadius: 4, alignSelf: 'flex-start', maxWidth: '80%', marginBottom: 12},
  userBubble: {backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderBottomRightRadius: 4, alignSelf: 'flex-end', maxWidth: '80%', marginBottom: 12},
  messageText: {color: '#1E293B', lineHeight: 20},
  userMessageText: {color: '#FFF', lineHeight: 20},
  timestamp: {fontSize: 10, color: '#94A3B8', marginTop: 4},
  userTimestamp: {fontSize: 10, color: '#94A3B8', marginTop: 4, textAlign: 'right'},
  footer: {paddingTop: 16, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9'},
  actionsRow: {marginBottom: 16},
  actionChip: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8},
  actionIcon: {marginRight: 6},
  actionLabel: {fontSize: 12, color: '#475569'},
  inputRow: {flexDirection: 'row', alignItems: 'center'},
  input: {flex: 1, backgroundColor: '#F1F5F9', height: 48, borderRadius: 24, paddingHorizontal: 20, color: '#0F172A'},
  inputDisabled: {backgroundColor: '#E2E8F0', color: '#94A3B8'},
  sendButton: {backgroundColor: '#D9B041', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginLeft: 12},
  sendButtonDisabled: {backgroundColor: '#CBD5E1'},
  sendIcon: {color: 'white'},
  closedBadge: {backgroundColor: '#FFF7ED', padding: 12, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#FED7AA'},
  closedText: {color: '#C2410C', fontSize: 12, textAlign: 'center', fontWeight: 'bold'},
});

export default ConsultationChat;
