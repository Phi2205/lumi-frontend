import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { BlurView } from "expo-blur";
import { Colors, BorderRadius, Shadow } from "@/constants/theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  variant?: "light" | "dark" | "elevated";
  noPadding?: boolean;
}

export function GlassCard({
  children,
  style,
  intensity = 40,
  variant = "light",
  noPadding = false,
}: GlassCardProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case "dark":
        return Colors.glass.dark;
      case "elevated":
        return "rgba(255, 255, 255, 0.20)";
      default:
        return Colors.glass.light;
    }
  };

  return (
    <View style={[styles.container, Shadow.glass, style]}>
      <BlurView intensity={intensity} style={styles.blur} tint="dark">
        <View
          style={[
            styles.content,
            { backgroundColor: getBackgroundColor() },
            noPadding && styles.noPadding,
          ]}
        >
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.glass,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.glass.lightBorder,
  },
  blur: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  noPadding: {
    padding: 0,
  },
});
