-- Drop existing tables to ensure a clean slate (WARNING: This deletes existing data in these tables)
drop table if exists public.about_page cascade;
drop table if exists public.timeline_events cascade;
drop table if exists public.projects cascade;
drop table if exists public.scrolls cascade;

-- Create 'about_page' table
create table public.about_page (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  title text not null,
  bio text not null,
  image_url text not null,
  skills text[] not null,
  email text,
  phone text,
  location text,
  linkedin_url text,
  github_url text,
  resume_url text,
  constraint about_page_pkey primary key (id)
);

-- Create 'timeline_events' table for the JourneyTimeline
create table public.timeline_events (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  chapter text not null,
  title text not null,
  date_range text not null,
  description text not null,
  details text[] not null,
  tech_stack text[] null,
  icon text not null, -- Store icon name (e.g., 'BookOpen', 'Sword')
  "order" integer not null,
  constraint timeline_events_pkey primary key (id)
);

-- Create 'projects' table (replacing MDX)
create table public.projects (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  slug text not null unique,
  title text not null,
  subtitle text not null,
  thumbnail text not null,
  tech_stack text[] not null,
  innovations jsonb not null, -- Store array of {title, desc} objects
  repo_url text null,
  demo_url text null,
  content text not null, -- Markdown content
  published boolean not null default false,
  constraint projects_pkey primary key (id)
);

-- Create 'scrolls' table
create table public.scrolls (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  title text not null,
  slug text not null unique,
  category text not null,
  date text not null,
  read_time text not null,
  excerpt text not null,
  icon text not null,
  content text not null, -- Markdown content
  published boolean not null default false,
  constraint scrolls_pkey primary key (id)
);

-- Enable RLS
alter table public.about_page enable row level security;
alter table public.timeline_events enable row level security;
alter table public.projects enable row level security;
alter table public.scrolls enable row level security;

-- Policies (Public Read, Admin Write)
create policy "Enable read access for everyone" on public.about_page for select using (true);
create policy "Enable all access for authenticated users" on public.about_page for all using (auth.role() = 'authenticated');

create policy "Enable read access for everyone" on public.timeline_events for select using (true);
create policy "Enable all access for authenticated users" on public.timeline_events for all using (auth.role() = 'authenticated');

create policy "Enable read access for everyone" on public.projects for select using (true);
create policy "Enable all access for authenticated users" on public.projects for all using (auth.role() = 'authenticated');

create policy "Enable read access for everyone" on public.scrolls for select using (true);
create policy "Enable all access for authenticated users" on public.scrolls for all using (auth.role() = 'authenticated');

-- Seed Data (Insert hardcoded content)

-- About Page
insert into public.about_page (title, bio, image_url, skills, email, phone, location, linkedin_url, github_url, resume_url)
values (
  'About — Muhammad Wahaj Shafiq',
  'Accomplished IT professional with diverse experience in transcription, virtual assistance, and front-end & back-end development. I combine pragmatic front-end work with disciplined backend engineering and focus on trust-preserving systems — most recently building a blockchain-based voting system as my Final Year Project.',
  '/assets/profile.png',
  ARRAY['HTML, CSS, JavaScript', 'Python', 'Django', 'React.js', 'Solidity', 'Bootstrap & Tailwind CSS', 'Network Administration', 'Transcription & VA'],
  'wahajshafiq455@gmail.com',
  '+92 325 7953455',
  'Faisalabad',
  'https://linkedin.com/in/wahajshafiq',
  'https://github.com/itzwahaj',
  '#'
);

-- Timeline Events
insert into public.timeline_events (chapter, title, date_range, description, details, tech_stack, icon, "order")
values 
('Chapter I: The Awakening', 'BSc — Information Technology', '2021 – 2025', 'Forged in the halls of the University of Agriculture, mastering the arcane arts of algorithms and systems.', ARRAY['Specialized in Software Engineering and Data Structures.', 'Led study groups on Cryptography and Network Security.', 'Final Year Project: Blockchain-based Voting System (BlockVote).'], null, 'BookOpen', 1),
('Chapter II: The Early Trials', 'Freelance & Virtual Assistance', '2019 – 2021', 'Ventured into the wildlands of Upwork and Fiverr, battling deadlines and client demands.', ARRAY['Provided technical transcription and virtual assistance to global clients.', 'Honed communication skills and project management under pressure.', 'Learned the value of clear documentation and reliable delivery.'], null, 'Sword', 2),
('Chapter III: The Great Campaign', 'Full-Stack Development', '2023 – Present', 'Building fortified applications with modern armaments: Next.js, Solidity, and Python.', ARRAY['Architected secure voting protocols using Ethereum smart contracts.', 'Developed responsive front-ends with React and Tailwind CSS.', 'Integrated biometric authentication (WebAuthn) for identity verification.'], ARRAY['Next.js', 'Solidity', 'PostgreSQL', 'Tailwind'], 'Shield', 3),
('Chapter IV: Ascending Ranks', 'Certifications & Mastery', 'Ongoing', 'Continuously sharpening the blade through rigorous study and validation.', ARRAY['Meta Front-End Developer Professional Certificate (In Progress).', 'Solidity & Smart Contract Security (Self-Taught).', 'Advanced Python for Data Science.'], null, 'Award', 4),
('Chapter V: The Horizon', 'Future Quests', '2025 & Beyond', 'Charting a course towards decentralized governance systems and zero-knowledge proofs.', ARRAY['Goal: Contribute to major DeFi protocols.', 'Goal: Master ZK-Rollups and Layer 2 scaling solutions.', 'Goal: Build a privacy-focused DAO tooling suite.'], null, 'Map', 5);

-- Projects (BBVS)
insert into public.projects (slug, title, subtitle, thumbnail, tech_stack, innovations, repo_url, demo_url, content, published)
values (
  'bbvs',
  'BlockVote – Decentralized Election System',
  'A decentralized voting platform on Polygon testnet with biometric WebAuthn fingerprint gates and milestone-driven smart contracts.',
  '/og/bbvs.png',
  ARRAY['Solidity (Smart Contracts)', 'Polygon (Amoy Testnet)', 'WebAuthn (Biometrics)', 'Node.js / IPFS'],
  '[
    {"title": "Milestone-Driven Contracts", "desc": "Automated registration lock and tallying, reducing administrative overhead by 100%."},
    {"title": "Biometric Identity Binding", "desc": "WebAuthn integration expected to reduce false registrations by >99% vs. email-only auth."},
    {"title": "Cost-Effective Ops", "desc": "Deployed on Polygon L2, reducing gas costs by ~95% compared to Ethereum Mainnet."}
  ]'::jsonb,
  '#',
  'https://itzwahaj.github.io/blockchain-voting-dapp',
  '## The Problem
Traditional voting is centralized, slow, and vulnerable to tampering. Single points of failure allow for data manipulation, and manual tallying destroys trust.

## The Solution
BBVS eliminates trust assumptions. By binding identity to biometrics and votes to an immutable ledger, we ensure that **one person = one vote**, and the count is mathematically verifiable.

<div className="my-12 max-w-xl mx-auto bg-surface/50 p-4 rounded-lg border border-white/5">
  <h3 className="text-lg font-serif font-bold text-white mb-4 text-center">Workflow</h3>
  <DiagramReveal src="/diagrams/workflow.png" alt="Workflow diagram showing voting process" className="w-full rounded-sm" />
</div>

## The Process
1. **Requirement**: Defined threat model & biometric constraints.
2. **Sprints**: Iterative smart contract development & testing.
3. **Deployment**: Polygon testnet launch & security audit.

<div className="my-12 max-w-xl mx-auto bg-surface/50 p-4 rounded-lg border border-white/5">
  <h3 className="text-lg font-serif font-bold text-white mb-4 text-center">Phase Wheel</h3>
  <DiagramReveal src="/diagrams/phase-wheel.png" alt="Phase wheel diagram showing project lifecycle" className="w-full rounded-sm" />
</div>

## System Architecture
Critical Path: Biometric Registration → Vote Encryption → Automated Tallying.

<div className="my-12 max-w-xl mx-auto bg-surface/50 p-4 rounded-lg border border-white/5">
  <h3 className="text-lg font-serif font-bold text-white mb-4 text-center">System Architecture</h3>
  <DiagramReveal src="/diagrams/architecture.png" alt="System architecture diagram" className="w-full rounded-sm" />
</div>

## Security & Caveats
- **Privacy**: Biometric templates are never stored raw. We store salted hashes using the standard WebAuthn implementation, ensuring that even if the database is leaked, user biometrics remain secure.
- **Threat Model**: We address network congestion via layer-2 batching and Sybil attacks via hardware-backed identity binding.

<div className="my-12 max-w-xl mx-auto bg-surface/50 p-4 rounded-lg border border-white/5">
  <h3 className="text-lg font-serif font-bold text-white mb-4 text-center">Security Model</h3>
  <DiagramReveal src="/diagrams/security.png" alt="Security model diagram" className="w-full rounded-sm" />
</div>',
  true
);

-- Scrolls
insert into public.scrolls (slug, title, category, date, read_time, excerpt, icon, content, published)
values 
(
  'binding-components-mern',
  'Binding Components: Rituals of the MERN Stack',
  'Spellbook',
  'Nov 15, 2025',
  '10 min read',
  'A full-stack workflow chronicle, from forging backend models to weaving client integration. Featuring live snippets from the Sundown Studio archives.',
  'Code',
  'The MERN stack—MongoDB, Express, React, Node.js—is a formidable arsenal for the modern web artificer. In this chronicle, I dissect the rituals used to bind these disparate technologies into a cohesive, living application, drawing directly from the archives of the **Sundown Studio** project.

### I. Forging the Backend Models
Every great spell begins with a solid foundation. In the realm of MERN, this is the Schema. Using Mongoose, we define the shape of our data, enforcing strict types upon the chaotic void of NoSQL.

```javascript
// The User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    artifacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artifact" }]
});
```

### II. Weaving the API Routes
With our models forged, we must open the ley lines—the API routes. Express.js serves as the conduit, routing requests from the ether to the appropriate logic controllers. Middleware acts as the guardian, ensuring only the worthy (authenticated) may pass.

### III. The React Interface
Finally, the visual manifestation. React components bind to the data streams, rendering the state of the system in real-time. Using custom hooks, we abstract the fetching logic, keeping our components pure and focused on presentation.

The synergy between these layers is what breathes life into the application. When the backend schema aligns perfectly with the frontend types, the magic is seamless.',
  true
),
(
  'evm-sigils-solidity',
  'EVM Sigils: Writing Tamperproof Contracts',
  'Spellbook',
  'Oct 28, 2025',
  '12 min read',
  'Crafting smart contracts as binding spells. A walkthrough on the mental model of Solidity and the art of immutable logic.',
  'Scroll',
  'To write Solidity is to etch logic into stone. Once deployed to the Ethereum Virtual Machine (EVM), the code becomes immutable—a permanent sigil on the blockchain. This requires a shift in mental models, from "move fast and break things" to "measure twice, cut once."

### The Law of Immutability
Unlike traditional software, you cannot patch a smart contract. You can only deploy a new one and migrate the state—a costly and complex ritual. Therefore, security patterns must be baked into the very core of the design.

### Guarding the Gates: Modifiers
Modifiers are the gatekeepers of your functions. They ensure that only the authorized entities can execute critical state changes.

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not the owner");
    _;
}
```

### Reentrancy: The Phantom Menace
One of the most dangerous exploits. A malicious contract calls back into your contract before the first invocation is finished, draining funds in a recursive loop. The "Checks-Effects-Interactions" pattern is the primary defense against this dark art.',
  true
),
(
  'animating-arcane-gsap',
  'Animating the Arcane: Scroll Effects with GSAP',
  'Spellbook',
  'Oct 10, 2025',
  '8 min read',
  'Turning static layouts into living experiences. A case study on the motion design behind the Sidcup Family Golf project.',
  'Sparkles',
  'Motion is not merely decoration; it is communication. In the **Sidcup Family Golf** project, I utilized the GreenSock Animation Platform (GSAP) to transform a static layout into a fluid, reactive experience.

### The ScrollTrigger Plugin
The heart of the effect is ScrollTrigger. It allows animations to be driven by the scroll position, creating a direct link between the user''s action and the interface''s reaction.

```javascript
gsap.to(".element", {
    scrollTrigger: {
        trigger: ".container",
        start: "top center",
        scrub: true
    },
    x: 500,
    rotation: 360
});
```

### Performance Considerations
Animating the DOM can be expensive. To maintain 60fps, I focused on animating transform properties (translate, scale, rotate) and opacity, avoiding layout-thrashing properties like width or top.',
  true
),
(
  'trials-newblood',
  'The Trials of a Newblood Developer',
  'Reflections',
  'Sep 22, 2025',
  '6 min read',
  'A narrative log on impostor syndrome, code reviews, and the crucible of shipping your first React/Node project under pressure.',
  'Feather',
  'They don''t tell you about the fear. The fear of the blank cursor. The fear of the red error text. The fear that you are simply pretending to understand the arcane symbols on the screen.

My first major project was a trial by fire. I was tasked with building a full-stack dashboard. The deadline was tight, the requirements were vague, and my confidence was non-existent.

### The Valley of Despair
I spent three days stuck on a CORS error. Three days. I questioned my career choice. I questioned my intelligence. But in that darkness, I learned the most valuable skill of all: **Persistence**.

I learned to read the documentation not as a manual, but as a map. I learned to ask for help not as a sign of weakness, but as a strategy for speed. And eventually, the error cleared. The data flowed. The screen lit up.',
  true
),
(
  'sketch-to-spell',
  'From Sketch to Spell: Designing Code',
  'Reflections',
  'Sep 05, 2025',
  '7 min read',
  'The alchemy of converting mockups into modular code. Bridging the gap between design concepts and functional reality.',
  'Book',
  'A design is a promise. Code is the fulfillment of that promise. The translation process is where the magic—and the frustration—happens.

### Thinking in Components
When I look at a Figma file, I don''t see images. I see components. I see props. I see state. Breaking a UI down into its atomic parts is the first step of the alchemical process.

A button is not just a rectangle with text. It is a reusable entity with variants: primary, secondary, disabled, loading. Defining these states early prevents chaos later.',
  true
),
(
  'scroll-sidcup',
  'The Scroll of Sidcup',
  'Lore',
  'Aug 15, 2025',
  '5 min read',
  'Forged in GSAP and fueled by caffeine. Born to teach JavaScript animation the hard way. The story of vanquishing the Locomotive scroll demon.',
  'Archive',
  'The **Sidcup Family Golf** clone was not just a project; it was a war. A war against the browser''s default scrolling behavior.

### The Locomotive Demon
I wanted smooth, inertial scrolling. Locomotive Scroll promised this. But it demanded a sacrifice: it hijacked the native scroll, breaking all my fixed-position elements.

The battle to reconcile Locomotive Scroll with GSAP ScrollTrigger was long and bloody. It required a proxy element, a manual update loop, and a deep dive into the event listeners of the window object.

In the end, victory was achieved. The site glides like oil on glass. But the scars... the scars remain in the commit history.',
  true
);
