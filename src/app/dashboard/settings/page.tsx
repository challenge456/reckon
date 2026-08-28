import { Settings, Palette, Bell, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted mt-1">Customize your RECKON experience</p>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted mt-1">
                Choose between light and dark mode
              </p>
            </div>
            <p className="text-sm font-medium text-muted">
              Use sidebar toggle
            </p>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="space-y-3">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Goal Deadline Reminders</p>
                <p className="text-sm text-muted mt-1">
                  Get notified when a goal deadline is approaching
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Consequence Alerts</p>
                <p className="text-sm text-muted mt-1">
                  Notifications when consequences are assigned
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Achievement Unlocks</p>
                <p className="text-sm text-muted mt-1">
                  Celebrate when you unlock new achievements
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Timezone Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Location & Time</h2>
        </div>
        <div className="card">
          <div>
            <p className="font-medium">Timezone</p>
            <p className="text-sm text-muted mt-1">
              Used for deadline calculations and notifications
            </p>
            <select className="input w-full mt-3">
              <option>Detecting from system...</option>
              <option>UTC</option>
              <option>America/New_York</option>
              <option>America/Chicago</option>
              <option>America/Denver</option>
              <option>America/Los_Angeles</option>
              <option>Europe/London</option>
              <option>Europe/Paris</option>
              <option>Asia/Tokyo</option>
              <option>Asia/Shanghai</option>
              <option>Australia/Sydney</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Floating Chat Widget</p>
              <p className="text-sm text-muted mt-1">
                Enable the AI assistant chat button
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-error">Danger Zone</h2>
        <div className="card border-error/20 bg-error/5">
          <div>
            <p className="font-medium text-error">Delete Account</p>
            <p className="text-sm text-muted mt-1">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
            <button className="btn btn-sm mt-4" style={{ color: "var(--color-error)" }}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}