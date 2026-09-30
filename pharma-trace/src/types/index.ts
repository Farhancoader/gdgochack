export type RiskLevel = 'consistent' | 'needs-review' | 'high-risk';

export interface ScanResult {
  id: string;
  timestamp: Date;
  imageUrl: string;
  riskLevel: RiskLevel;
  confidence: 'high' | 'medium' | 'low';
  extractedData: ExtractedData;
  checks: CheckResult[];
  anomalies: Anomaly[];
  recommendations: string[];
}

export interface ExtractedData {
  medicineName?: string;
  strength?: string;
  manufacturer?: string;
  expiryDate?: string;
  batchNumber?: string;
  dosageForm?: string;
}

export interface CheckResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'unavailable';
  message: string;
  details?: string;
}

export interface Anomaly {
  id: string;
  type: 'visual' | 'text' | 'pill' | 'batch' | 'manufacturer' | 'expiry';
  severity: 'low' | 'medium' | 'high';
  description: string;
  location?: { x: number; y: number; width: number; height: number };
}

export interface ReferenceTemplate {
  id: string;
  productName: string;
  manufacturer: string;
  strength: string;
  imageUrl: string;
  regions: string[];
}

export interface ManufacturerProduct {
  manufacturer: string;
  products: Array<{
    name: string;
    strengths: string[];
    dosageForms: string[];
  }>;
}

export interface PillImprint {
  imprint: string;
  shape: 'round' | 'oval' | 'capsule' | 'square' | 'diamond' | 'other';
  color: string;
  productName: string;
  strength: string;
}

export interface ScanHistoryItem {
  id: string;
  date: Date;
  productName: string;
  riskLevel: RiskLevel;
  thumbnail: string;
}

export type Screen = 'scan' | 'results' | 'history' | 'settings';

export interface AppState {
  currentScreen: Screen;
  scanHistory: ScanHistoryItem[];
  currentScan: ScanResult | null;
  isScanning: boolean;
  cameraPermission: 'granted' | 'denied' | 'prompt';
  locationPermission: 'granted' | 'denied' | 'prompt';
}