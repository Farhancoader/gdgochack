import { useState, useCallback, useEffect } from 'react';
import type { ScanResult, ScanHistoryItem, CheckResult, Anomaly, RiskLevel } from '../types';
import { mockScanHistory } from '../data/mockData';
import { simulateOCR, findMatchingTemplate, simulateVisualComparison } from '../utils/ocr';
import { 
  validateManufacturerProduct, 
  validateExpiryDate, 
  validateBatchNumber, 
  calculateConfidence, 
  determineRiskLevel,
  generateId 
} from '../utils/helpers';

export function useScan() {
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(mockScanHistory);
  const [error, setError] = useState<string | null>(null);

  const performScan = useCallback(async (imageUrl: string) => {
    setIsScanning(true);
    setError(null);

    try {
      // Simulate OCR
      const ocrResult = await simulateOCR(imageUrl);
      const extractedData = ocrResult.data;

      // Find matching template
      const template = findMatchingTemplate(extractedData);

      // Perform validation checks
      const checks: CheckResult[] = [];
      const anomalies: Anomaly[] = [];

      // 1. Visual comparison check
      if (template) {
        const visualResult = simulateVisualComparison(imageUrl, template.imageUrl);
        if (visualResult.similarity >= 0.85) {
          checks.push({
            id: 'visual-match',
            name: 'Visual Template Match',
            status: 'pass',
            message: `Package matches reference template (${Math.round(visualResult.similarity * 100)}% similarity).`,
            details: 'Logo, text layout, colors, and borders align with genuine packaging.',
          });
        } else if (visualResult.similarity >= 0.7) {
          checks.push({
            id: 'visual-match',
            name: 'Visual Template Match',
            status: 'warning',
            message: `Package partially matches reference template (${Math.round(visualResult.similarity * 100)}% similarity).`,
            details: 'Some visual elements differ from the genuine packaging.',
          });
          visualResult.anomalies.forEach((a, i) => {
            anomalies.push({
              id: `visual-${i}`,
              type: 'visual',
              severity: a.severity,
              description: a.description,
            });
          });
        } else {
          checks.push({
            id: 'visual-match',
            name: 'Visual Template Match',
            status: 'fail',
            message: `Package does not match reference template (${Math.round(visualResult.similarity * 100)}% similarity).`,
            details: 'Significant visual differences detected from genuine packaging.',
          });
          anomalies.push({
            id: 'visual-major',
            type: 'visual',
            severity: 'high',
            description: 'Major visual discrepancies from reference template',
          });
        }
      } else {
        checks.push({
          id: 'visual-match',
          name: 'Visual Template Match',
          status: 'unavailable',
          message: 'No reference template available for this product.',
          details: 'Visual comparison could not be performed.',
        });
      }

      // 2. Manufacturer-Product validation
      if (extractedData.manufacturer && extractedData.medicineName && extractedData.strength) {
        const mpCheck = validateManufacturerProduct(
          extractedData.manufacturer,
          extractedData.medicineName,
          extractedData.strength
        );
        checks.push({
          id: 'manufacturer-product',
          name: 'Manufacturer-Product Check',
          status: mpCheck.valid ? 'pass' : 'fail',
          message: mpCheck.message,
          details: mpCheck.valid 
            ? 'The manufacturer is known to produce this medicine and strength.' 
            : 'This manufacturer does not produce this medicine in the stated strength.',
        });
        if (!mpCheck.valid) {
          anomalies.push({
            id: 'manufacturer-mismatch',
            type: 'manufacturer',
            severity: 'high',
            description: `Manufacturer "${extractedData.manufacturer}" not known to produce "${extractedData.medicineName} ${extractedData.strength}"`,
          });
        }
      } else {
        checks.push({
          id: 'manufacturer-product',
          name: 'Manufacturer-Product Check',
          status: 'unavailable',
          message: 'Could not extract manufacturer or product name.',
          details: 'OCR did not detect required information for validation.',
        });
      }

      // 3. Expiry date check
      if (extractedData.expiryDate) {
        const expiryCheck = validateExpiryDate(extractedData.expiryDate);
        checks.push({
          id: 'expiry-check',
          name: 'Expiry Date Validation',
          status: expiryCheck.valid ? (expiryCheck.expired ? 'fail' : 'pass') : 'fail',
          message: expiryCheck.message,
          details: expiryCheck.expired 
            ? 'This medicine has expired and should not be consumed.' 
            : 'Expiry date is valid and in the future.',
        });
        if (expiryCheck.expired) {
          anomalies.push({
            id: 'expired',
            type: 'expiry',
            severity: 'high',
            description: `Medicine expired on ${extractedData.expiryDate}`,
          });
        }
      } else {
        checks.push({
          id: 'expiry-check',
          name: 'Expiry Date Validation',
          status: 'unavailable',
          message: 'Expiry date not detected on package.',
          details: 'OCR could not read expiry date from the image.',
        });
      }

      // 4. Batch number validation
      if (extractedData.batchNumber) {
        const batchCheck = validateBatchNumber(extractedData.batchNumber);
        checks.push({
          id: 'batch-check',
          name: 'Batch Number Format',
          status: batchCheck.valid ? 'pass' : 'warning',
          message: batchCheck.message,
          details: batchCheck.valid 
            ? 'Batch number format follows expected pattern.' 
            : 'Batch number format appears unusual.',
        });
        if (!batchCheck.valid) {
          anomalies.push({
            id: 'batch-format',
            type: 'batch',
            severity: 'medium',
            description: 'Batch number format does not match expected pattern',
          });
        }
      } else {
        checks.push({
          id: 'batch-check',
          name: 'Batch Number Format',
          status: 'unavailable',
          message: 'Batch number not detected on package.',
          details: 'Batch number may be missing, obscured, or outside camera frame.',
        });
      }

      // 5. OCR Confidence check
      checks.push({
        id: 'ocr-confidence',
        name: 'Text Extraction Confidence',
        status: ocrResult.confidence >= 0.9 ? 'pass' : ocrResult.confidence >= 0.75 ? 'warning' : 'fail',
        message: `OCR confidence: ${Math.round(ocrResult.confidence * 100)}%`,
        details: ocrResult.confidence >= 0.9 
          ? 'High confidence in extracted text.' 
          : 'Some text may have been misread. Consider rescanning with better lighting.',
      });

      // Calculate overall confidence and risk level
      const confidence = calculateConfidence(checks);
      const riskLevel = determineRiskLevel(checks, anomalies);

      // Generate recommendations based on risk level
      const recommendations = generateRecommendations(riskLevel, checks, anomalies);

      // Create scan result
      const scanResult: ScanResult = {
        id: generateId(),
        timestamp: new Date(),
        imageUrl,
        riskLevel,
        confidence,
        extractedData,
        checks,
        anomalies,
        recommendations,
      };

      setCurrentScan(scanResult);
      
      // Add to history
      const historyItem: ScanHistoryItem = {
        id: scanResult.id,
        date: scanResult.timestamp,
        productName: `${extractedData.medicineName || 'Unknown'} ${extractedData.strength || ''}`.trim(),
        riskLevel,
        thumbnail: imageUrl,
      };
      
      setScanHistory(prev => [historyItem, ...prev].slice(0, 50));

      return scanResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Scan failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsScanning(false);
    }
  }, []);

  const clearCurrentScan = useCallback(() => {
    setCurrentScan(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isScanning,
    currentScan,
    scanHistory,
    error,
    performScan,
    clearCurrentScan,
    clearError,
  };
}

function generateRecommendations(
  riskLevel: RiskLevel,
  checks: CheckResult[],
  anomalies: Anomaly[]
): string[] {
  const recommendations: string[] = [];

  switch (riskLevel) {
    case 'consistent':
      recommendations.push('Purchase medicines only from trusted sources.');
      recommendations.push('Keep the original packaging for reference.');
      break;
    case 'needs-review':
      recommendations.push('Scan the outer box if only blister was captured.');
      recommendations.push('Verify with a pharmacist before use.');
      recommendations.push('Contact the manufacturer if you have concerns.');
      if (checks.some(c => c.id === 'visual-match' && c.status === 'unavailable')) {
        recommendations.push('No reference template available - visual comparison limited.');
      }
      if (checks.some(c => c.id === 'batch-check' && c.status === 'unavailable')) {
        recommendations.push('Batch number not verified - check with pharmacist.');
      }
      break;
    case 'high-risk':
      recommendations.push('Do not consume until verified by a professional.');
      recommendations.push('Contact a pharmacist immediately.');
      recommendations.push('Report to regulatory authority if confirmed suspicious.');
      if (anomalies.some(a => a.type === 'manufacturer')) {
        recommendations.push('Manufacturer-product mismatch detected - high probability of falsified product.');
      }
      if (anomalies.some(a => a.type === 'expiry')) {
        recommendations.push('Medicine is expired - do not use.');
      }
      if (anomalies.some(a => a.type === 'visual' && a.severity === 'high')) {
        recommendations.push('Major packaging anomalies detected - likely counterfeit.');
      }
      break;
  }

  return recommendations;
}

export function useCamera() {
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      setStream(stream);
      setPermission('granted');
      return stream;
    } catch (err) {
      setPermission('denied');
      console.error('Camera permission denied:', err);
      throw err;
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const switchCamera = useCallback(async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    stopCamera();
    await requestPermission();
  }, [facingMode, stopCamera, requestPermission]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return {
    permission,
    stream,
    facingMode,
    requestPermission,
    stopCamera,
    switchCamera,
  };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}