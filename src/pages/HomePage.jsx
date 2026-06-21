import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  ClipboardCheck,
  FileText,
  UserCheck,
  Home,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import WhyChooseCard from "@/components/WhyChooseCard.jsx";
import TimelineStep from "@/components/TimelineStep.jsx";
import FormInput from "@/components/FormInput.jsx";
import FormSelect from "@/components/FormSelect.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import TypingEffect from "@/components/TypingEffect.jsx";
import AnimatedSection from "@/components/AnimatedSection.jsx";

const HomePage = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    guardianPhone: "",
    studentPhone: "",
    stage: "",
    grade: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const whyChooseData = [
    {
      icon: BookOpen,
      title: "شرح مبسط وسهل",
      description:
        "أسلوب تدريس مبتكر يجعل المادة سهلة الفهم والاستيعاب لجميع مستويات الطلاب.",
    },
    {
      icon: Users,
      title: "متابعة مستمرة",
      description:
        "متابعة دقيقة لمستوى كل طالب وتقديم الدعم اللازم لتحسين الأداء بشكل دوري.",
    },
    {
      icon: ClipboardCheck,
      title: "اختبارات دورية",
      description:
        "اختبارات منتظمة أسبوعية وشهرية لقياس مستوى الفهم والاستعداد للامتحانات.",
    },
    {
      icon: FileText,
      title: "مراجعات شاملة",
      description:
        "مراجعات نهائية مكثفة قبل الامتحانات تغطي المنهج بالكامل لضمان التفوق.",
    },
    {
      icon: UserCheck,
      title: "الاهتمام بمستوى كل طالب",
      description:
        "رعاية خاصة لكل طالب وتقديم الدعم الفردي بناءً على نقاط القوة والضعف.",
    },
    {
      icon: Home,
      title: "بيئة تعليمية مناسبة",
      description:
        "توفير بيئة تعليمية محفزة ومريحة ومجهزة بأحدث الوسائل التي تساعد على التركيز.",
    },
  ];

  const timelineSteps = [
    {
      number: "1",
      title: "املأ البيانات الأساسية",
      description: "قم بإدخال اسم الطالب ورقم هاتف ولي الأمر للتواصل.",
    },
    {
      number: "2",
      title: "حدد المرحلة الدراسية",
      description:
        "اختر المرحلة المناسبة (إعدادي أو ثانوي) لتحديد المواعيد المتاحة.",
    },
    {
      number: "3",
      title: "اختر الصف الدراسي",
      description: "حدد الصف الدراسي الدقيق الخاص بالطالب.",
    },
    {
      number: "4",
      title: "تأكيد الحجز",
      description: "راجع البيانات المدخلة وتأكد من صحتها ثم اضغط لتأكيد الحجز.",
    },
    {
      number: "5",
      title: "التواصل والمتابعة",
      description:
        "سيقوم فريق العمل بالتواصل معك هاتفياً لتأكيد المواعيد النهائية.",
    },
  ];

  const stageOptions = [
    { value: "prep", label: "المرحلة الإعدادية" },
    { value: "secondary", label: "المرحلة الثانوية" },
  ];

  const prepGrades = [
    { value: "prep1-boys", label: "الصف الأول الإعدادي (بنين)" },
    { value: "prep1-girls", label: "الصف الأول الإعدادي (بنات)" },
    { value: "prep2-boys", label: "الصف الثاني الإعدادي (بنين)" },
    { value: "prep2-girls", label: "الصف الثاني الإعدادي (بنات)" },
    { value: "prep3-boys", label: "الصف الثالث الإعدادي (بنين)" },
    { value: "prep3-girls", label: "الصف الثالث الإعدادي (بنات)" },
  ];

  const secondaryGrades = [
  { value: "sec1-boys", label: "الصف الأول الثانوي (بنين)" },
  { value: "sec1-girls", label: "الصف الأول الثانوي (بنات)" },
];

  const gradeOptions =
    formData.stage === "prep"
      ? prepGrades
      : formData.stage === "secondary"
        ? secondaryGrades
        : [];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "stage" && { grade: "" }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowSuccess(true);
        toast.success("تم إرسال طلب الحجز بنجاح");
        setTimeout(() => {
          setFormData({
            studentName: "",
            guardianPhone: "",
            studentPhone: "",
            stage: "",
            grade: "",
          });
          setShowSuccess(false);
        }, 4000);
      } else {
        toast.error(data.message || "حدث خطأ أثناء إرسال طلب الحجز");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("فشل الاتصال بالسيرفر، يرجى التأكد من تشغيل الـ Backend");
    }
  };

  const scrollToBooking = () => {
    document
      .getElementById("booking-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>الأستاذ بولس عبدالمسيح - مدرس الدراسات الاجتماعية والتاريخ</title>
        <meta
          name="description"
          content="خبرة في تدريس الدراسات الاجتماعية بأسلوب مبسط ومتابعة مستمرة للطلاب لتحقيق أفضل النتائج"
        />
      </Helmet>

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
<section className="relative min-h-[90dvh] flex items-center bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-secondary-foreground overflow-hidden py-20">
  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      
      {/* النصوص والأزرار */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="order-2 lg:order-1"
      >
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
          <span className="text-primary-foreground font-medium text-sm">التميز في الدراسات الاجتماعية</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.2] text-balance">
          <TypingEffect text="الأستاذ بولس عبدالمسيح" speed={70} />
        </h1>
        
        <p className="text-2xl md:text-3xl font-semibold text-primary mb-6">
          مدرس الدراسات الاجتماعية والتاريخ
        </p>
        
        <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-prose text-secondary-foreground/80">
          نقدم خبرة متميزة في تدريس مادة الدراسات الاجتماعية بأسلوب علمي مبسط، مع التركيز على الفهم العميق والمتابعة الدورية للوصول بالطلاب لأعلى مستويات التفوق.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 mb-10">
          <Button
            size="lg"
            onClick={scrollToBooking}
            className="h-14 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 text-lg px-8 rounded-full font-bold"
          >
            احجز الآن
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="h-14 border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white shadow-lg hover:-translate-y-1 transition-all duration-300 text-lg px-8 rounded-full"
          >
            <a href="https://wa.me/201288948585" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="ml-2 w-5 h-5 text-[hsl(var(--whatsapp))]" />
              تواصل معنا للاستفسار
            </a>
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          {['شرح وافي', 'متابعة دقيقة', 'نتائج متميزة'].map((badge, index) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/5"
            >
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-white/90">{badge}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 👇 تعديل حاوية الصورة لتبدو رشيقة، مودرن، وفخمة جداً 👇 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
        transition={{ 
          opacity: { duration: 0.8 },
          scale: { duration: 0.8 },
          y: { repeat: Infinity, duration: 5, ease: "easeInOut" } 
        }}
        className="order-1 lg:order-2 relative flex justify-center items-center"
      >
        {/* حلفية متوهجة ناعمة خلف الصورة المودرن */}
        <div className="absolute w-[80%] h-[80%] bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse duration-4000"></div>
        
        {/* إطار الصورة الفخم المفرغ بحواف هندسية ناعمة */}
        <div className="relative p-3 rounded-[40px_140px_40px_140px] border-2 border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl max-w-[340px] md:max-w-[380px] w-full aspect-square overflow-hidden group">
          <div className="w-full h-full rounded-[30px_130px_30px_130px] overflow-hidden inner-shadow">
            <img
              src="/bolis.jpeg"
              alt="الأستاذ بولس عبدالمسيح"
              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
            />
            {/* طبقة تدرج لوني خفيفة مريحة لأسفل الصورة */}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent"></div>
          </div>
        </div>
        
        {/* عناصر ديكورية طائرة لإعطاء روح للموقع التعليمي */}
        <div className="absolute -bottom-4 -left-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-xl text-white text-xs font-bold pointer-events-none hidden sm:block">
          🎓 خبرة وتميز
        </div>
      </motion.div>

    </div>
  </div>
</section>

        {/* Features Section */}
        <AnimatedSection className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                لماذا تختار الأستاذ بولس؟
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                نلتزم بتقديم تجربة تعليمية استثنائية ترتكز على الفهم العميق
                والمتابعة المستمرة لتحقيق أهداف أبنائنا الطلاب.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseData.map((item, index) => (
                <WhyChooseCard
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Timeline Section */}
        <AnimatedSection className="py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                خطوات الحجز والانضمام
              </h2>
              <p className="text-lg text-muted-foreground">
                عملية تسجيل مبسطة لضمان مقعدك بكل سهولة
              </p>
            </div>

            <div className="relative border-r-2 border-muted pr-8 space-y-12 mr-4 md:mr-0">
              {timelineSteps.map((step, index) => (
                <TimelineStep
                  key={index}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Booking Form Section */}
        <AnimatedSection id="booking-form" className="py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                استمارة الحجز الإلكتروني
              </h2>
              <p className="text-lg text-muted-foreground">
                يرجى إدخال البيانات بدقة لسهولة التواصل والمتابعة
              </p>
            </div>

            {/* 👇 هذا هو الكارت الذي تم تطويره جمالياً ليصبح بارزاً ومريحاً بصرياً 👇 */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100/80 relative overflow-hidden backdrop-blur-md">
              {/* شريط جمالي علوي متناسق مع هوية الأستاذ بولس */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary/60 via-primary to-primary/60"></div>

              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    تم استلام طلبك بنجاح!
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    شكراً لثقتكم بنا. سيقوم فريق المتابعة بالتواصل معكم قريباً
                    على رقم الهاتف المسجل لتأكيد الحجز.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <FormInput
                        label="اسم الطالب ثلاثي"
                        id="studentName"
                        value={formData.studentName}
                        onChange={(e) =>
                          handleInputChange("studentName", e.target.value)
                        }
                        placeholder="أدخل اسم الطالب كاملاً"
                        required
                      />
                    </div>

                    <FormInput
                      label="رقم هاتف ولي الأمر (للمتابعة)"
                      id="guardianPhone"
                      type="tel"
                      value={formData.guardianPhone}
                      onChange={(e) =>
                        handleInputChange("guardianPhone", e.target.value)
                      }
                      placeholder="مثال: 01xxxxxxxxx"
                      required
                    />

                    <FormInput
                      label="رقم هاتف الطالب (اختياري)"
                      id="studentPhone"
                      type="tel"
                      value={formData.studentPhone}
                      onChange={(e) =>
                        handleInputChange("studentPhone", e.target.value)
                      }
                      placeholder="مثال: 01xxxxxxxxx"
                    />

                    <FormSelect
                      label="المرحلة الدراسية"
                      id="stage"
                      value={formData.stage}
                      onChange={(value) => handleInputChange("stage", value)}
                      options={stageOptions}
                      placeholder="اختر المرحلة الدراسية"
                      required
                    />

                    {formData.stage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="overflow-hidden md:col-span-2"
                      >
                        <FormSelect
                          label="الصف الدراسي والفصل"
                          id="grade"
                          value={formData.grade}
                          onChange={(value) =>
                            handleInputChange("grade", value)
                          }
                          options={gradeOptions}
                          placeholder="حدد الصف الدراسي"
                          required
                        />
                      </motion.div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-xl font-bold rounded-xl mt-8"
                  >
                    تأكيد الحجز وإرسال الطلب
                  </Button>
                </form>
              )}
            </div>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
