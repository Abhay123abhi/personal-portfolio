import { chromium } from '@playwright/test';
import { mkdir, readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const viewports = [
  { width: 320, height: 700 }, { width: 375, height: 812 },
  { width: 390, height: 844 }, { width: 430, height: 932 },
  { width: 600, height: 800 }, { width: 760, height: 900 },
  { width: 761, height: 850 }, { width: 800, height: 1024 },
  { width: 1024, height: 768 }, { width: 1280, height: 800 },
  { width: 1440, height: 900 }, { width: 1536, height: 864 },
  { width: 1600, height: 900 }, { width: 1908, height: 904 },
  { width: 1920, height: 1080 }, { width: 2560, height: 1440 },
];
const screenshotWidths = new Set([390, 800, 1440, 1908, 2560]);
const errors = [];
await mkdir('test-results/responsive', { recursive: true });
try {
  for (const { width, height } of viewports) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(width + ': ' + error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('h1').first().waitFor();
    assert.equal(await page.locator('h1').first().isVisible(), true, 'Missing hero at ' + width);
    assert.equal(await page.locator('a[href="/Abhay_SDE.pdf"]').first().isVisible(), true, 'Resume missing at ' + width);
    assert.equal(await page.locator('#work').count(), 1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
    assert.equal(overflow, false, 'Horizontal page overflow at ' + width);
    // Inspect *rendered text*, not only scrollWidth (the site clips overflow).
    // A container-based headline must never spill into the portrait lane.
    const heroLayout = await page.evaluate(() => {
      const copy = document.querySelector('.portfolio-hero-copy');
      const portrait = document.querySelector('.portfolio-hero-portrait');
      const copyRect = copy.getBoundingClientRect();
      const portraitRect = portrait.getBoundingClientRect();
      const heading = copy.querySelector('h1');
      const letterRects = [...heading.querySelectorAll('span')].map(span => {
        const range = document.createRange();
        range.selectNodeContents(span);
        return range.getBoundingClientRect();
      });
      const contentFits = letterRects.every(rect =>
        rect.left >= copyRect.left - 2 && rect.right <= copyRect.right + 2
      );
      const separateColumns = copyRect.right <= portraitRect.left + 2
        || portraitRect.right <= copyRect.left + 2;
      const stacked = copyRect.bottom <= portraitRect.top + 2
        || portraitRect.bottom <= copyRect.top + 2;
      return { contentFits, noOverlap: separateColumns || stacked };
    });
    assert.equal(heroLayout.contentFits, true, 'Hero name overflows text column at ' + width);
    assert.equal(heroLayout.noOverlap, true, 'Hero portrait overlaps the copy at ' + width);
    // Detect actual clipped section headings even when overflow-x: clip hides the issue.
    const headingIssues = await page.evaluate(() => {
      return [...document.querySelectorAll('.portfolio-section-head h2, .portfolio-experience-intro h2')]
        .flatMap(heading => {
          const box = heading.getBoundingClientRect();
          const range = document.createRange();
          range.selectNodeContents(heading);
          const textParts = [...range.getClientRects()].filter(part => part.width > 1);
          const fits = textParts.every(part => part.left >= box.left - 3 && part.right <= box.right + 3);
          return fits ? [] : [heading.textContent.trim()];
        });
    });
    assert.deepEqual(headingIssues, [], 'Section heading text escapes its column at ' + width);
    // Reviewable visual evidence, without treating an intentional redesign as a defect.
    if (screenshotWidths.has(width)) {
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `test-results/responsive/home-${width}x${height}.png`,
        animations: 'disabled',
      });
    }
    // Navigation must reflect what is visible, not the last intersected section.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => document.querySelector('.portfolio-nav-links a.is-active')?.textContent === 'Home');
    if (width === 1440) {
      await page.locator('.portfolio-nav-links a[href="/#experience"]').click();
    await page.waitForFunction(() => location.hash === '#experience' && document.querySelector('.portfolio-nav-links a.is-active')?.textContent === 'Experience');
    await page.locator('.portfolio-nav-links a[href="/"]').click({ force: true });
    await page.waitForFunction(() => scrollY < 35 && document.querySelector('.portfolio-nav-links a.is-active')?.textContent === 'Home');
    await page.locator('.portfolio-nav-links a[href="/#work"]').click({ force: true });
    await page.waitForFunction(() => location.hash === '#work' && document.querySelector('.portfolio-nav-links a.is-active')?.textContent === 'Work');
    await page.locator('.portfolio-nav-links a[href="/"]').click({ force: true });
    await page.waitForFunction(() => scrollY < 35 && document.querySelector('.portfolio-nav-links a.is-active')?.textContent === 'Home');
      await page.getByRole('button', { name: 'Explore' }).click();
      await page.getByRole('dialog', { name: 'Portfolio navigation' }).waitFor();
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.activeElement?.textContent?.trim() === 'Explore');
    }
    if (width <= 760) {
      const menu = page.getByRole('button', { name: 'Open portfolio menu' });
      await menu.click();
      assert.equal(await page.getByRole('dialog', { name: 'Portfolio navigation' }).isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog', { name: 'Portfolio navigation' }).count(), 0);
      const toggle = page.getByRole('button', { name: /Explore architecture/ }).first();
      await toggle.click();
      await page.waitForFunction(() => document.querySelector('.portfolio-mobile-architecture-toggle')?.getAttribute('aria-expanded') === 'true');
      assert.equal(await page.locator('.portfolio-case-visual.is-mobile-open').first().isVisible(), true);
    }
    await page.goto(base + '/blog', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.bs-card').count() > 0, true, 'No blog cards at ' + width);
    const first = await page.locator('.bs-card-main').first().getAttribute('href');
    await page.goto(base + first, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.article h1').isVisible(), true, 'Article missing at ' + width);
    await page.close();
    console.log('PASS responsive browser test ' + width + 'px');
  }
  assert.deepEqual(errors, [], 'Browser JavaScript errors');
  const articles = await readdir('dist/blog', { withFileTypes: true });
  let checked = 0;
  for (const item of articles.filter(entry => entry.isDirectory())) {
    const html = await readFile('dist/blog/' + item.name + '/index.html', 'utf8');
    const count = pattern => [...html.matchAll(pattern)].length;
    assert.equal(count(/<link rel="canonical"/g), 1, item.name + ' canonical');
    assert.equal(count(/<meta property="og:title"/g), 1, item.name + ' og:title');
    assert.equal(count(/<meta property="og:url"/g), 1, item.name + ' og:url');
    assert.equal(count(/<meta name="twitter:card"/g), 1, item.name + ' twitter:card');
    checked++;
  }
  assert.ok(checked > 0, 'No generated article pages');
  console.log('PASS ' + checked + ' article SEO metadata checks');
} finally {
  await browser.close();
}
