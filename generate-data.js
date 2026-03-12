import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const departmentsSeed = [
  { id: 'DEP01', name: 'Phòng IT', budget: 250000000 },
  { id: 'DEP02', name: 'Phòng Nhân sự', budget: 120000000 },
  { id: 'DEP03', name: 'Phòng Marketing', budget: 180000000 },
  { id: 'DEP04', name: 'Phòng Kế toán', budget: 150000000 },
  { id: 'DEP05', name: 'Phòng Kinh doanh', budget: 300000000 },
  { id: 'DEP06', name: 'Phòng Chăm sóc khách hàng', budget: 140000000 }
]

const positionsByDepartment = {
  'Phòng IT': ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'QA Tester', 'System Admin'],
  'Phòng Nhân sự': ['HR Executive', 'Recruiter', 'C&B Specialist', 'HR Manager'],
  'Phòng Marketing': ['Content Marketing', 'Digital Marketing', 'Designer', 'Marketing Executive'],
  'Phòng Kế toán': ['Kế toán viên', 'Kế toán tổng hợp', 'Kế toán trưởng'],
  'Phòng Kinh doanh': ['Sales Executive', 'Sales Manager', 'Business Development'],
  'Phòng Chăm sóc khách hàng': ['CSKH Executive', 'Call Center Agent', 'Customer Support Lead']
}

const cities = [
  'TP.HCM',
  'Hà Nội',
  'Đà Nẵng',
  'Cần Thơ',
  'Biên Hòa',
  'Thủ Đức',
  'Bình Dương',
  'Vũng Tàu'
]

const lastNames = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh',
  'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ'
]

const middleNamesMale = [
  'Minh', 'Quốc', 'Hoàng', 'Thanh', 'Đức', 'Gia', 'Hữu', 'Anh'
]

const middleNamesFemale = [
  'Thị', 'Ngọc', 'Thu', 'Phương', 'Thanh', 'Khánh', 'Mỹ', 'Bảo'
]

const firstNamesMale = [
  'Tuấn', 'Nam', 'Dũng', 'Khang', 'Long', 'Phúc', 'Bảo', 'Khánh',
  'Sơn', 'Huy', 'Đạt', 'Hiếu', 'Tùng', 'Anh'
]

const firstNamesFemale = [
  'Linh', 'Hà', 'Mai', 'Lan', 'Vy', 'Nhi', 'Trang', 'Thảo',
  'Ngân', 'Yến', 'Hương', 'Quỳnh', 'Chi', 'An'
]

const employeeStatuses = [
  'Đang làm việc',
  'Đang làm việc',
  'Đang làm việc',
  'Đang làm việc',
  'Tạm nghỉ',
  'Nghỉ việc'
]

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomGender() {
  return Math.random() < 0.5 ? 'Nam' : 'Nữ'
}

function randomPhone(index) {
  const prefix = ['032', '033', '034', '035', '036', '037', '038', '039', '070', '076', '077', '078', '079', '081', '082', '083', '084', '085', '086', '088', '089', '090', '091', '093', '094', '096', '097', '098', '099']
  return `${randomItem(prefix)}${String(1000000 + index).padStart(7, '0').slice(0, 7)}`
}

function removeVietnamese(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

function slugify(str) {
  return removeVietnamese(str)
    .toLowerCase()
    .replace(/\s+/g, '')
}

function randomDate(startDate, endDate) {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const date = new Date(start + Math.random() * (end - start))
  return date.toISOString().split('T')[0]
}

function randomJoinDate() {
  return randomDate('2020-01-01', '2026-03-01')
}

function randomBirthDate() {
  return randomDate('1985-01-01', '2003-12-31')
}

function createName(gender) {
  const lastName = randomItem(lastNames)

  if (gender === 'Nam') {
    return `${lastName} ${randomItem(middleNamesMale)} ${randomItem(firstNamesMale)}`
  }

  return `${lastName} ${randomItem(middleNamesFemale)} ${randomItem(firstNamesFemale)}`
}

function createEmployee(i) {
  const gender = randomGender()
  const name = createName(gender)
  const department = randomItem(departmentsSeed)
  const emailBase = slugify(name)
  const position = randomItem(positionsByDepartment[department.name])

  return {
    id: i,
    employeeCode: `EMP${String(i).padStart(4, '0')}`,
    name,
    gender,
    dateOfBirth: randomBirthDate(),
    email: `${emailBase}${i}@company.com`,
    phone: randomPhone(i),
    address: randomItem(cities),
    departmentId: department.id,
    department: department.name,
    position,
    status: randomItem(employeeStatuses),
    joinDate: randomJoinDate(),
    avatar: '/images/avatar.png'
  }
}

function generateEmployees(count = 1000) {
  return Array.from({ length: count }, (_, index) => createEmployee(index + 1))
}

function generateDepartments(employees) {
  return departmentsSeed.map((dept) => {
    const employeesInDept = employees.filter(emp => emp.departmentId === dept.id)
    const manager = employeesInDept.length ? employeesInDept[0].name : 'Chưa cập nhật'

    return {
      ...dept,
      manager,
      employeeCount: employeesInDept.length,
      description: `Quản lý hoạt động của ${dept.name.toLowerCase()}`
    }
  })
}

function writeJson(outputDir, fileName, data) {
  fs.writeFileSync(
    path.join(outputDir, fileName),
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}

function main() {
  const employees = generateEmployees(1000)
  const departments = generateDepartments(employees)

  const outputDir = path.join(__dirname, 'public', 'data')

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  writeJson(outputDir, 'employees.json', employees)
  writeJson(outputDir, 'departments.json', departments)

  console.log('Đã tạo xong dữ liệu nhân viên và phòng ban trong public/data')
  console.log('- employees.json')
  console.log('- departments.json')
}

main()