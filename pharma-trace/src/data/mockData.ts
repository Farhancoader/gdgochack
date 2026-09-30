import type { ManufacturerProduct, PillImprint, ReferenceTemplate } from '../types';

export const mockManufacturerProducts: ManufacturerProduct[] = [
  {
    manufacturer: 'Pfizer Inc.',
    products: [
      { name: 'Lipitor', strengths: ['10mg', '20mg', '40mg', '80mg'], dosageForms: ['tablet'] },
      { name: 'Viagra', strengths: ['25mg', '50mg', '100mg'], dosageForms: ['tablet'] },
      { name: 'Norvasc', strengths: ['5mg', '10mg'], dosageForms: ['tablet'] },
      { name: 'Zoloft', strengths: ['25mg', '50mg', '100mg'], dosageForms: ['tablet'] },
    ],
  },
  {
    manufacturer: 'Novartis',
    products: [
      { name: 'Diovan', strengths: ['80mg', '160mg', '320mg'], dosageForms: ['tablet'] },
      { name: 'Gleevec', strengths: ['100mg', '400mg'], dosageForms: ['tablet'] },
      { name: 'Lamictal', strengths: ['25mg', '50mg', '100mg', '200mg'], dosageForms: ['tablet'] },
    ],
  },
  {
    manufacturer: 'Johnson & Johnson',
    products: [
      { name: 'Tylenol', strengths: ['325mg', '500mg', '650mg'], dosageForms: ['tablet', 'caplet', 'gelcap'] },
      { name: 'Motrin', strengths: ['200mg', '400mg', '600mg', '800mg'], dosageForms: ['tablet'] },
      { name: 'Risperdal', strengths: ['0.5mg', '1mg', '2mg', '3mg', '4mg'], dosageForms: ['tablet'] },
    ],
  },
  {
    manufacturer: 'Merck & Co.',
    products: [
      { name: 'Januvia', strengths: ['25mg', '50mg', '100mg'], dosageForms: ['tablet'] },
      { name: 'Keytruda', strengths: ['100mg/4mL'], dosageForms: ['injection'] },
      { name: 'Gardasil 9', strengths: ['0.5mL'], dosageForms: ['injection'] },
    ],
  },
  {
    manufacturer: 'Roche',
    products: [
      { name: 'Tamiflu', strengths: ['30mg', '45mg', '75mg'], dosageForms: ['capsule'] },
      { name: 'Herceptin', strengths: ['150mg', '440mg'], dosageForms: ['injection'] },
      { name: 'Avastin', strengths: ['100mg/4mL', '400mg/16mL'], dosageForms: ['injection'] },
    ],
  },
  {
    manufacturer: 'GSK',
    products: [
      { name: 'Advair', strengths: ['100/50mcg', '250/50mcg', '500/50mcg'], dosageForms: ['inhaler'] },
      { name: 'Augmentin', strengths: ['250/125mg', '500/125mg', '875/125mg'], dosageForms: ['tablet'] },
      { name: 'Zofran', strengths: ['4mg', '8mg'], dosageForms: ['tablet'] },
    ],
  },
  {
    manufacturer: 'Sanofi',
    products: [
      { name: 'Lantus', strengths: ['100 units/mL'], dosageForms: ['injection'] },
      { name: 'Plavix', strengths: ['75mg'], dosageForms: ['tablet'] },
      { name: 'Ambien', strengths: ['5mg', '10mg'], dosageForms: ['tablet'] },
    ],
  },
  {
    manufacturer: 'AstraZeneca',
    products: [
      { name: 'Crestor', strengths: ['5mg', '10mg', '20mg', '40mg'], dosageForms: ['tablet'] },
      { name: 'Nexium', strengths: ['20mg', '40mg'], dosageForms: ['capsule'] },
      { name: 'Symbicort', strengths: ['80/4.5mcg', '160/4.5mcg'], dosageForms: ['inhaler'] },
    ],
  },
];

export const mockPillImprints: PillImprint[] = [
  { imprint: 'LIPITOR 10', shape: 'oval', color: 'white', productName: 'Lipitor', strength: '10mg' },
  { imprint: 'LIPITOR 20', shape: 'oval', color: 'white', productName: 'Lipitor', strength: '20mg' },
  { imprint: 'LIPITOR 40', shape: 'oval', color: 'white', productName: 'Lipitor', strength: '40mg' },
  { imprint: 'LIPITOR 80', shape: 'oval', color: 'white', productName: 'Lipitor', strength: '80mg' },
  { imprint: 'VGR 25', shape: 'diamond', color: 'blue', productName: 'Viagra', strength: '25mg' },
  { imprint: 'VGR 50', shape: 'diamond', color: 'blue', productName: 'Viagra', strength: '50mg' },
  { imprint: 'VGR 100', shape: 'diamond', color: 'blue', productName: 'Viagra', strength: '100mg' },
  { imprint: 'NORVASC 5', shape: 'round', color: 'white', productName: 'Norvasc', strength: '5mg' },
  { imprint: 'NORVASC 10', shape: 'round', color: 'white', productName: 'Norvasc', strength: '10mg' },
  { imprint: 'ZOLOFT 50', shape: 'oval', color: 'light blue', productName: 'Zoloft', strength: '50mg' },
  { imprint: 'ZOLOFT 100', shape: 'oval', color: 'light blue', productName: 'Zoloft', strength: '100mg' },
  { imprint: 'DIOVAN 80', shape: 'oval', color: 'pink', productName: 'Diovan', strength: '80mg' },
  { imprint: 'DIOVAN 160', shape: 'oval', color: 'pink', productName: 'Diovan', strength: '160mg' },
  { imprint: 'TYLENOL 500', shape: 'round', color: 'white', productName: 'Tylenol', strength: '500mg' },
  { imprint: 'MOTRIN 200', shape: 'round', color: 'orange', productName: 'Motrin', strength: '200mg' },
  { imprint: 'JANUVIA 100', shape: 'round', color: 'pink', productName: 'Januvia', strength: '100mg' },
  { imprint: 'TAMIFLU 75', shape: 'capsule', color: 'yellow/gray', productName: 'Tamiflu', strength: '75mg' },
  { imprint: 'CRESTOR 10', shape: 'round', color: 'pink', productName: 'Crestor', strength: '10mg' },
  { imprint: 'CRESTOR 20', shape: 'round', color: 'pink', productName: 'Crestor', strength: '20mg' },
  { imprint: 'NEXIUM 40', shape: 'capsule', color: 'purple/white', productName: 'Nexium', strength: '40mg' },
];

export const mockReferenceTemplates: ReferenceTemplate[] = [
  {
    id: 'lipitor-10mg-pfizer',
    productName: 'Lipitor',
    manufacturer: 'Pfizer Inc.',
    strength: '10mg',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    regions: ['US', 'EU', 'CA', 'AU'],
  },
  {
    id: 'viagra-50mg-pfizer',
    productName: 'Viagra',
    manufacturer: 'Pfizer Inc.',
    strength: '50mg',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
    regions: ['US', 'EU', 'CA'],
  },
  {
    id: 'tylenol-500mg-jj',
    productName: 'Tylenol',
    manufacturer: 'Johnson & Johnson',
    strength: '500mg',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=300&fit=crop',
    regions: ['US', 'CA', 'MX'],
  },
  {
    id: 'crestor-10mg-az',
    productName: 'Crestor',
    manufacturer: 'AstraZeneca',
    strength: '10mg',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    regions: ['US', 'EU', 'JP'],
  },
];

export const mockScanHistory = [
  {
    id: 'scan-001',
    date: new Date('2024-01-15T10:30:00'),
    productName: 'Lipitor 10mg',
    riskLevel: 'consistent' as const,
    thumbnail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop',
  },
  {
    id: 'scan-002',
    date: new Date('2024-01-14T14:22:00'),
    productName: 'Viagra 50mg',
    riskLevel: 'needs-review' as const,
    thumbnail: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=100&h=100&fit=crop',
  },
  {
    id: 'scan-003',
    date: new Date('2024-01-13T09:15:00'),
    productName: 'Tylenol 500mg',
    riskLevel: 'consistent' as const,
    thumbnail: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=100&h=100&fit=crop',
  },
  {
    id: 'scan-004',
    date: new Date('2024-01-12T16:45:00'),
    productName: 'Unknown Product',
    riskLevel: 'high-risk' as const,
    thumbnail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop',
  },
  {
    id: 'scan-005',
    date: new Date('2024-01-11T11:00:00'),
    productName: 'Crestor 10mg',
    riskLevel: 'consistent' as const,
    thumbnail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop',
  },
];

export const riskLevelLabels = {
  consistent: 'Consistent with Evidence',
  'needs-review': 'Needs Review',
  'high-risk': 'High Risk',
};

export const riskLevelDescriptions = {
  consistent: 'Multiple signals match and no major contradiction was found.',
  'needs-review': 'Important signals are missing, unclear, or unavailable.',
  'high-risk': 'Multiple independent signals conflict: visual anomalies, impossible product-maker combination, wrong pill match, or invalid data.',
};

export const riskLevelActions = {
  consistent: 'Still purchase medicines only from trusted sources; keep packaging.',
  'needs-review': 'Scan the outer box, check with a pharmacist, or contact the manufacturer.',
  'high-risk': 'Do not consume until verified by a pharmacist, regulator, manufacturer, or laboratory.',
};

export const disclaimerText = `IMPORTANT: PharmaTrace does not prove what is chemically inside a pill. It identifies packs that deserve closer verification, so pharmacists, regulators, and laboratories can act faster. This app is a screening tool only and does not replace laboratory testing or professional medical advice. Do not rely on this app for emergency treatment decisions. Contact a clinician, pharmacist, or emergency service for urgent medical needs.`;

export const emergencyWarning = 'Do not rely on this app for emergency treatment decisions. Contact a clinician, pharmacist, or emergency service.';

export { formatDate, formatRelativeTime } from '../utils/helpers';