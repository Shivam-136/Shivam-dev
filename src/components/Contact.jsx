import { useState } from "react";
import emailjs from "@emailjs/browser";
import useChunkReveal from "../hooks/useChunkReveal";
import useSlideReveal from "../hooks/useSlideReveal";
import { profile } from "../data/profile";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiSend } from "react-icons/fi";

const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

// If you haven't set up EmailJS yet, the form will show a "use email
// directly" fallback instead of silently failing.
const EMAILJS_CONFIGURED =
  !EMAILJS_SERVICE_ID.startsWith("YOUR_") &&
  !EMAILJS_TEMPLATE_ID.startsWith("YOUR_") &&
  !EMAILJS_PUBLIC_KEY.startsWith("YOUR_");

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

    if (!EMAILJS_CONFIGURED) {
      setStatus("not-configured");
      return;
    }

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

  const mailtoHref = profile.email
    ? `mailto:${profile.email}${
        form.subject || form.message
          ? `?subject=${encodeURIComponent(form.subject || "Portfolio contact")}&body=${encodeURIComponent(
              form.message ? `${form.message}\n\n— ${form.name || ""} (${form.email || ""})` : ""
            )}`
          : ""
      }`
    : null;

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
                Something went wrong sending the message. Try the direct email link below instead.
              </p>
            )}
            {status === "not-configured" && (
              <div className="text-center space-y-2">
                <p className="text-bone-dim text-sm">
                  This form isn't wired up yet — but you can reach me directly:
                </p>
                {mailtoHref ? (
                  <a
                    href={mailtoHref}
                    data-cursor-hover
                    className="inline-flex items-center gap-2 text-emerald-glow text-sm font-medium hover:underline"
                  >
                    <MdEmail /> {profile.email}
                  </a>
                ) : (
                  <p className="text-bone-dim/60 text-xs italic">
                    (Add your email to profile.js to enable a direct contact link.)
                  </p>
                )}
              </div>
            )}
          </form>

          <div data-slide-item data-slide-dir="right" className="flex items-center justify-center gap-5 mt-8">
            {profile.email && (
              <SocialSlot href={`mailto:${profile.email}`} icon={MdEmail} label="Email" color="#5EEAD4" />
            )}
            {profile.github && (
              <SocialSlot href={profile.github} icon={FaGithub} label="GitHub" color="#ffffff" />
            )}
            {profile.linkedin && (
              <SocialSlot href={profile.linkedin} icon={FaLinkedin} label="LinkedIn" color="#0A66C2" />
            )}
            {profile.instagram && (
              <SocialSlot href={profile.instagram} icon={FaInstagram} label="Instagram" color="#E1306C" />
            )}
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

// Minecraft "inventory slot" styled social icon — real brand logo (react-icons/si)
// inside a blocky, hard-edged slot with the brand's actual color, matching the
// same bevel/press language as .mc-btn used elsewhere on the site.
function SocialSlot({ href, icon: Icon, label, color }) {
  const isMailto = href.startsWith("mailto:");
  return (
    <a
      href={href}
      target={isMailto ? undefined : "_blank"}
      rel={isMailto ? undefined : "noreferrer"}
      aria-label={label}
      title={label}
      data-cursor-hover
      className="mc-btn w-12 h-12 flex items-center justify-center bg-obsidian-alt transition-transform hover:scale-110"
    >
      <Icon size={20} style={{ color }} />
    </a>
  );
}