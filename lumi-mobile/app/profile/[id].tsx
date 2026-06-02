import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, GlassCard, Button } from "@/components/ui";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants/theme";

const { width } = Dimensions.get("window");
const POST_SIZE = (width - Spacing.xl * 2 - 4) / 3;

// Mock user profiles
const mockProfiles: Record<
  string,
  {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
    bio: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
    isVerified: boolean;
    isFollowing: boolean;
    posts: { id: string; imageUrl: string }[];
  }
> = {
  "1": {
    id: "1",
    username: "sarah_wilson",
    fullName: "Sarah Wilson",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "Travel photographer | Nature lover | Adventure seeker",
    postsCount: 234,
    followersCount: 45600,
    followingCount: 1200,
    isVerified: true,
    isFollowing: false,
    posts: Array.from({ length: 9 }, (_, i) => ({
      id: String(i + 1),
      imageUrl: `https://picsum.photos/400/400?random=${i + 100}`,
    })),
  },
  "2": {
    id: "2",
    username: "mike_adventures",
    fullName: "Mike Johnson",
    avatar: "https://i.pravatar.cc/150?img=2",
    bio: "Outdoor enthusiast | Mountain biker | Coffee addict",
    postsCount: 89,
    followersCount: 12300,
    followingCount: 560,
    isVerified: false,
    isFollowing: true,
    posts: Array.from({ length: 9 }, (_, i) => ({
      id: String(i + 1),
      imageUrl: `https://picsum.photos/400/400?random=${i + 200}`,
    })),
  },
  "3": {
    id: "3",
    username: "foodie_emma",
    fullName: "Emma Davis",
    avatar: "https://i.pravatar.cc/150?img=3",
    bio: "Food blogger | Home chef | Recipe creator",
    postsCount: 456,
    followersCount: 89000,
    followingCount: 340,
    isVerified: true,
    isFollowing: false,
    posts: Array.from({ length: 9 }, (_, i) => ({
      id: String(i + 1),
      imageUrl: `https://picsum.photos/400/400?random=${i + 300}`,
    })),
  },
};

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState(
    mockProfiles[id as string] || mockProfiles["1"]
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleFollow = () => {
    setProfile((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followersCount: prev.isFollowing
        ? prev.followersCount - 1
        : prev.followersCount + 1,
    }));
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.username}>{profile.username}</Text>
            {profile.isVerified && (
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={Colors.brand.primary}
                style={styles.verifiedIcon}
              />
            )}
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatarSection}>
              <Avatar
                source={profile.avatar}
                name={profile.fullName}
                size="xl"
              />
            </View>

            <View style={styles.statsSection}>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(profile.postsCount)}
                </Text>
                <Text style={styles.statLabel}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(profile.followersCount)}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(profile.followingCount)}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioSection}>
            <Text style={styles.fullName}>{profile.fullName}</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title={profile.isFollowing ? "Following" : "Follow"}
              onPress={handleFollow}
              variant={profile.isFollowing ? "secondary" : "primary"}
              style={styles.actionButton}
            />
            <Button
              title="Message"
              onPress={() => router.push(`/chat/${profile.id}`)}
              variant="secondary"
              style={styles.actionButton}
            />
            <TouchableOpacity style={styles.discoverButton}>
              <Ionicons
                name="person-add-outline"
                size={18}
                color={Colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, styles.tabActive]}>
              <Ionicons
                name="grid-outline"
                size={24}
                color={Colors.text.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Ionicons
                name="play-circle-outline"
                size={24}
                color={Colors.text.muted}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Ionicons
                name="person-outline"
                size={24}
                color={Colors.text.muted}
              />
            </TouchableOpacity>
          </View>

          {/* Posts Grid */}
          <View style={styles.postsGrid}>
            {profile.posts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.postItem}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: post.imageUrl }}
                  style={styles.postImage}
                />
              </TouchableOpacity>
            ))}
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
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
  moreButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: Spacing["4xl"],
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
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
});
