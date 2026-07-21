// Real brand marks via CDN-backed SVGs.
// Uses simpleicons CDN: https://cdn.simpleicons.org/<slug>/<color>
// Backwards compatibility: exposes both LOGOS and TOOLS registries.

const LOGOS = {
  salesforce: { name: "Salesforce", slug: "salesforce", color: "00A1E0" },
  gmail: { name: "Gmail", slug: "gmail", color: "EA4335" },
  zendesk: { name: "Zendesk", slug: "zendesk", color: "03363D" },
  linear: { name: "Linear", slug: "linear", color: "5E6AD2" },
  slack: { name: "Slack", slug: "slack", color: "4A154B" },
  github: { name: "GitHub", slug: "github", color: "181717" },
  notion: { name: "Notion", slug: "notion", color: "000000" },
  jira: { name: "Jira", slug: "jira", color: "0052CC" },
  hubspot: { name: "HubSpot", slug: "hubspot", color: "FF7A59" },
  intercom: { name: "Intercom", slug: "intercom", color: "1F8DED" },
  stripe: { name: "Stripe", slug: "stripe", color: "635BFF" },
  asana: { name: "Asana", slug: "asana", color: "F06A6A" },
};

const TOOLS = LOGOS;

const ToolMark = ({ id, size = 20, mono = false }) => {
  const t = LOGOS[id];
  if (!t) return null;
  const color = mono ? "000000" : t.color;
  const src = `https://cdn.simpleicons.org/${t.slug}/${color}`;
  return (
    <img
      src={src}
      alt={t.name}
      width={size}
      height={size}
      style={{ display: "block", objectFit: "contain" }}
      loading="lazy"
      decoding="async"
    />
  );
};

const ToolChip = ({ id, size = 12, mono = false }) => {
  const t = LOGOS[id];
  if (!t) return null;
  return (
    <span className="tool-chip">
      <ToolMark id={id} size={size} mono={mono} />
      {t.name}
    </span>
  );
};

Object.assign(window, {
  LOGOS,
  TOOLS,
  ToolMark,
  ToolChip,
});
