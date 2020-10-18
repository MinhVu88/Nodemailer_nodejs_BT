require("dotenv").config();

const path = require("path"),
  express = require("express"),
  bodyParser = require("body-parser"),
  hbs = require("express-handlebars"),
  nodemailer = require("nodemailer"),
  app = express(),
  port = process.env.PORT || 3000;

// utilize static/public files
app.use("/public", express.static(path.join(__dirname, "public")));

// view engine setup
app.engine("handlebars", hbs());
app.set("view engine", "handlebars");

// body parser middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("contact", { layout: false });
});

app.post("/send", (req, res) => {
  console.log(req.body);

  // name, company, email, phone & message must match the name attributes in contact.handlebars
  const output = `<p>You have a new contact request</p>
                  <h3>Contact Details</h3>
                  <ul>
                     <li>Name: ${req.body.name}</li>
                     <li>Company: ${req.body.company}</li>
                     <li>Email: ${req.body.email}</li>
                     <li>Phone: ${req.body.phone}</li>
                  </ul>
                  <h3>Message: ${req.body.message}</h3>
  `;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "AuftdartMusicalAcademy@gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
    tls: { rejectUnauthorized: false }
  });

  let mailOptions = {
    from: '"Nodemailer Contact" <AuftdartMusicalAcademy@gmail.com>',
    to: "minhvu72826@gmail.com, AuftdartMusicalAcademy@gmail.com",
    subject: "Nodemailer Contact Request",
    cc: "minhvu72826@gmail.com",
    bcc: "minhvu72826@gmail.com",
    html: output
  };

  transporter
    .sendMail(mailOptions)
    .then(response => console.log("Email sent:", response))
    .catch(error => console.log("Error:", error));

  res.render("contact", { layout: false, msg: "Please fill out the form below." });
});

app.listen(port, () => console.log(`server's listening on port ${port}`));
