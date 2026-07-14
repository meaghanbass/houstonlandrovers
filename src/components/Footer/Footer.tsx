import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col gap-8 max-w-8xl mx-6 md:mx-auto items-start justify-between bg-black text-white rounded-[40px] p-6 my-6 md:flex-row md:items-center md:p-9 md:my-9">
      <div>
        <h4 className="md:mb-3">Houston Land Rovers</h4>

        <p className="text-white/75! italic">
          Houston-area club for Land Rover owners
        </p>
      </div>

      <div>
        <nav className="flex items-center justify-end gap-4 text-right mb-3">
          <Link href="/">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/owner-resources">Owner Resources</Link>
        </nav>

        <p>© 2026 Houston Land Rovers</p>
      </div>
    </footer>
  );
};

export default Footer;
