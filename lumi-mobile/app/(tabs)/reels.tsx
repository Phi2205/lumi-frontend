import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "@/components/ui";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants/theme";

const { width, height } = Dimensions.get("window");

interface Reel {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  music?: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

const mockReels: Reel[] = [
  {
    id: "1",
    user: {
      id: "1",
      username: "sarah_wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
      isVerified: true,
    },
    videoUrl: "",
    thumbnailUrl: "https://picsum.photos/400/800?random=1",
    caption: "Beautiful sunset at the beach! What a perfect evening.",
    likes: 12500,
    comments: 234,
    shares: 89,
    music: "Sunset Vibes - ChillHop",
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "2",
    user: {
      id: "2",
      username: "mike_adventures",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    videoUrl: "",
    thumbnailUrl: "https://picsum.photos/400/800?random=2",
    caption: "Mountain hiking is the best therapy! Who agrees?",
    likes: 8900,
    comments: 156,
    shares: 45,
    music: "Nature Sounds - Relaxing",
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "3",
    user: {
      id: "3",
      username: "foodie_emma",
      avatar: "https://i.pravatar.cc/150?img=3",
      isVerified: true,
    },
    videoUrl: "",
    thumbnailUrl: "https://picsum.photos/400/800?random=3",
    caption: "Homemade pasta from scratch! Recipe in bio.",
    likes: 25600,
    comments: 890,
    shares: 234,
    music: "Italian Kitchen - Cooking Beats",
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "4",
    user: {
      id: "4",
      username: "dance_queen",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    videoUrl: "",
    thumbnailUrl: "https://picsum.photos/400/800?random=4",
    caption: "New choreography! Let me know what you think.",
    likes: 45000,
    comments: 1200,
    shares: 567,
    music: "Dance Hit 2024 - DJ Max",
    isLiked: false,
    isBookmarked: false,
  },
];

export default function ReelsScreen() {
  const [reels, setReels] = useState(mockReels);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleLike = (index: number) => {
    setReels((prev) =>
      prev.map((reel, i) =>
        i === index
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel
      )
    );
  };

  const handleBookmark = (index: number) => {
    setReels((prev) =>
      prev.map((reel, i) =>
        i === index ? { ...reel, isBookmarked: !reel.isBookmarked } : reel
      )
    );
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderReel = ({ item, index }: { item: Reel; index: number }) => {
    const isActive = index === activeIndex;

    return (
      <View style={styles.reelContainer}>
        {/* Background Image */}
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={styles.reelImage}
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
          style={styles.gradientOverlay}
          locations={[0, 0.5, 1]}
        />

        {/* Right Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(index)}
          >
            <Ionicons
              name={item.isLiked ? "heart" : "heart-outline"}
              size={32}
              color={item.isLiked ? Colors.status.error : Colors.text.primary}
            />
            <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="chatbubble-outline"
              size={28}
              color={Colors.text.primary}
            />
            <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="paper-plane-outline"
              size={28}
              color={Colors.text.primary}
            />
            <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleBookmark(index)}
          >
            <Ionicons
              name={item.isBookmarked ? "bookmark" : "bookmark-outline"}
              size={28}
              color={item.isBookmarked ? Colors.brand.primary : Colors.text.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Info */}
        <View style={styles.bottomContainer}>
          {/* User Info */}
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => router.push(`/profile/${item.user.id}`)}
          >
            <Avatar
              source={item.user.avatar}
              name={item.user.username}
              size="md"
            />
            <View style={styles.userText}>
              <View style={styles.usernameRow}>
                <Text style={styles.username}>{item.user.username}</Text>
                {item.user.isVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={Colors.brand.primary}
                    style={styles.verifiedIcon}
                  />
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Caption */}
          <Text style={styles.caption} numberOfLines={2}>
            {item.caption}
          </Text>

          {/* Music */}
          {item.music && (
            <View style={styles.musicContainer}>
              <Ionicons
                name="musical-notes"
                size={14}
                color={Colors.text.primary}
              />
              <Text style={styles.musicText} numberOfLines={1}>
                {item.music}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reels</Text>
        <TouchableOpacity style={styles.cameraButton}>
          <Ionicons name="camera-outline" size={28} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Reels List */}
      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={renderReel}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize["2xl"],
    fontWeight: "700",
    color: Colors.text.primary,
  },
  cameraButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  reelContainer: {
    width,
    height,
    position: "relative",
  },
  reelImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  actionsContainer: {
    position: "absolute",
    right: Spacing.md,
    bottom: 140,
    alignItems: "center",
    gap: Spacing.lg,
  },
  actionButton: {
    alignItems: "center",
  },
  actionText: {
    color: Colors.text.primary,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
    fontWeight: "600",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 70,
    paddingHorizontal: Spacing.lg,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  userText: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: Colors.text.primary,
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  verifiedIcon: {
    marginLeft: Spacing.xs,
  },
  followButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.text.primary,
  },
  followText: {
    color: Colors.text.primary,
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  caption: {
    color: Colors.text.primary,
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  musicContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
  },
  musicText: {
    color: Colors.text.primary,
    fontSize: FontSize.xs,
    marginLeft: Spacing.xs,
    maxWidth: 200,
  },
});
