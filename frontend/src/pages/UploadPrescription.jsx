import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { analyzePrescription, saveConfirmedMedicines } from '../services/prescriptionService';
import '../styles/upload.css';

const MAX_FILE_SIZE_MB = 10;
const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

function UploadPrescription({ isOnboarding = false, onComplete = null }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [stage, setStage] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [scanProgress, setScanProgress] = useState({ message: '', progress: 0 });
  const [extractedMedicines, setExtractedMedicines] = useState([]);
  const [scanError, setScanError] = useState('');
  const [analysisSource, setAnalysisSource] = useState('');
  const [analysisWarning, setAnalysisWarning] = useState('');

  const validateFile = (file) => {
    if (!file) return '';

    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      return 'Please upload a JPG, PNG, WEBP, or PDF prescription.';
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB.`;
    }

    return '';
  };

  const startAnalysis = async (file = null) => {
    const validationError = validateFile(file);

    if (validationError) {
      setScanError(validationError);
      setStage('upload');
      return;
    }

    setSelectedFile(file || { name: 'Sample_Doctor_Prescription.png' });
    setScanError('');
    setAnalysisSource('');
    setAnalysisWarning('');
    setStage('scanning');

    try {
      const result = await analyzePrescription(file, (step) => {
        setScanProgress(step);
      });

      setExtractedMedicines(result.medicines);
      setAnalysisSource(result.source);
      setAnalysisWarning(result.warning);
      setStage('review');
    } catch {
      setScanError('Prescription analysis failed. Check the backend connection or use the demo sample.');
      setStage('upload');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);

    if (event.dataTransfer.files?.[0]) {
      startAnalysis(event.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (event) => {
    if (event.target.files?.[0]) {
      startAnalysis(event.target.files[0]);
    }
    event.target.value = '';
  };

  const handleMedChange = (index, field, value) => {
    setExtractedMedicines((current) => {
      const copy = [...current];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDeleteMed = (index) => {
    setExtractedMedicines((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleAddCustomMed = () => {
    setExtractedMedicines((current) => [
      ...current,
      {
        id: `custom-${Date.now()}`,
        name: 'New Medicine',
        strength: '500 mg',
        dose: '1 Tablet',
        frequency: 'Daily',
        times: ['08:00 AM'],
        instructions: 'After breakfast',
        confidence: 100,
        needsVerification: false,
      },
    ]);
  };

  const handleConfirmAndSave = () => {
    const today = new Date();
    const startDate = today.toISOString().slice(0, 10);

    const formattedForSchedule = extractedMedicines.map((medicine) => ({
      ...medicine,
      startDate,
      endDate: medicine.durationDays
        ? new Date(today.getTime() + (medicine.durationDays - 1) * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10)
        : '',
      expiryDate: medicine.expiryDate || '',
      category: 'Prescription',
    }));

    const saved = saveConfirmedMedicines(formattedForSchedule);

    if (!saved) {
      setScanError('Could not save the confirmed medicines. Please try again.');
      setStage('upload');
      return;
    }

    if (onComplete) {
      onComplete();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="upload-page-container">
      {!isOnboarding && (
        <div className="upload-top-nav">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      )}

      <main className="upload-card-wrapper">
        {stage === 'upload' && (
          <>
            <div className="upload-header">
              <span className="upload-badge-tag">
                <Icon name="leaf" /> AI Prescription Reader
              </span>
              <h1 className="upload-title">Upload Doctor&apos;s Prescription</h1>
              <p className="upload-subtitle">
                Upload a clear photo or PDF of your prescription. The app will detect medicines,
                dosages, and schedules.
              </p>
            </div>

            {scanError && (
              <div className="upload-error-banner" role="alert">
                <Icon name="alert" />
                <span>{scanError}</span>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*,.pdf"
              onChange={handleFileSelect}
            />
            <input
              type="file"
              ref={cameraInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
            />

            <div
              className={`dropzone-box ${isDragActive ? 'drag-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropzone-icon-circle">
                <Icon name="upload" />
              </div>
              <h2 className="dropzone-main-text">Drag and drop your prescription here</h2>
              <p className="dropzone-sub-text">Supports camera photos, JPG, PNG, WEBP, or PDF</p>
              <div className="upload-action-row">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    cameraInputRef.current?.click();
                  }}
                >
                  Take Photo
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse Files
                </button>
              </div>
            </div>

            <div className="sample-picker-bar">
              <span>Don&apos;t have a prescription file handy?</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => startAnalysis(null)}>
                Use Demo Sample
              </button>
            </div>
          </>
        )}

        {stage === 'scanning' && (
          <div className="scanner-box">
            <div className="scanner-radar">
              <Icon name="search" />
            </div>
            <h2 className="upload-title">Analyzing Prescription...</h2>
            {selectedFile && <p className="scanner-file-name">{selectedFile.name}</p>}
            <p className="upload-subtitle">{scanProgress.message}</p>

            <div className="scanner-progress-bar">
              <div className="scanner-progress-fill" style={{ width: `${scanProgress.progress}%` }} />
            </div>
            <span className="scanner-status-text">{scanProgress.progress}% Completed</span>
          </div>
        )}

        {stage === 'review' && (
          <>
            <div className="upload-header" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <span className="upload-badge-tag">
                <Icon name="pill" /> Extraction Complete
              </span>
              <h1 className="upload-title">Review and Verify Medicines</h1>
              <p className="upload-subtitle">
                Double check all medicine names, strengths, and times against your physical prescription
                before saving.
              </p>
            </div>

            <div className="analysis-source-banner">
              <strong>{analysisSource === 'backend' ? 'Backend analysis complete' : 'Demo analysis complete'}</strong>
              {analysisWarning && <span>{analysisWarning}</span>}
            </div>

            <div className="safety-warning-banner">
              <Icon name="alert" />
              <div>
                <strong>Safety Verification:</strong> AI extraction is an organizational aid. Verify that
                the dosage and times match your doctor&apos;s instructions.
              </div>
            </div>

            <div className="review-list">
              {extractedMedicines.map((medicine, index) => (
                <div key={medicine.id} className="review-item-card">
                  <div className="review-card-top">
                    <div className="review-card-title-wrap">
                      <strong>Medicine #{index + 1}</strong>
                      <span className="confidence-badge">{medicine.confidence || 100}% Match</span>
                    </div>
                    <button type="button" className="delete-med-btn" onClick={() => handleDeleteMed(index)}>
                      Delete
                    </button>
                  </div>

                  <div className="review-fields-grid">
                    <div className="review-input-group">
                      <label htmlFor={`name-${medicine.id}`}>Medicine Name</label>
                      <input
                        id={`name-${medicine.id}`}
                        type="text"
                        value={medicine.name}
                        onChange={(event) => handleMedChange(index, 'name', event.target.value)}
                      />
                    </div>

                    <div className="review-input-group">
                      <label htmlFor={`strength-${medicine.id}`}>Strength</label>
                      <input
                        id={`strength-${medicine.id}`}
                        type="text"
                        value={medicine.strength}
                        onChange={(event) => handleMedChange(index, 'strength', event.target.value)}
                      />
                    </div>

                    <div className="review-input-group">
                      <label htmlFor={`time-${medicine.id}`}>Scheduled Time</label>
                      <input
                        id={`time-${medicine.id}`}
                        type="text"
                        value={medicine.times?.[0] || '08:00 AM'}
                        onChange={(event) => handleMedChange(index, 'times', [event.target.value])}
                      />
                    </div>
                  </div>

                  <div className="review-input-group">
                    <label htmlFor={`instructions-${medicine.id}`}>Instructions</label>
                    <input
                      id={`instructions-${medicine.id}`}
                      className="review-instructions-input"
                      type="text"
                      value={medicine.instructions}
                      onChange={(event) => handleMedChange(index, 'instructions', event.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', marginBottom: '24px' }}
              onClick={handleAddCustomMed}
            >
              Add Another Medicine
            </button>

            <div className="review-actions-row">
              <button type="button" className="btn btn-ghost" onClick={() => setStage('upload')}>
                Re-upload
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmAndSave}
                disabled={extractedMedicines.length === 0}
              >
                Confirm and Add to Schedule
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default UploadPrescription;
