export function BuildEmailData (data) {
  const { to, title, actionMakerEmail, action, language } = data;

  if (!to || !title || !actionMakerEmail || !action || !language) {
    throw new Error("All fields are required.");
  }

  let subject = "";
  let message = "";
  let status = "";

  if(action === "deleteRequest") {
    if(language === "ro") {
      subject = "Cerere ștearsă";
      message = "Cererea ta a fost ștearsă.";
      status = "Ștearsă";
    }
    else {
      subject = "Request deleted";
      message = "Your request has been deleted.";
      status = "Deleted";
    }

    const data = {
      to,
      title,
      actionMakerEmail,
      status,
      message,
      subject
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
      subject
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
      subject
    };

    return data;
  }
}
