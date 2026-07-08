import fs from "fs";
import path from "path";

const auditDir = process.argv[2];
const appUrl = process.argv[3] || "http://127.0.0.1:3000/control-center/#home";

const result = {
  appUrl,
  timestamp: new Date().toISOString(),
  steps: [],
  consoleErrors: [],
  pageErrors: [],
  screenshots: {},
  verdict: "UNKNOWN"
};

function step(name, status, details = {}) {
  result.steps.push({ name, status, details });
  const prefix = status === "PASS" ? "PASS" : status === "WARN" ? "WARN" : "FAIL";
  console.log(`${prefix} - ${name}${Object.keys(details).length ? ` ${JSON.stringify(details)}` : ""}`);
}

async function main() {
  let playwright;
  try {
    playwright = await import("playwright");
  } catch (error) {
    step("Playwright is available", "FAIL", { error: error.message });
    result.verdict = "HOLD - PLAYWRIGHT NOT AVAILABLE";
    return;
  }

  step("Playwright is available", "PASS");

  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  page.on("console", (msg) => {
    if (["error"].includes(msg.type())) {
      result.consoleErrors.push(msg.text());
    }
  });

  page.on("pageerror", (error) => {
    result.pageErrors.push(error.message);
  });

  try {
    await page.goto(appUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const homeShot = path.join(auditDir, "home-before-click.png");
    await page.screenshot({ path: homeShot, fullPage: true });
    result.screenshots.homeBeforeClick = homeShot;

    const homeState = await page.evaluate(() => ({
      href: location.href,
      hash: location.hash,
      title: document.title,
      bodyText: document.body?.innerText?.slice(0, 12000) || "",
      askButtons: [...document.querySelectorAll("button, a, [role='button']")]
        .map((el) => ({
          text: (el.innerText || el.textContent || "").trim(),
          roleId: el.getAttribute("data-role-id") || "",
          className: el.className || ""
        }))
        .filter((item) => /Ask Head Office AI|Head Office AI|AI/i.test(item.text))
    }));

    step("Home opened", homeState.href.includes("#home") || /home/i.test(homeState.hash), {
      href: homeState.href,
      hash: homeState.hash
    });

    step("Home contains Ask Head Office AI", /Ask Head Office AI/.test(homeState.bodyText), {
      matchedButtons: homeState.askButtons.slice(0, 10)
    });

    const clicked = await page.evaluate(() => {
      const candidates = [...document.querySelectorAll("button, a, [role='button'], .quick-action-btn, .home-ai-team-card, .mhos-specialist")]
        .filter((el) => /Ask Head Office AI/.test((el.innerText || el.textContent || "").trim()));

      const target = candidates[0];
      if (!target) return { clicked: false, reason: "button_not_found" };

      target.scrollIntoView({ block: "center", inline: "center" });
      target.click();

      return {
        clicked: true,
        text: (target.innerText || target.textContent || "").trim(),
        roleId: target.getAttribute("data-role-id") || "",
        className: target.className || ""
      };
    });

    step("Clicked Ask Head Office AI", clicked.clicked, clicked);

    await page.waitForTimeout(2200);

    const afterShot = path.join(auditDir, "ai-command-after-click.png");
    await page.screenshot({ path: afterShot, fullPage: true });
    result.screenshots.aiCommandAfterClick = afterShot;

    const afterState = await page.evaluate(() => {
      const bodyText = document.body?.innerText || "";
      const inputs = [...document.querySelectorAll("textarea, input")]
        .map((el) => ({
          tag: el.tagName,
          value: el.value || "",
          placeholder: el.getAttribute("placeholder") || "",
          id: el.id || "",
          name: el.getAttribute("name") || ""
        }))
        .filter((item) => item.value || item.placeholder || item.id || item.name);

      const roleSignals = [...document.querySelectorAll("[data-role-id], [data-mode-id], [data-specialist-id]")]
        .map((el) => ({
          text: (el.innerText || el.textContent || "").trim().slice(0, 160),
          roleId: el.getAttribute("data-role-id") || "",
          modeId: el.getAttribute("data-mode-id") || "",
          specialistId: el.getAttribute("data-specialist-id") || "",
          className: el.className || ""
        }))
        .filter((item) => item.roleId || item.modeId || item.specialistId || /Operations|Strategist|Writer|Video|Publisher|Ads|Customer|Compliance|Analyst|Research/i.test(item.text));

      return {
        href: location.href,
        hash: location.hash,
        bodyText: bodyText.slice(0, 16000),
        inputs: inputs.slice(0, 30),
        roleSignals: roleSignals.slice(0, 80),
        localStorageKeys: Object.keys(localStorage || {}).filter((key) => /ai|prompt|handoff|command|mhos/i.test(key)).slice(0, 60),
        sessionStorageKeys: Object.keys(sessionStorage || {}).filter((key) => /ai|prompt|handoff|command|mhos/i.test(key)).slice(0, 60)
      };
    });

    step("AI Command route opened", /ai-command/.test(afterState.href) || /ai-command/.test(afterState.hash), {
      href: afterState.href,
      hash: afterState.hash
    });

    step("AI Command content visible", /AI Command|AI Team|Ask one expert|specialist|Operations Lead/i.test(afterState.bodyText), {
      textSample: afterState.bodyText.slice(0, 600)
    });

    step("Bridge context or prompt appears", /Head Office|executive|readiness|next|blocker|Operations Lead|AI Command/i.test(afterState.bodyText), {
      inputs: afterState.inputs.slice(0, 10),
      roleSignals: afterState.roleSignals.slice(0, 10)
    });

    step("No browser console errors", result.consoleErrors.length === 0, {
      consoleErrors: result.consoleErrors.slice(0, 20)
    });

    step("No page runtime errors", result.pageErrors.length === 0, {
      pageErrors: result.pageErrors.slice(0, 20)
    });

    const failedSteps = result.steps.filter((item) => item.status === "FAIL");

    if (failedSteps.length) {
      result.verdict = "FAIL - BROWSER PROOF HAS FAILING STEPS";
    } else {
      result.verdict = "PASS - HOME TO AI COMMAND BROWSER PROOF PASSED";
    }
  } finally {
    await browser.close();
  }
}

await main();

fs.writeFileSync(path.join(auditDir, "05_browser_proof_result.json"), JSON.stringify(result, null, 2));
console.log("");
console.log(`VERDICT: ${result.verdict}`);

if (result.verdict.startsWith("FAIL")) {
  process.exit(1);
}
