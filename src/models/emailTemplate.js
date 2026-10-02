// emailTemplates.js

/**
 * Configuration des couleurs et styles de base
 */
const styles = {
    primary: '#4F46E5',
    secondary: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    text: '#1F2937',
    textLight: '#6B7280',
    background: '#F9FAFB',
    white: '#FFFFFF'
  };
  
  /**
   * Layout de base pour tous les emails
   */
  const baseLayout = (content, title) => `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background-color: ${styles.background};
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: ${styles.white};
      }
      .header {
        background-color: ${styles.primary};
        padding: 30px;
        text-align: center;
      }
      .header h1 {
        color: ${styles.white};
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 40px 30px;
        color: ${styles.text};
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 12px 30px;
        background-color: ${styles.primary};
        color: ${styles.white};
        text-decoration: none;
        border-radius: 6px;
        margin: 20px 0;
        font-weight: 600;
      }
      .footer {
        background-color: ${styles.background};
        padding: 20px 30px;
        text-align: center;
        color: ${styles.textLight};
        font-size: 14px;
      }
      .task-details {
        background-color: ${styles.background};
        border-left: 4px solid ${styles.primary};
        padding: 15px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .task-details strong {
        color: ${styles.text};
      }
    </style>
  </head>
  <body>
    <div class="container">
      ${content}
      <div class="footer">
        <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
        <p>&copy; ${new Date().getFullYear()} Votre Entreprise. Tous droits réservés.</p>
      </div>
    </div>
  </body>
  </html>
  `;
  
  /**
   * Templates d'emails
   */
  const emailTemplates = {
    /**
     * Email de tâche assignée
     */
    taskAssigned: (task, assignee) => {
      const content = `
        <div class="header">
          <h1>📋 Nouvelle tâche assignée</h1>
        </div>
        <div class="content">
          <p>Bonjour ${assignee.name || assignee.email},</p>
          
          <p>Une nouvelle tâche vous a été assignée :</p>
          
          <div class="task-details">
            <p><strong>Titre :</strong> ${task.title}</p>
            ${task.description ? `<p><strong>Description :</strong> ${task.description}</p>` : ''}
            ${task.priority ? `<p><strong>Priorité :</strong> ${task.priority}</p>` : ''}
            ${task.dueDate ? `<p><strong>Date d'échéance :</strong> ${new Date(task.dueDate).toLocaleDateString('fr-FR')}</p>` : ''}
            ${task.assignedBy ? `<p><strong>Assignée par :</strong> ${task.assignedBy}</p>` : ''}
          </div>
          
          <p>Veuillez consulter la tâche pour plus de détails et commencer à travailler dessus.</p>
          
          ${task.url ? `<a href="${task.url}" class="button">Voir la tâche</a>` : ''}
          
          <p>Bonne journée !</p>
        </div>
      `;
      
      return {
        subject: `Nouvelle tâche : ${task.title}`,
        html: baseLayout(content, 'Nouvelle tâche assignée'),
        to: assignee.email
      };
    },
  
    /**
     * Email de tâche complétée
     */
    taskCompleted: (task, assignee) => {
      const content = `
        <div class="header" style="background-color: ${styles.secondary};">
          <h1>✅ Tâche complétée</h1>
        </div>
        <div class="content">
          <p>Bonjour,</p>
          
          <p>${assignee.name || assignee.email} a marqué la tâche suivante comme complétée :</p>
          
          <div class="task-details" style="border-left-color: ${styles.secondary};">
            <p><strong>Titre :</strong> ${task.title}</p>
            ${task.description ? `<p><strong>Description :</strong> ${task.description}</p>` : ''}
            <p><strong>Complétée le :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          ${task.url ? `<a href="${task.url}" class="button" style="background-color: ${styles.secondary};">Voir la tâche</a>` : ''}
        </div>
      `;
      
      return {
        subject: `Tâche complétée : ${task.title}`,
        html: baseLayout(content, 'Tâche complétée'),
        to: task.createdBy || task.notifyEmail
      };
    },
  
    /**
     * Email de rappel de tâche
     */
    taskReminder: (task, assignee) => {
      const content = `
        <div class="header" style="background-color: ${styles.warning};">
          <h1>⏰ Rappel de tâche</h1>
        </div>
        <div class="content">
          <p>Bonjour ${assignee.name || assignee.email},</p>
          
          <p>Ceci est un rappel concernant la tâche suivante :</p>
          
          <div class="task-details" style="border-left-color: ${styles.warning};">
            <p><strong>Titre :</strong> ${task.title}</p>
            ${task.description ? `<p><strong>Description :</strong> ${task.description}</p>` : ''}
            ${task.dueDate ? `<p><strong>Date d'échéance :</strong> ${new Date(task.dueDate).toLocaleDateString('fr-FR')}</p>` : ''}
            <p><strong>Statut :</strong> ${task.status || 'En cours'}</p>
          </div>
          
          <p>N'oubliez pas de travailler sur cette tâche.</p>
          
          ${task.url ? `<a href="${task.url}" class="button" style="background-color: ${styles.warning};">Voir la tâche</a>` : ''}
        </div>
      `;
      
      return {
        subject: `Rappel : ${task.title}`,
        html: baseLayout(content, 'Rappel de tâche'),
        to: assignee.email
      };
    },
  
    /**
     * Email de tâche en retard
     */
    taskOverdue: (task, assignee) => {
      const content = `
        <div class="header" style="background-color: ${styles.danger};">
          <h1>⚠️ Tâche en retard</h1>
        </div>
        <div class="content">
          <p>Bonjour ${assignee.name || assignee.email},</p>
          
          <p>La tâche suivante est en retard :</p>
          
          <div class="task-details" style="border-left-color: ${styles.danger};">
            <p><strong>Titre :</strong> ${task.title}</p>
            ${task.description ? `<p><strong>Description :</strong> ${task.description}</p>` : ''}
            <p><strong>Date d'échéance :</strong> ${new Date(task.dueDate).toLocaleDateString('fr-FR')}</p>
            <p><strong>Jours de retard :</strong> ${Math.floor((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24))}</p>
          </div>
          
          <p>Veuillez traiter cette tâche en priorité.</p>
          
          ${task.url ? `<a href="${task.url}" class="button" style="background-color: ${styles.danger};">Voir la tâche</a>` : ''}
        </div>
      `;
      
      return {
        subject: `⚠️ Tâche en retard : ${task.title}`,
        html: baseLayout(content, 'Tâche en retard'),
        to: assignee.email
      };
    },
  
    /**
     * Email de commentaire sur une tâche
     */
    taskComment: (task, assignee, comment, commenter) => {
      const content = `
        <div class="header">
          <h1>💬 Nouveau commentaire</h1>
        </div>
        <div class="content">
          <p>Bonjour ${assignee.name || assignee.email},</p>
          
          <p>${commenter.name || commenter.email} a ajouté un commentaire sur la tâche :</p>
          
          <div class="task-details">
            <p><strong>Tâche :</strong> ${task.title}</p>
            <p><strong>Commentaire :</strong></p>
            <p style="font-style: italic; margin-left: 15px;">"${comment}"</p>
            <p style="color: ${styles.textLight}; font-size: 14px;">
              ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
            </p>
          </div>
          
          ${task.url ? `<a href="${task.url}" class="button">Voir la tâche</a>` : ''}
        </div>
      `;
      
      return {
        subject: `Nouveau commentaire sur : ${task.title}`,
        html: baseLayout(content, 'Nouveau commentaire'),
        to: assignee.email
      };
    },
  
    /**
     * Email de changement de statut
     */
    taskStatusChanged: (task, assignee, oldStatus, newStatus, changedBy) => {
      const statusColors = {
        'todo': styles.textLight,
        'in_progress': styles.primary,
        'completed': styles.secondary,
        'blocked': styles.danger
      };
      
      const statusLabels = {
        'todo': 'À faire',
        'in_progress': 'En cours',
        'completed': 'Terminée',
        'blocked': 'Bloquée'
      };
      
      const content = `
        <div class="header">
          <h1>🔄 Changement de statut</h1>
        </div>
        <div class="content">
          <p>Bonjour ${assignee.name || assignee.email},</p>
          
          <p>Le statut de la tâche a été modifié ${changedBy ? `par ${changedBy.name || changedBy.email}` : ''} :</p>
          
          <div class="task-details">
            <p><strong>Tâche :</strong> ${task.title}</p>
            <p>
              <strong>Statut :</strong> 
              <span style="color: ${statusColors[oldStatus] || styles.textLight};">${statusLabels[oldStatus] || oldStatus}</span>
              →
              <span style="color: ${statusColors[newStatus] || styles.primary}; font-weight: bold;">${statusLabels[newStatus] || newStatus}</span>
            </p>
            ${task.description ? `<p><strong>Description :</strong> ${task.description}</p>` : ''}
            ${task.dueDate ? `<p><strong>Date d'échéance :</strong> ${new Date(task.dueDate).toLocaleDateString('fr-FR')}</p>` : ''}
          </div>
          
          ${task.url ? `<a href="${task.url}" class="button">Voir la tâche</a>` : ''}
        </div>
      `;
      
      return {
        subject: `Changement de statut : ${task.title}`,
        html: baseLayout(content, 'Changement de statut'),
        to: assignee.email
      };
    }
  };
  
  // Export pour utilisation dans Node.js ou navigateur
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = emailTemplates;
  }
  
  // Exemple d'utilisation
  /*
  const task = {
    title: 'Créer la page d\'accueil',
    description: 'Développer la nouvelle page d\'accueil avec React',
    priority: 'Haute',
    dueDate: '2026-01-20',
    assignedBy: 'Jean Dupont',
    url: 'https://app.example.com/tasks/123'
  };
  
  const assignee = {
    name: 'Marie Martin',
    email: 'marie.martin@example.com'
  };
  
  const email = emailTemplates.taskAssigned(task, assignee);
  
  // Envoyer l'email avec votre service d'email préféré
  // sendEmail(email.to, email.subject, email.html);
  */