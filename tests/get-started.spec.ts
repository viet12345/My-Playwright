import { test as base, expect } from '@playwright/test';

/**
 * Custom command: loginByUI
 * Đăng nhập qua giao diện người dùng
 */
async function loginByUI(page) {
  await page.goto('http://localhost:3000/signin');
  await page.fill('input[name="username"], input[type="text"]', 'Heath93');
  await page.fill('input[name="password"], input[type="password"]', 's3cret');
  await page.click('button[type="submit"], button:has-text("Sign in")');
  // Chờ xác nhận đăng nhập thành công (ví dụ: chuyển hướng hoặc hiển thị dashboard)
  await page.waitForURL('**/dashboard', { timeout: 5000 }).catch(() => {});
  // Hoặc xác nhận bằng một selector đặc trưng sau đăng nhập
  // await expect(page.locator('text=Welcome')).toBeVisible();
}

// Sử dụng loginByUI trong beforeEach hook cho các test cần đăng nhập
const test = base.extend({
  page: async ({ page }, use) => {
    await loginByUI(page);
    await use(page);
  },
});

export { test, expect };

test('Menu navigator phải có đủ Home, My Account, Bank Accounts, Notifications', async ({ page }) => {
  // Kiểm tra từng menu item có hiển thị
  await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /My Account/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Bank Accounts/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Notifications/i })).toBeVisible();
});

test('Trang chủ hiển thị đủ 3 tab EVERYONE, FRIENDS, MINE', async ({ page }) => {
  await expect(page.getByRole('tab', { name: /EVERYONE/i })).toBeVisible();
  await expect(page.getByRole('tab', { name: /FRIENDS?/i })).toBeVisible();
  await expect(page.getByRole('tab', { name: /MINE/i })).toBeVisible();
});

test('Header hiển thị button có data-testid="AttachMoneyIcon" và button có data-test="nav-top-notifications-link"', async ({ page }) => {
  // Kiểm tra button AttachMoneyIcon
  await expect(page.locator('[data-testid="AttachMoneyIcon"]')).toBeVisible();
  // Kiểm tra button Bell Notification theo data-test
  await expect(page.locator('[data-test="nav-top-notifications-link"]')).toBeVisible();
});

test('Tất cả menu navigator, tab, button AttachMoneyIcon và Bell Notification có thể click', async ({ page }) => {
  // Menu navigator
  const menuNames = ['Home', 'My Account', 'Bank Accounts', 'Notifications'];
  for (const name of menuNames) {
    const menu = page.getByRole('link', { name: new RegExp(name, 'i') });
    await expect(menu).toBeVisible();
    await menu.click();
    await page.goto('http://localhost:3000');
  }
  // Tabs
  const tabNames = ['EVERYONE', 'FRIENDS?', 'MINE'];
  for (const name of tabNames) {
    const tab = page.getByRole('tab', { name: new RegExp(name, 'i') });
    await expect(tab).toBeVisible();
    await tab.click();
  }
  // Button AttachMoneyIcon
  const moneyBtn = page.locator('[data-testid="AttachMoneyIcon"]');
  if (await moneyBtn.isVisible()) {
    await moneyBtn.click();
  }
  // Button Bell Notification
  const bellButton = page.locator('[data-test="nav-top-notifications-link"]');
  if (await bellButton.isVisible()) {
    await bellButton.click();
  }
});