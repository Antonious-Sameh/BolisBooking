import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import FormInput from '@/components/FormInput.jsx';
import AnimatedSection from '@/components/AnimatedSection.jsx';

const TeacherLoginPage = () => {
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('تم التحقق بنجاح، جاري التحويل...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast.error(data.message || 'كود الدخول غير صحيح، يرجى المحاولة مرة أخرى.');
        setAccessCode('');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('فشل الاتصال بالسيرفر، يرجى التأكد من تشغيل الـ Backend');
    }
  };

  return (
    <>
      <Helmet>
        <title>بوابة الدخول - الأستاذ بولس عبدالمسيح</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted via-background to-muted p-4">
        <AnimatedSection className="w-full max-w-md">
          <div className="bg-card rounded-3xl shadow-2xl p-10 border border-border/50">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <LockKeyhole className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3 font-['Alexandria']">
                لوحة الإدارة
              </h1>
              <p className="text-muted-foreground text-sm">
                الرجاء إدخال كود الدخول السري للمتابعة
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <FormInput
                  label="كود الدخول"
                  id="accessCode"
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="أدخل الكود هنا..."
                  required
                  className="text-center text-lg tracking-widest h-14"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-lg font-bold rounded-xl"
              >
                تسجيل الدخول
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <Button 
                variant="link" 
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </>
  );
};

export default TeacherLoginPage;