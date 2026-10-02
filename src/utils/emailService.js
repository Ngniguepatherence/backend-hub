const nodemailer = require('nodemailer');

// Configure email transporter
const createTransporter = () => {
  // For development, use Gmail or configure with your SMTP settings
  // In production, use environment variables for credentials
  const emailService = process.env.EMAIL_SERVICE || 'smtp';
  console.log('📧 Configuration email avec service:', emailService);
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // Change to your email service
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password', // Use App Password for Gmail
    },
  });
};

// Send email function
exports.sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'WDH Operating System <noreply@westdigitalhub.cm>',
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
exports.emailTemplates = {
  taskAssigned: (task, assignee) => ({
    subject: `Nouvelle tâche assignée : ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nouvelle Tâche Assignée</h2>
        <p>Bonjour ${assignee.name},</p>
        <p>Une nouvelle tâche vous a été assignée :</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${task.title}</h3>
          ${task.description ? `<p>${task.description}</p>` : ''}
          <p><strong>Priorité :</strong> ${task.priority}</p>
          <p><strong>Date limite :</strong> ${new Date(task.dueDate).toLocaleDateString('fr-FR')}</p>
        </div>
        <p>Connectez-vous à votre tableau de bord pour voir les détails et mettre à jour le statut.</p>
        <p>Cordialement,<br>L'équipe WDH</p>
      </div>
    `,
    text: `Nouvelle tâche assignée : ${task.title}\n\n${task.description || ''}\n\nPriorité : ${task.priority}\nDate limite : ${new Date(task.dueDate).toLocaleDateString('fr-FR')}`,
  }),

  taskStatusChanged: (task, assignee, newStatus) => ({
    subject: `Tâche mise à jour : ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Statut de Tâche Mis à Jour</h2>
        <p>Bonjour ${assignee.name},</p>
        <p>Le statut de votre tâche a été mis à jour :</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${task.title}</h3>
          <p><strong>Nouveau statut :</strong> ${newStatus === 'completed' ? 'Terminée' : newStatus === 'in_progress' ? 'En cours' : 'En attente'}</p>
        </div>
        <p>Cordialement,<br>L'équipe WDH</p>
      </div>
    `,
    text: `Tâche mise à jour : ${task.title}\n\nNouveau statut : ${newStatus}`,
  }),

  employeeNotification: (employee, subject, message) => ({
    subject: subject || 'Notification WDH',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">${subject || 'Notification'}</h2>
        <p>Bonjour ${employee.name},</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>${message}</p>
        </div>
        <p>Cordialement,<br>L'équipe WDH</p>
      </div>
    `,
    text: `${subject || 'Notification'}\n\n${message}`,
  }),
};
