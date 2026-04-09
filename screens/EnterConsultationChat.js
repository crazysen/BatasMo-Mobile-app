import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Keyboard,
  Modal,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
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
import {
  hasFeedbackForAppointment,
  submitConsultationFeedback,
} from '../services/consultationFeedbackService';

const ConsultationChat = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isClosed, setIsClosed] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);
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
        const unsub = await attachThreadRealtime(threadId, setMessages, setIsClosed);
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

  useFocusEffect(
    useCallback(() => {
      if (!isClosed || !threadId) {
        return;
      }
      let cancelled = false;
      (async () => {
        try {
          const has = await hasFeedbackForAppointment(threadId);
          if (!cancelled && !has) {
            setFeedbackModalVisible(true);
          }
        } catch {
          // ignore
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [isClosed, threadId]),
  );

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

  const handleFeedbackSubmit = async () => {
    if (feedbackRating < 1 || feedbackRating > 5) {
      Alert.alert('Rating', 'Please select a star rating from 1 to 5.');
      return;
    }
    try {
      setFeedbackSubmitting(true);
      await submitConsultationFeedback(threadId, {
        rating: feedbackRating,
        comment: feedbackComment,
      });
      setFeedbackModalVisible(false);
      setFeedbackComment('');
      setFeedbackRating(0);
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'Could not save feedback.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const handleFeedbackSkip = () => {
    setFeedbackModalVisible(false);
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

        <View style={styles.keyboardAvoid}>
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
                      Consultation Ended — you can review messages below; sending is disabled.
                    </Text>
                  </View>
                )}
              </>
            }
          />

          <View
            style={[
              styles.footer,
              {
                paddingBottom:
                  keyboardInset > 0
                    ? keyboardInset + 8
                    : Math.max(insets.bottom, 16),
              },
            ]}>
            {!isClosed && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsRow}>
                <ActionButton icon="🖼" label="Photo" onPress={handlePickImage} />
                <ActionButton icon="📄" label="File" onPress={handlePickFile} />
              </ScrollView>
            )}
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
        </View>

      <Modal
        visible={feedbackModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleFeedbackSkip}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>How was your consultation?</Text>
            <Text style={styles.modalSubtitle}>Rate your attorney (optional comment below)</Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(n => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setFeedbackRating(n)}
                  style={styles.starHit}
                  hitSlop={{top: 8, bottom: 8, left: 4, right: 4}}>
                  <Text style={[styles.starGlyph, n <= feedbackRating && styles.starGlyphActive]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Feedback (optional)"
              placeholderTextColor="#94A3B8"
              value={feedbackComment}
              onChangeText={setFeedbackComment}
              multiline
              maxLength={1000}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnSecondary} onPress={handleFeedbackSkip}>
                <Text style={styles.modalBtnSecondaryText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtnPrimary,
                  styles.modalBtnPrimarySpaced,
                  feedbackSubmitting && styles.modalBtnDisabled,
                ]}
                onPress={handleFeedbackSubmit}
                disabled={feedbackSubmitting}>
                {feedbackSubmitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.modalBtnPrimaryText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 6},
  modalSubtitle: {fontSize: 13, color: '#64748B', marginBottom: 16},
  starRow: {flexDirection: 'row', justifyContent: 'center', marginBottom: 16},
  starHit: {paddingHorizontal: 4},
  starGlyph: {fontSize: 36, color: '#E2E8F0'},
  starGlyphActive: {color: '#D9B041'},
  modalInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
    textAlignVertical: 'top',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  modalActions: {flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'},
  modalBtnSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalBtnSecondaryText: {color: '#64748B', fontSize: 15, fontWeight: '600'},
  modalBtnPrimary: {
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    minWidth: 100,
    alignItems: 'center',
  },
  modalBtnPrimarySpaced: {marginLeft: 12},
  modalBtnPrimaryText: {color: '#FFF', fontSize: 15, fontWeight: '600'},
  modalBtnDisabled: {opacity: 0.6},
});

export default ConsultationChat;
