import React, { useState } from "react";
import { FiMapPin, FiPhone, FiMail, FiSend } from "react-icons/fi";
import {
  FaGithub,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaFacebook,
} from "react-icons/fa";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch(`${ApiUrl}/message/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setStatus(data.success ? "success" : "error");

      if (data.success) {
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error("Error:", err);
      setStatus("error");
    }
  };

  const socialLinks = [
    {
      icon: <FaYoutube />,
      url: "https://www.youtube.com/@MicroDomeClasses",
      color: "hover:text-gray-200",
    },
    {
      icon: <FaLinkedinIn />,
      url: "https://in.linkedin.com/in/sayan-ganguly-5883831bb",
      color: "hover:text-blue-400",
    },
    {
      icon: <FaFacebook />,
      url: "https://www.facebook.com/profile.php?id=100014111567971&ref=ig_profile_ac",
      color: "hover:text-sky-400",
    },
    {
      icon: <FaInstagram />,
      url: "https://www.instagram.com/say_an_02?igsh=c2JocGhiODIxeDR4",
      color: "hover:text-pink-400",
    },
  ];

  return (
    <section
      id="contact"
      className="
      relative min-h-screen w-full py-20 px-0
      bg-white text-gray-900
      dark:bg-[#0B0F19] dark:text-white
    "
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight">
            Contact <span className="text-[#3EE0C5]">Us</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            We’d love to hear from you. Reach out for queries, collaborations,
            or guidance.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Contact Info */}
          <div
            className="
            bg-white border border-gray-200
            dark:bg-[#141A28] dark:border-gray-800
            rounded-2xl p-5 shadow-md
          "
          >
            <h3 className="text-2xl font-semibold mb-10">Get in Touch</h3>

            <div className="space-y-8">
              {/* Location */}
              <div className="flex items-start gap-5">
                <div className="bg-[#3EE0C5]/10 p-3 rounded-lg text-[#3EE0C5]">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Serampore, Kolkata – 712203
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-5">
                <div className="bg-[#3EE0C5]/10 p-3 rounded-lg text-[#3EE0C5]">
                  <FiPhone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <a
                    href="tel:+918478805171"
                    className="text-gray-600 dark:text-gray-400 hover:text-[#3EE0C5] transition"
                  >
                    +91 84788 05171
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-5">
                <div className="bg-[#3EE0C5]/10 p-3 rounded-lg text-[#3EE0C5]">
                  <FiMail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:microdomeclasses2@gmail.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-[#3EE0C5] transition"
                  >
                    microdomeclasses2 @gmail.com
                  </a>
                </div>
              </div>

              {/* Social */}
              <div>
                <p className="font-medium mb-4">Follow Us</p>
                <div className="flex space-x-5">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 dark:text-gray-400 hover:text-[#3EE0C5] transition text-xl"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-lg transition-all duration-300">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-white
                 placeholder-gray-500 dark:placeholder-gray-400
                 focus:outline-none focus:ring-2
                 focus:ring-teal-400 focus:border-teal-400"
                placeholder="Your Name"
                required
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-white
                 placeholder-gray-500 dark:placeholder-gray-400
                 focus:outline-none focus:ring-2
                 focus:ring-teal-400 focus:border-teal-400"
                placeholder="Your Email"
                required
              />

              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-white
                 placeholder-gray-500 dark:placeholder-gray-400
                 resize-none focus:outline-none focus:ring-2
                 focus:ring-teal-400 focus:border-teal-400"
                placeholder="Your Message"
                required
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "sending"}
                className={`w-full flex justify-center items-center px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                  status === "sending"
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-teal-400 text-black hover:bg-teal-500 shadow-md"
                }`}
              >
                {status === "sending" ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black dark:text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <FiSend className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>

              {/* Status Messages */}
              {status === "success" && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-700">
                  Message sent successfully! We’ll get back to you soon.
                </div>
              )}

              {status === "error" && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-700">
                  Failed to send message. Try again later or email us
                  directly.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;





