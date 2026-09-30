import type { ExtractedData } from '../types';
import { mockReferenceTemplates } from '../data/mockData';

export interface OCRResult {
  data: ExtractedData;
  confidence: number;
  rawText: string;
}

const mockOCRResults: Record<string, OCRResult> = {
  'lipitor-10mg-pfizer': {
    data: {
      medicineName: 'Lipitor',
      strength: '10mg',
      manufacturer: 'Pfizer Inc.',
      expiryDate: '12/2025',
      batchNumber: 'LIP240115',
      dosageForm: 'Tablet',
    },
    confidence: 0.94,
    rawText: 'LIPITOR 10mg\nPfizer Inc.\nEXP 12/2025\nLOT LIP240115\nTABLET',
  },
  'viagra-50mg-pfizer': {
    data: {
      medicineName: 'Viagra',
      strength: '50mg',
      manufacturer: 'Pfizer Inc.',
      expiryDate: '06/2025',
      batchNumber: 'VGR240220',
      dosageForm: 'Tablet',
    },
    confidence: 0.91,
    rawText: 'VIAGRA 50mg\nPfizer Inc.\nEXP 06/2025\nLOT VGR240220\nTABLET',
  },
  'tylenol-500mg-jj': {
    data: {
      medicineName: 'Tylenol',
      strength: '500mg',
      manufacturer: 'Johnson & Johnson',
      expiryDate: '03/2026',
      batchNumber: 'TYL240310',
      dosageForm: 'Caplet',
    },
    confidence: 0.96,
    rawText: 'TYLENOL 500mg\nJohnson & Johnson\nEXP 03/2026\nLOT TYL240310\nCAPLET',
  },
  'crestor-10mg-az': {
    data: {
      medicineName: 'Crestor',
      strength: '10mg',
      manufacturer: 'AstraZeneca',
      expiryDate: '09/2025',
      batchNumber: 'CRS240105',
      dosageForm: 'Tablet',
    },
    confidence: 0.93,
    rawText: 'CRESTOR 10mg\nAstraZeneca\nEXP 09/2025\nLOT CRS240105\nTABLET',
  },
  'suspicious-product': {
    data: {
      medicineName: 'Lipitor',
      strength: '50mg', // Invalid strength for Lipitor
      manufacturer: 'Pfizer Inc.',
      expiryDate: '12/2025',
      batchNumber: 'LIP240115',
      dosageForm: 'Tablet',
    },
    confidence: 0.87,
    rawText: 'LIPITOR 50mg\nPfizer Inc.\nEXP 12/2025\nLOT LIP240115\nTABLET',
  },
  'fake-viagra': {
    data: {
      medicineName: 'Viagra',
      strength: '100mg',
      manufacturer: 'Unknown Labs', // Wrong manufacturer
      expiryDate: '01/2024', // Expired
      batchNumber: 'VGR999999', // Suspicious batch
      dosageForm: 'Tablet',
    },
    confidence: 0.72,
    rawText: 'VIAGRA 100mg\nUnknown Labs\nEXP 01/2024\nLOT VGR999999\nTABLET',
  },
  'generic-scan': {
    data: {
      medicineName: 'Amoxicillin',
      strength: '500mg',
      manufacturer: 'Generic Pharma',
      expiryDate: '08/2025',
      batchNumber: 'AMX240501',
      dosageForm: 'Capsule',
    },
    confidence: 0.82,
    rawText: 'AMOXICILLIN 500mg\nGeneric Pharma\nEXP 08/2025\nLOT AMX240501\nCAPSULE',
  },
};

export async function simulateOCR(imageUrl: string): Promise<OCRResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  // Try to match based on image URL or return random
  for (const [key, result] of Object.entries(mockOCRResults)) {
    if (imageUrl.includes(key) || imageUrl.includes(result.data.medicineName?.toLowerCase() || '')) {
      return result;
    }
  }

  // Return a random result for demo
  const keys = Object.keys(mockOCRResults);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return mockOCRResults[randomKey];
}

export function findMatchingTemplate(extractedData: ExtractedData) {
  return mockReferenceTemplates.find(
    t =>
      t.productName.toLowerCase() === extractedData.medicineName?.toLowerCase() &&
      t.manufacturer.toLowerCase() === extractedData.manufacturer?.toLowerCase() &&
      t.strength === extractedData.strength
  );
}

export function simulateVisualComparison(
  _imageUrl: string,
  _templateUrl: string
): { similarity: number; anomalies: Array<{ type: string; severity: 'low' | 'medium' | 'high'; description: string }> } {
  // Simulate visual comparison
  const similarity = 0.75 + Math.random() * 0.2; // 75-95%
  
  const possibleAnomalies = [
    { type: 'logo', severity: 'medium' as const, description: 'Logo appears slightly blurred compared to reference' },
    { type: 'text', severity: 'low' as const, description: 'Text alignment slightly shifted' },
    { type: 'color', severity: 'low' as const, description: 'Color saturation differs from reference' },
    { type: 'border', severity: 'high' as const, description: 'Package border irregularities detected' },
    { type: 'print', severity: 'medium' as const, description: 'Print quality inconsistent with genuine template' },
  ];

  const numAnomalies = Math.floor(Math.random() * 3);
  const anomalies: Array<{ type: string; severity: 'low' | 'medium' | 'high'; description: string }> = [];
  for (let i = 0; i < numAnomalies; i++) {
    const anomaly = possibleAnomalies[Math.floor(Math.random() * possibleAnomalies.length)];
    if (!anomalies.find(a => a.type === anomaly.type)) {
      anomalies.push(anomaly);
    }
  }

  return { similarity, anomalies };
}