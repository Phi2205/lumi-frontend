import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Avatar } from "@/components/ui";
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from "@/constants/theme";
import type { Message } from "@/store";

// Mock data for chat
const mockChatData = {
  "1": {
    name: "Sarah Wilson",
    avatar: "https://i.pravatar.cc/150?img=1",
    isOnline: true,
    messages: [
      { id: "1", senderId: "1", content: "Hey! How are you doing?", timestamp: new Date(Date.now() - 30 * 60 * 1000), type: "text", status: "read" },
      { id: "2", senderId: "me", content: "I am good! Just finished work. You?", timestamp: new Date(Date.now() - 25 * 60 * 1000), type: "text", status: "read" },
      { id: "3", senderId: "1", content: "Same here! Want to grab dinner later?", timestamp: new Date(Date.now() - 20 * 60 * 1000), type: "text", status: "read" },
      { id: "4", senderId: "me", content: "Sounds great! Where do you want to go?", timestamp: new Date(Date.now() - 15 * 60 * 1000), type: "text", status: "read" },
      { id: "5", senderId: "1", content: "How about that new Italian place downtown?", timestamp: new Date(Date.now() - 10 * 60 * 1000), type: "text", status: "read" },
      { id: "6", senderId: "me", content: "Perfect! See you at 7?", timestamp: new Date(Date.now() - 5 * 60 * 1000), type: "text", status: "delivered" },
    ] as Message[],
  },
  "2": {
    name: "Mike Johnson",
    avatar: "https://i.pravatar.cc/150?img=2",
    isOnline: false,
    messages: [
      { id: "1", senderId: "2", content: "Did you see the game last night?", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: "text", status: "read" },
      { id: "2", senderId: "me", content: "Yes! What a match!", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), type: "text", status: "read" },
      { id: "3", senderId: "me", content: "See you tomorrow!", timestamp: new Date(Date.now() - 30 * 60 * 1000), type: "text", status: "delivered" },
    ] as Message[],
  },
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<RNTextInput>(null);

  const chatData = mockChatData[id as keyof typeof mockChatData] || {
    name: "Unknown",
    avatar: "",
    isOnline: false,
    messages: [],
  };

  useEffect(() => {
    setMessages(chatData.messages);
  }, [id]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: String(Date.now()),
      senderId: "me",
      content: message.trim(),
      timestamp: new Date(),
      type: "text",
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.senderId === "me";
    const showAvatar =
      !isMe &&
      (index === 0 || messages[index - 1]?.senderId !== item.senderId);

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.messageContainerMe : styles.messageContainerOther,
        ]}
      >
        {!isMe && showAvatar && (
          <Avatar source={chatData.avatar} name={chatData.name} size="sm" />
        )}
        {!isMe && !showAvatar && <View style={styles.avatarPlaceholder} />}
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMe ? styles.messageTextMe : styles.messageTextOther,
            ]}
          >
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                isMe ? styles.messageTimeMe : styles.messageTimeOther,
              ]}
            >
              {formatTime(item.timestamp)}
            </Text>
            {isMe && (
              <Ionicons
                name={
                  item.status === "read"
                    ? "checkmark-done"
                    : item.status === "delivered"
                    ? "checkmark-done"
                    : "checkmark"
                }
                size={14}
                color={item.status === "read" ? Colors.brand.primary : Colors.text.muted}
                style={styles.statusIcon}
              />
            )}
          </View>
        </View>
      </View>
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
        <BlurView intensity={60} tint="dark" style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerInfo}
              onPress={() => router.push(`/profile/${id}`)}
            >
              <Avatar
                source={chatData.avatar}
                name={chatData.name}
                size="md"
                showOnline
                isOnline={chatData.isOnline}
              />
              <View style={styles.headerText}>
                <Text style={styles.headerName}>{chatData.name}</Text>
                <Text style={styles.headerStatus}>
                  {chatData.isOnline ? "Online" : "Offline"}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="call-outline" size={22} color={Colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="videocam-outline" size={22} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>

        {/* Messages */}
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
          />

          {/* Input Area */}
          <BlurView intensity={60} tint="dark" style={styles.inputContainer}>
            <View style={styles.inputContent}>
              <TouchableOpacity style={styles.attachButton}>
                <Ionicons name="add-circle-outline" size={28} color={Colors.text.secondary} />
              </TouchableOpacity>
              <View style={styles.inputWrapper}>
                <RNTextInput
                  ref={inputRef}
                  style={styles.textInput}
                  placeholder="Message..."
                  placeholderTextColor={Colors.text.muted}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  maxLength={1000}
                />
                <TouchableOpacity style={styles.emojiButton}>
                  <Ionicons name="happy-outline" size={24} color={Colors.text.secondary} />
                </TouchableOpacity>
              </View>
              {message.trim() ? (
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                  <LinearGradient
                    colors={Colors.gradients.brand}
                    style={styles.sendButtonGradient}
                  >
                    <Ionicons name="send" size={20} color={Colors.text.dark} />
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.micButton}>
                  <Ionicons name="mic-outline" size={28} color={Colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>
          </BlurView>
        </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.glass.lightBorder,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.xs,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: Spacing.md,
  },
  headerName: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  headerStatus: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: 80,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: Spacing.xs,
    alignItems: "flex-end",
  },
  messageContainerMe: {
    justifyContent: "flex-end",
  },
  messageContainerOther: {
    justifyContent: "flex-start",
  },
  avatarPlaceholder: {
    width: 32,
    marginRight: Spacing.xs,
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    ...Shadow.sm,
  },
  messageBubbleMe: {
    backgroundColor: Colors.brand.primary,
    borderBottomRightRadius: BorderRadius.xs,
  },
  messageBubbleOther: {
    backgroundColor: Colors.glass.light,
    borderBottomLeftRadius: BorderRadius.xs,
    marginLeft: Spacing.xs,
  },
  messageText: {
    fontSize: FontSize.base,
    lineHeight: 20,
  },
  messageTextMe: {
    color: Colors.text.dark,
  },
  messageTextOther: {
    color: Colors.text.primary,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: Spacing.xs,
  },
  messageTime: {
    fontSize: FontSize.xs,
  },
  messageTimeMe: {
    color: "rgba(30, 30, 30, 0.6)",
  },
  messageTimeOther: {
    color: Colors.text.muted,
  },
  statusIcon: {
    marginLeft: Spacing.xs,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.glass.lightBorder,
    paddingBottom: Platform.OS === "ios" ? Spacing.xl : Spacing.md,
  },
  inputContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: Colors.glass.light,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.glass.lightBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minHeight: 44,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: FontSize.base,
    paddingVertical: Spacing.xs,
    maxHeight: 100,
  },
  emojiButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    width: 40,
    height: 40,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  micButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
