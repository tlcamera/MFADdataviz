const frameworks = [
  {
    id: "competitive-landscape",
    title: "Competitive Landscape Map",
    shortLabel: "Landscape Map",
    whatBest: "Shows clusters of similar competitors and reveals crowded market zones versus open territory.",
    useWhen:
      "Use this when your thesis needs to position itself against direct and indirect alternatives using two clear axes.",
    promptHint:
      "Decide which two qualities matter most on the x and y axes, then place competitors and your concept where they belong.",
    outputFocus: "market position and whitespace",
    example: "landscape"
  },
  {
    id: "radar-chart",
    title: "Radar / Spider Chart",
    shortLabel: "Radar Chart",
    whatBest: "Compares several attributes at once so strengths and weaknesses become visible across dimensions.",
    useWhen:
      "Use this when your project must compare itself with others across multiple factors such as trust, cost, speed, and accessibility.",
    promptHint:
      "Choose 5 to 7 comparison criteria, score each one consistently, and show how your project profile differs.",
    outputFocus: "multi-attribute comparison",
    example: "radar"
  },
  {
    id: "value-curve",
    title: "Value Curve (Strategy Canvas)",
    shortLabel: "Value Curve",
    whatBest: "Demonstrates how your idea breaks industry patterns by emphasizing different priorities than existing competitors.",
    useWhen:
      "Use this when your thesis argues that the market focuses on the wrong factors and your concept creates a new pattern of value.",
    promptHint:
      "List the common factors of competition, then map how incumbents perform versus where your concept intentionally rises or drops.",
    outputFocus: "strategic differentiation",
    example: "valueCurve"
  },
  {
    id: "ecosystem-map",
    title: "Ecosystem Map",
    shortLabel: "Ecosystem Map",
    whatBest: "Shows relationships between users, institutions, technologies, and platforms in the broader system around your idea.",
    useWhen:
      "Use this when your thesis depends on multiple stakeholders, service touchpoints, or systemic relationships rather than just competitors.",
    promptHint:
      "Identify the central user or organization, then map every actor, dependency, and exchange that shapes the experience.",
    outputFocus: "system relationships",
    example: "ecosystem"
  },
  {
    id: "opportunity-gap",
    title: "Opportunity Gap Map",
    shortLabel: "Opportunity Gap",
    whatBest: "Identifies unmet needs and gaps between current performance and future potential.",
    useWhen:
      "Use this when your research is strongest at proving what is missing, underserved, or unresolved in the current market.",
    promptHint:
      "Name the user need or performance gap, clarify current reality versus ideal conditions, and show how your project closes the distance.",
    outputFocus: "unmet need and opportunity",
    example: "gap"
  }
];

const cardsRoot = document.getElementById("frameworkCards");
const briefForm = document.getElementById("briefForm");
const briefOutput = document.getElementById("briefOutput");
const selectionState = document.getElementById("selectionState");
const selectedBadge = document.getElementById("selectedBadge");
const selectedExample = document.getElementById("selectedExample");

let selectedFramework = null;

function renderCards() {
  cardsRoot.innerHTML = frameworks
    .map(
      (framework) => `
        <article class="framework-card" data-id="${framework.id}">
          <div>
            <p class="card-tag">Framework</p>
            <h3>${framework.title}</h3>
            <p><strong>What it does best:</strong> ${framework.whatBest}</p>
            <p><strong>Best for:</strong> ${framework.useWhen}</p>
            <div class="card-meta">
              <span class="meta-pill">${framework.outputFocus}</span>
            </div>
            <button type="button" data-select="${framework.id}">Choose this framework</button>
          </div>
          <div class="example-frame">${renderExample(framework.example)}</div>
        </article>
      `
    )
    .join("");

  cardsRoot.querySelectorAll("[data-select]").forEach((button) => {
    button.addEventListener("click", () => selectFramework(button.dataset.select));
  });
}

function selectFramework(id) {
  selectedFramework = frameworks.find((item) => item.id === id) ?? null;

  cardsRoot.querySelectorAll(".framework-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.id === id);
  });

  if (!selectedFramework) {
    selectedBadge.textContent = "Choose one above";
    selectionState.className = "selection-state empty";
    selectionState.textContent =
      "Select a visualization card to see when to use it and unlock the guided builder.";
    selectedExample.className = "example-frame muted";
    selectedExample.innerHTML = "";
    updateBrief();
    return;
  }

  selectedBadge.textContent = selectedFramework.shortLabel;
  selectionState.className = "selection-state";
  selectionState.innerHTML = `
    <strong>${selectedFramework.title}</strong><br />
    ${selectedFramework.whatBest}<br /><br />
    <strong>Builder tip:</strong> ${selectedFramework.promptHint}
  `;
  selectedExample.className = "example-frame";
  selectedExample.innerHTML = renderExample(selectedFramework.example);

  updateBrief();
  document.getElementById("builder").scrollIntoView({ behavior: "smooth", block: "start" });
}

function readForm() {
  const data = new FormData(briefForm);
  return Object.fromEntries(data.entries());
}

function textOrFallback(value, fallback) {
  const cleaned = String(value || "").trim();
  return cleaned || fallback;
}

function listFromText(value, fallbackItems) {
  const items = String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : fallbackItems;
}

function updateBrief() {
  const values = readForm();

  if (!selectedFramework) {
    briefOutput.className = "brief-output empty";
    briefOutput.textContent =
      "Choose a framework and begin answering prompts to generate your visualization brief.";
    return;
  }

  const projectName = textOrFallback(values.projectName, "Untitled Thesis Project");
  const thesisSummary = textOrFallback(
    values.thesisSummary,
    "Add a short summary of the problem, audience, and concept to generate a clearer brief."
  );
  const audience = textOrFallback(
    values.audience,
    "faculty reviewers and design stakeholders"
  );
  const actors = listFromText(values.competitors, [
    "key competitors or actors",
    "adjacent alternatives",
    "your project"
  ]);
  const dimensions = listFromText(values.dimensions, [
    "primary axis or factor one",
    "primary axis or factor two",
    "supporting attributes or relationships"
  ]);
  const evidence = listFromText(values.evidence, [
    "user interviews",
    "secondary market research",
    "observational insights"
  ]);
  const rationale = textOrFallback(
    values.standout,
    "Explain why this framework reveals the most meaningful insight, what it makes visible, and how your project stands apart."
  );

  briefOutput.className = "brief-output";
  briefOutput.innerHTML = `
    <h3>${projectName}</h3>
    <p><strong>Recommended visualization:</strong> ${selectedFramework.title}</p>
    <p>${selectedFramework.whatBest}</p>

    <h4>Story to tell</h4>
    <p>${thesisSummary}</p>

    <h4>Why this framework fits</h4>
    <p>${rationale}</p>

    <h4>What to include in the graphic</h4>
    <ul>
      <li>Primary audience: ${audience}</li>
      <li>Main focus: ${selectedFramework.outputFocus}</li>
      <li>Entities to map or compare: ${actors.join(", ")}</li>
      <li>Key dimensions or factors: ${dimensions.join(", ")}</li>
    </ul>

    <h4>Research inputs</h4>
    <ul>
      ${evidence.map((item) => `<li>${item}</li>`).join("")}
    </ul>

    <h4>Build checklist</h4>
    <ul>
      <li>Define the exact argument this visualization must prove.</li>
      <li>${selectedFramework.promptHint}</li>
      <li>Keep labels concise so your position is readable in under 30 seconds.</li>
      <li>Use annotation to call out the single most important insight.</li>
    </ul>
  `;
}

briefForm.addEventListener("input", updateBrief);
renderCards();
updateBrief();

function renderExample(type) {
  const examples = {
    landscape: `
      <svg viewBox="0 0 360 260" role="img" aria-label="Competitive landscape example">
        <rect x="42" y="20" width="276" height="200" rx="18" fill="rgba(255,255,255,0.62)" stroke="rgba(31,37,51,0.12)"/>
        <line x1="180" y1="35" x2="180" y2="220" stroke="#5f6472" stroke-width="1.5"/>
        <line x1="58" y1="130" x2="302" y2="130" stroke="#5f6472" stroke-width="1.5"/>
        <text x="180" y="248" text-anchor="middle" font-size="13" fill="#5f6472">Accessibility →</text>
        <text x="18" y="130" text-anchor="middle" font-size="13" fill="#5f6472" transform="rotate(-90, 18, 130)">↑ Price</text>
        <circle cx="124" cy="168" r="19" fill="#cddcd6"/>
        <circle cx="155" cy="154" r="16" fill="#cddcd6"/>
        <circle cx="228" cy="92" r="24" fill="#f2c473"/>
        <circle cx="258" cy="170" r="31" fill="#9bb8d6"/>
        <circle cx="213" cy="56" r="20" fill="#bc5b43"/>
        <text x="213" y="61" text-anchor="middle" font-size="10" font-weight="700" fill="white">YOU</text>
      </svg>
    `,
    radar: `
      <svg viewBox="0 0 360 260" role="img" aria-label="Radar chart example">
        <polygon points="180,38 255,80 255,168 180,212 105,168 105,80" fill="none" stroke="rgba(31,37,51,0.12)" stroke-width="2"/>
        <polygon points="180,64 233,94 233,154 180,184 127,154 127,94" fill="none" stroke="rgba(31,37,51,0.12)" stroke-width="2"/>
        <polygon points="180,90 211,108 211,140 180,156 149,140 149,108" fill="none" stroke="rgba(31,37,51,0.12)" stroke-width="2"/>
        <line x1="180" y1="38" x2="180" y2="212" stroke="rgba(31,37,51,0.12)"/>
        <line x1="105" y1="80" x2="255" y2="168" stroke="rgba(31,37,51,0.12)"/>
        <line x1="255" y1="80" x2="105" y2="168" stroke="rgba(31,37,51,0.12)"/>
        <polygon points="180,58 228,102 220,156 180,182 132,152 142,96" fill="rgba(47,93,98,0.18)" stroke="#2f5d62" stroke-width="3"/>
        <polygon points="180,82 244,98 236,142 180,196 118,148 126,88" fill="rgba(188,91,67,0.14)" stroke="#bc5b43" stroke-width="3"/>
        <text x="180" y="24" text-anchor="middle" font-size="12" fill="#5f6472">Trust</text>
        <text x="274" y="80" text-anchor="start" font-size="12" fill="#5f6472">Access</text>
        <text x="274" y="174" text-anchor="start" font-size="12" fill="#5f6472">Cost</text>
        <text x="180" y="234" text-anchor="middle" font-size="12" fill="#5f6472">Care</text>
        <text x="86" y="174" text-anchor="end" font-size="12" fill="#5f6472">Speed</text>
        <text x="86" y="80" text-anchor="end" font-size="12" fill="#5f6472">Quality</text>
      </svg>
    `,
    valueCurve: `
      <svg viewBox="0 0 360 260" role="img" aria-label="Value curve example">
        <rect x="34" y="22" width="292" height="194" rx="16" fill="rgba(255,255,255,0.58)" stroke="rgba(31,37,51,0.12)"/>
        <line x1="58" y1="40" x2="58" y2="200" stroke="#5f6472" stroke-width="1.5"/>
        <line x1="58" y1="200" x2="308" y2="200" stroke="#5f6472" stroke-width="1.5"/>
        <polyline points="70,82 115,82 160,170 205,170 250,170 295,76" fill="none" stroke="#bc5b43" stroke-width="4"/>
        <polyline points="70,160 115,130 160,102 205,102 250,102 295,142" fill="none" stroke="#2f5d62" stroke-width="4"/>
        <g fill="#bc5b43">
          <circle cx="70" cy="82" r="5"/><circle cx="115" cy="82" r="5"/><circle cx="160" cy="170" r="5"/><circle cx="205" cy="170" r="5"/><circle cx="250" cy="170" r="5"/><circle cx="295" cy="76" r="5"/>
        </g>
        <g fill="#2f5d62">
          <circle cx="70" cy="160" r="5"/><circle cx="115" cy="130" r="5"/><circle cx="160" cy="102" r="5"/><circle cx="205" cy="102" r="5"/><circle cx="250" cy="102" r="5"/><circle cx="295" cy="142" r="5"/>
        </g>
        <text x="70" y="222" text-anchor="middle" font-size="11" fill="#5f6472">Price</text>
        <text x="115" y="236" text-anchor="middle" font-size="11" fill="#5f6472">Convenience</text>
        <text x="160" y="222" text-anchor="middle" font-size="11" fill="#5f6472">Craft</text>
        <text x="205" y="236" text-anchor="middle" font-size="11" fill="#5f6472">Support</text>
        <text x="250" y="222" text-anchor="middle" font-size="11" fill="#5f6472">Flexibility</text>
        <text x="295" y="236" text-anchor="middle" font-size="11" fill="#5f6472">Impact</text>
      </svg>
    `,
    ecosystem: `
      <svg viewBox="0 0 360 260" role="img" aria-label="Ecosystem map example">
        <circle cx="180" cy="128" r="28" fill="#fff5ef" stroke="#1f2533" stroke-width="2.5"/>
        <text x="180" y="133" text-anchor="middle" font-size="12" font-weight="700" fill="#1f2533">USER</text>
        <circle cx="180" cy="128" r="82" fill="none" stroke="rgba(31,37,51,0.08)" stroke-width="28"/>
        <circle cx="180" cy="128" r="118" fill="none" stroke="rgba(31,37,51,0.05)" stroke-width="26"/>
        <g stroke="#7b7f8a" stroke-width="2">
          <line x1="180" y1="100" x2="180" y2="58"/>
          <line x1="206" y1="116" x2="258" y2="90"/>
          <line x1="210" y1="144" x2="272" y2="164"/>
          <line x1="154" y1="145" x2="92" y2="168"/>
          <line x1="151" y1="111" x2="94" y2="82"/>
        </g>
        <g>
          <circle cx="180" cy="44" r="18" fill="#2f5d62"/><text x="180" y="49" text-anchor="middle" font-size="10" fill="white">Platform</text>
          <circle cx="275" cy="84" r="18" fill="#4cb0dc"/><text x="275" y="89" text-anchor="middle" font-size="10" fill="white">Clinic</text>
          <circle cx="286" cy="170" r="18" fill="#bc5b43"/><text x="286" y="175" text-anchor="middle" font-size="10" fill="white">City</text>
          <circle cx="75" cy="176" r="18" fill="#efb350"/><text x="75" y="181" text-anchor="middle" font-size="10" fill="white">NGO</text>
          <circle cx="83" cy="76" r="18" fill="#a18ec1"/><text x="83" y="81" text-anchor="middle" font-size="10" fill="white">Peers</text>
        </g>
      </svg>
    `,
    gap: `
      <svg viewBox="0 0 360 260" role="img" aria-label="Opportunity gap example">
        <line x1="50" y1="216" x2="308" y2="216" stroke="#5f6472" stroke-width="1.5"/>
        <line x1="50" y1="216" x2="50" y2="34" stroke="#5f6472" stroke-width="1.5"/>
        <line x1="50" y1="216" x2="168" y2="92" stroke="#7b7f8a" stroke-width="4"/>
        <line x1="50" y1="216" x2="282" y2="144" stroke="#a8adb8" stroke-width="4"/>
        <polygon points="50,216 168,92 282,144" fill="rgba(188,91,67,0.22)" stroke="#bc5b43" stroke-width="3"/>
        <text x="178" y="142" text-anchor="middle" font-size="22" font-weight="700" fill="#8d3929">Gap</text>
        <text x="182" y="70" text-anchor="middle" font-size="12" fill="#5f6472">Potential</text>
        <text x="298" y="146" text-anchor="start" font-size="12" fill="#5f6472">Current trajectory</text>
        <text x="180" y="244" text-anchor="middle" font-size="12" fill="#5f6472">Time or effort</text>
      </svg>
    `
  };

  return examples[type];
}
