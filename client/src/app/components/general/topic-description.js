const TopicDescription = ({ description, translate }) => {
  return (
    <div className="bg-gray-100 p-6 max-w-7xl mx-auto rounded-bl-lg rounded-br-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{translate("Description")}</h2>
      <p className="text-gray-700 text-center">{description}</p>
    </div>
  );
};

export default TopicDescription;