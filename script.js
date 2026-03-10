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
    example: "landscape",
    followups: [
      {
        id: "xAxisLabel",
        label: "What should the horizontal axis measure?",
        placeholder: "ex. affordability to premium pricing",
        hint: "This becomes the x-axis label in the generated map."
      },
      {
        id: "yAxisLabel",
        label: "What should the vertical axis measure?",
        placeholder: "ex. niche service to broad community reach",
        hint: "This becomes the y-axis label in the generated map."
      }
    ]
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
    example: "radar",
    followups: [
      {
        id: "comparisonLabel",
        label: "Who is the main comparison baseline?",
        placeholder: "ex. typical resale app, existing service model",
        hint: "This name appears as the comparison shape in the chart."
      },
      {
        id: "strengthDimensions",
        label: "Which dimensions are your project strongest on?",
        placeholder: "ex. trust, access, sustainability",
        hint: "List dimensions from your earlier answer. These will be emphasized in your profile."
      }
    ]
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
    example: "valueCurve",
    followups: [
      {
        id: "industryLabel",
        label: "What should the incumbent industry line be called?",
        placeholder: "ex. traditional tutoring market, standard delivery service",
        hint: "This names the baseline curve."
      },
      {
        id: "priorityFactors",
        label: "Which factors should your project push higher or lower?",
        placeholder: "ex. higher: transparency, access; lower: complexity, overhead",
        hint: "Use factor names from your earlier dimensions answer."
      }
    ]
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
    example: "ecosystem",
    followups: [
      {
        id: "centralActor",
        label: "Who is at the center of this ecosystem?",
        placeholder: "ex. student founder, neighborhood resident, independent maker",
        hint: "This becomes the central node in the map."
      },
      {
        id: "relationshipTypes",
        label: "What kinds of exchanges connect the actors?",
        placeholder: "ex. funding, mentorship, logistics, trust, data",
        hint: "These labels help clarify what flows through the system."
      }
    ]
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
    example: "gap",
    followups: [
      {
        id: "currentStateLabel",
        label: "What describes the current situation?",
        placeholder: "ex. fragmented support, low trust, inconsistent access",
        hint: "This labels the lower trajectory."
      },
      {
        id: "potentialStateLabel",
        label: "What describes the ideal future state?",
        placeholder: "ex. coordinated support, higher trust, reliable access",
        hint: "This labels the higher trajectory."
      }
    ]
  }
];

const cardsRoot = document.getElementById("frameworkCards");
const briefForm = document.getElementById("briefForm");
const briefOutput = document.getElementById("briefOutput");
const visualizationOutput = document.getElementById("visualizationOutput");
const selectionState = document.getElementById("selectionState");
const selectedBadge = document.getElementById("selectedBadge");
const selectedExample = document.getElementById("selectedExample");
const followupIntro = document.getElementById("followupIntro");
const followupFields = document.getElementById("followupFields");

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
    renderFollowups();
    updateOutputs();
    return;
  }

  selectedBadge.textContent = selectedFramework.shortLabel;
  selectionState.className = "selection-state";
  selectionState.innerHTML = `
    <strong>${escapeHtml(selectedFramework.title)}</strong><br />
    ${escapeHtml(selectedFramework.whatBest)}<br /><br />
    <strong>Builder tip:</strong> ${escapeHtml(selectedFramework.promptHint)}
  `;
  selectedExample.className = "example-frame";
  selectedExample.innerHTML = renderExample(selectedFramework.example);

  renderFollowups();
  updateOutputs();
  document.getElementById("builder").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderFollowups() {
  if (!selectedFramework) {
    followupIntro.textContent =
      "Choose a framework above to unlock the extra questions needed to draft the actual visualization.";
    followupFields.innerHTML = "";
    return;
  }

  followupIntro.textContent =
    "These extra details strengthen the generated chart and help the app ask for any missing information.";

  followupFields.innerHTML = `
    <div class="followup-grid">
      ${selectedFramework.followups
        .map(
          (field) => `
            <div class="field">
              <label for="${field.id}">${escapeHtml(field.label)}</label>
              <input id="${field.id}" name="${field.id}" type="text" placeholder="${escapeHtml(
                field.placeholder
              )}" />
              <p class="field-hint">${escapeHtml(field.hint)}</p>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  followupFields.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", updateOutputs);
  });
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

function normalizedList(value) {
  return String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function updateOutputs() {
  const values = readForm();

  if (!selectedFramework) {
    briefOutput.className = "brief-output empty";
    briefOutput.textContent =
      "Choose a framework and begin answering prompts to generate your visualization brief.";
    visualizationOutput.className = "visualization-output empty";
    visualizationOutput.textContent =
      "Your drafted visualization will appear here after you choose a framework.";
    return;
  }

  const projectName = textOrFallback(values.projectName, "Untitled Thesis Project");
  const thesisSummary = textOrFallback(
    values.thesisSummary,
    "Add a short summary of the problem, audience, and concept to generate a clearer brief."
  );
  const audience = textOrFallback(values.audience, "faculty reviewers and design stakeholders");
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
  const missingInfo = getMissingInfo(values, dimensions);
  const visualization = renderDraftVisualization({
    framework: selectedFramework,
    values,
    projectName,
    thesisSummary,
    actors,
    dimensions
  });

  briefOutput.className = "brief-output";
  briefOutput.innerHTML = `
    <h3>${escapeHtml(projectName)}</h3>
    <p><strong>Recommended visualization:</strong> ${escapeHtml(selectedFramework.title)}</p>
    <p>${escapeHtml(selectedFramework.whatBest)}</p>

    <h4>Story to tell</h4>
    <p>${escapeHtml(thesisSummary)}</p>

    <h4>Why this framework fits</h4>
    <p>${escapeHtml(rationale)}</p>

    <h4>What to include in the graphic</h4>
    <ul>
      <li>Primary audience: ${escapeHtml(audience)}</li>
      <li>Main focus: ${escapeHtml(selectedFramework.outputFocus)}</li>
      <li>Entities to map or compare: ${escapeHtml(actors.join(", "))}</li>
      <li>Key dimensions or factors: ${escapeHtml(dimensions.join(", "))}</li>
    </ul>

    <h4>Research inputs</h4>
    <ul>
      ${evidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>

    ${
      missingInfo.length
        ? `
      <h4>More information needed</h4>
      <ul class="missing-list">
        ${missingInfo.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    `
        : ""
    }

    <h4>Build checklist</h4>
    <ul>
      <li>Define the exact argument this visualization must prove.</li>
      <li>${escapeHtml(selectedFramework.promptHint)}</li>
      <li>Keep labels concise so your position is readable in under 30 seconds.</li>
      <li>Use annotation to call out the single most important insight.</li>
    </ul>
  `;

  visualizationOutput.className = "visualization-output";
  visualizationOutput.innerHTML = `
    <h4>Draft visualization</h4>
    <p>${escapeHtml(visualization.caption)}</p>
    <div class="visualization-stage">${visualization.svg}</div>
  `;
}

function getMissingInfo(values, dimensions) {
  const prompts = [];

  if (!values.projectName?.trim()) {
    prompts.push("Add a project name so the chart clearly labels your concept.");
  }

  if (!values.thesisSummary?.trim()) {
    prompts.push("Add a one-sentence thesis summary so the brief explains what problem the chart addresses.");
  }

  if (!values.dimensions?.trim()) {
    prompts.push("List the key dimensions or factors so the axes, criteria, or relationships are meaningful.");
  }

  if (selectedFramework.id === "competitive-landscape") {
    if (!values.xAxisLabel?.trim()) {
      prompts.push("Name the horizontal axis for the landscape map.");
    }
    if (!values.yAxisLabel?.trim()) {
      prompts.push("Name the vertical axis for the landscape map.");
    }
  }

  if (selectedFramework.id === "radar-chart") {
    if (dimensions.length < 4 || !values.dimensions?.trim()) {
      prompts.push("Add at least 4 comparison dimensions so the radar chart has enough axes.");
    }
    if (!values.comparisonLabel?.trim()) {
      prompts.push("Name the main comparison baseline for the radar chart.");
    }
    if (!values.strengthDimensions?.trim()) {
      prompts.push("Identify which dimensions your project is strongest on.");
    }
  }

  if (selectedFramework.id === "value-curve") {
    if (!values.industryLabel?.trim()) {
      prompts.push("Name the incumbent industry or default market offering.");
    }
    if (!values.priorityFactors?.trim()) {
      prompts.push("Specify which factors your project intentionally raises or lowers.");
    }
  }

  if (selectedFramework.id === "ecosystem-map") {
    if (!values.centralActor?.trim()) {
      prompts.push("Identify the central actor so the ecosystem map has a clear focal point.");
    }
    if (!values.relationshipTypes?.trim()) {
      prompts.push("Add relationship types such as funding, trust, logistics, or data.");
    }
  }

  if (selectedFramework.id === "opportunity-gap") {
    if (!values.currentStateLabel?.trim()) {
      prompts.push("Label the current state so the lower trajectory is specific.");
    }
    if (!values.potentialStateLabel?.trim()) {
      prompts.push("Label the ideal future state so the opportunity gap is legible.");
    }
  }

  return prompts;
}

function renderDraftVisualization(context) {
  const renderers = {
    "competitive-landscape": renderLandscapeDraft,
    "radar-chart": renderRadarDraft,
    "value-curve": renderValueCurveDraft,
    "ecosystem-map": renderEcosystemDraft,
    "opportunity-gap": renderGapDraft
  };

  return renderers[context.framework.id](context);
}

function renderLandscapeDraft({ values, projectName, actors, dimensions }) {
  const xLabel = textOrFallback(values.xAxisLabel, dimensions[0] || "Horizontal dimension");
  const yLabel = textOrFallback(values.yAxisLabel, dimensions[1] || "Vertical dimension");
  const competitorNames = actors.slice(0, 4);
  const points = [
    { label: competitorNames[0] || "Alternative A", x: 138, y: 210, r: 20, fill: "#cfdacb" },
    { label: competitorNames[1] || "Alternative B", x: 182, y: 160, r: 18, fill: "#8cb6d8" },
    { label: competitorNames[2] || "Alternative C", x: 246, y: 128, r: 22, fill: "#f2c473" },
    { label: competitorNames[3] || "Alternative D", x: 280, y: 194, r: 24, fill: "#d8cfeb" },
    { label: projectName, x: 234, y: 86, r: 22, fill: "#bc5b43", project: true }
  ];

  return {
    caption: `This draft plots ${projectName} against nearby alternatives using ${xLabel} and ${yLabel} as the key positioning axes.`,
    svg: `
      <svg viewBox="0 0 620 380" role="img" aria-label="${escapeHtml(projectName)} competitive landscape map">
        <rect x="70" y="40" width="490" height="280" rx="26" fill="rgba(255,255,255,0.65)" stroke="rgba(31,37,51,0.12)"/>
        <line x1="120" y1="66" x2="120" y2="300" stroke="#5f6472" stroke-width="2"/>
        <line x1="120" y1="300" x2="530" y2="300" stroke="#5f6472" stroke-width="2"/>
        <line x1="325" y1="66" x2="325" y2="300" stroke="rgba(95,100,114,0.25)" stroke-width="1.5" stroke-dasharray="6 6"/>
        <line x1="120" y1="183" x2="530" y2="183" stroke="rgba(95,100,114,0.25)" stroke-width="1.5" stroke-dasharray="6 6"/>
        <text x="325" y="346" text-anchor="middle" font-size="18" fill="#5f6472">${escapeHtml(xLabel)}</text>
        <text x="38" y="186" text-anchor="middle" font-size="18" fill="#5f6472" transform="rotate(-90, 38, 186)">${escapeHtml(
          yLabel
        )}</text>
        ${points
          .map(
            (point) => `
              <circle cx="${point.x}" cy="${point.y}" r="${point.r}" fill="${point.fill}" opacity="${point.project ? 0.95 : 0.82}"/>
              <text x="${point.x}" y="${point.y + 4}" text-anchor="middle" font-size="${point.project ? 12 : 11}" font-weight="700" fill="${
              point.project ? "#fffaf5" : "#1f2533"
            }">${escapeHtml(shortText(point.label, 16))}</text>
            `
          )
          .join("")}
        <text x="390" y="84" font-size="13" fill="#8d3929">Opportunity space around your project</text>
      </svg>
    `
  };
}

function renderRadarDraft({ values, projectName, dimensions }) {
  const axes = dimensions.slice(0, 6);
  while (axes.length < 5) {
    axes.push(`Factor ${axes.length + 1}`);
  }

  const comparisonLabel = textOrFallback(values.comparisonLabel, "Current Market");
  const strengths = normalizedList(values.strengthDimensions);
  const baselineValues = axes.map((_, index) => [3, 4, 3, 4, 3, 4][index] || 3);
  const projectValues = axes.map((axis, index) => {
    const strengthMatch = strengths.some((item) => axis.toLowerCase().includes(item));
    if (strengthMatch) {
      return 5;
    }
    return [4, 3, 4, 3, 4, 3][index] || 3;
  });

  const centerX = 300;
  const centerY = 190;
  const radius = 120;
  const polygonCount = 5;
  const axesMarkup = axes
    .map((axis, index) => {
      const angle = (-Math.PI / 2) + (Math.PI * 2 * index) / axes.length;
      const x = centerX + Math.cos(angle) * (radius + 28);
      const y = centerY + Math.sin(angle) * (radius + 28);
      const lineX = centerX + Math.cos(angle) * radius;
      const lineY = centerY + Math.sin(angle) * radius;
      return `
        <line x1="${centerX}" y1="${centerY}" x2="${lineX}" y2="${lineY}" stroke="rgba(31,37,51,0.14)" />
        <text x="${x}" y="${y}" text-anchor="middle" font-size="14" fill="#5f6472">${escapeHtml(shortText(axis, 16))}</text>
      `;
    })
    .join("");

  const ringsMarkup = Array.from({ length: polygonCount }, (_, index) => {
    const ringRadius = (radius / polygonCount) * (index + 1);
    const points = axes
      .map((_, axisIndex) => {
        const angle = (-Math.PI / 2) + (Math.PI * 2 * axisIndex) / axes.length;
        return `${centerX + Math.cos(angle) * ringRadius},${centerY + Math.sin(angle) * ringRadius}`;
      })
      .join(" ");

    return `<polygon points="${points}" fill="none" stroke="rgba(31,37,51,0.12)" stroke-width="1.5"/>`;
  }).join("");

  const baselinePolygon = makeRadarPolygon(axes.length, baselineValues, centerX, centerY, radius);
  const projectPolygon = makeRadarPolygon(axes.length, projectValues, centerX, centerY, radius);

  return {
    caption: `This draft compares ${projectName} against ${comparisonLabel} across ${axes.length} dimensions to show where your profile is strongest.`,
    svg: `
      <svg viewBox="0 0 620 420" role="img" aria-label="${escapeHtml(projectName)} radar chart">
        ${ringsMarkup}
        ${axesMarkup}
        <polygon points="${baselinePolygon}" fill="rgba(47,93,98,0.15)" stroke="#2f5d62" stroke-width="3"/>
        <polygon points="${projectPolygon}" fill="rgba(188,91,67,0.15)" stroke="#bc5b43" stroke-width="3"/>
        <text x="74" y="42" font-size="15" fill="#2f5d62">${escapeHtml(comparisonLabel)}</text>
        <rect x="42" y="28" width="18" height="18" rx="4" fill="rgba(47,93,98,0.55)"/>
        <text x="74" y="72" font-size="15" fill="#8d3929">${escapeHtml(projectName)}</text>
        <rect x="42" y="58" width="18" height="18" rx="4" fill="rgba(188,91,67,0.55)"/>
      </svg>
    `
  };
}

function renderValueCurveDraft({ values, projectName, dimensions }) {
  const factors = dimensions.slice(0, 6);
  while (factors.length < 5) {
    factors.push(`Factor ${factors.length + 1}`);
  }

  const industryLabel = textOrFallback(values.industryLabel, "Typical Industry Offer");
  const priorities = normalizedList(values.priorityFactors);
  const incumbent = factors.map((_, index) => [2, 3, 4, 4, 3, 2][index] || 3);
  const project = factors.map((factor, index) => {
    const matched = priorities.some((item) => factor.toLowerCase().includes(item));
    if (matched) {
      return 5;
    }
    return [4, 4, 2, 3, 5, 4][index] || 3;
  });

  const lineA = makeLinePath(incumbent);
  const lineB = makeLinePath(project);

  return {
    caption: `This strategy canvas contrasts ${projectName} with ${industryLabel} to show which factors your concept raises, lowers, or reframes.`,
    svg: `
      <svg viewBox="0 0 620 380" role="img" aria-label="${escapeHtml(projectName)} value curve">
        <rect x="56" y="38" width="520" height="250" rx="24" fill="rgba(255,255,255,0.68)" stroke="rgba(31,37,51,0.12)"/>
        <line x1="88" y1="58" x2="88" y2="264" stroke="#5f6472" stroke-width="2"/>
        <line x1="88" y1="264" x2="544" y2="264" stroke="#5f6472" stroke-width="2"/>
        ${[1, 2, 3, 4].map((n) => `<line x1="88" y1="${264 - n * 42}" x2="544" y2="${264 - n * 42}" stroke="rgba(31,37,51,0.08)" />`).join("")}
        <polyline points="${lineA}" fill="none" stroke="#2f5d62" stroke-width="4"/>
        <polyline points="${lineB}" fill="none" stroke="#bc5b43" stroke-width="4"/>
        ${makeLineDots(incumbent, "#2f5d62")}
        ${makeLineDots(project, "#bc5b43")}
        ${factors
          .map((factor, index) => {
            const x = 110 + index * 76;
            return `<text x="${x}" y="314" text-anchor="middle" font-size="13" fill="#5f6472">${escapeHtml(
              shortText(factor, 14)
            )}</text>`;
          })
          .join("")}
        <text x="116" y="28" font-size="15" fill="#2f5d62">${escapeHtml(industryLabel)}</text>
        <text x="294" y="28" font-size="15" fill="#8d3929">${escapeHtml(projectName)}</text>
      </svg>
    `
  };
}

function renderEcosystemDraft({ values, projectName, actors, dimensions }) {
  const centralActor = textOrFallback(values.centralActor, projectName);
  const relationships = listFromText(values.relationshipTypes, dimensions.slice(0, 5));
  const nodes = actors.slice(0, 5);
  while (nodes.length < 5) {
    nodes.push(`Actor ${nodes.length + 1}`);
  }

  const positions = [
    { x: 310, y: 72, fill: "#2f5d62" },
    { x: 472, y: 134, fill: "#4cb0dc" },
    { x: 420, y: 282, fill: "#bc5b43" },
    { x: 198, y: 296, fill: "#efb350" },
    { x: 140, y: 130, fill: "#a18ec1" }
  ];

  return {
    caption: `This ecosystem draft centers ${centralActor} and maps the surrounding actors and exchanges that shape the system your thesis operates within.`,
    svg: `
      <svg viewBox="0 0 620 400" role="img" aria-label="${escapeHtml(projectName)} ecosystem map">
        <circle cx="310" cy="198" r="72" fill="none" stroke="rgba(31,37,51,0.08)" stroke-width="34"/>
        <circle cx="310" cy="198" r="112" fill="none" stroke="rgba(31,37,51,0.05)" stroke-width="34"/>
        ${positions
          .map((position, index) => {
            const actor = nodes[index];
            const relation = relationships[index % relationships.length] || "exchange";
            return `
              <line x1="310" y1="198" x2="${position.x}" y2="${position.y}" stroke="#8a8f9a" stroke-width="2.5"/>
              <text x="${(310 + position.x) / 2}" y="${(198 + position.y) / 2 - 8}" text-anchor="middle" font-size="12" fill="#5f6472">${escapeHtml(
                shortText(relation, 14)
              )}</text>
              <circle cx="${position.x}" cy="${position.y}" r="28" fill="${position.fill}"/>
              <text x="${position.x}" y="${position.y + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#fffaf5">${escapeHtml(
                shortText(actor, 12)
              )}</text>
            `;
          })
          .join("")}
        <circle cx="310" cy="198" r="40" fill="#fff5ef" stroke="#1f2533" stroke-width="3"/>
        <text x="310" y="194" text-anchor="middle" font-size="13" font-weight="800" fill="#1f2533">${escapeHtml(
          shortText(centralActor, 16)
        )}</text>
        <text x="310" y="212" text-anchor="middle" font-size="10" fill="#5f6472">center actor</text>
      </svg>
    `
  };
}

function renderGapDraft({ values, projectName, dimensions }) {
  const currentState = textOrFallback(values.currentStateLabel, "Current conditions");
  const potentialState = textOrFallback(values.potentialStateLabel, "Desired future");
  const needLabel = textOrFallback(dimensions[0], "Core user need");

  return {
    caption: `This opportunity gap draft frames the distance between ${currentState} and ${potentialState}, highlighting the need your project addresses.`,
    svg: `
      <svg viewBox="0 0 620 380" role="img" aria-label="${escapeHtml(projectName)} opportunity gap map">
        <line x1="92" y1="300" x2="548" y2="300" stroke="#5f6472" stroke-width="2"/>
        <line x1="92" y1="300" x2="92" y2="60" stroke="#5f6472" stroke-width="2"/>
        <line x1="92" y1="300" x2="258" y2="112" stroke="#7b7f8a" stroke-width="5"/>
        <line x1="92" y1="300" x2="490" y2="196" stroke="#a8adb8" stroke-width="5"/>
        <polygon points="92,300 258,112 490,196" fill="rgba(188,91,67,0.22)" stroke="#bc5b43" stroke-width="3"/>
        <text x="284" y="176" text-anchor="middle" font-size="38" font-weight="700" fill="#8d3929">Gap</text>
        <text x="274" y="92" text-anchor="middle" font-size="16" fill="#5f6472">${escapeHtml(shortText(potentialState, 24))}</text>
        <text x="506" y="198" font-size="16" fill="#5f6472">${escapeHtml(shortText(currentState, 24))}</text>
        <text x="320" y="336" text-anchor="middle" font-size="16" fill="#5f6472">${escapeHtml(needLabel)}</text>
        <text x="272" y="236" text-anchor="middle" font-size="13" fill="#8d3929">${escapeHtml(shortText(projectName, 20))} closes this opportunity</text>
      </svg>
    `
  };
}

function makeRadarPolygon(axisCount, values, centerX, centerY, radius) {
  return values
    .map((value, index) => {
      const angle = (-Math.PI / 2) + (Math.PI * 2 * index) / axisCount;
      const scaled = (radius * value) / 5;
      return `${centerX + Math.cos(angle) * scaled},${centerY + Math.sin(angle) * scaled}`;
    })
    .join(" ");
}

function makeLinePath(values) {
  return values
    .map((value, index) => {
      const x = 110 + index * 76;
      const y = 264 - value * 38;
      return `${x},${y}`;
    })
    .join(" ");
}

function makeLineDots(values, fill) {
  return values
    .map((value, index) => {
      const x = 110 + index * 76;
      const y = 264 - value * 38;
      return `<circle cx="${x}" cy="${y}" r="5.5" fill="${fill}"/>`;
    })
    .join("");
}

function shortText(value, max) {
  const text = String(value || "").trim();
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max - 1)}…`;
}

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

briefForm.addEventListener("input", updateOutputs);
renderCards();
renderFollowups();
updateOutputs();
