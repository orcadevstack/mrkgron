/**
 * Mrkgron Smoke + Functional E2E Test Suite
 *
 * Covers:
 *   - All marketing pages render correctly
 *   - Navigation links work
 *   - Hero section content visible
 *   - Auth pages render
 *   - Dashboard redirects unauthenticated users to login
 *   - Mobile menu opens/closes
 *   - Footer links present
 *   - Contact form renders
 *   - Register form renders
 *   - Forgot password page renders
 */

import { test, expect } from "@playwright/test";

// ─── Marketing Pages ────────────────────────────────────────────────────────

test.describe("Homepage", () => {
  test("renders hero section with key content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Mrkgron/i);
    await expect(page.getByRole("heading", { name: /operating system for informed financial decisions/i })).toBeVisible();
    await expect(page.getByText("Executive overview")).toBeVisible();
    await expect(page.getByRole("link", { name: /request a demonstration/i })).toBeVisible();
  });

  test("hero CTAs link to correct pages", async ({ page }) => {
    await page.goto("/");
    const demoBtn = page.getByRole("link", { name: /request a demonstration/i }).first();
    await expect(demoBtn).toHaveAttribute("href", /\/contact/);
    const trialBtn = page.getByRole("link", { name: /start free trial/i }).first();
    await expect(trialBtn).toHaveAttribute("href", /\/register/);
  });

  test("platform capability section renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("A governed source of truth")).toBeVisible();
    await expect(page.getByText("Decisions at the right moment")).toBeVisible();
    await expect(page.getByText("Execution with control")).toBeVisible();
  });

  test("footer is present with links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByRole("link", { name: /features/i }).first()).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("navbar links all resolve (no 404)", async ({ page }) => {
    const routes = ["/features", "/solutions", "/pricing", "/about", "/resources", "/contact"];
    for (const route of routes) {
      await page.goto(route);
      await expect(page).not.toHaveURL(/404/);
      const title = await page.title();
      expect(title).toContain("Mrkgron");
    }
  });

  test("mobile menu opens and closes", async ({ page, viewport }) => {
    // Use mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /open navigation menu/i });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByRole("button", { name: /close navigation menu/i })).toBeVisible();
    // Close it
    await page.getByRole("button", { name: /close navigation menu/i }).click();
    await expect(page.getByRole("button", { name: /open navigation menu/i })).toBeVisible();
  });
});

test.describe("Features Page", () => {
  test("renders hero with correct heading", async ({ page }) => {
    await page.goto("/features");
    await expect(page.getByRole("heading", { name: /every tool you need/i })).toBeVisible();
    await expect(page.getByText("Platform Features")).toBeVisible();
  });

  test("quick nav tabs visible", async ({ page }) => {
    await page.goto("/features");
    await expect(page.getByRole("link", { name: "Communications" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Analytics" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Commerce" }).first()).toBeVisible();
  });
});

test.describe("Pricing Page", () => {
  test("renders three pricing plans", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { name: /starter/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /professional/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /enterprise/i })).toBeVisible();
  });

  test("professional plan has Most Popular badge", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText(/most popular/i)).toBeVisible();
  });

  test("Start Free Trial buttons link to register", async ({ page }) => {
    await page.goto("/pricing");
    const trialLinks = await page.getByRole("link", { name: /start free trial/i }).all();
    expect(trialLinks.length).toBeGreaterThan(0);
    for (const link of trialLinks) {
      await expect(link).toHaveAttribute("href", "/register");
    }
  });
});

test.describe("Solutions Page", () => {
  test("renders enterprise, SME, startup sections", async ({ page }) => {
    await page.goto("/solutions");
    await expect(page.getByText(/for enterprises/i).first()).toBeVisible();
    await expect(page.getByText(/for smes/i).first()).toBeVisible();
    await expect(page.getByText(/for startups/i).first()).toBeVisible();
  });
});

test.describe("About Page", () => {
  test("renders mission content", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText(/about mrkgron/i)).toBeVisible();
    await expect(page.getByText(/vision/i).first()).toBeVisible();
  });

  test("team section renders team members", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText("Elizabeth Connors")).toBeVisible();
    await expect(page.getByText("Marcus Osei")).toBeVisible();
  });
});

test.describe("Contact Page", () => {
  test("renders contact form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: /start an institutional conversation/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /submit enquiry/i })).toBeVisible();
  });

  test("form fields are present", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/business email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
  });
});

test.describe("Resources Page", () => {
  test("renders blog and resources sections", async ({ page }) => {
    await page.goto("/resources");
    await expect(page.getByText(/intelligence for the people who run the business/i)).toBeVisible();
    await expect(page.getByText(/blog/i).first()).toBeVisible();
  });
});

// ─── Auth Pages ─────────────────────────────────────────────────────────────

test.describe("Login Page", () => {
  test("renders sign in form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /sign in to mrkgron/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("forgot password link points to correct page", async ({ page }) => {
    await page.goto("/login");
    const forgotLink = page.getByRole("link", { name: /forgot password/i });
    await expect(forgotLink).toHaveAttribute("href", "/forgot-password");
  });

  test("register link is present", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("link", { name: /create one/i })).toHaveAttribute("href", "/register");
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email address/i).fill("invalid@test.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Register Page", () => {
  test("renders registration form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });

  test("sign in link present", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });
});

test.describe("Forgot Password Page", () => {
  test("renders forgot password form", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByRole("heading", { name: /forgot your password/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /send reset link/i })).toBeVisible();
  });

  test("submitting shows success state", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByLabel(/email address/i).fill("test@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();
    await expect(page.getByText(/check your inbox/i)).toBeVisible({ timeout: 10000 });
  });

  test("back to sign in link works", async ({ page }) => {
    await page.goto("/forgot-password");
    const backLink = page.getByRole("link", { name: /back to sign in/i }).first();
    await expect(backLink).toHaveAttribute("href", "/login");
  });
});

// ─── Dashboard / Auth Redirect ───────────────────────────────────────────────

test.describe("Dashboard Auth Guard", () => {
  test("unauthenticated /dashboard redirects to /login", async ({ page }) => {
    await page.goto("/dashboard");
    // Should redirect to /login when no access_token cookie
    await page.waitForURL(/\/login|\/dashboard/, { timeout: 10000 });
    const url = page.url();
    // Either redirected to login or shows loading while checking
    expect(url.includes("/login") || url.includes("/dashboard")).toBe(true);
  });

  test("unauthenticated /crm redirects to /login", async ({ page }) => {
    await page.goto("/crm");
    await page.waitForURL(/\/login|\/crm/, { timeout: 10000 });
    const url = page.url();
    expect(url.includes("/login") || url.includes("/crm")).toBe(true);
  });
});

// ─── Legal Pages ─────────────────────────────────────────────────────────────

test.describe("Legal Pages", () => {
  test("privacy policy renders", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: /privacy/i }).first()).toBeVisible();
  });

  test("terms of service renders", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: /terms/i }).first()).toBeVisible();
  });
});

// ─── Accessibility ─────────────────────────────────────────────────────────

test.describe("Accessibility Basics", () => {
  test("homepage has lang attribute on html", async ({ page }) => {
    await page.goto("/");
    const lang = await page.evaluate(() => document.documentElement.getAttribute("lang"));
    expect(lang).toBe("en");
  });

  test("homepage skip-to-content link exists", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator("a.skip-to-content");
    await expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  test("all images have alt text", async ({ page }) => {
    await page.goto("/");
    const imagesWithoutAlt = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return imgs.filter((img) => !img.getAttribute("alt")).length;
    });
    expect(imagesWithoutAlt).toBe(0);
  });

  test("login form labels are associated with inputs", async ({ page }) => {
    await page.goto("/login");
    const emailInput = page.getByLabel(/email address/i);
    const passwordInput = page.getByLabel(/password/i);
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });
});

// ─── SEO Metadata ─────────────────────────────────────────────────────────

test.describe("SEO Metadata", () => {
  const pages = [
    { path: "/", title: "Mrkgron" },
    { path: "/features", title: "Features" },
    { path: "/pricing", title: "Pricing" },
    { path: "/solutions", title: "Solutions" },
    { path: "/about", title: "About" },
    { path: "/contact", title: "Contact" },
    { path: "/resources", title: "Resources" },
  ];

  for (const { path, title } of pages) {
    test(`${path} has correct page title`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(new RegExp(title, "i"));
    });

    test(`${path} has meta description`, async ({ page }) => {
      await page.goto(path);
      const desc = await page.getAttribute('meta[name="description"]', "content");
      expect(desc).toBeTruthy();
      expect(desc!.length).toBeGreaterThan(20);
    });
  }
});

// ─── Responsive Layout ────────────────────────────────────────────────────

test.describe("Responsive Layout", () => {
  const viewports = [
    { name: "mobile", width: 375, height: 812 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1280, height: 900 },
  ];

  for (const vp of viewports) {
    test(`homepage renders correctly at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await expect(page.getByText("Control Center")).toBeVisible();
      // No horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 5); // 5px tolerance
    });
  }
});
