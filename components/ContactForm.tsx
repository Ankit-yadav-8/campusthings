"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Check, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state !== "idle") return;
    setState("sending");
    setTimeout(() => setState("done"), 1100);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Your name" name="name" placeholder="Ananya Rao" required />
        <Field label="Email" name="email" type="email" placeholder="you@campus.edu" required />
      </div>
      <Field label="Subject" name="subject" placeholder="Bulk order for my hostel" />
      <div>
        <label className="h-card text-sm">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us what you're looking for…"
          className="field mt-2 text-sm resize-none"
        />
      </div>

      <motion.button
        type="submit"
        disabled={state !== "idle"}
        whileTap={{ scale: 0.97 }}
        className="btn btn-accent btn-block h-12"
      >
        <AnimatePresence mode="wait" initial={false}>
          {state === "idle" && (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              Send message <Send className="w-4 h-4" />
            </motion.span>
          )}
          {state === "sending" && (
            <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Sending…
            </motion.span>
          )}
          {state === "done" && (
            <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Message sent!
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {state === "done" && (
          <motion.p
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-center"
          >
            Thanks for reaching out — we&apos;ll reply within 24 hours.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

function Field({
  label, name, type = "text", placeholder, required,
}: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="h-card text-sm">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="field mt-2 h-11 text-sm"
      />
    </div>
  );
}
