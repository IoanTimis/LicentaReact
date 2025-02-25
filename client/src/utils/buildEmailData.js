export function BuildEmailData (data) {
  const { to, title, actionMakerEmail, action, language, role } = data;

  if (!to || !title || !actionMakerEmail || !action || !language  || !role) {
    throw new Error("All fields are required.");
  }

  let subject = "";
  let message = "";
  let status = "";

  if(action === "deleteRequest") {
    if(language === "ro") {
      subject = "Cerere ștearsă";
      if (role === "student") {
        message = "Cererea facuta de student a fost ștearsă.";
      }
      else {
        message = "Cererea ta a fost ștearsă de către profesor.";
      }
      status = "Ștearsă";
    }
    else {
      subject = "Request deleted";
      if (role === "student") {
        message = "The request made by the student has been deleted.";
      }
      else {
        message = "Your request has been deleted by the teacher.";
      }
      status = "Deleted";
    }

    const data = {
      to,
      title,
      actionMakerEmail,
      status,
      message,
      subject,
      language,
      role,
    };

    return data;
  } else if (action === "acceptRequest") {
    if(language === "ro") {
      subject = "Cerere acceptată";
      message = "Cererea ta a fost acceptată.";
      status = "Acceptată";
    }
    else {
      subject = "Request accepted";
      message = "Your request has been accepted.";
      status = "Accepted";
    }

    const data = {
      to,
      title,
      actionMakerEmail,
      status,
      message,
      subject,
      language,
      role,
    };

    return data;
  } else if (action === "rejectRequest") {
    if(language === "ro") {
      subject = "Cerere respinsă";
      message = "Cererea ta a fost respinsă.";
      status = "Respinsă";
    }
    else {
      subject = "Request rejected";
      message = "Your request has been rejected.";
      status = "Rejected";
    }

    const data = {
      to,
      title,
      actionMakerEmail,
      status,
      message,
      subject,
      language,
      role,
    };

    return data;
  } else if (action === "confirmRequest") {
    if(language === "ro") {
      subject = "Tema confirmată";
      message = "Un student a confirmat una dintre temele tale.";
      status = "Confirmată";
    }
    else {
      subject = "Theme confirmed";
      message = "An student has confirmed one of your themes.";
      status = "Confirmed";
    }

    const data = {
      to,
      title,
      actionMakerEmail,
      status,
      message,
      subject,
      language,
      role,
    };

    return data;
  } else if (action === "newRequest") {
    if(language === "ro") {
      subject = "Cerere nouă";
      message = "Un student a făcut o cerere pentru una dintre temele tale.";
      status = "Nouă";
    }
    else {
      subject = "New request";
      message = "A student has made a request for one of your themes.";
      status = "New";
    }

    const data = {
      to,
      title,
      actionMakerEmail,
      status,
      message,
      subject,
      language,
      role,
    };

    return data;
  } else {
    throw new Error("Invalid action.");
  }
}
