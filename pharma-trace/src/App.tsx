import { useState, useCallback, useEffect } from 'react';
import { History, Settings, ChevronLeft, Camera, ScanLine } from 'lucide-react';
import { ScanScreen } from './screens/ScanScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { useScan, useLocalStorage } from './hooks/useScan';
import { Icon } from './components/Icons';
import type { ScanResult, Screen, ScanHistoryItem } from './types';

function TabBar({ currentScreen, onNavigate }: { currentScreen: Screen; onNavigate: (screen: Screen) => void }) {
  const tabs = [
    { id: 'scan' as Screen, icon: Camera, label: 'Scan' },
    { id: 'history' as Screen, icon: History, label: 'History' },
    { id: 'settings' as Screen, icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-inset-bottom z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                currentScreen === tab.id
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-current={currentScreen === tab.id ? 'page' : undefined}
              aria-label={tab.label}
            >
              <tab.icon size={24} aria-hidden="true" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Header({ 
  title, 
  onBack, 
  showBack = false, 
  rightAction,
  rightActionLabel 
}: { 
  title: string; 
  onBack?: () => void; 
  showBack?: boolean; 
  rightAction?: () => void;
  rightActionLabel?: string;
}) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {showBack && onBack ? (
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <h1 className="text-lg font-semibold text-gray-900 text-center flex-1 px-4">{title}</h1>
        {rightAction ? (
          <button
            onClick={rightAction}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label={rightActionLabel}
          >
            <Icon name="moreHorizontal" size={24} />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </header>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('scan');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [previousScreen, setPreviousScreen] = useState<Screen>('scan');
  const [scanHistory, setScanHistory] = useLocalStorage<ScanHistoryItem[]>('pharmatrace-scan-history', []);
  
  const { performScan, clearCurrentScan, scanHistory: hookHistory } = useScan();

  useEffect(() => {
    if (hookHistory.length > 0) {
      setScanHistory(hookHistory);
    }
  }, [hookHistory, setScanHistory]);

  const handleScanComplete = useCallback((imageUrl: string) => {
    performScan(imageUrl).then(result => {
      setScanResult(result);
      setPreviousScreen('scan');
      setCurrentScreen('results');
    }).catch(() => {
      // Error handled by hook
    });
  }, [performScan]);

  const handleBack = useCallback(() => {
    if (currentScreen === 'results') {
      clearCurrentScan();
      setScanResult(null);
      setCurrentScreen(previousScreen);
    } else if (currentScreen !== 'scan') {
      setCurrentScreen('scan');
    }
  }, [currentScreen, previousScreen, clearCurrentScan]);

  const handleRescan = useCallback(() => {
    clearCurrentScan();
    setScanResult(null);
    setCurrentScreen('scan');
  }, [clearCurrentScan]);

  const handleViewHistoryDetails = useCallback((item: ScanHistoryItem) => {
    // For now, just show an alert - in a real app this would navigate to a detailed view
    alert(`Viewing details for ${item.productName} - ${item.riskLevel}`);
  }, []);

  const handleClearHistory = useCallback(() => {
    setScanHistory([]);
  }, [setScanHistory]);

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'scan':
        return (
          <ScanScreen onScanComplete={handleScanComplete} />
        );
      case 'results':
        if (!scanResult) {
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center p-8">
                <ScanLine size={48} className="text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">No Results</h2>
                <p className="text-gray-500 mt-2">Scan a package to see results</p>
                <button 
                  onClick={() => setCurrentScreen('scan')}
                  className="mt-4 text-primary-600 font-medium hover:underline"
                >
                  Go to Scan
                </button>
              </div>
            </div>
          );
        }
        return (
          <ResultsScreen
            scanResult={scanResult}
            onBack={handleBack}
            onRescan={handleRescan}
            onShare={() => {
              if (navigator.share) {
                navigator.share({
                  title: `PharmaTrace Scan: ${scanResult.extractedData.medicineName || 'Medicine'}`,
                  text: `Risk Level: ${scanResult.riskLevel}. Confidence: ${scanResult.confidence}.`,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(
                  `PharmaTrace Scan Results\n${scanResult.extractedData.medicineName || 'Unknown'} ${scanResult.extractedData.strength || ''}\nRisk: ${scanResult.riskLevel}\nConfidence: ${scanResult.confidence}\nScanned: ${scanResult.timestamp.toLocaleString()}`
                ).then(() => alert('Results copied to clipboard'));
              }
            }}
          />
        );
      case 'history':
        return (
          <HistoryScreen
            scanHistory={scanHistory}
            onClearHistory={handleClearHistory}
            onViewDetails={handleViewHistoryDetails}
          />
        );
      case 'settings':
        return (
          <SettingsScreen />
        );
    }
  };

  const showHeader = currentScreen !== 'scan';
  const headerTitle = currentScreen === 'results' ? 'Scan Results' : currentScreen === 'history' ? 'Scan History' : 'Settings';

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <Header
          title={headerTitle}
          onBack={handleBack}
          showBack={showHeader}
        />
      )}
      
      <main className="pb-20">
        {renderCurrentScreen()}
      </main>

      <TabBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}