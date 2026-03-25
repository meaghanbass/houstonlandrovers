import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Resources | Houston Land Rovers",
  description:
    "Resources for Houston Land Rovers club members and vehicle owners.",
};

type ResourceLink = {
  name: string;
  url: string;
};

const localShops: ResourceLink[] = [
  {
    name: "Motorcars Ltd",
    url: "https://www.motorcars-service.com",
  },
  {
    name: "Doc's Speed Shop",
    url: "https://docspeedshop.com",
  },
  {
    name: "Royal Street Rovers",
    url: "https://royalstreetrovers.com",
  },
];

const onlineParts: ResourceLink[] = [
  {
    name: "Rovers North",
    url: "https://www.roversnorth.com",
  },
  {
    name: "Britpart",
    url: "https://www.britpart.com",
  },
  {
    name: "Rover Parts",
    url: "https://www.roverparts.com",
  },
  {
    name: "LR Parts",
    url: "https://www.lrparts.net",
  },
  {
    name: "Exmoor Trim",
    url: "https://www.exmoortrim.co.uk",
  },
  {
    name: "AlliSport",
    url: "https://www.allisport.com",
  },
  {
    name: "ARB USA",
    url: "https://arbusa.com",
  },
  {
    name: "Front Runner",
    url: "https://www.frontrunner.com",
  },
  {
    name: "Emberton Imperial LTD",
    url: "https://embertonimperial.com",
  },
  {
    name: "Land Rover Dashboards",
    url: "https://landroverdashboards.com",
  },
  {
    name: "3 Brothers Classic Rovers",
    url: "https://3brothersclassicrovers.com",
  },
  {
    name: "Ministry of Defender",
    url: "https://ministryofdefender.co.uk",
  },
  {
    name: "Mantec",
    url: "https://www.mantec.co.uk",
  },
  {
    name: "Speedy Cables",
    url: "https://www.speedycables.com",
  },
  {
    name: "Fumoto",
    url: "https://www.fumotousa.com",
  },
  {
    name: "Lucari",
    url: "https://www.lucari-solutions.co.uk",
  },
  {
    name: "Mudstuff",
    url: "https://www.mudstuff.co.uk",
  },
];

// const otherInformation = [
//   {
//     name: "Original Land Rover Body Colors",
//     url: "https://www.houstonlandrovers.com",
//   },
// ];

export default function OwnerResourcesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-16 pt-24 md:px-10 md:pt-48">
      <h1>Owner Resources</h1>

      <h3 className="mt-8 mb-4">Local Shops, Services, & Restorations</h3>

      {localShops.map((shop) => (
        <p key={shop.name} className="mb-2">
          <a
            className="link"
            href={shop.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shop.name}
          </a>
        </p>
      ))}

      <h3 className="mt-8 mb-4">Online Parts & Accessories</h3>

      {onlineParts.map((part) => (
        <p key={part.name} className="mb-2">
          <a
            className="link"
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part.name}
          </a>
        </p>
      ))}

      {/* <h3 className="mt-8 mb-4">Other Information</h3> */}

      {/* {otherInformation?.map((info) => (
        <p key={info.name} className="mb-2">
          <a
            className="link"
            href={info.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {info.name}
          </a>
        </p>
      ))} */}
    </div>
  );
}
