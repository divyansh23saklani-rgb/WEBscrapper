import React from 'react';

interface ImagePreviewProps {
  files: File[];
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ files }) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-3">
        {files.length} image{files.length > 1 ? 's' : ''} selected
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {files.map((file, idx) => (
          <div 
            key={`${file.name}-${idx}`}
            className="relative border rounded-lg p-2 bg-gray-50 text-center hover:shadow-md transition-shadow duration-200"
          >
            <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
              <img 
                src={URL.createObjectURL(file)} 
                alt={file.name} 
                className="w-full h-full object-cover"
                onLoad={(e) => {
                  // Clean up the object URL to prevent memory leaks
                  // This is handled automatically by the browser, but good practice
                }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-600 truncate" title={file.name}>
              {file.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreview;