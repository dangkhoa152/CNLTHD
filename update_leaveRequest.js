import fs from 'fs';
import path from 'path';

// ĐƯỜNG DẪN TỚI FILE DỮ LIỆU CỦA BẠN (Tùy chỉnh nếu dự án của bạn lưu ở chỗ khác)
const EMPLOYEES_FILE = path.resolve('./public/data/employees.json');
const LEAVES_FILE = path.resolve('./public/data/leave-request.json');

// 1. HÀM SINH DỮ LIỆU (Giữ nguyên logic của chúng ta)
const generateMockLeaveRequests = (actualEmployees, quantity = 100) => {
  if (!actualEmployees || actualEmployees.length === 0) return [];

  const reasons = ["Khám sức khỏe", "Việc gia đình", "Đi du lịch", "Nghỉ ốm", "Giải quyết giấy tờ cá nhân"];
  const statuses = ["Đã duyệt", "Chờ duyệt", "Từ chối"];

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

    const today = new Date();
    const daysAgo = getRandomInt(1, 60);
    const createdAtDate = addDays(today, -daysAgo);
    
    const startOffset = getRandomInt(1, 14);
    const fromDateObj = addDays(createdAtDate, startOffset);
    
    const leaveDays = getRandomInt(1, 5);
    const toDateObj = addDays(fromDateObj, leaveDays - 1);

    requests.push({
      id: i,
      employeeName: emp.name,
      employeeCode: emp.employeeCode,
      department: currentDept,
      fromDate: formatDate(fromDateObj),
      toDate: formatDate(toDateObj),
      days: leaveDays,
      reason: getRandomElement(reasons),
      status: getRandomElement(statuses),
      createdAt: formatDate(createdAtDate)
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
  const fakeLeaves = generateMockLeaveRequests(employees, 100); // Thay đổi số 30 thành số lượng bạn muốn

  console.log("⏳ Đang ghi vào file:", LEAVES_FILE);
  fs.writeFileSync(LEAVES_FILE, JSON.stringify(fakeLeaves, null, 2), 'utf-8');

  console.log(`🎉 HOÀN TẤT! Đã tạo thành công ${fakeLeaves.length} đơn xin nghỉ phép.`);
} catch (error) {
  console.error("❌ LỖI TRONG QUÁ TRÌNH TẠO DỮ LIỆU:", error.message);
}