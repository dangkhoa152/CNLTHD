import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const departments = [
  {
    name: 'IT',
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
    name: 'Marketing',
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
    name: 'Sales',
    count: 220,
    positions: [
      'Sales Executive',
      'Sales Manager',
      'Business Development Executive',
      'Key Account Executive'
    ]
  },
  {
    name: 'Customer Service',
    count: 170,
    positions: [
      'Customer Support Staff',
      'Call Center Agent',
      'Complaint Handler',
      'Customer Care Executive'
    ]
  },
  {
    name: 'Logistics',
    count: 190,
    positions: [
      'Warehouse Staff',
      'Inventory Controller',
      'Delivery Coordinator',
      'Supply Chain Executive'
    ]
  },
  {
    name: 'Human Resources',
    count: 80,
    positions: [
      'HR Executive',
      'Recruiter',
      'Training Specialist',
      'C&B Specialist'
    ]
  }
];

const firstNames = [
  'Nguyen', 'Tran', 'Le', 'Pham', 'Hoang',
  'Vo', 'Dang', 'Bui', 'Do', 'Huynh'
];

const middleNames = [
  'Van', 'Thi', 'Minh', 'Quoc', 'Gia',
  'Thanh', 'Ngoc', 'Duc', 'Hoang', 'Anh'
];

const lastNames = [
  'An', 'Binh', 'Chi', 'Dung', 'Giang',
  'Hanh', 'Khanh', 'Lam', 'Long', 'Mai',
  'Nam', 'Oanh', 'Phuc', 'Quan', 'Son',
  'Trang', 'Tuan', 'Vy', 'Yen', 'Khoa'
];

const cities = [
  'Ho Chi Minh City',
  'Ha Noi',
  'Da Nang',
  'Can Tho',
  'Hai Phong',
  'Binh Duong'
];

const genders = ['Male', 'Female'];
const statuses = ['Active', 'Active', 'Active', 'On Leave', 'Inactive'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSalary(department) {
  const salaryRanges = {
    IT: [12000000, 30000000],
    Marketing: [10000000, 22000000],
    Sales: [9000000, 25000000],
    'Customer Service': [8000000, 18000000],
    Logistics: [8500000, 20000000],
    'Human Resources': [10000000, 22000000]
  };

  const [min, max] = salaryRanges[department];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(startYear = 2020, endYear = 2025) {
  const start = new Date(`${startYear}-01-01`).getTime();
  const end = new Date(`${endYear}-12-31`).getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime).toISOString().split('T')[0];
}

function randomPhone() {
  return '0' + Math.floor(100000000 + Math.random() * 900000000);
}

function generateName() {
  return `${randomItem(firstNames)} ${randomItem(middleNames)} ${randomItem(lastNames)}`;
}

let employees = [];
let id = 1;

for (const dept of departments) {
  for (let i = 0; i < dept.count; i++) {
    const name = generateName();
    const emailName = name.toLowerCase().replace(/\s+/g, '.');

    employees.push({
      id,
      employeeCode: `EMP${String(id).padStart(4, '0')}`,
      name,
      email: `${emailName}${id}@ecommerce.com`,
      gender: randomItem(genders),
      age: Math.floor(Math.random() * 18) + 22,
      department: dept.name,
      position: randomItem(dept.positions),
      salary: randomSalary(dept.name),
      status: randomItem(statuses),
      joinDate: randomDate(),
      phone: randomPhone(),
      city: randomItem(cities)
    });

    id++;
  }
}

const outputPath = path.join(__dirname, 'public', 'data', 'employees.json');
fs.writeFileSync(outputPath, JSON.stringify(employees, null, 2), 'utf8');

console.log(`Created ${employees.length} employees at: ${outputPath}`);