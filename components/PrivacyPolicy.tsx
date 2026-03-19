import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC<{ onClose?: () => void }> = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      {/* Header with back button */}
      <div className="sticky top-0 bg-gray-950 border-b border-gray-900 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">PRIVACY POLICY</h1>
            <p className="text-gray-400">Last updated <strong>February 13, 2026</strong></p>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <p className="text-gray-300 leading-relaxed">
              This Privacy Notice for <strong>Chris Huang</strong> ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
            </p>

            <ul className="list-disc list-inside space-y-2 mt-4 text-gray-400">
              <li>Visit our website at <a href="https://chrishuangcf.github.io/raw2hdr-hm/" className="text-blue-400 hover:text-blue-300">https://chrishuangcf.github.io/raw2hdr-hm/</a> or any website of ours that links to this Privacy Notice</li>
              <li>Download and use our mobile application (Raw2HDR) or any other application of ours that links to this Privacy Notice</li>
              <li>Use Raw2HDR. Convert RAW photos to brilliant 10-bit HDR images with professional editing tools</li>
              <li>Engage with us in other related ways, including any marketing or events</li>
            </ul>
          </div>

          <div className="pt-6">
            <p className="text-gray-300 leading-relaxed">
              <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:photodesignch@gmail.com" className="text-blue-400 hover:text-blue-300">photodesignch@gmail.com</a>.
            </p>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">SUMMARY OF KEY POINTS</h2>
            <p className="text-gray-400 mb-4">
              This summary provides key points from our Privacy Notice to help you understand your privacy rights and our data practices.
            </p>

            <div className="space-y-4">
              <div>
                <p className="font-semibold text-white">What personal information do we process?</p>
                <p className="text-gray-400">When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</p>
              </div>

              <div>
                <p className="font-semibold text-white">Do we process any sensitive personal information?</p>
                <p className="text-gray-400">We do not process sensitive personal information.</p>
              </div>

              <div>
                <p className="font-semibold text-white">Do we collect any information from third parties?</p>
                <p className="text-gray-400">We do not collect any information from third parties.</p>
              </div>

              <div>
                <p className="font-semibold text-white">How do we process your information?</p>
                <p className="text-gray-400">We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</p>
              </div>

              <div>
                <p className="font-semibold text-white">How do we keep your information safe?</p>
                <p className="text-gray-400">We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>
              </div>

              <div>
                <p className="font-semibold text-white">What are your rights?</p>
                <p className="text-gray-400">Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. These rights may include the right to request access, rectification, or erasure of your data.</p>
              </div>

              <div>
                <p className="font-semibold text-white">How do you exercise your rights?</p>
                <p className="text-gray-400">You can exercise your rights by contacting us at <a href="mailto:photodesignch@gmail.com" className="text-blue-400 hover:text-blue-300">photodesignch@gmail.com</a>. We will consider and act upon any request in accordance with applicable data protection laws.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">CONTACT US</h2>
            <p className="text-gray-400 mb-4">
              If you have questions or comments about this Privacy Notice, you may email us at:
            </p>
            <div className="bg-gray-900 p-4 rounded border border-gray-800">
              <p className="font-semibold text-white">Chris Huang</p>
              <p className="text-gray-400">9215 C Roosevelt Way NE</p>
              <p className="text-gray-400">Seattle, WA 98115</p>
              <p className="text-gray-400">United States</p>
              <p className="text-blue-400 mt-2">
                <a href="mailto:photodesignch@gmail.com" className="hover:text-blue-300">photodesignch@gmail.com</a>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-sm text-gray-500">
            <p>This Privacy Policy was created using Termly's <a href="https://termly.io/products/privacy-policy-generator/" className="text-blue-400 hover:text-blue-300">Privacy Policy Generator</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
