import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: 'easeOut' },
};

const ORCID_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="12" fill="#A6CE39" />
    <path d="M8.5 7H10V17H8.5V7Z" fill="white" />
    <path d="M13 7H15.5C17.9 7 19.5 8.6 19.5 12C19.5 15.4 17.9 17 15.5 17H13V7ZM14.5 15.6H15.3C17 15.6 18 14.5 18 12C18 9.5 17 8.4 15.3 8.4H14.5V15.6Z" fill="white" />
    <circle cx="8.5" cy="5.5" r="1" fill="white" />
  </svg>
);

const AVATAR_COLORS = [
  ['#2589ed','#78b4fb'],['#1a6bb5','#4999e8'],['#0f4c81','#2589ed'],
  ['#1565c0','#42a5f5'],['#01579b','#0288d1'],['#006064','#00838f'],
  ['#004d40','#00695c'],['#311b92','#512da8'],['#880e4f','#c2185b'],
];

function avatarGradient(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  const [a, b] = AVATAR_COLORS[h % AVATAR_COLORS.length];
  return `linear-gradient(135deg,${a},${b})`;
}

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function gdrive(id) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w300`;
}

/* ── Leader Card ── */
const LeaderCard = ({ name, role, roleBadge, orcid, affils, bio, img, isPublished }) => {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <motion.div className="eb-leader-card" {...fadeIn}>
      <div className="eb-leader-photo-wrap">
        {img && !imgFailed
          ? <img src={img} alt={name} className="eb-leader-photo" onError={() => setImgFailed(true)} />
          : <div className="eb-leader-initials" style={{ background: avatarGradient(name) }}>{initials(name)}</div>
        }
      </div>
      <div className={`eb-role-badge ${roleBadge}`}>{role}</div>
      {isPublished && <div className="eb-published-badge">12x Published</div>}
      <h3 className="eb-leader-name">{name}</h3>
      {orcid && (
        <a className="eb-orcid-link" href={`https://orcid.org/${orcid}`} target="_blank" rel="noopener noreferrer">
          {ORCID_ICON} {orcid}
        </a>
      )}
      <div className="eb-affils">
        {(affils || []).filter(a => a && a !== 'N/A').map((a, i) => (
          <span key={i} className="eb-affil-tag">{a}</span>
        ))}
      </div>
      <p className="eb-bio">{bio}</p>
    </motion.div>
  );
};

/* ── Editor Card ── */
const EditorCard = ({ name, category, orcid, affils, bio, img }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const primaryAffils = (affils || []).filter(a => a && a !== 'N/A' && a !== 'Synthica Research Group').slice(0, 2);
  return (
    <motion.div className="eb-editor-card" {...fadeIn}>
      <div className="eb-editor-avatar-wrap">
        {img && !imgFailed
          ? <img src={img} alt={name} className="eb-editor-photo" onError={() => setImgFailed(true)} />
          : <div className="eb-editor-initials" style={{ background: avatarGradient(name) }}>{initials(name)}</div>
        }
      </div>
      <div className="eb-editor-category">{category}</div>
      <div className="eb-editor-name">{name}</div>
      {orcid && (
        <a className="eb-orcid-link small" href={`https://orcid.org/${orcid}`} target="_blank" rel="noopener noreferrer">
          {ORCID_ICON} {orcid}
        </a>
      )}
      {primaryAffils.length > 0 && (
        <div className="eb-editor-affils">
          {primaryAffils.map((a, i) => <div key={i} className="eb-editor-affil">{a}</div>)}
        </div>
      )}
      {bio && <p className="eb-editor-bio">{bio}</p>}
    </motion.div>
  );
};

/* ── Data ── */
const SENIOR_EDITORS = [
  { name: 'Antonio Pineda Guerrero', category: 'Biology', orcid: '0009-0008-0704-1135', affils: ['Universitat Jaume I, Spain', 'Synthica Research Group', 'CARDIO — Cardiovascular Diseases'], bio: 'Medical student at Universitat Jaume I and Ernest Breva Award recipient for academic excellence. Research spans cardiovascular epidemiology, translational neuroscience, and digital health innovation. I write, review, and communicate science with the same rigor I bring to the bench.', img: null },
  { name: 'Soham Biren Katlariwala', category: 'Computer Science', orcid: '0009-0008-1178-6543', affils: ['IIT Madras, Chennai, India', 'Synthica Research Group', 'Gujarat Technological University'], bio: 'Interdisciplinary ML researcher affiliated with MIT Critical Data, Missouri S&T, and the Neuroscience Foundation. Specialising in Graph Theory, NeuroAI, and Radiology AI, with published research spanning Yale, UC Berkeley, Texas A&M, and beyond.', img: null },
  { name: 'Abhinav Mortha', category: 'Biology', orcid: '0009-0003-2978-2747', affils: ['Carmel High School, Indiana, USA', 'Synthica Research Group'], bio: 'Junior deeply interested in the interpretation of complex biological data. Having presented at multiple conferences and qualified for ISEF, he guides over 10 students through developing their own research projects.', img: null },
  { name: 'Nicholas Mino', category: 'Computer Science', orcid: '0009-0005-8825-9969', affils: ['Carnegie Mellon University', 'Synthica Research Group', 'Posematic'], bio: 'Sophomore in Carnegie Mellon\'s School of Computer Science, majoring in Artificial Intelligence. Co-founder, CTO, and ML Engineer at Posematic. Interests include machine learning theory, model evaluation, quantum ML, and computer vision.', img: null },
  { name: 'Keerthivasan Radhakrishnan', category: 'Computer Science', orcid: '0009-0003-7476-6949', affils: ['Authenta', 'Synthica Research Group', 'National University of Singapore'], bio: 'Research Engineer — Audio at Authenta, specializing in forensic deepfake detection. Pursuing an MS in Business Analytics from NUS. Interests include Computational Lithography, Trapped Ion experiments, and forensic deepfake detection.', img: null },
  { name: 'K. V. S. Rakesh', category: 'Computer Science', orcid: '0009-0008-1138-9433', affils: ['Independent Researcher', 'Synthica Research Group', 'IIIT Nagpur'], bio: 'Electronics and Communication Engineering graduate from IIIT Nagpur, published Springer researcher, and interdisciplinary thinker. Interests span electronics, semiconductor technology, AI/LLMs, computer vision, neuroscience, and mathematics.', img: null },
  { name: 'Mim Mony', category: 'Computer Science', orcid: '0009-0006-5307-6959', affils: ['International University of Business Agriculture and Technology', 'Synthica Research Group'], bio: 'CSE undergraduate with focus in AI, ML, and NLP. Develops ML models, analyzes complex datasets, and contributes to AI-driven sustainability research. Goal: create impactful AI solutions that support innovation and sustainable development.', img: null },
  { name: 'Clayton Wangsanata', category: 'Economics', orcid: '0009-0002-0242-8812', affils: ['Lambert High School, Suwanee, GA', 'Synthica Research Group'], bio: 'Econometrics and theoretical economics researcher, winner of the Best Abstract award at IJSI 2026. Specializes in auditing algorithmic risk through chaos theory and topological mapping of financial manifold metrics.', img: null },
  { name: 'Lydia Liu', category: 'Economics', orcid: '0009-0002-7616-2738', affils: ['Los Gatos High School, CA', 'San Jose State University', 'MIT'], bio: 'Independent researcher at SJSU specializing in empirical economics and behavioral finance. Builds econometric models and agent-based simulations to study interest rates, housing markets, and investor behavior.', img: gdrive('1UYAG-AXxww_TSpPpCV2G36PkpvhUH-j7') },
  { name: 'Luna (Mai Khanh) Tran', category: 'Humanities', orcid: '0009-0009-3771-9995', affils: ['Concordia International School Hanoi', 'Synthica Research Group', 'Lumiere Education — Oxford University'], bio: 'Sophomore at Concordia International School Hanoi with a deep interest in education. Published in the Oxford Journal of Student Scholarship. Currently collaborating on a research project involving nearly one million students in South Africa.', img: gdrive('1jWWMcgGo-brXoJP2G9CzZ5eETlHNm_MH') },
  { name: 'Ayush Ranjan', category: 'Mathematics', orcid: '0009-0008-2998-0176', affils: ['Oakton High School, Virginia', 'Synthica Research Group', 'The Wharton School'], bio: 'Junior at Oakton High School. Researcher at The Wharton School, stochastically modeling interest rates and their impact on bond portfolios. DECA State Champion in Virginia and global Top 12 for Inspire Youth Journal.', img: gdrive('1d_OXDfUTwYRvtMYOavGUaOEux3ofqEaO') },
  { name: 'Er. Easwaramoorthy Sriram', category: 'Physics', orcid: null, affils: ['Independent Researcher', 'Synthica Research Group'], bio: 'Dedicated engineer and independent researcher specializing in VLSI design, CMOS technology, and advanced semiconductor systems. Technical portfolio spans TFETs, GaN HEMTs, and 6G edge-fed antennas. Former Semiconductor Association Team Lead.', img: null },
  { name: 'Shriya Uttamchandani', category: 'Psychology', orcid: '0009-0007-1334-8267', affils: ['Del Norte High School, San Diego, CA', 'Synthica Research Group'], bio: 'Junior at Del Norte High School deeply interested in neuroscience. Academic work focuses on neurodegenerative disorders, cognitive processes, and emerging approaches to early detection and treatment.', img: gdrive('1drA5rPxLXWaGnYsBrgx5xbujKwIkaXNx') },
  { name: 'Ryan Robert Cramer McNulty', category: 'Economics', orcid: '0009-0006-7209-3340', affils: ['University of California, Santa Barbara', 'Synthica Research Group'], bio: 'Student and researcher at UCSB in the Department of Economics and Accounting. Research focuses on AI in interviews and hiring, sports prediction models, and the impact of migration on the U.S. CPI.', img: null },
  { name: 'Esha Shahbaz', category: 'Chemistry', orcid: '0009-0008-5043-7573', affils: ['GCWUS', 'Synthica Research Group'], bio: 'Biotech student with research interests at the intersection of AI, ML, and healthcare — particularly in diagnostics and de novo drug design. Aims to bridge complex research with clear communication.', img: null },
];

const ASSOCIATE_EDITORS = [
  { name: 'Candace Hon', category: 'Biology', orcid: '0009-0004-4403-0890', affils: ['St. Robert CHS, Ontario, CAN', 'Synthica Research Group'], bio: null, img: gdrive('1Loe-F8fsxfnew5Z5duWHEeMooNaixtnc') },
  { name: 'Syed Hamzah Rizvi', category: 'Computer Science', orcid: '0009-0004-9864-6607', affils: ['West Lafayette Jr/Sr High School', 'MIT Laboratory of Computational Physiology'], bio: 'High school junior with main interests in bio-inspired robotics and cellular mechanics. Works with Professor Celi at MIT on the MIMIC dataset. Made state for science fair, winning a $15k scholarship from the Naval Science Academy.', img: gdrive('1biXAZXhWaiBCcD6WkrlB2k17GOogWpS5') },
  { name: 'Sahil Singh', category: 'Computer Science', orcid: '0009-0008-6764-2784', affils: ['Fulton Science Academy, Alpharetta, GA', 'Georgia Tech'], bio: 'Freshman specializing in machine learning, computer science, and applied mathematics. Working on a biomedical engineering project involving physics-informed neural operators on cardiac health care under a GT mentor.', img: null },
  { name: 'Damaris O. Aregbesola', category: 'Biology', orcid: '0009-0004-5771-938X', affils: ['Thornridge High School, Dolton, IL', 'The Hub — Department of STEM'], bio: 'Nigerian-American student aspiring to major in neuroscience. Through Voice4Brain, creates educational content promoting health, hope, and healing while inspiring others to explore neurology.', img: gdrive('15cyhgRVo4gED3DsK-S5a4Xiq9YAvHsE') },
  { name: 'Abhinav Kothuri', category: 'Biology', orcid: '0009-0002-6320-2980', affils: ['Independence High School, Frisco, TX', 'NEXEDGE Research Lab'], bio: 'High school student focused on biology and healthcare. Project lead at NEXEDGE Research Lab, conducts in-person research with a university professor, and mentors students in research.', img: null },
  { name: 'David Abebe', category: 'Psychology', orcid: '0009-0003-2393-5001', affils: ['Westminster Christian Academy, MO', 'WashU'], bio: 'Freshman specializing in neuroscience and psychology. Founder of MindScroll Health, providing free social media resources for adolescents. Currently working on papers under researchers at WashU and UMSL.', img: null },
  { name: 'Aryan Shah', category: 'Biology', orcid: '0009-0009-5917-7357', affils: ['Dupont Manual High School, Louisville, KY'], bio: 'Senior at duPont Manual High School with a focus on biology research. Multiple years of iGEM experience studying PFAS and conducting wet-lab research in lung cancer.', img: gdrive('1N3QifLjXlV0SX9GJaC0fwwHt8V7lWqQ5') },
  { name: 'Kanav Sah', category: 'Biology', orcid: '0009-0000-6697-7015', affils: ['Round Rock High School, TX'], bio: 'Student specializing in cancer biology and medicinal chemistry. Has conducted independent research examining disease mechanisms and potential therapeutic approaches in oncology.', img: gdrive('1t-h6rmR_NtS1N8coViwJROmPyM_ZGRwT') },
  { name: 'Colin Xu', category: 'Economics', orcid: '0009-0009-0685-8714', affils: ['The Awty International School, TX'], bio: 'High school sophomore interested in climate economics and sustainability. Researching at the Chinese Academy of Sciences studying microbial remediation. Ranked 9th in the U.S. for debate.', img: null },
  { name: 'Danny Zheng', category: 'Computer Science', orcid: '0009-0000-4639-2642', affils: ['The Bronx High School of Science, NY', 'Emory University'], bio: 'Junior at Bronx Science with a strong interest in CS and AI. Research experience at UC Berkeley and NYU. Currently writing a research paper at Emory University.', img: gdrive('1buXpIQ9u3djc7Oj85nUH00zq-BsAIOux') },
  { name: 'Emma Ma', category: 'Chemistry', orcid: '0009-0006-7470-2170', affils: ['Chinese International School, Hong Kong'], bio: 'Sophomore at CISHK interested in chemistry and various expressions of science. Researched autoimmune diseases in pregnancy and pharmaceuticals. Interned at HKU Pharmacy.', img: null },
  { name: 'Terry Ding', category: 'Computer Science', orcid: '0009-0006-3206-8861', affils: ['American High School, CA'], bio: 'Sophomore and founder of ChorusAI, an open-source decentralized distributed LLM server. Also conducting independent ML research rebuilding fundamental trading strategies with modern architectures.', img: null },
  { name: 'Ashub Shafqat', category: 'Computer Science', orcid: '0009-0002-4422-2679', affils: ['University of Agriculture Faisalabad, Pakistan'], bio: 'Software Engineering student with experience in full-stack development and AI systems. Passionate about building impactful, data-driven solutions. Values clarity and structure in research.', img: null },
  { name: 'Matteo Gabriel S. Galgo', category: 'Computer Science', orcid: '0009-0007-0675-5956', affils: ['Tagum City National High School, Philippines'], bio: 'HS10 student-researcher affiliated with international research teams spanning neuroscience and beyond. Has authored and presented work nationally, mentored student research across schools.', img: null },
  { name: 'Mehroze Ismail', category: 'Biology', orcid: '0009-0008-3886-4521', affils: ['King Edward Medical University, Lahore, Pakistan'], bio: 'Medical Graduate from King Edward Medical University. Has cleared USMLE Step 1 and Step 2 CK. Preparing for Residency in the USA with a commitment to research contribution.', img: gdrive('1HqnTE9Spfs4xLfF0Z3nAj0vIg-B4xHOo') },
  { name: 'Axel Hezron G. Base', category: 'Biology', orcid: '0009-0004-9839-936X', affils: ['Quezon City Science High School'], bio: 'Service-oriented student invested in neuroscience, technology, and psychology. Worked in life science research for drug discovery and robotics for agriculture.', img: null },
  { name: 'Sujal Kumar Poddar', category: 'Economics', orcid: '0009-0001-5835-2207', affils: ['Amity University Kolkata, India', 'IJIRT'], bio: 'Undergrad student and founder who has spent years writing, editing, and building things from scratch. Prefers clean, sharp content with no unnecessary fluff.', img: null },
  { name: 'Kevin Yang', category: 'Mathematics', orcid: '0009-0004-2693-7659', affils: ['Canyon Crest Academy, CA'], bio: 'Strong interest in physics, applied mathematics, and stochastic processes. Looking to find practical ways to apply skills developed over the years from math olympiads and competitions.', img: null },
  { name: 'Nazifa Tahseen Gawhar', category: 'Economics', orcid: '0009-0001-2583-8905', affils: ['Singapore International School'], bio: 'Cambridge A Level student with keen diligence in Economics and Business. Ranked top 500 out of 48,000 in the National Economics Olympiad. Received academic distinctions in top international essay competitions including an Amazon publication.', img: null },
  { name: 'Henry Russell', category: 'Mathematics', orcid: '0009-0004-0008-4651', affils: ['Gettysburg Area High School'], bio: 'Writer and researcher. Professional freelance journalist and Research Fellow with Non-Trivial. Has found success in STEM competitions with a TSA National win in Biotech.', img: null },
  { name: 'Muskaan Khaidun', category: 'Biology', orcid: '0009-0002-3751-4147', affils: ['WHSG', 'Synthica Research Group'], bio: null, img: null },
  { name: 'Isabhel Saraza', category: 'Chemistry', orcid: null, affils: ['De La Salle — College of Saint Benilde, Philippines'], bio: 'Researcher and aspiring mechanical engineer focusing on climate technology, biomedical engineering, and AI systems. Projects shortlisted for beVisioneers, ranking Top 5 globally.', img: null },
  { name: 'Shanmuka Gottimukkala', category: 'Computer Science', orcid: '0009-0002-2991-1249', affils: ['Milton High School, GA', 'MIT Critical Data × NSRI'], bio: 'USACO Gold competitor and MIT Critical Data lead. Develops practical systems from CNN-based pollution classifiers to emotion-aware IoT assistants. Bridging global STEM gaps through Telugu Wikipedia contributions.', img: gdrive('1qx3bXupQxCDAZchsYUGg8Tcz5NJUIa-Z') },
  { name: 'Jyoshitaa Mahendrarajan Lavanya', category: 'Biology', orcid: '0009-0007-1179-7755', affils: ['Walnut Grove Secondary School, Langley, Canada'], bio: 'High school junior with a strong interest in biology, neuroscience, and human health. Has explored the effects of Beta-amyloid accumulation in Alzheimer\'s disease.', img: gdrive('1SMiYbdyqj32xeyZAtns52w3leRYeZKXJ') },
  { name: 'Yashasvi Rakesh Haswani', category: 'Chemistry', orcid: '0009-0009-7951-4007', affils: ['G.D. Goenka International School, Surat, India'], bio: 'Grade 12 student with a research-backed interest in chemical engineering. Investigated carbon nanotechnology for oil and chemical spill remediation — selected for the Convergence Journal, one nomination per cohort.', img: null },
  { name: 'Jiwan Kim', category: 'Mathematics', orcid: '0009-0001-8589-0211', affils: ['Chapel Hill High School'], bio: 'Student researcher interested in topology and mathematical linguistics. Research at Seoul National University and UNC Kenan-Flagler. Presented at NCAS@Elon and State/Regional Science Fairs. Nationally ranked archer.', img: null },
  { name: 'Yousef Turk', category: 'Computer Science', orcid: '0009-0006-2307-7627', affils: ['Liwa International School Al Mushrif', 'D*spatch — Founder'], bio: 'Spends his week writing systems on real infrastructure, placing junior researchers on briefs they have to ship, and reading frontier CS papers. The throughline: judgment — what\'s worth shipping, what\'s worth publishing.', img: gdrive('1mOuoHgVwTtpcYF5MKc5jNMRYkPRUz7dl') },
  { name: 'Kinza Khan', category: 'Biology', orcid: '0009-0003-6482-6055', affils: ['Ziauddin University'], bio: 'Recent Human Nutrition graduate. Ambitious, hard-working, and highly work-oriented with a strong ability to collaborate effectively.', img: null },
  { name: 'Saamarth Kalwani', category: 'Computer Science', orcid: '0009-0009-3839-1426', affils: ['Krishna Public School, India', 'Pioneer Academics Research Program'], bio: 'Systems-focused student researcher working at the intersection of AI, sustainability, and real-world problem-solving. Has built a solar-powered automated farming system and conducted research on algorithmic bias.', img: null },
  { name: 'Robert Ryan', category: 'Computer Science', orcid: '0009-0000-9458-9095', affils: ['ACS Athens', 'North Carolina State University'], bio: '17-year-old IB student, ML Engineering intern, and ML research assistant at NC State University. Founder of Informed.', img: gdrive('1Utw0F8Db5SQO3Pnu2G-_MExw6roBrNft') },
  { name: 'Natalie Chee', category: 'Psychology', orcid: '0009-0006-7931-0440', affils: ['Canadian International School of Hong Kong'], bio: 'International harpist and IB candidate with interests in neuropsychology and behavioural sciences. Founded The Synaptic Archive, the first youth magazine bridging neuroscience and psychology.', img: gdrive('1qSWVDPs4t2igK3JgJImpeYCd6thk-xF-') },
  { name: 'Ansh Rao', category: 'Economics', orcid: '0009-0004-7882-4621', affils: ['South Brunswick High School', 'Sports Trinity'], bio: 'Developed research papers with the Federal Reserve and Harvard. Built InternLink, an AI-powered platform for research and internship outreach.', img: null },
  { name: 'Chris Litto', category: 'Physics', orcid: '0009-0001-8583-7672', affils: ['Ocean Lakes High School'], bio: 'Dedicated student with a passion for autonomous systems. Combines DECA and journalism leadership with technical training from NASA-affiliated and MIT programs.', img: gdrive('1hNXUGbr1tGVgarer_GR8x5Qph1TEoF5d') },
  { name: 'Srihan Seemakurty', category: 'Computer Science', orcid: '0009-0009-1260-3742', affils: ['Denmark High School'], bio: 'Microsoft Azure AI, Python, and Data Analytics certified. Experience in financial statement analysis, portfolio management, and NLP. Multiple placements at FBLA Georgia State Leadership Conference.', img: null },
  { name: 'Arjun Vijay Prakash', category: 'Computer Science', orcid: '0009-0004-6835-2069', affils: ['City Montessori School', 'Ashoka University (LGP)'], bio: 'Full-stack developer and technical writer. Building Pilot, an early-stage startup. Lodha Genius scholar. Researching mechanistic interpretability, neurosymbolic AI, and rare disease prediction. INSEF Regional Bronze Medalist.', img: null },
  { name: 'Mohd. Iyaad Dilnawaz Mukadam', category: 'Physics', orcid: '0009-0008-0105-1156', affils: ['Pace Junior Science College, Mumbai, India', 'NSRI Research Program'], bio: 'Passionate young researcher focused on bridging physics, information theory, and emerging technologies with a strong interest in developing original concepts and impactful research.', img: gdrive('1QoaaUbQ-7f7KxTgzLVxzY53hWrlW3Ehy') },
  { name: 'Beede Miracle Chichetaram', category: 'Biology', orcid: '0009-0000-2299-2731', affils: ['University of Abuja', 'African Digital Health Student Network'], bio: 'Student researcher involved in MIT Critical Data × NSRI, with interests in antimicrobial resistance, data-driven approaches, and digital health solutions.', img: gdrive('1C7j-QBfHCwO7sQHHZzFDoetLFdOu-6q6') },
  { name: 'Rahma Naqui', category: 'Computer Science', orcid: '0009-0003-0433-8797', affils: ['Lamrin Tech Skills University, Punjab', 'EcoAction Magazine'], bio: 'Passionate Computer Science student and top ranker at her university. Research writer for EcoAction Magazine. Passionate about AI, Data Science, Psychology, Neuroscience, and Environmental Science.', img: gdrive('1nFHlfMJjc372JBhxxTV21oPMPCfwQaBe') },
  { name: 'Hieu Le', category: 'Computer Science', orcid: '0009-0007-9694-2893', affils: ['Alfred Nobel School'], bio: 'Machine learning researcher with hands-on experience in emotion classification and detection. Operates across the full ML pipeline. Setting sights on reinforcement learning and edge AI.', img: null },
  { name: 'Sai Harshitha Bhogavalli', category: 'Humanities', orcid: '0009-0008-7351-1174', affils: ['Synthica Research Group'], bio: 'Biomedical and AI-focused student researcher with experience in neurovascular analytics, ocular microvascular modeling, and community health leadership. Aims to bridge AI, medicine, and community impact.', img: null },
];

const REVIEW_EDITORS = [
  { name: 'Amna Noman', category: 'Biology', orcid: '0009-0002-0911-2589', affils: ['Salim Habib University'], bio: 'Research Associate at NSRI. Undergraduate thesis focused on the human microbiome. Enjoys exploring ideas in energy, materials, and life sciences and translating them into clear insights.', img: null },
  { name: 'Mrigendra Singh', category: 'Humanities', orcid: '0009-0005-1631-1430', affils: ['W. H. Smith Memorial School'], bio: 'Acclaimed debater, published author featured in The Guardian, and inventor of Finger Guide. Has spoken at the Banaras Lit Fest, completed 7 content writing internships, and published research papers.', img: gdrive('1xSQXN2GrOZBjNshXZ5fmtNSGS9Pvzz1_') },
  { name: 'Sidianna Thay', category: 'Computer Science', orcid: '0009-0000-2416-2635', affils: ['Paragon International University'], bio: null, img: null },
  { name: 'Miftahul Jannah Nowsheen', category: 'Chemistry', orcid: null, affils: [], bio: 'Rising 11th grader from Bangladesh with a deep passion for Chemistry, specifically Organic Chemistry. Aspiring military neurosurgeon with skills in public speaking and advocacy for adolescent mental health.', img: null },
  { name: 'Uttirn Gyan', category: 'Computer Science', orcid: '0009-0009-8169-297X', affils: ['Christ Academy ICSE School, Bengaluru, India'], bio: 'AI researcher with a 99% in ICSE board exams, national recognition in Avinya Entrepreneurship and KISA Debate. Has built GPT-124M, ViT/DeiT, quantum CNNs, cybersecurity systems, and RL environments.', img: gdrive('1owG4hYtPdNdbgPyOneGWIx8vexlvq0Ku') },
  { name: 'Fajil Luhar', category: 'Economics', orcid: '0009-0000-2745-3489', affils: ['Sanskar High School, GJ, India'], bio: 'Independent researcher focused on micro-economics, financial modeling, and applied data analysis. Work explores how businesses scale and allocate capital.', img: null },
  { name: 'Khang Nguyen', category: 'Humanities', orcid: '0009-0007-7057-4981', affils: ['Vinschool, HCMC, Vietnam'], bio: 'High school freshman in Vietnam with an interest in Computer Science and AI/ML. New to research and eager to learn the fundamentals of the research process.', img: null },
  { name: 'Sara Saif', category: 'Psychology', orcid: '0001-0001-2442-8453', affils: ['Kamala Nehru College, University of Delhi'], bio: 'Psychology student with deep interest in psychopathology and neuropsychology. Working toward social impact through roles in youth-led nonprofits.', img: gdrive('1sFAyky-NKJ_S-AiTn-jk8O2_8Lf9YDqP') },
  { name: 'Agastya Turaga', category: 'Computer Science', orcid: '0009-0002-4582-6888', affils: ['South Brunswick High School'], bio: 'Programmed drones in MIT Lincoln Laboratory\'s Beaver Works Program and placed in the top 5% out of 420+ teams in Garden State CTF 2026. Co-founded a STEM nonprofit mentoring middle school robotics students.', img: null },
  { name: 'Insaf Daalache', category: 'Computer Science', orcid: '0009-0000-1271-2003', affils: ['Algeria High School'], bio: 'Student exploring low-level computing through OS development. UNICEF Global Reporter with emphasis on data-driven insights and meaningful impact.', img: null },
  { name: 'Kamrul Hassan', category: 'Physics', orcid: '0009-0008-2990-1036', affils: ['Fyruz Education Services, Bangladesh', 'American Spaces, Bangladesh'], bio: 'Has a strong interest in research, analytical thinking, and scientific inquiry, focusing on evaluating clarity, rigor, and logical structure.', img: null },
  { name: 'Angela Mary Christo', category: 'Psychology', orcid: '0009-0005-6733-6822', affils: ['Sunrise English Private School, Abu Dhabi, UAE'], bio: 'Indian-origin CBSE high school freshman based in the UAE. Pitched an adolescent mental health startup at E-Summit, IIT Bombay, Asia\'s largest entrepreneurship conclave. Project Curriculum researcher.', img: null },
  { name: 'Nusaiba Tazreen Tanisha', category: 'Computer Science', orcid: '0009-0001-8546-7384', affils: ['YWCA Higher Secondary Girls\' School'], bio: 'Winner of 7 medals in the International Robot Olympiad. Former president of her school\'s science club. Expertise in Python and Unity.', img: gdrive('1uJ5aGVtp_Y-mwSFxDff-8NmrsLCMfVkp') },
  { name: 'Wyatt Choe', category: 'Computer Science', orcid: '0009-0004-9989-4717', affils: ['Lambert High School, GA'], bio: 'High school freshman who built JARVIS, a multi-modal AI assistant with voice recognition, gesture control, computer vision, and OS-level integration — solo. Placed eleventh at Science Olympiad regionals against upperclassmen.', img: null },
  { name: 'Hrushikesan Barani', category: 'Mathematics', orcid: '0009-0002-7484-1454', affils: ['Lambert High School, GA'], bio: 'Researcher at Synthica and NSRI, specializing in Infrastructure AI, Astrophysics, and Software Engineering. AWS-certified with award-winning success in FBLA and Science Olympiad.', img: null },
  { name: 'Aneesh Thatta', category: 'Economics', orcid: null, affils: ['Lambert High School, Suwanee, GA'], bio: 'Economics enthusiast contributing to global publications of economic writing for NGOs in Asia. Strong passion for macroeconomic trends.', img: null },
  { name: 'Abhinav Shriram', category: 'Economics', orcid: null, affils: ['Delhi Public School, Bangalore'], bio: null, img: null },
  { name: 'Peyton Wiley', category: 'Economics', orcid: '0009-0009-5114-4032', affils: ['Acellus Academy'], bio: '16-year-old aspiring accountant and musician with a passion for economics, research, writing, and continuous learning.', img: gdrive('1N4ON48Ii1NOrDfvW3A3OHz14Z1p-6-fj') },
  { name: 'Amanjot Parmar', category: 'Psychology', orcid: '0009-0009-0300-0309', affils: ['Middlesex High School'], bio: 'Junior at MHS aspiring to become a physician and researcher. Currently a researcher for anorexia and other eating disorders.', img: gdrive('1Wfgcnu5cnWkGkNncqfcsUImE67nrBJIg') },
  { name: 'Retaj Ashour', category: 'Computer Science', orcid: '0009-0006-6485-1455', affils: ['Sama Winchester College', 'Reze2 El Hanem — President'], bio: 'Top-ranked academic achiever (1st in 10th grade) and NASA Space Apps Global Nominee. CEO and founder of multiple nonprofits combining STEM expertise with international leadership.', img: null },
  { name: 'Beede Marvel', category: 'Chemistry', orcid: '0009-0007-6228-5231', affils: ['University of Abuja', 'African Digital Health Student Network'], bio: 'Aspiring research data analyst with interests in antimicrobial resistance, digital health, and medical technology. Combines scientific curiosity with disciplined leadership through martial arts.', img: gdrive('1UqwXdvlVsCUxSd15wqKcfxT1Xyuh31Fn') },
  { name: 'Maryam', category: 'Chemistry', orcid: '0009-0005-7741-7167', affils: ['Abdul Wali Khan University, Mardan'], bio: 'MPhil in Biochemistry. Academic background in biochemistry and bioinformatics. Focused on learning, sharing knowledge, and contributing to the community.', img: null },
  { name: 'Shritha Repala', category: 'Computer Science', orcid: '0009-0009-1917-2113', affils: ['Synthica Research Group'], bio: 'Rising high school senior from Texas, aspiring Software Engineer specializing in EdTech. Intersects computer programming and AI with cognitive science to expand educational opportunities for neurodivergent individuals.', img: null },
];

/* ── Page ── */
const EditorialBoard = () => (
  <div className="eb-page">
    <section className="page-hero">
      <Navbar />
      <div className="page-hero-content">
        <h1 className="page-hero-title">Editorial <span className="highlight-text">Board</span></h1>
        <p className="page-hero-subtitle">A global team of researchers, scientists, and scholars committed to rigorous, accessible science.</p>
      </div>
    </section>

    {/* Leadership */}
    <section className="eb-section">
      <div className="eb-container">
        <div className="section-badge">Leadership</div>
        <h2 className="section-title">Founding <span className="highlight-text">Team</span></h2>
        <p className="section-subtitle">Synthica is led by a founding team dedicated to removing barriers in academic publishing and research mentorship worldwide.</p>
        <div className="eb-leaders-grid">
          <LeaderCard
            name="Quang Bui"
            role="Founder & Executive Director"
            roleBadge="director"
            orcid="0009-0006-7702-116X"
            affils={['American International School Vienna', 'Synthica Research Group', 'MIT Laboratory of Computational Physiology']}
            bio="Quang Bui is the founder and executive director of Synthica. His mission is to make research approachable to scholars worldwide by providing them with free and low-cost opportunities. He doesn't believe in prioritizing prestige over actual work. To him, real output is what matters."
            img="/assets/editorial/quang.png"
          />
          <LeaderCard
            name="Aaryan Senthilvanan"
            role="Chief Editor"
            roleBadge="chief"
            orcid="0009-0005-7930-2224"
            affils={['S.Y.A.L.I.S Labs', 'International Academy Okma, MI', 'Synthica Research Group']}
            bio="Aaryan Senthilvanan is the Founder of S.Y.A.L.I.S Labs, BrainReach, BravizineOS, and InteractionFormer. His mission is to destigmatize mental health and erase cognitive absolutism through intellectual modalities. He has presented at Stanford, Harvard, and Johns Hopkins with novel protein softwares and is Non-OA Published in Nature."
            img="/assets/editorial/aaryan.jpg"
            isPublished
          />
          <LeaderCard
            name="Kai Ming Ng"
            role="Chief Editor — AI Policy"
            roleBadge="chief"
            orcid="0009-0004-7109-0266"
            affils={['Advisor, Green IO', 'Synthica Research Group']}
            bio="Policy researcher with 14 years of end-to-end experience in research, grant negotiation, programme development, evaluation, and training across NA, EMEA, and APAC regions. 10 years in software, security, and solution architecture spanning NUS, DSTA, DSO, NQSN+, and KPMG."
            img={gdrive('1LJVJj_VlsZf11GOmLFB2amwUll2SD1ZY')}
          />
        </div>
      </div>
    </section>

    {/* Senior Editors */}
    <section className="eb-section eb-section-alt">
      <div className="eb-container">
        <div className="section-badge">Senior Editors</div>
        <h2 className="section-title">Senior Editorial <span className="highlight-text">Board</span></h2>
        <div className="eb-editors-grid">
          {SENIOR_EDITORS.map((e, i) => <EditorCard key={i} {...e} />)}
        </div>
      </div>
    </section>

    {/* Associate Editors */}
    <section className="eb-section">
      <div className="eb-container">
        <div className="section-badge">Associate Editors</div>
        <h2 className="section-title">Associate Editorial <span className="highlight-text">Board</span></h2>
        <div className="eb-editors-grid">
          {ASSOCIATE_EDITORS.map((e, i) => <EditorCard key={i} {...e} />)}
        </div>
      </div>
    </section>

    {/* Review Editors */}
    <section className="eb-section eb-section-alt">
      <div className="eb-container">
        <div className="section-badge">Review Editors</div>
        <h2 className="section-title">Review Editorial <span className="highlight-text">Board</span></h2>
        <div className="eb-editors-grid">
          {REVIEW_EDITORS.map((e, i) => <EditorCard key={i} {...e} />)}
        </div>
      </div>
    </section>

    {/* Journal CTA */}
    <section className="eb-journal-cta">
      <div className="eb-container" style={{ textAlign: 'center' }}>
        <p className="eb-cta-vol">Synthica Journal — Volume 1, Edition 1</p>
        <h2 className="eb-cta-title">Ready to submit your research?</h2>
        <p className="eb-cta-sub">Read the full author guidelines before submitting. Synthica Journal is free to publish and among the most selective venues for emerging scholars.</p>
        <div className="eb-cta-btns">
          <Link to="/journal" className="eb-cta-primary">Read Author Guidelines</Link>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdIdBbXG0TQcifO-Dafb1b7_c9qo6iWbLj-ZfOQmHGIPs59VA/viewform?fbzx=-1610712300921195434" target="_blank" rel="noopener noreferrer" className="eb-cta-secondary">Submit a Manuscript</a>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default EditorialBoard;
