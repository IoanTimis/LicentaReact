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

  const handleConfirm = async (requestId) => {
    try {
      await axiosInstance.put(`/student/request/confirm/${requestId}`, { withCredentials: true });
  
      setRequests((prevRequests) =>
        prevRequests
          .map((request) => {
            if (request.id === requestId) {
              return { ...request, status: "confirmed" };
            }
            return request;
          })
          .filter((request) => request.id === requestId)
      );
  
      console.log("Cererea a fost confirmată. Celelalte cereri au fost eliminate.");
    } catch (error) {
      console.error("Eroare la confirmarea cererii:", error);
    }
  };
  

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
    <div className="min-h-screen bg-gray-100 p-8">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {requests.map((request) => (
        <div key={request.id}> 
          <RequestCard request={request} handleDelete={handleDelete} handleConfirm={handleConfirm} />
        </div>
      ))}
    </div>
   </div>
  );
}
