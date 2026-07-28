"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function NewsletterForm() {
  const [done, setDone] = useState(false);
  return (
    <form
      className="mt-4 flex w-full max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <input
        type="email"
        required
        placeholder="you@campus.ac.in"
        className="flex-1 min-w-0 h-12 px-4 text-sm bg-white border border-line-strong border-r-0 text-ink placeholder:text-muted rounded-none focus:outline-none focus:border-ink transition-colors"
      />
      <button className="h-12 px-6 text-sm font-medium uppercase tracking-wider bg-ink text-white rounded-none hover:bg-ink-soft transition-colors shrink-0 flex items-center justify-center">
        {done ? <><Check className="w-4 h-4 mr-1.5" /> Done</> : "Join"}
      </button>
    </form>
  );
}
