import { useState } from 'react';

export const useDragDrop = (onDrop) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
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