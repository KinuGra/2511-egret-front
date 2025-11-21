"use client";

import React, { useEffect, useState } from 'react';
import styles from './EditForm.module.css';
import MarkdownText from '@/components/MarkdownText';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface EditFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = 'write' | 'preview';

const EditForm: React.FC<EditFormProps> = ({ isOpen, onClose }) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('write');
  const [error, setError] = useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Effect to handle mount/unmount animations
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Effect to reset content and view when the form is opened
  useEffect(() => {
    if (isOpen) {
      setContent('## Hello, Markdown!\n\n```javascript\nconsole.log("Hello, World!");\n```');
      setViewMode('write'); // Default to write mode on open
      setError(''); // Reset error on open
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('内容は必須です。入力してください。');
      return;
    }
    onClose();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (!isRendered) {
    return null;
  }

  const ViewToggle = () => (
    <div className={styles.viewToggle}>
      <button
        onClick={() => setViewMode('write')}
        className={viewMode === 'write' ? styles.active : ''}
      >
        Write
      </button>
      <button
        onClick={() => setViewMode('preview')}
        className={viewMode === 'preview' ? styles.active : ''}
      >
        Preview
      </button>
    </div>
  );

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={`${styles.formContainer} ${isOpen ? styles.formEnter : styles.formExit}`}>
        <div className={styles.formHeader}>
          <h2>スニペットを書く</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <form className={styles.formBody} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="snippet-title">タイトル</label>
            <input type="text" id="snippet-title" placeholder="スニペットのタイトル" />
          </div>

          <div className={styles.formGroup} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <label htmlFor="snippet-content">内容</label>
            
            {isMobile && <ViewToggle />}

            <div className={styles.editorLayout}>
              <textarea
                id="snippet-content"
                placeholder="コードやメモを入力..."
                value={content}
                onChange={handleContentChange}
                className={isMobile && viewMode === 'preview' ? styles.hidden : ''}
              />
              <div className={`${styles.previewArea} ${isMobile && viewMode === 'write' ? styles.hidden : ''}`}>
                <MarkdownText content={content} />
              </div>
            </div>
          </div>
          
          {error && <p className={styles.errorText}>{error}</p>}
          <button type="submit" className={styles.submitButton}>保存する</button>
        </form>
      </div>
    </>
  );
};

export default EditForm;
