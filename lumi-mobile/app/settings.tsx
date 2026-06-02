import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, GlassCard } from "@/components/ui";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants/theme";
import { useAuthStore } from "@/store";

interface SettingItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  type: "navigate" | "toggle" | "action";
  value?: boolean;
  onPress?: () => void;
  danger?: boolean;
}

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);

  const settingsSections: {
    title: string;
    items: SettingItem[];
  }[] = [
    {
      title: "Account",
      items: [
        {
          id: "edit-profile",
          icon: "person-outline",
          title: "Edit Profile",
          type: "navigate",
          onPress: () => {},
        },
        {
          id: "privacy",
          icon: "lock-closed-outline",
          title: "Privacy",
          subtitle: "Control who can see your content",
          type: "navigate",
          onPress: () => {},
        },
        {
          id: "security",
          icon: "shield-checkmark-outline",
          title: "Security",
          subtitle: "Password, 2FA, login activity",
          type: "navigate",
          onPress: () => {},
        },
        {
          id: "private-account",
          icon: "eye-off-outline",
          title: "Private Account",
          type: "toggle",
          value: privateAccount,
          onPress: () => setPrivateAccount(!privateAccount),
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          id: "push-notifications",
          icon: "notifications-outline",
          title: "Push Notifications",
          type: "toggle",
          value: notifications,
          onPress: () => setNotifications(!notifications),
        },
        {
          id: "read-receipts",
          icon: "checkmark-done-outline",
          title: "Read Receipts",
          subtitle: "Show when you've read messages",
          type: "toggle",
          value: readReceipts,
          onPress: () => setReadReceipts(!readReceipts),
        },
      ],
    },
    {
      title: "Appearance",
      items: [
        {
          id: "dark-mode",
          icon: "moon-outline",
          title: "Dark Mode",
          type: "toggle",
          value: darkMode,
          onPress: () => setDarkMode(!darkMode),
        },
        {
          id: "language",
          icon: "language-outline",
          title: "Language",
          subtitle: "English",
          type: "navigate",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          id: "help",
          icon: "help-circle-outline",
          title: "Help Center",
          type: "navigate",
          onPress: () => {},
        },
        {
          id: "report",
          icon: "flag-outline",
          title: "Report a Problem",
          type: "navigate",
          onPress: () => {},
        },
        {
          id: "about",
          icon: "information-circle-outline",
          title: "About",
          subtitle: "Version 1.0.0",
          type: "navigate",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Actions",
      items: [
        {
          id: "add-account",
          icon: "person-add-outline",
          title: "Add Account",
          type: "action",
          onPress: () => {},
        },
        {
          id: "logout",
          icon: "log-out-outline",
          title: "Log Out",
          type: "action",
          danger: true,
          onPress: () => {
            logout();
            router.replace("/(auth)/login");
          },
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
      activeOpacity={item.type === "toggle" ? 1 : 0.7}
    >
      <View
        style={[
          styles.settingIconContainer,
          item.danger && styles.settingIconDanger,
        ]}
      >
        <Ionicons
          name={item.icon}
          size={22}
          color={item.danger ? Colors.status.error : Colors.brand.primary}
        />
      </View>
      <View style={styles.settingContent}>
        <Text
          style={[styles.settingTitle, item.danger && styles.settingTitleDanger]}
        >
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>
      {item.type === "navigate" && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.text.muted}
        />
      )}
      {item.type === "toggle" && (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{
            false: Colors.glass.light,
            true: Colors.brand.primary,
          }}
          thumbColor={Colors.text.primary}
        />
      )}
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Card */}
          <GlassCard style={styles.profileCard}>
            <Avatar
              source={user?.avatar || "https://i.pravatar.cc/150?img=8"}
              name={user?.fullName || "John Doe"}
              size="lg"
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.fullName || "John Doe"}
              </Text>
              <Text style={styles.profileUsername}>
                @{user?.username || "johndoe"}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.text.muted}
            />
          </GlassCard>

          {/* Settings Sections */}
          {settingsSections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <GlassCard style={styles.sectionCard} noPadding>
                {section.items.map((item, index) => (
                  <View key={item.id}>
                    {renderSettingItem(item)}
                    {index < section.items.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </GlassCard>
            </View>
          ))}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Lumi</Text>
            <Text style={styles.footerVersion}>Version 1.0.0</Text>
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
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing["4xl"],
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  profileInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  profileName: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  profileUsername: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text.muted,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  sectionCard: {
    paddingVertical: Spacing.xs,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(182, 196, 162, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  settingIconDanger: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  settingContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  settingTitle: {
    fontSize: FontSize.base,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  settingTitleDanger: {
    color: Colors.status.error,
  },
  settingSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.glass.lightBorder,
    marginLeft: 60,
  },
  footer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  footerText: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.brand.primary,
  },
  footerVersion: {
    fontSize: FontSize.sm,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },
});
