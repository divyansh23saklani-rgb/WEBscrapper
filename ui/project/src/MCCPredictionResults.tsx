import React from "react";
import { CreditCard, Image as ImageIcon, Tag } from "lucide-react";

interface MCCResult {
  image_name: string;
  caption: string;
  mcc_code: string;
  description: string;
}

interface MCCPredictionResultsProps {
  predictions?: string[]; // backend response
}

const MCCPredictionResults: React.FC<MCCPredictionResultsProps> = ({ predictions }) => {
  const results: MCCResult[] = (predictions ?? []).map((str) => {
    const [namePart, rest] = str.split(":");
    if (!rest) return { image_name: namePart.trim(), caption: "", mcc_code: "", description: "" };

    const [captionPart, codeDescPart] = rest.split("→").map((s) => s.trim());
    const codeMatch = codeDescPart?.match(/^(\d+)\s*\((.*)\)$/);

    return {
      image_name: namePart.trim(),
      caption: captionPart || "",
      mcc_code: codeMatch ? codeMatch[1] : "",
      description: codeMatch ? codeMatch[2] : "",
    };
  });

  if (results.length === 0) {
    return <div className="text-gray-500 text-sm italic">No MCC predictions available yet.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
        <h4 className="font-semibold text-gray-800">MCC Predictions</h4>
      </div>

      {results.map((item, index) => (
        <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <ImageIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900 truncate max-w-xs" title={item.image_name}>
                  {item.image_name}
                </h5>
                <p className="text-sm text-gray-500">Image Analysis</p>
              </div>
            </div>
            {/* <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {item.caption || "No caption"}
            </div> */}
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <Tag className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <span className="ml-2 text-sm text-gray-900 font-semibold">{item.mcc_code}</span>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">{item.description?.trim()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MCCPredictionResults;
