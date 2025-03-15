"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import TopicCard from "@/app/components/student/topic-card";
import RequestModal from "@/app/components/student/request-modal";
import FilterBar from "@/app/components/general/filter-bar";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import { useLanguage } from "@/context/Languagecontext";
import { setTopics, setFilteredTopics } from "@/store/features/topics/topicSlice";
import { useDispatch, useSelector } from "react-redux";
import { BuildEmailData } from "@/utils/buildEmailData";
import { sendEmail } from "@/app/api/sendEmail/page";
import { jwtDecode } from "jwt-decode";

export default function StudentTopics() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestedTopicId, setRequestedTopicId] = useState(null);
  const [requestedTopicTeacherId, setRequestedTopicTeacherId] = useState(null);
  const [requestedTopicEducationLevel, setRequestedTopicEducationLevel] = useState(null);
  const [hasConfirmedRequest, setHasConfirmedRequest] = useState(false);
  const { translate, language } = useLanguage();
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const [newRequestedTopic, setNewRequestedTopic] = useState(null);
  const [localUser, setLocalUser] = useState(null);
  const topics = useSelector((state) => state.topics.list);
  const filteredTopics = useSelector((state) => state.topics.filteredList);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [noMatch, setNoMatch] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const decodedToken = jwtDecode(accessToken);
    setLocalUser(decodedToken);
  }, []);

  // Fetch data from the server
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/student/fetch/topics", { withCredentials: true });

        setHasConfirmedRequest(response.data.hasConfirmedRequest);
        dispatch(setTopics(response.data.topics));
        dispatch(setFilteredTopics(response.data.topics));
      } catch (error) {
        console.error("Error fetching topics:", error);
        setGlobalErrorMessage(translate("An error occurred while fetching topics. Please try again."));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const onRequest = (topic_id) => {
    const selectedTopic = topics.find((topic) => topic.id === topic_id);

    if (!selectedTopic) return;

    setRequestedTopicId(topic_id);
    setRequestedTopicTeacherId(selectedTopic.user_id);
    setRequestedTopicEducationLevel(selectedTopic.education_level);
    toggleModal();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData(e.target);
  
      const newRequest = {
        topic_id: formData.get("topic_id"),
        teacher_id: formData.get("teacher_id"),
        education_level: formData.get("education_level"),
      };
  
      const response = await axiosInstance.post("/student/request/add", newRequest, {
        withCredentials: true,
      });

      console.log("Request sent successfully:", response.data.request);

      const commentMessage = formData.get("message");
      const requestId = response.data.request.id;

      const addComment = await axiosInstance.post(`/student/request/comment/add/${requestId}`, 
        { commentMessage }, { withCredentials: true });

      if(process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        const to = response.data.topic.user.email;
        const title = response.data.topic.title;
        const actionMakerEmail = localUser.email;
        const action = "newRequest";
        const role = "student";

        const data = {
          to,
          title,
          actionMakerEmail,
          action,
          language,
          role,
          id: requestId,
        };

        const emailData = BuildEmailData(data);

        sendEmail(emailData)
          .then(() => console.log("Email sent."))
          .catch((error) => console.error("Error sending email:", error));
      }
  
      console.log("Request sent successfully:", response.data);
      
      setNewRequestedTopic(response.data.request);

      toggleModal();
    } catch (error) {
      console.error("Error sending request:", error);
      setGlobalErrorMessage(translate("An error occurred while sending the request. Please try again."));
    }
  };

  const handleSearchAndFilter = async (searchQuery, filters) => {
    try {
      const response = await axiosInstance.get("/student/search-filter/topics", {
        params: {
          query: searchQuery,
          
        },
        withCredentials: true
      });
  
      if (response.status === 204) {
        setNoMatch(true);
        console.log("No requests found.");
        return;
      }
  
      setNoMatch(false);
      dispatch(setFilteredTopics(response.data.topics));
    } catch (error) {
      console.error("Error searching and filtering topics:", error);
      setGlobalErrorMessage(translate("An error occurred while searching and filtering topics. Please try again."));
      
    }
  };
  
  if(topics.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-700">{translate("No themes available.")}</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4">
      <FilterBar className="lg:w-1/4 w-full" 
        filterSearchDatabase={handleSearchAndFilter}
        filterOnDatabase={true} 
        noMatch={noMatch} 
      />

      <div className="lg:w-3/4 w-full p-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-6">
          {loading && <p className="text-center text-gray-700">{translate("Loading...")}</p>}
          {filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onRequest={onRequest}
              newRequestedTopic={newRequestedTopic}
              hasConfirmedRequest={hasConfirmedRequest}
              translate={translate}
              setGlobalErrorMessage={setGlobalErrorMessage}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSubmit={handleSubmit}
        requestedTopicId={requestedTopicId}
        requestedTopicTeacherId={requestedTopicTeacherId}
        requestedTopicEducationLevel={requestedTopicEducationLevel}
      />
    </div>
  );
}
