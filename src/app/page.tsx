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
  GitBranchPlus,
  Code2,
  Terminal,
  ServerCog,
  Database,
  Layout,
  Cloud,
  CheckCircle2,
  Copy,
  Code,
  GraduationCap,
  BadgeCheck,
  Handshake,
  CircleUserRound,
  Rocket,
  Smartphone,
  ArrowUpRight,
  CodeXml,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

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

const personal = [
  { label: "Phone", value: "0763513533" },
  { label: "Email", value: "nimsaraperera32@gmail.com" },
  {
    label: "GitHub",
    value: "https://github.com/SHASHiYA32",
  },
  { label: "Portfolio", value: "https://dev-dynamo-official.vercel.app/" },
];

const projects = [
  {
    title: "Personal Finance Tracker",
    tech: "Next.js/Supabase",
    link: "https://personal-finance-tracker-psi-six.vercel.app/",
  },
  {
    title: "TODO System",
    tech: "React/Tailwind",
    link: "https://next-js-todo-app-gamma-five.vercel.app/",
  },
];

const teamMembers = [
  {
    name: "Nimsara Perera",
    role: "Full-stack Developer",
    about:
      "Specializes in building high-performance web applications with a focus on clean, scalable architecture and modern design patterns.",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "php",
      "Tailwind CSS",
      "HTML",
      "CSS",
      "JavaScript",
    ],
    photo: "/team/nimsara.png",
    position: "Founder",
  },
  {
    name: "Kaushal Bandara",
    role: "Full-stack Developer",
    about:
      "Builds scalable web and mobile apps. Combines secure backends with hardware integration to connect physical devices to responsive digital interfaces.",
    skills: [
      "Java",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "C",
      "C++",
      "Python",
      "Dart",
    ],
    photo: "/team/Bkaushal.JPG",
    position: "Director",
  },
  {
    name: "Ahamed Rifan",
    role: "Testing Engineer, UI/UX Designer",
    about:
      "A detail-oriented QA engineer who believes that quality is not an act, but a habit. Jane ensures every pixel and function is polished to perfection before deployment.",
    skills: ["React", "Next.js", "TypeScript"],
    photo: "/team/img2.avif",
    position: "Director",
  },
];

const serviceItems = [
  {
    title: "Web Development",
    desc: "Corporate, WordPress, WooCommerce, and Shopify platforms that convert at enterprise scale.",
    icon: Globe,
    image: "/services/1784276448594.png",
  },
  {
    title: "Mobile Apps",
    desc: "Native iOS, Android, Flutter, and React Native apps built for enterprise performance and user adoption.",
    icon: Smartphone,
    image: "/services/1784276750112.png",
  },
  {
    title: "Software & Web apps",
    desc: "Transforming complex business requirements into high-performance web applications and custom software solutions designed for growth and scalability.",
    icon: CodeXml,
    image: "/services/1784276836692.png",
  },
  {
    title: "Hosting, Cloud, & Maintenance",
    desc: "Full-stack cloud management, 24/7 uptime monitoring, and dedicated maintenance to keep your enterprise infrastructure secure and scalable.",
    icon: Cloud,
    image: "/services/1784276933201.png",
  },
];

export default function DevDynamoPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const icons = [
    Mail,
    Phone,
    Globe,
    Zap,
    ShieldCheck,
    Rocket,
    CircleUserRound,
    Handshake,
    BadgeCheck,
    GraduationCap,
    Code,
    Database,
    Cloud,
    GitBranchPlus,
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToast({ message: `${label} copied!` });
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <main className="min-h-[100dvh] bg-[#050509] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-10 right-10 z-[100] flex items-center gap-3 bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/10 text-white px-5 py-3 rounded-2xl shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </motion.div>
            <span className="font-medium text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- Enhanced Background --- */}
      <div className="fixed inset-0 z-0 bg-[#050509]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* The Mesh Gradient Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <img
          src="/logo/DevDynamo.svg"
          itemType="svg"
          alt="DevDynamo"
          className="opacity-5 logosvg "
        />
      </div>

      <div className="relative z-10">
        {/* --- 1. Hero Section --- */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 space-y-6 max-w-4xl"
          >
            <Badge
              variant="outline"
              className="border-blue-500/30 text-blue-300 bg-blue-500/10 backdrop-blur-sm px-4 py-1.5 rounded-full animate-pulse"
            >
              Available for new projects
            </Badge>

            <div className="text-[54px] gap-5 md:text-8xl font-extrabold tracking-tighter">
              <span className="block">We Are</span>
              <span className="limelight block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-400 to-green-500 pb-2">
                DevDynamo.
              </span>
            </div>

            <p className="yuyu text-2xl md:text-3xl text-slate-400 max-w-3xl mx-auto font-light">
              We architect high-performance, stunning digital experiences for
              forward-thinking startups.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a
                className="bg-white text-black hover:bg-slate-200 text-lg px-8 py-6 rounded-full group cursor-pointer flex flex-row sm:w-full lg:w-fit h-8 justify-center items-center"
                href={personal[2].value}
              >
                Explore Work
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <Button
                variant="ghost"
                onClick={() => setIsContactOpen(true)}
                className="yuyu text-3xl font-black text-slate-300 hover:text-white hover:bg-white/10 px-8 py-6 rounded-full cursor-pointer"
              >
                Contact Us
              </Button>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {isContactOpen && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setIsContactOpen(false)}
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative bg-[#0b0b12] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl space-y-6"
                >
                  <h2 className="text-2xl font-bold">Get In Touch</h2>
                  <div className="space-y-3">
                    {personal.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => copyToClipboard(item.value, item.label)}
                        className="w-full flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
                      >
                        <span className="text-slate-400 pr-3">
                          {item.label}
                        </span>
                        <span className="font-mono text-blue-400 truncate">
                          {item.value}
                        </span>
                        <Copy className="w-4 h-4 text-slate-500 group-hover:text-blue-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

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
        <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-32 pb-32">
          {/* --- 2. About Us & Expertise --- */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="mt-30 grid md:grid-cols-3 gap-10 items-start"
          >
            <motion.div
              variants={itemVariants}
              className="md:col-span-1 sticky top-10"
            >
              <h2 className="text-4xl font-bold tracking-tight">
                Crafting digital excellence
              </h2>
              <p className="text-slate-400 mt-4 yuyu text-3xl">
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
                  <h3 className="sm:text-sm xl:text-2xl font-semibold">
                    {service.name}
                  </h3>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <div className="w-full overflow-hidden bg-transparent">
            <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: 25,
                  ease: "linear",
                  repeat: Infinity,
                }}
                className="flex flex-shrink-0 gap-16 px-8"
              >
                {[...icons, ...icons].map((Icon, i) => (
                  <div key={i} className="text-slate-400">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="space-y-12"
          >
            <span className="uppercase w-fit text-indigo-300 bg-indigo-500/10 border border-indigo-500 backdrop-blur-sm px-4 py-0.5 rounded-full animate-pulse mb-2">
              team
            </span>
            <h2 className="mt-3 text-4xl font-bold text-start flex sm:flex-row flex-col gap-2">Meet the <span className="limelight block bg-clip-text text-transparent bg-gradient-to-r from- bg-indigo-300 to-indigo-400">Team</span></h2>

            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-8 max-w-8xl mx-auto">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.name}
                  variants={itemVariants}
                  className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-lg flex flex-col items-center text-center gap-4 hover:border-blue-500/30 transition-all"
                >
                  <div className="w-full flex flex-col items-end px-2 text-sm">
                    <span className="border border-yellow-400 text-yellow-300 bg-amber-300/10 px-3 rounded-2xl ">
                      {member.position}
                    </span>
                  </div>
                  {/* Photo Container */}
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold">{member.name}</h3>
                    <p className="text-blue-400 font-medium">{member.role}</p>
                  </div>

                  <p className="text-slate-400 text-sm">{member.about}</p>

                  {/* Skills */}
                  <div className="flex gap-2 flex-wrap justify-center mt-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300 border border-white/5 hover:bg-amber-400/10 hover:border-amber-400/50 cursor-pointer transition-all"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* --- 3. Technologies --- */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="space-y-12"
          >
            <span className="uppercase w-fit text-rose-300 bg-rose-500/10 border border-rose-500 backdrop-blur-sm px-4 py-0.5 rounded-full animate-pulse mb-2">
              Stacks
            </span>
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold tracking-tight text-start flex sm:flex-row flex-col gap-2 mt-3"
            >
              Engineered with <span className="limelight block bg-clip-text text-transparent bg-gradient-to-r from-rose-300 to-purple-400">Modern</span> Tools
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
          </motion.section>

          {/* --- 4. Development Process --- */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="space-y-12"
          >
            <span className="uppercase w-fit text-emerald-300 bg-emerald-500/10 border border-emerald-500 backdrop-blur-sm px-4 py-0.5 rounded-full animate-pulse mb-2">
              How We Work
            </span>
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold tracking-tight mt-3"
            >
              An enterprise-grade process,
              <br /> 
              <span className="flex sm:flex-row flex-col gap-2">built for absolute <span className="limelight block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">accountability.</span></span>
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
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
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-slate-700 -z-0" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* --- 5. Why Choose Us --- */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-6"
          >
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
                    <h3 className="w-fit text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-100">
                      {item.title}
                    </h3>
                    <p className="text-slate-400">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="space-y-10 flex flex-col"
          >
            <span className="uppercase w-fit text-purple-300 bg-purple-500/10 border border-purple-500 backdrop-blur-sm px-4 py-0.5 rounded-full animate-pulse mb-2">
              services
            </span>
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold tracking-tight"
            >
              All your Enterprise needs, <br /> in one{" "}
              <span className="limelight uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-400">
                place
              </span>
            </motion.h1>

            <div className="grid md:grid-cols-2 gap-6 max-w-7xl sm:grid-cols-1 mx-auto py-10">
              {serviceItems.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-lg hover:border-blue-500/30 transition-all duration-300"
                >
                  {/* Header Area */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                        <service.icon size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {service.title}
                      </h3>
                    </div>
                    <div className="p-2 border border-white/10 rounded-full text-slate-400 hover:bg-white/10 transition-colors">
                      <ArrowRight size={20} className="-rotate-50" />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 mb-8 max-w-md">{service.desc}</p>

                  {/* Image Container */}
                  <div className="w-full h-64 overflow-hidden rounded-2xl border border-white/5">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* --- 6. Portfolio --- */}
          <motion.section
            id="portfolio"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="space-y-10"
          >
            <span className="uppercase w-fit text-white bg-white/10 border border-white backdrop-blur-sm px-4 py-0.5 rounded-full animate-pulse mb-2">
              projects
            </span>
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold tracking-tight mt-3"
            >
              Featured Projects & Case Studies{" "}
              <span className="inline-block text-slate-400 yuyu text-2xl font-light">
                (maybe still working on ..)
              </span>
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
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <iframe
                          src={project.link}
                          className="w-full h-[500px] border-none rounded-2xl pointer-events-none"
                        />
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
          </motion.section>

          {/* --- 7. Contact Footer --- */}
          <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
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
                <Mail size={20} /> {personal[1].value}
              </a>
              <a
                href="tel:0761234567"
                className="flex items-center gap-3 hover:text-blue-400 w-fit"
              >
                <Phone size={20} /> {personal[0].value}
              </a>
            </div>

            <div className="flex gap-4 items-start md:justify-end">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href={personal[2].value}
                className="p-3 bg-white/5 rounded-full hover:bg-white/10"
              >
                <GitBranchPlus />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#portfolio"
                className="p-3 bg-white/5 rounded-full hover:bg-white/10"
              >
                <Globe />
              </motion.a>
            </div>
          </motion.footer>
        </div>
      </div>
    </main>
  );
}
