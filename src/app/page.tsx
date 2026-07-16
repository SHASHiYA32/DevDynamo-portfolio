"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Phone,
  Globe,
  Zap,
  ShieldCheck,
  Palette,
  Server,
  Layers3,
  LifeBuoy,
  GitBranchMinus,
  GitBranchPlus,
  Code2,
  Terminal,
  ServerCog,
  Database,
  Layout,
  Cloud,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      // Add 'as [number, number, number, number]' to satisfy the Easing type
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

// --- Data ---
const services = [
  { name: "Website Development", icon: Globe },
  { name: "Web Applications", icon: Layers3 },
  { name: "UI/UX Design", icon: Palette },
  { name: "API Development", icon: Server },
  { name: "Cloud Deployment", icon: Zap },
  { name: "Maintenance", icon: LifeBuoy },
];

const technologies = [
  { name: "Next.js", icon: Globe },
  { name: "React", icon: Code2 },
  { name: "TypeScript", icon: Terminal },
  { name: "Node.js", icon: ServerCog },
  { name: "Supabase", icon: Database },
  { name: "PostgreSQL", icon: Database },
  { name: "Tailwind CSS", icon: Layout },
  { name: "AWS / Vercel", icon: Cloud },
  { name: "GitHub", icon: GitBranchPlus },
];

const processSteps = [
  "Requirement",
  "Planning",
  "Design",
  "Development",
  "Testing",
  "Deployment",
  "Support",
];

const projects = [
  {
    title: "Personal Finance Tracker",
    tech: "Next.js/Supabase",
    link: "https://personal-finance-tracker-psi-six.vercel.app/",
  },
  {
    title: "Task Management System",
    tech: "React/Tailwind",
    link: "https://task-manage-gold.vercel.app/",
  },
];

export default function DevDynamoPage() {
  return (
    <main className="min-h-screen bg-[#050509] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* --- Enhanced Background --- */}
      <div className="fixed inset-0 z-0 bg-[#050509]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* The Mesh Gradient Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* --- 1. Hero Section --- */}
        <section className="h-screen flex flex-col justify-center items-center text-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 space-y-6 max-w-4xl"
          >
            <Badge
              variant="outline"
              className="border-blue-500/30 text-blue-300 bg-blue-500/10 backdrop-blur-sm px-4 py-1.5 rounded-full"
            >
              Available for new projects
            </Badge>

            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter">
              <span className="block">We Are</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-emerald-400 pb-2">
                DevDynamo.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light">
              We architect high-performance, stunning digital experiences for
              forward-thinking startups.
            </p>

            <motion.div
              className="flex gap-4 justify-center pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button className="bg-white text-black hover:bg-slate-200 text-lg px-8 py-6 rounded-full group">
                Explore Work
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                className="text-lg text-slate-300 hover:text-white hover:bg-white/5 px-8 py-6 rounded-full"
              >
                Contact Us
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll down indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center p-1">
              <div className="w-1.5 h-3 bg-slate-500 rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* --- Content Container with Scroll Reveal --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-6 md:px-10 space-y-32 pb-32"
        >
          {/* --- 2. About Us & Expertise --- */}
          <section className="grid md:grid-cols-3 gap-10 items-start">
            <motion.div
              variants={itemVariants}
              className="md:col-span-1 sticky top-10"
            >
              <h2 className="text-4xl font-bold tracking-tight">
                Crafting digital excellence
              </h2>
              <p className="text-slate-400 mt-4">
                Based in Sri Lanka, we are a collective of passionate developers
                and designers obsessed with clean code and user experience.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="md:col-span-2 grid grid-cols-2 gap-4"
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  custom={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-lg hover:border-blue-500/30 transition-all duration-300 group"
                >
                  <service.icon
                    className="w-10 h-10 text-blue-400 mb-4 opacity-70 group-hover:opacity-100 transition-opacity"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* --- 3. Technologies (Updated to Glassy Cards) --- */}
          <section className="space-y-12">
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold tracking-tight text-center"
            >
              Tech Stack Arsenal
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {technologies.map((tech) => (
                <motion.div
                  key={tech.name}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(59, 130, 246, 0.5)",
                  }}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all cursor-default"
                >
                  <tech.icon
                    className="w-8 h-8 text-blue-400"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm font-medium text-slate-300">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* --- 4. Development Process (Animated Timeline) --- */}
          <section className="space-y-12">
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold tracking-tight text-center"
            >
              The DevDynamo Way
            </motion.h2>
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-7 gap-4"
            >
              {processSteps.map((step, index) => (
                <motion.div
                  key={step}
                  variants={itemVariants}
                  className="text-center relative flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg flex items-center justify-center text-2xl font-bold text-blue-400 z-10 mb-4">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-lg">{step}</h4>

                  {/* Connecting Line (hidden on mobile) */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-slate-700 -z-0" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* --- 5. Why Choose Us (Glass Cards) --- */}
          <section className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Clean Code",
                desc: "Scalable, maintainable, and readable codebases.",
                icon: Layers3,
              },
              {
                title: "Secure",
                desc: "Built with security best practices by default.",
                icon: ShieldCheck,
              },
              {
                title: "Support",
                desc: "Ongoing maintenance and rapid bug fixes.",
                icon: LifeBuoy,
              },
            ].map((item, i) => (
              <motion.div key={item.title} variants={itemVariants} custom={i}>
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-full hover:bg-white/10 transition-colors">
                  <CardContent className="p-8 space-y-4">
                    <item.icon
                      className="w-12 h-12 text-emerald-400"
                      strokeWidth={1}
                    />
                    <h3 className="w-fit text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-100">{item.title}</h3>
                    <p className="text-slate-400">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>

          {/* --- 6. Portfolio --- */}
          <section className="space-y-10">
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold tracking-tight"
            >
              Featured Builds
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <motion.div
                  key={project.title}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                >
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="aspect-[16/10] rounded-3xl bg-slate-800 border border-white/10 overflow-hidden relative mb-4">
                      {/* Placeholder for screenshot - replace with actual img tag */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <Globe className="w-20 h-20 text-slate-700 group-hover:text-blue-500/50 transition-colors" />
                      </div>
                      {/* Glass overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 backdrop-blur-sm transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white text-black px-6 py-3 rounded-full font-medium flex items-center gap-2">
                          Visit Site <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-400">{project.tech}</p>
                  </a>
                </motion.div>
              ))}
            </div>
          </section>

          {/* --- 7. Contact Footer --- */}
          <motion.footer
            variants={itemVariants}
            className="border-t border-white/10 pt-20 mt-20 grid md:grid-cols-3 gap-12 bg-white/[0.02] p-10 rounded-[2rem] border"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-bold tracking-tighter">DevDynamo</h3>
              <p className="text-slate-400">
                Ready to build something amazing? Get in touch with us today.
              </p>
            </div>

            <div className="space-y-4 text-slate-300">
              <a
                href="mailto:devdynamo@dev.com"
                className="flex items-center gap-3 hover:text-blue-400 w-fit"
              >
                <Mail size={20} /> devdynamo@dev.com
              </a>
              <a
                href="tel:0761234567"
                className="flex items-center gap-3 hover:text-blue-400 w-fit"
              >
                <Phone size={20} /> 076 123 4567
              </a>
            </div>

            <div className="flex gap-4 items-start md:justify-end">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="p-3 bg-white/5 rounded-full hover:bg-white/10"
              >
                <GitBranchPlus />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="p-3 bg-white/5 rounded-full hover:bg-white/10"
              >
                <Globe />
              </motion.a>
            </div>
          </motion.footer>
        </motion.div>
      </div>
    </main>
  );
}
