import { useState } from "react";
import emailjs from "@emailjs/browser";
import useChunkReveal from "../hooks/useChunkReveal";
import useSlideReveal from "../hooks/useSlideReveal";
import { profile, resumeAvailable } from "../data/profile";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiSend, FiDownload, FiExternalLink, FiMail } from "react-icons/fi";
import { downloadResume } from "../utils/downloadResume";

const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

const EMAILJS_CONFIGURED =
  !EMAILJS_SERVICE_ID.startsWith("YOUR_") &&
  !EMAILJS_TEMPLATE_ID.startsWith("YOUR_") &&
  !EMAILJS_PUBLIC_KEY.startsWith("YOUR_");

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const ref = useChunkReveal();
  const formWrapRef = useSlideReveal({ distance: 40 });
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Please enter a valid email address";
    if (!form.subject.trim()) e.subject = "Please enter a subject";
    if (form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters long";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    if (!EMAILJS_CONFIGURED) {
      // Direct mailto fallback if EmailJS keys haven't been plugged in yet
      const subject = encodeURIComponent(form.subject || "Portfolio Contact");
      const body = encodeURIComponent(
        `${form.message}\n\nFrom: ${form.name} (${form.email})`
      );
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus("sent");
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="py-28 px-6 bg-obsidian-panel/60 border-t border-obsidian-line/40"
    >
      <div ref={ref} className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <p className="eyebrow">CONTACT</p>
          <span className="flex items-center gap-1.5 text-xs text-emerald-glow border border-emerald-glow/30 bg-emerald-glow/10 rounded-full px-2.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-glow animate-pulse" />
            Open for opportunities
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-bone leading-tight mb-4 tracking-tight">
          Let's Build Something Impactful
        </h2>
        <p className="text-bone-dim mb-12 font-body max-w-xl text-base">
          Have a project in mind, looking for a full stack engineer, or simply want to connect? Reach out via the form or through my direct channels below.
        </p>

        <div ref={formWrapRef} className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Direct channels & Resume Download Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass pixel-border rounded-2xl p-6 space-y-5">
              <h3 className="font-display text-base font-semibold text-bone">
                Direct Contact Channels
              </h3>

              {/* Email */}
              <a
                href={`mailto:${profile.email}`}
                data-cursor-hover
                className="flex items-center gap-3.5 p-3 rounded-xl bg-obsidian-alt/70 border border-obsidian-line hover:border-emerald-glow/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-glow/10 border border-emerald-glow/20 flex items-center justify-center text-emerald-glow">
                  <MdEmail size={20} />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase font-pixel text-bone-dim block">
                    Email
                  </span>
                  <span className="text-xs sm:text-sm text-bone font-medium truncate block group-hover:text-emerald-glow transition-colors">
                    {profile.email}
                  </span>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="flex items-center gap-3.5 p-3 rounded-xl bg-obsidian-alt/70 border border-obsidian-line hover:border-diamond/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0A66C2]/15 border border-[#0A66C2]/30 flex items-center justify-center text-[#5EEAD4]">
                  <FaLinkedin size={18} />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase font-pixel text-bone-dim block">
                    LinkedIn
                  </span>
                  <span className="text-xs sm:text-sm text-bone font-medium truncate block group-hover:text-diamond transition-colors">
                    linkedin.com/in/shivam-chhanchhan
                  </span>
                </div>
              </a>

              {/* GitHub */}
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="flex items-center gap-3.5 p-3 rounded-xl bg-obsidian-alt/70 border border-obsidian-line hover:border-bone/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-bone/10 border border-bone/20 flex items-center justify-center text-bone">
                  <FaGithub size={18} />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase font-pixel text-bone-dim block">
                    GitHub
                  </span>
                  <span className="text-xs sm:text-sm text-bone font-medium truncate block group-hover:text-emerald-glow transition-colors">
                    github.com/Shivam-136
                  </span>
                </div>
              </a>

              {/* Resume download button */}
              {resumeAvailable && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      downloadResume(
                        profile.resumeUrl,
                        "Shivam_Chhanchhan_Full_Stack_Developer_Resume.pdf"
                      )
                    }
                    data-cursor-hover
                    className="mc-btn w-full flex items-center justify-center gap-2 bg-emerald-glow text-obsidian font-semibold py-3 px-4 text-xs sm:text-sm rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
                  >
                    <FiDownload size={16} />
                    <span>Download Resume (PDF)</span>
                  </button>
                  <div className="mt-2 text-center">
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-bone-dim hover:text-emerald-glow underline underline-offset-2"
                    >
                      Direct link: /resume.pdf
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="glass pixel-border rounded-2xl p-6 sm:p-8 space-y-5"
              noValidate
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <Field
                  id="contact-name"
                  label="Your Name"
                  placeholder="e.g. Alex Smith"
                  value={form.name}
                  error={errors.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                />
                <Field
                  id="contact-email"
                  label="Email Address"
                  type="email"
                  placeholder="alex@company.com"
                  value={form.email}
                  error={errors.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                />
              </div>

              <Field
                id="contact-subject"
                label="Subject"
                placeholder="Project inquiry / Full-stack opportunity"
                value={form.subject}
                error={errors.subject}
                onChange={(v) => setForm({ ...form, subject: v })}
              />

              <Field
                id="contact-message"
                label="Message"
                textarea
                placeholder="Tell me about your project, timeline, or open role..."
                value={form.message}
                error={errors.message}
                onChange={(v) => setForm({ ...form, message: v })}
              />

              <button
                type="submit"
                disabled={status === "sending"}
                data-cursor-hover
                className="mc-btn w-full flex items-center justify-center gap-2 bg-emerald-glow text-obsidian font-semibold py-3.5 px-6 rounded text-sm disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-glow"
              >
                {status === "sending" ? (
                  "Sending message..."
                ) : (
                  <>
                    <span>Send Message</span>
                    <FiSend size={15} />
                  </>
                )}
              </button>

              {status === "sent" && (
                <div className="p-3 rounded-lg bg-emerald-glow/15 border border-emerald-glow/30 text-emerald-glow text-xs sm:text-sm text-center font-medium">
                  Message submitted! I'll get back to you promptly.
                </div>
              )}

              {status === "error" && (
                <div className="p-3 rounded-lg bg-redstone/15 border border-redstone/30 text-redstone text-xs sm:text-sm text-center">
                  Something went wrong. Please email directly at{" "}
                  <a
                    href={`mailto:${profile.email}`}
                    className="underline font-medium"
                  >
                    {profile.email}
                  </a>
                  .
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder = "",
  textarea = false,
}) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs uppercase tracking-wider text-bone-dim mb-1.5 block font-medium"
      >
        {label}
      </label>
      <Tag
        id={id}
        type={textarea ? undefined : type}
        rows={textarea ? 4 : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-obsidian-alt/80 border rounded-xl px-4 py-3 text-bone text-sm font-body outline-none transition-colors placeholder:text-bone-dim/40 focus-visible:outline-none focus:border-diamond/80 focus:ring-1 focus:ring-diamond/40 ${
          error ? "border-redstone/80 ring-1 ring-redstone/40" : "border-obsidian-line"
        }`}
      />
      {error && (
        <span className="text-redstone text-xs mt-1 block font-body">
          {error}
        </span>
      )}
    </div>
  );
}