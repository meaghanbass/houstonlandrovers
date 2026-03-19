import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="relative h-screen w-full">
        <div className="absolute inset-0 h-screen w-full overflow-hidden">
          <Image
            src="/L_Classic_Trophy_100221_31_2.jpeg"
            alt="Houston Land Rovers"
            width={1000}
            height={1000}
            className="absolute inset-0 h-full w-full object-cover filter-[blur(1px)_brightness(70%)]"
          />
        </div>

        <div className="relative left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 text-white">
          <div className="absolute top-3 bottom-1 -left-10 w-4 md:w-5 xl:w-6 bg-[#88A9CB]"></div>

          <h1 className="text-[14vw]! uppercase leading-none!">
            THE GULF&apos;S <br />
            FINEST 4X4s
          </h1>
        </div>
      </section>

      <section className="mx-6 md:mx-8 xl:max-w-[1300px] xl:mx-auto py-20 md:py-32">
        <h1 className="mb-20 md:mb-32 text-center">Beyond the Pavement.</h1>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <div className="w-full lg:w-1/2">
            <h3 className="mb-8">
              Join a community of explorers, gearheads, and weekend warriors
              dedicated to the world’s most versatile 4x4s.
            </h3>

            <p>
              Owning a Land Rover isn&apos;t just about getting from A to B —
              it&apos;s about the stories you tell when the road ends. Houston
              Land Rovers is a collective of enthusiasts dedicated to preserving
              the heritage, mastering the mechanics, and exploring the great
              outdoors. From technical trail runs to local &ldquo;coffee and
              casings&rdquo; meetups, we&apos;re more than a club. We&apos;re
              your gateway to the wild.
            </p>
          </div>

          <div className="w-full lg:w-1/2">
            <Image
              src="/pexels-esmihel-19721321-2.jpg"
              alt="Houston Land Rovers"
              className="w-full h-[400px] object-cover"
              width={500}
              height={400}
            />
          </div>
        </div>
      </section>
    </>
  );
}
