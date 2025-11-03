interface SettingsProps {
  theme: "auto" | "light" | "dark";
  fontSize: "small" | "normal" | "large";
  highContrast: boolean;
  onThemeChange: (theme: "auto" | "light" | "dark") => void;
  onFontSizeChange: (fontSize: "small" | "normal" | "large") => void;
  onHighContrastChange: (enabled: boolean) => void;
}

export default function Settings({
  theme,
  fontSize,
  highContrast,
  onThemeChange,
  onFontSizeChange,
  onHighContrastChange,
}: SettingsProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">User Settings</h1>
            <p className="text-blue-100">Customize your personal interface preferences</p>
          </div>
        </div>
      </div>

      {/* UI Preferences Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Interface Preferences</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customize how the application looks and feels</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "auto", label: "Auto", icon: "🌓", description: "Follow system" },
                { value: "light", label: "Light", icon: "☀️", description: "Light mode" },
                { value: "dark", label: "Dark", icon: "🌙", description: "Dark mode" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onThemeChange(option.value as "auto" | "light" | "dark")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === option.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Font Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "small", label: "Small", size: "text-xs" },
                { value: "normal", label: "Normal", size: "text-sm" },
                { value: "large", label: "Large", size: "text-base" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFontSizeChange(option.value as "small" | "normal" | "large")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    fontSize === option.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className={`font-medium text-gray-900 dark:text-white ${option.size}`}>
                    Aa {option.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {option.value === "small" && "Compact text"}
                    {option.value === "normal" && "Standard text"}
                    {option.value === "large" && "Larger text"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  High Contrast Mode
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Improve readability with enhanced contrast
                </p>
              </div>
              <button
                onClick={() => onHighContrastChange(!highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  highContrast ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    highContrast ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">About Settings</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              These settings only affect your personal interface preferences. For system-wide configuration options, 
              please contact an administrator or visit the Admin Settings page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}