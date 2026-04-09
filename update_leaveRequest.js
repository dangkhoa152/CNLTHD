import fs from 'fs';
import path from 'path';

// ĐƯỜNG DẪN TỚI FILE DỮ LIỆU CỦA BẠN (Tùy chỉnh nếu dự án của bạn lưu ở chỗ khác)
const EMPLOYEES_FILE = path.resolve('./public/data/employees.json');
const LEAVES_FILE = path.resolve('./public/data/leave-request.json');

// 1. HÀM SINH DỮ LIỆU
const generateMockLeaveRequests = (actualEmployees, quantity = 100) => {
  if (!actualEmployees || actualEmployees.length === 0) return [];

  // Các mảng dữ liệu mẫu
  const leaveTypes = ["Nghỉ phép năm", "Nghỉ ốm", "Việc cá nhân", "Nghỉ không lương", "Khác"];
  const reasons = ["Khám sức khỏe", "Việc gia đình", "Đi du lịch", "Nghỉ ốm", "Giải quyết giấy tờ cá nhân"];
  const statuses = ["Đã duyệt", "Chờ duyệt", "Từ chối"];
  const rejectionReasonsList = [
    "Công việc đang nhiều, không đủ nhân sự backup", 
    "Dự án đang giai đoạn gấp rút", 
    "Đã hết số ngày nghỉ phép năm", 
    "Vui lòng sắp xếp lại thời gian nghỉ"
  ];

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const formatDate = (date) => date.toISOString().split('T')[0];
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const requests = [];

  for (let i = 1; i <= quantity; i++) {
    const emp = getRandomElement(actualEmployees);
    const currentDept = emp.history && emp.history.length > 0 ? emp.history[0].department : "Chưa cập nhật";

    // --- XỬ LÝ THỜI GIAN NỘP ĐƠN ---
    const today = new Date();
    const daysAgo = getRandomInt(1, 60);
    const createdAtDate = addDays(today, -daysAgo);
    // Gán ngẫu nhiên một giờ nộp đơn trong giờ hành chính (8h - 17h)
    createdAtDate.setHours(getRandomInt(8, 17), getRandomInt(0, 59));
    
    // --- XỬ LÝ THỜI GIAN NGHỈ ---
    const startOffset = getRandomInt(1, 14);
    const fromDateObj = addDays(createdAtDate, startOffset);
    
    const leaveDays = getRandomInt(1, 5);
    const toDateObj = addDays(fromDateObj, leaveDays - 1);

    // --- XỬ LÝ TRẠNG THÁI VÀ NGƯỜI DUYỆT ---
    const currentStatus = getRandomElement(statuses);
    let updatedAt = null;
    let approver = null;
    let rejectionReason = null;

    if (currentStatus !== "Chờ duyệt") {
      // Nếu đã xử lý, ngày cập nhật sẽ sau ngày nộp đơn từ 0 đến 2 ngày
      const updatedDate = addDays(createdAtDate, getRandomInt(0, 2));
      updatedDate.setHours(getRandomInt(8, 17), getRandomInt(0, 59));
      
      updatedAt = updatedDate.toISOString();
      approver = "Admin"; // Người duyệt mặc định

      if (currentStatus === "Từ chối") {
        rejectionReason = getRandomElement(rejectionReasonsList);
      }
    }

    requests.push({
      id: i,
      employeeName: emp.name,
      employeeCode: emp.employeeCode,
      department: currentDept,
      leaveType: getRandomElement(leaveTypes),
      fromDate: formatDate(fromDateObj),
      toDate: formatDate(toDateObj),
      days: leaveDays,
      reason: getRandomElement(reasons),
      status: currentStatus,
      approver: approver,
      rejectionReason: rejectionReason,
      createdAt: createdAtDate.toISOString(),
      updatedAt: updatedAt
    });
  }

  return requests;
};

// 2. THỰC THI SCRIPT
try {
  console.log("⏳ Đang đọc dữ liệu nhân viên từ:", EMPLOYEES_FILE);
  const rawData = fs.readFileSync(EMPLOYEES_FILE, 'utf-8');
  const employees = JSON.parse(rawData);

  console.log(`✅ Đã tìm thấy ${employees.length} nhân viên. Đang sinh dữ liệu đơn từ...`);
  const fakeLeaves = generateMockLeaveRequests(employees, 100); 

  console.log("⏳ Đang ghi vào file:", LEAVES_FILE);
  fs.writeFileSync(LEAVES_FILE, JSON.stringify(fakeLeaves, null, 2), 'utf-8');

  console.log(`🎉 HOÀN TẤT! Đã tạo thành công ${fakeLeaves.length} đơn xin nghỉ phép.`);
} catch (error) {
  console.error("❌ LỖI TRONG QUÁ TRÌNH TẠO DỮ LIỆU:", error.message);
}