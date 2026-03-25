const EventCard = ({ title, date, location, description }) => {
  return (
    <div className="border border-gray-300 p-4">
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-sm text-gray-500">
        <b>Date</b>: {date}
      </p>
      <p className="text-sm text-gray-500">
        <b>Location</b>: {location}
      </p>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
};

export default EventCard;
