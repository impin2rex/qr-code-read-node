const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fsExtra = require("fs-extra");

const jsQR = require("jsqr");
const { PNG } = require("pngjs");
const jpeg = require("jpeg-js");
const { fromPath } = require("pdf2pic");

const port = process.env.PORT || 5000;
const app = express();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
app.use("/output", express.static(path.join(__dirname + "/output")));
app.set("view engine", "ejs");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(cors());

const upStorage = "./uploads";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

//Check File Type
function checkFileType(file, cb) {
  //Allowed ext
  const fileTypes = /jpeg|jpg|png|pdf/;
  //Check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //Check mime
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images or pdf Only!");
  }
}

app.get("/", (req, res) => {
  if (!fs.existsSync(upStorage)) {
    fs.mkdirSync(upStorage);
  }
  // fsExtra.emptyDirSync(upStorage);
  res.render("index");
});

app.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const file = req.file;
    let ext;

    if (!file) {
      const error = new Error("Please Upload a file");
      error.httpStatusCode = 404;
      return next(error);
    }
    if (file.mimetype == "image/jpeg") {
      ext = "jpg";
    }
    if (file.mimetype == "image/png") {
      ext = "png";
    }
    if (file.mimetype == "application/pdf") {
      ext = "pdf";
    }

    let qrCodeText;
    const fileData = fs.readFileSync(file.path);
    if (ext === "jpg") {
      const jpg = jpeg.decode(imagedata, { useTArray: true });
      const qrArray = new Uint8ClampedArray(jpg.data.buffer);
      qrCodeText = jsQR(qrArray, jpg.width, jpg.height).data;
    }
    if (ext === "png") {
      const png = PNG.sync.read(fileData);
      qrCodeText = jsQR(
        Uint8ClampedArray.from(png.data),
        png.width,
        png.height
      ).data;
    }
    if (ext === "pdf") {
      // const pdfFilePath = path.resolve(__dirname, `./${file.path}`);
      const pdf2picOptions = {
        quality: 100,
        density: 300,
        format: "jpg",
        width: 2480,
        height: 3509,
      };

      /**
       * Initialize PDF to image conversion by supplying a file path
       */
      const base64Response = await fromPath(file.path, pdf2picOptions)(
        1, // page number to be converted to image
        true // returns base64 output
      );
      const dataUri = base64Response.base64;

      if (!dataUri)
        throw new Error("PDF could not be converted to Base64 string");

      const buffer = Buffer.from(dataUri, "base64");
      const jpg = jpeg.decode(buffer, { useTArray: true });

      qrCodeText = jsQR(
        Uint8ClampedArray.from(jpg.data),
        jpg.width,
        jpg.height
      ).data;
    }
    res.render("image", {
      url: file.path,
      name: file.filename,
      ext: ext,
      code: qrCodeText,
    });
    setTimeout(() => {
      fsExtra.emptyDirSync(upStorage);
    }, 30000);
  } catch (err) {
    res.render("error", { err: "Sorry! Coudn't read!" });
    setTimeout(() => {
      fsExtra.emptyDirSync(upStorage);
    }, 30000);
  }
});

app.listen(port, () => console.log(`Server started on port ${port}`));
