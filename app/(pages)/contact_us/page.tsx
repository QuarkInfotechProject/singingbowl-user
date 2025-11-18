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
} from "lucide-react";
import Socialmedia from "@/components/Socialmedia";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
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
                        href="mailto:hello@example.com"
                        className="text-slate-900 hover:text-[#A12717] transition-colors font-medium"
                      >
                        hello@example.com
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
                        +977 9851352794, 9841422331
                        <br />
                        01-5353501
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
                <Socialmedia />
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-10 shadow-sm hover:shadow-md transition-shadow">
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
                  className="w-full py-3 rounded-lg font-medium text-white transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: "#A12717",
                    backgroundImage:
                      "linear-gradient(135deg, #A12717 0%, #8B1F12 100%)",
                  }}
                >
                  Send Message
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1629301011144!2d85.3112074!3d27.7122553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18fdca609831%3A0x3e2bc4d23b67c920!2sSinging%20Bowl%20Gallery%20%26%20Museum%20by%20Freedom%20Export!5e0!3m2!1sen!2snp!4v1763465522005!5m2!1sen!2snp"
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
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7064.321028700457!2d85.3096129!3d27.7123299!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190fc5dffb3b%3A0xe3f6dadd18f9f5ba!2sSinging%20Bowl%20Village%20by%20Freedom%20Export!5e0!3m2!1sen!2snp!4v1763465399485!5m2!1sen!2snp"
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
