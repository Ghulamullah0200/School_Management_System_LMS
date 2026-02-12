import nodemailer from 'nodemailer';

// Configure transporter
// In production, use environment variables for credentials
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your preferred service
    auth: {
        user: process.env.EMAIL_USER || 'your-school-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-email-app-password'
    }
});

export const sendCredentials = async (email: string, loginId: string, pass: string, name: string, role: string) => {
    try {
        const mailOptions = {
            from: '"School Management System" <no-reply@school.com>',
            to: email,
            subject: `Your ${role.charAt(0).toUpperCase() + role.slice(1)} Portal Credentials`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #4f46e5;">Welcome to School Management System</h2>
                    <p>Dear ${name},</p>
                    <p>Your account for the <strong>${role}</strong> portal has been successfully created.</p>
                    <p>Please use the following credentials to login:</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Login ID/Email:</strong> ${loginId}</p>
                        <p style="margin: 5px 0;"><strong>Password:</strong> ${pass}</p>
                    </div>

                    <p>We recommend changing your password after your first login.</p>
                    
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5000'}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 10px;">Login to Portal</a>
                    
                    <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">This is an automated message. Please do not reply to this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
