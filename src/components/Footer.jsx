import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react'; // استوردنا أيقونة Phone هنا

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2 font-['Alexandria']">
              الأستاذ بولس عبدالمسيح
            </h3>
            <p className="text-lg opacity-80 mb-2">
              مدرس الدراسات الاجتماعية
            </p>
            <a 
              href="https://wa.me/201288948585" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-xl font-medium text-primary hover:text-primary/80 transition-colors"
            >
              01288948585
              <MessageCircle className="w-5 h-5 mr-2" />
            </a>
          </div>
          
          <div className="w-24 h-px bg-secondary-foreground/20 mx-auto"></div>
          
          <div className="space-y-3 pt-4">
            <p className="text-sm opacity-90 flex items-center justify-center gap-1.5 flex-wrap">
              تم تصميم وتطوير الموقع بواسطة 
              <a 
                href="https://wa.me/201223307593" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-primary hover:underline underline-offset-4 mr-1 transition-all"
              >
                المهندس أنطونيوس سامح
              </a>
            </p>

            {/* 👇 الجزء الجديد المضاف لإظهار رقمك بشكل احترافي ومتناسق 👇 */}
            <div className="flex items-center justify-center gap-2 text-xs opacity-75 hover:opacity-100 transition-opacity">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>للتواصل :</span>
              <a 
                href="https://wa.me/201223307593" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary font-medium transition-colors"
              >
                01223307593
              </a>
            </div>

            <p className="text-xs opacity-60 pt-1">
              حقوق الموقع محفوظة © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;