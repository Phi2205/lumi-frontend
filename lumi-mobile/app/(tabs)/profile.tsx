import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, GlassCard, Button } from "@/components/ui";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants/theme";
import { useAuthStore } from "@/store";

const { width } = Dimensions.get("window");
const POST_SIZE = (width - Spacing.xl * 2 - 4) / 3;

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  posts: { id: string; imageUrl: string; likes: number; comments: number }[];
}

const mockProfile: UserProfile = {
  id: "me",
  username: "johndoe",
  fullName: "John Doe",
  avatar: "https://i.pravatar.cc/150?img=8",
  bio: "Digital creator | Photography enthusiast | Coffee lover",
  postsCount: 156,
  followersCount: 12500,
  followingCount: 890,
  isVerified: true,
  posts: Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    imageUrl: `https://picsum.photos/400/400?random=${i + 20}`,
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
  })),
};

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">("posts");

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const renderPost = ({ item }: { item: typeof mockProfile.posts[0] }) => (
    <TouchableOpacity style={styles.postItem} activeOpacity={0.8}>
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      <View style={styles.postOverlay}>
        <View style={styles.postStats}>
          <Ionicons name="heart" size={14} color={Colors.text.primary} />
          <Text style={styles.postStatText}>{formatNumber(item.likes)}</Text>
        </View>
        <View style={styles.postStats}>
          <Ionicons name="chatbubble" size={14} color={Colors.text.primary} />
          <Text style={styles.postStatText}>{formatNumber(item.comments)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.background, "#252525"]}
        style={styles.gradient}
      />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.username}>{mockProfile.username}</Text>
            {mockProfile.isVerified && (
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={Colors.brand.primary}
                style={styles.verifiedIcon}
              />
            )}
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="add-circle-outline" size={28} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push("/settings")}
            >
              <Ionicons name="menu-outline" size={28} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatarSection}>
              <Avatar
                source={mockProfile.avatar}
                name={mockProfile.fullName}
                size="xl"
                showStoryRing
                hasStory
              />
            </View>

            <View style={styles.statsSection}>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(mockProfile.postsCount)}
                </Text>
                <Text style={styles.statLabel}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(mockProfile.followersCount)}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(mockProfile.followingCount)}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioSection}>
            <Text style={styles.fullName}>{mockProfile.fullName}</Text>
            <Text style={styles.bio}>{mockProfile.bio}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Edit Profile"
              onPress={() => {}}
              variant="secondary"
              style={styles.actionButton}
            />
            <Button
              title="Share Profile"
              onPress={() => {}}
              variant="secondary"
              style={styles.actionButton}
            />
            <TouchableOpacity style={styles.discoverButton}>
              <Ionicons name="person-add-outline" size={18} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Highlights */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightsList}
          >
            <TouchableOpacity style={styles.highlightItem}>
              <View style={styles.highlightAdd}>
                <Ionicons name="add" size={28} color={Colors.text.primary} />
              </View>
              <Text style={styles.highlightText}>New</Text>
            </TouchableOpacity>
            {["Travel", "Food", "Work", "Friends"].map((highlight) => (
              <TouchableOpacity key={highlight} style={styles.highlightItem}>
                <View style={styles.highlightImage}>
                  <Image
                    source={{
                      uri: `https://picsum.photos/100/100?random=${highlight}`,
                    }}
                    style={styles.highlightImageInner}
                  />
                </View>
                <Text style={styles.highlightText}>{highlight}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "posts" && styles.tabActive]}
              onPress={() => setActiveTab("posts")}
            >
              <Ionicons
                name="grid-outline"
                size={24}
                color={
                  activeTab === "posts"
                    ? Colors.text.primary
                    : Colors.text.muted
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "saved" && styles.tabActive]}
              onPress={() => setActiveTab("saved")}
            >
              <Ionicons
                name="bookmark-outline"
                size={24}
                color={
                  activeTab === "saved"
                    ? Colors.text.primary
                    : Colors.text.muted
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "tagged" && styles.tabActive]}
              onPress={() => setActiveTab("tagged")}
            >
              <Ionicons
                name="person-outline"
                size={24}
                color={
                  activeTab === "tagged"
                    ? Colors.text.primary
                    : Colors.text.muted
                }
              />
            </TouchableOpacity>
          </View>

          {/* Posts Grid */}
          <View style={styles.postsGrid}>
            {mockProfile.posts.map((post) => (
              <View key={post.id}>{renderPost({ item: post })}</View>
            ))}
          </View>

          {/* Logout Button (for demo) */}
          <View style={styles.logoutSection}>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="outline"
              style={styles.logoutButton}
            />
          </View>
        </ScrollView>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  verifiedIcon: {
    marginLeft: Spacing.xs,
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  profileSection: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  avatarSection: {
    marginRight: Spacing.xl,
  },
  statsSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  bioSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  fullName: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  bio: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  discoverButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.glass.light,
    borderWidth: 1,
    borderColor: Colors.glass.lightBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightsList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  highlightItem: {
    alignItems: "center",
    marginRight: Spacing.md,
    width: 70,
  },
  highlightAdd: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.glass.light,
    borderWidth: 1,
    borderColor: Colors.glass.lightBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.glass.lightBorder,
    padding: 2,
  },
  highlightImageInner: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  highlightText: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.glass.lightBorder,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.text.primary,
  },
  postsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.lg,
    paddingTop: 2,
    gap: 2,
  },
  postItem: {
    width: POST_SIZE,
    height: POST_SIZE,
    position: "relative",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  postOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    opacity: 0,
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  postStatText: {
    color: Colors.text.primary,
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  logoutSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  logoutButton: {
    borderColor: Colors.status.error,
  },
});
