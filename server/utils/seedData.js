const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Department = require('../models/Department');
const KPI = require('../models/KPI');
const Performance = require('../models/Performance');
const AuditLog = require('../models/AuditLog');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas for seeding...');

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Department.deleteMany();
    await KPI.deleteMany();
    await Performance.deleteMany();
    await AuditLog.deleteMany();

    console.log('📁 Creating departments...');
    const departments = await Department.insertMany([
      { name: 'Information Technology', code: 'IT', description: 'Manages digital infrastructure and e-Governance systems' },
      { name: 'Human Resources', code: 'HR', description: 'Manages workforce administration and welfare' },
      { name: 'Public Works', code: 'PWD', description: 'Handles infrastructure and civic construction projects' },
      { name: 'Finance & Accounts', code: 'FIN', description: 'Manages budget, treasury and financial compliance' },
      { name: 'Health Services', code: 'HLT', description: 'Manages public health programs and citizen services' },
    ]);

    const [itDept, hrDept, pwdDept, finDept, hltDept] = departments;

    console.log('👤 Creating Admin user...');
    const admin = await User.create({
      employeeId: 'ADM001',
      name: 'Rajesh Kumar Sharma',
      email: 'admin@govtworkforce.in',
      password: 'Admin@123',
      department: itDept._id,
      designation: 'System Administrator',
      role: 'admin',
      phone: '9876543210',
      employmentStatus: 'active',
    });

    console.log('👤 Creating Supervisors...');
    const supervisor1 = await User.create({
      employeeId: 'SUP001',
      name: 'Priya Verma',
      email: 'supervisor.it@govtworkforce.in',
      password: 'Supervisor@123',
      department: itDept._id,
      designation: 'IT Department Head',
      role: 'supervisor',
      phone: '9876543211',
      employmentStatus: 'active',
    });

    const supervisor2 = await User.create({
      employeeId: 'SUP002',
      name: 'Anil Kumar Singh',
      email: 'supervisor.pwd@govtworkforce.in',
      password: 'Supervisor@123',
      department: pwdDept._id,
      designation: 'Public Works Supervisor',
      role: 'supervisor',
      phone: '9876543212',
      employmentStatus: 'active',
    });

    await Department.findByIdAndUpdate(itDept._id, { head: supervisor1._id });
    await Department.findByIdAndUpdate(pwdDept._id, { head: supervisor2._id });

    console.log('👤 Creating Employees...');
    const employeesData = [
      { employeeId: 'EMP001', name: 'Amit Patel', email: 'amit.patel@govtworkforce.in', department: itDept._id, designation: 'Software Developer', reportingManager: supervisor1._id },
      { employeeId: 'EMP002', name: 'Sneha Reddy', email: 'sneha.reddy@govtworkforce.in', department: itDept._id, designation: 'Network Engineer', reportingManager: supervisor1._id },
      { employeeId: 'EMP003', name: 'Vikram Malhotra', email: 'vikram.malhotra@govtworkforce.in', department: pwdDept._id, designation: 'Civil Engineer', reportingManager: supervisor2._id },
      { employeeId: 'EMP004', name: 'Kavita Joshi', email: 'kavita.joshi@govtworkforce.in', department: hrDept._id, designation: 'HR Executive', reportingManager: supervisor1._id },
      { employeeId: 'EMP005', name: 'Ramesh Gupta', email: 'ramesh.gupta@govtworkforce.in', department: finDept._id, designation: 'Accounts Officer', reportingManager: supervisor2._id },
      { employeeId: 'EMP006', name: 'Deepa Nair', email: 'deepa.nair@govtworkforce.in', department: hltDept._id, designation: 'Health Program Officer', reportingManager: supervisor1._id },
    ];

    const employees = [];
    for (const emp of employeesData) {
      const created = await User.create({ ...emp, password: 'Employee@123', role: 'employee', employmentStatus: 'active' });
      employees.push(created);
    }

    for (const dept of departments) {
      const count = await User.countDocuments({ department: dept._id });
      await Department.findByIdAndUpdate(dept._id, { totalEmployees: count });
    }

    console.log('📊 Creating KPIs...');
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const kpis = await KPI.insertMany([
      { title: 'Task Completion Rate', category: 'Task Completion', description: 'Percentage of assigned tasks completed within deadline', department: itDept._id, targetValue: 100, unit: 'tasks', weightage: 30, evaluationCycle: 'Monthly', startDate, endDate, createdBy: admin._id, assignedTo: [employees[0]._id, employees[1]._id] },
      { title: 'Service Delivery Timeliness', category: 'Service Delivery', description: 'Average time taken to resolve citizen service requests', department: itDept._id, targetValue: 50, unit: 'requests', weightage: 25, evaluationCycle: 'Monthly', startDate, endDate, createdBy: admin._id, assignedTo: [employees[0]._id, employees[1]._id] },
      { title: 'Attendance Compliance', category: 'Attendance Compliance', description: 'Regularity and punctuality in office attendance', department: pwdDept._id, targetValue: 26, unit: 'days', weightage: 20, evaluationCycle: 'Monthly', startDate, endDate, createdBy: admin._id, assignedTo: [employees[2]._id] },
      { title: 'Citizen Satisfaction Score', category: 'Citizen Satisfaction', description: 'Feedback score collected from citizens for service quality', department: hltDept._id, targetValue: 90, unit: 'percent', weightage: 25, evaluationCycle: 'Quarterly', startDate, endDate, createdBy: admin._id, assignedTo: [employees[5]._id] },
      { title: 'Document Processing Accuracy', category: 'Quality of Work', description: 'Accuracy of financial and administrative document processing', department: finDept._id, targetValue: 100, unit: 'documents', weightage: 30, evaluationCycle: 'Monthly', startDate, endDate, createdBy: admin._id, assignedTo: [employees[4]._id] },
      { title: 'Recruitment Cycle Efficiency', category: 'Timeliness', description: 'Time taken to complete recruitment and onboarding cycle', department: hrDept._id, targetValue: 30, unit: 'days', weightage: 20, evaluationCycle: 'Quarterly', startDate, endDate, createdBy: admin._id, assignedTo: [employees[3]._id] },
    ]);

    console.log('📝 Creating sample performance submissions...');
    await Performance.create([
      {
        employee: employees[0]._id, kpi: kpis[0]._id, taskDetails: 'Completed migration of citizen portal database to new server',
        achievedValue: 95, completionStatus: 'completed', status: 'approved', approvedScore: 95, finalScore: Math.round((95 * 30) / 100),
        supervisorRemarks: 'Excellent work, completed ahead of schedule', reviewedBy: supervisor1._id, reviewedAt: new Date(),
        evaluationPeriod: { month: now.getMonth() + 1, year: now.getFullYear() },
      },
      {
        employee: employees[1]._id, kpi: kpis[1]._id, taskDetails: 'Resolved 42 citizen network service requests this month',
        achievedValue: 42, completionStatus: 'completed', status: 'submitted',
        evaluationPeriod: { month: now.getMonth() + 1, year: now.getFullYear() },
      },
      {
        employee: employees[2]._id, kpi: kpis[2]._id, taskDetails: 'Maintained full attendance with zero unplanned leaves',
        achievedValue: 26, completionStatus: 'completed', status: 'approved', approvedScore: 100, finalScore: Math.round((100 * 20) / 100),
        supervisorRemarks: 'Perfect attendance record', reviewedBy: supervisor2._id, reviewedAt: new Date(),
        evaluationPeriod: { month: now.getMonth() + 1, year: now.getFullYear() },
      },
    ]);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('========== LOGIN CREDENTIALS ==========');
    console.log('ADMIN      -> admin@govtworkforce.in / Admin@123');
    console.log('SUPERVISOR -> supervisor.it@govtworkforce.in / Supervisor@123');
    console.log('EMPLOYEE   -> amit.patel@govtworkforce.in / Employee@123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();