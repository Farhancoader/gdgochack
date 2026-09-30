import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getRiskLevelColor(riskLevel: 'consistent' | 'needs-review' | 'high-risk'): string {
  switch (riskLevel) {
    case 'consistent':
      return 'text-primary-700 bg-primary-50 border-primary-200';
    case 'needs-review':
      return 'text-warning-700 bg-warning-50 border-warning-200';
    case 'high-risk':
      return 'text-danger-700 bg-danger-50 border-danger-200';
  }
}

export function getRiskLevelIcon(riskLevel: 'consistent' | 'needs-review' | 'high-risk'): keyof typeof import('../components/Icons').Icons {
  switch (riskLevel) {
    case 'consistent':
      return 'checkCircle';
    case 'needs-review':
      return 'alertTriangle';
    case 'high-risk':
      return 'xCircle';
  }
}

export function validateManufacturerProduct(
  manufacturer: string,
  productName: string,
  strength: string
): { valid: boolean; message: string } {
  // This would normally check against a database
  // For mock, we'll simulate some validations
  const normalizedManufacturer = manufacturer.toLowerCase().trim();
  const normalizedProduct = productName.toLowerCase().trim();

  // Known mismatches for demo
  const knownMismatches = [
    { manufacturer: 'pfizer', product: 'viagra', strength: '100mg' }, // Valid
    { manufacturer: 'pfizer', product: 'lipitor', strength: '50mg' }, // Invalid strength
    { manufacturer: 'novartis', product: 'lipitor', strength: '10mg' }, // Wrong manufacturer
  ];

  const mismatch = knownMismatches.find(
    m => m.manufacturer === normalizedManufacturer && m.product === normalizedProduct
  );

  if (mismatch) {
    if (mismatch.strength === strength) {
      return { valid: true, message: 'Manufacturer-product combination is valid.' };
    }
    return { valid: false, message: `Manufacturer does not produce ${productName} in ${strength} strength.` };
  }

  return { valid: true, message: 'Manufacturer-product combination appears valid.' };
}

export function validateExpiryDate(expiryString: string): { valid: boolean; message: string; expired: boolean } {
  // Try to parse various date formats
  const formats = [
    /(\d{2})\/(\d{2})\/(\d{4})/, // MM/DD/YYYY
    /(\d{2})-(\d{2})-(\d{4})/, // MM-DD-YYYY
    /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
    /(\d{2})\.(\d{2})\.(\d{4})/, // DD.MM.YYYY
    /([A-Za-z]{3})\s+(\d{2}),\s+(\d{4})/, // MMM DD, YYYY
  ];

  let parsedDate: Date | null = null;

  for (const format of formats) {
    const match = expiryString.match(format);
    if (match) {
      if (format.source.includes('MMM')) {
        parsedDate = new Date(`${match[1]} ${match[2]}, ${match[3]}`);
      } else if (format.source.includes('YYYY-MM-DD')) {
        parsedDate = new Date(`${match[1]}-${match[2]}-${match[3]}`);
      } else {
        // Assume MM/DD/YYYY or similar
        parsedDate = new Date(`${match[1]}/${match[2]}/${match[3]}`);
      }
      break;
    }
  }

  if (!parsedDate || isNaN(parsedDate.getTime())) {
    return { valid: false, message: 'Could not parse expiry date format.', expired: false };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expired = parsedDate < now;

  if (expired) {
    return { valid: true, message: `Expired on ${parsedDate.toLocaleDateString()}.`, expired: true };
  }

  const daysUntilExpiry = Math.ceil((parsedDate.getTime() - now.getTime()) / 86400000);
  if (daysUntilExpiry <= 30) {
    return { valid: true, message: `Expires soon (${daysUntilExpiry} days).`, expired: false };
  }

  return { valid: true, message: `Valid until ${parsedDate.toLocaleDateString()}.`, expired: false };
}

export function validateBatchNumber(batchNumber: string): { valid: boolean; message: string } {
  if (!batchNumber || batchNumber.trim().length === 0) {
    return { valid: false, message: 'No batch number detected.' };
  }

  // Basic format validation - alphanumeric, 4-20 chars
  const batchRegex = /^[A-Z0-9]{4,20}$/i;
  if (!batchRegex.test(batchNumber.trim())) {
    return { valid: false, message: 'Batch number format appears invalid.' };
  }

  return { valid: true, message: 'Batch number format is valid.' };
}

export function calculateConfidence(checks: Array<{ status: string }>): 'high' | 'medium' | 'low' {
  const total = checks.length;
  const passed = checks.filter(c => c.status === 'pass').length;
  const unavailable = checks.filter(c => c.status === 'unavailable').length;
  const ratio = (passed + unavailable * 0.5) / total;

  if (ratio >= 0.8) return 'high';
  if (ratio >= 0.5) return 'medium';
  return 'low';
}

export function determineRiskLevel(
  checks: Array<{ status: string }>,
  anomalies: Array<{ severity: string }>
): 'consistent' | 'needs-review' | 'high-risk' {
  const hasHighAnomaly = anomalies.some(a => a.severity === 'high');
  const hasFailedCheck = checks.some(c => c.status === 'fail');
  const hasWarningCheck = checks.some(c => c.status === 'warning');
  const unavailableCount = checks.filter(c => c.status === 'unavailable').length;

  if (hasHighAnomaly || hasFailedCheck) {
    return 'high-risk';
  }

  if (hasWarningCheck || unavailableCount >= 2) {
    return 'needs-review';
  }

  return 'consistent';
}