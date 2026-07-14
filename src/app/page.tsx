import Image from "next/image";
import AnimateInView from "@/components/AnimateInView/AnimateInView";
import RegistrationButtonModal from "@/components/RegistrationButtonModal/RegistrationButtonModal";

export default function Home() {
  return (
    <>
      <section className="max-w-8xl mx-auto px-6 py-[90px] md:px-9">
        <AnimateInView direction="up" fade>
          <h1>
            Houston
            <br className="xl:hidden" />
            <span className="light text-[#7C7C7C]">LandRovers</span>
          </h1>
        </AnimateInView>

        <AnimateInView direction="up" fade delay={200}>
          <p className="medium mt-8">
            Houston-area club for Land Rover owners — trail runs, meetups, tech
            help, and camaraderie.
          </p>
        </AnimateInView>

        <div className="flex gap-10 mt-8">
          <AnimateInView direction="up" fade delay={400}>
            <div>
              <p className="text-sm! uppercase text-black/50! ">Location</p>
              <p className="text-sm! uppercase text-black!">Houston, TX</p>
            </div>
          </AnimateInView>

          <AnimateInView direction="up" fade delay={400}>
            <div>
              <p className="text-sm! uppercase text-black/50!">Vehicles</p>
              <p className="text-sm! uppercase text-black!">
                Land Rovers 1948 - Current
              </p>
            </div>
          </AnimateInView>
        </div>
      </section>

      <section className="max-w-8xl mx-auto px-6 py-[90px] md:px-9">
        <div className="relative w-full h-[800px] rounded-[40px] overflow-hidden px-[70px] py-[50px] xl:px-[130px] xl:py-[150px] flex flex-col justify-end">
          <AnimateInView direction="up" fade delay={600}>
            <div className="absolute inset-0">
              <Image
                src="/1955oeoxfordatspeed.jpg"
                alt="Houston Land Rovers"
                width={1200}
                height={800}
                className="relative w-full h-full object-cover filter-[brightness(50%)]"
                preload={true}
              />
              <div className="absolute inset-0 w-full h-full bg-[#6A4629] opacity-50"></div>
            </div>
          </AnimateInView>

          <div className="relative flex flex-col gap-[50px] lg:flex-row lg:gap-[100px]">
            <AnimateInView direction="left" fade>
              <div className="grow">
                <h2 className="text-white opacity-75! whitespace-nowrap">
                  Beyond the <br />
                  pavement
                </h2>
              </div>
            </AnimateInView>

            <AnimateInView direction="right" fade>
              <div className="shrink">
                <p className="text-[17.5px] tracking-[-1%] text-white!">
                  Owning a Land Rover isn&apos;t just about getting from A to B
                  — it&apos;s about the stories you tell when the road ends.
                  Houston Land Rovers is a collective of enthusiasts dedicated
                  to preserving the heritage, mastering the mechanics, and
                  exploring the great outdoors. From technical trail runs to
                  local &ldquo;coffee and casings&rdquo; meetups, we&apos;re
                  more than a club. We&apos;re your gateway to the wild.
                </p>
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-[90px] md:px-9">
        <AnimateInView direction="up" fade>
          <p className="medium uppercase mb-4 tracking-[-1%]">
            Built for the long haul
          </p>
        </AnimateInView>

        <AnimateInView direction="up" fade>
          <h3>
            Join a community of explorers, gearheads, and weekend warriors
            dedicated to the world’s most versatile 4x4s.
          </h3>
        </AnimateInView>
      </section>

      <section className="flex flex-col items-center gap-10 max-w-8xl mx-auto px-6 py-[180px] md:px-9">
        <AnimateInView direction="up" fade>
          <div>
            <h3 className="text-center">Join the Rovers</h3>

            <p className="text-center text-balance max-w-[700px] mt-6">
              Membership is completely free. Get a heads up on upcoming meetups
              and events in the Houston area.
            </p>
          </div>
        </AnimateInView>

        <AnimateInView direction="up" fade>
          <div>
            <RegistrationButtonModal />
          </div>
        </AnimateInView>
      </section>

      {/* Old stuff */}
      {/* <section className="relative h-screen w-full">
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

          <h1 className="text-[12vw]! uppercase leading-none!">
            THE GULF&apos;S <br />
            FINEST 4X4s
          </h1>
        </div>
      </section> */}
      {/* <section className="mx-6 md:mx-8 xl:max-w-[1300px] xl:mx-auto py-20 md:py-32">
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
      </section> */}
      {/* <section className="mx-6 md:mx-8 xl:max-w-[1300px] xl:mx-auto py-20 md:py-32">
        <div className="relative h-[400px] p-8 text-center">
          <Image
            src="/topo-bg.jpg"
            alt=""
            role="presentation"
            width={1000}
            height={400}
            className="absolute inset-0 h-full w-full object-cover rounded-lg"
          />

          <div className="relative flex flex-col justify-center items-center gap-6 w-full h-full">
            <h2>Join the Convoy</h2>

            <p className="font-bold text-black! text-balance">
              Membership is completely free. Get a heads up on upcoming meetups
              and events in the Houston area.
            </p>

            <RegistrationButtonModal />
          </div>
        </div>
      </section> */}
    </>
  );
}
