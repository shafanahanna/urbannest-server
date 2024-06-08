// import twilio from "twilio";
// import dotenv from "dotenv";
// dotenv.config();

// const accountSid = process.env.TWILIO_ACCOUNTSID;
// const authToken = process.env.TWILIO_AUTHTOKEN;
// // const serviceId = process.env.TWILIO_SERVICEID;

// const client = twilio(accountSid, authToken);

// export const sendOTP = async (req, res) => {
//   const { phoneNumber } = req.body;
//   try {
//     await client.verify.v2
//       .services("VAde18c709de6ab3f761d392d58e3386f9")
//       .verifications.create({
//         to: "+91" + phoneNumber,
//         channel: "sms",
//       });

//     console.log("OTP sent to your registered number");
//     res.json({ success: true, message: "OTP request sent successfully" });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error sending OTP",
//       error: error.message,
//     });
//   }
// };

// export const verifyOTP = async (req, res) => {
//   const { phoneNumber, otp } = req.body;

//   try {
//     const verificationCheck = await client.verify.v2
//       .services("VAde18c709de6ab3f761d392d58e3386f9")
//       .verificationChecks.create({
//         to: "+91" + phoneNumber,
//         code: otp,
//       });

//     if (verificationCheck.status === "approved") {
//       console.log("OTP verified successfully");
//       return res.json({ success: true, message: "OTP verified successfully" });
//     } else {
//       console.log("Invalid OTP");
//       return res.json({ success: false, message: "Invalid OTP" });
//     }
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error verifying OTP",
//       error: error.message,
//     });
//   }
// };


import twilio from 'twilio';
import dotenv from 'dotenv'
dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const servicesids= process.env.TWILIO_SERVICEID;
const client = twilio(accountSid, authToken);

export const sendOTP = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        await client.verify.v2.services(servicesids)  
            .verifications.create({
                to: "+91" + phoneNumber,
                channel: "sms"
            });

        console.log("OTP sent to the registered mobile number");
        res.json({ 
            success: true,
            message: "OTP request sent successfully"
        });
    } catch (error) {
        console.error("Error sending OTP", error);
        res.status(500).json({
            success: false,
            message: "Error sending OTP",
            error: error.message
        });
    }
};


export const verifyOtp = async (req, res) =>{
    const {phoneNumber, otp} = req.body
    console.log(req.body);
    try{
        const verificationCheck = await client.verify.v2.services(servicesids).verificationChecks.create({
            to:"+91" + phoneNumber,
            code:otp
        });
        console.log(verificationCheck,"check");

        console.log(" otp verification result", verificationCheck.status);
        if(verificationCheck.status === "approved"){
            console.log("otp verified successfully");
            res.json({
                success:true,
                message:"otp verified successfully"
                
            })
        }else{
            console.log("invalid otp")
            res.status(400).json({
                success:false,
                message:"invalid otp "
            })
        }
    }catch(error){
        console.error("Error verifying otp",error);
        res.status(500).json({
            success:false,
            message:"Error verifying otp",
            error:error.message
        })
}
}