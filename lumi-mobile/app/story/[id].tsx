import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  PanResponder,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "@/components/ui";
import { Colors, Spacing, FontSize } from "@/constants/theme";

const { width, height } = Dimensions.get("window");
const STORY_DURATION = 5000; // 5 seconds per story

interface StoryItem {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: Date;
}

interface StoryGroup {
  userId: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  stories: StoryItem[];
}

const mockStoryGroups: StoryGroup[] = [
  {
    userId: "1",
    user: {
      id: "1",
      username: "sarah_wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    stories: [
      {
        id: "s1",
        mediaUrl: "https://picsum.photos/400/800?random=10",
        mediaType: "image",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "s2",
        mediaUrl: "https://picsum.photos/400/800?random=11",
        mediaType: "image",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
  },
  {
    userId: "2",
    user: {
      id: "2",
      username: "mike_adventures",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    stories: [
      {
        id: "s3",
        mediaUrl: "https://picsum.photos/400/800?random=12",
        mediaType: "image",
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    ],
  },
  {
    userId: "3",
    user: {
      id: "3",
      username: "foodie_emma",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    stories: [
      {
        id: "s4",
        mediaUrl: "https://picsum.photos/400/800?random=13",
        mediaType: "image",
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
      },
      {
        id: "s5",
        mediaUrl: "https://picsum.photos/400/800?random=14",
        mediaType: "image",
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        id: "s6",
        mediaUrl: "https://picsum.photos/400/800?random=15",
        mediaType: "image",
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
      },
    ],
  },
];

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Find the initial story group based on id
  useEffect(() => {
    const groupIndex = mockStoryGroups.findIndex((g) => g.userId === id);
    if (groupIndex !== -1) {
      setCurrentGroupIndex(groupIndex);
    }
  }, [id]);

  const currentGroup = mockStoryGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];

  // Progress animation
  useEffect(() => {
    if (isPaused || !currentStory) return;

    progressAnim.setValue(0);
    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });

    animationRef.current.start(({ finished }) => {
      if (finished) {
        handleNext();
      }
    });

    return () => {
      animationRef.current?.stop();
    };
  }, [currentGroupIndex, currentStoryIndex, isPaused]);

  const handleNext = () => {
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      // Next story in same group
      setCurrentStoryIndex((prev) => prev + 1);
    } else if (currentGroupIndex < mockStoryGroups.length - 1) {
      // Next story group
      setCurrentGroupIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      // End of all stories
      router.back();
    }
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      // Previous story in same group
      setCurrentStoryIndex((prev) => prev - 1);
    } else if (currentGroupIndex > 0) {
      // Previous story group
      setCurrentGroupIndex((prev) => prev - 1);
      setCurrentStoryIndex(
        mockStoryGroups[currentGroupIndex - 1].stories.length - 1
      );
    }
  };

  const handleTap = (x: number) => {
    if (x < width / 3) {
      handlePrev();
    } else if (x > (width * 2) / 3) {
      handleNext();
    }
  };

  const handlePressIn = () => {
    setIsPaused(true);
    animationRef.current?.stop();
  };

  const handlePressOut = () => {
    setIsPaused(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!currentGroup || !currentStory) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Image */}
      <Image
        source={{ uri: currentStory.mediaUrl }}
        style={styles.storyImage}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "transparent", "transparent", "rgba(0,0,0,0.4)"]}
        style={styles.gradientOverlay}
        locations={[0, 0.2, 0.8, 1]}
      />

      {/* Touch Areas */}
      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={1}
        onPress={(e) => handleTap(e.nativeEvent.locationX)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Progress Bars */}
        <View style={styles.progressContainer}>
          {currentGroup.stories.map((story, index) => (
            <View key={story.id} style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width:
                      index < currentStoryIndex
                        ? "100%"
                        : index === currentStoryIndex
                        ? progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"],
                          })
                        : "0%",
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => {
              router.back();
              setTimeout(() => router.push(`/profile/${currentGroup.userId}`), 100);
            }}
          >
            <Avatar
              source={currentGroup.user.avatar}
              name={currentGroup.user.username}
              size="md"
            />
            <View style={styles.userText}>
              <Text style={styles.username}>{currentGroup.user.username}</Text>
              <Text style={styles.timestamp}>
                {formatTime(currentStory.createdAt)}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color={Colors.text.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={28} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomContainer}>
          <View style={styles.replyContainer}>
            <View style={styles.replyInput}>
              <Text style={styles.replyPlaceholder}>Send message...</Text>
            </View>
            <TouchableOpacity style={styles.reactionButton}>
              <Ionicons name="heart-outline" size={28} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.reactionButton}>
              <Ionicons name="paper-plane-outline" size={26} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  storyImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  touchArea: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.sm,
    paddingTop: 60,
    gap: 4,
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 1,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.text.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userText: {
    marginLeft: Spacing.sm,
  },
  username: {
    color: Colors.text.primary,
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  timestamp: {
    color: "rgba(255,255,255,0.7)",
    fontSize: FontSize.xs,
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
  },
  replyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  replyInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
  },
  replyPlaceholder: {
    color: "rgba(255,255,255,0.7)",
    fontSize: FontSize.base,
  },
  reactionButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
