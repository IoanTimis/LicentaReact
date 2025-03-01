export const generateEmailContent = ({ 
  title, 
  actionMakerEmail, 
  status, 
  message, 
  role, 
  language, 
  link 
}) => {
  // Determinăm textul tradus
  const translations = {
    ro: {
      strongTitle: "Titlu Tema",
      strongEmail: role === "student" ? "Email Student:" : "Email Profesor:",
      strongStatus: "Stare:",
      strongMessage: "Mesaj:",
      clickHere: "Click aici",
      footer: "Mulțumim pentru utilizarea platformei UVT!"
    },
    en: {
      strongTitle: "Theme Title",
      strongEmail: role === "student" ? "Student Email:" : "Teacher Email:",
      strongStatus: "Status:",
      strongMessage: "Message:",
      clickHere: "Click here",
      footer: "Thank you for using the UVT platform!"
    }
  };

  const lang = translations[language] || translations.en;

  // Determinăm culoarea statusului
  const statusColor = ["Rejected", "Respinsă", "Ștearsă", "Deleted"].includes(status) ? "red" : "green";

  // Generăm conținutul emailului
  return `
    <div style="
      font-family: 'Arial', sans-serif; 
      color: #333; 
      max-width: 600px; 
      margin: 20px auto; 
      border: 1px solid #ccc; 
      border-radius: 10px; 
      padding: 20px; 
      font-size: 18px;">
      
      <h2 style="
        color: #007BFF; 
        text-align: center; 
        font-size: 26px;">
        Email Automat Informativ
      </h2>
      
      <hr style="margin: 20px 0;">
      
      <p style="margin-bottom: 15px;">
        <strong>${lang.strongTitle}</strong> 
        <span style="font-size: 20px;">${title}</span>
      </p>
      
      <p style="margin-bottom: 15px;">
        <strong>${lang.strongEmail}</strong> 
        <a href="mailto:${actionMakerEmail}" 
           style="font-size: 20px; color: #007BFF;">
           ${actionMakerEmail}
        </a>
      </p>
      
      <p style="margin-bottom: 15px;">
        <strong>${lang.strongStatus}</strong> 
        <span style="color: ${statusColor}; font-size: 20px;">
          ${status}
        </span>
      </p>
      
      <p style="margin-bottom: 15px;">
        <strong>${lang.strongMessage}</strong> 
        <span style="font-size: 20px;">${message}</span>
      </p>
      
      <hr style="margin: 20px 0;">
      
      <p style="text-align: center; font-size: 18px;">
        <a href="${link}" 
           style="color: #007BFF; text-decoration: none; font-size: 18px;">
          ${lang.clickHere}
        </a>
      </p>
      
      <p style="text-align: center; color: #888; font-size: 16px;">
        ${lang.footer}
      </p>
    </div>
  `;
};
