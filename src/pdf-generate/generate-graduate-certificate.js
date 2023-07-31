// import fs from "fs";
// import moment from "moment";
// import PDFDocument from "pdfkit";
const fs = require("fs");
const moment = require("moment");
const PDFDocument = require("pdfkit");
const { ThirdwebStorage } = require("@thirdweb-dev/storage");

const storage = new ThirdwebStorage();

const generateGraduateCertificate = async (diplomaStudents) => {
  // Create the PDF document
  let files = [];
  diplomaStudents.forEach((element) => {
    const doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
    });

    // The name
    // const name = "An";

    // Pipe the PDF into an name.pdf file
    doc.pipe(
      fs.createWriteStream(
        `${element.name}_${element.classification}_graduate.pdf`
      )
    );

    // Draw the certificate image
    doc.image(
      "/home/an/Code/Deducation/Front-end/public/certificate-form/graduate-certificate.png",
      0,
      0,
      { width: 842 }
    );

    // Remember to download the font
    // Set the font to Dancing Script
    doc.font("/home/an/Code/Deducation/Front-end/public/fonts/Halimun.ttf");

    // Draw the name
    doc.fontSize(50).text(element.name, 70, 260, {
      align: "center",
    });

    doc
      .font(
        "/home/an/Code/Deducation/Front-end/public/fonts/Cormorant-VariableFont_wght.ttf"
      )
      .fontSize(15)
      .text(
        `has completed major ${element.major} with classification ${element.classification}`,
        80,
        350,
        {
          align: "center",
        }
      );

    // Draw the date
    doc.fontSize(17).text(moment().format("MMMM Do YYYY"), -280, 420, {
      align: "center",
    });

    // Finalize the PDF and end the stream
    doc.end();

    setTimeout(
      () =>
        files.push(
          fs.readFileSync(
            `${element.name}_${element.classification}_graduate.pdf`
          )
        ),
      700
    );
  });

  var promise = new Promise((resolve, reject) => {
    setTimeout(async function () {
      const upload = await storage.upload(files);
      console.log(`Gateway URL - ${storage.resolveScheme(upload)}`);
      diplomaStudents.forEach(async (element) => {
        fs.unlinkSync(`${element.name}_${element.classification}_graduate.pdf`);
      });
      resolve(storage.downloadJSON(upload));
    }, 1000);
  });
  return promise;
};
module.exports = generateGraduateCertificate;

// generateGraduateCertificate("Dao Xuan An", "Computer Engineering", "Very Good");
