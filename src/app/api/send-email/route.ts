
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, type, content, preferred_date, preferred_time } = body;

        // Check for environment variables
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Missing EMAIL_USER or EMAIL_PASS environment variables');
            return NextResponse.json(
                { error: 'Email configuration missing on server' },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let mailOptions = {};

        if (type === 'reply') {
            // Logic for Admin replying to User
            mailOptions = {
                from: `"Muhammad Wahaj Shafiq" <${process.env.EMAIL_USER}>`, // Custom Name <email>
                to: email, // User's email
                subject: `Re: ${body.subject || 'Your Inquiry'}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <p>Dear ${name},</p>
                        <p style="white-space: pre-wrap;">${content}</p>
                        <br />
                        <p>Best regards,</p>
                        <p><strong>Muhammad Wahaj Shafiq</strong></p>
                    </div>
                `
            };
        } else {
            // Logic for Contact Form (User to Admin)
            let subject = `New Message from ${name}`;
            if (type === 'appointment') subject = `New Appointment Request from ${name}`;
            if (type === 'demo') subject = `New Demo Request from ${name}`;

            let headerTitle = "New Contact Message";
            if (type === 'appointment') headerTitle = "New Appointment Request";
            if (type === 'demo') headerTitle = "New Demo Request";

            const htmlContent = type === 'appointment'
                ? `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #000;">${headerTitle}</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>Preferred Date:</strong> ${preferred_date}</p>
                        <p><strong>Preferred Time:</strong> ${preferred_time}</p>
                        <hr style="border: 1px solid #eee; margin: 20px 0;" />
                        <h3>Topic</h3>
                        <p style="white-space: pre-wrap;">${content}</p>
                    </div>
                `
                : `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #000;">${headerTitle}</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <hr style="border: 1px solid #eee; margin: 20px 0;" />
                        <h3>Message</h3>
                        <p style="white-space: pre-wrap;">${content}</p>
                    </div>
                `;

            mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                replyTo: email,
                subject: subject,
                html: htmlContent,
            };
        }

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
