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
      className="relative min-h-screen w-full bg-[#0B0F19] py-20 px-0 text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight">
            Contact <span className="text-[#3EE0C5]">Us</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            We’d love to hear from you. Reach out for queries, collaborations,
            or guidance.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Contact Info */}
          <div className="bg-[#141A28] border border-gray-800 rounded-2xl p-10 shadow-md">
            <h3 className="text-2xl font-semibold mb-10">Get in Touch</h3>

            <div className="space-y-8">
              {/* Location */}
              <div className="flex items-start gap-5">
                <div className="bg-[#3EE0C5]/10 p-3 rounded-lg text-[#3EE0C5]">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-400">Serampore, Kolkata – 712203</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-5">
                <div className="bg-[#3EE0C5]/10 p-3 rounded-lg text-[#3EE0C5]">
                  <FiPhone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  {/* <p className="text-gray-400">+91 84788 05171</p> */}

                   <a
                    href="tel:+917679489050"
                    className="text-gray-400 hover:text-cyan-400 transition"
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
                  {/* <p className="text-gray-400">microdomeclasses2@gmail.com</p> */}

                    <a
                    href="mailto:microdomeclasses2@gmail.com"
                    className="text-gray-400 hover:text-cyan-400 transition"
                  >
                    microdomeclasses2@gmail.com
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
                      className="text-gray-400 hover:text-[#3EE0C5] transition text-xl"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#141A28] border border-gray-800 rounded-2xl p-10 shadow-md">
            <h3 className="text-2xl font-semibold mb-10">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full bg-[#0B0F19] border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3EE0C5]"
                required
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full bg-[#0B0F19] border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3EE0C5]"
                required
              />

              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="w-full bg-[#0B0F19] border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3EE0C5]"
                required
              />

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-[#3EE0C5] text-black font-semibold py-3 rounded-lg hover:bg-[#32cbb2] transition disabled:opacity-50"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>

              {status === "success" && (
                <p className="text-green-400 text-sm mt-2">
                  Message sent successfully!
                </p>
              )}

              {status === "error" && (
                <p className="text-red-400 text-sm mt-2">
                  Failed to send message. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
