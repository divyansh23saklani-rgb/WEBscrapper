import React from 'react';
import { Shield, Globe, Calendar, Building, MapPin, FileText } from 'lucide-react';

interface SSLCert {
  issuer: {
    countryName: string;
    organizationName: string;
    commonName: string;
  };
  valid_from: string;
  valid_to: string;
  sucject: {
    countryName: string;
    stateOrProvinceName: string;
    localityName: string;
    organizationName: string;
    commonName: string;
  };
}

interface WhoisCert {
  domain_name: string;
  registrar: string;
  creation_date: string;
  domain_age: number;
}

interface WebsiteDataResultsProps {
  data: {
    ssl_cert: SSLCert;
    whois_cert: WhoisCert;
    legal_pages: string[];
  };
}

const WebsiteDataResults: React.FC<WebsiteDataResultsProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getDaysUntilExpiry = (validTo: string) => {
    try {
      const expiryDate = new Date(validTo);
      const today = new Date();
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  const daysUntilExpiry = getDaysUntilExpiry(data.ssl_cert.valid_to);

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Globe className="h-5 w-5 text-purple-600 mr-2" />
        <h4 className="font-semibold text-gray-800">Website Data Dashboard</h4>
      </div>

      {/* SSL Certificate Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-2 rounded-lg mr-3">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <h5 className="font-semibold text-gray-800">SSL Certificate</h5>
          {daysUntilExpiry !== null && (
            <div className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
              daysUntilExpiry > 30 ? 'bg-green-100 text-green-800' : 
              daysUntilExpiry > 7 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} days until expiry` : 'Expired'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h6 className="text-sm font-medium text-gray-700 mb-2">Certificate Authority</h6>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Building className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">{data.ssl_cert.issuer.organizationName}</span>
                </div>
                <div className="flex items-center mb-1">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{data.ssl_cert.issuer.countryName}</span>
                </div>
                <div className="text-sm text-gray-600">{data.ssl_cert.issuer.commonName}</div>
              </div>
            </div>

            <div>
              <h6 className="text-sm font-medium text-gray-700 mb-2">Validity Period</h6>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">From:</span>
                  <span className="ml-2 text-sm font-medium">{formatDate(data.ssl_cert.valid_from)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">To:</span>
                  <span className="ml-2 text-sm font-medium">{formatDate(data.ssl_cert.valid_to)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h6 className="text-sm font-medium text-gray-700 mb-2">Certificate Subject</h6>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium">{data.ssl_cert.sucject.commonName}</span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">{data.ssl_cert.sucject.organizationName}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">
                  {data.ssl_cert.sucject.localityName}, {data.ssl_cert.sucject.stateOrProvinceName}, {data.ssl_cert.sucject.countryName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <Globe className="h-5 w-5 text-blue-600" />
          </div>
          <h5 className="font-semibold text-gray-800">Domain Information</h5>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Globe className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Domain</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">{data.whois_cert.domain_name}</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Building className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Registrar</span>
            </div>
            <span className="text-sm text-gray-900 font-medium">{data.whois_cert.registrar}</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Created</span>
            </div>
            <span className="text-sm text-gray-900 font-medium">{formatDate(data.whois_cert.creation_date)}</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Age</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">{data.whois_cert.domain_age} days</span>
            <div className="text-xs text-gray-500">{Math.floor(data.whois_cert.domain_age / 365)} years</div>
          </div>
        </div>
      </div>

      {/* Legal Pages Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 p-2 rounded-lg mr-3">
            <FileText className="h-5 w-5 text-yellow-600" />
          </div>
          <h5 className="font-semibold text-gray-800">Legal Pages</h5>
        </div>

        {data.legal_pages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.legal_pages.map((page, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-900">{page}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No legal pages detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteDataResults;