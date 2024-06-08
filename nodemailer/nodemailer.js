import nodemailer from "nodemailer";

export const sendEmailToUser = async (amount, currency, receipt) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSKEY,
    },
  });

  const mailOptions = {
    from: process.env.APP_EMAIL,
    to: "shafanahanna1999@gmail.com",
    subject: `Order confirm`,
    html: `<h4>Dear Customer,</h4>
           <p>Your order has been confirmed</p>
           <p>Thankyou for your order.if you have any issue mail to this email</p>
          `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }
};


export const sendEnquiry = async (req,res) => {
  const { name, email, message } = req.body;
  console.log(req.body);

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "Please fill all the fields...!"
    });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: email, 
    to: process.env.EMAIL_USER, 
    replyTo: email, 
    subject: `Enquiry from ${name}`,
    text: message
  };

  console.log(mailOptions);

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: 'Error sending email',
      error:error.message
});
}
};

