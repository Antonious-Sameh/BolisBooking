import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import ExcelJS from "exceljs";

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
  "sec1-boys": "الصف الأول الثانوي (بنين)",
  "sec1-girls": "الصف الأول الثانوي (بنات)",
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
    const gradeOrder = {
      "الصف الأول الإعدادي (بنين)": 1,
      "الصف الأول الإعدادي (بنات)": 2,

      "الصف الثاني الإعدادي (بنين)": 3,
      "الصف الثاني الإعدادي (بنات)": 4,

      "الصف الثالث الإعدادي (بنين)": 5,
      "الصف الثالث الإعدادي (بنات)": 6,

      "الصف الأول الثانوي (بنين)": 7,
      "الصف الأول الثانوي (بنات)": 8,

      "الصف الثاني الثانوي (بنين)": 9,
      "الصف الثاني الثانوي (بنات)": 10,

      "الصف الثالث الثانوي (بنين)": 11,
      "الصف الثالث الثانوي (بنات)": 12,
    };

    const bookings = await Booking.find();

    bookings.sort((a, b) => {
      return (gradeOrder[a.grade] || 999) - (gradeOrder[b.grade] || 999);
    });
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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("الطلاب المسجلين", {
      views: [{ rightToLeft: true, state: "frozen", ySplit: 1 }],
    });

    // الأعمدة
    worksheet.columns = [
      { header: "رقم", key: "id", width: 8 },
      { header: "اسم الطالب", key: "studentName", width: 30 },
      { header: "رقم ولي الأمر", key: "guardianPhone", width: 20 },
      { header: "رقم الطالب", key: "studentPhone", width: 20 },
      { header: "المرحلة الدراسية", key: "stage", width: 18 },
      { header: "الصف الدراسي", key: "grade", width: 35 },
      { header: "تاريخ التسجيل", key: "createdAt", width: 18 },
    ];

    // إضافة البيانات
    bookings.forEach((b, index) => {
      worksheet.addRow({
        id: index + 1,
        studentName: b.studentName,
        guardianPhone: b.guardianPhone,
        studentPhone: b.studentPhone || "-",
        stage: b.stage,
        grade: b.grade,
        createdAt: new Date(b.createdAt).toLocaleDateString("ar-EG"),
      });
    });

    // تنسيق صف العناوين
    const headerRow = worksheet.getRow(1);

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        size: 13,
        color: { argb: "FFFFFF" },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4472C4" },
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // تنسيق باقي الصفوف
    worksheet.eachRow((row, rowNumber) => {
  if (rowNumber === 1) return;

  row.height = 25;

  let color = "FFFFFF";

  const grade = row.getCell(6).value;

  switch (grade) {
    case "الصف الأول الإعدادي (بنين)":
    case "الصف الأول الإعدادي (بنات)":
      color = "EAF2FF";
      break;

    case "الصف الثاني الإعدادي (بنين)":
    case "الصف الثاني الإعدادي (بنات)":
      color = "FFF9DB";
      break;

    case "الصف الثالث الإعدادي (بنين)":
    case "الصف الثالث الإعدادي (بنات)":
      color = "FFE8CC";
      break;

    case "الصف الأول الثانوي (بنين)":
    case "الصف الأول الثانوي (بنات)":
      color = "D3F9D8";
      break;

    case "الصف الثاني الثانوي (بنين)":
    case "الصف الثاني الثانوي (بنات)":
      color = "E3FAFC";
      break;

    case "الصف الثالث الثانوي (بنين)":
    case "الصف الثالث الثانوي (بنات)":
      color = "F3D9FA";
      break;
  }

  row.eachCell((cell) => {
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.border = {
      top: { style: "thin", color: { argb: "D9D9D9" } },
      bottom: { style: "thin", color: { argb: "D9D9D9" } },
      left: { style: "thin", color: { argb: "D9D9D9" } },
      right: { style: "thin", color: { argb: "D9D9D9" } },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: color },
    };
  });
});

    // فلتر تلقائي
    worksheet.autoFilter = {
      from: "A1",
      to: "G1",
    };

    const today = new Date().toISOString().split("T")[0];

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Bolis_Students_${today}.xlsx`,
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error("Error exporting data:", error);

    res.status(500).json({
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
