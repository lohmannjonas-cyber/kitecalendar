const userAgent = "KitecalendarBot/1.0 (+https://kitecalendar.com/about)";

export async function robotsAllows(targetUrl: string) {
  const url = new URL(targetUrl);
  const robotsUrl = new URL("/robots.txt", url.origin);

  try {
    const response = await fetch(robotsUrl, {
      headers: { "user-agent": userAgent },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (response.status === 404) return { allowed: true, checkedAt: new Date(), robotsUrl: robotsUrl.toString() };
    if (!response.ok) return { allowed: false, checkedAt: new Date(), robotsUrl: robotsUrl.toString() };

    const robots = await response.text();
    return {
      allowed: isPathAllowed(robots, url.pathname || "/"),
      checkedAt: new Date(),
      robotsUrl: robotsUrl.toString(),
    };
  } catch (error) {
    return {
      allowed: false,
      checkedAt: new Date(),
      robotsUrl: robotsUrl.toString(),
      error: error instanceof Error ? error.message : "Unknown robots.txt error",
    };
  }
}

export async function fetchPublicHtml(targetUrl: string) {
  const robots = await robotsAllows(targetUrl);
  if (!robots.allowed) {
    return { html: undefined, robots };
  }

  const response = await fetch(targetUrl, {
    headers: {
      "user-agent": userAgent,
      accept: "text/html,application/xhtml+xml",
    },
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed for ${targetUrl}: ${response.status}`);
  }

  return { html: await response.text(), robots };
}

function isPathAllowed(robots: string, path: string) {
  const groups = parseRobotsGroups(robots);
  const applicable = groups.filter((group) => group.agents.some((agent) => agent === "*" || agent.includes("kitecalendarbot")));
  if (!applicable.length) return true;

  const rules = applicable.flatMap((group) => group.rules);
  const matched = rules
    .filter((rule) => path.startsWith(rule.path))
    .sort((a, b) => b.path.length - a.path.length);

  return matched[0]?.type !== "disallow";
}

function parseRobotsGroups(robots: string) {
  const groups: Array<{ agents: string[]; rules: Array<{ type: "allow" | "disallow"; path: string }> }> = [];
  let current: { agents: string[]; rules: Array<{ type: "allow" | "disallow"; path: string }> } | undefined;

  for (const rawLine of robots.split(/\r?\n/)) {
    const line = rawLine.split("#")[0].trim();
    if (!line) continue;
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.toLowerCase();
    const value = rest.join(":").trim();

    if (key === "user-agent") {
      current = { agents: [value.toLowerCase()], rules: [] };
      groups.push(current);
    } else if (current && (key === "allow" || key === "disallow")) {
      if (value) current.rules.push({ type: key, path: value });
    }
  }

  return groups;
}
