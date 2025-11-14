'use client';

import { useEffect, useState, useRef } from "react";
import { Settings, X, Type, Eye, MousePointer2, Keyboard, Volume2, Contrast } from "lucide-react";

type AccessibilitySettings = {
  fontSize: 'normal' | 'large' | 'larger' | 'largest';
  highContrast: boolean;
  reducedMotion: boolean;
  focusVisible: boolean;
  textSpacing: boolean;
  screenReaderAnnouncements: boolean;
};

const defaultSettings: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  focusVisible: true,
  textSpacing: false,
  screenReaderAnnouncements: true,
};

export function AccessibilityDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [announcement, setAnnouncement] = useState<string>('');
  const dashboardRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('a11y-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
        applySettings({ ...defaultSettings, ...parsed });
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, []);

  // Apply settings to document
  const applySettings = (newSettings: AccessibilitySettings) => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    const body = document.body;

    // Font size
    root.classList.remove('a11y-font-normal', 'a11y-font-large', 'a11y-font-larger', 'a11y-font-largest');
    root.classList.add(`a11y-font-${newSettings.fontSize}`);

    // High contrast
    if (newSettings.highContrast) {
      body.classList.add('a11y-high-contrast');
    } else {
      body.classList.remove('a11y-high-contrast');
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      body.classList.add('a11y-reduced-motion');
    } else {
      body.classList.remove('a11y-reduced-motion');
    }

    // Focus visible
    if (newSettings.focusVisible) {
      root.classList.add('a11y-focus-visible');
    } else {
      root.classList.remove('a11y-focus-visible');
    }

    // Text spacing
    if (newSettings.textSpacing) {
      body.classList.add('a11y-text-spacing');
    } else {
      body.classList.remove('a11y-text-spacing');
    }
  };

  // Save and apply settings
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('a11y-settings', JSON.stringify(newSettings));
    }

    // Announce changes to screen readers
    if (newSettings.screenReaderAnnouncements) {
      const messages: Record<string, string> = {
        fontSize: `Font size set to ${value}`,
        highContrast: value ? 'High contrast mode enabled' : 'High contrast mode disabled',
        reducedMotion: value ? 'Reduced motion enabled' : 'Reduced motion disabled',
        focusVisible: value ? 'Focus indicators enabled' : 'Focus indicators disabled',
        textSpacing: value ? 'Increased text spacing enabled' : 'Increased text spacing disabled',
      };
      announceToScreenReader(messages[key] || 'Setting updated');
    }
  };

  // Screen reader announcements
  const announceToScreenReader = (message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 1000);
  };

  // Handle modal open/close
  useEffect(() => {
    if (!isOpen) return;

    lastFocusedElement.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      lastFocusedElement.current?.focus();
    };
  }, [isOpen]);

  // Apply settings on mount
  useEffect(() => {
    applySettings(settings);
  }, []);

  // Keyboard shortcut: Alt+A or Cmd+A to open accessibility dashboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200/50 transition-all duration-300 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-200/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
        aria-label="Open accessibility settings"
        title="Accessibility Settings"
      >
        <Settings className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Accessibility Settings</span>
      </button>

      {/* Screen Reader Announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Dashboard Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-dashboard-title"
        >
          <div
            ref={dashboardRef}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-blue-600" aria-hidden="true" />
                <h2 id="a11y-dashboard-title" className="text-2xl font-semibold text-slate-900">
                  Accessibility Settings
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
                aria-label="Close accessibility settings"
              >
                <X className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Font Size */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <label htmlFor="font-size" className="text-lg font-semibold text-slate-900">
                    Font Size
                  </label>
                </div>
                <p className="text-sm text-slate-600">
                  Adjust the text size to make content easier to read.
                </p>
                <div className="flex gap-2">
                  {(['normal', 'large', 'larger', 'largest'] as const).map((size) => (
                    <button
                      key={size}
                      id={`font-size-${size}`}
                      onClick={() => updateSetting('fontSize', size)}
                      className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition ${
                        settings.fontSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      } focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300`}
                      aria-pressed={settings.fontSize === size}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Contrast className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <label htmlFor="high-contrast" className="text-lg font-semibold text-slate-900">
                    High Contrast Mode
                  </label>
                </div>
                <p className="text-sm text-slate-600">
                  Increase color contrast for better visibility.
                </p>
                <button
                  id="high-contrast"
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left transition ${
                    settings.highContrast
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300`}
                  aria-pressed={settings.highContrast}
                >
                  <span className="font-medium text-slate-900">
                    {settings.highContrast ? 'Enabled' : 'Disabled'}
                  </span>
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <label htmlFor="reduced-motion" className="text-lg font-semibold text-slate-900">
                    Reduced Motion
                  </label>
                </div>
                <p className="text-sm text-slate-600">
                  Minimize animations and transitions for a calmer experience.
                </p>
                <button
                  id="reduced-motion"
                  onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left transition ${
                    settings.reducedMotion
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300`}
                  aria-pressed={settings.reducedMotion}
                >
                  <span className="font-medium text-slate-900">
                    {settings.reducedMotion ? 'Enabled' : 'Disabled'}
                  </span>
                </button>
              </div>

              {/* Focus Indicators */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MousePointer2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <label htmlFor="focus-visible" className="text-lg font-semibold text-slate-900">
                    Focus Indicators
                  </label>
                </div>
                <p className="text-sm text-slate-600">
                  Show visible focus outlines for keyboard navigation.
                </p>
                <button
                  id="focus-visible"
                  onClick={() => updateSetting('focusVisible', !settings.focusVisible)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left transition ${
                    settings.focusVisible
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300`}
                  aria-pressed={settings.focusVisible}
                >
                  <span className="font-medium text-slate-900">
                    {settings.focusVisible ? 'Enabled' : 'Disabled'}
                  </span>
                </button>
              </div>

              {/* Text Spacing */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <label htmlFor="text-spacing" className="text-lg font-semibold text-slate-900">
                    Increased Text Spacing
                  </label>
                </div>
                <p className="text-sm text-slate-600">
                  Increase spacing between letters, words, and lines for easier reading.
                </p>
                <button
                  id="text-spacing"
                  onClick={() => updateSetting('textSpacing', !settings.textSpacing)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left transition ${
                    settings.textSpacing
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300`}
                  aria-pressed={settings.textSpacing}
                >
                  <span className="font-medium text-slate-900">
                    {settings.textSpacing ? 'Enabled' : 'Disabled'}
                  </span>
                </button>
              </div>

              {/* Keyboard Shortcuts Info */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Keyboard className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <h3 className="font-semibold text-slate-900">Keyboard Shortcuts</h3>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li><kbd className="px-2 py-1 bg-white rounded border border-slate-300">Tab</kbd> - Navigate forward</li>
                  <li><kbd className="px-2 py-1 bg-white rounded border border-slate-300">Shift + Tab</kbd> - Navigate backward</li>
                  <li><kbd className="px-2 py-1 bg-white rounded border border-slate-300">Enter</kbd> - Activate button/link</li>
                  <li><kbd className="px-2 py-1 bg-white rounded border border-slate-300">Esc</kbd> - Close dialogs</li>
                  <li><kbd className="px-2 py-1 bg-white rounded border border-slate-300">Alt + A</kbd> or <kbd className="px-2 py-1 bg-white rounded border border-slate-300">⌘ + A</kbd> - Open accessibility settings</li>
                </ul>
              </div>

              {/* Reset Button */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setSettings(defaultSettings);
                    applySettings(defaultSettings);
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('a11y-settings');
                    }
                    announceToScreenReader('Settings reset to defaults');
                  }}
                  className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

