/**
 * Copy for /legal.
 *
 * WHAT THIS PAGE IS. Its first job is to be the public page that links this
 * domain to the organization behind it — the artifact a verification flow asks
 * for. Its second job is honest disclosure, because /quote, /network and the
 * jobs board all collect personal data and the site had no privacy notice at
 * all until this page shipped.
 *
 * WHAT THIS PAGE IS NOT, deliberately. It is not a contract, it does not set a
 * governing law, it does not cap anyone's liability, and it does not purport to
 * bind Brigham Young University. A program inside a university does not get to
 * write those terms on the university's behalf; only the Office of General
 * Counsel does. Every sentence that reached for one of those was cut.
 *
 * THE RULE THAT PRODUCED THIS DRAFT: say only what is true of the system as it
 * is built today. Three things follow from that, and each one is a gap the copy
 * names out loud rather than papering over:
 *   · There is no self-serve unsubscribe and no delete button. The code has no
 *     opt-out column, no purge job, and `deleteResumeData()` exists but nothing
 *     calls it. So the page says requests are handled by hand.
 *   · The jobs board sends resume text to third-party AI providers. Nothing on
 *     that page told anyone. Disclosing it is strictly better than continuing
 *     to do it silently, so it is disclosed here.
 *   · The jobs sign-in does not verify that an email address belongs to the
 *     person entering it. So the page says not to treat it as a secure account.
 *
 * Every external URL below was fetched and confirmed to return 200 on
 * 2026-09-18. Do not add one that has not been.
 */

export const LEGAL_UPDATED = "18 September 2026"

/** Verified 2026-09-18. byu.edu/privacy and privacy.byu.edu both land here. */
export const BYU_PRIVACY_URL = "https://privacy.byu.edu"
/** Verified 2026-09-18. The short canonical vanity domain for the FERPA notice. */
export const BYU_FERPA_URL = "https://ferpa.byu.edu"
/** The BYU Data Privacy Officer, named in the CES Institutions Privacy Notice. */
export const BYU_DPO_EMAIL = "privacy@byu.edu"

export type Section = { id: string; title: string }

export const SECTIONS: Section[] = [
  { id: "organization", title: "The organization behind this domain" },
  { id: "site-use", title: "Using this site" },
  { id: "privacy", title: "What this site collects" },
  { id: "contact", title: "Contact" },
]

/* ── #organization — the verification payload ─────────────────────────────── */

export const ORG = {
  lead:
    "aifoundry.byu.edu is operated by the AI Foundry, an experiential learning program of the BYU Marriott School of Business at Brigham Young University in Provo, Utah.",
  detail:
    "The AI Foundry is a program within BYU Marriott. It is not separately incorporated, and this site is a program site rather than a commercial one. The program's faculty advisor and the students who build here are listed on the About page.",
  /** Rows a verification reviewer scans. Keep this short and unambiguous. */
  facts: [
    { k: "Organization", v: "AI Foundry" },
    { k: "Part of", v: "BYU Marriott School of Business, Brigham Young University" },
    { k: "Domain", v: "aifoundry.byu.edu" },
    { k: "Location", v: "Provo, Utah, United States" },
  ],
}

/* ── #site-use ─────────────────────────────────────────────────────────────── */

export const SITE_USE = {
  lead:
    "These are the conditions for using aifoundry.byu.edu. They do not replace or override Brigham Young University policy. Where these conditions and a BYU policy conflict, the BYU policy governs.",
  points: [
    {
      title: "This site is informational",
      body:
        "Submitting a proposal request, joining the network, or signing in to the jobs board does not by itself create an engagement, an offer, or an obligation on either side. Project work begins only under a separate written agreement.",
    },
    {
      title: "Content and marks",
      body:
        "Content on this site is owned by Brigham Young University or its licensors unless a page says otherwise, and the BYU, BYU Marriott, and AI Foundry names and marks are owned by Brigham Young University. Nothing here grants a licence to use them. Send reuse requests to the contact below and we will route them to the appropriate BYU office.",
    },
    {
      title: "Accuracy",
      body:
        "Figures on this site, including the counts on the roadmap, are read from our own systems when a page loads. They can be wrong or out of date, and nothing here should be relied on as a formal representation of the program.",
    },
    {
      title: "Links out",
      body:
        "This site links to sites the program does not control, monitor, or endorse. Those sites have their own terms, privacy practices, and security, and a link is not a recommendation.",
    },
    {
      title: "Changes",
      body:
        "This page changes as the site changes. The date at the top shows when it was last updated.",
    },
  ],
}

/* ── #privacy ──────────────────────────────────────────────────────────────── */

export const PRIVACY = {
  lead:
    "Brigham Young University's privacy notice applies to this site. This section adds the detail specific to this domain: what each form collects, where it goes, and what you can ask us to do about it. Where this section and the university notice differ, the university notice governs.",

  /** Exactly what the two main-site handlers persist. Read from the code. */
  collects: [
    {
      form: "Request a proposal",
      path: "/quote",
      fields:
        "First and last name, email address, phone number, company, an optional website, a description of what you want built, and an optional timeline.",
      where: "Stored in our project database. Read by program staff who review incoming work.",
    },
    {
      form: "Join the network",
      path: "/network",
      fields:
        "Email address, which is required. Optionally your name, organization, role, LinkedIn URL, and which of four things you want to hear about.",
      where:
        "Stored in our network database and used to send the digest and event invitations you asked for.",
    },
    {
      form: "Jobs board sign-in",
      path: "/jobs",
      fields:
        "An email address, and a newsletter checkbox that adds you to the AI Foundry network list. If you upload a resume, the full text of that resume is stored.",
      where:
        "Stored in the jobs board's database. See the note on automated matching below.",
    },
  ],

  /**
   * The disclosure the jobs board has never made. Naming the vendors is the
   * point: "third parties" tells a student nothing they can act on.
   */
  ai: {
    title: "Automated resume matching uses outside AI providers",
    body:
      "If you give the jobs board a resume, the text of that resume is sent to third-party AI providers so it can be turned into a structured profile and scored against job listings. Those providers are Groq and Anthropic. The resulting profile and scores are stored and shown to you. They are generated automatically, they are often wrong, and they are not an assessment of you by the program. If you would rather not have a resume processed this way, use the board without uploading one.",
  },

  verification: {
    title: "Jobs board sign-in is not verified",
    body:
      "Signing in to the jobs board asks for an email address and does not confirm that the address belongs to you. Treat it as a convenience rather than a secure account, and upload only a resume you are comfortable associating with the address you enter.",
  },

  cookie: {
    title: "Cookies",
    body:
      "This domain sets one cookie, and only after you sign in to the jobs board: a signed token that remembers your sign-in for 90 days. There is no advertising or analytics tracking on this site.",
  },

  /**
   * Honest about the gap. There is no opt-out column, no purge job, and the
   * one deletion function in the codebase is never called. Saying "email us"
   * is true; a promised self-serve control would not be.
   */
  rights: {
    title: "What you can ask for",
    body:
      "You can ask us for a copy of what this site holds about you, to correct anything that is wrong, or to delete your record, including a stored resume and anything derived from it. Email the address below and say which you want.",
    caveat:
      "These requests are handled by a person, not by an automated tool. There is no unsubscribe link and no delete button on the site yet. Before we change or delete anything about a specific person we will ask you to confirm the request from the address on file, and copies may remain in backups and in email for a period after a record is removed.",
  },

  students: {
    title: "BYU students",
    body:
      "Some information a BYU student submits here may form part of a student education record. Brigham Young University policy and federal law govern that information, separately from this page.",
  },
}

/* ── #contact ──────────────────────────────────────────────────────────────── */

/**
 * Deliberately routes to BYU's own Data Privacy Officer, which is a real,
 * verified, institutional address, and to the site's existing proposal form for
 * program questions. No personal mailbox is published here: the jobs repo
 * currently hardcodes a gmail.com address for deletion requests, and a
 * gmail.com address has no business being the contact of record on a byu.edu
 * legal page.
 */
export const CONTACT = {
  lead: "Two routes, depending on what you need.",
  routes: [
    {
      title: "Your data, or anything on this page",
      body:
        "Brigham Young University's Data Privacy Officer handles privacy requests for the university, including for this site.",
      action: BYU_DPO_EMAIL,
      href: `mailto:${BYU_DPO_EMAIL}`,
    },
    {
      title: "The program, or working with us",
      body: "Use the proposal form. It reaches the people who run the program.",
      action: "Request a proposal",
      href: "/quote",
    },
  ],
}
