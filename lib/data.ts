/* ------------------------------------------------------------------ *
 *  Campus Things data layer
 *  All IITs / NITs / IIITs + procedurally-generated apparel catalog.
 * ------------------------------------------------------------------ */

export type CollegeType = "IIT" | "NIT" | "IIIT";

export interface College {
  id: string;        // slug
  name: string;      // full display name
  short: string;     // printed on the garment  (e.g. "IIT-B")
  city: string;
  type: CollegeType;
  estd: number;
  hue: number;       // 0-360, drives the accent tint
}

/**
 * The store sells t-shirts, and only t-shirts.
 *
 * Kept as a union of one rather than deleted outright: the section
 * machinery (the `?cat=` param, the store chips, the shop sidebar) still
 * needs a type to name, every surface derives its list from SECTIONS, and
 * putting a second line back is then a two-line change here rather than a
 * re-fit of the whole catalogue.
 */
export type SectionId = "design-tshirt" | "simple-tshirt";

export interface Section {
  id: SectionId;
  name: string;
  blurb: string;
  emoji: string;
  from: number;      // starting price
  /** short noun phrase for running prose ("cosy hoodies") */
  prose: string;
}

export type GarmentKind = "tee" | "oversized" | "hoodie" | "sweatshirt" | "lower" | "cap";

export interface Product {
  id: string;
  collegeId: string;
  section: SectionId;
  kind: GarmentKind;
  name: string;
  price: number;
  mrp: number;
  garment: string;   // fabric colour (hex)
  print: string;     // print colour (hex)
  rating: number;
  reviews: number;
  bestseller: boolean;
  fabric: string;
  /** real product photography; absent products fall back to the SVG mockup */
  photo?: Photo;
  hideFromAll?: boolean;
}

/** The two faces of a photographed garment, both keyed to transparency. */
export interface Photo {
  front: string;
  back: string;
}

/* Rev lives in the filename, not a ?v= query — the image optimiser rejects
   a query string on a local path (400). Bump it and rename the files when a
   photo is re-exported, so browsers and the optimiser both see a new URL
   instead of serving the bytes they already cached. */
const PHOTO_REV = 3;

/**
 * The colleges we have real shots for, with the *actual* colours of the
 * photographed garment.
 *
 * These override the procedural palette for the photographed product, so
 * the colour swatch, the copy on the detail page ("fabric #14151a") and the
 * photograph itself can't contradict each other — and so a fallback mockup
 * rendered next to a real shot is the same shirt, not a different one.
 */
const PHOTOGRAPHED: Record<string, { garment: string; print: string }> = {
  "iit-bombay":    { garment: "#14151a", print: "#2fd4d0" },
  "iit-madras":    { garment: "#14151a", print: "#c9a054" },
  "iit-delhi":     { garment: "#14151a", print: "#2aa9e6" },
  "iit-kharagpur": { garment: "#14151a", print: "#a98bea" },
  "iit-guwahati":  { garment: "#14151a", print: "#4cc4e0" },
  "iit-kanpur":    { garment: "#14151a", print: "#ffffff" },
  "iit-roorkee":   { garment: "#1b2745", print: "#ffffff" },
  "iit-bhu-varanasi": { garment: "#14151a", print: "#50f551" },
};

/** The photographed tee is the college's flagship — template 0 of the
    design t-shirt section. One id, derived in one place, so nothing drifts. */
function photoProductId(collegeId: string) {
  return `${collegeId}-design-tshirt-0`;
}

/** The front/back pair for a college, or undefined if it isn't shot yet. */
export function photoFor(collegeId: string): Photo | undefined {
  if (!(collegeId in PHOTOGRAPHED)) return undefined;
  return {
    front: `/products/${collegeId}-tee-front-v${PHOTO_REV}.png`,
    back: `/products/${collegeId}-tee-back-v${PHOTO_REV}.png`,
  };
}

/** Colleges that have real photography, in catalogue order. */
export const PHOTOGRAPHED_COLLEGES = Object.keys(PHOTOGRAPHED);

/**
 * The photographed product for a college, if there is one. Used wherever a
 * college needs a single representative garment — its card in the browser,
 * the store hero — so the six shot campuses lead with the real thing.
 */
export function heroProductForCollege(collegeId: string) {
  const photographed = allProducts().find(
    (p) => p.id === photoProductId(collegeId) && p.photo
  );
  return photographed ?? productsForCollege(collegeId)[0];
}

/* ---------------------------- sections ---------------------------- */
export const SECTIONS: Section[] = [
  { id: "design-tshirt", name: "Design T-Shirts", emoji: "👕", from: 599, blurb: "Premium crest designs on 100% combed cotton.", prose: "design tees" },
  { id: "simple-tshirt", name: "Classic Simple Wear", emoji: "👕", from: 499, blurb: "Clean and minimal. Everyday campus classics.", prose: "classic tees" },
];

export const sectionKind: Record<SectionId, GarmentKind> = {
  "design-tshirt": "tee",
  "simple-tshirt": "tee",
};

/* ---------------------------- colleges ---------------------------- */
type Row = [name: string, short: string, city: string, estd: number];

const IIT: Row[] = [
  ["IIT Bombay", "IIT-B", "Mumbai", 1958],
  ["IIT Delhi", "IIT-D", "New Delhi", 1961],
  ["IIT Madras", "IIT-M", "Chennai", 1959],
  ["IIT Kanpur", "IIT-K", "Kanpur", 1959],
  ["IIT Kharagpur", "IIT-KGP", "Kharagpur", 1951],
  ["IIT Roorkee", "IIT-R", "Roorkee", 1847],
  ["IIT Guwahati", "IIT-G", "Guwahati", 1994],
  ["IIT Hyderabad", "IIT-H", "Hyderabad", 2008],
  ["IIT (BHU) Varanasi", "IIT-BHU", "Varanasi", 1919],
  ["IIT Indore", "IIT-I", "Indore", 2009],
  ["IIT Ropar", "IIT-RPR", "Rupnagar", 2008],
  ["IIT Gandhinagar", "IIT-GN", "Gandhinagar", 2008],
  ["IIT Patna", "IIT-P", "Patna", 2008],
  ["IIT Bhubaneswar", "IIT-BBS", "Bhubaneswar", 2008],
  ["IIT Mandi", "IIT-MD", "Mandi", 2009],
  ["IIT Jodhpur", "IIT-J", "Jodhpur", 2008],
  ["IIT Tirupati", "IIT-TP", "Tirupati", 2015],
  ["IIT Palakkad", "IIT-PKD", "Palakkad", 2015],
  ["IIT Dhanbad (ISM)", "IIT-ISM", "Dhanbad", 1926],
  ["IIT Bhilai", "IIT-BH", "Bhilai", 2016],
  ["IIT Goa", "IIT-GOA", "Goa", 2016],
  ["IIT Jammu", "IIT-JM", "Jammu", 2016],
  ["IIT Dharwad", "IIT-DH", "Dharwad", 2016],
];

const NIT: Row[] = [
  ["NIT Tiruchirappalli", "NIT-T", "Tiruchirappalli", 1964],
  ["NIT Karnataka, Surathkal", "NIT-K", "Surathkal", 1960],
  ["NIT Warangal", "NIT-W", "Warangal", 1959],
  ["NIT Rourkela", "NIT-RKL", "Rourkela", 1961],
  ["NIT Calicut", "NIT-C", "Calicut", 1961],
  ["MNNIT Allahabad", "MNNIT", "Prayagraj", 1961],
  ["NIT Durgapur", "NIT-DGP", "Durgapur", 1960],
  ["NIT Kurukshetra", "NIT-KKR", "Kurukshetra", 1963],
  ["MNIT Jaipur", "MNIT", "Jaipur", 1963],
  ["NIT Silchar", "NIT-S", "Silchar", 1967],
  ["VNIT Nagpur", "VNIT", "Nagpur", 1960],
  ["NIT Jamshedpur", "NIT-JSR", "Jamshedpur", 1960],
  ["SVNIT Surat", "SVNIT", "Surat", 1961],
  ["NIT Hamirpur", "NIT-HMR", "Hamirpur", 1986],
  ["MANIT Bhopal", "MANIT", "Bhopal", 1960],
  ["NIT Jalandhar", "NIT-J", "Jalandhar", 1987],
  ["NIT Raipur", "NIT-RPR", "Raipur", 1956],
  ["NIT Agartala", "NIT-AGT", "Agartala", 1965],
  ["NIT Srinagar", "NIT-SGR", "Srinagar", 1960],
  ["NIT Patna", "NIT-P", "Patna", 1886],
  ["NIT Meghalaya", "NIT-MEG", "Shillong", 2010],
  ["NIT Nagaland", "NIT-NAG", "Dimapur", 2010],
  ["NIT Manipur", "NIT-MN", "Imphal", 2010],
  ["NIT Mizoram", "NIT-MZ", "Aizawl", 2010],
  ["NIT Arunachal Pradesh", "NIT-AP", "Yupia", 2010],
  ["NIT Delhi", "NIT-DEL", "New Delhi", 2010],
  ["NIT Goa", "NIT-GOA", "Goa", 2010],
  ["NIT Puducherry", "NIT-PY", "Karaikal", 2010],
  ["NIT Sikkim", "NIT-SK", "Ravangla", 2010],
  ["NIT Uttarakhand", "NIT-UK", "Srinagar (UK)", 2009],
  ["NIT Andhra Pradesh", "NIT-AP2", "Tadepalligudem", 2015],
];

const IIIT: Row[] = [
  ["IIIT Hyderabad", "IIIT-H", "Hyderabad", 1998],
  ["IIIT Bangalore", "IIIT-B", "Bengaluru", 1999],
  ["IIIT Allahabad", "IIIT-A", "Prayagraj", 1999],
  ["IIIT Delhi", "IIIT-D", "New Delhi", 2008],
  ["IIITDM Jabalpur", "IIITDM-J", "Jabalpur", 2005],
  ["IIITDM Kancheepuram", "IIITDM-K", "Chennai", 2007],
  ["ABV-IIITM Gwalior", "IIITM-G", "Gwalior", 1997],
  ["IIIT Pune", "IIIT-PN", "Pune", 2016],
  ["IIIT Nagpur", "IIIT-NG", "Nagpur", 2016],
  ["IIIT Kota", "IIIT-KO", "Kota", 2013],
  ["IIIT Sri City", "IIIT-SC", "Sri City", 2013],
  ["IIIT Vadodara", "IIIT-V", "Vadodara", 2013],
  ["IIIT Kalyani", "IIIT-KL", "Kalyani", 2014],
  ["IIIT Lucknow", "IIIT-L", "Lucknow", 2015],
  ["IIIT Dharwad", "IIIT-DH", "Dharwad", 2015],
  ["IIIT Kottayam", "IIIT-KT", "Kottayam", 2015],
  ["IIIT Manipur", "IIIT-MN", "Imphal", 2015],
  ["IIIT Tiruchirappalli", "IIIT-T", "Tiruchirappalli", 2013],
  ["IIIT Una", "IIIT-U", "Una", 2014],
  ["IIIT Sonepat", "IIIT-SP", "Sonepat", 2014],
  ["IIIT Ranchi", "IIIT-R", "Ranchi", 2016],
  ["IIIT Guwahati", "IIIT-GW", "Guwahati", 2013],
  ["IIIT Bhagalpur", "IIIT-BG", "Bhagalpur", 2017],
  ["IIIT Bhopal", "IIIT-BP", "Bhopal", 2017],
  ["IIIT Surat", "IIIT-SU", "Surat", 2017],
  ["IIIT Raichur", "IIIT-RC", "Raichur", 2019],
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[()]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function build(rows: Row[], type: CollegeType): College[] {
  return rows.map(([name, short, city, estd], i) => ({
    id: slugify(name),
    name, short, city, type, estd,
    hue: Math.round((i * 41 + (type === "IIT" ? 6 : type === "NIT" ? 150 : 265)) % 360),
  }));
}

export const COLLEGES: College[] = [
  ...build(IIT, "IIT"),
  ...build(NIT, "NIT"),
  ...build(IIIT, "IIIT"),
].filter((c) => c.id in PHOTOGRAPHED);

export const COLLEGE_TYPES: { id: CollegeType; label: string; blurb: string }[] = [
  { id: "IIT",  label: "IITs",  blurb: "23 Indian Institutes of Technology" },
  { id: "NIT",  label: "NITs",  blurb: "31 National Institutes of Technology" },
  { id: "IIIT", label: "IIITs", blurb: "26 Institutes of Information Technology" },
];

export function getCollege(id: string) {
  return COLLEGES.find((c) => c.id === id);
}
export function collegesByType(type: CollegeType) {
  return COLLEGES.filter((c) => c.type === type);
}

/* ------------------------ colour helpers -------------------------- */
export function hsl(h: number, s: number, l: number) {
  return `hsl(${h} ${s}% ${l}%)`;
}
/** soft, light accent tint for a college (used on cards / chips) */
export function tint(hue: number, l = 96) {
  return hsl(hue, 70, l);
}
export function accent(hue: number) {
  return hsl(hue, 68, 52);
}

/* ---------------------- product generation ------------------------ */
interface Tpl { suffix: string; add: number; fabric: string; garment: string; print: string; }

const TEMPLATES: Record<SectionId, Tpl[]> = {
  "design-tshirt": [
    { suffix: "Premium Black Tshirt", add: 0, fabric: "180 GSM combed cotton", garment: "#14151a", print: "#ffffff" },
  ],
  "simple-tshirt": [
    { suffix: "Simple Black Tshirt", add: -100, fabric: "180 GSM combed cotton", garment: "#14151a", print: "#ffffff" },
    { suffix: "Simple White Tshirt", add: -100, fabric: "180 GSM combed cotton", garment: "#ffffff", print: "#14151a" },
  ],
};

const ALL_SECTIONS = Object.keys(TEMPLATES) as SectionId[];

function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}

let _cache: Product[] | null = null;

export function allProducts(): Product[] {
  if (_cache) return _cache;
  const HAS_SIMPLE_PHOTOS = ["iit-roorkee", "iit-madras", "iit-kharagpur", "iit-guwahati"];
  const out: Product[] = [];
  for (const c of COLLEGES) {
    ALL_SECTIONS.forEach((sec) => {
      // Only generate simple tshirts for colleges that have photos
      if (sec === "simple-tshirt" && !HAS_SIMPLE_PHOTOS.includes(c.id)) return;
      TEMPLATES[sec].forEach((tpl, ti) => {
        const base = SECTIONS.find((s) => s.id === sec)!.from + tpl.add;
        const key = `${c.id}-${sec}-${ti}`;
        const h = hashStr(key);
        const price = base;
        const mrp = Math.round((price * (1.35 + (h % 20) / 100)) / 10) * 10;
        // a photographed product wears the colours of the shot
        let photo = key === photoProductId(c.id) ? photoFor(c.id) : undefined;
        
        if (sec === "simple-tshirt") {
          if (HAS_SIMPLE_PHOTOS.includes(c.id)) {
            const colorName = tpl.garment === "#ffffff" ? "white" : "black";
            photo = {
              front: `/products/${c.id}-simple-${colorName}-front.png`,
              back: `/products/${c.id}-simple-${colorName}-back.png`,
            };
          }
        }
        
        // Use template colors for procedural generation, but override if photographed
        // For black design tees, we use the specific crest color if available.
        // Simple tshirts always keep their original black/white garment colors.
        let garment = tpl.garment;
        let print = tpl.print;
        if (sec === "design-tshirt") {
          if (photo && PHOTOGRAPHED[c.id]) {
             garment = PHOTOGRAPHED[c.id].garment;
             print = PHOTOGRAPHED[c.id].print;
          } else if (garment === "#14151a" && PHOTOGRAPHED[c.id]) {
             print = PHOTOGRAPHED[c.id].print;
          } else if (garment === "#ffffff") {
             print = hsl(c.hue, 60, 42);
          }
        }
        out.push({
          id: key,
          collegeId: c.id,
          section: sec,
          kind: sectionKind[sec],
          name: `${c.short} · ${tpl.suffix}`,
          price,
          mrp,
          garment,
          print,
          rating: 4 + ((h % 10) / 10),
          reviews: 40 + (h % 900),
          bestseller: h % 5 === 0,
          fabric: tpl.fabric,
          ...(photo ? { photo } : {}),
        });

        // Add special Navy Edition tee ONLY for IIT Roorkee
        if (c.id === "iit-roorkee" && sec === "design-tshirt") {
          out.push({
            id: `iit-roorkee-design-tshirt-navy`,
            collegeId: "iit-roorkee",
            section: "design-tshirt",
            kind: "tee",
            name: "IIT Roorkee - Navy Edition Tshirt",
            price: price,
            mrp: mrp,
            garment: "#1b2133", // Navy blue
            print: "#f1e5c4",   // Gold/yellow tint
            rating: 4.9,
            reviews: 156,
            bestseller: true,
            fabric: "180 GSM combed cotton",
            photo: {
              front: "/mockups/roorkee-01-front-v2.png",
              back: "/mockups/roorkee-01-back-v2.png",
            },
          });

          // 2nd Design: Eagle Edition
          out.push({
            id: `iit-roorkee-design-tshirt-eagle`,
            collegeId: "iit-roorkee",
            section: "design-tshirt",
            kind: "tee",
            name: "IIT Roorkee - Eagle Edition Tshirt",
            price: price,
            mrp: mrp,
            garment: "#1b2133",
            print: "#ffffff",
            rating: 4.8,
            reviews: 112,
            bestseller: false,
            fabric: "180 GSM combed cotton",
            photo: {
              front: "/mockups/roorkee-03-front-v2.png",
              back: "/mockups/roorkee-03-back-v2.png",
            },
          });
        }
      });
    });
  }
  _cache = out;
  return out;
}

export function productsForCollege(collegeId: string) {
  return allProducts().filter((p) => p.collegeId === collegeId);
}
export function productsForSection(collegeId: string, section: SectionId) {
  return allProducts().filter((p) => p.collegeId === collegeId && p.section === section);
}
export function getProduct(id: string) {
  return allProducts().find((p) => p.id === id);
}

/**
 * The sections a college actually stocks, in catalogue order. Derived from
 * the products rather than from SECTIONS_BY_COLLEGE so the copy on a store
 * page can never promise a shelf the page doesn't render.
 */
export function sectionsForCollege(collegeId: string): Section[] {
  const stocked = new Set(productsForCollege(collegeId).map((p) => p.section));
  return SECTIONS.filter((s) => stocked.has(s.id));
}

/** "a", "a and b", "a, b and c" */
export function listPhrase(items: string[]) {
  if (items.length <= 2) return items.join(" and ");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
/* perceived lightness — used to alternate fabric colour across the grid */
function isDarkGarment(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}

/**
 * Spreads the featured row across three axes at once — college, garment
 * section and fabric lightness. Taking the first bestseller per college
 * (the old behaviour) always landed on the tshirt template, so every tile
 * came back a white tee and the grid read as one repeated product.
 */
export function featuredProducts(n = 8) {
  const bySection = new Map<SectionId, Product[]>();
  for (const p of allProducts()) {
    if (!p.bestseller) continue;
    const arr = bySection.get(p.section);
    if (arr) arr.push(p);
    else bySection.set(p.section, [p]);
  }

  const order = SECTIONS.map((s) => s.id).filter((id) => bySection.has(id));
  const out: Product[] = [];
  const usedColleges = new Set<string>();

  // photographed products lead regardless of the bestseller flag — the grid
  // gives its largest slots to real shots, so they have to be in the set
  for (const p of allProducts()) {
    if (!p.photo || out.length >= n) continue;
    out.push(p);
    usedColleges.add(p.collegeId);
  }

  // round-robin the sections; within each, prefer a fabric that contrasts
  // with the tile before it, and a college not already on screen
  for (let pass = 0; pass < n && out.length < n; pass++) {
    for (const sec of order) {
      if (out.length >= n) break;
      const pool = bySection.get(sec)!;
      const wantDark = out.length % 2 === 1;
      const pick =
        pool.find((p) => !usedColleges.has(p.collegeId) && isDarkGarment(p.garment) === wantDark) ??
        pool.find((p) => !usedColleges.has(p.collegeId));
      if (!pick) continue;
      usedColleges.add(pick.collegeId);
      out.push(pick);
    }
  }
  return out;
}
/**
 * The t-shirt shelf on the home page. Photographed campuses lead — they're
 * the only products with real studio shots — and after those it takes one
 * tee per college so the row doesn't come back as six variants of the same
 * campus.
 */
export function tshirtShelf(n = 8) {
  const tees = allProducts().filter((p) => p.section === "design-tshirt");
  const out: Product[] = [];
  const seen = new Set<string>();

  for (const p of tees) {
    if (!p.photo) continue;
    out.push(p);
    seen.add(p.collegeId);
    if (out.length >= n) return out;
  }

  for (const p of tees) {
    if (seen.has(p.collegeId)) continue;
    seen.add(p.collegeId);
    out.push(p);
    if (out.length >= n) break;
  }
  return out;
}

/**
 * Free-text product search for the overlay. Matches against the product
 * name plus the college's full name, short code and city, so "Bombay",
 * "IIT-B" and "Mumbai" all reach the same shelf.
 *
 * An empty query is not "no results" — it returns the featured set, which
 * is what the panel shows before you have typed anything.
 */
export function searchProducts(query: string, n = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return featuredProducts(n);

  const hits: Product[] = [];
  for (const p of allProducts()) {
    const c = getCollege(p.collegeId);
    const haystack = [p.name, c?.name, c?.short, c?.city].join(" ").toLowerCase();
    if (haystack.includes(q)) hits.push(p);
    if (hits.length >= n) break;
  }
  return hits;
}

export function relatedProducts(p: Product, n = 4) {
  return allProducts()
    .filter((x) => x.collegeId === p.collegeId && x.id !== p.id)
    .slice(0, n);
}

/**
 * Custom product ordering for the shop page.
 * Groups by college in NIRF order; within each college:
 * design tee first, then simple black, then simple white.
 */
export function shopOrder(): Product[] {
  const ORDER = [
    "iit-roorkee", "iit-bombay", "iit-delhi", "iit-kanpur",
    "iit-madras", "iit-guwahati", "iit-bhu-varanasi", "iit-kharagpur",
  ];
  const all = allProducts();
  const out: Product[] = [];
  for (const cid of ORDER) {
    const design = all.filter((p) => p.collegeId === cid && p.section === "design-tshirt");
    const simpleBlack = all.find((p) => p.collegeId === cid && p.section === "simple-tshirt" && p.garment === "#14151a");
    const simpleWhite = all.find((p) => p.collegeId === cid && p.section === "simple-tshirt" && p.garment === "#ffffff");
    out.push(...design);
    if (simpleBlack) out.push(simpleBlack);
    if (simpleWhite) out.push(simpleWhite);
  }
  // append any remaining products not in the explicit order
  for (const p of all) {
    if (!out.includes(p)) out.push(p);
  }
  return out;
}

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export const CAP_SIZES = ["Free Size"] as const;

export function inr(n: number) {
  return (
    "Rs. " +
    n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}
