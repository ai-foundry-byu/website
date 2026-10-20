/**
 * Every word of site copy lives here, not in the components.
 *
 * The reason is editing. Brandon should be able to change what the site says
 * without reading JSX. If you are adding copy, add it here and render it from a
 * component. If you are changing copy, this is the only file you need to open.
 *
 * Two blocks are VERBATIM and must not be paraphrased, shortened, or improved:
 * MISSION, VISION, and VALUES. They are the decided language, proofed by the
 * team. See _reference/byu-static-site/_internal/brand-kit/voice.md.
 */

/* ────────────────────────────────────────────────────────────
   Naming

   BYU rule: "BYU Marriott School of Business" on first reference,
   "BYU Marriott" after, never "the Marriott School". And never a
   standalone "AI Foundry" without BYU identification, which is why
   the header pairs the two.
   ──────────────────────────────────────────────────────────── */

export const PROGRAM = "AI Foundry"
export const SCHOOL_FULL = "BYU Marriott School of Business"
export const SCHOOL_SHORT = "BYU Marriott"

/**
 * Who the Foundry belongs to inside BYU Marriott (Scott, 2026-10-19). Shown as
 * "A program of" in the hero eyebrow, the footer, and on /about. BYU
 * Information Systems is expected to join as a second entry; adding it here
 * updates every place at once ("BYU Strategy and BYU Information Systems").
 */
export const SPONSOR_LABEL = "A program of"

/** logo: full color for light grounds; logoWhite: one-color white reversal for
 *  navy grounds. Files from the Strategy app (public/images/strat-logo.png). */
export type Sponsor = { name: string; href: string; blurb: string; logo: string; logoWhite: string; width: number; height: number }

export const SPONSORS: Sponsor[] = [
  {
    name: "BYU Strategy",
    href: "https://strategy.byu.edu",
    logo: "/brand/byu-strategy.png",
    logoWhite: "/brand/byu-strategy-white.png",
    width: 1983,
    height: 316,
    blurb:
      "BYU Strategy is the Strategic Management Program at the BYU Marriott School of Business. Its faculty advise the Foundry, and the Foundry Lab is offered as STRAT 490R and MBA 693R.",
  },
]

export const SPONSOR_NAMES = SPONSORS.map((s) => s.name).join(" and ")

/* ────────────────────────────────────────────────────────────
   Hero
   ──────────────────────────────────────────────────────────── */

export const HERO_STATEMENT = "An AI-native product studio and consultancy."

/** One sentence, by Brandon's decision. It does one job: say whose program this
 *  is, on first reference and in full, per the naming rule above. Anything about
 *  who builds and what ships belongs further down the page, not here. */
export const HERO_SUPPORT =
  "An experiential learning program of " + SPONSOR_NAMES + " at the " + SCHOOL_FULL + "."

/**
 * The 2026-08 redesign hero (design_handoff_ai_foundry_website, direction 4b).
 * A three-line cast-125 stack with the last line in royal, over one support
 * sentence. HERO_SUPPORT becomes the eyebrow above the stack, so the naming
 * rule still holds; HERO_STATEMENT no longer renders on the landing page but
 * stays the decided one-line description used elsewhere.
 */
export const HERO_STACK = ["Student-built.", "Production-grade.", "AI-native."]

/** Not currently rendered — removed from the hero by Corbin 2026-08-16;
 *  kept as the decided support line should it come back. */
export const HERO_STACK_SUPPORT =
  "MBA and undergraduate builders shipping production AI systems for real clients."

/** Not rendered. From voice.md; it paired with the Foundry's own vision,
 *  retired 2026-10-19 in favor of BYU Marriott's. */
export const ERA_NARRATIVE =
  "Every general-purpose technology broke a constraint humanity assumed was permanent. Steam freed strength. The internet freed information. AI frees intelligence itself. Each time, an era of abundance followed. The Foundry exists to make sure this one reaches everyone."

/* ────────────────────────────────────────────────────────────
   Project intake brief

   Content is the eleven sections of AI-Foundry-Project-Brief.pdf.
   The page lists what will be asked so a visitor can judge the
   effort before starting; the form itself is embedded, so the
   fields live in the form tool, not in this repo.
   ──────────────────────────────────────────────────────────── */

/**
 * Proof. Deliberately modest, because there is no client work to name yet.
 *
 * Every employer below is traceable to a named person's bio on /about, and that
 * traceability is the entire point: a reader who clicks through can verify it.
 * That makes this biography about our own people rather than a claim of any
 * relationship with those companies.
 *
 *   Google          Nathan McCauley
 *   Deloitte        JD Davenport
 *   National Grid   JD Davenport
 *   Ford            Jorge Beltran
 *   BambooHR        Sophia Strong
 *   Leland          Jordan Faust
 *   Cicero          Tate Stevens
 *   Redo            Brandon Jeppson
 *   Yatta Golf      Abe Bedard
 *
 * Entrata is traceable (Sophia Strong) but left off the headline to keep the
 * sentence readable; Deloitte took its slot as the more recognizable name.
 *
 * Goldman Sachs is deliberately NOT here even though Ella Moore's bio names
 * it: she is an incoming summer analyst, and incoming is not shipped. Same
 * reasoning as Siemens below. It goes up when the internship has happened.
 *
 * The rules matter more than the copy:
 *
 *   - **No logos, ever.** A logo reads as endorsement, and there is no
 *     agreement with any of these companies.
 *   - Never "trusted by", "partners", or "in collaboration with". Those claim a
 *     relationship. "Our builders have shipped at" claims a resume.
 *   - Add a name only when you can point at the person on /about whose
 *     employment backs it. Siemens was proposed and left out for exactly this
 *     reason: nobody on the roster lists it.
 *
 * The Anthropic Claude Partner Network membership is HERE as of 2026-07-29,
 * confirmed by Brandon. It is the strongest of the three because it is an actual
 * organisational relationship rather than a resume, so unlike the employer names
 * it is a claim about AI Foundry itself.
 *
 * Still deliberately NOT here: the Claude Certified Architect certification.
 * voice.md says students "pursue" it, and pursuing is not holding. It goes up
 * when somebody has actually passed and not before, because a false
 * certification claim is worse than having no proof at all.
 *
 * All of this is a placeholder for the real thing. The moment a client agrees
 * to be named, one sentence about shipped work replaces this whole block.
 */
export const BUILDERS_EYEBROW = "The builders"

/**
 * The employer list as data, because the redesign renders it as an
 * auto-scrolling text strip (NameCarousel) as well as a sentence. Names as
 * text, never logos, per the rules above. BUILDERS_HEADLINE is derived so
 * the sentence and the strip can never drift apart.
 */
export const BUILDERS_NAMES = [
  "Google",
  "Deloitte",
  "National Grid",
  "Ford",
  "BambooHR",
  "Leland",
  "Cicero",
  "Redo",
  "Yatta Golf",
]

/** The strip's leading label. Reads as the start of the headline sentence. */
export const BUILDERS_STRIP_EYEBROW = "Our builders have shipped at"

/**
 * OVERRIDE OF THE NO-LOGOS RULE, by Corbin (Director of Marketing),
 * 2026-08-16: the shipped-at strip renders company logos. The rule above
 * ("No logos, ever — a logo reads as endorsement") still stands as the
 * recorded team position; this is a deliberate exception pending team
 * review, kept one change away from reverting (render BUILDERS_NAMES as
 * text again by dropping the logo fields).
 *
 * Files in public/logos/, sourced 2026-08-16 from Wikimedia Commons or
 * the company's own live site assets — current official wordmarks, all
 * validated (no scripts, no external refs). Leland and Redo use
 * currentColor and render black in an <img>; the strip grayscales
 * everything anyway. Same order as BUILDERS_NAMES.
 */
export const BUILDERS_LOGOS: { name: string; logo?: string }[] = [
  { name: "Google", logo: "/logos/google.svg" },
  { name: "Deloitte", logo: "/logos/deloitte.svg" },
  { name: "National Grid", logo: "/logos/national-grid.svg" },
  { name: "Ford", logo: "/logos/ford.svg" },
  { name: "BambooHR", logo: "/logos/bamboohr.svg" },
  { name: "Leland", logo: "/logos/leland.svg" },
  { name: "Cicero", logo: "/logos/cicero.svg" },
  { name: "Redo", logo: "/logos/redo.svg" },
  { name: "Yatta Golf", logo: "/logos/yatta-golf.png" },
]

export const BUILDERS_HEADLINE =
  BUILDERS_STRIP_EYEBROW +
  " " +
  BUILDERS_NAMES.slice(0, -1).join(", ") +
  ", and " +
  BUILDERS_NAMES[BUILDERS_NAMES.length - 1] +
  "."

/* ────────────────────────────────────────────────────────────
   Showcase: reference builds

   The gallery that backs the proof band with artifacts. Same honesty rules
   as the employer list: these are products built by people on /about, stated
   as exactly that, no client claimed. When a client agrees to be named
   (Breckenridge is the likely first), it joins the grid the same way.

   Order is alphabetical, and the landing band shows the first three. Nothing
   else about the sequence is meaningful, so a build that should be seen on
   the landing page has to earn its place by name, not by being newest.

   Every blurb states where the build actually is. CareBridge Connect is a
   live product that has not yet gone live inside a facility, so its blurb
   says it is onboarding rather than implying residents are on it today, and
   it repeats none of the outcome numbers on its own marketing site: those
   are the product's claims to its buyers, not results we have watched.

   Images are cropped screenshots of the live products in public/showcase/,
   1200x750 (16:10). The French 80/20 shot is deliberately cropped to the
   product panel so no account name or personal data appears. The CareBridge
   shot is the marketing hero, whose in-app panel is an illustration, so no
   real PHI can ever ride along in the image.
   ──────────────────────────────────────────────────────────── */

export type ShowcaseItem = {
  name: string
  blurb: string
  tags: string[]
  links: { href: string; label: string }[]
  image: string
}

export const SHOWCASE_EYEBROW = "Reference builds"

export const SHOWCASE_HEADING = "Products we have shipped."

/**
 * "Live and in use today" was true of every entry until CareBridge Connect
 * joined, which is a shipped product still onboarding its first facilities.
 * The lead now claims shipped rather than in-service, which covers all four
 * without overstating any one, and each card says where its build actually
 * stands.
 */
export const SHOWCASE_LEAD =
  "Built by the people on the About page. Real products, shipped and running."

/** /work page copy. The landing band highlights; /work holds everything. */
export const WORK_HEADING = "Everything we have shipped."

export const WORK_LEAD =
  "Every entry is a real product, shipped and running, built by the people on the About page."

export const WORK_CTA = { label: "See all our work", href: "/work" }

export const SHOWCASE: ShowcaseItem[] = [
  {
    name: "App Feedback Loop",
    blurb:
      "Open-source build spec for an AI-native feedback widget: one click captures a screenshot and the machine context around it, Claude Code fixes with that context loaded, and the fix commit is reported back to the person who filed it. Built into every app we ship.",
    tags: ["Open source", "AI-native dev"],
    links: [
      { href: "https://github.com/ai-foundry-byu/app-feedback-loop", label: "GitHub" },
    ],
    image: "/showcase/app-feedback-loop.jpg",
  },
  {
    name: "CareBridge Connect",
    blurb:
      "An AI-native administration system for skilled nursing and acute care. It turns the notes staff already write in the EHR into plain-language updates for approved family members: changes of condition, appointments, events. HIPAA-compliant architecture throughout, with role-based access, encryption, and audit logging on every PHI access. Onboarding its first five facilities, each over 100 residents.",
    tags: ["Web", "Healthcare"],
    links: [
      { href: "https://carebridgeconnect.ai", label: "carebridgeconnect.ai" },
    ],
    image: "/showcase/carebridge-connect.jpg",
  },
  {
    name: "French 80/20",
    blurb:
      "An AI-native French learning app for web and iPhone, built around the words you actually use and measured progress toward 80% of everyday French.",
    tags: ["Web", "iOS app"],
    links: [{ href: "https://french8020.com", label: "french8020.com" }],
    image: "/showcase/french8020.jpg",
  },
  {
    name: "LawGrader / WriteGrader",
    blurb:
      "Agentic grading for legal and academic writing. It drafts the scores and the margin comments; the instructor decides every final grade.",
    tags: ["Web", "AI grading"],
    links: [
      { href: "https://lawgrader.ai", label: "lawgrader.ai" },
      { href: "https://new.writegrader.com", label: "new.writegrader.com" },
    ],
    image: "/showcase/lawgrader.jpg",
  },
]

/**
 * "Velocity pods" is Brandon's term and is used deliberately. It is internal
 * language, so a first-time visitor will not know what a velocity pod is. The
 * clause after it now does the explaining, which is what makes the term usable
 * here: the reader does not need to know what a pod is to understand that the
 * mix of people is matched to the job.
 *
 * "30 students", not "15 MBAs", per Scott 2026-08-01: the roster now includes
 * the undergraduates, and the count covers the whole program rather than the
 * MBA cohort alone.
 *
 * "30" as a numeral, not spelled out, per Brandon's original call on "15". It
 * is a credibility stat and numerals read as more concrete than words for a
 * number a buyer is meant to weigh. Note that "(Approximately two minutes)"
 * under the quote button is still spelled out, so the site is not internally
 * consistent on this. That is defensible, since one is a claim about scale and
 * the other is an aside about effort, but if it ever gets normalised,
 * normalise it everywhere at once.
 */
export const BUILDERS_DETAIL =
  "30 students from a range of disciplines and backgrounds, working in teams of one or two matched to the expertise your project needs."

/**
 * The section heading on the landing page.
 *
 * It was "Get a quote", which mislabelled the section: nearly all of it is what
 * we build, and only the button at the end is the quote. It also collided with
 * the nav button and the form page, so a visitor met three near-identical
 * labels in one funnel and could not tell whether they had arrived.
 *
 * Now the section is named for its content and the button carries the action.
 */
/**
 * The third ethos item, alongside Scott and the builder experience.
 *
 * Confirmed by Brandon 2026-07-29. Stated as membership and nothing more: no
 * "certified by", no "endorsed by", no "in partnership with Anthropic", because
 * membership in a partner network is what is true and each of those would claim
 * something further. The detail line ties it to what a client gets rather than
 * inventing benefits of the programme that nobody has verified.
 */
export const PARTNER_EYEBROW = "Partner network"

export const PARTNER_HEADLINE =
  "Member of the Anthropic Claude Partner Network."

export const PARTNER_DETAIL =
  "We build on the same frontier tooling we train your team to use."

export const BUILD_HEADING = "What we build"

/** Under the BUILD_HEADING compression pair, from the redesign. */
export const BUILD_LEAD =
  "Every engagement combines what your project needs. You get a written scope, a cost estimate, and a delivery timeline."

/**
 * The three things we sell.
 *
 * There used to be a "Three offerings." heading and a paragraph above these
 * explaining that engagements combine them. Both were filler: the cards say it,
 * and counting them for the reader is not information.
 *
 * Every blurb is one plain line. The bullets carry the specifics, so a blurb
 * that also explains costs the reader twice. Language is deliberately
 * unjargoned: no "line-of-business systems", no "B2C" and "B2B" shorthand,
 * because the buyer here may be a small business owner rather than a CTO.
 */
export type Offering = { name: string; blurb: string; points: string[] }

export const OFFERINGS: Offering[] = [
  {
    name: "Full-stack applications",
    blurb: "Net-new web and mobile applications.",
    points: [
      "Customer-facing products",
      "Products you sell to other businesses",
      "Internal tools your own team uses every day",
    ],
  },
  {
    name: "AI integration and orchestration",
    blurb: "AI built into the systems you already run today.",
    points: [
      // "with your data", not "against your data". Against sounds adversarial.
      "Agents and copilots that work with your data",
      "Automations across Slack, Notion, and other tools in your existing stack",
      "Document processing, extraction, routing, and summarization",
    ],
  },
  {
    name: "AI enablement and training",
    blurb: "We train your own team to build this way, with the same tools we use.",
    points: [
      "Claude Code, Codex, and frontier agent tooling",
      "Agentic workflow and automation setup",
      "Co-working alongside your staff, then handoff",
    ],
  },
]

/** Under the button. Sets the effort expectation without itemising the form. */
export const QUOTE_CTA_NOTE = "(Approximately two minutes)"

export const QUOTE_LEAD =
  "Tell us what you want built. We come back with a scope of work, a cost estimate, and a delivery timeline. All information is treated as confidential."

/**
 * The redesign splits QUOTE_LEAD into a headline sentence and the rest, on
 * both the landing CTA band and the /quote intro. Derived, not retyped, so
 * an edit to QUOTE_LEAD flows through.
 */
export const QUOTE_HEADLINE = QUOTE_LEAD.slice(0, QUOTE_LEAD.indexOf(". ") + 1)

export const QUOTE_FOLLOW = QUOTE_LEAD.slice(QUOTE_LEAD.indexOf(". ") + 2)

/** The confirmation state after a successful submission, from the redesign. */
export const QUOTE_CONFIRM = {
  eyebrow: "Request received",
  title: "We will follow up within a few days.",
  detail: "A conversation first, then a written scope of work with cost and schedule.",
}

/**
 * The eight fields that go on the page.
 *
 * BYU Marketing Lab's quote form, the closest comparable and the one this site
 * is modelled on, asks exactly six: first name, last name, phone, email,
 * company, brief project description. Those six are all here.
 *
 * Two are added, and only two. Website and timeline are each a single tap and
 * each changes how the work gets scoped, which is the bar a field has to clear
 * to earn a place before first contact.
 *
 * Budget is deliberately NOT here. It is the strongest qualifier in the brief
 * and the fastest way to lose a first-time visitor who has not yet been given a
 * reason to trust the program. It moves to the follow-up survey, once there is
 * a conversation to hang it on.
 *
 * The other thirty-odd fields in the intake brief are the follow-up survey
 * below. Nothing from the brief is lost, it is just sequenced.
 */
export type QuoteField = {
  label: string
  type: "text" | "email" | "tel" | "url" | "textarea" | "select"
  required: boolean
  help?: string
  options?: string[]
}

export const QUOTE_FIELDS: QuoteField[] = [
  { label: "First name", type: "text", required: true },
  { label: "Last name", type: "text", required: true },
  { label: "Email", type: "email", required: true },
  { label: "Phone number", type: "tel", required: false },
  { label: "Company", type: "text", required: true },
  { label: "Website", type: "url", required: false },
  {
    label: "What do you want built",
    type: "textarea",
    required: true,
    help: "A few sentences is plenty. If you are not sure yet, say so, that is a normal place to start.",
  },
  {
    label: "When do you need it",
    type: "select",
    required: false,
    options: [
      "As soon as possible",
      "Within a semester",
      "Within the year",
      "Exploring, no date yet",
    ],
  },
]

/** What happens after the form. Three steps, so nobody wonders. */
export const QUOTE_STEPS: { n: number; title: string; detail: string }[] = [
  { n: 1, title: "You send the short form", detail: "Eight fields. Two minutes." },
  { n: 2, title: "We follow up", detail: "A conversation, plus a longer intake survey covering process, users, data, platform, and compliance." },
  { n: 3, title: "You get a written scope", detail: "Deliverables, cost, and schedule, in writing." },
]

/**
 * The follow-up intake survey: the rest of AI-Foundry-Project-Brief.pdf.
 * Not rendered as form fields on the page. Kept here because it is the spec for
 * the second Google Form, and because it is the record of what the brief asks.
 */
export type IntakeSection = { n: number; title: string; detail: string }

export const SURVEY_SECTIONS: IntakeSection[] = [
  { n: 1, title: "Current process", detail: "The process to replace or improve, step by step. How often it runs, who runs it, hours per week, and where it currently fails." },
  { n: 2, title: "Objectives", detail: "The intended outcome, and one or more measurable success criteria." },
  { n: 3, title: "Users", detail: "Who will use it, their roles and headcount, and their technical proficiency." },
  { n: 4, title: "Scope", detail: "Three to five capabilities required for the initial release, capabilities desired later, and explicit exclusions." },
  { n: 5, title: "Data and integrations", detail: "Where the relevant data lives, which systems it must integrate with, whether access can be provided, and whether sample files are available." },
  { n: 6, title: "Platform", detail: "Target environment, and whether it runs continuously in the background or on demand." },
  { n: 7, title: "Compliance and privacy", detail: "Applicable regulations, sensitive data, and any action that must require human approval." },
  { n: 8, title: "Design references", detail: "Applications you consider well designed and why, and applications you find difficult and why." },
  { n: 9, title: "Budget and ownership", detail: "Budget range, prior attempts and their outcomes, and who owns and is trained on the result." },
  { n: 10, title: "Additional information", detail: "Anything else relevant to scoping the work." },
]

/* ────────────────────────────────────────────────────────────
   Join the network
   ──────────────────────────────────────────────────────────── */

/** The "Stay in touch" form on /network. Keys are what the app's
 *  /api/network/signup turns into list tags (ai_foundry_<key>). */
export const STAY_INTERESTS: { key: string; label: string; detail?: string }[] = [
  {
    key: "interns",
    label: "Hosting an intern",
    detail: "We match employers with students in STRAT 477R, our product internship course.",
  },
  { key: "project", label: "I may have a project for the Foundry" },
  { key: "talent", label: "Hiring builders from the cohort" },
  { key: "events", label: "Live BYU-sponsored AI events" },
  { key: "digest", label: "The periodic AI digest" },
  { key: "student", label: "I'm a student interested in joining" },
]

export const STAY_CONFIRM = {
  eyebrow: "Thank you",
  title: "You're on the list.",
  detail: "We'll be in touch about what you checked.",
}

/* ────────────────────────────────────────────────────────────
   People

   Roster and headshots carried from the previous site. Roles are as
   recorded there and are pending Brandon's confirmation.
   ──────────────────────────────────────────────────────────── */

/** The /about page opener, from the redesign. BUILDERS_DETAIL is its lead. */
export const ABOUT_EYEBROW = "About us"

export const ABOUT_HEADING = "The people who build."

export type Member = {
  name: string
  role: string
  bio: string | null
  linkedin: string
  photo: string
}

export const TEAM: Member[] = [
  { name: "JD Davenport", role: "Managing Director", bio: "JD is the Managing Director of AI Foundry and a BYU MBA candidate. Before the MBA he was an AI product consultant at Deloitte, then went from Technical PM to Principal at National Grid in about two years, building a cloud portfolio from zero to 500-plus services and an AI-driven pricing engine. He started AI Foundry to give MBAs real reps building and shipping with AI agents.", linkedin: "https://www.linkedin.com/in/jd-davenport/", photo: "/team/jd-davenport.jpg" },
  { name: "Sophia Strong", role: "Undergraduate", bio: "Sophia is a BYU Strategic Management student and a product management intern at BambooHR, with prior product work at Entrata, Leland, and Bankaroo.", linkedin: "https://www.linkedin.com/in/sophia-strong/", photo: "/team/sophia-strong.jpg" },
  { name: "Rachel Moulton", role: "Chief of Staff", bio: "Rachel is involved in healthcare analytics and product management with a background in public health. She's focused on improving healthcare delivery through data and strategy and hopes to drive meaningful change in healthcare outcomes and experiences.", linkedin: "https://www.linkedin.com/in/rachel-moulton", photo: "/team/rachel-moulton.jpg" },
  { name: "Nathan McCauley", role: "Undergraduate", bio: "Nathan is a BYU Strategy and Computer Science student and an associate product manager intern at Google, focused on helping students break into product management.", linkedin: "https://www.linkedin.com/in/nate-mccauley/", photo: "/team/nate-mccauley.jpg" },
  { name: "Corbin Sterling", role: "Director of Marketing", bio: "Corbin is a BYU MBA candidate concentrating in Marketing and Strategy, with a creative background rooted in music and movie production. He is focused on using AI tools to sharpen how brands market and decide what to build next.", linkedin: "https://www.linkedin.com/in/corbinsterling/", photo: "/team/corbin-sterling.jpg" },
  { name: "Ella Moore", role: "Undergraduate", bio: "Ella is a BYU student, president of the BYU Product Management Association, and an incoming summer analyst at Goldman Sachs.", linkedin: "https://www.linkedin.com/in/ella-moore24/", photo: "/team/ella-moore.jpg" },
  { name: "Brandon Jeppson", role: "BYU Products", bio: "Brandon is a BYU MBA ('27) in Product Management, and the VP of Sales at Cougar Strategy Group. He is currently standing up the partnership motion at Redo, and is building AI operating systems to open new revenue channels with leading 3PL and logistics providers.", linkedin: "https://www.linkedin.com/in/bjepp/", photo: "/team/brandon-jeppson.jpg" },
  { name: "Calvin Nickerson", role: "Undergraduate", bio: "Calvin is a Finance student at BYU Marriott and an aspiring management consultant, currently working with Solar Grazing Solutions.", linkedin: "https://www.linkedin.com/in/calvin-nickerson/", photo: "/team/calvin-nickerson.jpg" },
  { name: "Alex Sisk", role: "External Deals", bio: "Alex is an MBA candidate concentrating in Finance with a background spanning commercial real estate, SaaS sales engineering, and entrepreneurship. He is launching a mortgage company with an AI-native operations strategy.", linkedin: "https://www.linkedin.com/in/alex-sisk/", photo: "/team/alex-sisk.jpg" },
  { name: "Jordan Faust", role: "Undergraduate", bio: "Jordan is a BYU Strategic Management student working in AI product management at Leland.", linkedin: "https://www.linkedin.com/in/jordan-faust-5a1028207/", photo: "/team/jordan-faust.jpg" },
  { name: "Abe Bedard", role: "SMBs", bio: "Abraham is a strategy-obsessed entrepreneur, BYU MBA ('27), and CEO at Yatta Golf. After scaling the brand from scratch to $7M+ in annual revenue, his mission remains unchanged: build wicked-good product, develop world-class talent, and help humans enjoy the heck out of life.", linkedin: "https://www.linkedin.com/in/abraham-bedard/", photo: "/team/abe-bedard.jpg" },
  { name: "Carter King", role: "Undergraduate", bio: "Carter is a Strategy student at BYU and a builder in Sandbox.", linkedin: "https://www.linkedin.com/in/carter-king1/", photo: "/team/carter-king.jpg" },
  { name: "Felix Vivanco Salazar", role: "Alumni Relations", bio: "Felix is a BYU MBA candidate ('27) and a senior mortgage broker at Direct Rate Home Loans, where he leads a team of loan officers. He began his career as an investment banking analyst at Goldman Sachs, later ran multimillion-dollar neurology research at University of Utah Health, and spent a year facilitating microloans for women entrepreneurs across Southeast Asia, the Middle East, and Latin America.", linkedin: "https://www.linkedin.com/in/felix-vivanco/", photo: "/team/felix-vivanco-salazar.jpg" },
  { name: "Tate Stevens", role: "Undergraduate", bio: "Tate is a BYU student, VP of the Management Consulting Association, and an AI solutions architect at Cicero, part of MGT.", linkedin: "https://www.linkedin.com/in/tate-stevens-604299222/", photo: "/team/tate-stevens.jpg" },
  { name: "Tulga Ganbat", role: "Product Evaluation and QC", bio: "Tulga is an MBA candidate in Marketing and Product Management with a bachelor's degree in Statistics and Data Science. He is the founder of Orchuul.mn, Mongolia's first and largest AI-powered translation marketplace, which he independently built and scaled.", linkedin: "https://www.linkedin.com/in/tulgaganbat", photo: "/team/tulga-ganbat.jpg" },
  { name: "Dawson Broadbent", role: "MISM", bio: "Dawson is a Master of Information Systems Management student at BYU Marriott on the AI track. He builds Workday reports, integrations, and orchestrations for BYU's finance and HR systems, and is building BidForge, a tool that uses Claude Code and vision models to automate estimating for electricians. He coauthored published research on AI for social good (AMCIS 2025).", linkedin: "https://www.linkedin.com/in/dawsonfbroadbent/", photo: "/team/dawson-broadbent.jpg" },
  { name: "Kainoa Shintaku", role: "Undergraduate", bio: "Kainoa is a BYU Marriott student focused on AI architecture and implementation, currently with TechForce Advisors.", linkedin: "https://www.linkedin.com/in/kainoa-shintaku-6b23472a7/", photo: "/team/kainoa-shintaku.jpg" },
  { name: "Jake Healey", role: "AI Tooling", bio: "Jake is a BYU MBA candidate ('27) with an engineering background spanning explosives, precision metrology, and medical devices. He was an explosives engineer at WESCO running drilling and blasting on mine sites, and before that did high-precision measurement work for defense, aerospace, and heavy industry, and quality engineering on medical devices at Innovasis.", linkedin: "https://www.linkedin.com/in/jacobjhealey/", photo: "/team/jake-healey.jpg" },
  { name: "Andrew Bedell", role: "Undergraduate", bio: "Andrew is a BYU Strategy student and a strategy and operations intern at SensorHubb.", linkedin: "https://www.linkedin.com/in/andrewbedell9/", photo: "/team/andrew-bedell.jpg" },
  { name: "Ty Hoagland", role: "Undergraduate", bio: "Ty is a BYU Strategic Management and Economics student and an AI research and implementation intern at Brevium, where he builds automations for revenue operations. He is co-president of BYU's AI in Business bootcamps.", linkedin: "https://www.linkedin.com/in/tyler-hoagland/", photo: "/team/ty-hoagland.jpg" },
  { name: "Sylvan Scott", role: "Thought Leadership", bio: "Sylvan is a BYU MBA candidate ('27) focused on product management and growth systems. At Piano by Pictures Academy he moved from product marketing to Director of Product and Growth, where he lifted onboarding completion 11x, tripled retention, and converted that engagement into $250K a year in high-margin revenue.", linkedin: "https://www.linkedin.com/in/sylvan-j-scott/", photo: "/team/sylvan-scott.jpg" },
  { name: "Chase Clement", role: "Finance", bio: "Chase is an MBA candidate concentrating in Finance with a background in enterprise systems implementation and financial operations. A former Division 1 javelin thrower, he is now launching a mortgage company built on AI-driven automation.", linkedin: "https://www.linkedin.com/in/chase-clement9", photo: "/team/chase-clement.jpg" },
  { name: "John Passey", role: "UX and UI Design", bio: "John is an MBA candidate at BYU Marriott with five years of experience making health insurance easier to understand, navigate, and use.", linkedin: "https://www.linkedin.com/in/johnpassey/", photo: "/team/john-passey.jpg" },
  { name: "Tyler Doman", role: "Education and Training", bio: "Tyler is a BYU MBA ('27) on the entrepreneurship track with a background in strategy and growth. He is pursuing Entrepreneurship Through Acquisition, where he plans to acquire a small business and use AI implementation to professionalize and scale its operations.", linkedin: "https://www.linkedin.com/in/tyler-doman/", photo: "/team/tyler-doman.jpg" },
  { name: "Enoch Councill", role: "Ambassador, Cougar Capital", bio: "Enoch is a BYU MBA candidate and the Director of AI at Cougar Capital, the student-run investment fund, where he builds tools to speed up and sharpen the VC process. Before his MBA he worked in technology implementations, pre-sales, and customer success within B2B SaaS.", linkedin: "https://www.linkedin.com/in/enochcouncill/", photo: "/team/enoch-councill.jpg" },
  { name: "Jorge Beltran", role: "Ambassador, Savage", bio: "Jorge is an MBA candidate at BYU Marriott and a Finance Intern at Ford Motor Company. Previously he led organizations through ERP transformations as a Senior Supply Chain Consultant.", linkedin: "https://www.linkedin.com/in/jorge-u-beltran/", photo: "/team/jorge-beltran.jpg" },
]

/**
 * Faculty advisor. Naming him is the single highest-credibility item on the
 * site, which is also why the title needs to be right. Confirm with Scott
 * before this goes live.
 */
export const FACULTY = {
  name: "Scott Murff",
  role: "Faculty Advisor",
  detail:
    "Associate Teaching Professor of Strategy at the " +
    SCHOOL_FULL +
    ", and former consultant at McKinsey & Company.",
  /** Verification links — the credibility claim, clickable (2026-08-16). */
  links: [
    { href: "https://marriott.byu.edu/directory/details?id=14373", label: "BYU Marriott directory" },
    { href: "https://www.linkedin.com/in/scottdmurff/", label: "LinkedIn" },
  ],
}

/* ────────────────────────────────────────────────────────────
   Culture

   Scott's synthesis brief, 2026-08-01: establish the program's cultural DNA
   by gathering principles from four organizations, in the spirit of Brigham
   Young's admonition to gather up all the good and true principles wherever
   they are found. Sources, credited by name on the page:

     Amazon        Leadership Principles
     Bridgewater   the original philosophy
     McKinsey      purpose, mission, and values
     The Church of Jesus Christ of Latter-day Saints
                   Christlike attributes, Preach My Gospel ch. 6

   The principles are synthesized in our own words, never quoted, and each row
   names the organizations it draws from. The two practices (Ask First and the
   red face test) are the Foundry's own.

   This is the draft for the team to review at the Friday meeting; expect the
   language to be edited there.
   ──────────────────────────────────────────────────────────── */

export type Principle = { title: string; blurb: string; credit: string }

export const CULTURE_EYEBROW = "Our culture"

export const CULTURE_HEADING = "Who we are"

/** The Foundry's own purpose, verbatim from the course book's Client Service
 *  Selection Policy (students/00-client-selection.qmd). It is the one statement
 *  the Foundry keeps; mission, vision and values are BYU Marriott's.
 *  \u2011 is a non-breaking hyphen so "disciple-leaders" never splits. */
export const PURPOSE =
  "The purpose of the AI Foundry is to develop disciple\u2011leaders who use AI to enhance human flourishing."

export const CULTURE_LEAD =
  "AI Foundry shares the mission, vision, and values of the BYU Marriott School of Business."

/**
 * The top of the pyramid: BYU Marriott's own vision, mission, values, and
 * guiding principle, verbatim as published by the school. The Foundry does
 * not edit these; it inherits them.
 */
export const MARRIOTT_EYEBROW = "BYU Marriott"

export const MARRIOTT_VISION =
  "We aspire to transform the world through Christlike leadership."

export const MARRIOTT_MISSION =
  "We develop leaders of faith, intellect, and character."

export const MARRIOTT_VALUES: { title: string; blurb: string }[] = [
  {
    title: "Faith in Christ",
    blurb:
      "We value deep and abiding faith in Jesus Christ. Our faith gives us the capacity to envision a better future, the confidence to make that future happen, and the courage to act in the face of challenges.",
  },
  {
    title: "Integrity in Action",
    blurb:
      "We value integrity and hold ourselves to the highest moral and ethical standards. Acting with integrity builds trust, strengthens character, and focuses our ambitions on things of eternal consequence.",
  },
  {
    title: "Respect for All",
    blurb:
      "We value respect for all individuals as children of God and recognize the inherent worth, divine potential, and agency of each person. A climate of respect and belonging enhances our learning, facilitates collaboration, and encourages personal growth.",
  },
  {
    title: "Excellence",
    blurb:
      "We value excellence in learning, teaching, research, management, and leadership. An expectation of excellence magnifies our influence and motivates us to continually improve.",
  },
]

export const MARRIOTT_GUIDING = {
  title: "Centered on Students",
  blurb:
    "We evaluate our decisions and actions by the impact they will have on the academic experience, professional preparation, character development, emotional well-being, and spiritual growth of our students.",
}

export const CULTURE_DOUBLE_CLICK_HEADING = "How we operate"

export const CULTURE_DOUBLE_CLICK_LEAD =
  "In the spirit of Brigham Young's admonition to gather up all the good and true principles wherever they are found, these operating principles are gathered from four organizations we study and admire: Amazon's Leadership Principles, Bridgewater's original philosophy, McKinsey's values, and the Christlike attributes taught in Preach My Gospel. Credit is noted where it is owed."

export const CULTURE_PRINCIPLES: Principle[] = [
  {
    title: "Client results first",
    blurb:
      "We put the client's interest ahead of our own and measure ourselves by whether their performance actually improves.",
    credit: "After McKinsey",
  },
  {
    title: "Radical truthfulness",
    blurb:
      "We say what is true, especially when it is uncomfortable, and we carry an obligation to dissent when we disagree.",
    credit: "After Bridgewater and McKinsey",
  },
  {
    title: "Ownership",
    blurb:
      "We act on behalf of the whole program, never say that is not my job, and keep a bias for action.",
    credit: "After Amazon",
  },
  {
    title: "The highest standards",
    blurb:
      "We hold standards others may find unreasonably high, and we keep raising them. Work counts when it ships and works.",
    credit: "After Amazon and McKinsey",
  },
  {
    title: "Learn relentlessly",
    blurb:
      "We stay curious, dive deep, and learn from our mistakes.",
    credit: "After Amazon and Bridgewater",
  },
  {
    title: "Meaningful work, meaningful relationships",
    blurb:
      "We pursue excellence together and care about the people we do it with.",
    credit: "After Bridgewater",
  },
  {
    title: "Christlike character",
    blurb:
      "Faith, hope, charity, virtue, knowledge, patience, humility, and diligence govern how we treat every client, teammate, and competitor.",
    credit: "After Preach My Gospel",
  },
]

export const CULTURE_PRACTICES: Principle[] = [
  {
    title: "Ask for feedback",
    blurb:
      "Everyone here is empowered to give feedback, and the stronger habit is asking for it. The norm at the Foundry is to ask first.",
    credit: "Ours",
  },
  {
    title: "The red face test",
    blurb:
      "When the right course is ambiguous, ask: could I explain this decision to a leader I respect without going red in the face? If not, do not do it.",
    credit: "Ours",
  },
]

/* ────────────────────────────────────────────────────────────
   Forms

   As of 2026-08-01 the forms are native components posting to the same
   Supabase project the previous site used: QuoteForm to /api/quote.
   NetworkForm and /api/network were retired 2026-10-08: joining the network
   is now a Join button into the app (APP_JOIN), where requests wait for
   faculty or a leader. The embedded Google Forms era, including
   the FORMS url map that lived here, is recorded in FORMS.md; the Google
   Forms themselves still exist under aifoundry.byu@gmail.com but nothing on
   the site renders them.

   The deploy now needs two env vars, SUPABASE_URL and SUPABASE_SERVICE_KEY.
   Both API routes create their client lazily at request time, so a build
   without them still succeeds; only a submission fails.
   ──────────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────────
   Navigation

   Every destination below is a page or a section that actually exists.
   Nothing here is a placeholder for a page yet to be built.
   ──────────────────────────────────────────────────────────── */

export type NavLink = { label: string; href: string }

/**
 * The top bar, by Scott's call 2026-10-15: what everyone wants (Our work, Our
 * approach), the student door (For students), and About as the one menu. Clients
 * have no tab of their own: the Start a project button is their door, so a
 * "For clients" tab would be a second door to the same place.
 */
export const NAV: NavLink[] = [
  { label: "Our work", href: "/work" },
  { label: "Our approach", href: "/approach" },
  { label: "For students", href: "/students" },
]

/**
 * About is a menu because its pages serve different readers (the curious, the
 * network, donors). Donors moved here from the top bar on 2026-10-15. It went
 * into the top bar on 2026-08-25 because a thank-you page nobody can find thanks
 * nobody; one click under About keeps it findable without a URL.
 */
export const NAV_ABOUT: { label: string; items: NavLink[] } = {
  label: "About",
  items: [
    { label: "About us", href: "/about" },
    { label: "Join the network", href: "/network" },
    { label: "Donors", href: "/donors" },
  ],
}

/** Every page in the top bar, flat, for the footer. */
export const NAV_ALL: NavLink[] = [...NAV, ...NAV_ABOUT.items]

/**
 * Two steps, two destinations, and they do not overlap.
 *
 *   NAV_CTA   -> /#quote   what we build, and what an engagement is
 *   QUOTE_CTA -> /quote    the form, and nothing else
 *
 * The offerings live in exactly one place and the form lives in exactly one
 * place, so neither can drift out of step with a second copy of itself. The
 * hero button and the top bar both land on the offerings; the only route to
 * the form is through them.
 */
/** Both CTAs read "Start a project" per Scott, 2026-10-15 (was "Work with us"
 *  per Corbin 2026-08-16, which a student could read as "join us"; before that
 *  "Request a proposal"). The two-destination scheme above is unchanged, only
 *  the words on the buttons. */
export const NAV_CTA: NavLink = { label: "Start a project", href: "/#quote" }

/**
 * The app at aifoundry.byu.edu/app (the Strategy repo, served here by the /app
 * rewrite in next.config.ts). The header's door, AccountMenu, and the network
 * page's Join button go here. One join for everyone: the address someone joins
 * with decides where they land (Strategy repo, docs/LOGIN-DOOR.md).
 */
export const APP_SIGN_IN = "/app/login"
export const APP_JOIN = "/app/join"
export const APP_HOME = "/app"
export const APP_PROFILE = "/app/profile"
export const APP_SIGN_OUT = "/app/auth/signout"

export const QUOTE_CTA: NavLink = { label: "Start a project", href: "/quote" }

/* ────────────────────────────────────────────────────────────
   Roadmap

   What the program is building, in three phases, at /roadmap.

   The counts on that page are NOT here: they are read live from the
   database at request time (see src/lib/roadmap-stats.ts). Only the
   things a human decides live in this file. That split is the whole
   point of the page. A number nobody has to remember to update cannot
   go stale, and a phase status nobody can fake cannot be optimistic.

   So: if you are tempted to hardcode a count below, read the stat from
   the database instead. If it is not in the database yet, leave the
   item without a stat rather than typing a number that will rot.
   ──────────────────────────────────────────────────────────── */

export const ROADMAP_EYEBROW = "Roadmap"

export const ROADMAP_HEADING = "What we are building, and where it stands."

export const ROADMAP_LEAD =
  "Three phases, in order. The counts on this page are read from our own systems each time it loads, so what you see is the current number and not a figure from the last time somebody updated a slide."

/** The cert goal. Referenced by the page for its progress bar. */
export const CERT_GOAL = 10

/**
 * The contract target, and the date it is measured on.
 *
 * Deliberately NOT rendered on the public roadmap. It is the internal wall
 * metric, and a prospective client reading the current number against it
 * would be the most expensive sentence this site could publish. It lives on
 * the gated operating view instead.
 */
export const CONTRACT_GOAL = 20
export const CONTRACT_DEADLINE = "2026-09-01"

/**
 * `stat` names a field on the live stats object, so the number is read
 * rather than written. `null` means the item has no number yet, which is
 * honest and preferable to inventing one.
 *
 * `status` is the one genuinely hand-maintained field on this page. It is
 * a judgement, not a measurement, so it cannot be derived. Keep it honest:
 * "live" means a visitor can use it today, "active" means work is
 * happening this month, "planned" means it is agreed but not started.
 */
export type RoadmapStatus = "live" | "active" | "planned"

export type RoadmapItem = {
  name: string
  detail: string
  status: RoadmapStatus
  /** Field on the live stats object, and the caption to read it under. */
  stat?: { field: string; caption: string }
  /** Renders a progress bar toward CERT_GOAL instead of a plain count. */
  goal?: boolean
}

export type RoadmapPhase = {
  n: number
  title: string
  subtitle: string
  items: RoadmapItem[]
}

export const ROADMAP: RoadmapPhase[] = [
  {
    n: 1,
    title: "Foundation",
    subtitle: "Identity, leadership, and credentials",
    items: [
      {
        name: "Mission, brand, and website",
        detail:
          "Mission and vision decided and proofed. This site is live on the BYU domain, with the proposal and network forms writing to our own database.",
        status: "live",
      },
      {
        name: "Claude Architect certification",
        detail:
          "The cohort certifies on the frontier agent tooling we build with. Leadership first, then out to the wider roster.",
        status: "active",
        goal: true,
      },
      {
        name: "Advisory board",
        detail:
          "Senior advisors across AI, venture, and industry, recruited to advise the program.",
        status: "active",
        stat: { field: "advisoryBoard", caption: "confirmed" },
      },
      {
        name: "Founding partners",
        detail:
          "Organizations committing project work, mentorship, and access to the cohort.",
        status: "active",
      },
    ],
  },
  {
    n: 2,
    title: "Community",
    subtitle: "Reach, presence, and the first events",
    items: [
      {
        name: "Reaching the BYU Marriott cohort directly",
        detail:
          "Reaching MBAs through the channels the school already runs, rather than waiting for them to find the program.",
        status: "active",
      },
      {
        name: "The network",
        detail:
          "Alumni, faculty, founders, and builders who want the digest, the events, or first access to the cohort when they are hiring.",
        status: "active",
        stat: { field: "network", caption: "people in the network" },
      },
      {
        name: "Marketing and LinkedIn",
        detail:
          "Building the program's presence across BYU Marriott and the wider AI and venture community.",
        status: "active",
        stat: { field: "linkedinFollowers", caption: "followers" },
      },
      {
        name: "Client project pipeline",
        detail:
          "Scoping inbound work from this site and matching each project to a velocity pod. First engagements are being scoped now.",
        status: "active",
      },
      {
        name: "Launch party",
        detail:
          "The public launch, bringing the network, the advisory board, and the founding partners into one room.",
        status: "planned",
      },
      {
        name: "MBA case competition",
        detail:
          "A low-stakes AI case competition for BYU MBAs. It builds the culture and identifies the builders worth recruiting.",
        status: "planned",
      },
    ],
  },
  {
    n: 3,
    title: "Programs",
    subtitle: "Competition, conference, and scale",
    items: [
      {
        name: "Competitive product competition",
        detail:
          "A high-stakes AI product competition with a real judging panel and partner sponsors.",
        status: "planned",
      },
      {
        name: "School-wide hackathon",
        detail:
          "BYU-wide and cross-disciplinary. Mixed teams shipping something that runs, in a weekend.",
        status: "planned",
      },
      {
        name: "Conference",
        detail:
          "Speakers, demos, and a recruiting showcase. Whether it runs in the fall alone or in both semesters is still open.",
        status: "planned",
      },
    ],
  },
]

/** Under the counts. Says where they came from, so nobody has to ask. */
export const ROADMAP_STATS_NOTE =
  "Read from our own systems when this page loaded."

/**
 * The roadmap, linked from the footer only.
 *
 * Deliberately not a fourth item in the top bar. SPEC.md fixes that bar at
 * two tabs plus the action, and the roadmap is a page you go looking for
 * rather than one that should compete with "Request a proposal" for a
 * first-time visitor's attention.
 */
export const ROADMAP_LINK: NavLink = { label: "Roadmap", href: "/roadmap" }

/**
 * The monthly update one-pager, at /update. Footer only, on the roadmap
 * precedent: it exists so an advisor email can link to it, not to compete
 * with the top bar for a first-time visitor.
 */
export const UPDATE_LINK: NavLink = { label: "Latest update", href: "/update" }

/* ────────────────────────────────────────────────────────────
   The update, at /update

   PUBLIC and indexable, unlike /board and /brief. It carries the same
   one-pager the advisors get by email, so nothing on it may be more
   private than that email: program-level counts only, no names beyond
   the faculty director the image already credits, no contact details.

   The image and PDF are built outside this repo (ai-foundry domain state,
   infographic/build.py) and copied into public/update/ with the month in
   the filename, so an old email's PDF link keeps resolving after the page
   moves on to the next month. To publish a new month: drop the new pair
   in public/update/, then change UPDATE below. Every number in the text
   here must already appear in the image.
   ──────────────────────────────────────────────────────────── */

export const UPDATE = {
  month: "October 2026",
  title: "AI Foundry update, October 2026",
  lead:
    "The one-page update we send our advisory board: where the program stands this month, what is coming up, and where an introduction would help most.",
  image: {
    src: "/update/ai-foundry-update-2026-10.png",
    width: 1632,
    height: 2112,
    alt:
      "AI Foundry advisory board report, October 2026. 166 network members, 315 LinkedIn followers, 30 students this fall (15 MBAs and 15 undergraduates), 20 clients (8 paying and 12 pro bono), and $50K in revenue. 14 advisory board members, ranging from Anthropic and Pelion Venture Partners to BCG X. AI Foundry is a member of Anthropic's Claude Partner Network. The page also charts network and follower growth, shows progress against the roadmap, lists what is coming up, and names the ways advisors can help.",
  },
  pdf: {
    href: "/update/ai-foundry-update-2026-10.pdf",
    filename: "ai-foundry-update-2026-10.pdf",
  },
  stats: [
    { value: "166", label: "Network members" },
    { value: "315", label: "LinkedIn followers" },
    { value: "30", label: "Students: 15 MBAs, 15 undergrads" },
    { value: "20", label: "Clients: 8 paying, 12 pro bono" },
    { value: "$50K", label: "Revenue" },
    { value: "14", label: "Advisory board members" },
  ],
  board: "Our advisors range from Anthropic and Pelion Venture Partners to BCG X, and AI Foundry is a member of Anthropic's Claude Partner Network.",
} as const

/* ────────────────────────────────────────────────────────────
   Donors, at /donors

   A thank-you page, not a solicitation. Modeled on real honor rolls
   (MIT Chemical Engineering's FY25 donor list, UGA's Honor Roll of
   Donors, BYU Marriott's own giving page): state the criteria, name
   the fund, stop.

   TWO STANDING RULES, both deliberate:

   1. No gift amounts, and no figures an amount can be computed from
      (seat counts, headcounts, per-unit quantities). A derivable proxy
      is not a policy. The reason is donor two, not donor one: once a
      much larger gift is listed, implicit magnitudes turn the roll into
      a public ranking and the founding donor sits at the bottom of a
      list they started.
   2. Nobody is listed without written permission. Ken Palmer's consent
      for both the naming and the listing is on file, 2026-08-25.

   Say what the gift is FOR. The purpose is what makes the page worth
   reading; the arithmetic is what makes it awkward.
   ──────────────────────────────────────────────────────────── */

export type Donor = {
  /** Year of the gift, as displayed. */
  year: string
  /** Exactly as the donor asked to be named. Never reformat this. */
  name: string
  /** The named fund the gift established. */
  fund: string
  /** Founding donor: the first gift to the program. A status, not a tier. */
  founding?: boolean
}

export const DONORS_EYEBROW = "Giving"
export const DONORS_HEADING = "Donors"
export const DONORS_LEAD =
  "The AI Foundry exists because of the generous support of alumni and friends of the " +
  SCHOOL_FULL +
  ". Thank you for making this experiential learning program possible."

/** The founding entry, given its own plate above the list. */
export const FOUNDING_DONOR = {
  eyebrow: "Founding donor",
  name: "Tiffany and Ken Palmer",
  fund: "The Tiffany and Ken Palmer Frontier Cohort",
  detail:
    "The first gift to the AI Foundry. It funds enterprise AI tooling for the student " +
    "builders of the Tiffany and Ken Palmer Frontier Cohort, who use it to ship " +
    "production software for Foundry clients.",
  /** Established, not Given: the name carries forward to the next cohort. */
  established: "August 2026",
  supports: "Enterprise AI tooling for student builders",
}

export const DONORS: Donor[] = [
  {
    year: "2026",
    name: "Tiffany and Ken Palmer",
    fund: "The Tiffany and Ken Palmer Frontier Cohort",
    founding: true,
  },
]

export const GIVE_HEADING = "Make a gift"
export const GIVE_LEAD =
  "Gifts are designated to the AI Foundry at the " +
  SCHOOL_FULL +
  " and are tax deductible as allowed by law. Donors choose what the gift funds and " +
  "receive a report on the work it supported."

/**
 * The giving link routes through Philanthropies. The designation is titled
 * the Strategy Student Support Fund because the AI Foundry is administered
 * by the Strategy program — a donor who clicks through sees a word they did
 * not expect, so the page says so before they can wonder.
 */
export const GIVE_URL =
  "https://give.churchofjesuschrist.org/campaigns/81183/donations/new?designation_id=30124393"

export const GIVE_ONLINE = {
  heading: "Give online",
  detail:
    "Any amount, processed by the Philanthropies Department of The Church of Jesus " +
    "Christ of Latter-day Saints. The AI Foundry is administered by the Strategy " +
    "program, so the gift is designated to the Strategy Student Support Fund and " +
    "reaches the Foundry. Donor statements are available through the giving portal.",
  cta: "Give to the AI Foundry",
}

export const GIVE_CONTACT = {
  heading: "Talk with someone",
  detail: "To discuss what a gift could support, please reach out.",
  name: "Scott Murff, Director, AI Foundry",
  email: "scott.murff@byu.edu",
}

/* Donors lives in NAV_ABOUT (see Navigation above), so the footer picks it
   up through NAV_ALL rather than a separate link. */

/* ────────────────────────────────────────────────────────────
   Our approach (/approach) and For students (/students)

   Added 2026-10-15. The source of truth for the curriculum is the course
   books, and this copy follows them: the Builder axes and their one-line
   definitions from the MSB 341 book (byu-strategy/product-management,
   index.qmd), the Consultant axes from the Foundry book's Developmentship
   page, and the classes, pathways, commitment and what students receive from
   the Foundry book's "The Builder and the Consultant"
   (byu-strategy/ai-foundry, students/06-builder-and-consultant.qmd). When an
   axis is renamed there, rename it here.
   ──────────────────────────────────────────────────────────── */

export type Axis = { name: string; detail: string }

export const APPROACH_EYEBROW = "Our approach"

export const APPROACH_HEADING = "We train AI builder consultants."

export const APPROACH_LEAD =
  "An AI builder can build things for themselves. An AI builder consultant builds " +
  "something for someone else, which adds judgment, ownership of the outcome, " +
  "communication, and collaboration to the work. Two toolkits describe that person."

export const TOOLKITS_EYEBROW = "Two toolkits"

export const TOOLKITS_HEADING = "The Builder and the Consultant"

/** Listed in the order the Build course teaches them. The diagram places
 *  them around the hexagon by BUILDER_RING, below. */
export const BUILDER_AXES: Axis[] = [
  { name: "Discovery", detail: "What to build, for whom, and whether you should." },
  { name: "Design", detail: "The surface and the flow." },
  { name: "Application Architecture", detail: "How it is structured, shipped, and kept safe." },
  { name: "AI Systems", detail: "How the models work, and why they behave the way they do." },
  { name: "Agentic Workflow", detail: "Putting AI to work, as the way you build and inside the product you build." },
  { name: "Launch and Learn", detail: "How people find it, and whether it worked." },
]

/** Clockwise from the right-hand corner, matching the course books' figure. */
export const BUILDER_RING = [
  "Design",
  "Launch and Learn",
  "AI Systems",
  "Application Architecture",
  "Agentic Workflow",
  "Discovery",
]

export const BUILDER_SUMMARY = "What you can make."

export const BUILDER_MEASURE =
  "Students rate themselves on all six at the start of the fall semester and again in " +
  "December, and get their own profile back both times."

export const CONSULTANT_AXES: Axis[] = [
  { name: "Judgment", detail: "Solving the right problem, and saying what the facts support." },
  { name: "Ownership", detail: "Driving the work forward." },
  { name: "Communication", detail: "Whether people understand the work: the updates, decks, and memos written for a reader." },
  { name: "Collaboration", detail: "Whether teammates and clients trust you, and want you on the next engagement." },
]

/** Clockwise from the top corner. */
export const CONSULTANT_RING = ["Judgment", "Communication", "Ownership", "Collaboration"]

export const CONSULTANT_SUMMARY = "What changes when the work belongs to someone else."

export const CONSULTANT_MEASURE =
  "Two axes are about the work and two are about people. Students do not rate " +
  "themselves here: the faculty advisor, teammates, and clients rate observed behavior " +
  "at midterm and at the end of each term."

export const PEDAGOGY_EYEBROW = "Our pedagogy"

export const PEDAGOGY_HEADING = "Two classes, then real clients."

export const PEDAGOGY_STEPS: { title: string; blurb: string; points: string[] }[] = [
  {
    title: "1. Build",
    blurb:
      "You are the customer. Students learn the six Builder skills by building their own " +
      "product with AI coding agents, two weeks per skill. Each week we teach a technique and " +
      "students apply it to their project.",
    points: ["MSB 341 · IS 693R · CS 498R", "Mondays, fall and winter"],
  },
  {
    title: "2. The Foundry Lab",
    blurb:
      "You are the vendor. Class time is delivery: problem solving and collaboration on " +
      "live client engagements. The Lab teaches the Consultant toolkit and tests the " +
      "Builder toolkit.",
    points: ["MBA 693R · STRAT 490R", "Fridays, 8:00 to 11:50 AM"],
  },
  {
    title: "3. Client engagements",
    blurb:
      "Organizations hire the Foundry for five-week engagements staffed by one or two " +
      "builders. The client runs the software, and it ships under the students' names.",
    points: ["Five weeks, extendable", "Faculty oversight on every engagement"],
  },
]

export const PEDAGOGY_PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Teams cover the toolkit together",
    body:
      "Nobody arrives strong on all ten axes. Teams are staffed so the team covers every " +
      "Builder axis, even when no single member does.",
  },
  {
    title: "Responsibility follows what you have shipped",
    body:
      "A student's record decides what they own on a team: shadowing a project, " +
      "contributing a piece under supervision, or owning a workstream the client sees their " +
      "name on.",
  },
  {
    title: "First principles over tools",
    body:
      "We teach the building blocks of AI software and how they combine. The tools change " +
      "every few months; the building blocks change slowly.",
  },
  {
    title: "Other people rate the consultant",
    body:
      "Students assess their own Builder skills. Judgment, ownership, communication, and " +
      "collaboration are rated by the people who worked with them, including the client.",
  },
]

export const APPROACH_CULTURE_LINK: NavLink = { label: "How we operate", href: "/about" }

export const APPROACH_CLIENT_HEADING = "What this means for your project."

export const APPROACH_CLIENT_LEAD =
  "Your team is rated on judgment, ownership, communication, and collaboration, and part " +
  "of that rating comes from you."

/* For students ─────────────────────────────────────────────── */

/** The Foundry course book, published to GitHub Pages from byu-strategy/ai-foundry. */
export const HANDBOOK_URL = "https://byu-strategy.github.io/ai-foundry/"

/** The Builder self-assessment (Google Form under aifoundry.byu@gmail.com),
 *  the same link the course book publishes. */
export const SELF_ASSESSMENT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeQoRRuXASRW2GOi5EOUdnP5-YDpFpkUu48AmqyiRoGbUn8Vw/viewform"

export const STUDENTS_EYEBROW = "For students"

export const STUDENTS_HEADING = "Build production software for real organizations, for credit."

export const STUDENTS_LEAD =
  "The AI Foundry is a BYU Marriott studio where students build AI software for real " +
  "organizations. Here is how to join, what it asks of you, and what you get."

export const JOIN_EYEBROW = "How to join"

export const JOIN_HEADING = "Take the foundation, pass the entrance exam, then join the studio."

/**
 * The product pathway as Scott sent it to prospective students (2026-10-14),
 * plus the entrance exam between the foundation and the studio. The final
 * exam of the foundation course is the entrance exam. Numbers change in
 * Fall 2027; `today` is the number a student registers for now.
 */
export type PathStep = { step: string; number: string; title: string; today: string; detail: string; when: string }

export const PATH_FOUNDATION: PathStep = {
  step: "1. Foundation",
  number: "STRAT 435",
  title: "Product Management with AI",
  today: "Today: MSB 341 (also IS 693R, CS 498R)",
  detail: "Build, test, and launch a real digital product using AI coding agents. Prerequisite: IS 201 or equivalent.",
  when: "Fall or winter, sophomore or junior year",
}

export const PATH_GATE = {
  label: "Entrance exam",
  detail: "The foundation course's final is the Foundry entrance exam. Pass it to enroll in the studio and the practicum.",
}

export const PATH_LECTURES: PathStep = {
  step: "Alongside",
  number: "STRAT 437",
  title: "Product and AI Lecture Series",
  today: "Today: MSB 342",
  detail: "Product and AI leaders on the work and the careers. No prerequisite.",
  when: "Winter",
}

export const PATH_STUDIO: PathStep = {
  step: "2. Studio",
  number: "STRAT 475R",
  title: "AI Product Studio",
  today: "Today: AI Foundry Lab, STRAT 490R / MBA 693R",
  detail: "AI-native product methods, learned by building from customer discovery through launch.",
  when: "Fall and winter, alongside the practicum",
}

export const PATH_PRACTICUM: PathStep = {
  step: "3. Practicum",
  number: "STRAT 477R",
  title: "AI Product Practicum",
  today: "Today: STRAT 477R APM Lab",
  detail: "Real product work for a client, an employer, or your own venture.",
  when: "Fall and winter, alongside the studio",
}

export const PATH_SEMESTERS = ["Fall, year 1", "Winter, year 1", "Fall, year 2", "Winter, year 2"]

export const PATH_NOTE =
  "The foundation course runs every fall and winter. Start it in winter and you take the " +
  "entrance exam at the end of winter, then join the studio and the practicum that fall. " +
  "Course numbers change in Fall 2027; the number to register for today is under each course."

export const PATHWAYS_NOTE =
  "2026-2027 is the Foundry's first year, so nobody has taken the prerequisite or the entrance exam yet. For " +
  "this year only, there are three ways in. Whichever you choose, you are a full member " +
  "of the Foundry."

export const PATHWAYS: { title: string; fall: string; winter: string; bestFor: string }[] = [
  { title: "Option 1", fall: "Build only", winter: "Foundry Lab", bestFor: "You want the Builder toolkit first, with no client work in fall." },
  { title: "Option 2", fall: "Build and Foundry Lab", winter: "Foundry Lab", bestFor: "You want to build the toolkit while staffed on a project. Plan for the extra time." },
  { title: "Option 3", fall: "Foundry Lab only", winter: "Foundry Lab", bestFor: "You already have strong Builder skills." },
]

export const EXPECT_HEADING = "What we expect"

export const EXPECT: string[] = [
  "About 10 hours a week, including the Friday studio block.",
  "Typically another 10 hours in weeks when client demand calls for it.",
  "A written update every week.",
]

export const RECEIVE_HEADING = "What you receive"

export const RECEIVE: string[] = [
  "Three credit hours per semester, six across the year.",
  "A Claude plan for Foundry work, provided or reimbursed. The plan is set each term.",
  "Production software in use at an organization, shipped under your name.",
  "A client contact who can speak to your work.",
  "Your Builder profile, at the start of the year and again in December.",
]

export const STANDING_EYEBROW = "Where you stand"

export const STANDING_LEAD =
  "Two profiles track your growth. The self-assessment takes about seven minutes, does " +
  "not affect your grade, and helps us staff teams so every team covers every skill. A " +
  "2 is more useful to us than an inflated 4."

export const HANDBOOK_EYEBROW = "The handbook"

export const HANDBOOK_LEAD =
  "Everything a Foundry student needs to know is in the course book."

/** Only chapters that are published; each path was checked live 2026-10-15. */
export const HANDBOOK_LINKS: NavLink[] = [
  { label: "The Constitution", href: HANDBOOK_URL + "students/00-constitution.html" },
  { label: "Syllabus", href: HANDBOOK_URL + "students/01-syllabus.html" },
  { label: "Getting started", href: HANDBOOK_URL + "students/02-getting-started.html" },
  { label: "Weekly updates", href: HANDBOOK_URL + "students/03-weekly-updates.html" },
  { label: "Build standards", href: HANDBOOK_URL + "students/04-build-standards.html" },
  { label: "How teams are staffed", href: HANDBOOK_URL + "students/05-how-teams-are-staffed.html" },
  { label: "The Builder and the Consultant", href: HANDBOOK_URL + "students/06-builder-and-consultant.html" },
  { label: "Resources by skill", href: HANDBOOK_URL + "students/07-resources.html" },
]

export const ALUMNI_LINE = "Graduated, or mentoring builders?"
