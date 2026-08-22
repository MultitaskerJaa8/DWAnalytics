const PDFDocument = require('pdfkit');

// Generates an official Appraisal Certificate PDF for a high-performing employee
// Used for the Appraisal Module - Automated grading & recognition document
const generateAppraisalCertificate = (res, { employee, department, grade, averageScore, period }) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=appraisal-certificate-${employee.employeeId}.pdf`);
  doc.pipe(res);

  // Border
  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#1E40AF');

  doc
    .fontSize(22)
    .fillColor('#1E40AF')
    .text('GOVERNMENT OF INDIA', { align: 'center' })
    .moveDown(0.3);

  doc
    .fontSize(16)
    .fillColor('#333333')
    .text('Digital Workforce Performance Analytics Platform', { align: 'center' })
    .moveDown(1.5);

  doc
    .fontSize(20)
    .fillColor('#000000')
    .text('CERTIFICATE OF APPRAISAL', { align: 'center', underline: true })
    .moveDown(2);

  doc
    .fontSize(12)
    .fillColor('#333333')
    .text('This is to certify that', { align: 'center' })
    .moveDown(0.5);

  doc
    .fontSize(18)
    .fillColor('#1E40AF')
    .text(employee.name, { align: 'center', bold: true })
    .moveDown(0.5);

  doc
    .fontSize(12)
    .fillColor('#333333')
    .text(`Employee ID: ${employee.employeeId}  |  Designation: ${employee.designation}`, { align: 'center' })
    .text(`Department: ${department}`, { align: 'center' })
    .moveDown(1.5);

  doc
    .fontSize(13)
    .text(
      `has demonstrated outstanding performance for the evaluation period ${period}, achieving an average performance score of ${averageScore}%, and has been graded as:`,
      { align: 'center' }
    )
    .moveDown(1);

  doc
    .fontSize(24)
    .fillColor('#059669')
    .text(grade, { align: 'center', bold: true })
    .moveDown(2);

  doc
    .fontSize(11)
    .fillColor('#666666')
    .text(`Issued on: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' })
    .moveDown(3);

  doc
    .fontSize(11)
    .fillColor('#333333')
    .text('_____________________________', 350, doc.y, { align: 'left' })
    .text('Authorized Signatory', 380, doc.y + 5);

  doc.end();
};

module.exports = { generateAppraisalCertificate };