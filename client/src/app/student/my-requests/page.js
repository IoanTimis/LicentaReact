"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import RequestCard from "@/app/components/general/request-card";

export default function StudentRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get("/student/fetch/requested-topics", { withCredentials: true });
        setRequests(response.data.requests);
      } catch (error) {
        console.error("Eroare la obținerea cererilor:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = async (requestId) => {
    try {
      await axiosInstance.delete(`/student/request/delete/${requestId}`, { withCredentials: true });
      setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
      console.log("Cererea a fost ștearsă.");
    } catch (error) {
      console.error("Eroare la ștergerea cererii:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 p-8">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {requests.map((request) => (
        <div key={request.id} className=""> {/* Card ocupă 2 coloane */}
          <RequestCard request={request} handleDelete={handleDelete} />
        </div>
      ))}
    </div>
   </div>
  );
}
