import {
  Poppins,
  Borel,
  Moirai_One,
  Birthstone,
  Limelight,
} from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const limelight = Limelight({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-limelight",
});

const borel = Borel({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-borel",
});

const moirai = Moirai_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-moirai",
});

const birthstone = Birthstone({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-birthstone",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`
          ${poppins.variable}
          ${borel.variable}
          ${moirai.variable}
          ${birthstone.variable}
          ${limelight.variable}
        `}
      >
        {children}
      </body>
    </html>
  );
}