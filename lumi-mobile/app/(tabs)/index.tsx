import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, GlassCard, TextInput } from "@/components/ui";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants/theme";
import type { Chat, Story } from "@/store";

// Mock data
const mockStories: (Story & { user: { id: string; username: string; avatar: string } })[] = [
  {
    id: "1",
    userId: "1",
    user: { id: "1", username: "Sarah", avatar: "https://i.pravatar.cc/150?img=1" },
    mediaUrl: "",
    mediaType: "image",
    createdAt: new Date(),
    viewedBy: [],
  },
  {
    id: "2",
    userId: "2",
    user: { id: "2", username: "Mike", avatar: "https://i.pravatar.cc/150?img=2" },
    mediaUrl: "",
    mediaType: "image",
    createdAt: new Date(),
    viewedBy: [],
  },
  {
    id: "3",
    userId: "3",
    user: { id: "3", username: "Emma", avatar: "https://i.pravatar.cc/150?img=3" },
    mediaUrl: "",
    mediaType: "video",
    createdAt: new Date(),
    viewedBy: [],
  },
  {
    id: "4",
    userId: "4",
    user: { id: "4", username: "John", avatar: "https://i.pravatar.cc/150?img=4" },
    mediaUrl: "",
    mediaType: "image",
    createdAt: new Date(),
    viewedBy: [],
  },
  {
    id: "5",
    userId: "5",
    user: { id: "5", username: "Lisa", avatar: "https://i.pravatar.cc/150?img=5" },
    mediaUrl: "",
    mediaType: "image",
    createdAt: new Date(),
    viewedBy: [],
  },
];

const mockChats: (Chat & { participants: { id: string; username: string; avatar: string; isOnline: boolean }[] })[] = [
  {
    id: "1",
    participants: [
      { id: "1", username: "Sarah Wilson", avatar: "https://i.pravatar.cc/150?img=1", isOnline: true },
    ],
    lastMessage: {
      id: "m1",
      senderId: "1",
      content: "Hey! How are you doing?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: "text",
      status: "read",
    },
    unreadCount: 2,
    isGroup: false,
  },
  {
    id: "2",
    participants: [
      { id: "2", username: "Mike Johnson", avatar: "https://i.pravatar.cc/150?img=2", isOnline: false },
    ],
    lastMessage: {
      id: "m2",
      senderId: "me",
      content: "See you tomorrow!",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: "text",
      status: "delivered",
    },
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "3",
    participants: [
      { id: "3", username: "Emma Davis", avatar: "https://i.pravatar.cc/150?img=3", isOnline: true },
      { id: "4", username: "John Smith", avatar: "https://i.pravatar.cc/150?img=4", isOnline: false },
    ],
    lastMessage: {
      id: "m3",
      senderId: "3",
      content: "Anyone up for coffee?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "text",
      status: "read",
    },
    unreadCount: 5,
    isGroup: true,
    groupName: "Coffee Lovers",
  },
  {
    id: "4",
    participants: [
      { id: "5", username: "Lisa Brown", avatar: "https://i.pravatar.cc/150?img=5", isOnline: true },
    ],
    lastMessage: {
      id: "m4",
      senderId: "5",
      content: "Shared a photo",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: "image",
      status: "read",
    },
    unreadCount: 0,
    isGroup: false,
  },
];

export default function ChatsScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const filteredChats = mockChats.filter((chat) => {
    const name = chat.isGroup
      ? chat.groupName
      : chat.participants[0]?.username;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderStoryItem = ({ item, index }: { item: typeof mockStories[0]; index: number }) => (
    <TouchableOpacity
      style={[styles.storyItem, index === 0 && styles.storyItemFirst]}
      onPress={() => router.push(`/story/${item.id}`)}
      activeOpacity={0.8}
    >
      <Avatar
        source={item.user.avatar}
        name={item.user.username}
        size="lg"
        showStoryRing
        hasStory
      />
      <Text style={styles.storyUsername} numberOfLines={1}>
        {item.user.username}
      </Text>
    </TouchableOpacity>
  );

  const renderChatItem = ({ item }: { item: typeof mockChats[0] }) => {
    const displayName = item.isGroup
      ? item.groupName
      : item.participants[0]?.username;
    const displayAvatar = item.isGroup
      ? item.groupAvatar
      : item.participants[0]?.avatar;
    const isOnline = !item.isGroup && item.participants[0]?.isOnline;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => router.push(`/chat/${item.id}`)}
        activeOpacity={0.7}
      >
        <Avatar
          source={displayAvatar}
          name={displayName}
          size="lg"
          showOnline={!item.isGroup}
          isOnline={isOnline}
        />
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.chatTime}>
              {item.lastMessage && formatTime(item.lastMessage.timestamp)}
            </Text>
          </View>
          <View style={styles.chatFooter}>
            <Text style={styles.chatMessage} numberOfLines={1}>
              {item.lastMessage?.content}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {item.unreadCount > 99 ? "99+" : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.background, "#252525"]}
        style={styles.gradient}
      />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chats</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="camera-outline" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="create-outline" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search"
            containerStyle={styles.searchInput}
          />
        </View>

        {/* Stories */}
        <View style={styles.storiesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesList}
          >
            {/* Add Story Button */}
            <TouchableOpacity style={styles.addStoryButton} activeOpacity={0.8}>
              <View style={styles.addStoryIcon}>
                <Ionicons name="add" size={28} color={Colors.brand.primary} />
              </View>
              <Text style={styles.storyUsername}>Your Story</Text>
            </TouchableOpacity>
            {mockStories.map((story, index) => (
              <View key={story.id}>
                {renderStoryItem({ item: story, index })}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Chat List */}
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={64} color={Colors.text.muted} />
              <Text style={styles.emptyText}>No conversations yet</Text>
              <Text style={styles.emptySubtext}>Start chatting with your friends</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize["2xl"],
    fontWeight: "700",
    color: Colors.text.primary,
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.glass.light,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  storiesSection: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glass.lightBorder,
  },
  storiesList: {
    paddingHorizontal: Spacing.lg,
  },
  storyItem: {
    alignItems: "center",
    marginHorizontal: Spacing.sm,
    width: 70,
  },
  storyItemFirst: {
    marginLeft: 0,
  },
  storyUsername: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  addStoryButton: {
    alignItems: "center",
    marginRight: Spacing.md,
    width: 70,
  },
  addStoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.glass.light,
    borderWidth: 2,
    borderColor: Colors.brand.primary,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  chatList: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glass.lightBorder,
  },
  chatInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  chatName: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text.primary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  chatTime: {
    fontSize: FontSize.xs,
    color: Colors.text.muted,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatMessage: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  unreadBadge: {
    backgroundColor: Colors.brand.primary,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.text.dark,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["4xl"],
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.text.primary,
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },
});
