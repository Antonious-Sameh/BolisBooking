import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  School,
  Search,
  Trash2,
  LogOut,
  Download,
  Calendar,
  Phone,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import StatCard from "@/components/StatCard.jsx";
import AnimatedSection from "@/components/AnimatedSection.jsx";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [students, setStudents] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      const data = await response.json();
      if (response.ok && data.success) {
        const mapped = data.bookings.map((b) => ({
          id: b._id,
          name: b.studentName,
          guardianPhone: b.guardianPhone,
          studentPhone: b.studentPhone,
          stage: b.stage,
          grade: b.grade,
          registrationDate: new Date(b.createdAt).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
        }));
        setStudents(mapped);
      } else {
        toast.error(data.message || "حدث خطأ أثناء جلب الحجوزات");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("فشل الاتصال بالسيرفر لجلب الحجوزات");
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth !== "true") {
      toast.error("يرجى تسجيل الدخول أولاً للوصول للوحة التحكم");
      navigate("/teacher-login");
    } else {
      fetchBookings();
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        toast.success("تم حذف سجل الطالب بنجاح");
      } else {
        toast.error(data.message || "فشل حذف السجل");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("فشل الاتصال بالسيرفر لحذف السجل");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.info("تم تسجيل الخروج");
    navigate("/");
  };

  const handleExport = () => {
    toast.success("جاري تصدير البيانات...");
    window.location.href = "/api/bookings/export";
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.includes(searchQuery) ||
      student.guardianPhone.includes(searchQuery);
    const matchesStage = stageFilter === "all" || student.grade === stageFilter;
    return matchesSearch && matchesStage;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const totalStudents = students.length;
  const prepStudents = students.filter((s) => s.stage === "إعدادي").length;
  const secondaryStudents = students.filter((s) => s.stage === "ثانوي").length;

  return (
    <div className="min-h-screen bg-muted/40 pb-12">
      <Helmet>
        <title>لوحة التحكم | الأستاذ بولس عبدالمسيح</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Top Navbar */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-['Alexandria'] truncate">
              نظام إدارة الطلاب
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4 ml-2" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
            <span className="sm:hidden">خروج</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Welcome Section */}
        <AnimatedSection>
          <div className="mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              مرحباً بك، أستاذ بولس
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg">
              نظرة عامة على الإحصائيات وسجلات الطلاب المحجوزين.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
            <StatCard
              title="إجمالي الطلاب"
              value={totalStudents}
              icon={Users}
              delay={0.1}
            />
            <StatCard
              title="طلاب المرحلة الإعدادية"
              value={prepStudents}
              icon={School}
              delay={0.2}
            />
            <StatCard
              title="طلاب المرحلة الثانوية"
              value={secondaryStudents}
              icon={GraduationCap}
              delay={0.3}
            />
          </div>
        </AnimatedSection>

        {/* Main Section */}
        <AnimatedSection delay={0.4}>
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            
            {/* Control Bar (Search, Filter, Export) */}
            <div className="p-4 sm:p-6 border-b border-border bg-muted/20 flex flex-col gap-4">
              <h3 className="text-lg sm:text-xl font-bold">سجل الحجوزات</h3>

              <div className="grid grid-cols-1 sm:flex sm:flex-row w-full gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="بحث بالاسم أو الهاتف..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 bg-background"
                  />
                </div>
                
                <div className="w-full sm:w-72">
                  <Select value={stageFilter} onValueChange={setStageFilter}>
                    <SelectTrigger className="w-full bg-white border shadow-sm">
                      <SelectValue placeholder="تصفية بالصف الدراسي" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-xl max-h-60 overflow-y-auto">
                      <SelectItem value="all">جميع المراحل</SelectItem>
                      <SelectItem value="الصف الأول الإعدادي (بنين)">الصف الأول الإعدادي (بنين)</SelectItem>
                      <SelectItem value="الصف الأول الإعدادي (بنات)">الصف الأول الإعدادي (بنات)</SelectItem>
                      <SelectItem value="الصف الثاني الإعدادي (بنين)">الصف الثاني الإعدادي (بنين)</SelectItem>
                      <SelectItem value="الصف الثاني الإعدادي (بنات)">الصف الثاني الإعدادي (بنات)</SelectItem>
                      <SelectItem value="الصف الثالث الإعدادي (بنين)">الصف الثالث الإعدادي (بنين)</SelectItem>
                      <SelectItem value="الصف الثالث الإعدادي (بنات)">الصف الثالث الإعدادي (بنات)</SelectItem>
                      <SelectItem value="الصف الأول الثانوي (بنين)">الصف الأول الثانوي (بنين)</SelectItem>
                      <SelectItem value="الصف الأول الثانوي (بنات)">الصف الأول الثانوي (بنات)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full sm:w-auto sm:margin-right-auto"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4 ml-2" />
                  تصدير لإكسيل
                </Button>
              </div>
            </div>

            {/* --- الطلاب: طريقة العرض المتكيفة --- */}
            
            {/* 1. عرض الكمبيوتر والتابلت (Desktop Table) - يظهر من شاشات md فما فوق */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-right font-bold py-4 whitespace-nowrap">اسم الطالب</TableHead>
                    <TableHead className="text-right font-bold py-4 whitespace-nowrap">رقم ولي الأمر</TableHead>
                    <TableHead className="text-right font-bold py-4 whitespace-nowrap">المرحلة</TableHead>
                    <TableHead className="text-right font-bold py-4 whitespace-nowrap">الصف الدراسي</TableHead>
                    <TableHead className="text-right font-bold py-4 whitespace-nowrap">تاريخ التسجيل</TableHead>
                    <TableHead className="text-center font-bold py-4 whitespace-nowrap">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="font-semibold whitespace-nowrap">{student.name}</TableCell>
                        <TableCell className="font-mono text-sm whitespace-nowrap">{student.guardianPhone}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            student.stage === "إعدادي"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}>
                            {student.stage}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{student.grade}</TableCell>
                        <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{student.registrationDate}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          <DeleteDialog student={student} onDelete={handleDelete} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 2. عرض الموبايل (Mobile Cards View) - يختفي في الشاشات الكبيرة */}
            <div className="block md:hidden divide-y divide-border bg-background">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <div key={student.id} className="p-4 border-b border-border hover:bg-muted/5 transition-colors space-y-3">
                    
                    {/* السطر الأول: الاسم + زر الحذف */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-foreground text-base max-w-[80%] break-words">
                        {student.name}
                      </div>
                      <div className="shrink-0">
                        <DeleteDialog student={student} onDelete={handleDelete} />
                      </div>
                    </div>

                    {/* السطر الثاني: المرحلة والصف */}
                    <div className="flex flex-wrap gap-2 items-center text-xs">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                        student.stage === "إعدادي"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}>
                        {student.stage}
                      </span>
                      <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {student.grade}
                      </span>
                    </div>

                    {/* السطر الثالث: التلفون والتاريخ */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5 bg-muted/40 p-2 rounded-lg">
                        <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="font-mono select-all text-[13px]">{student.guardianPhone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted/40 p-2 rounded-lg justify-end">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{student.registrationDate}</span>
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div className="border-b border-border"><EmptyState /></div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
                <p className="text-sm text-muted-foreground hidden sm:block">
                  عرض {paginatedStudents.length} من أصل {filteredStudents.length} سجل
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="w-24 text-xs sm:text-sm"
                  >
                    السابق
                  </Button>
                  <span className="text-sm font-medium px-3 whitespace-nowrap">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="w-24 text-xs sm:text-sm"
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
};

/* مكون فرعي مستقل لزر الحذف لتفادي تكرار الكود */
const DeleteDialog = ({ student, onDelete }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full w-9 h-9 shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent className="w-[90vw] max-w-md rounded-2xl">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-right">تأكيد حذف السجل</AlertDialogTitle>
        <AlertDialogDescription className="text-right mt-2">
          هل أنت متأكد من رغبتك في حذف الطالب{" "}
          <span className="font-bold text-foreground">{student.name}</span>{" "}
          نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
        <AlertDialogCancel className="mt-0 rounded-xl">إلغاء</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => onDelete(student.id)}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
        >
          نعم، احذف السجل
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

/* مكون فرعي للحالة الفارغة */
const EmptyState = () => (
  <div className="text-center py-12 sm:py-16 w-full">
    <div className="flex flex-col items-center gap-3">
      <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center">
        <Search className="w-7 h-7 text-muted-foreground/50" />
      </div>
      <div className="space-y-1 px-4">
        <p className="text-base sm:text-lg font-medium">لم يتم العثور على نتائج</p>
        <p className="text-muted-foreground text-xs sm:text-sm">
          جرب تغيير كلمات البحث أو معايير التصفية
        </p>
      </div>
    </div>
  </div>
);

export default DashboardPage;