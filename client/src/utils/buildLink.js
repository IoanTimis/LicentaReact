export function BuildLink (data) {
  const { action, role , id } = data;

  console.log("Data received:", data);

  if (!action || !role || !id) {
    throw new Error("All fields are required.");
  }

  let dns = "http://localhost:3000/";
  let path = "";
  const StudentRequestPath = `student/my-request/${id}`;
  const TeacherRequestPath = `teacher/student-request/${id}`;
  let link = "";
  

  if (role === "teacher") {
    if (action === "AcceptRequest") {
      link = `${dns}${StudentRequestPath}`;
    } else if (action === "rejectRequest") {
      link = `${dns}${StudentRequestPath}`;
    } else if (action === "newComment") {
      link = `${dns}${StudentRequestPath}`;
    }
  } else {
    if (action === "newRequest") {
      link = `${dns}${TeacherRequestPath}`;
    } else if (action === "confirmRequest") {
      link = `${dns}${TeacherRequestPath}`;
    } else if (action === "newComment") {
      link = `${dns}${TeacherRequestPath}`;
    }
  }

  console.log("Link generated:", link);

  return link;
}