'use client'
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/components/ui/required-label";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useDragDrop } from "@/hooks/useDragDrop";

const FileUpload = ({ 
  id, 
  label, 
  subLabel, 
  required,
  onFileChange, 
  uploadedFile, 
  onDelete,
  error,
  errorMessage 
}) => {
  // Prevent default behavior for the entire drop zone
  const handleDragEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (file) => {
    if (file) {
      const fakeEvent = {
        target: {
          files: [file]
        }
      };
      onFileChange?.(fakeEvent);
    }
  };

  const { dragActive, onDragEnter, onDragLeave, onDragOver, onDrop } = useDragDrop(handleDrop);

  return (
    <div className="grid grid-cols-4 gap-4 items-top mt-4 mb-10">
      <div className="flex flex-col">
        {required ? (
          <RequiredLabel htmlFor={id} className="text-base font-medium text-slate-700">
            {label}
          </RequiredLabel>
        ) : (
          <Label htmlFor={id} className="text-base font-medium text-slate-700">
            {label}
          </Label>
        )}
        {subLabel && <span className="text-sm text-slate-500">{subLabel}</span>}
      </div>

      <div className="col-span-3">
        {!uploadedFile ? (
          <div
            className={cn(
              "relative rounded-lg border-2 border-dashed p-6 transition-all",
              dragActive ? "border-blue-500 bg-blue-100" : error ? "border-red-500" : "border-slate-300",
              "hover:border-blue-500"
            )}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <input
              type="file"
              id={id}
              className="hidden"
              onChange={onFileChange}
              accept=".xlsx,.xls,.csv"
            />
            <label
              htmlFor={id}
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center pt-2 space-y-2">
                <Button variant="secondary" type="button" onClick={() => document.getElementById(id).click()}>
                  <Icon icon="heroicons:arrow-up-tray-20-solid" width="16" height="16" />
                  파일 선택
                </Button>
                <div className="text-sm text-center space-y-2">
                  <p className="text-slate-500">또는</p>
                  <p className="text-slate-900">첨부할 파일을 여기에 끌어다 놓으세요</p>
                </div>
                <p className="pt-2 text-sm text-blue-500">xlsx, xls, csv 파일만 첨부할 수 있습니다</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-3">
              <Icon icon="vscode-icons:file-type-excel" className="w-8 h-8" />
              <div>
                <p className="text-sm font-medium">{uploadedFile.name}</p>
                <p className="text-xs text-slate-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => onDelete(id)}
              >
                <Icon icon="heroicons:trash" width="16" height="16" />
              </Button>
            </div>
          </div>
        )}
        {error && errorMessage && (
          <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;