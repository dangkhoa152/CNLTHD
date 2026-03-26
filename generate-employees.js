import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const departments = [
  {
    id: 'DEP01',
    name: 'Phòng IT',
    budget: 250000000,
    totalEmployee: 176,
    description: 'Quản lý hoạt động của phòng IT',
    position: [
      'IT Manager',
      'Frontend Developer',
      'Backend Developer',
      'Fullstack Developer',
      'UI/UX Designer',
      'QA Tester',
      'DevOps Engineer'
    ]
  },
  {
    id: 'DEP02',
    name: 'Phòng Nhân sự',
    budget: 120000000,
    totalEmployee: 134,
    description: 'Quản lý hoạt động của phòng Nhân sự',
    position: [
      'HR Manager',
      'Recruiter',
      'Training Specialist',
      'C&B Specialist',
      'HR Executive'
    ]
  },
  {
    id: 'DEP03',
    name: 'Phòng Marketing',
    budget: 180000000,
    totalEmployee: 168,
    description: 'Quản lý hoạt động của phòng Marketing',
    position: [
      'Marketing Manager',
      'Digital Marketer',
      'SEO Specialist',
      'Content Creator',
      'Brand Executive',
      'Ads Specialist'
    ]
  },
  {
    id: 'DEP04',
    name: 'Phòng Kế toán',
    budget: 150000000,
    totalEmployee: 180,
    description: 'Quản lý hoạt động của phòng Kế toán',
    position: [
      'Chief Accountant',
      'General Accountant',
      'Tax Accountant',
      'Internal Auditor',
      'Accounting Assistant'
    ]
  },
  {
    id: 'DEP05',
    name: 'Phòng Kinh doanh',
    budget: 300000000,
    totalEmployee: 169,
    description: 'Quản lý hoạt động của phòng Kinh doanh',
    position: [
      'Sales Manager',
      'Senior Sales Executive',
      'Sales Executive',
      'Business Development Executive',
      'Key Account Executive'
    ]
  },
  {
    id: 'DEP06',
    name: 'Phòng Chăm sóc khách hàng',
    budget: 140000000,
    totalEmployee: 173,
    description: 'Quản lý hoạt động của phòng Chăm sóc khách hàng',
    position: [
      'Customer Service Manager',
      'Customer Support Staff',
      'Call Center Agent',
      'Complaint Handler',
      'Customer Care Executive'
    ]
  }
]

const firstNames = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng',
  'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Huỳnh'
]

const middleNames = [
  'Văn', 'Thị', 'Minh', 'Quốc', 'Gia',
  'Thanh', 'Ngọc', 'Đức', 'Hoàng', 'Anh'
]

const lastNames = [
  'An', 'Bình', 'Chi', 'Dung', 'Giang',
  'Hạnh', 'Khánh', 'Lam', 'Long', 'Mai',
  'Nam', 'Oanh', 'Phúc', 'Quân', 'Sơn',
  'Trang', 'Tuấn', 'Vy', 'Yến', 'Khoa',
  'Linh', 'Tùng', 'Hương', 'Bảo', 'Thảo'
]

const wards = [
  'Phường Phú Cường',
  'Phường Hiệp Thành',
  'Phường An Phú',
  'Phường Tân Định',
  'Phường Mỹ Phước',
  'Phường Chánh Nghĩa'
]

const districts = [
  'Thủ Dầu Một',
  'Thuận An',
  'Dĩ An',
  'Bến Cát',
  'Tân Uyên'
]

const provinces = [
  'Bình Dương',
  'TP.HCM',
  'Đồng Nai'
]

const genders = ['Nam', 'Nữ']
const statuses = [
  'Đang làm việc',
  'Đang làm việc',
  'Đang làm việc',
  'Đang làm việc',
  'Nghỉ phép',
  'Đã nghỉ việc'
]

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0]
}

function randomDateBetween(startDate, endDate) {
  const start = startDate.getTime()
  const end = endDate.getTime()
  const randomTime = start + Math.random() * (end - start)
  return new Date(randomTime)
}

function randomDate(startYear = 2020, endYear = 2025) {
  const start = new Date(`${startYear}-01-01`)
  const end = new Date(`${endYear}-12-31`)
  return formatDate(randomDateBetween(start, end))
}

function randomDateOfBirth() {
  const start = new Date('1985-01-01')
  const end = new Date('2002-12-31')
  return formatDate(randomDateBetween(start, end))
}

function addMonths(date, months) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function subtractDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() - days)
  return d
}

function randomPhone(id) {
  const prefixes = ['093', '090', '091', '094', '097', '098']
  const suffix = String(1000000 + id).slice(-7)
  return randomItem(prefixes) + suffix
}

function generateName() {
  return `${randomItem(firstNames)} ${randomItem(middleNames)} ${randomItem(lastNames)}`
}

function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

function generateEmail(name, id) {
  const emailName = removeVietnameseTones(name)
    .toLowerCase()
    .replace(/\s+/g, '')
  return `${emailName}${id}@company.com`
}

function generateAddress() {
  return `${randomItem(wards)}, ${randomItem(districts)}, ${randomItem(provinces)}`
}

function getManagerPosition(positionList) {
  return (
    positionList.find(item => /manager|chief|lead|trưởng/i.test(item)) ||
    positionList[0]
  )
}

function generateHistory(department, currentPosition, isManager = false) {
  const roll = Math.random()
  let historyCount = 1

  if (isManager) {
    historyCount = roll > 0.5 ? 3 : 2
  } else {
    if (roll > 0.9) {
      historyCount = 3
    } else if (roll > 0.7) {
      historyCount = 2
    }
  }

  const otherPositions = department.position.filter(p => p !== currentPosition)
  const shuffled = shuffleArray(otherPositions)

  const timelinePositions = []
  const previousCount = historyCount - 1

  for (let i = 0; i < previousCount; i++) {
    timelinePositions.push(
      shuffled[i] || randomItem(otherPositions.length ? otherPositions : department.position)
    )
  }

  timelinePositions.push(currentPosition)

  let startDate = randomDateBetween(new Date('2020-01-01'), new Date('2025-06-01'))
  const chronological = []

  for (let i = 0; i < timelinePositions.length; i++) {
    const isCurrent = i === timelinePositions.length - 1
    const itemStart = new Date(startDate)
    let itemEnd = null

    if (!isCurrent) {
      const durationMonths = randomInt(4, 10)
      itemEnd = subtractDays(addMonths(itemStart, durationMonths), 1)
      startDate = addDays(itemEnd, 1)
    }

    chronological.push({
      departmentId: department.id,
      department: department.name,
      position: timelinePositions[i],
      startDate: formatDate(itemStart),
      endDate: itemEnd ? formatDate(itemEnd) : null
    })
  }

  return chronological
    .reverse()
    .map((item, index) => ({
      id: index + 1,
      ...item
    }))
}

function createEmployee({ id, department, isManager = false, managerPosition = null }) {
  const name = generateName()

  const availablePositions = department.position.filter(p => p !== managerPosition)
  const currentPosition = isManager
    ? managerPosition
    : randomItem(availablePositions.length ? availablePositions : department.position)

  const history = generateHistory(department, currentPosition, isManager)

  return {
    id,
    employeeCode: `EMP${String(id).padStart(4, '0')}`,
    name,
    gender: randomItem(genders),
    dateOfBirth: randomDateOfBirth(),
    email: generateEmail(name, id),
    phone: randomPhone(id),
    address: generateAddress(),
    status: isManager ? 'Đang làm việc' : randomItem(statuses),
    avatar: '/images/avatar.png',
    history
  }
}

let employees = []
let departmentsOutput = []
let id = 1

for (const dept of departments) {
  const managerPosition = getManagerPosition(dept.position)

  const manager = createEmployee({
    id,
    department: dept,
    isManager: true,
    managerPosition
  })

  employees.push(manager)

  departmentsOutput.push({
    id: dept.id,
    name: dept.name,
    employeeID: manager.employeeCode,
    employeeName: manager.name,
    budget: dept.budget,
    totalEmployee: dept.totalEmployee,
    description: dept.description,
    position: dept.position
  })

  id++

  for (let i = 1; i < dept.totalEmployee; i++) {
    const employee = createEmployee({
      id,
      department: dept,
      isManager: false,
      managerPosition
    })

    employees.push(employee)
    id++
  }
}

const outputDir = path.join(__dirname, 'public', 'data')
fs.mkdirSync(outputDir, { recursive: true })

const employeesOutputPath = path.join(outputDir, 'employees.json')
const departmentsOutputPath = path.join(outputDir, 'departments.json')

fs.writeFileSync(employeesOutputPath, JSON.stringify(employees, null, 2), 'utf8')
fs.writeFileSync(departmentsOutputPath, JSON.stringify(departmentsOutput, null, 2), 'utf8')

console.log(`Created ${employees.length} employees at: ${employeesOutputPath}`)
console.log(`Created ${departmentsOutput.length} departments at: ${departmentsOutputPath}`)