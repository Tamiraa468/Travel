"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Globe,
} from "lucide-react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    message: "",
    isError: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: "", isError: false });
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus({
        message:
          "Message sent successfully! We'll get back to you within 24 hours.",
        isError: false,
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({
        message: "Failed to send message. Please try again.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Updated: Official company email for all contact
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "info@maralgoodreamland.com",
      link: "mailto:info@maralgoodreamland.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+976 89475188",
      link: "tel:+97689475188",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Ulaanbaatar, Mongolia",
      link: null,
    },
    {
      icon: Clock,
      title: "Working Hours",
      value: "Mon - Sat: 9AM - 6PM",
      link: null,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-sand">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-forest-900 via-forest-700 to-forest-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 border border-gold-500/30 rounded-full text-gold-300 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            We&apos;d Love to Hear From You
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-200">
              Get in Touch
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone text-lg max-w-2xl mx-auto"
          >
            Have questions about our tours? We&apos;re here to help you plan
            your perfect adventure.
          </motion.p>
        </div>
      </section>

      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-ivory rounded-2xl p-6 shadow-sm border border-sand hover:shadow-md hover:border-gold-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-300 to-gold-500 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-900 mb-1">
                        {item.title}
                      </h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-gold-700 hover:text-gold-500 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-charcoal">{item.value}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-forest-700 to-forest-900 rounded-2xl p-6 text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-gold-300" />
                  <h3 className="font-semibold">Follow Us</h3>
                </div>
                <div className="flex gap-3">
                  {["facebook", "instagram", "twitter"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <span className="text-xs uppercase font-bold">
                        {social[0]}
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 bg-ivory rounded-2xl shadow-sm border border-sand overflow-hidden"
            >
              {/* Form Header */}
              <div className="bg-gradient-to-r from-forest-700 to-forest-900 px-8 py-6">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
                <h2 className="text-2xl font-serif font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-300 to-gold-300">
                    Send us a Message
                  </span>
                </h2>
                <p className="text-gold-300/70 mt-1">
                  We typically respond within 24 hours
                </p>
              </div>

              {/* Form Body */}
              <div className="p-8">
                {/* Status Message */}
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-start gap-3 mb-6 ${
                      status.isError
                        ? "bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200"
                        : "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        status.isError ? "bg-rose-500" : "bg-emerald-500"
                      }`}
                    >
                      {status.isError ? (
                        <AlertCircle className="w-4 h-4 text-white" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        status.isError ? "text-rose-700" : "text-emerald-700"
                      }`}
                    >
                      {status.message}
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="flex items-center gap-2 text-sm font-semibold text-forest-900"
                    >
                      <User className="w-4 h-4 text-gold-500" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-sand rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-gold-300 transition-all placeholder:text-stone bg-white"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="flex items-center gap-2 text-sm font-semibold text-forest-900"
                    >
                      <Mail className="w-4 h-4 text-gold-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border-2 border-sand rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-gold-300 transition-all placeholder:text-stone bg-white"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="flex items-center gap-2 text-sm font-semibold text-forest-900"
                    >
                      <MessageSquare className="w-4 h-4 text-gold-500" />
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us about your travel plans or ask any questions..."
                      className="w-full px-4 py-3 border-2 border-sand rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-gold-300 transition-all placeholder:text-stone resize-none bg-white"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-forest-700 to-forest-900 hover:from-forest-900 hover:to-forest-900 shadow-lg shadow-forest-900/30 hover:shadow-xl hover:shadow-forest-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
