
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  }
});

// Helper: generate friendly message
const generateMessage = (name) => {
  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  return {
    subject: `${greeting}, ${name || 'friend'}! 🌸`,
    text: `${greeting}, ${name || 'there'}! Just checking in — how was your day? Don’t forget to log your mood on Moodify.`,
    html: `<p>${greeting}, ${name || 'there'}! 🌸</p>
           <p>Just checking in — how was your day?</p>
           <p>Don’t forget to log your mood on <strong>Moodify</strong>. We’re here for you!</p>`
  };
};

const sendEmail = async ({ to, name ='Moodify User' }) => {
  try {
    const { subject, text, html } = generateMessage(name);

    const info = await transporter.sendMail({
      from: `"Moodify Reminder" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log('✅ Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };




