import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import ChatMessageBody from '../components/ChatMessageBody';
import {
  appendThreadAttachment,
  appendThreadMessage,
  attachThreadRealtime,
  getThreadMessages,
} from '../services/chatService';

const ArrowLeft = props => <MaterialCommunityIcons name="arrow-left" {...props} />;
const Paperclip = props => <MaterialCommunityIcons name="paperclip" {...props} />;
const Send = props => <MaterialCommunityIcons name="send" {...props} />;
const ShieldCheck = props => <MaterialCommunityIcons name="shield-check" {...props} />;

const MessageBubble = ({item}) => {
  const isMe = item.sender === 'me';

  return (
    <View style={[styles.messageContainer, isMe ? styles.myContainer : styles.clientContainer]}>
      <View style={[styles.bubble, isMe ? styles.myBubble : styles.clientBubble]}>
        <ChatMessageBody
          item={item}
          textStyle={[styles.messageText, isMe ? styles.myText : styles.clientText]}
        />
      </View>
      <Text style={[styles.timeText, isMe ? {textAlign: 'right'} : {textAlign: 'left'}]}>
        {item.time}
      </Text>
    </View>
  );
};

export default function ConsultationChat({navigation, route}) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const clientName = route?.params?.clientName || 'Sarah Jenkins';
  const clientInitials = route?.params?.clientInitials || 'SJ';
  const threadId = useMemo(
    () => String(route?.params?.chatId || route?.params?.clientName || 'general-chat'),
    [route?.params?.chatId, route?.params?.clientName],
  );

  const loadThread = useCallback(async () => {
    try {
      const {messages: rows} = await getThreadMessages(threadId);
      setMessages(rows);
    } catch {
      setMessages([]);
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
        // no room
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

  const handleSend = async () => {
    if (!message.trim() || sending) {
      return;
    }
    try {
      setSending(true);
      const {messages: next} = await appendThreadMessage(threadId, {
        text: message,
        sender: 'me',
      });
      setMessages(next);
      setMessage('');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Could not send.');
    } finally {
      setSending(false);
    }
  };

  const handleAttachMenu = () => {
    Alert.alert('Attach', 'Choose a source', [
      {text: 'Photo library', onPress: () => pickImage()},
      {text: 'File', onPress: () => pickFile()},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
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
      const {messages: next} = await appendThreadAttachment(threadId, {
        uri: asset.uri,
        fileName: asset.fileName || 'photo.jpg',
        mime: asset.mimeType || 'image/jpeg',
        size: asset.fileSize ?? 0,
        caption: message.trim() || undefined,
      });
      setMessages(next);
      setMessage('');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Upload failed.');
    } finally {
      setSending(false);
    }
  };

  const pickFile = async () => {
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
      const {messages: next} = await appendThreadAttachment(threadId, {
        uri: asset.uri,
        fileName: asset.name || 'file',
        mime: asset.mimeType || 'application/octet-stream',
        size: asset.size ?? 0,
        caption: message.trim() || undefined,
      });
      setMessages(next);
      setMessage('');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Upload failed.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Consultation</Text>
        </View>

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
          ref={listRef}
          style={styles.messagesList}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({item}) => <MessageBubble item={item} />}
          contentContainerStyle={styles.chatList}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          onContentSizeChange={() => listRef.current?.scrollToEnd({animated: true})}
          ListHeaderComponent={
            <View style={styles.encryptedBadge}>
              <ShieldCheck size={14} color="#F59E0B" />
              <Text style={styles.encryptedText}>END-TO-END ENCRYPTED SECURE CHANNEL</Text>
            </View>
          }
        />

        <View style={[styles.inputWrapper, {paddingBottom: Math.max(insets.bottom, 16)}]}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachmentBtn} onPress={handleAttachMenu}>
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
            {sending ? (
              <ActivityIndicator style={{marginRight: 8}} />
            ) : (
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <Send size={20} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  keyboardAvoid: {flex: 1},
  messagesList: {flex: 1},
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
    color: '#1E3A8A',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    marginLeft: 15,
  },
  clientBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  avatarContainer: {position: 'relative'},
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {color: '#0369A1', fontWeight: 'bold', fontSize: 16},
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
  clientName: {marginLeft: 12, fontSize: 16, fontWeight: '700', color: '#1E3A8A'},
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
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
  },
  encryptedText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  chatList: {paddingHorizontal: 16, paddingBottom: 20},
  messageContainer: {marginBottom: 16, maxWidth: '85%'},
  clientContainer: {alignSelf: 'flex-start'},
  myContainer: {alignSelf: 'flex-end'},
  bubble: {
    padding: 14,
    borderRadius: 15,
    marginBottom: 4,
  },
  clientBubble: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 2,
  },
  myBubble: {
    backgroundColor: '#FFF',
    borderBottomRightRadius: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  messageText: {fontSize: 15, lineHeight: 22},
  clientText: {color: '#FFF'},
  myText: {color: '#1E3A8A'},
  timeText: {fontSize: 11, color: '#94A3B8', marginTop: 2},
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
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
  attachmentBtn: {padding: 4},
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {padding: 4},
});
