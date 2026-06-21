import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import xlsx from "xlsx";

dotenv.config();

console.log(process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Booking Schema & Model
const bookingSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  studentPhone: { type: String, default: "" },
  stage: { type: String, required: true },
  grade: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

// Mappings for Arabic labels
const STAGE_MAP = {
  prep: "إعدادي",
  secondary: "ثانوي",
};

const GRADE_MAP = {
  "prep1-boys": "الصف الأول الإعدادي (بنين)",
  "prep1-girls": "الصف الأول الإعدادي (بنات)",
  "prep2-boys": "الصف الثاني الإعدادي (بنين)",
  "prep2-girls": "الصف الثاني الإعدادي (بنات)",
  "prep3-boys": "الصف الثالث الإعدادي (بنين)",
  "prep3-girls": "الصف الثالث الإعدادي (بنات)",
  sec1: "الصف الأول الثانوي",
  sec2: "الصف الثاني الثانوي",
  sec3: "الصف الثالث الثانوي",
};

// Endpoints

// A - Booking API (POST /api/bookings)
app.post("/api/bookings", async (req, res) => {
  try {
    const { studentName, guardianPhone, studentPhone, stage, grade } = req.body;

    if (!studentName || !guardianPhone || !stage || !grade) {
      return res
        .status(400)
        .json({ success: false, message: "يرجى ملء جميع الحقول المطلوبة" });
    }

    // Convert keys to Arabic labels for direct storage
    const arabicStage = STAGE_MAP[stage] || stage;
    const arabicGrade = GRADE_MAP[grade] || grade;

    const newBooking = new Booking({
      studentName,
      guardianPhone,
      studentPhone: studentPhone || "",
      stage: arabicStage,
      grade: arabicGrade,
    });

    await newBooking.save();
    return res
      .status(201)
      .json({ success: true, message: "تم حفظ الحجز بنجاح" });
  } catch (error) {
    console.error("Error saving booking:", error);
    return res
      .status(500)
      .json({ success: false, message: "حدث خطأ في السيرفر أثناء حفظ الحجز" });
  }
});

// B - Get Bookings (GET /api/bookings)
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res
      .status(500)
      .json({ success: false, message: "حدث خطأ أثناء جلب البيانات" });
  }
});

// C - Delete Booking (DELETE /api/bookings/:id)
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "لم يتم العثور على الحجز المحدد" });
    }
    return res
      .status(200)
      .json({ success: true, message: "تم حذف سجل الحجز بنجاح" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return res
      .status(500)
      .json({ success: false, message: "حدث خطأ أثناء حذف الحجز" });
  }
});

// D - Export Data to Excel (GET /api/bookings/export)
app.get("/api/bookings/export", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    const excelData = bookings.map((b, index) => ({
      رقم: index + 1,
      "اسم الطالب": b.studentName,
      "رقم ولي الأمر": b.guardianPhone,
      "رقم الطالب": b.studentPhone || "-",
      "المرحلة الدراسية": b.stage,
      "الصف الدراسي": b.grade,
      "تاريخ التسجيل": new Date(b.createdAt).toLocaleDateString("ar-EG"),
    }));

    const worksheet = xlsx.utils.json_to_sheet(excelData);

    // عرض الأعمدة
    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 18 },
      { wch: 35 },
      { wch: 15 },
    ];

    // جعل الورقة من اليمين لليسار
    worksheet["!dir"] = "rtl";

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "الطلاب المسجلين");

    const excelBuffer = xlsx.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Bolis_Students_Bookings.xlsx"
    );

    return res.status(200).send(excelBuffer);
  } catch (error) {
    console.error("Error exporting data:", error);

    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء تصدير البيانات",
    });
  }
});

// 3 - Simple Login (POST /api/login)
app.post("/api/login", (req, res) => {
  const { accessCode } = req.body;
  const expectedCode = process.env.ACCESS_CODE || "bolis2026";

  if (accessCode === expectedCode) {
    return res.status(200).json({ success: true, message: "success" });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "كود الدخول غير صحيح" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
