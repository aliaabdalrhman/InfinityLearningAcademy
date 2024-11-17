import fs from "fs";
import PDFDocument from "pdfkit";

/**
 * Generate a certificate as a PDF document.
 * @param {Object} data - Certificate data (e.g., student name, course title, completion date).
 * @param {string} path - File path to save the certificate.
 */
function generateCertificate(data, path) {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Create sections of the certificate
    generateHeader(doc);
    generateStudentInformation(doc, data);
    generateFooter(doc);

    // Finalize and save the document
    doc.pipe(fs.createWriteStream(path));
    doc.end();
}

/**
 * Generate the certificate header.
 * @param {PDFDocument} doc - The PDF document instance.
 */


function generateHeader(doc) {
    const pageWidth = doc.page.width;
    const imageX = (pageWidth - 100) / 2;

    doc
        .image("images/projectLogo1.png", imageX, 45, { width: 100 })
        .moveDown(7)
        .fillColor("#444444")
        .fontSize(20)
        .text("Infinity Learning Academy", { align: "center" })
        .fontSize(11)
        .moveDown(8);
}

/**
 * Add student information and course title.
 * @param {PDFDocument} doc - The PDF document instance.
 * @param {Object} data - Certificate data.
 */
function generateStudentInformation(doc, data) {
    doc
        .fontSize(18)
        .fillColor("#444444")
        .text("Certificate of Completion", { align: "center", underline: true })
        .moveDown(2)
        .fontSize(16)
        .text("This is to certify that", { align: "center" })
        .moveDown(1)
        .font("Helvetica-Bold")
        .fontSize(16)
        .text(data.studentName, { align: "center" })
        .font("Helvetica")
        .moveDown(1)
        .text(`has successfully completed (${data.courseDuration}) hours of the course titled`, { align: "center" })
        .moveDown(1)
        .font("Helvetica-Bold")
        .fontSize(16)
        .text(data.courseTitle, { align: "center" })
        .font("Helvetica")
        .moveDown(1)
        .text(`on ${formatDate(data.completionDate)}.`, { align: "center" })
        .moveDown(2);
}

/**
 * Add additional certificate content (e.g., course details).
 * @param {PDFDocument} doc - The PDF document instance.
 * @param {Object} data - Certificate data.
 */

/**
 * Generate the footer of the certificate.
 * @param {PDFDocument} doc - The PDF document instance.
 */

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Thank you for your dedication to learning.",
            50,
            780,
            { align: "center", width: 500 }
        )
        .font("Helvetica-Bold")
}
/**
 * Format a JavaScript date object as YYYY/MM/DD.
 * @param {Date} date - The date to format.
 * @returns {string} - Formatted date string.
 */
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
}

export default generateCertificate;
