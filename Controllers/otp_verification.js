import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const servicesids = process.env.TWILIO_SERVICEID;
const client = twilio(accountSid, authToken);

export const sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    await client.verify.v2.services(servicesids).verifications.create({
      to: "+91" + phoneNumber,
      channel: "sms",
    });

    res.json({
      success: true,
      message: "OTP request sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP", error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  console.log(req.body);
  try {
    const verificationCheck = await client.verify.v2
      .services(servicesids)
      .verificationChecks.create({
        to: "+91" + phoneNumber,
        code: otp,
      });

    console.log(" otp verification result", verificationCheck.status);
    if (verificationCheck.status === "approved") {
      res.json({
        success: true,
        message: "otp verified successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "invalid otp ",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying otp",
      error: error.message,
    });
  }
};
