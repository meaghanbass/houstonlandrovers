import Image from "next/image";

type LogoProps = {
  withImage?: boolean;
  theme?: "black" | "white";
  className?: string;
};

const Logo = ({ withImage = false, theme = "black", className = "" }: LogoProps) => {
  return (
    <div className={`cursor-pointer ${className}`}>
      {withImage && (
        <Image
          src="/logo-image.svg"
          alt="Houston Land Rovers"
          width={208}
          height={95}
          className="mr-6"
        />
      )}

      {theme === "black" ? (
        <Image
          src="/logo-text-black.svg"
          alt="Houston Land Rovers"
          width={365}
          height={58}
        />
      ) : (
        <Image
          src="/logo-text-white.svg"
          alt="Houston Land Rovers"
          width={365}
          height={58}
        />
      )}
    </div>
  );
};

export default Logo;
