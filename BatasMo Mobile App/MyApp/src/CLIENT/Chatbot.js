import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const ChatbotScreen = () => {
  // Mock data for the chat
  const messages = [
    { id: '1', text: 'Hello! I am your BatasMo AI assistant. How can I help you with your legal matters today?', sender: 'ai' },
    { id: '2', text: 'I need help understanding some notarial fees for a property sale.', sender: 'user' },
  ];

  const QuickReply = ({ title }) => (
    <TouchableOpacity style={styles.chip}>
      <Text style={styles.chipText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <View style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.aiRow]}>
      {item.sender === 'ai' && (
        <View style={styles.aiAvatarSmall}>
          <Text style={{ fontSize: 12 }}>🤖</Text>
        </View>
      )}
      <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, item.sender === 'ai' ? styles.aiText : styles.userText]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.aiAvatarHeader}>
          <Text style={{ fontSize: 18 }}>🤖</Text>
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        {/* Encrypted Note */}
        <View style={styles.encryptionNote}>
          <Text style={styles.encryptionText}>Your session is encrypted and secure.</Text>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
        />

        {/* Footer & Input */}
        <View style={styles.footer}>
          <View style={styles.quickReplies}>
            <QuickReply title="Track my request" />
            <QuickReply title="Find a lawyer" />
            <QuickReply title="Notarial fee" />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor="#64748B"
            />
            <TouchableOpacity style={styles.sendButton}>
              <Text style={{ fontSize: 18 }}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backArrow: { color: '#F8FAFC', fontSize: 32, marginRight: 16 },
  aiAvatarHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerTitleContainer: { marginLeft: 12 },
  headerTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 6 },
  statusText: { color: '#94A3B8', fontSize: 10, fontWeight: '800' },
  
  encryptionNote: {
    alignSelf: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  encryptionText: { color: '#94A3B8', fontSize: 12 },

  chatList: { padding: 16 },
  messageRow: { flexDirection: 'row', marginBottom: 20, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  aiAvatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  bubble: { maxWidth: '80%', padding: 16, borderRadius: 24 },
  aiBubble: { 
    backgroundColor: '#F1F5F9', 
    borderBottomLeftRadius: 4 
  },
  userBubble: { 
    backgroundColor: '#1E293B', 
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: '#334155'
  },
  messageText: { fontSize: 15, lineHeight: 22 },
  aiText: { color: '#1E293B' },
  userText: { color: '#F8FAFC' },

  footer: { padding: 16, backgroundColor: '#020617' },
  quickReplies: { flexDirection: 'row', marginBottom: 16 },
  chip: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: { color: '#F8FAFC', fontSize: 13, fontWeight: '500' },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: '#0F172A',
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 20,
    color: '#F8FAFC',
    fontSize: 16,
  },
  sendButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FACC15',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});

export default ChatbotScreen;