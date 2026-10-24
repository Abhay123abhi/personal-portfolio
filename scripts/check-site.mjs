import { chromium } from 'playwright';
import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const widths = [320, 375, 390, 430, 768, 1024, 1440];
const errors = [];
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 850 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(width + ': ' + error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('h1').first().waitFor();
    assert.equal(await page.locator('h1').first().isVisible(), true, 'Missing hero at ' + width);
    assert.equal(await page.locator('a[href="/Abhay_SDE.pdf"]').first().isVisible(), true, 'Resume missing at ' + width);
    assert.equal(await page.locator('#work').count(), 1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
    assert.equal(overflow, false, 'Horizontal page overflow at ' + width);
    // Navigation must reflect what is visible, not the last intersected section.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => document.querySelector('.portfolio-nav-links a.is-active')?.textContent === 'Home');
    if (width === 1440) {
      await page.locator('.portfolio-nav-links a[href="/#experience"]').click();
    await page.waitForTimeout(400);
    console.log('NAV DEBUG experience', JSON.stringify(await page.evaluate(() => ({
      href: location.href, scrollY, hash: location.hash,
      experienceTop: document.getElementById('experience')?.getBoundingClientRect().top,
      workTop: document.getElementById('work')?.getBoundingClientRect().top,
      headerHeight: document.querySelector('.portfolio-nav-shell')?.getBoundingClientRect().height,
      active: [...document.querySelectorAll('.portfolio-nav-links a.is-active')].map(a => a.textContent)
    }))));
    await page.waitForFunction(() => location.hash === '#experience' && document.querySelector('.portfolio-nav-links a.is-active')?.textContent === 'Experience', { timeout: 7000 });
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
