import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import {
  Monitor,
  Moon,
  Sun,
  Type,
  Contrast,
} from "lucide-react";

interface SettingsProps {
  theme: "auto" | "light" | "dark";
  fontSize: "small" | "normal" | "large";
  highContrast: boolean;
  onThemeChange: (theme: "auto" | "light" | "dark") => void;
  onFontSizeChange: (
    size: "small" | "normal" | "large",
  ) => void;
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
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">
          Customize your application preferences and
          accessibility options.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the visual appearance of the
              application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label htmlFor="theme-select">Theme</Label>
              <Select
                value={theme}
                onValueChange={onThemeChange}
              >
                <SelectTrigger
                  id="theme-select"
                  className="w-full"
                >
                  <div className="flex items-center gap-2">
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Auto (System)
                    </div>
                  </SelectItem>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose your preferred color theme. Auto will
                match your system preference.
              </p>
            </div>

            <Separator />

            {/* High Contrast Mode */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label
                  htmlFor="high-contrast"
                  className="flex items-center gap-2"
                >
                  <Contrast className="h-4 w-4" />
                  High Contrast Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Increase contrast for better visibility and
                  accessibility.
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={onHighContrastChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Accessibility
            </CardTitle>
            <CardDescription>
              Adjust settings to improve readability and
              usability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Font Size */}
            <div className="space-y-3">
              <Label htmlFor="font-size-select">
                Font Size
              </Label>
              <Select
                value={fontSize}
                onValueChange={onFontSizeChange}
              >
                <SelectTrigger
                  id="font-size-select"
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">
                    Small (12px)
                  </SelectItem>
                  <SelectItem value="normal">
                    Normal (14px)
                  </SelectItem>
                  <SelectItem value="large">
                    Large (16px)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Adjust the base font size throughout the
                application for better readability.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}