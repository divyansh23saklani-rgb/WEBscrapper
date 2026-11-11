export interface MerchantFormData {
  businessName: string;
  website: string;
  email: string;
  description: string;
  images: File[];
}

export interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  icon?: React.ComponentType<any>;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldError?: string;
  loading?: boolean;
  multiple?: boolean;
}

export interface LinkResult {
  url: string;
  status_code: number;
  redirected_to: string | null;
}

export interface LinkCheckResponse {
  results: LinkResult[];
  total_links: number;
  error: string | null;
}

export interface MCCResult {
  filename: string;
  caption: string;
  mcc_codes: string;
  mcc_desc: string;
}

export interface MCCPredictionResponse {
  result: MCCResult[];
}

export interface AnalysisResults {
  businessInfo: MerchantFormData;
  linkCheck?: LinkCheckResponse;
  mccPrediction?: MCCPredictionResponse;
  websiteData?: Record<string, any>; // can refine later
}
