"use client"

import { useState } from "react"
import { Settings, Bell, Lock, Users, Palette, Eye, Save, X } from "lucide-react"
import { GlassCard } from "@/lib/components/glass-card"
import { GlassButton } from "@/lib/components/glass-button"
import { GlassInput } from "@/lib/components/glass-input"
import { GlassContainer } from "@/lib/components/glass-container"
import { GlassBadge } from "@/lib/components/glass-badge"

const settingsSections = [
  { id: "account", label: "Account Settings", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "team", label: "Team Management", icon: Users },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account")

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings />
      case "notifications":
        return <NotificationSettings />
      case "privacy":
        return <PrivacySettings />
      case "appearance":
        return <AppearanceSettings />
      case "team":
        return <TeamSettings />
      default:
        return <AccountSettings />
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Complex Gradient Background */}
      <div
        className="fixed inset-0 -z-10 transition-all duration-1000"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(3, 0, 20, 0.8) 0%, #030014 50%, #020010 100%)'
        }}
      />
      <div
        className="fixed inset-0 -z-10 opacity-40 transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 30% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
        }}
      />

      <main className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Settings
          </h1>
          <p className="text-white/70 text-lg">
            Manage your account and preferences
          </p>
        </div>

        {/* Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <GlassContainer
              className="p-4 sticky top-6"
              blur={25}
              refraction={0.12}
              depth={4}
            >
              <div className="space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                        activeSection === section.id
                          ? "bg-blue-500/40 text-white border border-blue-400/50"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{section.label}</span>
                    </button>
                  )
                })}
              </div>
            </GlassContainer>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderSection()}
          </div>
        </div>
      </main>
    </div>
  )
}

function AccountSettings() {
  return (
    <GlassContainer
      className="p-8"
      blur={25}
      refraction={0.12}
      depth={4}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

      <div className="space-y-6">
        <GlassInput
          label="Full Name"
          placeholder="Enter your full name"
          defaultValue="Alex Phoenix"
          blur={20}
          refraction={0.12}
          depth={3}
        />

        <GlassInput
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          defaultValue="alex@example.com"
          blur={20}
          refraction={0.12}
          depth={3}
        />

        <GlassInput
          label="Username"
          placeholder="Your username"
          defaultValue="alexphoenix"
          blur={20}
          refraction={0.12}
          depth={3}
        />

        <GlassInput
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 123-4567"
          blur={20}
          refraction={0.12}
          depth={3}
        />

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Account Type
          </label>
          <GlassContainer
            className="p-3 flex items-center gap-2"
            blur={20}
            refraction={0.12}
            depth={3}
          >
            <select className="bg-transparent text-white flex-1 focus:outline-none text-sm">
              <option>Premium</option>
              <option>Professional</option>
              <option>Free</option>
            </select>
          </GlassContainer>
        </div>

        <div className="pt-4 border-t border-white/10 flex gap-3">
          <GlassButton
            variant="primary"
            blur={20}
            refraction={0.12}
            depth={3}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </GlassButton>
          <GlassButton
            variant="ghost"
            blur={20}
            refraction={0.12}
            depth={3}
          >
            Cancel
          </GlassButton>
        </div>
      </div>
    </GlassContainer>
  )
}

function NotificationSettings() {
  return (
    <GlassContainer
      className="p-8"
      blur={25}
      refraction={0.12}
      depth={4}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>

      <div className="space-y-4">
        {[
          { label: "Email Notifications", description: "Receive email updates about your account" },
          { label: "Marketing Emails", description: "Receive promotional content and special offers" },
          { label: "Product Updates", description: "Get notified about new features and updates" },
          { label: "Security Alerts", description: "Critical alerts about your account security" },
          { label: "Weekly Digest", description: "Receive a weekly summary of your activities" },
          { label: "Push Notifications", description: "Mobile push notifications" },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg bg-white/10 hover:bg-white/15 transition-all"
          >
            <div>
              <h4 className="text-white font-medium">{item.label}</h4>
              <p className="text-white/60 text-sm">{item.description}</p>
            </div>
            <input
              type="checkbox"
              defaultChecked={index < 4}
              className="w-5 h-5 rounded cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-white/10 flex gap-3">
        <GlassButton
          variant="primary"
          blur={20}
          refraction={0.12}
          depth={3}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </GlassButton>
      </div>
    </GlassContainer>
  )
}

function PrivacySettings() {
  return (
    <GlassContainer
      className="p-8"
      blur={25}
      refraction={0.12}
      depth={4}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Privacy & Security</h2>

      <div className="space-y-6">
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Password Management</h3>
          <div className="space-y-4">
            <GlassInput
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              blur={20}
              refraction={0.12}
              depth={3}
            />
            <GlassInput
              label="New Password"
              type="password"
              placeholder="Enter new password"
              blur={20}
              refraction={0.12}
              depth={3}
            />
            <GlassInput
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              blur={20}
              refraction={0.12}
              depth={3}
            />
            <GlassButton
              variant="primary"
              blur={20}
              refraction={0.12}
              depth={3}
            >
              Update Password
            </GlassButton>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white">Enable Two-Factor Authentication</p>
              <p className="text-white/60 text-sm">Enhance your account security</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" />
          </div>
          <GlassButton
            variant="secondary"
            blur={20}
            refraction={0.12}
            depth={3}
          >
            Set Up 2FA
          </GlassButton>
        </div>

        <div className="pt-4 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
          <p className="text-white/70 text-sm mb-4">
            Manage devices and sessions where you are logged in
          </p>
          <GlassButton
            variant="ghost"
            blur={20}
            refraction={0.12}
            depth={3}
          >
            Sign Out from All Devices
          </GlassButton>
        </div>
      </div>
    </GlassContainer>
  )
}

function AppearanceSettings() {
  return (
    <GlassContainer
      className="p-8"
      blur={25}
      refraction={0.12}
      depth={4}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Appearance</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: "Light", value: "light" },
              { name: "Dark", value: "dark" },
              { name: "Auto", value: "auto" },
            ].map((theme) => (
              <label
                key={theme.value}
                className="relative cursor-pointer"
              >
                <div className="p-4 rounded-lg border-2 border-white/20 hover:border-white/40 transition-all text-center">
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    defaultChecked={theme.value === "dark"}
                    className="sr-only"
                  />
                  <span className="text-white font-medium">{theme.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Accent Color</h3>
          <div className="grid grid-cols-6 gap-3">
            {["blue", "cyan", "purple", "pink", "yellow", "green"].map((color) => (
              <label key={color} className="cursor-pointer">
                <div
                  className={`w-12 h-12 rounded-lg border-2 border-white/20 hover:border-white/40 transition-all`}
                  style={{
                    backgroundColor: `rgb(${
                      color === "blue"
                        ? "59, 130, 246"
                        : color === "cyan"
                        ? "34, 211, 238"
                        : color === "purple"
                        ? "168, 85, 247"
                        : color === "pink"
                        ? "236, 72, 153"
                        : color === "yellow"
                        ? "250, 204, 21"
                        : "34, 197, 94"
                    })`,
                  }}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex gap-3">
          <GlassButton
            variant="primary"
            blur={20}
            refraction={0.12}
            depth={3}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </GlassButton>
        </div>
      </div>
    </GlassContainer>
  )
}

function TeamSettings() {
  return (
    <GlassContainer
      className="p-8"
      blur={25}
      refraction={0.12}
      depth={4}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Team Management</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
          <div className="space-y-3">
            {[
              { name: "You", email: "alex@example.com", role: "Owner" },
              { name: "Sarah Designer", email: "sarah@example.com", role: "Admin" },
              { name: "John Developer", email: "john@example.com", role: "Member" },
            ].map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-white/10 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{member.name}</p>
                    <p className="text-white/60 text-sm">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GlassBadge variant="blue" blur={15} refraction={0.12} depth={2}>
                    {member.role}
                  </GlassBadge>
                  {index !== 0 && (
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                      <X className="w-4 h-4 text-white/70" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Invite Team Member</h3>
          <div className="space-y-3">
            <GlassInput
              label="Email Address"
              type="email"
              placeholder="teammate@example.com"
              blur={20}
              refraction={0.12}
              depth={3}
            />
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Role
              </label>
              <GlassContainer
                className="p-3 flex items-center gap-2"
                blur={20}
                refraction={0.12}
                depth={3}
              >
                <select className="bg-transparent text-white flex-1 focus:outline-none text-sm">
                  <option>Member</option>
                  <option>Admin</option>
                </select>
              </GlassContainer>
            </div>
            <GlassButton
              variant="primary"
              blur={20}
              refraction={0.12}
              depth={3}
            >
              Send Invite
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassContainer>
  )
}
