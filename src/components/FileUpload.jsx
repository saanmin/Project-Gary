'use client'
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/components/ui/required-label";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const FileUpload = ({ id, label, subLabel, required, dragActive, onDragEnter, onDragLeave, onDragOver, onDrop, onFileChange, uploadedFile, onDelete }) => {
  // Prevent default behavior for the entire drop zone
  const handleDragEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="grid grid-cols-4 gap-4 items-top mt-4">
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
              dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300",
              "hover:border-blue-500"
            )}
            onDragEnter={(e) => {
              handleDragEvent(e);
              onDragEnter(e);
            }}
            onDragLeave={(e) => {
              handleDragEvent(e);
              onDragLeave(e);
            }}
            onDragOver={handleDragEvent}
            onDrop={(e) => {
              handleDragEvent(e);
              onDrop(e);
            }}
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
              onDragOver={handleDragEvent}
            >
              <div className="flex flex-col items-center justify-center py-2 space-y-3">
                <Icon icon="lucide:hard-drive-upload" width="36" height="36" className="text-slate-400" />
                <p className="my-2 text-sm text-slate-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">확장자: xlsx, xls, csv</p>
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
                <Icon icon="lucide:trash-2" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;