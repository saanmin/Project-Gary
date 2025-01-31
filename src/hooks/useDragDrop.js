import { useState, useRef } from 'react';

export const useDragDrop = (onDrop) => {
  const [dragActive, setDragActive] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragActive(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragActive(false);

    const files = e.dataTransfer?.files || e.target.files;
    const file = files?.[0];

    if (file) {
      const allowedExtensions = ['.xlsx', '.xls', '.csv'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

      if (allowedExtensions.includes(fileExtension)) {
        onDrop(file);
      } else {
        console.warn('Unsupported file type');
      }
    }
  };

  const dragDropProps = {
    dragActive,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop
  };

  return dragDropProps;
};