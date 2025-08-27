import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaLinkedin, FaInstagram, FaEnvelope, FaGlobe } from "react-icons/fa"; 
import AbhijitPic from "../assets/abhijit_pic.jpg";
import SouravPic from "../assets/Sourav_pic.jpg";
import RohitPic from "../assets/image.jpg";

const founders = [
  {
    name: "Rohit Gupta",
    role: "Full Stack Developer",
    img: RohitPic,
    email: "rg954792@gmail.com",
    linkedin: "https://www.linkedin.com/in/rohit-gupta-a6a53222a/",
    website: "https://www.facebook.com/profile.php?id=100026654993111", 
    instagram: "https://www.instagram.com/rohit_gupta_0810/",
  },
  {
    name: "Sourav Ghosh",
    role: "Full Stack Developer",
    img: SouravPic,
    email: "inbox.souravghosh@gmail.com",
    linkedin: "https://www.linkedin.com/in/souravghosh121/",
    website: "https://souravghosh.me/",
    instagram: "https://www.instagram.com/souravghoshofficial/",
  },
  {
    name: "Abhijit Rabidas",
    role: "Full Stack Developer",
    img: AbhijitPic,
    email: "abhijit.rabidas.mca@gmail.com",
    linkedin: "https://www.linkedin.com/in/abhijit-rabidas/",
    website: "https://www.abhijitrabidas.live/",
    instagram: "https://www.instagram.com/aj_das_01/",
  },
];

const Developers = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-16 px-6 transition-colors duration-500">
      <h1
        className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12 mt-10"
        data-aos="fade-down"
      >
        Meet Our <span className="text-highlighted">Developers</span>
      </h1>

      <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto mt-23">
        {founders.map((founder, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition duration-300"
            data-aos="zoom-in"
          >
            <img
              src={founder.img}
              alt={founder.name}
              className="w-40 h-40 object-cover rounded-full border-4 border-highlighted shadow-md"
            />
            <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {founder.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{founder.role}</p>
            <a
              href={`mailto:${founder.email}`}
              className="mt-2 text-sm text-highlighted dark:text-highlighted flex items-center gap-2 hover:underline"
            >
              <FaEnvelope /> {founder.email}
            </a>

            {/* Social Links */}
            <div className="flex gap-4 mt-4 text-xl text-gray-600 dark:text-gray-300">
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <FaLinkedin />
              </a>
              <a
                href={founder.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <FaGlobe /> 
              </a>
              <a
                href={founder.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Developers;
