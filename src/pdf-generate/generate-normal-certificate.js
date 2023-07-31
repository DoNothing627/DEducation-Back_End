const fs = require("fs");
const moment = require("moment");
const PDFDocument = require("pdfkit");

const { ThirdwebStorage } = require("@thirdweb-dev/storage");

const storage = new ThirdwebStorage();

// name, supervisorName, subject, mark
// Create the PDF document
const generateNormalCertificate = (transcriptStudent, supervisorName, subject) => {
  let files = [];
  transcriptStudent.forEach((element) => {
    const doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
    });

    // The name
    //   const name = "An";

    // Pipe the PDF into an name.pdf file
    doc.pipe(
      fs.createWriteStream(`${element.name}_${element.mark}_normal.pdf`)
    );

    // Draw the certificate image
    doc.image(
      "/home/an/Code/Deducation/Front-end/public/certificate-form/normal-certificate.png",
      0,
      0,
      { width: 830 }
    );

    // Remember to download the font
    // Set the font to Dancing Script
    doc.font(
      "/home/an/Code/Deducation/Front-end/public/fonts/Amsterdam Four_ttf 400.ttf"
    );

    // Draw the name
    doc.fontSize(50).text(element.name, 50, 250, {
      align: "center",
    });

    // Draw the result
    doc
      .font(
        "/home/an/Code/Deducation/Front-end/public/fonts/Cormorant-VariableFont_wght.ttf"
      )
      .fontSize(15)
      .text(
        `has completed ${subject} with mark ${element.mark}`,
        50,
        400,
        {
          align: "center",
        }
      );

    // Draw the suppervisor name
    doc.fontSize(13).text(supervisorName, 55, 455, {
      align: "center",
    });

    // Draw the date
    // doc.fontSize(13).text(moment().format("MMMM Do YYYY"), 590, 485, {
    //   align: "center",
    // });

    // Finalize the PDF and end the stream
    doc.end();
    setTimeout(() => 
    files.push(fs.readFileSync(`${element.name}_${element.mark}_normal.pdf`)), 700
    )
  });
  var promise = new Promise((resolve, reject) => {
    setTimeout(async function () {
      const upload = await storage.upload(
        files
      );
      console.log(`Gateway URL - ${storage.resolveScheme(upload)}`);
      transcriptStudent.forEach(async (element) => {
        fs.unlinkSync(`${element.name}_${element.mark}_normal.pdf`);
      });
      resolve(storage.downloadJSON(upload));
    }, 1000);
  });
  return promise;
};
module.exports = generateNormalCertificate;

// generateNormalCertificate(
//   "Dao Xuan An",
//   "Truong Dieu Linh",
//   "Graduate Project",
//   "A+"
// );
