import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SUBMIT_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdIdBbXG0TQcifO-Dafb1b7_c9qo6iWbLj-ZfOQmHGIPs59VA/viewform?fbzx=-1610712300921195434';

const TOC = [
  { id: 'scope',       label: '1. Scope & Aims' },
  { id: 'criteria',   label: '2. Editorial Criteria' },
  { id: 'types',      label: '3. Article Types' },
  { id: 'preparation',label: '4. Manuscript Preparation', children: [
    { id: 'structure', label: '4.1 Structure & Format' },
    { id: 'language',  label: '4.2 Language & Style' },
    { id: 'length',    label: '4.3 Length Requirements' },
    { id: 'figures',   label: '4.4 Figures & Tables' },
    { id: 'refs',      label: '4.5 References' },
  ]},
  { id: 'stats',      label: '5. Statistical Reporting' },
  { id: 'data',       label: '6. Data & Code Availability' },
  { id: 'ethics',     label: '7. Ethical Standards' },
  { id: 'ai',         label: '8. AI Disclosure Policy' },
  { id: 'authorship', label: '9. Authorship' },
  { id: 'interests',  label: '10. Competing Interests' },
  { id: 'review',     label: '11. Peer Review Process' },
  { id: 'submit',     label: '12. Submission' },
  { id: 'access',     label: '13. Open Access & Licensing' },
  { id: 'contact',    label: '14. Contact' },
];

const Journal = () => {
  const [active, setActive] = useState('scope');
  const mainRef = useRef(null);

  useEffect(() => {
    const sections = document.querySelectorAll('.jn-section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="jn-page">
      {/* Hero */}
      <section className="page-hero jn-hero">
        <Navbar />
        <div className="page-hero-content jn-hero-content">
          <p className="jn-vol">Volume 1 &middot; Edition 1 &middot; 2026</p>
          <h1 className="page-hero-title">Author Guidelines &amp;<br />Submission Instructions</h1>
          <p className="page-hero-subtitle">
            Synthica Journal &mdash; an open-access, peer-reviewed publication committed to rigorous,
            interdisciplinary scientific inquiry.
          </p>
          <div className="jn-badges">
            <span className="jn-badge">Double-Blind Peer Review</span>
            <span className="jn-badge">Open Access</span>
            <span className="jn-badge">No Article Processing Charges</span>
          </div>
        </div>
      </section>

      {/* Layout */}
      <div className="jn-layout">
        {/* Sidebar */}
        <aside className="jn-sidebar">
          <p className="jn-toc-label">Contents</p>
          <nav className="jn-toc">
            {TOC.map((item) => (
              <div key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`jn-toc-link${active === item.id ? ' active' : ''}`}
                  onClick={(e) => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  {item.label}
                </a>
                {item.children && item.children.map((c) => (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    className={`jn-toc-link jn-toc-indent${active === c.id ? ' active' : ''}`}
                    onClick={(e) => { e.preventDefault(); document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
          <a href={SUBMIT_URL} target="_blank" rel="noopener noreferrer" className="jn-sidebar-submit">
            Submit a Manuscript
          </a>
        </aside>

        {/* Main */}
        <main className="jn-main" ref={mainRef}>

          {/* First edition notice */}
          <div className="jn-notice">
            <strong>Volume 1, Edition 1 &mdash; Inaugural Edition:</strong> The first edition of{' '}
            <em>Synthica Journal</em> accepts manuscripts across all scientific, social-scientific, and humanities
            disciplines without restriction. Authors are encouraged to submit work on any topic of scholarly merit.{' '}
            <strong>Please note:</strong> subsequent editions will be shaped in part by the research areas that attract
            the greatest readership and community engagement from this inaugural issue. Authors are therefore encouraged
            to consider the breadth and accessibility of their work as part of their submission.
          </div>

          {/* 1 */}
          <section id="scope" className="jn-section">
            <h2 className="jn-h2">1. Scope and Aims of the Journal</h2>
            <p><em>Synthica Journal</em> is the flagship peer-reviewed publication of the Synthica Research Group, an international, student-led research organization dedicated to democratizing access to rigorous scientific inquiry and scholarly publication. The journal publishes original research, reviews, and perspectives that advance understanding across the full spectrum of academic disciplines, including but not limited to the natural sciences, computational sciences, social sciences, economics, humanities, and interdisciplinary fields.</p>
            <p>The journal&apos;s primary aims are:</p>
            <ul className="jn-list">
              <li>To provide a high-quality, open-access publication venue accessible to emerging and independent researchers globally, without the financial barriers imposed by article processing charges;</li>
              <li>To uphold the highest standards of academic integrity, methodological rigor, and transparency in published scholarship;</li>
              <li>To support the development of the next generation of scientific authors through constructive, expert peer review; and</li>
              <li>To cultivate an international community of scholars committed to the belief that the quality of work, rather than institutional prestige, is the proper measure of scientific contribution.</li>
            </ul>
            <p><em>Synthica Journal</em> does not discriminate on the basis of institutional affiliation, career stage, nationality, or academic credentials. All submissions are evaluated solely on their intellectual merit.</p>
          </section>

          {/* 2 */}
          <section id="criteria" className="jn-section">
            <h2 className="jn-h2">2. Editorial Criteria</h2>
            <p>The editors apply the following criteria when evaluating all submitted manuscripts. A manuscript must satisfy all criteria to proceed to peer review.</p>
            <h3 className="jn-h3">2.1 Originality</h3>
            <p>Manuscripts must present original work not previously published and not under review elsewhere. Findings must constitute a substantive and novel contribution to the relevant field. Incremental studies that do not clearly advance current understanding will not be considered.</p>
            <h3 className="jn-h3">2.2 Scientific and Scholarly Rigor</h3>
            <p>The methods employed must be appropriate to the research question, clearly described, and sufficient for independent replication or verification. Claims must be supported by evidence of appropriate quality and quantity. The analysis must be free of logical errors, unsubstantiated generalizations, and circular reasoning.</p>
            <h3 className="jn-h3">2.3 Significance and Impact</h3>
            <p>The editors assess whether the work addresses a meaningful and well-motivated question within its field. Research of narrow interest that does not advance broader knowledge will typically not be accepted, regardless of technical execution. Authors must make explicit the significance of their findings and why they matter.</p>
            <h3 className="jn-h3">2.4 Clarity and Accessibility</h3>
            <p>All manuscripts must be written so that their central claims and evidence are comprehensible to a scientifically literate reader outside the authors&apos; immediate specialty. The abstract must state the principal finding unambiguously. Manuscripts that cannot be evaluated due to fundamental language difficulties will be returned before editorial assessment.</p>
            <h3 className="jn-h3">2.5 Completeness</h3>
            <p>Manuscripts must present a complete and self-contained body of work. Submissions that present preliminary or partial results, or that defer critical elements to future publications, will not be considered.</p>
            <div className="jn-callout warning">
              <strong>Note on Selectivity:</strong> <em>Synthica Journal</em> is free to publish for all authors. However, it is correspondingly highly selective. The absence of publication fees reflects our commitment to equitable access, not a relaxation of editorial standards. Authors should expect the same level of scrutiny as at a fee-charging peer-reviewed journal of comparable standing. The majority of initial submissions will receive desk rejection.
            </div>
          </section>

          {/* 3 */}
          <section id="types" className="jn-section">
            <h2 className="jn-h2">3. Article Types</h2>
            <p><em>Synthica Journal</em> accepts the following manuscript categories. Authors must indicate article type in their submission and conform to the corresponding requirements.</p>
            <div className="jn-table-wrap">
              <table className="jn-table">
                <thead>
                  <tr><th>Article Type</th><th>Main Text</th><th>Abstract</th><th>References</th><th>Display Items</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Original Research Article</strong></td><td>3,000–5,000 words</td><td>250 words max</td><td>50 max</td><td>8 max</td></tr>
                  <tr><td><strong>Review Article</strong></td><td>4,000–8,000 words</td><td>300 words max</td><td>80 max</td><td>10 max</td></tr>
                  <tr><td><strong>Short Communication</strong></td><td>1,500–2,500 words</td><td>150 words max</td><td>25 max</td><td>4 max</td></tr>
                  <tr><td><strong>Perspective / Opinion</strong></td><td>2,000–3,500 words</td><td>200 words max</td><td>40 max</td><td>4 max</td></tr>
                  <tr><td><strong>Correspondence</strong></td><td>400–1,000 words</td><td>Not required</td><td>10 max</td><td>1 max</td></tr>
                </tbody>
              </table>
            </div>
            <p className="jn-note">Word counts refer to the main body text exclusive of the abstract, figure legends, methods section, acknowledgements, and reference list.</p>
            <h3 className="jn-h3">3.1 Original Research Article</h3>
            <p>Presents primary empirical, computational, theoretical, or analytical findings. Must include a clear statement of the research question, methodology sufficient for reproducibility, presentation and analysis of results, and discussion in the context of existing literature.</p>
            <h3 className="jn-h3">3.2 Review Article</h3>
            <p>Provides a comprehensive, critical synthesis of a defined body of literature. Reviews must offer analytical insight, identify gaps in current knowledge, and propose directions for future inquiry. Systematic reviews and meta-analyses must comply with PRISMA reporting guidelines.</p>
            <h3 className="jn-h3">3.3 Short Communication</h3>
            <p>Presents a focused, self-contained finding of immediate significance. Short Communications are not suitable for preliminary or speculative findings; methodology must be fully described and conclusions well supported.</p>
            <h3 className="jn-h3">3.4 Perspective and Opinion</h3>
            <p>Presents a scholarly viewpoint, conceptual synthesis, or expert commentary. Must be evidence-based, clearly reasoned, and referenced. Does not require original empirical data but must engage substantively with the existing literature.</p>
            <h3 className="jn-h3">3.5 Correspondence</h3>
            <p>May respond to previously published work in <em>Synthica Journal</em> or raise a brief point of scholarly relevance. Must be focused, professional in tone, and substantiated by evidence or reasoning.</p>
          </section>

          {/* 4 */}
          <section id="preparation" className="jn-section">
            <h2 className="jn-h2">4. Manuscript Preparation</h2>

            <h3 className="jn-h3" id="structure">4.1 Structure and Format</h3>
            <h4 className="jn-h4">Title</h4>
            <p>Must be concise, informative, and accurate — stating the main finding or contribution, not merely the subject matter. Non-standard abbreviations, trademarked names, and unnecessary punctuation are not permitted. Recommended maximum: 20 words.</p>
            <h4 className="jn-h4">Author Names and Affiliations</h4>
            <p>Full legal names must be used. Each author must have one or more affiliations. The corresponding author must be designated explicitly. ORCID identifiers are required for all authors; registration at <a href="https://orcid.org" target="_blank" rel="noopener noreferrer">orcid.org</a> is required prior to submission.</p>
            <h4 className="jn-h4">Abstract</h4>
            <p>A single, unstructured paragraph stating: (i) the research question or objective; (ii) the principal methods; (iii) the key findings; and (iv) the principal interpretation or significance. Must be self-contained and contain no citations, undefined abbreviations, or references to figures or tables.</p>
            <h4 className="jn-h4">Keywords</h4>
            <p>Authors must provide five to eight keywords accurately reflecting the content and discipline. Standard controlled vocabulary (e.g., MeSH terms for biomedical submissions) is recommended.</p>
            <h4 className="jn-h4">Introduction</h4>
            <p>Must establish context, define the research problem with precision, explain why existing knowledge is insufficient, and state the specific aims or hypotheses. The final paragraph must state clearly what the manuscript reports.</p>
            <h4 className="jn-h4">Methods</h4>
            <p>Must provide sufficient detail for independent replication. All materials, instruments, computational tools, databases, and protocols must be identified. Statistical methods must be fully described. The Methods section appears after the Discussion and reference list and is not included in the main body word count.</p>
            <h4 className="jn-h4">Results</h4>
            <p>Must present findings in a logical and systematic order. Should be objective without interpretation. Figures and tables must be referenced in sequence; text should highlight key findings without re-stating all data in display items.</p>
            <h4 className="jn-h4">Discussion</h4>
            <p>Must interpret results in light of the stated aims and existing literature, address significance and limitations, consider alternative interpretations, and not overstate the generalizability of findings.</p>
            <h4 className="jn-h4">Acknowledgements</h4>
            <p>May acknowledge individuals who contributed but do not meet authorship criteria, and sources of funding. Anonymous peer reviewers and editors must not be acknowledged by description.</p>

            <h3 className="jn-h3" id="language">4.2 Language and Style</h3>
            <p>All manuscripts must be submitted in English. British and American English are both acceptable, provided the chosen convention is applied consistently throughout.</p>
            <h4 className="jn-h4">Precision and Clarity</h4>
            <p>Language must be precise, unambiguous, and appropriate to scholarly discourse. Vague descriptors should be avoided. Claims must be stated with appropriate epistemic hedging. The word &ldquo;prove&rdquo; must not be used in relation to empirical findings; findings are &ldquo;demonstrated,&rdquo; &ldquo;shown,&rdquo; or &ldquo;supported&rdquo; by evidence.</p>
            <h4 className="jn-h4">Technical Terminology and Abbreviations</h4>
            <p>Technical terms should be defined at first use in both the abstract and the main text. Non-standard abbreviations must be spelled out at first use. Abbreviations must not appear in the title or as the first word of the abstract. Authors should minimize abbreviations to preserve readability for interdisciplinary readers.</p>
            <h4 className="jn-h4">Language Preparation for Non-Native English Authors</h4>
            <p>Authors for whom English is not a first language are strongly encouraged to seek language editing prior to submission. Manuscripts will not be rejected solely on the basis of language quality; however, a manuscript that cannot be evaluated for intellectual content due to fundamental language difficulties will be returned for revision before any editorial assessment can proceed.</p>
            <h4 className="jn-h4">Inclusive Language</h4>
            <p>Authors must use language that is inclusive and respectful in its treatment of all individuals and groups. Language that stereotypes, stigmatizes, or demeans any individual or group on any basis is not acceptable.</p>

            <h3 className="jn-h3" id="length">4.3 Length Requirements</h3>
            <p>Word counts refer to the main body text, inclusive of in-text citations, captions within the main body, and embedded tables — exclusive of the title, author list, abstract, keywords, acknowledgements, reference list, Methods section, figure legends, and supplementary materials. Authors must state the word count in the cover communication. Manuscripts that substantially exceed stated limits will be returned prior to review.</p>

            <h3 className="jn-h3" id="figures">4.4 Figures, Tables, and Illustrations</h3>
            <h4 className="jn-h4">General Requirements</h4>
            <p>All display items must be cited in sequence. Each must have a self-contained legend beginning with a concise title sentence. For initial submission, figures may be embedded within the manuscript. For final submissions, separate files at the required resolution are required: 1,200 dpi for line art; 600 dpi for combination figures; 300 dpi for photographs. Figures must be designed to 85 mm (single column) or 175 mm (double column) width. Minimum font size: 7 pt.</p>
            <h4 className="jn-h4">Color Figures and Accessibility</h4>
            <p>Figures must retain interpretability when printed in greyscale. Where color distinguishes data series, additional non-color differentiators (shape, pattern) must be used to ensure accessibility for readers with color vision deficiencies.</p>
            <h4 className="jn-h4">Integrity of Figures</h4>
            <p>Digital images must not be altered in any way that misrepresents the original data — including selective enhancement, removal, addition, or rearrangement of features, or combination of images from different conditions without explicit disclosure. Authors must retain all original, unprocessed data and be prepared to provide them upon request.</p>

            <h3 className="jn-h3" id="refs">4.5 References and Citations</h3>
            <p><em>Synthica Journal</em> uses numbered citations: sequential Arabic numerals in superscript, in the order of first appearance, after punctuation. The reference list must include only works cited in the manuscript.</p>
            <div className="jn-example">
              <p><strong>Journal article:</strong> Surname, A. B., Surname, C. D. &amp; Surname, E. F. Title of article in sentence case. <em>J. Name Abbrev.</em> <strong>Vol</strong>, first–last page (Year). https://doi.org/xxxxx</p>
              <p><strong>Book chapter:</strong> Surname, A. B. Chapter title. in <em>Book Title</em> (eds Editor, A. B. &amp; Editor, C. D.) first–last page (Publisher, Year).</p>
              <p><strong>Preprint:</strong> Surname, A. B. &amp; Surname, C. D. Title. Preprint at https://doi.org/xxxxx (Year).</p>
            </div>
            <p>Journal names must be abbreviated per ISO 4. Volume numbers are bold. Page ranges use an en dash. DOIs must be included for all references that have them.</p>
          </section>

          {/* 5 */}
          <section id="stats" className="jn-section">
            <h2 className="jn-h2">5. Statistical Reporting</h2>
            <p>The appropriate and transparent reporting of statistical analyses is essential to the credibility and reproducibility of published research. Authors must comply with the following requirements:</p>
            <ul className="jn-list">
              <li>All statistical tests must be identified by name and justified where non-standard choices are made.</li>
              <li>For all tests, the following must be reported: test statistic, degrees of freedom where applicable, exact <em>p</em>-value, effect size with confidence interval, and sample size(s). Reporting <em>p</em> &lt; 0.05 without an exact value is not acceptable.</li>
              <li>Authors must distinguish between pre-specified hypotheses and exploratory analyses. Post-hoc analyses must be clearly identified as such.</li>
              <li>Correction for multiple comparisons must be addressed where applicable; the method must be stated and justified.</li>
              <li>All descriptive statistics must be accompanied by appropriate measures of variability (standard deviation, interquartile range, confidence interval). The metric reported must be defined in figure legends or table footnotes.</li>
              <li>For computational and machine learning work, evaluation metrics, training/validation splits, cross-validation procedures, and baseline comparisons must be fully specified.</li>
            </ul>
            <p>Manuscripts in which the statistical analysis is unclear, incomplete, or inappropriate may be returned to authors or rejected at editorial review.</p>
          </section>

          {/* 6 */}
          <section id="data" className="jn-section">
            <h2 className="jn-h2">6. Data and Code Availability</h2>
            <h3 className="jn-h3">6.1 Data Availability</h3>
            <p>Authors must include a <strong>Data Availability Statement</strong> specifying where the data supporting the results can be found, the conditions of access, and any accession numbers, repository names, and DOIs for deposited datasets. Statements of the form &ldquo;data are available upon request&rdquo; are strongly discouraged and will only be considered acceptable where a specific contact point, clear access procedure, and legitimate reason for non-deposition are provided.</p>
            <p>Authors are strongly encouraged to deposit all supporting data in an appropriate public repository (e.g., Zenodo, Figshare, Dryad, OSF, or a discipline-specific repository) and to provide the corresponding DOI.</p>
            <h3 className="jn-h3">6.2 Code Availability</h3>
            <p>Where custom code was central to the findings, it must be made available to reviewers and, upon acceptance, to readers. Code must be deposited in a version-controlled, DOI-minting repository (e.g., GitHub with Zenodo archiving, Code Ocean, or equivalent) and cited in the reference list. Code must be deposited prior to submission and accessible to reviewers during peer review; manuscripts for which required code cannot be accessed during review may be declined.</p>
          </section>

          {/* 7 */}
          <section id="ethics" className="jn-section">
            <h2 className="jn-h2">7. Ethical Standards and Research Integrity</h2>
            <h3 className="jn-h3">7.1 Research Involving Human Participants</h3>
            <p>All research involving human participants must have been conducted in accordance with the ethical principles of the Declaration of Helsinki (2013 revision) or equivalent national and institutional guidelines. Authors must state in the Methods section the name of the ethics committee or IRB that approved the study and the approval reference number. The nature of consent obtained must also be stated.</p>
            <h3 className="jn-h3">7.2 Research Involving Animals</h3>
            <p>All research involving vertebrates or regulated invertebrates must comply with applicable institutional, national, and international guidelines. Authors must state the IACUC or equivalent approval, including committee name and reference number. Studies involving animals must be reported in accordance with the ARRIVE 2.0 guidelines.</p>
            <h3 className="jn-h3">7.3 Plagiarism and Fabrication</h3>
            <p><em>Synthica Journal</em> has a zero-tolerance policy toward plagiarism, data fabrication, data falsification, and selective reporting of results. All submitted manuscripts are subject to computational plagiarism screening. Any manuscript found to contain plagiarized content will be immediately rejected and the matter reported to the relevant institution.</p>
            <h3 className="jn-h3">7.4 Reporting Standards</h3>
            <p>Authors must adhere to established reporting guidelines appropriate to their study design, including CONSORT (randomized controlled trials), STROBE (observational studies), PRISMA (systematic reviews), ARRIVE 2.0 (animal research), CARE (case reports), and TRIPOD (prediction models). Completed checklists should be included as supplementary material.</p>
          </section>

          {/* 8 */}
          <section id="ai" className="jn-section">
            <h2 className="jn-h2">8. Artificial Intelligence and Large Language Model Disclosure</h2>
            <h3 className="jn-h3">8.1 Disclosure Requirement</h3>
            <p>If any AI tool was used to generate, substantially revise, or assist in structuring any portion of the manuscript text, authors must include a statement in the Methods section specifying: (i) the tool(s) used; (ii) the version or date of use; and (iii) the nature of the use. AI-assisted copy editing for minor grammatical corrections does not require disclosure.</p>
            <h3 className="jn-h3">8.2 AI and Authorship</h3>
            <p>AI tools and LLMs may not be listed as authors. Authorship confers intellectual responsibility, accountability, and the capacity to give or withhold consent — attributes that AI systems do not possess. Authors are fully responsible for all content generated with AI assistance.</p>
            <h3 className="jn-h3">8.3 AI-Generated Images</h3>
            <p>Images generated by AI systems (including DALL-E, Midjourney, Stable Diffusion, Adobe Firefly, or equivalent) are not acceptable as figures or illustrations in submitted manuscripts, regardless of the degree of post-processing. Scientific figures must be derived from actual data, experimental observation, or original illustration by the authors.</p>
            <h3 className="jn-h3">8.4 Verification Responsibility</h3>
            <p>Authors bear full responsibility for the accuracy of any text or analysis produced with AI assistance. LLMs are known to generate plausible-sounding but factually incorrect statements and fabricated references. Authors must verify all factual claims, citations, and numerical values independently.</p>
          </section>

          {/* 9 */}
          <section id="authorship" className="jn-section">
            <h2 className="jn-h2">9. Authorship and Contributor Roles</h2>
            <h3 className="jn-h3">9.1 Criteria for Authorship</h3>
            <p>Each listed author must have: (i) made a substantial contribution to the conception, design, acquisition, analysis, or interpretation of the work; (ii) participated in drafting or critically revising the manuscript for important intellectual content; (iii) approved the final version; and (iv) agreed to be accountable for all aspects of the work. Honorary authorship constitutes a breach of publishing ethics and is not acceptable.</p>
            <h3 className="jn-h3">9.2 Corresponding Author</h3>
            <p>One author must be designated as corresponding author and is responsible for all communication with the editorial office and for confirming that all co-authors have approved the submission. The corresponding author&apos;s ORCID iD is required at submission.</p>
            <h3 className="jn-h3">9.3 Author Contribution Statement</h3>
            <p>All manuscripts with two or more authors must include an Author Contribution Statement specifying the contribution of each named author. Authors are encouraged to use the <a href="https://credit.niso.org" target="_blank" rel="noopener noreferrer">CRediT (Contributor Roles Taxonomy)</a> framework, which defines fourteen standardized roles including Conceptualization, Methodology, Investigation, Formal Analysis, Writing – Original Draft, and Writing – Review &amp; Editing.</p>
          </section>

          {/* 10 */}
          <section id="interests" className="jn-section">
            <h2 className="jn-h2">10. Competing Interests</h2>
            <p>All authors must declare any interests, financial or otherwise, that could influence or could be perceived to influence the conduct or reporting of the work. A dedicated &ldquo;Competing Interests&rdquo; statement must be included in the manuscript and provided at submission. A declaration that no competing interests exist is equally required where this is the case.</p>
            <p>Competing interests include current or recent employment, consultancy, or advisory roles with relevant organizations; ownership of stocks or equity; receipt of grants, honoraria, or payments; patent applications; and personal, professional, or ideological relationships that could bias the presentation of results. The existence of a competing interest does not disqualify a manuscript from consideration — full and transparent disclosure enables readers and reviewers to evaluate the work appropriately.</p>
          </section>

          {/* 11 */}
          <section id="review" className="jn-section">
            <h2 className="jn-h2">11. Peer Review Process</h2>
            <div className="jn-callout info">
              <strong>Double-Blind Peer Review:</strong> <em>Synthica Journal</em> operates a double-blind peer review process for all article types. Neither the authors nor the reviewers are aware of each other&apos;s identities at any stage of the review process. Authors must ensure their manuscript contains no identifying information (see Section 11.2).
            </div>
            <h3 className="jn-h3">11.1 Editorial Assessment</h3>
            <p>All manuscripts undergo an initial administrative check confirming compliance with submission requirements. Manuscripts that pass are assessed by a Senior or Chief Editor, who evaluates whether they meet the journal&apos;s editorial criteria on the basis of the abstract, introduction, and principal results. Manuscripts that are clearly outside scope, of insufficient novelty, or that contain fundamental methodological flaws may be rejected without external review.</p>
            <h3 className="jn-h3">11.2 Anonymization Requirements</h3>
            <p>To facilitate double-blind review, authors must prepare a blinded manuscript containing no identifying information. Specifically: author names, affiliations, and ORCID identifiers must be removed; references to authors&apos; own prior work must be written in the third person; funding sources that could identify the authors&apos; institution must be removed; file metadata must not contain identifying information; and supplementary materials must also be anonymized.</p>
            <h3 className="jn-h3">11.3 External Peer Review</h3>
            <p>Manuscripts that pass initial assessment are sent to a minimum of two independent external reviewers. Reviewers recommend one of: Accept; Minor Revision; Major Revision; Reject. The final decision rests with the handling editor, who considers reviewer reports and may draw on editorial board input.</p>
            <h3 className="jn-h3">11.4 Author Response to Reviewers</h3>
            <p>Authors invited to revise must submit a revised version accompanied by a detailed, point-by-point response to each reviewer comment. Where authors disagree with a comment, they must provide a detailed scientific justification. Revisions must be completed within the timeframe specified in the decision letter; extensions must be requested from the editorial office in advance.</p>
            <h3 className="jn-h3">11.5 Appeals</h3>
            <p>Authors may appeal a rejection decision on scientific grounds within 30 days by contacting the editorial office. Appeals must identify specific factual errors in the reviewer reports or editorial assessment and may not simply re-argue the scientific case. The outcome of an appeal is communicated by the Chief Editor and is final.</p>
            <h3 className="jn-h3">11.6 Estimated Timeline</h3>
            <div className="jn-table-wrap">
              <table className="jn-table jn-table-two">
                <thead><tr><th>Stage</th><th>Estimated Duration</th></tr></thead>
                <tbody>
                  <tr><td>Administrative check</td><td>1–3 business days</td></tr>
                  <tr><td>Initial editorial assessment</td><td>2–4 weeks</td></tr>
                  <tr><td>Reviewer recruitment and review</td><td>4–8 weeks</td></tr>
                  <tr><td>First decision after external review</td><td>8–14 weeks from submission</td></tr>
                  <tr><td>Revised manuscript decision</td><td>4–8 weeks from resubmission</td></tr>
                </tbody>
              </table>
            </div>
            <p className="jn-note">These timelines are estimates. Authors may contact the editorial office for a status update if they have not received a decision within the periods indicated above.</p>
          </section>

          {/* 12 */}
          <section id="submit" className="jn-section">
            <h2 className="jn-h2">12. Submission Process</h2>
            <h3 className="jn-h3">12.1 Pre-Submission Checklist</h3>
            <ul className="jn-list">
              <li>The manuscript has not been published previously and is not currently under consideration elsewhere;</li>
              <li>The manuscript conforms to the appropriate article type specifications (Section 3);</li>
              <li>The blinded manuscript file contains no author-identifying information (Section 11.2);</li>
              <li>All authors are listed with full names, affiliations, and ORCID identifiers on the separate title page;</li>
              <li>The abstract does not exceed the word limit and contains no citations or undefined abbreviations;</li>
              <li>Five to eight keywords are provided;</li>
              <li>All references are formatted in accordance with Section 4.5 and include DOIs where available;</li>
              <li>All figures and tables are cited in sequence and accompanied by self-contained legends;</li>
              <li>A Data Availability Statement and (if applicable) a Code Availability statement are included;</li>
              <li>An Author Contribution Statement is included for manuscripts with two or more authors;</li>
              <li>A Competing Interests declaration is included for all authors;</li>
              <li>All required ethics statements are included in the Methods section; and</li>
              <li>AI tool use is disclosed, if applicable.</li>
            </ul>
            <h3 className="jn-h3">12.2 How to Submit</h3>
            <p>All manuscripts must be submitted via the official Synthica Journal submission form. Submissions will not be accepted by email or through any other channel. Accepted file formats: Microsoft Word (.docx) or PDF. LaTeX submissions must also include a compiled PDF.</p>
            <div className="jn-submit-block">
              <p className="jn-submit-label">Official Submission Portal &mdash; Volume 1, Edition 1</p>
              <a href={SUBMIT_URL} target="_blank" rel="noopener noreferrer" className="jn-submit-main-btn">
                Open Full Form
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <p className="jn-submit-note">By submitting a manuscript, authors confirm that all co-authors have approved the submission, that the work is original and not under consideration elsewhere, and that the submission complies fully with these guidelines.</p>
            </div>

            <div className="jn-form-embed">
              <p className="jn-form-label">Submit directly below &mdash; no account required</p>
              <div className="jn-form-wrap">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSdIdBbXG0TQcifO-Dafb1b7_c9qo6iWbLj-ZfOQmHGIPs59VA/viewform?embedded=true"
                  width="100%"
                  height="800"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  title="Synthica Journal Manuscript Submission Form"
                  style={{ border: 'none', borderRadius: '12px', display: 'block' }}
                >
                  Loading form&hellip;
                </iframe>
              </div>
            </div>
          </section>

          {/* 13 */}
          <section id="access" className="jn-section">
            <h2 className="jn-h2">13. Open Access and Licensing</h2>
            <h3 className="jn-h3">13.1 Open Access Policy</h3>
            <p>All articles published in <em>Synthica Journal</em> are made immediately and permanently available without charge to readers worldwide. The journal does not impose subscription fees, access charges, or any other financial barrier to the reading or sharing of published content.</p>
            <h3 className="jn-h3">13.2 Article Processing Charges</h3>
            <p><em>Synthica Journal</em> does not charge article processing charges (APCs), submission fees, or page charges of any kind. Publication is free for all authors, regardless of institutional affiliation, geographic location, or funding status. No author will ever be required to pay to publish in this journal.</p>
            <h3 className="jn-h3">13.3 Licensing</h3>
            <p>All published articles are distributed under the Creative Commons Attribution 4.0 International license (CC BY 4.0). Authors retain copyright in their work under this license. Readers are free to share and adapt the material for any purpose provided appropriate credit is given.</p>
            <h3 className="jn-h3">13.4 Preprint Policy</h3>
            <p>Authors are encouraged to post preprints to recognized servers (e.g., arXiv, bioRxiv, SSRN, OSF Preprints) prior to or concurrent with submission. Preprint posting is not considered prior publication and will not disqualify a manuscript from consideration. Authors must disclose the existence and location of any preprint at the time of submission.</p>
          </section>

          {/* 14 */}
          <section id="contact" className="jn-section">
            <h2 className="jn-h2">14. Contact and Editorial Office</h2>
            <p>Queries regarding submission requirements, the status of a manuscript under review, or any other aspect of the editorial process should be directed to:</p>
            <div className="jn-contact-block">
              <p><strong>Synthica Journal Editorial Office</strong></p>
              <p>Email: <a href="mailto:quang@synthica.org">quang@synthica.org</a></p>
              <p>Website: <a href="https://synthica.org" target="_blank" rel="noopener noreferrer">synthica.org</a></p>
              <p>Editorial Board: <Link to="/editorial-board">View Full Editorial Board</Link></p>
            </div>
            <p>Authors are requested to allow a minimum of five business days for a response to general correspondence before following up.</p>
            <p className="jn-note" style={{ marginTop: '2rem' }}>These guidelines are effective for Volume 1, Edition 1 (2026). <em>Synthica Journal</em> reserves the right to update these guidelines for subsequent editions. Any changes will apply only to manuscripts submitted after the date of the update.</p>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Journal;
