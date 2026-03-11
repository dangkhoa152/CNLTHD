import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const departments = [
  {
    id: 'DEP01',
    name: 'Phòng IT',
    manager: 'Nguyễn Minh Tuấn',
    budget: 250000000
  },
  {
    id: 'DEP02',
    name: 'Phòng Nhân sự',
    manager: 'Trần Thu Hà',
    budget: 120000000
  },
  {
    id: 'DEP03',
    name: 'Phòng Marketing',
    manager: 'Lê Hoàng Nam',
    budget: 180000000
  },
  {
    id: 'DEP04',
    name: 'Phòng Kế toán',
    manager: 'Phạm Thị Mai',
    budget: 150000000
  },
  {
    id: 'DEP05',
    name: 'Phòng Kinh doanh',
    manager: 'Đỗ Quốc Bảo',
    budget: 300000000
  },
  {
    id: 'DEP06',
    name: 'Phòng Chăm sóc khách hàng',
    manager: 'Võ Ngọc Anh',
    budget: 140000000
  }
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

const statuses = ['Đang làm việc', 'Đang làm việc', 'Đang làm việc', 'Tạm nghỉ', 'Nghỉ việc']

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomGender() {
  return Math.random() < 0.5 ? 'Nam' : 'Nữ'
}

function randomPhone(index) {
  return `0${Math.floor(100000000 + index).toString().padStart(9, '0').slice(0, 9)}`
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

function randomJoinDate() {
  const start = new Date('2020-01-01').getTime()
  const end = new Date('2026-03-01').getTime()
  const date = new Date(start + Math.random() * (end - start))
  return date.toISOString().split('T')[0]
}

function createName(gender) {
  const lastName = randomItem(lastNames)

  if (gender === 'Nam') {
    return `${lastName} ${randomItem(middleNamesMale)} ${randomItem(firstNamesMale)}`
  }

  return `${lastName} ${randomItem(middleNamesFemale)} ${randomItem(firstNamesFemale)}`
}

function generateEmployees(count = 1000) {
  const employees = []

  for (let i = 1; i <= count; i++) {
    const gender = randomGender()
    const name = createName(gender)
    const department = randomItem(departments)

    const emailBase = slugify(name)
    const email = `${emailBase}${i}@company.com`

    employees.push({
      id: i,
      employeeCode: `EMP${String(i).padStart(4, '0')}`,
      name,
      gender,
      email,
      phone: randomPhone(i),
      department: department.name,
      status: randomItem(statuses),
      joinDate: randomJoinDate()
    })
  }

  return employees
}

function generateDepartmentsWithCount(employees) {
  return departments.map(dept => {
    const employeeCount = employees.filter(emp => emp.department === dept.name).length

    return {
      ...dept,
      employeeCount
    }
  })
}

function main() {
  const employees = generateEmployees(1000)
  const departmentData = generateDepartmentsWithCount(employees)

  const outputDir = path.join(__dirname, 'public', 'data')

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(
    path.join(outputDir, 'employees.json'),
    JSON.stringify(employees, null, 2),
    'utf-8'
  )

  fs.writeFileSync(
    path.join(outputDir, 'departments.json'),
    JSON.stringify(departmentData, null, 2),
    'utf-8'
  )

  console.log('Đã tạo xong employees.json và departments.json trong public/data')
}

main()