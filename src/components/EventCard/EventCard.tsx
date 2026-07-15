export type EventCardProps = {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  address?: string;
  mapLink?: string;
  description?: string;
};

const EventCard = ({
  title,
  date,
  time,
  location,
  address,
  mapLink,
  description,
}: EventCardProps) => {
  return (
    <div className="border border-gray-300 p-4 mb-6">
      <h5 className="text-lg font-bold mb-2">{title}</h5>

      <p className="text-sm text-gray-500">
        <b>Date</b>: {date}
      </p>

      {time && (
        <p className="text-sm text-gray-500">
          <b>Time</b>: {time}
        </p>
      )}

      {location && (
        <p className="text-sm text-gray-500">
          <b>Location</b>: {location}
        </p>
      )}

      {address && (
        <p className="text-sm text-gray-500">
          <b>Address</b>:{" "}
          <a href={mapLink} target="_blank" rel="noopener noreferrer">
            {address}
          </a>
        </p>
      )}

      {/* {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )} */}
    </div>
  );
};

export default EventCard;
