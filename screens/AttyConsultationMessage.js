import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
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
import {closeConsultationRoom} from '../services/messageService';

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
  const [isClosed, setIsClosed] = useState(false);
  const [sending, setSending] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const listRef = useRef(null);
  const clientName = route?.params?.clientName || 'Sarah Jenkins';
  const clientInitials = route?.params?.clientInitials || 'SJ';
  const threadId = useMemo(
    () => String(route?.params?.chatId || route?.params?.clientName || 'general-chat'),
    [route?.params?.chatId, route?.params?.clientName],
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
        const unsub = await attachThreadRealtime(threadId, setMessages, setIsClosed);
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
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = e => {
      const h = e?.endCoordinates?.height ?? 0;
      setKeyboardInset(h);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({animated: true}));
    };
    const onHide = () => setKeyboardInset(0);

    const subShow = Keyboard.addListener(showEvt, onShow);
    const subHide = Keyboard.addListener(hideEvt, onHide);
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  const handleEndConsultation = () => {
    Alert.alert(
      'End consultation',
      'Clients will no longer be able to send messages. You can still read the thread.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'End',
          style: 'destructive',
          onPress: async () => {
            try {
              await closeConsultationRoom(threadId);
              setIsClosed(true);
              const next = await getThreadMessages(threadId);
              setMessages(next.messages);
              setIsClosed(next.isClosed);
            } catch (e) {
              Alert.alert('Error', e?.message ?? 'Could not end consultation.');
            }
          },
        },
      ],
    );
  };

  const handleSend = async () => {
    if (!message.trim() || sending || isClosed) {
      return;
    }
    try {
      setSending(true);
      const {messages: next, isClosed: closed} = await appendThreadMessage(threadId, {
        text: message,
        sender: 'me',
      });
      setMessages(next);
      setIsClosed(closed);
      setMessage('');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Could not send.');
    } finally {
      setSending(false);
    }
  };

  const handleAttachMenu = () => {
    if (isClosed) {
      return;
    }
    Alert.alert('Attach', 'Choose a source', [
      {text: 'Photo library', onPress: () => pickImage()},
      {text: 'File', onPress: () => pickFile()},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const pickImage = async () => {
    if (isClosed || sending) {
      return;
    }
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
      const {messages: next, isClosed: closed} = await appendThreadAttachment(threadId, {
        uri: asset.uri,
        fileName: asset.fileName || 'photo.jpg',
        mime: asset.mimeType || 'image/jpeg',
        size: asset.fileSize ?? 0,
        caption: message.trim() || undefined,
      });
      setMessages(next);
      setIsClosed(closed);
      setMessage('');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Upload failed.');
    } finally {
      setSending(false);
    }
  };

  const pickFile = async () => {
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
        caption: message.trim() || undefined,
      });
      setMessages(next);
      setIsClosed(closed);
      setMessage('');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Upload failed.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Consultation</Text>
          {!isClosed ? (
            <TouchableOpacity style={styles.endConsultationBtn} onPress={handleEndConsultation}>
              <Text style={styles.endConsultationBtnText}>End Consultation</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerEndSpacer} />
          )}
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

        <View style={styles.keyboardAvoid}>
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
              <>
                <View style={styles.encryptedBadge}>
                  <ShieldCheck size={14} color="#F59E0B" />
                  <Text style={styles.encryptedText}>END-TO-END ENCRYPTED SECURE CHANNEL</Text>
                </View>
                {isClosed && (
                  <View style={styles.closedBanner}>
                    <Text style={styles.closedBannerText}>
                      Consultation Ended — messaging is disabled; you can read the thread below.
                    </Text>
                  </View>
                )}
              </>
            }
          />

          <View
            style={[
              styles.inputWrapper,
              {
                paddingBottom:
                  keyboardInset > 0
                    ? keyboardInset + 8
                    : Math.max(insets.bottom, 16),
              },
            ]}>
            <View style={styles.inputContainer}>
              {!isClosed && (
                <TouchableOpacity style={styles.attachmentBtn} onPress={handleAttachMenu}>
                  <Paperclip size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
              <TextInput
                style={[styles.input, isClosed && styles.inputDisabled]}
                value={message}
                onChangeText={setMessage}
                placeholder={isClosed ? 'Consultation ended' : 'Type your message...'}
                placeholderTextColor="#9CA3AF"
                multiline
                maxHeight={100}
                editable={!isClosed}
              />
              {sending ? (
                <ActivityIndicator style={{marginRight: 8}} />
              ) : (
                <TouchableOpacity
                  style={[styles.sendBtn, (isClosed || !message.trim()) && styles.sendBtnDisabled]}
                  onPress={handleSend}
                  disabled={isClosed || !message.trim()}>
                  <Send size={20} color="#FFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
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
    justifyContent: 'space-between',
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    marginLeft: 15,
  },
  endConsultationBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  endConsultationBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  headerEndSpacer: {width: 1},
  closedBanner: {
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  closedBannerText: {
    color: '#C2410C',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
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
  inputDisabled: {
    color: '#94A3B8',
    backgroundColor: 'transparent',
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
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  backButton: {padding: 4},
});
