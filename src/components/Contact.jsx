import { useState } from "react";
import emailjs from "@emailjs/browser";
import useChunkReveal from "../hooks/useChunkReveal";
import useSlideReveal from "../hooks/useSlideReveal";
import { profile } from "../data/profile";
import { FiGithub, FiLinkedin, FiInstagram, FiSend } from "react-icons/fi";

const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const ref = useChunkReveal();
  const formWrapRef = useSlideReveal({ distance: 60 });
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (form.message.trim().length < 10) e.message = "Message should be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, subject: form.subject, message: form.message },
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
    <section id="contact" className="py-28 px-6 bg-obsidian-panel/40">
      <div ref={ref} className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <p className="eyebrow">CONTACT</p>
          <span className="flex items-center gap-1.5 text-xs text-emerald-glow border border-emerald-glow/30 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-glow animate-pulse" />
            Available for work
          </span>
        </div>
        <h2 className="text-xl md:text-3xl font-semibold text-bone leading-relaxed mb-4 tracking-tight">
          Let's build something
        </h2>
        <p className="text-bone-dim mb-10 font-body">
          Have a project in mind or want to collaborate? Send a message below.
        </p>

        <div ref={formWrapRef}>
          <form
            onSubmit={handleSubmit}
            data-slide-item
            data-slide-dir="left"
            className="glass pixel-border rounded-3xl p-8 space-y-5"
            noValidate
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Name" value={form.name} error={errors.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Email" type="email" value={form.email} error={errors.email} onChange={(v) => setForm({ ...form, email: v })} />
            </div>
            <Field label="Subject" value={form.subject} error={errors.subject} onChange={(v) => setForm({ ...form, subject: v })} />
            <Field label="Message" textarea value={form.message} error={errors.message} onChange={(v) => setForm({ ...form, message: v })} />

            <button
              type="submit"
              disabled={status === "sending"}
              data-cursor-hover
              className="mc-btn w-full flex items-center justify-center gap-2 bg-emerald-glow text-obsidian font-medium py-3 disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : <>Send Message <FiSend /></>}
            </button>

            {status === "sent" && (
              <p className="text-emerald-glow text-sm text-center">Message sent — I'll get back to you soon.</p>
            )}
            {status === "error" && (
              <p className="text-redstone text-sm text-center">
                Something went wrong. Add your EmailJS keys in Contact.jsx, then try again.
              </p>
            )}
          </form>

          <div data-slide-item data-slide-dir="right" className="flex items-center justify-center gap-5 mt-8">
            {profile.github && <SocialIcon href={profile.github} icon={FiGithub} label="GitHub" />}
            {profile.linkedin && <SocialIcon href={profile.linkedin} icon={FiLinkedin} label="LinkedIn" />}
            {profile.instagram && <SocialIcon href={profile.instagram} icon={FiInstagram} label="Instagram" />}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, error, type = "text", textarea = false }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-bone-dim mb-1.5 block">{label}</span>
      <Tag
        type={textarea ? undefined : type}
        rows={textarea ? 4 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-obsidian-alt/60 border rounded-xl px-4 py-3 text-bone text-sm font-body outline-none transition-colors focus:border-diamond/60 ${
          error ? "border-redstone/60" : "border-obsidian-line"
        }`}
      />
      {error && <span className="text-redstone text-xs mt-1 block">{error}</span>}
    </label>
  );
}

function SocialIcon({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      data-cursor-hover
      className="w-11 h-11 flex items-center justify-center glass pixel-border rounded-xl text-bone-dim hover:text-diamond transition-all hover:scale-110"
    >
      <Icon size={18} />
    </a>
  );
}