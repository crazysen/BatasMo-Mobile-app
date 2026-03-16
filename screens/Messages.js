import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MessagesHub = ({ navigation }) => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample chat data - this would come from API/database in production
  const chatData = [
    { id: '1', name: 'Atty. Clara Santos', msg: 'The documents are ready fo...', time: '10:45 AM', initials: 'CS', unread: 2 },
    { id: '2', name: 'Support Desk', msg: 'Ticket #421 has been resolved.', time: 'YESTERDAY', initials: 'SD' },
    { id: '3', name: 'Atty. Mark Reyes', msg: 'Please confirm our call schedule.', time: '2 DAYS AGO', initials: 'MR' },
  ];

  // Filter chat data based on search query
  const filteredChatData = useMemo(() => {
    if (!searchQuery.trim()) {
      return chatData;
    }
    const query = searchQuery.toLowerCase();
    return chatData.filter(chat => 
      chat.name.toLowerCase().includes(query) || 
      chat.msg.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Handle chat item press
  const handleChatPress = (chat) => {
    // Navigate to chat screen if navigation is available
    if (navigation && navigation.navigate) {
      navigation.navigate('EnterConsultationChat', { 
        chatId: chat.id,
        chatName: chat.name,
        initials: chat.initials
      });
    } else {
      // Fallback if navigation is not available
      Alert.alert('Open Chat', `Opening chat with ${chat.name}`);
    }
  };

  // Handle search input change
  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const ChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatCard}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.initials}</Text>
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.chatHeader}>
          <Text style={styles.chatPreview} numberOfLines={1}>{item.msg}</Text>
          {item.unread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleBack = () => {
    navigation.navigate('HomepageClient');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>BATASMO HUB</Text>
        <Text style={styles.title}>Messages</Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search encrypted sessions..." 
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredChatData}
        renderItem={({ item }) => <ChatItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#020617' 
  },
  header: { 
    padding: 20 
  },
  backButton: {
    marginBottom: 10
  },
  backIcon: {
    fontSize: 32,
    color: 'white'
  },
  brand: { 
    color: '#EAB308', 
    fontSize: 12, 
    fontWeight: 'bold', 
    letterSpacing: 1 
  },
  title: { 
    color: 'white', 
    fontSize: 36, 
    fontFamily: 'serif', 
    fontWeight: 'bold', 
    marginTop: 8 
  },
  searchContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#0F172A', 
    margin: 16, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    alignItems: 'center', 
    height: 56, 
    borderWidth: 1, 
    borderColor: '#1E293B' 
  },
  searchIcon: { 
    marginRight: 12 
  },
  searchInput: { 
    flex: 1, 
    color: 'white',
    fontSize: 14
  },
  clearButton: {
    padding: 8,
    marginLeft: 8
  },
  clearText: {
    color: '#64748B',
    fontSize: 18,
    fontWeight: 'bold'
  },
  chatCard: { 
    flexDirection: 'row', 
    backgroundColor: '#0F172A', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#1E293B' 
  },
  avatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 16, 
    backgroundColor: '#020617', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  avatarText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  chatInfo: { 
    flex: 1, 
    marginLeft: 16 
  },
  chatHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  chatName: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  chatTime: { 
    color: '#64748B', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  chatPreview: { 
    color: '#94A3B8', 
    marginTop: 4, 
    fontSize: 14, 
    flex: 0.9 
  },
  unreadBadge: { 
    backgroundColor: '#EAB308', 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  unreadText: { 
    color: '#0F172A', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  emptyText: {
    color: '#64748B',
    fontSize: 16
  }
});

export default MessagesHub;

