// MerchantForm.tsx
import React, { useState } from 'react';
import { Building2, Globe, Mail, FileText, Upload, Search } from 'lucide-react';
import FormSection from '../FormSection';
import InputField from '../InputField';
import ImagePreview from '../ImagePreview';
import ResultsView from './ResultsView';
import { MerchantFormData, AnalysisResults } from '../types/merchant';

const MerchantForm: React.FC = () => {
  const [formData, setFormData] = useState<MerchantFormData>({
    businessName: '',
    website: '',
    email: '',
    description: '',
    images: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'images' && files) {
      setFormData(prev => ({ ...prev, images: Array.from(files) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.website.trim()) newErrors.website = 'Website URL is required';
    else if (!/^https?:\/\/.+/.test(formData.website)) newErrors.website = 'Please enter a valid URL';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const safeJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      let mccPrediction: any[] = [];
      if (formData.images.length > 0) {
        const fd = new FormData();
        formData.images.slice(0, 3).forEach((file, i) => fd.append("images", file, `${Date.now()}_${i}_${file.name}`));
        const predictRes = await fetch("http://localhost:8000/predict", { method: "POST", body: fd });
        const predictData = await safeJson(predictRes);
        mccPrediction = predictData?.predictions || [];
      }

      const merchantJSON = {
        name: formData.businessName,
        website: formData.website,
        email: formData.email,
        description: formData.description,
      };

      const linkRes = await fetch("http://localhost:8000/linkcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merchantJSON),
      });
      const linkData = await safeJson(linkRes);

      const downloadRes = await fetch("http://localhost:8000/download_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merchantJSON),
      });
      const downloadData = await safeJson(downloadRes);

      // ⚡ Fix applied: pass full linkcheck object instead of just results
      const analysisResults: AnalysisResults = {
        businessInfo: { ...formData },
        mccPrediction,
        linkCheck: linkData || null, // <--- FIX HERE
        websiteData: downloadData || null,
      };

      setResults(analysisResults);
    } catch (error) {
      console.error("Error submitting form:", error);
      setResults({
        businessInfo: { ...formData },
        mccPrediction: [],
        linkCheck: null, // changed to null
        websiteData: null,
      });
    } finally {
      setLoading(false);
    }
  };

  if (results) {
    return <ResultsView results={results} onSearchAgain={() => setResults(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Merchant Analysis Tool</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get comprehensive insights about your business including link validation, MCC predictions, and detailed analysis.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <FormSection icon={Building2} title="Business Information" bgColor="bg-blue-100" iconColor="text-blue-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField name="businessName" label="Business Name" required placeholder="Enter your business name"
                    icon={Building2} value={formData.businessName} onChange={handleInputChange} fieldError={errors.businessName} loading={loading} />
                  <InputField name="email" label="Contact Email" type="email" placeholder="contact@business.com"
                    icon={Mail} value={formData.email} onChange={handleInputChange} fieldError={errors.email} loading={loading} />
                </div>
              </FormSection>

              <FormSection icon={Globe} title="Website Information" bgColor="bg-green-100" iconColor="text-green-600">
                <InputField name="website" label="Website URL" required placeholder="https://www.yourbusiness.com"
                  icon={Globe} value={formData.website} onChange={handleInputChange} fieldError={errors.website} loading={loading} />
              </FormSection>

              <FormSection icon={FileText} title="Business Description" bgColor="bg-purple-100" iconColor="text-purple-600">
                <textarea name="description" rows={4} value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border-gray-200 bg-white"
                  placeholder="(Optional) Describe your business, products, and services..." disabled={loading} />
              </FormSection>

              <FormSection icon={Upload} title="Business Images" bgColor="bg-orange-100" iconColor="text-orange-600">
                <InputField name="images" label="Upload Business Images" type="file" onChange={handleInputChange} loading={loading} multiple />
                <p className="text-sm text-gray-500">Upload images of your business, products, or storefront for MCC analysis.</p>
                <ImagePreview files={formData.images} />
              </FormSection>

              <div className="pt-6 border-t border-gray-200">
                <button type="submit" disabled={loading}
                  className={`w-full flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform
                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'}
                    text-white focus:outline-none focus:ring-4 focus:ring-blue-500/30`}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Analyzing Business...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-3" />
                      Start Analysis
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantForm;
