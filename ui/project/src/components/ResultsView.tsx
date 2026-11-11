import React from 'react';
import { ArrowLeft, Building2, Globe, Mail, FileText } from 'lucide-react';
import LinkCheckResults from '../LinkCheckResults';
import MCCPredictionResults from '../MCCPredictionResults';
import { AnalysisResults } from '../types/merchant';
import WebsiteDataResults from '../WebsiteDataResults';
interface ResultsViewProps {
  results: AnalysisResults;
  onSearchAgain: () => void;
}
const ResultsView: React.FC<ResultsViewProps> = ({ results, onSearchAgain }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Analysis Results
                </h1>
                <p className="text-sm text-gray-600">
                  {results.businessInfo.businessName}
                </p>
              </div>
            </div>
            <button
              onClick={onSearchAgain}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Search Again
            </button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Summary */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Business Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Business Name</p>
                  <p className="text-lg font-semibold text-gray-900">{results.businessInfo.businessName}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Website</p>
                  <a 
                    href={results.businessInfo.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {results.businessInfo.website}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p className="text-lg font-semibold text-gray-900">{results.businessInfo.email}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-2">Business Description</p>
                  <p className="text-gray-700 leading-relaxed">{results.businessInfo.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Results Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* MCC Prediction Results */}
          {results.mccPrediction && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">MCC Analysis</h2>
              </div>
              <div className="p-6">
                <MCCPredictionResults predictions={results.mccPrediction} />
              </div>
            </div>
          )}
        </div>
        {/* Link Check Results */}
         {results.linkCheck && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Link Analysis</h2>
            </div>
            <div className="p-6">
              <LinkCheckResults data={results.linkCheck} />
            </div>
          </div>
        )}
        {/* Website Data Results */}
        {results.websiteData && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Website Data</h2>
            </div>
            <div className="p-6">
              <WebsiteDataResults data={results.websiteData} />
            </div>
          </div>
        )}
        {/* Image Summary */}
        {results.businessInfo.images.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 mt-8 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Uploaded Images</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                {results.businessInfo.images.length} image{results.businessInfo.images.length > 1 ? 's' : ''} analyzed for MCC predictions
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.businessInfo.images.map((file, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={file.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ResultsView;