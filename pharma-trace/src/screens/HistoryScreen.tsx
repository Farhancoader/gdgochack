import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Calendar,
  Shield
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Icon } from '../components/Icons';
import type { ScanHistoryItem, RiskLevel } from '../types';
import { riskLevelLabels, formatDate, formatRelativeTime } from '../data/mockData';
import { getRiskLevelColor, getRiskLevelIcon } from '../utils/helpers';

interface HistoryScreenProps {
  scanHistory: ScanHistoryItem[];
  onClearHistory: () => void;
  onViewDetails: (item: ScanHistoryItem) => void;
}

export function HistoryScreen({ scanHistory, onClearHistory, onViewDetails }: HistoryScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null);

  const filteredHistory = scanHistory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRisk === 'all' || item.riskLevel === filterRisk;
    return matchesSearch && matchesFilter;
  });

  const riskLevelColors = {
    consistent: 'bg-primary-50 text-primary-700 border-primary-200',
    'needs-review': 'bg-warning-50 text-warning-700 border-warning-200',
    'high-risk': 'bg-danger-50 text-danger-700 border-danger-200',
  };

  if (scanHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-inset-bottom">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-md mx-auto px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Scan History</h1>
          </div>
        </header>
        <main className="max-w-md mx-auto px-4 py-12 flex flex-col items-center justify-center flex-1">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Scans Yet</h2>
            <p className="text-gray-500 mb-6 max-w-xs">Your scan history will appear here. Start by scanning a medicine package.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Scan History</h1>
          {scanHistory.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(true)} aria-label="Clear history">
              <Trash2 size={20} className="text-danger-600" />
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <Input
                placeholder="Search scans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search scan history"
              />
            </div>
            <Button variant="secondary" size="md" onClick={() => {}} aria-label="Filter by risk level" className="whitespace-nowrap">
              <Filter size={18} />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>

          {filterRisk !== 'all' && (
            <div className="flex items-center gap-2">
              <Badge variant={filterRisk === 'consistent' ? 'success' : filterRisk === 'needs-review' ? 'warning' : 'danger'} size="sm">
                Filtered: {riskLevelLabels[filterRisk]}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => setFilterRisk('all')} className="text-xs">
                Clear
              </Button>
            </div>
          )}

          <div className="space-y-3" role="list" aria-label="Scan history">
            {filteredHistory.map((item) => (
              <Card key={item.id} variant="outlined" padding="none" className="overflow-hidden" onClick={() => onViewDetails(item)}>
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden relative">
                      <img 
                        src={item.thumbnail} 
                        alt="" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Icon 
                          name={getRiskLevelIcon(item.riskLevel)} 
                          size={20} 
                          className="text-white" 
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{item.productName}</h3>
                        <Badge 
                          variant={item.riskLevel === 'consistent' ? 'success' : item.riskLevel === 'needs-review' ? 'warning' : 'danger'} 
                          size="sm"
                          className={riskLevelColors[item.riskLevel]}
                        >
                          {riskLevelLabels[item.riskLevel]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} aria-hidden="true" />
                          {formatRelativeTime(item.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name={getRiskLevelIcon(item.riskLevel)} size={12} className={getRiskLevelColor(item.riskLevel).replace('bg-', 'text-').replace('border-', '')} />
                          {item.riskLevel === 'consistent' ? 'Consistent' : item.riskLevel === 'needs-review' ? 'Needs Review' : 'High Risk'}
                        </span>
                      </div>
                    </div>
                    <Icon name="chevronRight" size={20} className="text-gray-300 flex-shrink-0" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredHistory.length === 0 && searchQuery && (
            <div className="text-center py-12 text-gray-500">
              <Search size={32} className="mx-auto text-gray-300 mb-2" aria-hidden="true" />
              <p>No scans found for "{searchQuery}"</p>
            </div>
          )}

          {filteredHistory.length === 0 && !searchQuery && filterRisk !== 'all' && (
            <div className="text-center py-12 text-gray-500">
              <Icon name={getRiskLevelIcon(filterRisk)} size={32} className="mx-auto text-gray-300 mb-2" />
              <p>No {riskLevelLabels[filterRisk].toLowerCase()} scans found</p>
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear History"
        description="This action cannot be undone"
        size="sm"
      >
        <p className="text-gray-600 mb-6">Are you sure you want to delete all {scanHistory.length} scan records from your history?</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowClearConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => { onClearHistory(); setShowClearConfirm(false); }}>
            Clear All
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.productName}
        size="md"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                <img src={selectedItem.thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{selectedItem.productName}</p>
                <p className="text-sm text-gray-500">{formatDate(selectedItem.date)}</p>
              </div>
              <Badge variant={selectedItem.riskLevel === 'consistent' ? 'success' : selectedItem.riskLevel === 'needs-review' ? 'warning' : 'danger'} size="md">
                {riskLevelLabels[selectedItem.riskLevel]}
              </Badge>
            </div>
            <div className="flex gap-3">
              <Button variant="primary" fullWidth onClick={() => { onViewDetails(selectedItem); setSelectedItem(null); }}>
                View Details
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}