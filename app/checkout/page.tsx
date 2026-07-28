"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, CheckCircle2, Search, HelpCircle, ArrowRight, Lock } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { inr } from "@/lib/data";
import CartLineThumb from "@/components/CartLineThumb";

/* ------------------------------------------------------------------ *
 *  Checkout runs on soft grey hairlines, rounded fields, floating labels
 *  and a grey summary rail — a payment page is the one place on a store
 *  where familiarity beats personality, and every checkout a shopper has
 *  used looks like this. (It used to be the odd one out against the
 *  brutalist cards; now the rest of the site has come to meet it.)
 *
 *  Type runs a touch larger than the rest of the site and the sections sit
 *  close together — at the point of paying, the fields and the total are
 *  the only things that matter, and spreading them out just means more
 *  scrolling between the shopper and the button.
 * ------------------------------------------------------------------ */

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu",
  "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

/* prices are tax-inclusive, so this is the GST already inside the total
   rather than an amount added on top */
const GST_RATE = 0.18;

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const mounted = useHydrated();
  const [status, setStatus] = useState<"idle" | "placing" | "done">("idle");
  const [orderId, setOrderId] = useState("");
  const [pin, setPin] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountError, setDiscountError] = useState("");

  const total = mounted ? subtotal() : 0;
  // shipping can't be known until there's somewhere to ship to
  const hasAddress = pin.trim().length === 6;
  const shipping = !hasAddress ? null : total > 999 || total === 0 ? 0 : 79;
  const payable = total + (shipping ?? 0);
  const taxIncluded = useMemo(() => (payable * GST_RATE) / (1 + GST_RATE), [payable]);

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("placing");
    setTimeout(() => {
      setOrderId("CT" + Math.floor(100000 + Math.random() * 899999));
      setStatus("done");
      clear();
    }, 1400);
  };

  const applyDiscount = () => {
    // no promotions are running; saying so beats a button that does nothing
    setDiscountError(
      discount.trim() ? "That code isn’t valid right now." : "Enter a code first."
    );
  };

  if (status === "done") {
    return (
      <div className="container-x py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="mx-auto w-20 h-20 rounded-full bg-ink grid place-items-center"
          >
            <CheckCircle2 className="w-11 h-11 text-white" />
          </motion.div>
          <h1 className="mt-7 h-section">Order <span className="text-coral-strong accent-rule">confirmed</span></h1>
          <p className="mt-3 text-ink-soft">
            Thanks for repping your campus. Your order{" "}
            <span className="font-semibold text-ink">#{orderId}</span> is being
            printed and will ship in 3–5 days.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/shop" className="btn btn-accent">
              Keep shopping <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/" className="btn">Back home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (mounted && lines.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="h-section">Nothing to check out</h1>
        <p className="mt-2 text-ink-soft">Add something to your bag first.</p>
        <Link href="/shop" className="mt-8 btn btn-accent">
          Browse products <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={placeOrder} className="lg:grid lg:grid-cols-2 lg:min-h-screen">
      {/* ------------------------- form side ------------------------- */}
      <div className="bg-white lg:border-r lg:border-line">
        <div className="max-w-[580px] w-full ml-auto px-5 sm:px-10 py-10 lg:py-14">
          <CheckoutSection title="Contact">
            <FloatField id="email" label="Email" type="email" required autoComplete="email" />
            <CheckboxRow id="news" label="Email me with news and offers" />
          </CheckoutSection>

          <CheckoutSection title="Delivery">
            <SelectField id="country" label="Country/Region" defaultValue="India">
              <option>India</option>
            </SelectField>

            <div className="grid sm:grid-cols-2 gap-3">
              <FloatField id="first" label="First name" required autoComplete="given-name" />
              <FloatField id="last" label="Last name" required autoComplete="family-name" />
            </div>

            <FloatField
              id="address"
              label="Address"
              required
              autoComplete="street-address"
              icon={<Search className="w-[18px] h-[18px]" />}
            />
            <FloatField id="apt" label="Apartment, suite, etc." autoComplete="address-line2" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FloatField id="city" label="City" required autoComplete="address-level2" />
              <SelectField id="state" label="State" defaultValue="Uttarakhand">
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </SelectField>
              <FloatField
                id="pin"
                label="PIN code"
                required
                inputMode="numeric"
                maxLength={6}
                autoComplete="postal-code"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <FloatField
              id="phone"
              label="Phone"
              type="tel"
              required
              autoComplete="tel"
              icon={<HelpCircle className="w-[18px] h-[18px]" />}
            />
            <CheckboxRow id="sms" label="Text me with news and offers" />
          </CheckoutSection>

          <CheckoutSection title="Payment">
            <div className="space-y-3">
              {[
                { id: "cod", label: "Cash on Delivery", desc: "Pay when it arrives" },
                { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm" },
                { id: "card", label: "Credit / Debit card", desc: "Visa, Mastercard, RuPay" },
              ].map((m, i) => (
                <label
                  key={m.id}
                  className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-line bg-white cursor-pointer transition-colors has-[:checked]:border-ink"
                >
                  <input
                    type="radio"
                    name="pay"
                    defaultChecked={i === 0}
                    className="accent-[color:var(--ink)] w-4 h-4"
                  />
                  <span>
                    <span className="block text-[15.5px] text-ink">{m.label}</span>
                    <span className="block text-[14px] text-muted">{m.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </CheckoutSection>

          <motion.button
            type="submit"
            disabled={status !== "idle"}
            whileTap={{ scale: 0.99 }}
            className="mt-8 w-full h-14 rounded-xl bg-ink text-white text-[16px] disabled:opacity-60 transition-opacity hover:opacity-90"
          >
            <AnimatePresence mode="wait" initial={false}>
              {status === "placing" ? (
                <motion.span
                  key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" /> Placing order…
                </motion.span>
              ) : (
                <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Pay now
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <p className="mt-5 flex items-center justify-center gap-2 text-[14px] text-muted">
            <Lock className="w-3.5 h-3.5" /> Secure, encrypted checkout
          </p>
        </div>
      </div>

      {/* ------------------------ summary side ----------------------- */}
      <div className="bg-bg-soft">
        <div className="max-w-[580px] w-full mr-auto px-5 sm:px-10 py-10 lg:py-14 lg:sticky lg:top-0">
          <ul className="space-y-5">
            {mounted && lines.map((l) => (
              <li key={l.key} className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="relative w-[66px] h-[66px] rounded-xl border border-line bg-white overflow-hidden">
                    <CartLineThumb line={l} sizes="66px" />
                  </div>
                  <span className="absolute -top-2 -right-2 min-w-[24px] h-[24px] px-1.5 grid place-items-center rounded-full bg-ink text-white text-[12px] font-medium tabular-nums">
                    {l.qty}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15.5px] text-ink leading-snug">{l.name}</p>
                  <p className="mt-0.5 text-[13.5px] text-muted">Size {l.size}</p>
                </div>
                <span className="text-[15.5px] text-ink shrink-0">{inr(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>

          {/* discount */}
          <div className="mt-7 flex gap-3">
            <input
              value={discount}
              onChange={(e) => { setDiscount(e.target.value); setDiscountError(""); }}
              placeholder="Discount code"
              aria-label="Discount code"
              className="flex-1 min-w-0 h-[56px] px-4 rounded-xl border border-line bg-white text-[15.5px] text-ink placeholder:text-muted outline-none focus:border-ink transition-colors"
            />
            <button
              type="button"
              onClick={applyDiscount}
              className="shrink-0 h-[56px] px-6 rounded-xl bg-bg-tint text-ink-soft text-[15.5px] hover:text-ink transition-colors"
            >
              Apply
            </button>
          </div>
          {discountError && (
            <p className="mt-2.5 text-[14px] text-coral-strong">{discountError}</p>
          )}

          <div className="mt-7 space-y-3 text-[15.5px]">
            <Row label="Subtotal" value={inr(total)} />
            <Row
              label="Shipping"
              value={
                shipping === null
                  ? <span className="text-muted">Enter shipping address</span>
                  : shipping === 0 ? "Free" : inr(shipping)
              }
            />
          </div>

          <div className="mt-6 pt-5 border-t border-line flex items-baseline justify-between gap-4">
            <span className="text-[19px] text-ink">Total</span>
            <span className="flex items-baseline gap-2">
              <span className="text-[14px] text-muted">INR</span>
              <span className="text-[26px] font-semibold text-ink tracking-[-0.02em]">{inr(payable)}</span>
            </span>
          </div>
          <p className="mt-2 text-[14px] text-muted text-right">
            Including {inr(taxIncluded)} in taxes
          </p>
        </div>
      </div>
    </form>
  );
}

/* ----------------------------- pieces ----------------------------- */

function CheckoutSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 last:mb-0">
      <h2 className="text-[21px] font-semibold text-ink tracking-[-0.015em] mb-3.5">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-ink">{label}</span>
      <span className="text-ink text-right">{value}</span>
    </div>
  );
}

/**
 * Floating-label field. The label starts sitting where a placeholder would
 * and rises once the field has focus or content — which is what lets an
 * empty form read as placeholders while a filled one keeps every field
 * labelled. `placeholder=" "` is load-bearing: `:placeholder-shown` is the
 * only CSS hook for "this input is empty", so the placeholder must exist
 * and must be blank.
 */
function FloatField({
  id, label, icon, className, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; icon?: React.ReactNode }) {
  return (
    <div className="relative">
      <input
        id={id}
        placeholder=" "
        {...props}
        className={`peer w-full h-[56px] px-4 pt-5 pb-1.5 ${icon ? "pr-12" : ""} rounded-xl border border-line bg-white text-[15.5px] text-ink outline-none transition-colors focus:border-ink ${className ?? ""}`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-[7px] text-[12px] text-muted transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15.5px] peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-[12px]"
      >
        {label}
      </label>
      {icon && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
          {icon}
        </span>
      )}
    </div>
  );
}

/* selects always hold a value, so their label is always in the raised spot */
function SelectField({
  id, label, children, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { id: string; label: string }) {
  return (
    <div className="relative">
      <select
        id={id}
        {...props}
        className="w-full h-[56px] px-4 pt-5 pb-1.5 rounded-xl border border-line bg-white text-[15.5px] text-ink outline-none appearance-none transition-colors focus:border-ink"
      >
        {children}
      </select>
      <label htmlFor={id} className="pointer-events-none absolute left-4 top-[7px] text-[12px] text-muted">
        {label}
      </label>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
          <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

function CheckboxRow({ id, label }: { id: string; label: string }) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 py-1 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        className="w-[18px] h-[18px] rounded accent-[color:var(--ink)]"
      />
      <span className="text-[16px] text-ink">{label}</span>
    </label>
  );
}
