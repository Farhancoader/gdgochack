import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, Shield, AlertTriangle, Info, HelpCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Icon } from '../components/Icons';
import { useScan, useCamera } from '../hooks/useScan';
import { disclaimerText, emergencyWarning } from '../data/mockData';

export function ScanScreen({ onScanComplete }: { onScanComplete: (imageUrl: string) => void }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { isScanning, performScan, error, clearError } = useScan();
  const { permission, requestPermission, stopCamera, switchCamera } = useCamera();

  useEffect(() => {
    if (showCamera && permission === 'granted') {
      requestPermission();
    } else if (!showCamera) {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCamera, permission, requestPermission, stopCamera]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCaptureError('Please select an image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setCaptureError('Image size must be less than 10MB.');
      return;
    }

    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setCaptureError(null);
    fileInputRef.current!.value = '';
  }, []);

  const handleCameraCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx?.drawImage(video, 0, 0);

    const url = canvas.toDataURL('image/jpeg', 0.9);
    setImagePreview(url);
    setShowCamera(false);
    setCaptureError(null);
  }, []);

  const handleScan = useCallback(async () => {
    if (!imagePreview) return;

    try {
      await performScan(imagePreview);
      onScanComplete(imagePreview);
    } catch {
      // Error handled by hook
    }
  }, [imagePreview, performScan, onScanComplete]);

  const handleRetake = useCallback(() => {
    const currentPreview = imagePreview;
    setImagePreview(null);
    if (currentPreview) URL.revokeObjectURL(currentPreview);
  }, [imagePreview]);

  const handleOpenCamera = useCallback(async () => {
    setShowCamera(true);
    try {
      await requestPermission();
    } catch {
      setCaptureError('Camera access denied. Please enable camera permissions in your browser settings.');
      setShowCamera(false);
    }
  }, [requestPermission]);

  if (showCamera) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col" role="dialog" aria-modal="true" aria-label="Camera">
        <div className="flex items-center justify-between p-4 bg-black/80">
          <h2 className="text-white font-medium">Capture Medicine Package</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={switchCamera} aria-label="Switch camera">
              <Icon name="rotate" size={20} className="text-white" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowCamera(false)} aria-label="Close camera">
              <Icon name="close" size={20} className="text-white" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 relative flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="max-w-full max-h-full"
            aria-label="Camera preview"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[80%] aspect-[4/3] border-2 border-white/60 rounded-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded-full text-white text-sm font-medium">
                Align package within frame
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 p-6 bg-black/80">
          <Button variant="ghost" size="lg" onClick={handleRetake} disabled={!imagePreview} aria-label="Retake">
            <Icon name="refresh" size={24} className="text-white" />
          </Button>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleCameraCapture} 
            className="w-20 h-20 rounded-full p-0"
            aria-label="Capture photo"
          >
            <div className="w-12 h-12 rounded-full border-4 border-white/80 bg-white/10 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-white" />
            </div>
          </Button>
          <Button variant="ghost" size="lg" onClick={() => setShowGuidance(true)} aria-label="Guidance">
            <Icon name="helpCircle" size={24} className="text-white" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">PharmaTrace</h1>
          <Button variant="ghost" size="sm" onClick={() => setShowDisclaimer(true)} aria-label="Information">
            <Info size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-4">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Scan Medicine Package</h2>
          <p className="mt-2 text-gray-600">
            Take a photo or upload an image to check for authenticity
          </p>
        </div>

        {captureError && (
          <div className="mb-4 p-3 rounded-xl bg-danger-50 border border-danger-200 flex items-start gap-3" role="alert">
            <AlertTriangle size={20} className="text-danger-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-danger-700">{captureError}</p>
            <Button variant="ghost" size="sm" onClick={() => setCaptureError(null)} className="ml-auto">
              <Icon name="close" size={16} />
            </Button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-danger-50 border border-danger-200 flex items-start gap-3" role="alert">
            <AlertTriangle size={20} className="text-danger-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-danger-700">{error}</p>
            <Button variant="ghost" size="sm" onClick={clearError} className="ml-auto">
              <Icon name="close" size={16} />
            </Button>
          </div>
        )}

        {!imagePreview ? (
          <div className="space-y-4">
            <Button 
              variant="primary" 
              fullWidth 
              size="lg" 
              onClick={handleOpenCamera}
              leftIcon={<Camera size={20} />}
              className="h-16"
            >
              Take Photo
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-4 text-gray-500">or</span>
              </div>
            </div>

            <Button 
              variant="secondary" 
              fullWidth 
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload size={20} />}
              className="h-16"
            >
              Upload Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              aria-label="Upload medicine package image"
            />

            <Button 
              variant="ghost" 
              fullWidth 
              onClick={() => setShowGuidance(true)}
              leftIcon={<HelpCircle size={20} />}
            >
              Photography Guidance
            </Button>
          </div>
        ) : (
          <Card variant="elevated" className="animate-slide-up">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-4">
              <img 
                src={imagePreview} 
                alt="Captured medicine package" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[85%] aspect-[4/3] border-2 border-dashed border-white/60 rounded-lg" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Icon name="imageIcon" size={16} />
                <span>Ready to scan</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRetake}>
                <Icon name="rotate" size={16} />
                Retake
              </Button>
            </div>
            
            <Button 
              variant="primary" 
              fullWidth 
              size="lg" 
              onClick={handleScan} 
              isLoading={isScanning}
              leftIcon={<Icon name="scanLine" size={20} />}
              className="mt-4"
            >
              {isScanning ? 'Analyzing...' : 'Analyze Package'}
            </Button>
          </Card>
        )}

        <div className="mt-8 space-y-3">
          <Card variant="outlined" padding="sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Icon name="shieldCheck" size={18} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Multiple Verification Layers</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Visual comparison, text validation, manufacturer check, and more
                </p>
              </div>
            </div>
          </Card>

          <Card variant="outlined" padding="sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary-100 flex items-center justify-center flex-shrink-0">
                <Icon name="lock" size={18} className="text-secondary-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Privacy First</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Images processed locally. No personal data stored without consent.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="outlined" padding="sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-warning-100 flex items-center justify-center flex-shrink-0">
                <Icon name="alertTriangle" size={18} className="text-warning-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Not a Medical Device</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {emergencyWarning}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Modal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        title="Important Disclaimer"
        description="Please read before using PharmaTrace"
        size="lg"
      >
        <div className="space-y-4 text-sm text-gray-600 max-h-[60vh] overflow-y-auto">
          <p className="font-medium text-gray-900">{emergencyWarning}</p>
          <div className="prose prose-sm max-w-none">
            {disclaimerText.split('\n').map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-100">
            <Button variant="primary" fullWidth onClick={() => setShowDisclaimer(false)}>
              I Understand
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showGuidance}
        onClose={() => setShowGuidance(false)}
        title="Photography Guidance"
        description="Tips for capturing a clear, analyzable image"
        size="lg"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: 'sun', title: 'Good Lighting', desc: 'Use natural light or bright indoor lighting. Avoid flash.' },
              { icon: 'box', title: 'Flat Surface', desc: 'Place package on a flat surface. Avoid curved surfaces.' },
              { icon: 'camera', title: 'Straight Angle', desc: 'Hold camera parallel to package. Avoid tilted angles.' },
              { icon: 'imageIcon', title: 'Full Package', desc: 'Include entire label. Don\'t crop edges or text.' },
              { icon: 'eye', title: 'No Glare', desc: 'Avoid reflections on glossy packaging. Adjust angle.' },
              { icon: 'type', title: 'Text in Focus', desc: 'Tap to focus on text. Ensure text is sharp and readable.' },
            ].map((item, i) => (
              <Card key={i} variant="outlined" padding="md">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-3">
                  <Icon name={item.icon as keyof typeof import('../components/Icons').Icons} size={20} className="text-primary-600" />
                </div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </Card>
            ))}
          </div>
          <Button variant="primary" fullWidth onClick={() => setShowGuidance(false)}>
            Got It
          </Button>
        </div>
      </Modal>
    </div>
  );
}