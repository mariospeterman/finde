'use client';

import { startTransition, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Contrast, Eye, Keyboard, MousePointer2, Settings, Sparkles, Type, Volume2 } from "lucide-react";

type FontOption = "normal" | "large" | "larger" | "largest";
type AccessibilitySettings = {
  fontSize: FontOption;
  highContrast: boolean;
  reducedMotion: boolean;
  focusVisible: boolean;
  textSpacing: boolean;
  highlightLinks: boolean;
  screenReaderAnnouncements: boolean;
};

type BooleanSettingKey = Exclude<keyof AccessibilitySettings, "fontSize">;

type ToggleDefinition = {
  key: BooleanSettingKey;
  label: string;
  description: string;
  icon: LucideIcon;
};

type PresetDefinition = {
  id: string;
  name: string;
  description: string;
  settings: AccessibilitySettings;
};

const STORAGE_KEY = "a11y-settings";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const defaultSettings: AccessibilitySettings = {
  fontSize: "normal",
  highContrast: false,
  reducedMotion: false,
  focusVisible: true,
  textSpacing: false,
  highlightLinks: false,
  screenReaderAnnouncements: true,
};

const FONT_SIZE_OPTIONS: { value: FontOption; label: string; helper: string }[] = [
  { value: "normal", label: "Standard", helper: "Default sizing" },
  { value: "large", label: "Large", helper: "15% larger text" },
  { value: "larger", label: "Larger", helper: "30% larger text" },
  { value: "largest", label: "Maximum", helper: "50% larger text" },
];

const VISUAL_TOGGLES: ToggleDefinition[] = [
  {
    key: "highContrast",
    label: "High contrast mode",
    description: "Increase colour contrast across the page for low-vision support.",
    icon: Contrast,
  },
  {
    key: "highlightLinks",
    label: "Highlight links",
    description: "Underline and thicken inline links to improve discoverability.",
    icon: Sparkles,
  },
  {
    key: "textSpacing",
    label: "Increase text spacing",
    description: "Add breathing room between letters, words, and lines.",
    icon: Type,
  },
];

const INTERACTION_TOGGLES: ToggleDefinition[] = [
  {
    key: "reducedMotion",
    label: "Reduce motion",
    description: "Limit animations and smooth scrolling for vestibular comfort.",
    icon: Eye,
  },
  {
    key: "focusVisible",
    label: "Enhanced focus outlines",
    description: "Show thicker, high-contrast outlines for keyboard navigation.",
    icon: MousePointer2,
  },
];

const ASSISTIVE_TOGGLES: ToggleDefinition[] = [
  {
    key: "screenReaderAnnouncements",
    label: "Screen reader announcements",
    description: "Hear polite updates when settings change (recommended).",
    icon: Volume2,
  },
];

const BOOLEAN_SETTING_MESSAGES: Record<BooleanSettingKey, { on: string; off: string }> = {
  highContrast: {
    on: "High contrast mode enabled",
    off: "High contrast mode disabled",
  },
  reducedMotion: {
    on: "Reduced motion enabled",
    off: "Reduced motion disabled",
  },
  focusVisible: {
    on: "Enhanced focus outlines enabled",
    off: "Enhanced focus outlines disabled",
  },
  textSpacing: {
    on: "Text spacing increased",
    off: "Text spacing reset",
  },
  highlightLinks: {
    on: "Links highlighted for visibility",
    off: "Link highlight disabled",
  },
  screenReaderAnnouncements: {
    on: "Screen reader announcements enabled",
    off: "Screen reader announcements disabled",
  },
};

const createPreset = (id: string, name: string, description: string, overrides: Partial<AccessibilitySettings>): PresetDefinition => ({
  id,
  name,
  description,
  settings: { ...defaultSettings, ...overrides },
});

const PRESETS: PresetDefinition[] = [
  createPreset(
    "clarity",
    "Clarity boost",
    "Larger type, strong focus outlines, and highlighted links for quick scanning.",
    { fontSize: "larger", focusVisible: true, highlightLinks: true, textSpacing: true }
  ),
  createPreset(
    "calm",
    "Calm motion",
    "Reduce motion while keeping text size comfortable and focus outlines visible.",
    { reducedMotion: true, focusVisible: true, fontSize: "large" }
  ),
  createPreset(
    "contrast",
    "Maximum contrast",
    "High contrast mode with link highlights and announcements for screen readers.",
    { highContrast: true, highlightLinks: true, focusVisible: true, screenReaderAnnouncements: true }
  ),
];

const renderBadge = (value: string) => (
  <span
    key={value}
    className="inline-flex items-center gap-1 rounded-full bg-blue-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700"
  >
    {value}
  </span>
);

export function AccessibilityDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [announcement, setAnnouncement] = useState("");
  const dashboardRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const announcementTimeoutRef = useRef<number | null>(null);
  const dashboardId = useId();

  const applySettings = useCallback((next: AccessibilitySettings) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    root.classList.remove("a11y-font-normal", "a11y-font-large", "a11y-font-larger", "a11y-font-largest", "a11y-focus-visible");
    root.classList.toggle("a11y-focus-enhanced", next.focusVisible);
    root.classList.add(`a11y-font-${next.fontSize}`);

    body.classList.toggle("a11y-high-contrast", next.highContrast);
    body.classList.toggle("a11y-reduced-motion", next.reducedMotion);
    body.classList.toggle("a11y-text-spacing", next.textSpacing);
    body.classList.toggle("a11y-highlight-links", next.highlightLinks);
  }, []);

  const announceToScreenReader = useCallback((message: string) => {
    if (!message || typeof window === "undefined") return;

    if (announcementTimeoutRef.current) {
      window.clearTimeout(announcementTimeoutRef.current);
    }
    setAnnouncement(message);
    announcementTimeoutRef.current = window.setTimeout(() => {
      setAnnouncement("");
      announcementTimeoutRef.current = null;
    }, 900);
  }, []);

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((previous) => {
        const next = { ...previous, [key]: value };

        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }

        if (key === "screenReaderAnnouncements") {
          const messages = BOOLEAN_SETTING_MESSAGES.screenReaderAnnouncements;
          announceToScreenReader(value ? messages.on : messages.off);
        } else if (key === "fontSize") {
          if (next.screenReaderAnnouncements) {
            announceToScreenReader(`Font size set to ${value}`);
          }
        } else if (next.screenReaderAnnouncements) {
          const booleanKey = key as BooleanSettingKey;
          const messages = BOOLEAN_SETTING_MESSAGES[booleanKey];
          announceToScreenReader(next[booleanKey] ? messages.on : messages.off);
        }

        return next;
      });
    },
    [announceToScreenReader]
  );

  const applyPreset = useCallback(
    (preset: AccessibilitySettings, label: string) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preset));
      }
      setSettings(preset);
      announceToScreenReader(`${label} preset applied`);
    },
    [announceToScreenReader]
  );

useEffect(() => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<AccessibilitySettings>;
      const merged: AccessibilitySettings = { ...defaultSettings, ...parsed };
      applySettings(merged);
      startTransition(() => {
        setSettings(merged);
      });
    } else {
      applySettings(defaultSettings);
    }
  } catch {
    applySettings(defaultSettings);
  }
}, [applySettings]);

  useEffect(() => {
    applySettings(settings);
  }, [settings, applySettings]);

  useEffect(() => {
    if (!isOpen) return;

    lastFocusedElement.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const container = dashboardRef.current;
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key === "Tab" && container) {
        const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
          (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true"
        );

        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    container?.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (container) {
        container.removeEventListener("keydown", handleKeyDown);
      }
      window.cancelAnimationFrame(focusFrame);
      lastFocusedElement.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (announcementTimeoutRef.current) {
      return () => {
        if (announcementTimeoutRef.current) {
          window.clearTimeout(announcementTimeoutRef.current);
        }
      };
    }
    return undefined;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.altKey || event.metaKey) && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setIsOpen((previous) => !previous);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeBadges = useMemo(() => {
    const badges: string[] = [];
    if (settings.fontSize !== "normal") badges.push(`Font · ${settings.fontSize}`);
    if (settings.highContrast) badges.push("High contrast");
    if (settings.reducedMotion) badges.push("Reduced motion");
    if (settings.textSpacing) badges.push("Text spacing");
    if (settings.highlightLinks) badges.push("Link highlight");
    return badges;
  }, [settings]);

  const renderToggle = useCallback(
    (config: ToggleDefinition) => {
      const Icon = config.icon;
      const isActive = settings[config.key];
      const descriptionId = `${dashboardId}-${config.key}-description`;

      return (
        <button
          key={config.key}
          type="button"
          role="switch"
          aria-checked={isActive}
          aria-describedby={descriptionId}
          onClick={() =>
            updateSetting(config.key, (!settings[config.key]) as AccessibilitySettings[typeof config.key])
          }
          className={`w-full rounded-2xl border px-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2 ${
            isActive
              ? "border-blue-500 bg-blue-50/80 shadow-sm shadow-blue-200/40"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-start gap-4">
            <span
              className={`mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                isActive ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="flex-1 space-y-1">
              <span className="text-sm font-semibold text-slate-900">{config.label}</span>
              <p id={descriptionId} className="text-sm text-slate-500">
                {config.description}
              </p>
            </div>
            <span
              className={`mt-1 flex h-6 w-11 shrink-0 items-center rounded-full transition ${
                isActive ? "bg-blue-600/90" : "bg-slate-300/70"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  isActive ? "translate-x-[22px]" : "translate-x-[2px]"
                }`}
              />
            </span>
          </div>
        </button>
      );
    },
    [dashboardId, settings, updateSetting]
  );

  const dialogId = `${dashboardId}-dialog`;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white/95 text-slate-700 shadow-md focus-visible:outline-2 focus-visible:outline-blue-200 focus-visible:outline-offset-2"
        aria-label="Open accessibility settings"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={isOpen}
      >
        <Settings className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Open accessibility settings</span>
      </button>

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${dashboardId}-title`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            id={dialogId}
            ref={dashboardRef}
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 bg-linear-to-br from-white via-white to-blue-50/40 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Settings className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 id={`${dashboardId}-title`} className="text-xl font-semibold text-slate-900">
                  Accessibility settings
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
                aria-label="Close accessibility settings"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="p-6 space-y-8">
              <section className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">Current profile</h3>
                <div className="flex flex-wrap gap-2">
                  {activeBadges.length ? activeBadges.map(renderBadge) : (
                    <span className="text-sm text-slate-500">Default experience active. Personalise it below.</span>
                  )}
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 shadow-inner shadow-blue-100/40">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-600">Preview</p>
                  <p className="mt-2 text-sm text-slate-600">
                    This callout reflects your current settings. Toggle high contrast or link highlights to see instant updates.
                  </p>
                  <a href="#benefits" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 underline underline-offset-4">
                    Example link
                  </a>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-slate-900">Font size</h3>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {FONT_SIZE_OPTIONS.map(({ value, label, helper }) => {
                    const isActive = settings.fontSize === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => updateSetting("fontSize", value)}
                        className={`flex flex-col rounded-2xl border px-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2 ${
                          isActive
                            ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-200/50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span className="text-sm font-semibold text-slate-900">{label}</span>
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{helper}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-slate-900">Quick presets</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.settings, preset.name)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
                    >
                      <span className="text-sm font-semibold text-slate-900">{preset.name}</span>
                      <p className="mt-1 text-sm text-slate-500">{preset.description}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-slate-900">Visual comfort</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {VISUAL_TOGGLES.map((toggle) => renderToggle(toggle))}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <MousePointer2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-slate-900">Interaction</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {INTERACTION_TOGGLES.map((toggle) => renderToggle(toggle))}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-slate-900">Assistive support</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {ASSISTIVE_TOGGLES.map((toggle) => renderToggle(toggle))}
                </div>
              </section>

              <section className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-2">
                    <Keyboard className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    <h3 className="font-semibold text-slate-900">Keyboard shortcuts</h3>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-slate-600">
                    <li>
                      <kbd className="rounded border border-slate-300 bg-white px-2 py-1">Tab</kbd> – Navigate forward
                    </li>
                    <li>
                      <kbd className="rounded border border-slate-300 bg-white px-2 py-1">Shift + Tab</kbd> – Navigate backward
                    </li>
                    <li>
                      <kbd className="rounded border border-slate-300 bg-white px-2 py-1">Enter</kbd> – Activate button or link
                    </li>
                    <li>
                      <kbd className="rounded border border-slate-300 bg-white px-2 py-1">Esc</kbd> – Close this window
                    </li>
                    <li>
                      <kbd className="rounded border border-slate-300 bg-white px-2 py-1">Alt + A</kbd> or{" "}
                      <kbd className="rounded border border-slate-300 bg-white px-2 py-1">⌘ + A</kbd> – Toggle accessibility settings
                    </li>
                  </ul>
                </div>
              </section>

              <section className="space-y-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.localStorage.removeItem(STORAGE_KEY);
                    }
                    setSettings(defaultSettings);
                    announceToScreenReader("Accessibility settings reset to defaults");
                  }}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
                >
                  Reset to defaults
                </button>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

