import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const departments = [
  {
    id: 'DEP01',
    name: 'Phòng CNTT',
    count: 180,
    positions: [
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
    name: 'Phòng Marketing',
    count: 160,
    positions: [
      'Digital Marketer',
      'SEO Specialist',
      'Content Creator',
      'Brand Executive',
      'Ads Specialist'
    ]
  },
  {
    id: 'DEP03',
    name: 'Phòng Kinh doanh',
    count: 220,
    positions: [
      'Sales Executive',
      'Senior Sales Executive',
      'Sales Manager',
      'Business Development Executive',
      'Key Account Executive'
    ]
  },
  {
    id: 'DEP04',
    name: 'Phòng Chăm sóc khách hàng',
    count: 170,
    positions: [
      'Customer Support Staff',
      'Call Center Agent',
      'Complaint Handler',
      'Customer Care Executive'
    ]
  },
  {
    id: 'DEP05',
    name: 'Phòng Logistics',
    count: 190,
    positions: [
      'Warehouse Staff',
      'Inventory Controller',
      'Delivery Coordinator',
      'Supply Chain Executive'
    ]
  },
  {
    id: 'DEP06',
    name: 'Phòng Nhân sự',
    count: 80,
    positions: [
      'HR Executive',
      'Recruiter',
      'Training Specialist',
      'C&B Specialist'
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
  'Trang', 'Tuấn', 'Vy', 'Yến', 'Khoa'
]

const cities = [
  'Thành phố Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Cần Thơ',
  'Hải Phòng',
  'Bình Dương'
]

const wards = [
  'Phường Phú Cường',
  'Phường Hiệp Thành',
  'Phường An Phú',
  'Phường Tân Định',
  'Phường Mỹ Phước',
  'Phường Chánh Nghĩa'
]

const genders = ['Nam', 'Nữ']
const statuses = ['Đang làm việc', 'Đang làm việc', 'Đang làm việc', 'Nghỉ phép', 'Đã nghỉ việc']

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomSalary(departmentName) {
  const salaryRanges = {
    'Phòng CNTT': [12000000, 30000000],
    'Phòng Marketing': [10000000, 22000000],
    'Phòng Kinh doanh': [9000000, 25000000],
    'Phòng Chăm sóc khách hàng': [8000000, 18000000],
    'Phòng Logistics': [8500000, 20000000],
    'Phòng Nhân sự': [10000000, 22000000]
  }

  const [min, max] = salaryRanges[departmentName]
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function randomDate(startYear = 2020, endYear = 2025) {
  const start = new Date(`${startYear}-01-01`).getTime()
  const end = new Date(`${endYear}-12-31`).getTime()
  const randomTime = start + Math.random() * (end - start)
  return formatDate(new Date(randomTime))
}

function randomPhone(id) {
  return '09' + String(10000000 + id).padStart(8, '0')
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
  return `${randomItem(wards)}, ${randomItem(cities)}`
}

function randomDateOfBirth() {
  const start = new Date('1985-01-01').getTime()
  const end = new Date('2002-12-31').getTime()
  const randomTime = start + Math.random() * (end - start)
  return formatDate(new Date(randomTime))
}

function addMonths(date, months) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function subtractDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() - days)
  return d
}

function generateHistory(department) {
  // 70% có 1 history, 20% có 2 history, 10% có 3 history
  const roll = Math.random()
  let historyCount = 1
  if (roll > 0.9) {
    historyCount = 3
  } else if (roll > 0.7) {
    historyCount = 2
  }

  const history = []

  // Chọn ngẫu nhiên các vị trí khác nhau trong cùng phòng ban
  const shuffledPositions = [...department.positions].sort(() => Math.random() - 0.5)
  const selectedPositions = shuffledPositions.slice(0, historyCount)

  // Bắt đầu từ quá khứ
  let startDate = new Date(randomDate(2020, 2024))

  for (let i = 0; i < historyCount; i++) {
    const isCurrent = i === historyCount - 1

    const itemStart = new Date(startDate)
    let itemEnd = null

    if (!isCurrent) {
      const durationMonths = randomInt(4, 10)
      itemEnd = subtractDays(addMonths(itemStart, durationMonths), 1)
      startDate = addMonths(itemStart, durationMonths)
    }

    history.push({
      id: i + 1,
      departmentId: department.id,
      department: department.name,
      position: selectedPositions[i] || randomItem(department.positions),
      startDate: formatDate(itemStart),
      endDate: itemEnd ? formatDate(itemEnd) : null
    })
  }

  return history.reverse()
}

let employees = []
let id = 1

for (const dept of departments) {
  for (let i = 0; i < dept.count; i++) {
    const name = generateName()

    employees.push({
      id,
      employeeCode: `EMP${String(id).padStart(4, '0')}`,
      name,
      gender: randomItem(genders),
      dateOfBirth: randomDateOfBirth(),
      email: generateEmail(name, id),
      phone: randomPhone(id),
      address: generateAddress(),
      status: randomItem(statuses),
      avatar: '/images/avatar.png',
      department: dept.name,
      position: randomItem(dept.positions),
      salary: randomSalary(dept.name),
      joinDate: randomDate(),
      history: generateHistory(dept)
    })

    id++
  }
}

const outputPath = path.join(__dirname, 'public', 'data', 'employees.json')
fs.writeFileSync(outputPath, JSON.stringify(employees, null, 2), 'utf8')

console.log(`Created ${employees.length} employees at: ${outputPath}`)