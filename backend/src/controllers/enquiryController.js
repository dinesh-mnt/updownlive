import Enquiry from '../models/Enquiry.js';
import { sendEmail } from '../config/emailService.js';

export const submitEnquiry = async (req, res) => {
  try {
    const { department, firstName, lastName, email, phone, companyName, message } = req.body;

    const enquiry = await Enquiry.create({
      department,
      firstName,
      lastName,
      email,
      phone,
      companyName,
      message,
    });

    // Send thank you email to the user
    try {
      await sendEmail({
        to: email,
        subject: `Thank you for contacting UpDownLive - ${department}`,
        text: `Hello ${firstName},\n\nThank you for reaching out to us. We have received your message regarding "${department}" and our team will get back to you shortly.\n\nYour message:\n${message}\n\nBest regards,\nUpDownLive Team`,
        html: `
          <h3>Hello ${firstName},</h3>
          <p>Thank you for reaching out to us. We have received your message regarding <strong>${department}</strong> and our team will get back to you shortly.</p>
          <p><strong>Your message:</strong><br/>${message}</p>
          <p>Best regards,<br/>UpDownLive Team</p>
        `
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // We don't fail the whole request if only the email fails
    }

    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateEnquiryNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { notice } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { notice },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Error updating enquiry notice:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
