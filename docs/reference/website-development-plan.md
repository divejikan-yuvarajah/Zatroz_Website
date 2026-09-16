# Zatroz website development plan (text export)

Source: docs/prompts/Zatroz_Website_Development_Plan.docx  
Exported for Cursor readability on 16 September 2026.  
This is a planning reference, not live website content. Prefer the .docx if formatting matters.

---

Zatroz website development plan
Prepared for Divejikan and the Zatroz founding team
16 September 2026
Build a clear, distinctive company website that turns interest in Zatroz into useful project enquiries. The recommended experience combines warm white pages, charcoal feature sections, the existing orange brand colour, strong typography, and original illustrations of real business workflows.
This plan covers strategy, design, content, architecture, forms, security, testing, deployment, and maintenance. It is a planning deliverable. Website implementation begins after the content, design direction, and launch scope are settled.
The recommended first release uses Next.js, React, TypeScript, Tailwind CSS, a small amount of GSAP, and a server endpoint that saves enquiries in Supabase before sending email notifications. Public content stays in the repository. There is no need for customer accounts, a separate Express application, or a custom admin dashboard at launch.
The central design idea is a visible orange path connecting a business need to a useful digital result. Visitors can explore examples such as online orders, business operations, and invoice automation. The interaction explains Zatroz's work while giving the site a recognisable identity.
Working assumptions are a small founding team, English content for the first release, a Sri Lankan business audience with room for international enquiries, and an initial portfolio that may mix client work with prototypes. The schedule assumes roughly 3 to 4 focused hours per working day. These are planning assumptions, not promises about delivery speed or existing company capacity.
Use sections 1 to 17 to settle the experience, sections 18 to 24 to plan implementation, and sections 25 to 27 to manage delivery. The scope labels Launch and Later distinguish the first release from future expansion.
Contents
1 Website strategy
2 Website architecture
3 Homepage structure
4 Unique UI concept
5 Colour system
6 Typography system
7 Hero concepts
8 Animation and interaction system
9 Services presentation
10 Portfolio and project stories
11 About Zatroz
12 Trust and credibility
13 Contact and lead generation
14 Responsive design
15 Accessibility
16 SEO structure
17 Performance plan
18 Recommended technology stack
19 Project folder structure
20 Reusable component system
21 Backend requirements
22 Security and privacy
23 Analytics and operational measurement
24 Deployment and maintenance
25 Development phases
26 Development checklist
27 Final recommendations
1 Website strategy
Positioning and purpose
Position Zatroz as a software studio that understands how smaller businesses operate and builds websites, applications, business systems, and practical automation around those needs. Premium should mean clear communication, careful design, and dependable delivery. Publish only services the team can currently deliver or responsibly support through an identified collaborator.
Suggested positioning statement: Zatroz helps businesses improve how they sell, serve customers, and manage everyday work through thoughtful design and custom software.
The website should answer five questions quickly: What do you build? Is it relevant to my business? Can I see your work? What is it like to work with you? How do I start?
Audience
Main need
Website response
Local businesses and SMEs
Better enquiries, orders, bookings, or less manual administration
Plain service descriptions, relevant examples, WhatsApp contact
Startup founders
A focused first product and a clear development path
MVP examples, scope discussion, ownership and handover explanation
Established organisations
Reliable systems, integrations, and accountable delivery
Technical case studies, process, security approach, support scope
Prospective collaborators and hires
Understand the people and quality of work
Honest founder profiles, project responsibilities, real opportunities
Conversion goals and measures
The primary goal is a qualified project enquiry: a real person, a relevant business need, and enough information for a useful follow-up. The main button label is Start a project. Secondary actions are Explore our work and Chat on WhatsApp.
Track enquiry completion, enquiries that fit the services, meetings actually confirmed, and proposals requested. A WhatsApp click is an expression of interest, not a confirmed conversation. A meeting request is not a booked meeting. Define these distinctions in analytics from the start.
Use the first 30 days to establish a baseline. Review which service pages lead to useful enquiries and where visitors abandon the form. Do not invent a conversion forecast before Zatroz has traffic and lead-quality data.
Messages to repeat
We begin with your business problem and agree what the first version must do.
You can review progress through working demonstrations and clear milestones.
We explain costs, third-party subscriptions, ownership, and support before development.
AI is useful where it improves a specific task; human review remains part of sensitive workflows.
Your website should be easy to use on a phone and fast enough for everyday connections.
These are proposed service commitments. The founding team should confirm that its delivery process supports them before publishing them as promises.
Reference review and original adaptation
The following observations describe the referenced sites' visible content and available layouts. The Zatroz adaptations are design recommendations. They do not establish which libraries those sites use, verify their business claims, or reproduce their assets.
Reference
Useful observation
Original Zatroz adaptation
Attio
Restrained navigation, a clear headline, generous whitespace, and a prominent product interface demonstration
Make the offer easy to understand and use original business interface illustrations as supporting evidence
Zonova Tech
Strong typographic hierarchy, visible project and contact actions, and specific service descriptions
Use confident typography and concrete deliverables; build a separate orange identity rather than copying its blue graphics
Merge Studio
An editorial introduction, prominent work, and project narratives connected to outcomes
Give selected projects generous space and explain each problem, build, and result
Sysco LABS
Navigation and page content connect technology to an industry and the people doing the work
Explain the business context behind projects and show the actual founding team
SENYX
Oversized brand typography, a distinctive hero composition, and separation between solutions and products
Give Zatroz a memorable composition using business workflow graphics and clearly labelled experiments
LOMOS
Visitors can choose a business challenge; work, process, and enquiries form a clear journey
Organise services around customer needs, with simple links that preselect the relevant enquiry category
Gapstars
Concise positioning, prominent people imagery, and clear team-oriented storytelling
Use authentic team photography and a direct explanation of who the client will work with
Cogntix
Focused service groups, case studies, delivery steps, and a direct founder contact path
Connect each service to evidence and make the next conversation easy to request
The distinctive combination for Zatroz is an editorial page structure, practical business examples, authentic founder evidence, and an orange connection motif. Avoid copying reference headlines, illustrations, layouts, customer logos, numerical claims, or animations frame for frame.
2 Website architecture
Launch sitemap
Use a small number of strong pages and reusable detail templates. The launch scope below is 8 general pages, 6 service pages, and 2 or 3 project stories, plus technical utility routes.
Page or route
Purpose
Primary next action
Home at /
Explain the offer, show work, and help visitors choose a path
Start a project
About at /about
Introduce the company, founders, values, and approach
Meet the team and enquire
Services at /services
Help visitors compare the six capability groups
Open a relevant service
/services/websites-ecommerce
Explain business websites, online catalogues, and commerce
Discuss a website
/services/web-mobile-apps
Explain web platforms and mobile applications, with separate subsections
Discuss an application
/services/business-systems
Explain POS, stock, reporting, and internal operations software
Discuss a business system
/services/ai-automation
Explain AI features and workflow automation with reviewed examples
Discuss an automation
/services/custom-software
Cover unusual requirements, integrations, and phased digital transformation
Describe the business problem
/services/ui-ux-design
Explain discovery, user journeys, wireframes, and interface design
Discuss a design project
Work at /work
Present projects with accurate status and scope
Read a project story
/work/[slug]
Provide the canonical case study for one project
Discuss a similar project
Process at /process
Explain milestones, feedback, handover, and support
Start a project
Contact at /contact
Collect an enquiry and provide direct contact options
Send project enquiry
Privacy at /privacy
Explain what information is collected and how it is handled
Contact the privacy owner
Website terms at /terms
Explain use of the website and relevant limitations
Contact Zatroz
Use /work/[slug] for both portfolio detail and case-study content. Avoid publishing the same story again under /case-studies/[slug]. The terms page is not a replacement for a project proposal or service agreement.
Later pages and conditional additions
Page
Add when
Purpose
/labs
There are at least two documented experiments
Show prototypes and research with clear maturity labels
/products and /products/[slug]
A real product has an owner, support route, and usable demonstration
Explain product capabilities, availability, and next steps
/insights and /insights/[slug]
Three useful articles and a publishing owner are ready
Answer customer questions and build subject credibility
/careers and /careers/[slug]
There is an actual opening or a clearly described expression-of-interest process
Attract appropriate applicants without suggesting nonexistent vacancies
/pricing
Packages, inclusions, exclusions, and maintenance costs are stable
Help buyers assess fit before enquiring
/support
Existing clients need a documented support contact
Route incidents and maintenance requests
/accessibility
An accessibility contact and review process exist
Explain accessibility support and how to report barriers
Keep Technologies and Why Zatroz as sections within relevant service, process, and about pages at launch. Turn them into pages only when there is enough distinct, useful content. Keep FAQs near the service or decision they explain.
Navigation and utility routes
Desktop navigation: logo, Services, Work, About, Process, and Start a project. The logo returns home. Put policies and later content in the footer. Use a simple Services disclosure containing the six groups; keep hover and keyboard behaviour consistent.
Plan a useful 404 page, a recoverable error state, sitemap.xml, robots.txt, icons, and social sharing images. A standalone thank-you page is optional and should be noindex; an inline success state is sufficient for launch. Preview deployments, drafts, future admin routes, and API responses must not appear in the public sitemap.
3 Homepage structure
The homepage follows a decision journey: understand the offer, see evidence, explore a relevant service, understand delivery, and make contact. Aim for approximately 1,000 to 1,400 words, with most detail on linked pages.
Section 1 Navigation
Purpose and content: make the main destinations available without competing with the offer. Show the existing logo, five navigation actions including the project CTA, and a visible mobile menu label.
Layout and UI: 72px desktop header and 64px mobile header, aligned to the page container. Use an opaque warm-white surface, a fine bottom border after scrolling, and a compact orange CTA with dark text.
Interaction and motion: sticky navigation keeps its height; a subtle border change indicates scrolling. The menu opens through a button, closes with Escape, and returns focus to its trigger. CTA: Start a project.
Section 2 Hero
Purpose and content: explain the service in one glance. Suggested headline: Digital solutions. Built around your business. Supporting text: We design websites, applications, and automation that help your business sell, serve customers, and manage everyday work.
Layout and UI: text occupies six desktop grid columns and an original workflow illustration occupies six. Use a small Sri Lanka location line if accurate. Show two CTAs and one quiet link to the working process.
Interaction and motion: three labelled business examples change the illustration. The headline is visible on first paint; only supporting decoration draws in. On mobile, text and actions precede a simplified diagram. CTAs: Start a project and Explore our work.
Section 3 Evidence introduction
Purpose and content: answer why a visitor should keep reading. Use a short company introduction and two or three verified proof items, such as a project demonstration, a named founder contribution, or a published case study.
Layout and UI: a narrow editorial strip with text links and compact evidence labels. Use client logos only with permission and an actual relationship. Omit the logo strip if no approved client logos exist.
Interaction and motion: each evidence item links to its source or full project. No moving logo wall or automatic number animation. CTA: See how we built it.
Section 4 Selected work
Purpose and content: demonstrate the quality and relevance of the work early. Feature two projects with a real screenshot, business problem, delivered scope, project status, and a concise outcome.
Layout and UI: one wide project followed by an asymmetric pair only if three strong stories are ready. Use large images in neutral frames, visible captions, and clear Client work or Prototype labels.
Interaction and motion: image scale can increase to 1.02 on hover; keyboard focus receives the same visual emphasis. All descriptions stay visible. Open the full project page rather than a mandatory modal. CTA: Read the project story.
Section 5 Services by business need
Purpose and content: let visitors recognise their problem before choosing a technology. Introduce four needs: Reach more customers, Launch a digital product, Organise daily operations, and Reduce repetitive work.
Layout and UI: large numbered rows on the left and a related capability preview on the right. Each need shows relevant service groups, a typical deliverable, and a link to useful work.
Interaction and motion: click or keyboard activation changes the preview; hover is only an enhancement. Mobile uses expanding rows with the preview beneath the selection. CTA: Explore this service, followed by Discuss your project.
Section 6 Practical automation example
Purpose and content: explain the AI and automation offer using one understandable task. Example: an invoice is received, fields are extracted, uncertain values are reviewed, and an approved record enters a business system.
Layout and UI: a charcoal section with an orange connection line and an accessible numbered description. Show sample data, a review step, and a clear Example workflow label.
Interaction and motion: an optional Play example button starts a short sequence. Do not autoplay indefinitely or call a live AI API. Under reduced motion, show the completed flow. CTA: Explore AI and automation.
Section 7 Working process
Purpose and content: reduce uncertainty about delivery. Show Discover, Design, Build, and Launch and support, each with one customer-facing output.
Layout and UI: a four-step vertical timeline with a short detail panel on desktop. Describe scope agreement, prototype review, working demos, and handover in plain English.
Interaction and motion: steps remain readable without animation. A subtle progress accent may appear once as each enters view; no pinned scrolling is required. CTA: See our process.
Section 8 People and reasons to choose Zatroz
Purpose and content: introduce the real team and explain how it works. Use a team photo, a short founding story, responsibilities, and practical commitments such as visible progress and clear handover.
Layout and UI: one documentary photograph beside editorial text. Link to relevant skills and project contributions. A compact technology line may list only tools that the team can support.
Interaction and motion: simple links and a restrained image reveal. Avoid tilt effects on faces. CTA: Meet Zatroz.
Section 9 Customer feedback and common questions
Purpose and content: address remaining concerns about ownership, content preparation, delivery time, hosting, maintenance, and third-party costs. If an approved testimonial exists, show one full quote with attribution above the FAQ.
Layout and UI: a readable quote followed by five or six disclosure questions. If there is no approved testimonial, use a brief project lesson or omit the quote entirely.
Interaction and motion: native disclosure controls or an accessible accordion. No rotating testimonial carousel. CTA: Ask us about your project.
Section 10 Final enquiry invitation
Purpose and content: make the next step concrete. Suggested copy: Tell us what your business needs next. A supporting sentence explains that the team will review the request and discuss scope before quoting.
Layout and UI: a warm-white section with generous spacing, a short prompt, and one orange action. Place email and WhatsApp as secondary text links.
Interaction and motion: a small arrow movement on hover or focus is enough. Do not require interaction with an illustration before contact. CTA: Start a project.
Section 11 Footer
Purpose and content: provide navigation, identity, contact, and policies. Include the logo, short description, email, WhatsApp, approved social links, services, process, privacy, and terms.
Layout and UI: charcoal background, white main text, and readable grey supporting text. Use an oversized but static Zatroz wordmark if the supplied brand assets allow it.
Interaction and motion: ordinary links, visible focus, and an optional Back to top button. No cursor chase or animated background. CTA: Contact Zatroz.
4 Unique UI concept
The visual idea
Use an editorial studio aesthetic with an orange path connecting practical business examples. The path can bend into a subtle Z shape in illustrations, but the actual Zatroz logo stays unchanged. A matching motif appears in selected project captions, the service explorer, and the process section.
The personality is confident, curious, approachable, and careful. Large typography and generous spacing create the premium feel. Real interface details and human photography make the offer tangible.
Layout and component rules
Element
Design rule
Main container
Maximum 1280px; centre it with flexible side padding
Grid
12 columns on wide screens, 8 on tablets, 4 on phones
Gutters
24px desktop, 20px tablet, 16px mobile
Spacing scale
4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
Section spacing
96 to 128px wide screens; 56 to 72px phones
Reading width
About 60 to 70 characters per line for long body copy
Radius
8px controls, 16px project frames, 24px major media; pills reserved for tags
Cards
Use for projects or grouped facts; services primarily use rows and detail panels
Buttons
48px minimum preferred height; consistent padding, icon position, and focus outline
Inputs
48 to 52px height, persistent label, clear border, visible error text
Icons
One consistent outline family at 20 or 24px; use custom diagrams for complex ideas
Keep text left-aligned through most of the page. Limit fully centred layouts to short invitations or a deliberately chosen hero alternative. Mix generous project imagery with compact service rows so the page has a clear rhythm.
Surface and graphics treatment
Use warm white as the main background and charcoal for one or two feature sections. Fine grid lines may appear inside illustrations at low contrast; they should not sit behind long paragraphs. Use a small static grain texture only in decorative media if it improves the final design, never on form fields or body text.
Reserve gradients for a small orange glow or a dark section edge. Do not use gradient body text. Avoid large glass panels; the navigation and content surfaces should remain readable over any background. If a translucent control is used over media, give it a reliable opaque fallback.
The signature graphics are original browser windows, phone frames, receipts, task rows, and connecting paths. Avoid stock robots, floating 3D cubes, terminal screenshots as decoration, fake live metrics, and an entire page of identical rounded boxes.
5 Colour system
Keep the original #FF3B10 as the recognisable brand colour. Add a darker orange for small text links and white-on-orange button variants. These values are design tokens, so changing a token updates the whole interface consistently.
Token
Hex
Intended use
Brand primary
#FF3B10
Main accent, selected paths, primary button with dark text
Brand hover
#FF572E
Hover background for the primary button with dark text
Brand dark
#C42B0A
Small orange links on light surfaces; optional button with white text
Brand pale
#FFF0EA
Quiet orange surface for selected examples
Secondary ink
#111111
Main headings, dark buttons, and dark sections
Page background
#F7F5F2
Warm-white base
White surface
#FFFFFF
Inputs, media frames, selected content
Soft surface
#EEEAE4
Secondary panels and illustration backgrounds
Dark surface
#1C1C1C
Panels within charcoal sections
Decorative border
#D8D3CD
Fine separators without semantic meaning
Control border
#817B74
Input boundaries on light backgrounds
Dark border
#3A3A3A
Decorative separators on dark backgrounds
Body text
#3F3D3A
Long copy on light backgrounds
Muted text
#68645F
Secondary readable copy on warm white
Inverse heading
#FFFFFF
Headings on dark backgrounds
Inverse body
#D6D6D6
Body copy on charcoal
Inverse muted
#A8A8A8
Secondary copy on charcoal
Success
#166534
Success icon and text, paired with #F0FDF4
Warning
#854D0E
Warning icon and text, paired with #FFFBEB
Error
#B91C1C
Form error icon and text, paired with #FEF2F2
Computed sRGB contrast examples: white on #FF3B10 is approximately 3.57:1, so it does not meet the 4.5:1 requirement for normal-sized text. #111111 on #FF3B10 is approximately 5.29:1. White on #C42B0A is approximately 5.68:1. #68645F on #F7F5F2 is approximately 5.40:1.
Use dark text on the primary orange button. Use #C42B0A for small orange text links on light backgrounds. Check hover, disabled, focus, and selected states in their actual rendered combinations, including opacity and images. Decorative borders are not sufficient as the only visible boundary of an input.
Suggested gradients: #FF3B10 to #FF7A45 for decorative orange highlights, and #111111 to #24201E for dark media backgrounds. Keep the main text on a flat readable surface.
Reference for text contrast: W3C explanation of minimum contrast.
6 Typography system
Use Manrope for headings, body text, buttons, and navigation. Its geometric shapes support a modern brand without making longer text difficult to read. Use the weight and size scale for variety before adding another display font.
An optional IBM Plex Mono subset can be used sparingly for project numbers and technical labels. It is not needed for the first version if font weight affects performance. Self-host licensed WOFF2 files and retain the font licence files.
Role
Desktop size
Mobile size
Weight
Line height and tracking
H1
72 to 88px
40 to 48px
700
1.05 to 1.10; -0.035em
H2
44 to 56px
30 to 36px
650 or 700
1.12 to 1.18; -0.025em
H3
26 to 32px
22 to 26px
600
1.25; -0.015em
Lead paragraph
20px
18px
400
1.55; normal
Body
17 to 18px
16 to 17px
400
1.6; normal
Small supporting text
14px
14px
400 or 500
1.5; normal
Buttons and navigation
15 to 16px
16px
600
1.2 to 1.4; normal
Eyebrow or project label
12 to 13px
12 to 13px
500
1.4; up to 0.06em
Use fluid scaling between breakpoints with a minimum and maximum, rather than abrupt size jumps. Keep body type at least 16px in the normal mobile layout. Avoid forced headline line breaks that create one-word lines on narrow screens. Avoid all-uppercase paragraphs, ultra-light text, and per-letter spacing on body copy.
If Tamil or Sinhala pages are added, choose and test appropriate Noto Sans language families and adjust line height for their scripts. Do not assume the English font covers those languages.
7 Hero concepts
Concept 1 Connected business
Headline style: large left-aligned Manrope with two or three calm lines. Proposed headline: Digital solutions. Built around your business.
Supporting copy: We design websites, applications, and automation that help your business sell, serve customers, and manage everyday work. Primary CTA: Start a project. Secondary CTA: Explore our work.
Background and visual: warm white, faint alignment marks, and a right-hand original diagram. An orange line connects a customer's request to a useful output through three compact interface panels. The panels represent an enquiry, a system action, and a reviewed outcome.
Interaction: three labelled choices, Sell online, Run operations, and Automate tasks, change the example and related service link. Each has an accompanying plain-text explanation. Example data is clearly identified. This is a visual explanation, not an operating business application.
Animation and scroll: draw the decorative connection line once in about 800ms; reveal panels gently. Keep the headline and buttons immediately visible. Normal page scrolling reveals the first case study without pinning or scroll hijacking.
Mobile: stack the text, full-width primary button, secondary link, and a compact vertical diagram. Preserve tap controls and readable labels. Reduced motion shows the final diagram immediately.
Concept 2 Work takes the stage
Headline style: short editorial text above an oversized project image. Proposed headline: Your next idea. Built to work.
Supporting copy: From your first website to the systems behind your business, Zatroz helps turn a clear plan into useful software. CTAs: View selected work and Start a project.
Background and visual: a charcoal canvas with white type, an orange index number, and a large approved screenshot. Display the project name, exact contribution, and client or prototype status in a fixed caption.
Interaction: Previous and Next buttons switch between two or three projects. No automatic rotation. Each state includes a visible Read the story link. Do not make the whole interface depend on dragging.
Animation and scroll: a 200ms crossfade between project images and a subtle caption transition. The following page content is a standard vertical project gallery.
Mobile: use one stacked project preview and labelled controls. Avoid tiny device mockups with unreadable screenshots. This concept is best once Zatroz has several visually strong projects with permission to display them.
Concept 3 Start with your business
Headline style: a bold question with ample surrounding space. Proposed headline: What should work better in your business?
Supporting copy: Choose a starting point and explore how Zatroz can help. CTAs: Tell us about your project and See what we build.
Background and visual: an off-white editorial composition with three large selectable rows: Getting enquiries, Managing operations, and Building a new product. Each selection reveals a simple original interface illustration and the most relevant services.
Interaction: selecting a need reveals suggested capabilities and preselects a service when the visitor opens Contact. The selection stays local until the user submits the form. Avoid a multi-step quiz or an automatic quotation.
Animation and scroll: a 160 to 220ms underline movement and detail-panel crossfade. The page continues into corresponding work examples with ordinary navigation.
Mobile: expand the chosen row inline; keep other choices visible. The form remains independently accessible, so unsure visitors can describe their need in their own words.
Recommended concept
Choose Connected business. It explains Zatroz's broad service offer, creates an original visual signature, and works even when the public portfolio is still growing. Use Work takes the stage as a future alternative when the portfolio is strong enough to carry the first screen. Keep the useful selection idea from Concept 3 in the homepage service explorer.
8 Animation and interaction system
Use CSS for ordinary transitions and GSAP only for the distinctive connection graphic and a small number of coordinated reveals. ScrollTrigger is a GSAP plugin, so it should not become a second independent animation system. Motion for React, previously known as Framer Motion, is an alternative for state and layout transitions; it is not needed alongside GSAP in the launch build.
Implementation references: GSAP React guidance and Motion for React documentation.
Interaction
Recommendation
Timing or limit
Hero entrance
Reveal decoration and supporting panels; keep primary copy visible
About 600 to 900ms total
Text reveal
Small block-level fade or translation for secondary headings
300 to 450ms; once
Scroll reveal
Limited fade and 12 to 20px movement for selected content
350 to 500ms; once
Card hover
Border emphasis and image scale to 1.02
160 to 220ms
Magnetic buttons
Omit at launch; do not move the target away from the pointer
Optional later, fine pointer only
Parallax
Optional subtle movement inside one decorative illustration
Maximum about 12px; off on mobile
Image reveal
Simple opacity or small clip reveal with a static fallback
350 to 500ms
Horizontal scrolling
Use ordinary horizontal overflow only for small filter rows
No pinned horizontal page sections
Marquee
Prefer a static list of technologies or evidence
If later added, provide pause and static reduced-motion state
Cursor effects
Omit custom cursors and cursor trails
Keep the platform cursor
Page transitions
Use normal navigation and predictable scroll restoration
No full-page wipe or artificial delay
Section transitions
Use spacing, surface changes, and a modest decorative path
No scroll takeover
Number counters
Default to static verified values
Optional once-only counter must preserve an accessible final value
Logo animation
Optional small path draw in a large decorative mark
Under 700ms; actual nav logo remains stable
Navbar
Add border or surface emphasis on scroll
About 150ms; no height shift
Footer
Link underline or arrow movement
About 150ms
Use transforms and opacity where possible. Avoid animating layout measurements continuously. Scope GSAP animations to their components and clean up listeners and timelines on unmount. Restore the correct state after resizing or a reduced-motion preference change.
All information must be present without an animation completing. Avoid body-level opacity zero, loading screens that block entry, repeating hero motion, motion tied to pointer movement across the whole page, and delayed contact access. Test the real mobile bundle before keeping any optional effect.
9 Services presentation
Service explorer
Use four business-need rows to introduce six service pages. Expanding a row reveals a short explanation, two example deliverables, a relevant project, and a service CTA. Keep every service reachable through normal links even if JavaScript fails. On desktop, a preview sits beside the rows; on mobile it appears beneath the active row.
Website development
Description: clear, fast websites that explain the business and help visitors enquire, book, or order. Typical scope includes content structure, responsive pages, SEO foundations, contact forms, and optional ecommerce integrations.
Visual and icon: an original browser frame showing a business page and a visible enquiry action. Interaction: switch between a website and a catalogue example with labelled controls. CTA: Discuss your website. Destination: Websites and ecommerce.
Web applications
Description: browser-based tools such as booking systems, customer portals, dashboards, and approval workflows. Specify which users and roles are included in each actual proposal.
Visual and icon: a window with a task list and a simple calendar. Interaction: choose an example business task to update the preview. CTA: Plan a web application. Destination: Web and mobile apps.
Mobile applications
Description: mobile experiences built around a clear customer or staff task, with realistic offline, notification, and backend requirements agreed during scoping.
Visual and icon: a phone outline with a booking or order screen. Interaction: show two key screens through accessible buttons; do not simulate an entire app. CTA: Discuss your mobile app. Destination: Web and mobile apps.
AI solutions
Description: useful AI features such as document extraction, knowledge search, and support assistance, with evaluation, privacy boundaries, and human escalation where needed.
Visual and icon: a document connected to structured fields and a review badge. Interaction: reveal a sample source and the extracted result. CTA: Explore your AI use case. Destination: AI and automation.
AI automation
Description: workflows where AI handles an interpretation step, such as classifying an enquiry, while predictable rules control routing and actions.
Visual and icon: branching task nodes with an explicit human review branch. Interaction: play one sample path and reveal where approval is required. CTA: Discuss an AI workflow. Destination: AI and automation.
Workflow automation
Description: connect forms, email, spreadsheets, and business tools to reduce repeated entry and missed follow-ups. Use normal rules whenever a task does not need AI.
Visual and icon: three connected application-neutral boxes. Interaction: show the starting event and resulting task, with clearly labelled sample data. CTA: Find a task to automate. Destination: AI and automation.
Business and POS systems
Description: tools for sales, stock, receipts, reporting, and internal operations. POS proposals must state supported hardware, connectivity expectations, backup behaviour, and support boundaries.
Visual and icon: receipt, stock row, and report panel. Interaction: switch between Sales, Inventory, and Reporting with visible labels. CTA: Discuss your business system. Destination: Business systems.
Custom software
Description: software shaped around requirements that do not fit an off-the-shelf tool, including integrations and specialised workflows.
Visual and icon: modular blocks assembled into a clear task flow. Interaction: reveal requirements, scope, and handover outputs through a simple disclosure. CTA: Describe your requirements. Destination: Custom software.
Digital transformation
Description: a phased improvement plan for businesses moving from disconnected manual processes to more consistent digital operations. Begin with one valuable workflow and a realistic adoption plan.
Visual and icon: a before-and-after process map with the same task and labels on both sides. Interaction: a labelled toggle replaces a drag-only comparison. CTA: Plan your next improvement. Destination: Custom software.
UI and UX design
Description: user journeys, wireframes, interface design, and reusable components that make a website or application easier to understand and use.
Visual and icon: a wireframe beside its finished interface. Interaction: switch between Journey, Wireframe, and Interface. CTA: Discuss your product design. Destination: UI and UX design.
Shared service page structure
Each page contains a business-focused heading, who it suits, problems addressed, deliverables, one relevant example, delivery steps, client inputs required, scope boundaries, third-party cost notes, FAQs, and a preselected enquiry CTA. Explain what the client receives before listing technologies. Do not promise fixed delivery times, unlimited scope, or regulatory compliance without a project-specific basis.
10 Portfolio and project stories
Showcase design
Use generous screenshot areas with visible project names, short descriptions, service categories, and project status. The first project may span the full grid; following items use two columns on desktop and one on phones. Keep essential information outside the image so it is readable and searchable.
Use restrained neutral frames and consistent image ratios, such as 16:10 for desktop interfaces. Keep screenshots sharp enough to explain the work but remove personal information, credentials, internal addresses, and customer records. Use original approved screen captures rather than embedding third-party live websites in iframes.
At launch, two excellent stories are more useful than twelve incomplete entries. Begin with an All view. Add service filters when there are enough projects to make them useful, usually six or more. Keep project status visible independently of service category. Filters should be buttons with a selected state, a result count, and a clear reset. Avoid a filter that produces an unexplained empty page.
Project status and evidence
Every project carries one accurate status: Client work, Live product, Prototype, or Research concept. Include the actual team or owner and Zatroz's contribution. A founder's university or hackathon project is not automatically a Zatroz client engagement.
Potential material from the founder's existing work includes FlowPilot AI, InvoiceX AI, and relevant web or business-system projects. For FlowPilot AI, credit Team ZeroDB and the founder's actual contribution if that is the correct provenance. Include the FinTech result only after verifying the event name, track, placing, and publication rights. Label unfinished concepts such as INFRAOS or NEXORA accurately if they are ever included.
Case study template
1. Project name, client or owner, year, role, status, and one-sentence purpose.
2. Business context and the user who experiences the problem.
3. The problem, existing workflow, and constraints.
4. What was included in the agreed scope and what was outside it.
5. Discovery and design decisions, with one useful wireframe or process image.
6. The delivered solution and key user journeys.
7. Technical approach, integrations, and relevant accessibility or security decisions.
8. Results and evidence, including measurement method and time period when numerical.
9. Limits, lessons, and the next improvement.
10. Screenshots, a short captioned demonstration if available, and approved links.
11. A related service and a Discuss a similar project CTA.
If a prototype has no real user results, explain what it demonstrates and what remains to be validated. A before-and-after comparison must use the same task and comparable conditions. Use a labelled toggle or side-by-side images instead of making a slider the only way to understand the difference.
Keep technology tags to three to five meaningful choices. On hover, gently emphasise the image or arrow. On focus and mobile, show the same descriptive content. A full case-study page is the main destination; an optional preview modal must have a title, keyboard controls, a close button, and focus restoration.
11 About Zatroz
Story and proposed company language
Open with a short explanation of why the founders started Zatroz and the kind of business problems they want to solve. Follow it with a real team photograph or three consistent portraits. Avoid stock office photos or photographs that imply an office or team size the company does not have.
Proposed mission: Help businesses use thoughtful design and reliable software to improve everyday work and customer experiences.
Proposed vision: Build a trusted Sri Lankan technology company that creates useful digital products and long-term value for businesses.
Proposed story opening: Zatroz began with a shared interest in building useful software. We are growing a studio that brings design, development, and automation together to help businesses turn practical ideas into working solutions. The founders should add the actual founding date and one specific example that makes this story their own.
Team and journey
Use a profile for each of the three founders with name, agreed role, a short contribution statement, approved portrait, and verified professional link. Divejikan's founder and technical background can support his profile, but confirm the current role wording for every founder. Do not invent the other founders' names or responsibilities.
Build a short timeline from real milestones: founding decision, first relevant project, a verified competition result, first client launch, and current focus. Each milestone needs a date and a factual description. Leave out milestones that cannot yet be supported.
Describe values through observable behaviours. Clarity means written scope and costs. Ownership means following through on issues and documenting handover. Curiosity means checking whether a simpler solution works. Care means testing the experience on the devices customers use.
End with the future direction: grow the service business, learn from recurring customer problems, and develop focused products when there is evidence of demand. Link to Labs or Products only when those pages are ready.
12 Trust and credibility
Build trust with transparent evidence and a clear process. Maintain a private evidence register containing each public claim, its source, its owner, the permission status, and the date it was checked.
Evidence
How to present it
Publication requirement
Completed projects
Screenshots, delivered scope, working link where possible
Confirm completion, ownership, and permission
Client logos
A small static group linked to relevant work
A real client relationship and logo permission
Testimonials
A concise quote with name, role, and project
Customer approval of wording and attribution
Results and statistics
Result plus measurement period and method
Retain the measurement source; avoid unsupported percentages
Hackathon awards
Exact event, team, track, date, and placing
Verify the claim and credit the original team
Certifications
Named person's credential and verification link
Current credential; do not imply company certification
Partnerships
Explain the actual partnership
Formal relationship and permission to use marks
Technologies
Tools used in relevant work
Real capability; technology use does not establish a partnership
Delivery approach
Scope, demonstrations, quality checks, handover
Team practices must match the public description
The founder's AWS student community role and learning credentials belong in a personal profile if current and relevant. They do not establish that Zatroz is an AWS Partner. Competition sponsors are not clients. A university connection does not imply university endorsement.
If there are no client testimonials yet, publish detailed project stories and a transparent working process. Do not substitute fabricated quotes, unnamed five-star reviews, or a made-up client count.
13 Contact and lead generation
Contact page experience
Use a two-column desktop layout: a short invitation and contact methods on the left, a simple project enquiry form on the right. On mobile, place the invitation, form, and alternative contact options in a single column. Keep the enquiry on one page rather than making users complete a lengthy wizard.
Explain what happens next: the team reviews the request, asks any necessary questions, and discusses a suitable scope before providing a quotation. Publish a response-time commitment only after assigning someone to monitor enquiries. An internal target of one business day is reasonable to test before promising it publicly.
Field
Requirement
Behaviour
Name
Required
Accept names in different languages; maximum 100 characters
Email
Required
Validate format and a sensible maximum length
Business name
Optional
Maximum 120 characters
Service interest
Required
Six service groups plus Not sure yet
Project description
Required
Plain text, approximately 20 to 3,000 characters
Budget range
Optional
Under LKR 50k; 50k to 100k; 100k to 250k; 250k to 500k; above 500k; Not sure
Desired timeline
Optional
Within a month; 1 to 3 months; 3 months or more; Exploring
Phone or WhatsApp
Optional
Request only if the visitor wants a call or WhatsApp reply
Preferred contact method
Optional
Email by default; WhatsApp or phone if a number is supplied
Meeting request
Optional
Ask to arrange a conversation; do not imply a booking is confirmed
Budget bands are enquiry categories, not package quotations. If international demand grows, add an explicit currency selector and separate reviewed ranges rather than silently converting LKR figures. Do not auto-reject users who choose Not sure.
Use a privacy notice beside Submit explaining how the request will be handled and linking to Privacy. A marketing subscription, if introduced later, needs a separate optional unticked choice. Do not force newsletter consent to send an enquiry. The precise legal basis and notice wording should be reviewed for Zatroz's actual operations and audience.
Form states
Provide idle, validating, submitting, success, invalid-field, rate-limited, offline, and server-error states. Retain the entered text after an error. Disable duplicate submission only while a request is pending, with a visible Sending label. Move focus to an error summary when needed and link each error to the relevant field.
Show success only after the server confirms the enquiry has been stored. Display a short reference and next-step explanation. Do not clear the form merely because the browser sent a request. If storage is unavailable, explain that it was not submitted and provide email and WhatsApp alternatives.
Direct contact and CTA consistency
Previously supplied business contact details to confirm before launch: +94 76 809 8068, zatroz.co@gmail.com, Instagram handle zatroz.co, and LinkedIn name Zatroz. Use the verified full social profile URLs during implementation. Plan the WhatsApp destination using international digits 94768098068 and test it on both phone and desktop.
Use a short generic WhatsApp message, such as a request to discuss a project. Do not place a visitor's form description, contact details, or budget in a WhatsApp URL automatically. The website does not send a WhatsApp message on the visitor's behalf.
All primary buttons lead to Contact. Service and project CTAs may preselect an allowlisted service category. The hero also offers Work. Use one compact mobile contact action only if it does not cover content or keyboard controls. Avoid simultaneous floating chatbots, WhatsApp bubbles, and booking panels.
14 Responsive design
Use content-driven breakpoints and test intermediate widths. The table describes useful starting ranges rather than fixed device categories.
Width
Layout and navigation
Media and interaction
1440px and wider
1280px maximum container; 12-column grid
Large hero diagram; two-column work; restrained whitespace
1024 to 1439px
Fluid side padding; 12 columns where content fits
Reduce display type and media size; collapse navigation if it crowds
768 to 1023px
8-column grid; mobile-style menu
Stack hero when needed; two-column projects only if readable
320 to 767px
4-column layout used as one main reading column
Text before media; stacked forms; simplified diagrams; no parallax
For navigation, give the menu a visible label and a generous tap target. Keep the primary contact action reachable inside the menu. Opening a menu must not lose page position; closing it restores focus.
For the hero, avoid fixed 100vh sections that trap the first screen below browser chrome. Let the content set height, using modern viewport units only when necessary and tested. Keep the primary action in the first natural screen on common phone sizes where possible.
For services and portfolio, replace desktop hover previews with explicit tap selections. Avoid nested scrolling except where a short filter strip needs it. Ensure each screenshot has a meaningful crop and caption; a shrunken desktop screenshot is often not useful on a phone.
For forms, use a single column, appropriate input types, persistent labels, and at least 16px input text. Test with the software keyboard open and avoid fixed controls covering Submit or error messages. Account for device safe-area insets if a sticky action is used.
Test 320, 375, 390, 768, 1024, 1280, and 1440px widths, landscape orientation, 200 percent zoom, and text expansion. Include a real Android device and iPhone Safari when available. Use slower network and CPU simulation in performance checks, then validate on an ordinary phone.
15 Accessibility
Target WCAG 2.2 Level AA and document the results of both automated and manual checks. An automated score does not establish conformance. The checks below are priorities, not a substitute for evaluating all criteria that apply. Reference: W3C WCAG quick reference.
Use semantic header, nav, main, section, and footer elements, one descriptive H1, and a logical heading hierarchy. Add a Skip to content link.
Make every control keyboard-operable. Use native buttons, links, selects, and disclosure controls before adding ARIA. Do not create clickable div elements.
Keep a strong visible focus indicator and ensure sticky elements do not obscure it. Use a dark outline on light surfaces and a light outline on dark ones. See W3C focus guidance.
Meet contrast requirements for text and meaningful UI boundaries. Explain errors and selected states with text or icons as well as colour.
Prefer 44 by 44px or larger touch targets throughout. Review spacing and exceptions against the current target-size criterion.
Provide useful alt text for meaningful images, empty alt text for decoration, and an adjacent explanation for the workflow graphic.
Respect reduced motion. Do not make content dependent on animation, hover, dragging, or a time limit.
Ensure dialogs manage focus, close with Escape, expose a title, and return focus to the trigger. Menu controls must expose their expanded state.
Associate labels, hints, and errors with inputs. Announce submission status and preserve entered values on failure. See the W3C forms tutorial.
Provide captions and a text summary for project videos. Avoid autoplay with sound.
Test content reflow, zoom, colour contrast, reading order, and screen-reader behaviour on the menu, service explorer, and enquiry form.
Use an automated accessibility checker for common issues, followed by keyboard testing and a screen-reader pass such as NVDA with a supported browser or VoiceOver on Safari. Record unresolved limitations with an owner and fix priority before launch.
16 SEO structure
Pages and metadata
Give every public page a unique title, description, canonical URL, and social image. Set a single verified production SITE_URL after the domain is chosen. Keep private previews and drafts noindex and protected where necessary. Do not use robots.txt as a security control.
Example homepage title: Zatroz | Websites, Software and AI Automation. Example description: Zatroz builds websites, applications, business systems and practical automation for startups and growing businesses. Explore our work and discuss your project.
Service pages should answer real search intent, such as business website development in Sri Lanka or POS and inventory software, in natural language. Use location wording only where it describes the actual service area. Avoid near-identical city pages with no distinct content.
Generate sitemap.xml from published routes and exclude API, draft, admin, and utility success pages. Include a robots.txt sitemap reference. Choose one canonical domain form, redirect the other, and keep canonical URLs consistent in metadata and structured data. A robots disallow rule does not reliably remove a URL from search results.
Sharing and structured data
Provide Open Graph and Twitter-compatible large-image cards, using an approximately 1200 by 630px image with the project or page title, logo, and a safe text area. Test the final card on actual sharing tools after deployment.
Use Organization data with verified name, URL, logo, contact points, and approved sameAs links. Add WebSite data for the site, Service data on relevant service pages, and BreadcrumbList on detail pages. Use CreativeWork for a project story where appropriate and Article for editorial insights. Do not label Zatroz as a local office at an address it does not operate.
Structured data should match visible content. Service and CreativeWork markup can describe content without guaranteeing a Google rich result. Do not add invented ratings, testimonials, prices, or FAQ rich-result promises. Reference: Google guidance on structured data.
Content and links
Each case study should include a clear business problem, meaningful screenshots, descriptive captions, the actual role and scope, and links to related services. Use descriptive internal link text, such as Explore invoice automation, instead of repeating Click here.
Optimise image dimensions and filenames, provide useful alt text, and keep meaningful content in server-rendered HTML. Keep headings semantic even when display text is split visually. For future articles, publish the author, date, topic, and an update date only when the content actually changes.
After launch, verify the domain in Search Console, submit the sitemap, check representative URLs, and review indexing and search queries over time. Technical SEO creates a sound foundation; it does not guarantee rankings.
17 Performance plan
Targets and measurement
Use Lighthouse as a repeatable lab check and real-user data for actual experience. Set an internal mobile Lighthouse performance target of at least 90 on representative production pages, with strong accessibility, SEO, and best-practice results. Scores are targets, not guarantees.
For real users, target LCP at or below 2.5 seconds, INP at or below 200ms, and CLS at or below 0.1 at the 75th percentile, checking mobile and desktop separately. These are the current Core Web Vitals thresholds. Reference: web.dev Web Vitals.
New or low-traffic sites may not have enough public field data immediately. Review lab results before launch, then monitor field measurements over the first 28 days and beyond.
Initial budgets
Item
Planning budget
Response when exceeded
Initial homepage transfer
Aim for 1MB or less before optional media
Reduce images, third-party scripts, and decorative assets
Initial route JavaScript
Aim for 200KB compressed or less including framework code
Measure actual output; remove optional libraries and large client boundaries
Critical hero raster image if used
Aim for 200KB or less
Simplify art direction, resize, or change format
Fonts
One main variable family; about 150KB or less total where practical
Remove unused subsets and the optional mono font
Layout shift
Reserve all image and widget space
Fix missing dimensions and late-inserted content
These are proposed engineering budgets, not framework guarantees. Keep a bundle baseline after setup and record the reason for any exception.
Implementation rules
Render public copy and project data on the server or at build time. Put only interactive controls inside client components. Use responsive AVIF or WebP images where suitable, with correct sizes and dimensions. Preload or prioritise only the actual LCP asset; do not lazy-load it. Lazy-load below-the-fold images and optional videos.
Use self-hosted WOFF2 fonts, a readable system fallback, and font-display behaviour that does not hide text. Preload only the critical face. Reserve dimensions and use compatible fallback metrics to reduce layout movement.
Keep CSS transitions simple, dynamically load the limited animation module, and avoid full-page motion dependencies. Serve fingerprinted static assets with long-lived caching through the CDN. Cache public pages according to the chosen rendering model; never cache enquiry requests or private data.
Use compressed assets, tree-shaken imports, and a bundle report. Prefer individual icons to importing a whole icon library. Defer analytics and other third-party scripts appropriately. Load a meeting scheduler or video embed only after user interaction, if introduced.
Test the production build, not only the development server. Check Home, a service page, a case study, and Contact under a consistent mobile profile. Keep a before-and-after record when adding the hero animation.
18 Recommended technology stack
Use one Next.js application for the public site and its enquiry endpoint. This gives the team a React-based project with routing, metadata, rendering, and a small backend in one codebase. Server and client components allow the interactive parts to stay isolated. Reference: Next.js server and client component guidance.
Layer
Recommended choice
Reason and scope
Framework
Next.js App Router and React
Public pages, metadata, reusable layouts, and server endpoints
Language
TypeScript
Shared content and form types; clearer refactoring
Styling
Tailwind CSS plus CSS variables
Consistent tokens with flexible original layouts
Motion
CSS plus limited GSAP and ScrollTrigger
Simple effects first; one distinctive coordinated illustration
UI primitives
Native HTML; selected shadcn/ui components if needed
Useful accessible foundations for dialogs or disclosures, restyled to Zatroz
Validation
Zod or an equivalent shared schema
Validate the same enquiry structure in browser and server
Content
Typed data and trusted repository Markdown or MDX
Simple publishing through reviewed Git changes
Enquiry storage
Supabase PostgreSQL
A durable record before email delivery, without building a CRM
Notifications
Resend transactional email
Server-side notifications from a verified sender domain
Spam protection
Cloudflare Turnstile and Vercel WAF limits
Layered protection for the public enquiry endpoint
Hosting
Vercel commercial plan
Managed Next.js hosting, previews, CDN, and deployment controls
Source control
GitHub
Reviewable changes, history, and collaboration
Quality tools
Type checking, linting, browser checks, targeted Playwright and accessibility checks
Verify critical behaviour and catch regressions
Node.js is the runtime behind the server route; a separate Node or Express service is unnecessary. Supabase already provides PostgreSQL, so there is no second database to install. Avoid adding an ORM, Redux, GraphQL, Docker, Kubernetes, or a custom authentication system without a concrete need.
Use the latest mutually compatible stable versions at project setup and record them in the lockfile. Avoid experimental framework features for the initial release. Verify that the deployment runtime is supported by the chosen framework version.
For a much smaller brochure site with contact links only, a static architecture can work. For this planned interactive site with reliable enquiry storage and possible growth, Next.js is the recommended choice. If development time becomes constrained, simplify motion and content scope before adding a second framework.
The Vercel Hobby plan is restricted to non-commercial personal use. Budget for a commercial plan for the Zatroz company website and review current charges before purchase. Reference: Vercel Hobby plan terms.
19 Project folder structure
The following is a proposed structure for the future repository, not implementation code. Keep routes thin: route files assemble sections and load content, while reusable components and server services hold the shared behaviour.
Path within the future repository
Responsibility
src/app/layout.tsx
Root layout, fonts, metadata defaults, and shared shell
src/app/page.tsx
Homepage composition
src/app/about/page.tsx
Company story and team
src/app/services/page.tsx
Service index
src/app/services/[slug]/page.tsx
Reusable service detail template
src/app/work/page.tsx
Project index
src/app/work/[slug]/page.tsx
Canonical case study template
src/app/process/page.tsx
Delivery process
src/app/contact/page.tsx
Enquiry page
src/app/privacy/page.tsx
Privacy notice
src/app/terms/page.tsx
Website terms
src/app/api/enquiries/route.ts
Validate and store enquiries; request notification
src/app/api/internal/retry-notifications/route.ts
Authenticated retry endpoint for the scheduled job
src/app/sitemap.ts and robots.ts
Generated public search files
src/app/not-found.tsx and error.tsx
Useful missing-page and recoverable error states
src/components/ui/
Buttons, links, fields, disclosures, and modal primitives
src/components/layout/
Navbar, mobile navigation, footer, and container
src/components/sections/
Homepage and shared page sections
src/components/projects/
Project frame, status, filters, and media
src/components/forms/
Enquiry form, validation display, and success state
src/components/graphics/
Original SVG and HTML workflow illustrations
src/animations/
GSAP setup, scoped sequences, and motion constants
src/hooks/
Shared hooks only where more than one component needs them
src/lib/
Small formatting, content-loading, and metadata utilities
src/lib/validation/
Enquiry schema and allowlists
src/services/server/
Server-only database, email, and Turnstile adapters
src/types/
Service, project, enquiry, and shared content types
src/constants/
Navigation, contact information, services, and event names
src/styles/
Design tokens, global styles, and reduced-motion overrides
content/services/ and content/work/
Reviewed public service and project content
content/insights/
Add when the editorial section is launched
public/brand/ and public/images/
Approved logo assets, portraits, and project images
public/fonts/
Self-hosted fonts and retained licences
supabase/migrations/
Versioned tables, constraints, and access policies
tests/e2e/ and tests/integration/
Critical user journeys and enquiry failure paths
docs/
Design decisions, content register, deployment guide, and maintenance runbook
.env.example
Variable names and descriptions with no live secrets
Keep all server adapters explicitly server-only. Do not import them through a shared client utility. Keep public content separate from enquiries. Avoid creating empty folders for every future feature; add them when the feature is scheduled.
20 Reusable component system
Component
Main variants or states
Consistency rule
Container and Section
Default, narrow reading width, dark surface
Shared width and spacing tokens
Navbar and MobileMenu
Closed, open, current page
Same destinations and active labels
Button and TextLink
Primary, secondary, quiet, loading, disabled
Fixed type scale, icon spacing, and focus pattern
SectionHeading
Eyebrow, title, optional introduction
Semantic heading level supplied by the page
ServiceExplorer
Selected need, expanded details
Same keyboard and tap behaviour
ServiceDetail
Benefits, deliverables, scope, related work
Same content schema across six pages
ProjectCard
Client work, live product, prototype, concept
Status remains visible outside media
ProjectMedia
Image, caption, optional video
Dimensions, alt text, and privacy review required
Testimonial
Quote with attribution
Only approved content; no dummy production variant
ProcessStep
Number, title, client output
Same sequence and terminology everywhere
CTASection
Light or dark surface
One main action and optional secondary link
FormField and ErrorSummary
Idle, required, invalid, help text
Shared labels, validation, and focus behaviour
EnquiryForm
Idle, sending, saved, failed, limited
Success depends on the server response
Dialog
Open and closed
Title, Escape, close control, focus restoration
FAQDisclosure
Collapsed and expanded
Native semantics or one consistent accessible primitive
InlineStatus
Loading, success, error
Visible text and appropriate live announcement
Footer
Shared across all pages
Single source of contact and policy links
Keep colours, space, typography, border radius, and animation timing in a central token system. Define variants once rather than changing button styles in each page. Use typed content records so the same project title, service name, and CTA appear consistently.
Create a private component preview page during development showing focus, hover, long text, narrow widths, errors, and loading states. Keep it out of production navigation and search. A full Storybook setup is optional for this small site.
Avoid a decorative site loader. If a network operation takes time, show a local loading indicator beside the relevant action. The visitor should be able to read the site immediately.
21 Backend requirements
Recommended architecture
The website requires a small backend for the enquiry form. Public content, services, projects, and team profiles do not require a database at launch. They can be edited through reviewed repository changes. Supabase stores only enquiries and the metadata needed to manage their delivery.
The proposed flow is browser form to Next.js enquiry endpoint, then server validation and Turnstile verification, then a durable database insert, followed by an email notification. A protected scheduled job retries notifications that remain pending. The browser never receives a database secret or direct access to enquiry records.
Enquiry processing order
1. Apply the host's endpoint rate limit and check HTTP method, content type, request size, and expected origin.
2. Parse the request against the shared schema and normalise harmless whitespace. Reject invalid categories, oversized values, and unexpected fields.
3. Verify the Turnstile token on the server, including expected hostname and action. A failed or expired challenge does not create an enquiry.
4. Insert the enquiry with a random reference and a unique idempotency key. Set notification status to pending in the same durable record.
5. Attempt a bounded-time notification using a stable provider idempotency key where supported. Record the result without exposing personal content in logs.
6. Return a successful saved status once storage succeeds, even if notification needs a retry. Return a clear failure if storage fails.
7. Retry pending notifications through an authenticated scheduled job with limited attempts, backoff, and an alert for items requiring manual attention.
Repeated requests with the same idempotency key must not create duplicate records. Bind the key to a digest of the submitted payload and return a generic saved response without revealing an existing enquiry. Test a network timeout after the database insert as well as a double click on Submit.
Proposed enquiry record
Field group
Proposed fields
Rule
Identity
id, public_reference, created_at
Server-generated identifiers and timestamp
Contact
name, email, company, phone, contact_method
Store only supplied and relevant details
Project
service, description, budget_range, timeline, meeting_requested
Validated categories and length-limited plain text
Attribution
landing_path, source, medium, campaign
Allowlisted and length-limited; remove personal data and arbitrary query strings
Notice
privacy_notice_version
Record which published notice accompanied the form
Lead handling
status, assigned_to, last_contacted_at
Internal fields; not settable by the public request
Notification
notification_status, attempt_count, next_retry_at, provider_message_id
Supports recoverable email delivery
Duplicate control
idempotency_key, payload_digest
Unique key with request binding
Add indexes for created_at, status, and pending-notification queries. Enable row-level security and give anonymous visitors no read, insert, update, or delete policy on this table. Server writes use a tightly controlled server-only credential. Such credentials may bypass row-level security, so server access controls and secret handling remain essential. Reference: Supabase row-level security guidance.
Use the private provider dashboard for initial enquiry review, with individual accounts and MFA. Do not build a public admin interface simply to display this table. Assign a founder to check new enquiries and failed notifications each business day.
Optional backend features
Newsletter: defer until there is a publishing owner and a clear topic. When introduced, use a dedicated email platform with confirmation, unsubscribe, suppression, and consent records.
CMS and blog: start with trusted repository content. Add a hosted CMS when a nontechnical editor needs frequent publishing. Use draft previews, approved content types, image validation, and a publish review. Never compile untrusted visitor-supplied MDX.
Portfolio administration: add through the CMS when justified, rather than building a second editing system. Admin dashboard: introduce only when lead volume or multiple staff workflows make it worthwhile.
Email: use a verified sender domain with the provider's required DNS authentication. The current Gmail address can receive notifications, but the sender should be an authenticated company-domain address. Do not place the visitor's address in the From header; use an appropriately validated Reply-To. Reference: Resend sending email documentation.
22 Security and privacy
Protect the enquiry endpoint
Validate on the server even when the browser has already validated. Limit the request body, for example to 16KB for this text-only form. Use enum allowlists for service, budget, timeline, and contact method. Reject unexpected fields and malformed input. Avoid overly restrictive name patterns that exclude legitimate users.
Treat descriptions as plain text. Use parameterised database operations and context-appropriate escaping in HTML emails and any later dashboard. Validation alone does not prevent every injection problem. Avoid raw HTML rendering, user-controlled email headers, or fetching a URL that a visitor submits. Reference: OWASP input validation guidance.
Set a Vercel WAF rule for POST requests to /api/enquiries. Begin with a conservative trial threshold, such as 10 requests per 10 minutes per source IP, review legitimate traffic, and tune it for shared networks. Return a readable retry message for rate-limited requests. WAF counters are regional, so they are not a strict worldwide quota. Reference: Vercel WAF rate limiting.
Combine the rate limit with Turnstile and duplicate protection. The client widget alone is insufficient: validate each token through Siteverify and check the expected hostname and action. Handle token expiry without discarding the visitor's message. Keep an email or WhatsApp fallback when challenge verification fails. Reference: Cloudflare server-side validation.
Secrets and access
Keep database secrets, email API keys, Turnstile secrets, retry-job credentials, and any future admin credentials on the server. Do not use public environment variable prefixes for secrets. Keep them out of Git, browser bundles, screenshots, analytics, and logs. Use different credentials and data stores for previews and production.
Use individual provider accounts with MFA and least-privilege access. Revoke access when a collaborator leaves. Enable dependency update and secret-scanning checks, retain a lockfile, and assign someone to review security updates.
The launch site has no customer login. If a future admin dashboard is added, use managed authentication, MFA, server-checked sessions, role-based authorisation, and row-level database policies. Separate content editors from lead handlers. Check authorisation on every read and write; hiding a button is not access control. Plan audit events, session expiry, and secure account recovery before launch of that dashboard.
Browser and network security
Use HTTPS across the site and services. Restrict browser access to the intended origin; a same-origin form does not need a permissive CORS configuration. CORS is not authentication or a defence against direct scripted requests. Validate Origin where appropriate and use CSRF protection on any future cookie-authenticated mutations.
Set appropriate content-type protection, referrer policy, and permissions policy. Deny framing unless a legitimate embedding use case is approved. Enable HSTS after HTTPS and domain behaviour have been verified; do not include subdomains without checking their readiness.
Plan a Content Security Policy around the actual framework scripts, fonts, images, analytics, and Turnstile endpoints. Begin in report-only mode during preview, resolve violations, then enforce a tested policy. Avoid broad wildcards and production unsafe-eval. A nonce-based strict policy can require dynamic rendering in Next.js and affect caching, so validate that choice against the performance plan rather than assuming every route remains static. Reference: Next.js CSP guidance.
Protect retry and webhook endpoints with appropriate authentication or signature verification. Do not leave a publicly callable email retry endpoint. Use bounded timeouts, limited retries, and non-sensitive error responses. No enquiry endpoint should return submitted records or a stack trace.
Data handling and retention
Collect the minimum information needed to discuss the project. Do not accept file attachments at launch. Add uploads later only with private storage, file-size and type restrictions, malware handling, access checks, and retention rules.
Choose and publish a practical retention policy. A proposed starting policy is to review unsuccessful enquiries after 180 days and delete or minimise them unless there is a documented reason to retain them. This is an operational proposal, not a statutory retention period. The final privacy notice must describe the actual processors, purposes, relevant transfers, contact route, and rights that apply to the business.
Remove personal content from logs, analytics, session replay, and error reports. Retention must cover database records, email copies, exports, and backups. Keep only a short reference and technical delivery status in alerts where possible.
The service uses transport encryption and provider storage protections; it is not end-to-end encrypted if servers and email systems can read enquiries. Do not advertise end-to-end encryption for this workflow.
23 Analytics and operational measurement
Start with Vercel Web Analytics for aggregate traffic and events, and Search Console for search visibility. Review the provider's current privacy behaviour and configure Zatroz's notice for the actual deployment. Reference: Vercel analytics privacy documentation.
GA4 becomes useful if the company runs campaigns and needs deeper attribution. Microsoft Clarity can help investigate specific usability issues later, with appropriate consent and masking. Do not install several overlapping analytics or replay tools by default. Keep optional tracking off until the applicable consent choice permits it.
Event
Trigger
Safe properties
cta_click
A visitor activates a main or secondary CTA
CTA name, placement, page type
service_view
A service detail page is viewed
Service slug
project_view
A project story is viewed
Project slug and public project category
service_select
A need or capability is selected
Allowlisted selection
enquiry_start
First meaningful form interaction
Source page category
enquiry_saved
Server confirms a new enquiry was stored
Service category; opaque technical event key only if needed
enquiry_error
A submission fails
Error category, never submitted content
whatsapp_click
WhatsApp link is activated
Page and placement
email_click
Email link is activated
Page and placement
meeting_requested
A saved enquiry includes this preference
Request type
Record enquiry_saved once per successful new enquiry, not every click or page reload. Keep the database count as the operational source of truth and use analytics as an approximate funnel because tracking may be blocked or declined. Do not send names, email addresses, phone numbers, descriptions, or arbitrary URLs to analytics.
Review weekly: traffic to service pages, project engagement, form start-to-save completion, qualified enquiries, and response time. Review monthly: which services generate suitable work and which content answers repeated questions. Meeting confirmation and proposal outcomes can be recorded privately by the team.
Track operational failures separately: endpoint errors, pending notification age, repeated delivery failure, broken public links, and uptime. Alert an assigned owner when new enquiries are saved but notifications repeatedly fail.
24 Deployment and maintenance
Source control and environments
Use main as the protected production branch. Short-lived feature branches receive preview deployments and merge through pull requests. For three founders, add a develop branch only if the team needs a shared integration environment; it should deploy to staging and merge to main through a release pull request. A small team can use feature previews directly without maintaining develop.
Each change should have a clear purpose, a manageable diff, verification notes, and an appropriate reviewer. Require type checking, linting, a production build, and critical journey tests before merging. Keep the known-good release tagged for rollback.
Environment variable plan
Variable group
Examples
Location
Public configuration
SITE_URL, public Turnstile site key
Safe site configuration; public key may be exposed
Database
Supabase URL and server secret or service credential
Server only
Email
API key, approved sender, notification recipient
Server only
Challenge verification
Turnstile secret
Server only
Scheduled jobs
Retry-job secret
Server only
Monitoring
Project identifier and required private tokens
Separate public identifiers from private upload tokens
Use placeholder names in .env.example. Set actual values through the host's environment settings or another approved secret store. Preview notifications should go to a test inbox and use test data. Do not let a preview submit into the production enquiry table.
Release sequence
1. Confirm the chosen domain, ownership, account access, recurring costs, and the commercial hosting plan.
2. Import the GitHub repository into Vercel and confirm the runtime, build command, output behaviour, and production branch.
3. Create separate production and test database environments, apply migrations, verify policies, and establish backup and restore procedures.
4. Configure the email sender domain, required DNS records, Turnstile allowed domains, environment variables, and protected retry job.
5. Deploy a preview and verify public pages, form success and failure, email delivery, notification retries, mobile behaviour, metadata, and accessibility.
6. Configure the custom domain using the exact DNS records provided by the host. Preserve existing mail and verification records. Choose one canonical domain and redirect the alternative.
7. Wait for the host's TLS certificate and domain checks to succeed. Verify HTTPS, redirects, production URLs, and mixed-content absence.
8. Enable the reviewed firewall rules, security headers, monitoring, and production-safe analytics settings. Remove preview noindex from public production pages only.
9. Run a final production smoke test, including a clearly labelled test enquiry and confirmed delivery. Remove test data through the normal retention process.
10. Verify Search Console ownership, submit the sitemap, check representative URLs and sharing cards, and record the release version.
Use a final release review with the founding team after the preview is concrete. A website deployment is outside this planning task; this document does not create accounts, purchase services, or publish the site.
Operations and cost ownership
Account for the domain, commercial hosting, database and backup tier, email usage, firewall usage, monitoring, and any later CMS or scheduler. Assign a billing owner and renewal reminders. Record current provider prices when purchasing rather than treating this plan as a price quotation.
During the first week, check enquiries, failed notifications, uptime, and mobile issues daily. Thereafter, review content and broken links monthly, dependencies regularly, and access rights when the team changes. Confirm domain renewal and sender authentication periodically.
Set a practical recovery goal, such as restoring the public site within four business hours and enquiry data within 24 hours using tested backups. These are proposed internal objectives. Confirm that the selected provider tiers support the backup schedule. A code rollback does not undo database changes, so keep schema migrations backward-compatible and test data restoration separately.
25 Development phases
Plan 35 working days, approximately seven weeks at five days per week and 3 to 4 focused hours per day. Allow an additional week for content delays and final corrections. This is an estimate; parallel founder contributions can help, but learning time and missing assets may extend it. Accessibility, security, and mobile checks run throughout the phases.
Phase 1 Research and planning
Duration: 2 working days. Tasks: confirm audience, service capacity, sitemap, available proof, and the enquiry workflow. Output: agreed launch scope, content inventory, and decision list. Gate: each proposed page has a purpose and owner; unsupported claims are identified.
Phase 2 Brand and design system
Duration: 2 days. Tasks: collect the actual logo, choose tokens, confirm Manrope, and design buttons, inputs, spacing, and focus states. Output: a small design system and component-state reference. Gate: colours are checked in their real combinations and all controls remain readable.
Phase 3 Wireframes
Duration: 2 days. Tasks: wireframe Home, Services, service detail, Work, project detail, About, Process, and Contact on mobile and desktop. Output: connected low-fidelity user journeys. Gate: a visitor can find a relevant service, evaluate work, and reach contact without explanation.
Phase 4 Detailed UI design
Duration: 3 days. Tasks: design the selected hero, original workflow graphics, project frames, team section, and all form states. Output: reviewed desktop and mobile screens plus asset specifications. Gate: realistic content fits, the logo is correct, and each interaction has an accessible alternative.
Phase 5 Project setup
Duration: 1 day. Tasks: create the repository and Next.js project, add TypeScript and styling tokens, configure quality checks, and establish preview environments. Output: a clean build and an environment guide. Gate: no secrets are committed and the preview deploys successfully.
Phase 6 Core components
Duration: 2 days. Tasks: build the shared shell, buttons, fields, disclosures, media frames, and navigation. Output: the component preview and reusable primitives. Gate: keyboard navigation, long text, focus, and narrow-screen behaviour pass review.
Phase 7 Homepage
Duration: 3 days. Tasks: assemble the homepage with real content, project data, service explorer, and static workflow graphics. Output: a usable homepage without optional motion. Gate: the offer and main CTA are clear, and the page works on a phone.
Phase 8 Other pages
Duration: 4 days. Tasks: implement the six service pages using one template, project stories, About, Process, Contact layout, policies, 404, and error states. Output: complete launch navigation and page content. Gate: no empty routes, fabricated proof, placeholder copy, or broken internal links.
Phase 9 Motion
Duration: 2 days. Tasks: add the limited GSAP hero sequence and selected CSS interactions. Output: the motion system with reduced-motion and mobile variants. Gate: content remains accessible without motion and performance stays close to the static baseline.
Phase 10 Backend and forms
Duration: 3 days. Tasks: add the enquiry schema, database migration, access policies, Turnstile verification, rate limiting, notification, and protected retries. Output: the complete enquiry path and operational runbook. Gate: saved requests survive email failure; invalid, duplicate, and unauthorised requests behave correctly.
Phase 11 Responsive optimisation
Duration: 2 days. Tasks: review intermediate widths, actual phones, menus, screenshots, forms, and software keyboards. Output: corrected responsive layouts. Gate: no accidental horizontal overflow, covered controls, or hover-only content.
Phase 12 SEO and accessibility
Duration: 2 days. Tasks: review metadata, sitemap, schema, headings, alt text, keyboard use, screen-reader flow, contrast, and privacy settings. Output: indexing and accessibility review records. Gate: key journeys pass manual review and public metadata matches real content.
Phase 13 Performance optimisation
Duration: 2 days. Tasks: optimise images and fonts, inspect route bundles, remove unnecessary client code, and test caching. Output: a production performance baseline. Gate: representative pages meet the agreed lab targets or have a documented, justified exception.
Phase 14 Final testing
Duration: 3 days. Tasks: run critical journey tests, cross-browser review, content checks, failure scenarios, backup restoration, and the release review. Output: a reviewed release candidate and prioritised issue list. Gate: no open blocker affecting contact, security, navigation, or essential accessibility.
Phase 15 Deployment and handover
Duration: 2 days. Tasks: configure the domain, deploy the approved build, verify production settings, submit the sitemap, and hand over the runbook. Output: a verified public site with named owners. Gate: production enquiry delivery and retries work, rollback is understood, and monitoring is active.
Working with Cursor during implementation
Give Cursor one bounded task at a time, with the relevant design decisions, files in scope, expected behaviour, and acceptance checks. Review the generated diff, run the page locally, inspect mobile behaviour, and commit only after checking the result. Do not ask it to generate the entire website in one uncontrolled change.
Use separate tasks for tokens, navigation, service explorer, project template, enquiry validation, and notification recovery. Ask for a brief explanation of the changed behaviour so the implementation remains a learning exercise. Keep each completed phase in a clean commit and use pull requests to record the checks before moving forward.
26 Development checklist
Before implementation
☐ Confirm the actual services, audience, and main CTA.
☐ Agree the launch sitemap and later-page triggers.
☐ Assign a content owner and enquiry owner.
☐ Collect the correct logo in vector and transparent formats.
☐ Confirm founder names, roles, portraits, and professional links.
☐ Choose two or three projects and establish publication permission.
☐ Verify every award, statistic, testimonial, and client relationship.
☐ Confirm the domain choice and business contact details.
☐ Agree who owns hosting, billing, renewals, and provider access.
☐ Review the hero concept and mobile wireframes.
Design and content
☐ Finalise colour, typography, spacing, radius, and focus tokens.
☐ Check text contrast and control boundaries.
☐ Design all enquiry states and keyboard interactions.
☐ Prepare original graphics and approved project screenshots.
☐ Write the homepage, six service pages, and project stories.
☐ Label prototypes, concepts, and founder work accurately.
☐ Describe costs, scope, ownership, and support without unsupported promises.
☐ Review privacy and website terms for the actual operation.
☐ Define image alt text and captions while preparing assets.
☐ Check the design at narrow widths with real content.
Repository and implementation
☐ Set up the framework, supported runtime, and lockfile.
☐ Establish protected production and isolated preview workflows.
☐ Create .env.example without live values.
☐ Build and review the shared component states.
☐ Implement thin route files and reusable content templates.
☐ Keep server services out of client imports.
☐ Complete navigation, footer, 404, and error states.
☐ Make services and project links work without optional animation.
☐ Use properly sized images and self-hosted fonts.
☐ Add only the motion that passes accessibility and performance checks.
Enquiries and security
☐ Add server validation, size limits, and allowlisted categories.
☐ Verify Turnstile on the server and handle expiry gracefully.
☐ Configure and test the endpoint rate limit.
☐ Apply database migrations and deny public access to enquiry records.
☐ Test secret handling and provider account MFA.
☐ Save the enquiry before reporting success.
☐ Prevent duplicate records after double clicks and retries.
☐ Test email outage, timeout, retry, and manual recovery.
☐ Protect the retry endpoint and any provider webhook.
☐ Authenticate the email sender and confirm actual delivery.
☐ Remove personal information from logs and analytics.
☐ Finalise retention, deletion, backups, and restoration procedures.
Quality checks
☐ Review keyboard navigation and visible focus on every template.
☐ Test menu, explorer, and form with a screen reader.
☐ Test reduced motion, zoom, and text expansion.
☐ Check the main responsive widths and landscape behaviour.
☐ Test real mobile devices and the on-screen keyboard.
☐ Verify Chrome, Firefox, Safari, and relevant mobile browsers.
☐ Check Home, service, project, and Contact performance.
☐ Review production bundles and third-party script cost.
☐ Verify titles, canonical URLs, sharing images, and structured data.
☐ Remove placeholders, broken links, secrets, and unapproved claims.
☐ Ensure failures preserve form input and explain the next action.
☐ Complete a focused release review with no unresolved blockers.
Production release
☐ Confirm commercial hosting and expected recurring costs.
☐ Configure production variables separately from previews.
☐ Preserve existing email DNS records while connecting the domain.
☐ Verify TLS, canonical redirects, and mixed-content absence.
☐ Enforce tested security headers and firewall rules.
☐ Keep private routes and previews protected and out of search.
☐ Remove noindex from intended production pages.
☐ Verify a saved production test enquiry and delivered notification.
☐ Confirm the scheduled retry and operational alerts work.
☐ Verify analytics events without personal information.
☐ Submit the sitemap through Search Console.
☐ Record the release, recovery procedure, and named owners.
After launch
☐ Check enquiries and notification failures each business day.
☐ Review initial user feedback and mobile issues during the first week.
☐ Establish a conversion and lead-quality baseline over the first month.
☐ Review field performance when sufficient data becomes available.
☐ Fix broken links and stale project claims regularly.
☐ Review dependencies, access, retention, and renewals on schedule.
☐ Add later features only when evidence or operational need supports them.
27 Final recommendations
Decision
Recommended choice
Architecture
Eight general pages, six service pages, and two or three detailed project stories
Design direction
Warm-white editorial pages, charcoal feature sections, authentic people, and original workflow graphics
Brand colour
#FF3B10 with dark button text; #C42B0A for readable small orange links
Typography
Manrope throughout; optional IBM Plex Mono for a few labels
Hero
Connected business with three simple, labelled examples
Animation
CSS first; a small GSAP sequence; no forced scrolling or decorative loading screen
Stack
Next.js, React, TypeScript, Tailwind CSS, Supabase enquiries, and transactional email
Homepage flow
Offer, evidence, selected work, services, automation example, process, people, questions, contact
Development order
Content and design, static responsive pages, critical enquiry flow, restrained motion, quality checks, deployment
Items that are easy to miss
Plan the content and evidence register before designing impressive statistics. Prepare project and service empty states, error pages, social sharing images, favicon variants, email failure recovery, and form confirmation wording. Keep publication permission for portraits, client logos, testimonials, and screenshots.
Define code ownership, domain ownership, third-party subscriptions, hosting renewal, maintenance scope, and handover in the business process. The website should explain these topics accurately, and actual projects should document them in their agreements.
Make language expansion possible without translating the entire site at launch. Keep copy in structured content, allow text to expand, and use language-capable fonts when adding Tamil or Sinhala. Add an availability statement only when someone owns keeping it current.
Do not publish public package prices until the founding team agrees the scope and exclusions. If the earlier Zatroz packages are retained, recheck the current figures, hosting duration, domain renewal, payment and AI provider costs, and maintenance terms. An enquiry budget field should never be mistaken for a binding quotation.
Inputs to settle before coding
The remaining business inputs are the current vector logo, approved founder profiles, verified project materials, the production domain, final contact links, the desired operating budget, and who will monitor incoming enquiries. These do not prevent completing this plan; they are the inputs for the first development phase.
The best first release is a polished, useful website that explains the services and handles enquiries reliably. Expand the portfolio, insights, products, and administration features as the company's work and customer needs provide the content to support them.