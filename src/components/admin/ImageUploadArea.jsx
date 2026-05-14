import React, { useState, useCallback, useEffect } from 'react';
import { UploadCloud, X, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ImageUploadArea = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileProcess = async (file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      try {
        setIsUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { data, error } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (error) {
          throw error;
        }

        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;
        setPreview(publicUrl);
        onChange(publicUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert('Error uploading image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } else {
      alert('Please upload a valid image file');
    }
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPaste = useCallback((e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        handleFileProcess(file);
        break; // Process only the first image
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen to global paste events to catch images copied to clipboard
  useEffect(() => {
    window.addEventListener('paste', onPaste);
    return () => {
      window.removeEventListener('paste', onPaste);
    };
  }, [onPaste]);

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setPreview('');
    onChange('');
  };

  return (
    <div 
      className={`upload-area ${isDragging ? 'dragging' : ''} ${preview ? 'has-image' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !preview && document.getElementById('imageUpload').click()}
      title={!preview ? "Click, Drag & Drop, or Paste (Ctrl+V) an image here" : ""}
    >
      <input 
        id="imageUpload" 
        type="file" 
        accept="image/*" 
        className="hidden-input" 
        onChange={handleInputChange} 
      />

      {isUploading ? (
        <div className="empty-state">
          <Loader className="spin" size={32} color="var(--primary)" style={{ margin: '0 auto', animation: 'spin 2s linear infinite' }} />
          <p className="upload-title" style={{ marginTop: '1rem' }}>Uploading image...</p>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : preview ? (
        <div className="preview-container">
          <img src={preview} alt="Product Preview" className="preview-image" />
          <button type="button" className="clear-btn" onClick={clearImage}>
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="empty-state">
          <div className="upload-icon-wrapper">
            <UploadCloud size={32} color="var(--primary)" />
          </div>
          <p className="upload-title"><strong>Click to upload</strong> or drag and drop</p>
          <p className="upload-subtitle">You can also paste (Ctrl+V) an image here</p>
          <p className="upload-hint">SVG, PNG, JPG or GIF (max. 5MB)</p>
        </div>
      )}

      <style>{`
        .upload-area {
          border: 2px dashed rgba(30, 58, 26, 0.2);
          border-radius: var(--radius-md);
          background-color: #f7f9f7;
          transition: var(--transition-normal);
          position: relative;
          overflow: hidden;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .upload-area:not(.has-image) {
          cursor: pointer;
        }
        .upload-area:not(.has-image):hover, .upload-area.dragging {
          border-color: var(--primary);
          background-color: rgba(30, 58, 26, 0.03);
        }
        .hidden-input { display: none; }
        .empty-state {
          text-align: center;
          padding: var(--space-md);
        }
        .upload-icon-wrapper {
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-sm);
          box-shadow: var(--shadow-sm);
        }
        .upload-title { color: var(--text-main); font-size: 1rem; margin-bottom: 0.25rem; }
        .upload-subtitle { color: var(--primary); font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem; }
        .upload-hint { color: var(--text-muted); font-size: 0.75rem; }
        
        .preview-container {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
        }
        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .clear-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          transition: var(--transition-normal);
          z-index: 10;
        }
        .clear-btn:hover {
          background: #dc2626;
          color: white;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default ImageUploadArea;
