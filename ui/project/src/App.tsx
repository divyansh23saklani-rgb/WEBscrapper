import React, { useState } from 'react';
import MerchantForm from './components/MerchantForm';
import ResultsView from './components/ResultsView';
import { MerchantFormData, AnalysisResults } from './types/merchant';

type AppState = 'form' | 'results';

function App() {
  const [currentView, setCurrentView] = useState<AppState>('form');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const handleFormSubmit = async (formData: MerchantFormData) => {
    setLoading(true);
    
    try {
      // Simulate API calls for analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results based on form data
      const mockResults: AnalysisResults = {
        businessInfo: formData,
        linkCheck: {
          results: [
            {
              url: formData.website,
              status_code: 200,
              redirected_to: null
            },
            {
              url: `${formData.website}/about`,
              status_code: 404,
              redirected_to: null
            },
            {
              url: `${formData.website}/contact`,
              status_code: 200,
              redirected_to: null
            },
            {
              url: `${formData.website}/products`,
              status_code: 301,
              redirected_to: `${formData.website}/shop`
            }
          ]
        },
        mccPrediction: formData.images.length > 0 ? {
          result: formData.images.map((file, index) => ({
            filename: file.name,
            caption: `${5411 + index}`,
            mcc_codes: `${5411 + index}`,
            mcc_desc: index === 0 
              ? 'Grocery stores, supermarkets' 
              : index === 1 
              ? 'Gas service stations'
              : 'Restaurants, fast food'
          }))
        } : undefined
      };

      setResults(mockResults);
      setCurrentView('results');
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAgain = () => {
    setCurrentView('form');
    setResults(null);
  };

  return (
    <>
      {currentView === 'form' && (
        <MerchantForm onSubmit={handleFormSubmit} loading={loading} />
      )}
      {currentView === 'results' && results && (
        <ResultsView results={results} onSearchAgain={handleSearchAgain} />
      )}
    </>
  );
}

export default App;