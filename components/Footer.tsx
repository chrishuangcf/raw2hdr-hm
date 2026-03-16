import React from 'react';
import { Download, Shield, Smartphone, Camera } from 'lucide-react';
import { Button } from './Button';

const Footer: React.FC<{ onPrivacyPolicyClick?: () => void }> = ({ onPrivacyPolicyClick }) => {
  return (
    <footer className="bg-gray-950 border-t border-gray-900 pt-20 pb-10 px-4" id="download">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        
        <div className="mb-12 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Ready to see the light?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience your photos as your eyes originally saw them. 
            Download raw2hdr today.
          </p>
          
          <div className="flex justify-center pt-4">
             <Button 
               size="lg" 
               className="px-10 py-5 text-xl shadow-[0_0_40px_rgba(37,99,235,0.3)]"
               onClick={() => window.open('https://apps.apple.com/us/app/raw2hdr/id6758991441', '_blank')}
             >
                <Download className="mr-2 h-6 w-6" />
                Download on the App Store
             </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
             iOS 14.0+ · One-time purchase · No subscription · All processing on-device
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-gray-900 pt-12 mt-12 text-left">
          <div className="space-y-4">
            <h4 className="text-white font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Privacy First
            </h4>
            <p className="text-sm text-gray-500">
              No data collection. No internet required. All RAW processing runs entirely on-device using Apple's CIRAWFilter engine. Your photos never leave your iPhone.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              Supported RAW Formats
            </h4>
            <p className="text-sm text-gray-500">
              Fujifilm (.RAF) · Canon (.CR2, .CR3) · Sony (.ARW) · Panasonic (.RW2) · Olympus/OM (.ORF) · Leica (.DNG) · Universal DNG
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-500" />
              Where to View HDR
            </h4>
            <p className="text-sm text-gray-500">
              Best on iPhone 12 Pro and later (ProMotion OLED). Share directly to Instagram, Threads, and iMessage with HDR preserved. BT.2100 HLG format — backward compatible on any screen.
            </p>
          </div>
        </div>

        <div className="mt-16 text-gray-600 text-sm flex flex-col md:flex-row justify-between w-full items-center">
          <p>&copy; {new Date().getFullYear()} raw2hdr. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button 
              onClick={onPrivacyPolicyClick}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;