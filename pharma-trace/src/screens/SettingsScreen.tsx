import { useState, useEffect } from 'react';
import {
  Globe,
  Accessibility,
  Database,
  Download,
  Trash2,
  Shield,
  Info,
  Moon,
  Sun,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Icon } from '../components/Icons';
import { useLocalStorage } from '../hooks/useScan';
import { formatDate } from '../utils/helpers';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

export function SettingsScreen() {
  const [language, setLanguage] = useLocalStorage('pharmatrace-language', 'en');
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>('pharmatrace-theme', 'system');
  const [reducedMotion, setReducedMotion] = useLocalStorage('pharmatrace-reduced-motion', false);
  const [highContrast, setHighContrast] = useLocalStorage('pharmatrace-high-contrast', false);
  const [largeText, setLargeText] = useLocalStorage('pharmatrace-large-text', false);
  const [hapticFeedback, setHapticFeedback] = useLocalStorage('pharmatrace-haptic-feedback', true);
  const [scanHistory, setScanHistory] = useLocalStorage('pharmatrace-scan-history', [] as any[]);
  const [autoSave, setAutoSave] = useLocalStorage('pharmatrace-auto-save', true);
  const [analytics, setAnalytics] = useLocalStorage('pharmatrace-analytics', false);
  const [notifications, setNotifications] = useLocalStorage('pharmatrace-notifications', true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
    document.documentElement.style.setProperty('--motion-reduce', reducedMotion ? '1' : '0');
    document.documentElement.style.setProperty('--contrast-high', highContrast ? '1' : '0');
    document.documentElement.style.setProperty('--text-large', largeText ? '1' : '0');
  }, [theme, reducedMotion, highContrast, largeText]);

  const clearHistory = () => {
    setScanHistory([]);
    setShowClearConfirm(false);
  };

  const exportData = () => {
    const data = {
      scanHistory,
      settings: {
        language,
        theme,
        reducedMotion,
        highContrast,
        largeText,
        hapticFeedback,
        autoSave,
        analytics,
        notifications,
      },
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmatrace-export-${formatDate(new Date()).replace(/[,\s]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const resetSettings = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        <div className="space-y-6">
          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                <Globe size={20} className="text-primary-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Language & Region</h2>
            </div>
            <div className="space-y-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Select language"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center">
                <Accessibility size={20} className="text-secondary-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Accessibility</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Reduce Motion</p>
                  <p className="text-sm text-gray-500">Minimize animations and transitions</p>
                </div>
                <Button
                  variant={reducedMotion ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className="w-20"
                >
                  {reducedMotion ? 'On' : 'Off'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">High Contrast</p>
                  <p className="text-sm text-gray-500">Increase color contrast for readability</p>
                </div>
                <Button
                  variant={highContrast ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setHighContrast(!highContrast)}
                  className="w-20"
                >
                  {highContrast ? 'On' : 'Off'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Large Text</p>
                  <p className="text-sm text-gray-500">Increase text size throughout the app</p>
                </div>
                <Button
                  variant={largeText ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setLargeText(!largeText)}
                  className="w-20"
                >
                  {largeText ? 'On' : 'Off'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Haptic Feedback</p>
                  <p className="text-sm text-gray-500">Vibration feedback on interactions</p>
                </div>
                <Button
                  variant={hapticFeedback ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setHapticFeedback(!hapticFeedback)}
                  className="w-20"
                >
                  {hapticFeedback ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </Card>

          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-warning-100 flex items-center justify-center">
                <Sun size={20} className="text-warning-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Appearance</h2>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'light' as const, label: 'Light', icon: Sun },
                  { value: 'dark' as const, label: 'Dark', icon: Moon },
                  { value: 'system' as const, label: 'System', icon: RefreshCw },
                ].map(({ value, label, icon: IconComp }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`relative rounded-xl border-2 p-4 text-center transition-all ${
                      theme === value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    aria-pressed={theme === value}
                  >
                    <IconComp size={24} className={`mx-auto mb-2 ${theme === value ? 'text-primary-600' : 'text-gray-400'}`} />
                    <p className={`font-medium ${theme === value ? 'text-primary-700' : 'text-gray-700'}`}>{label}</p>
                    {theme === value && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <Icon name="check" size={10} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center">
                <Database size={20} className="text-secondary-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Data & Privacy</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto-save Scans</p>
                  <p className="text-sm text-gray-500">Automatically save scan results to history</p>
                </div>
                <Button
                  variant={autoSave ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setAutoSave(!autoSave)}
                  className="w-20"
                >
                  {autoSave ? 'On' : 'Off'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Usage Analytics</p>
                  <p className="text-sm text-gray-500">Help improve the app with anonymous usage data</p>
                </div>
                <Button
                  variant={analytics ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setAnalytics(!analytics)}
                  className="w-20"
                >
                  {analytics ? 'On' : 'Off'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notifications</p>
                  <p className="text-sm text-gray-500">Receive scan reminders and updates</p>
                </div>
                <Button
                  variant={notifications ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setNotifications(!notifications)}
                  className="w-20"
                >
                  {notifications ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </Card>

          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Download size={20} className="text-purple-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Data Management</h2>
            </div>
            <div className="space-y-3">
              <Button
                variant="secondary"
                fullWidth
                leftIcon={<Download size={18} />}
                onClick={() => setShowExportModal(true)}
              >
                Export All Data
              </Button>
              <div className="pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  fullWidth
                  leftIcon={<Trash2 size={18} className="text-danger-600" />}
                  onClick={() => setShowClearConfirm(true)}
                  className="text-danger-600 hover:bg-danger-50 justify-start"
                >
                  Clear Scan History
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {scanHistory.length} scan{scanHistory.length !== 1 ? 's' : ''} in history
                </p>
              </div>
            </div>
          </Card>

          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Info size={20} className="text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900">About & Legal</h2>
            </div>
            <div className="space-y-3">
              <Button
                variant="ghost"
                fullWidth
                className="justify-start"
                leftIcon={<Info size={18} />}
                onClick={() => setShowAboutModal(true)}
              >
                About PharmaTrace
              </Button>
              <Button
                variant="ghost"
                fullWidth
                className="justify-start"
                leftIcon={<Shield size={18} />}
                onClick={() => setShowPrivacyModal(true)}
              >
                Privacy Policy
              </Button>
              <Button
                variant="ghost"
                fullWidth
                className="justify-start"
                leftIcon={<FileText size={18} />}
                onClick={() => setShowTermsModal(true)}
              >
                Terms of Service
              </Button>
              <Button
                variant="ghost"
                fullWidth
                className="justify-start"
                leftIcon={<ExternalLink size={18} />}
                onClick={() => window.open('https://github.com/pharmatrace', '_blank')}
              >
                Open Source Licenses
              </Button>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Version</span>
                <span className="font-mono">1.0.0</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                <span>Build</span>
                <span className="font-mono">2024.01.15</span>
              </div>
            </div>
          </Card>

          <Card variant="outlined" padding="md" className="border-danger-200 bg-danger-50">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-danger-600" />
              <div className="text-sm text-gray-700">
                <p className="font-medium text-danger-800">Reset All Settings</p>
                <p>This will clear all preferences and scan history. This action cannot be undone.</p>
              </div>
            </div>
            <Button
              variant="danger"
              fullWidth
              className="mt-4"
              onClick={resetSettings}
            >
              Reset to Defaults
            </Button>
          </Card>
        </div>
      </main>

      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear Scan History"
        description="This action cannot be undone"
        size="sm"
      >
        <p className="text-gray-600 mb-6">Are you sure you want to delete all {scanHistory.length} scan records from your history?</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowClearConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={clearHistory}>
            Clear All
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Data"
        description="Your data will be downloaded as a JSON file"
        size="sm"
      >
        <p className="text-gray-600 mb-6">This will export your scan history and settings as a JSON file that you can save or transfer to another device.</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowExportModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={exportData} leftIcon={<Download size={18} />}>
            Export
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title="About PharmaTrace"
        size="md"
      >
        <div className="space-y-4 text-gray-600">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">PharmaTrace</h3>
            <p className="text-sm text-gray-500 mt-1">Version 1.0.0</p>
          </div>
          <p>PharmaTrace is a medicine authenticity screening tool that helps identify potentially counterfeit or problematic medication packages through visual analysis and data validation.</p>
          <p className="font-medium">Key Features:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Visual package comparison against reference templates</li>
            <li>Manufacturer-product validation</li>
            <li>Expiry date verification</li>
            <li>Batch number format checking</li>
            <li>OCR text extraction and validation</li>
          </ul>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
        size="lg"
      >
        <div className="space-y-4 text-sm text-gray-600 max-h-[60vh] overflow-y-auto">
          <p className="font-medium text-gray-900">Last updated: January 15, 2024</p>
          <div className="prose prose-sm max-w-none space-y-4">
            <section>
              <h4 className="font-semibold text-gray-900">Data We Collect</h4>
              <p>PharmaTrace processes images locally on your device. We do not upload your medication photos to any server. Scan results are stored locally in your browser's storage.</p>
            </section>
            <section>
              <h4 className="font-semibold text-gray-900">Local Storage</h4>
              <p>Your scan history and preferences are stored using browser localStorage. This data never leaves your device unless you explicitly export it.</p>
            </section>
            <section>
              <h4 className="font-semibold text-gray-900">Camera Access</h4>
              <p>Camera access is requested only when you choose to take a photo. The video stream is processed locally and never transmitted.</p>
            </section>
            <section>
              <h4 className="font-semibold text-gray-900">No Tracking</h4>
              <p>When analytics is disabled (default), no usage data is collected. If enabled, only anonymous, aggregated statistics are gathered.</p>
            </section>
            <section>
              <h4 className="font-semibold text-gray-900">Your Rights</h4>
              <p>You can delete all your data at any time using the "Clear Scan History" or "Reset to Defaults" options in Settings.</p>
            </section>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms of Service"
        size="lg"
      >
        <div className="space-y-4 text-sm text-gray-600 max-h-[60vh] overflow-y-auto">
          <p className="font-medium text-gray-900">Last updated: January 15, 2024</p>
          <div className="prose prose-sm max-w-none space-y-4">
            <section>
              <h4 className="font-semibold text-gray-900">Screening Tool Only</h4>
              <p>PharmaTrace is a screening tool, not a medical device. It does not prove chemical contents or replace laboratory testing.</p>
            </section>
            <section>
              <h4 className="font-semibold text-gray-900">No Medical Advice</h4>
              <p>Results should not be used for medical decisions. Consult a pharmacist or healthcare professional for medical advice.</p>
            </section>
            <section>
              <h4 className="font-semibold text-gray-900">Accuracy Limitations</h4>
              <p>Results depend on image quality, lighting, and database completeness. False positives and negatives can occur.</p>
            </section>
            <section>
              <h4 className="font-semibold text-gray-900">No Liability</h4>
              <p>The developers are not liable for any decisions made based on PharmaTrace results. Use at your own risk.</p>
            </section>
            <section>
              <h4 className="font-semibold text-gray-900">Open Source</h4>
              <p>PharmaTrace is open source software. View the source code and contribute on GitHub.</p>
            </section>
          </div>
        </div>
      </Modal>
    </div>
  );
}