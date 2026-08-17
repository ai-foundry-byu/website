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

/* ────────────────────────────────────────────────────────────
   Hero
   ──────────────────────────────────────────────────────────── */

export const HERO_STATEMENT = "An AI-native product studio and consultancy."

/** One sentence, by Brandon's decision. It does one job: say whose program this
 *  is, on first reference and in full, per the naming rule above. Anything about
 *  who builds and what ships belongs further down the page, not here. */
export const HERO_SUPPORT =
  "An experiential learning program of the " + SCHOOL_FULL + "."

/**
 * The 2026-08 redesign hero (design_handoff_ai_foundry_website, direction 4b).
 * A three-line cast-125 stack with the last line in royal, over one support
 * sentence. HERO_SUPPORT becomes the eyebrow above the stack, so the naming
 * rule still holds; HERO_STATEMENT no longer renders on the landing page but
 * stays the decided one-line description used elsewhere.
 */
export const HERO_STACK = ["Student-built.", "Production-grade.", "AI-native."]

export const HERO_STACK_SUPPORT =
  "MBA and undergraduate builders shipping production AI systems for real clients."

/* ────────────────────────────────────────────────────────────
   Mission, vision, values. VERBATIM. Do not edit without Brandon.
   ──────────────────────────────────────────────────────────── */

export const MISSION =
  "We develop AI builders of faith, skill, and integrity who amplify opportunity and increase abundance worldwide."

export const VISION =
  "A world where expertise is abundant, and human flourishing is never limited by access, only by ambition."

export type Value = { name: string; body: string }

export const VALUES: Value[] = [
  {
    name: "Technical Excellence",
    body: "We are judged by what we ship: whether it works, and whether someone would pay for it. We compete on output, not pedigree. Credentials, whitepapers, and good intentions don't count as evidence; working systems in production do. Every Foundry builder is expected to master the frontier and prove that mastery through shipped work.",
  },
  {
    name: "Moral Conviction",
    body: "We hold ourselves to a higher standard than any rule will ever require. The real test of character is what you build when no one is auditing you. Access to people's data, attention, and labor is a trust freely given, never a lever to pull. We build only what people would consent to if they fully understood it. Our faith and integrity are not a compliance layer; they are the reason we build at all.",
  },
  {
    name: "Relentless Urgency",
    body: "We don't wait for permission to act on what we already know is right. Free, responsible people don't wait for institutional consensus. Urgency is a choice, the only thing that turns belief into shipped work instead of another meeting. It is how we stay at the frontier, and how we bring the frontier back to BYU.",
  },
]

/** Pairs with the vision on the About page. From voice.md. */
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
export const WORK_HEADING = "Built here. Running now."

export const WORK_LEAD =
  "Every entry is a real product, shipped and running, built by the people on the About page."

export const WORK_CTA = { label: "See all our work", href: "/work" }

export const SHOWCASE: ShowcaseItem[] = [
  {
    name: "App Feedback Loop",
    blurb:
      "Open-source build spec for an AI-native feedback widget: one click captures a screenshot and the machine context around it, Claude Code fixes with that context loaded, and the fix commit closes the loop back to the reporter. Built into every app we ship.",
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
      "An AI-native French learning app for web and iPhone, built around the words you actually use and a measured climb to 80% of everyday French.",
    tags: ["Web", "iOS app"],
    links: [{ href: "https://french8020.com", label: "french8020.com" }],
    image: "/showcase/french8020.jpg",
  },
  {
    name: "LawGrader / WriteGrader",
    blurb:
      "Agentic grading for legal and academic writing. It drafts the scores and the margin comments; the instructor keeps the final say on every grade.",
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
  "30 students from a range of disciplines and backgrounds, working in velocity pods matched to the expertise your project needs."

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
    blurb: "AI wired into the systems you already run today.",
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
  { label: "Phone number", type: "tel", required: true },
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

/**
 * There was a NETWORK_LEAD here: "Alumni, friends, and builders. Tell us what
 * you want in on: events, the weekly digest, the talent network, or a project of
 * your own."
 *
 * It is deleted rather than left orphaned, because that sentence is already the
 * Google Form's own description and renders inside the embedded form on
 * /network. Keeping it on the page above the form printed it twice, roughly a
 * screen apart. If you want it back on the page, take it off the form first.
 */

export type Interest = { title: string; blurb: string }

/**
 * The four things a visitor can opt into, and the same four options as the
 * checkbox field in the embedded form. They must stay in step: /network renders
 * these ABOVE the form as the legend for that checkbox group, so a title that
 * drifts from its checkbox turns the legend into a contradiction.
 *
 * FORMS.md, form 3, is the record of the form side. It still says these render
 * "beside the form", which was true of the old two-column layout.
 *
 * Known drift, left alone because it is a copy call, not a layout one: the
 * Resolved 2026-07-29: this list now matches the live form exactly, including
 * "Submitting a project proposal". The form is the source of truth, because it
 * is the thing a visitor actually answers.
 */
export const NETWORK_INTERESTS: Interest[] = [
  { title: "Live BYU-sponsored AI events", blurb: "In-person sessions on the most cutting-edge technologies as they land." },
  { title: "Periodic AI digest", blurb: "A tight read on what is moving in AI, curated for the BYU network." },
  { title: "Access to the cohort for talent", blurb: "An introduction to the cohort when you are hiring builders." },
  { title: "Submitting a project proposal", blurb: "Something you want built. This routes to the project intake brief." },
]

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

export const CULTURE_LEAD =
  "AI Foundry is a program of the BYU Marriott School of Business and completely aligned to its mission, vision, and values."

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
      "We stay curious, dive deep, and treat mistakes as tuition for the lessons they carry.",
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

   As of 2026-08-01 the forms are native components (QuoteForm, NetworkForm)
   posting to /api/quote and /api/network, which write to the same Supabase
   project the previous site used. The embedded Google Forms era, including
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

/** Two tabs. Click either one and it takes you straight there. */
export const NAV: NavLink[] = [
  { label: "Our work", href: "/work" },
  { label: "Join the network", href: "/network" },
  { label: "About us", href: "/about" },
]

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
export const NAV_CTA: NavLink = { label: "Request a proposal", href: "/#quote" }

export const QUOTE_CTA: NavLink = { label: "Request a proposal", href: "/quote" }

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
          "Senior advisors across AI, venture, and industry, recruited to advise the program rather than to decorate a page.",
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
          "Meeting MBAs where they already are, in the channels the school already runs, rather than waiting for them to find the program.",
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
          "A low-stakes AI case competition for BYU MBAs. It builds the culture and surfaces the builders worth recruiting.",
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
