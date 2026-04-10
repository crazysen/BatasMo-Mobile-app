import React, {useCallback, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {REFERENCE_THEME as T} from '../constants/referenceTheme';
import {CHAT_INPUT_PADDING_VERTICAL, IS_IOS} from '../constants/platformUi';
import {ClientScreenShell} from '../components/ClientScreenShell';
import ClientChevronBack from '../components/ClientChevronBack';

const INITIAL_MESSAGES = [
  {
    id: '1',
    text: 'Hello! I am your BatasMo AI assistant. How can I help you with your legal matters today?',
    sender: 'ai',
  },
];

export default function ChatbotScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const listRef = useRef(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('HomepageClient');
  }, [navigation]);

  const appendMessage = useCallback((text, sender) => {
    const id = `m-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setMessages(prev => [...prev, {id, text: text.trim(), sender}]);
    setTimeout(() => listRef.current?.scrollToEnd({animated: true}), 80);
  }, []);

  const handleSendMessage = useCallback(() => {
    const t = inputText.trim();
    if (!t) {
      return;
    }
    Keyboard.dismiss();
    appendMessage(t, 'user');
    setInputText('');
    setTimeout(() => {
      appendMessage(
        'Thanks for your message. A fuller AI legal assistant is coming soon — for urgent matters, use Book an Appointment to reach verified counsel.',
        'ai',
      );
    }, 600);
  }, [inputText, appendMessage]);

  const handleQuickReply = useCallback(
    title => {
      appendMessage(title, 'user');
      setTimeout(() => {
        appendMessage(
          'I can help point you to the right area of the app. Try Notifications for request status, or Book an Appointment from your dashboard.',
          'ai',
        );
      }, 500);
    },
    [appendMessage],
  );

  const renderMessage = useCallback(
    ({item}) => (
      <View
        style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.aiRow]}>
        {item.sender === 'ai' ? (
          <View style={styles.aiAvatarSmall}>
            <MaterialCommunityIcons name="robot-outline" size={18} color={T.gold[0]} />
          </View>
        ) : null}
        <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.messageText, item.sender === 'ai' ? styles.aiText : styles.userText]}>
            {item.text}
          </Text>
        </View>
      </View>
    ),
    [],
  );

  const QuickReply = ({title}) => (
    <TouchableOpacity style={styles.chip} onPress={() => handleQuickReply(title)} activeOpacity={0.7}>
      <Text style={styles.chipText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ClientScreenShell edges={['top', 'left', 'right']}>
      <View style={styles.fill}>
        <View style={styles.header}>
          <ClientChevronBack style={styles.backHit} onPress={handleBack} />
          <View style={styles.aiAvatarHeader}>
            <MaterialCommunityIcons name="robot-outline" size={22} color={T.gold[0]} />
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>BatasMo AI Assistant</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ALWAYS ONLINE</Text>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          style={styles.fill}
          behavior={IS_IOS ? 'padding' : undefined}
          keyboardVerticalOffset={IS_IOS ? 0 : 0}>
          <View style={styles.fill}>
            <FlatList
              ref={listRef}
              style={styles.messagesList}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.chatList}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={IS_IOS ? 'interactive' : 'on-drag'}
              onContentSizeChange={() => listRef.current?.scrollToEnd({animated: false})}
              ListHeaderComponent={
                <View style={styles.encryptionNote}>
                  <Text style={styles.encryptionText}>Your session is encrypted and secure.</Text>
                </View>
              }
            />

            <View
              style={[
                styles.footer,
                {paddingBottom: Math.max(insets.bottom, 12)},
              ]}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickReplies}>
                <QuickReply title="Track my request" />
                <QuickReply title="Find a lawyer" />
                <QuickReply title="Notarial fee" />
              </ScrollView>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ask me anything..."
                  placeholderTextColor={T.textSoft}
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={handleSendMessage}
                  returnKeyType="send"
                />
                <TouchableOpacity
                  style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                  onPress={handleSendMessage}
                  activeOpacity={0.85}
                  disabled={!inputText.trim()}>
                  <MaterialCommunityIcons name="send" size={22} color={T.base} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ClientScreenShell>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  messagesList: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244, 215, 139, 0.12)',
    backgroundColor: 'rgba(18, 26, 36, 0.55)',
  },
  backHit: {marginRight: 8},
  aiAvatarHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(4, 7, 11, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.2)',
  },
  headerTitleContainer: {marginLeft: 12, flex: 1},
  headerTitle: {color: T.text, fontSize: 17, fontWeight: '700'},
  statusContainer: {flexDirection: 'row', alignItems: 'center', marginTop: 2},
  statusDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 6},
  statusText: {color: T.textSoft, fontSize: 10, fontWeight: '800'},

  encryptionNote: {
    alignSelf: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.25)',
  },
  encryptionText: {color: '#93C5FD', fontSize: 12, textAlign: 'center'},

  chatList: {paddingHorizontal: 16, paddingBottom: 16, flexGrow: 1},
  messageRow: {flexDirection: 'row', marginBottom: 14, alignItems: 'flex-end'},
  userRow: {justifyContent: 'flex-end'},
  aiRow: {justifyContent: 'flex-start'},
  aiAvatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(18, 26, 36, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.15)',
  },
  bubble: {maxWidth: '82%', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 18},
  aiBubble: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.12)',
  },
  userBubble: {
    backgroundColor: 'rgba(244, 215, 139, 0.2)',
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.22)',
  },
  messageText: {fontSize: 15, lineHeight: 22},
  aiText: {color: T.text},
  userText: {color: T.base},

  footer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(244, 215, 139, 0.12)',
    backgroundColor: 'rgba(4, 7, 11, 0.45)',
  },
  quickReplies: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.18)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {color: T.textMuted, fontSize: 13, fontWeight: '500'},
  inputContainer: {flexDirection: 'row', alignItems: 'center'},
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    minHeight: 48,
    maxHeight: 120,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: CHAT_INPUT_PADDING_VERTICAL,
    color: T.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 215, 139, 0.12)',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: T.gold[1],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(148, 163, 184, 0.35)',
  },
});
