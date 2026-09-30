import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ChevronLeft, 
  Shield,
  Eye,
  Share2,
  Download,
  Info,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Icon } from '../components/Icons';
import type { ScanResult, CheckResult, RiskLevel } from '../types';
import { 
  riskLevelLabels, 
  riskLevelDescriptions, 
  formatRelativeTime 
} from '../data/mockData';
import { getRiskLevelColor, getRiskLevelIcon } from '../utils/helpers';

interface ResultsScreenProps {
  scanResult: ScanResult;
  onBack: () => void;
  onRescan: () => void;
  onShare: () => void;
}

const statusIcons = {
  pass: CheckCircle,
  fail: XCircle,
  warning: AlertTriangle,
  unavailable: Info,
};

const statusColors = {
  pass: 'text-primary-600 bg-primary-50',
  fail: 'text-danger-600 bg-danger-50',
  warning: 'text-warning-600 bg-warning-50',
  unavailable: 'text-gray-500 bg-gray-100',
};

const severityColors = {
  low: 'text-secondary-600 bg-secondary-50 border-secondary-200',
  medium: 'text-warning-600 bg-warning-50 border-warning-200',
  high: 'text-danger-600 bg-danger-50 border-danger-200',
};

export function ResultsScreen({ scanResult, onBack, onRescan, onShare }: ResultsScreenProps) {
  const [expandedChecks, setExpandedChecks] = useState<Set<string>>(new Set());
  const [showImageModal, setShowImageModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const riskColorClasses = getRiskLevelColor(scanResult.riskLevel);
  const riskIconName = getRiskLevelIcon(scanResult.riskLevel);

  const toggleCheck = (checkId: string) => {
    setExpandedChecks(prev => {
      const next = new Set(prev);
      if (next.has(checkId)) next.delete(checkId);
      else next.add(checkId);
      return next;
    });
  };

  const formatCheckMessage = (check: CheckResult) => {
    const IconComponent = statusIcons[check.status];
    return (
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${statusColors[check.status]}`}>
          <IconComponent size={18} className={statusColors[check.status].replace('bg-', '').replace('text-', 'text-')} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900">{check.name}</h4>
          <p className="text-sm text-gray-600 mt-0.5">{check.message}</p>
          {expandedChecks.has(check.id) && check.details && (
            <p className="text-sm text-gray-500 mt-1">{check.details}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleCheck(check.id)}
          aria-label={expandedChecks.has(check.id) ? 'Collapse' : 'Expand'}
          aria-expanded={expandedChecks.has(check.id)}
        >
          <Icon 
            name={expandedChecks.has(check.id) ? 'chevronRight' : 'chevronLeft'} 
            size={18} 
            className="text-gray-400" 
          />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} aria-label="Back to scan">
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Scan Results</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onShare} aria-label="Share results">
              <Share2 size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        <div className="animate-fade-in space-y-6">
          <Card variant="elevated" className={`border-2 ${riskColorClasses.replace('text-', 'border-').replace('bg-', '')}`}>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${riskColorClasses.replace('text-', 'bg-').replace('border-', '')}`}>
                  <Icon name={riskIconName} size={28} className={riskColorClasses.replace('bg-', 'text-').replace('border-', '')} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={scanResult.riskLevel === 'consistent' ? 'success' : scanResult.riskLevel === 'needs-review' ? 'warning' : 'danger'} size="lg">
                      {riskLevelLabels[scanResult.riskLevel as RiskLevel]}
                    </Badge>
                    <Badge variant="outline" size="sm">{scanResult.confidence} Confidence</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{riskLevelDescriptions[scanResult.riskLevel as RiskLevel]}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-gray-50">
                    <p className="text-2xl font-bold text-gray-900">{scanResult.checks.filter(c => c.status === 'pass').length}</p>
                    <p className="text-xs text-gray-500">Passed</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50">
                    <p className="text-2xl font-bold text-gray-900">{scanResult.checks.filter(c => c.status === 'fail').length}</p>
                    <p className="text-xs text-gray-500">Failed</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50">
                    <p className="text-2xl font-bold text-gray-900">{scanResult.checks.filter(c => c.status === 'warning' || c.status === 'unavailable').length}</p>
                    <p className="text-xs text-gray-500">Needs Review</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="outlined" padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Extracted Information</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowImageModal(true)} aria-label="View captured image">
                <Eye size={18} />
              </Button>
            </div>
            <div className="space-y-3">
              {scanResult.extractedData.medicineName && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">Medicine</span>
                  <span className="font-medium text-gray-900">{scanResult.extractedData.medicineName} {scanResult.extractedData.strength || ''}</span>
                </div>
              )}
              {scanResult.extractedData.manufacturer && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">Manufacturer</span>
                  <span className="font-medium text-gray-900">{scanResult.extractedData.manufacturer}</span>
                </div>
              )}
              {scanResult.extractedData.expiryDate && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">Expiry Date</span>
                  <span className="font-medium text-gray-900">{scanResult.extractedData.expiryDate}</span>
                </div>
              )}
              {scanResult.extractedData.batchNumber && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">Batch Number</span>
                  <span className="font-medium text-gray-900 font-mono text-sm">{scanResult.extractedData.batchNumber}</span>
                </div>
              )}
              {scanResult.extractedData.dosageForm && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">Dosage Form</span>
                  <span className="font-medium text-gray-900">{scanResult.extractedData.dosageForm}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500">Scanned</span>
                <span className="font-medium text-gray-900">{formatRelativeTime(scanResult.timestamp)}</span>
              </div>
            </div>
          </Card>

          {scanResult.checks.length > 0 && (
            <Card variant="outlined" padding="md">
              <h3 className="font-semibold text-gray-900 mb-4">Verification Checks</h3>
              <div className="space-y-3">
                {scanResult.checks.map(check => (
                  <div key={check.id} className={`p-3 rounded-xl ${statusColors[check.status]}`}>
                    {formatCheckMessage(check)}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {scanResult.anomalies.length > 0 && (
            <Card variant="outlined" padding="md" className="border-danger-200 bg-danger-50">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-danger-600" />
                <h3 className="font-semibold text-gray-900">Anomalies Detected</h3>
              </div>
              <div className="space-y-3">
                {scanResult.anomalies.map(anomaly => (
                  <div key={anomaly.id} className={`p-3 rounded-xl border ${severityColors[anomaly.severity]}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${severityColors[anomaly.severity].replace('text-', 'bg-').replace('border-', '')}`}>
                        <AlertTriangle size={12} className={severityColors[anomaly.severity].replace('bg-', 'text-').replace('border-', '')} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">{anomaly.type} anomaly</p>
                        <p className="text-sm text-gray-600 mt-0.5">{anomaly.description}</p>
                      </div>
                      <Badge variant={anomaly.severity === 'high' ? 'danger' : anomaly.severity === 'medium' ? 'warning' : 'info'} size="sm">
                        {anomaly.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-primary-600" />
              <h3 className="font-semibold text-gray-900">Recommended Actions</h3>
            </div>
            <div className="space-y-2">
              {scanResult.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={12} className="text-primary-600" />
                  </div>
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="outlined" padding="md" className="bg-warning-50 border-warning-200">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-warning-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-medium text-warning-800 mb-1">Important Disclaimer</p>
                <p>This analysis is a screening tool only. It does not prove chemical contents or replace laboratory testing. Consult a pharmacist or healthcare professional for medical decisions.</p>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="primary" fullWidth size="lg" onClick={onRescan} leftIcon={<RefreshCw size={20} />}>
              Scan Again
            </Button>
            <Button variant="secondary" fullWidth size="lg" onClick={onShare} leftIcon={<Share2 size={20} />}>
              Share Report
            </Button>
          </div>
        </div>
      </main>

      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Captured Image"
        size="lg"
      >
        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
          <img 
            src={scanResult.imageUrl} 
            alt="Scanned medicine package" 
            className="w-full h-full object-cover"
          />
        </div>
      </Modal>

      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Results"
        size="md"
      >
        <div className="space-y-3">
          <p className="text-gray-600">Share your scan results with a pharmacist, healthcare provider, or regulator.</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" fullWidth leftIcon={<Download size={18} />} onClick={() => {}}>
              Save as Image
            </Button>
            <Button variant="secondary" fullWidth leftIcon={<ExternalLink size={18} />} onClick={() => {}}>
              Copy Text Report
            </Button>
            <Button variant="primary" fullWidth leftIcon={<Share2 size={18} />} onClick={() => {}}>
              Share via System
            </Button>
            <Button variant="ghost" fullWidth onClick={() => setShowShareModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}