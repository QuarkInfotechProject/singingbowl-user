"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Loader2,
} from "lucide-react";
import Socialmedia from "@/components/Socialmedia";
import { toast } from "sonner";
import CountryCodeDropdown from "@/components/ui/CountryCodeDropdown";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    subject: "",
    message: "",
  });
  const [countryCode, setCountryCode] = useState("+977");

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Combine country code and phone number
    const fullPhone = formData.contactNumber ? `${countryCode} ${formData.contactNumber}` : "";

    try {
      const response = await fetch("/api/user/general-support/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: fullPhone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", contactNumber: "", subject: "", message: "" });
        setCountryCode("+977");
        toast.success("Message sent successfully! We'll get back to you soon.");
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        toast.error(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Header */}
      <div className="pt-20 pb-12 text-center">
        <h1 className="text-5xl font-light text-slate-900 mb-3">
          Get in Touch
        </h1>
        <p className="text-lg text-slate-600">
          We'd love to hear from you. Send us a message.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Welcome Message Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16 border border-blue-200 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-light text-slate-900 mb-4">
              Welcome to Our Singing Bowl Journey
            </h2>
            <p className="text-slate-700 leading-relaxed">
              We warmly invite our clients to engage with us on a journey
              through the world of singing bowls. Whether you're interested in
              factory tours to witness firsthand the meticulous craftsmanship
              behind each bowl, purchasing singingbowls, exploring healing
              classes to deepen your understanding of sound therapy, or
              acquiring exquisite antique products steeped in cultural heritage,
              we are here to guide you. Our commitment to quality, authenticity,
              and spiritual resonance ensures that every experience with us
              enriches your connection to these ancient instruments. Contact us
              today to discover how you can embark on a transformative
              exploration of singing bowls, blending tradition with contemporary
              insights for enhanced well-being and spiritual growth.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* Contact Details Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-light text-slate-900 mb-6">
                  Contact Details
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Mail className="w-5 h-5" style={{ color: "#A12717" }} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Email</p>
                      <a
                        href="mailto:singingbowlvillagenepal@gmail.com"
                        className="text-slate-900 hover:text-[#A12717] transition-colors font-medium"
                      >
                        singingbowlvillagenepal@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Phone className="w-5 h-5" style={{ color: "#39B856" }} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Phone</p>
                      <a
                        href="tel:+1234567890"
                        className="text-slate-900 hover:text-[#39B856] transition-colors font-medium"
                      >
                        +977-9851352794,
                        <br />
                        +977-9843488252
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <MapPin
                        className="w-5 h-5"
                        style={{ color: "#72479C" }}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Address</p>
                      <p className="text-slate-900 font-medium">
                        Kwabahal Chowk & Jyatha Street
                        <br />
                        Thamel-17 Kathmandu, Nepal
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-light text-slate-900 mb-5">
                  Follow Us
                </h3>
                <Socialmedia background="white" />
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 lg:p-10 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-light text-slate-900 mb-8">
                Send us a Message
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A12717] focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39B856] focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="contactNumber"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Contact Number
                    </label>
                    <div className="flex">
                      <CountryCodeDropdown
                        value={countryCode}
                        onChange={setCountryCode}
                        className="[&_button]:rounded-r-none [&_button]:h-[50px]"
                      />
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="flex-1 min-w-0 px-4 py-3 h-[50px] rounded-r-lg bg-slate-50 border border-slate-200 border-l-0 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-[#72479C] transition-all"
                        placeholder="98XXXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#72479C] focus:border-transparent transition-all"
                      placeholder="What's this about?"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A12717] focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg font-medium text-white transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "#A12717",
                    backgroundImage:
                      "linear-gradient(135deg, #A12717 0%, #8B1F12 100%)",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>

                {submitted && (
                  <div className="p-4 rounded-lg bg-green-50 border border-[#39B856] text-[#39B856]">
                    <p className="text-sm font-medium">
                      ✓ Message sent successfully! We'll get back to you soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 ">
          <div className="bg-white rounded-2xl mt-20 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-120">
            <iframe
              src={process.env.NEXT_PUBLIC_GOOGLE_MAPS_GALLERY_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="bg-white rounded-2xl mt-20 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-120">
            <iframe
              src={process.env.NEXT_PUBLIC_GOOGLE_MAPS_VILLAGE_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
