import { test, Page, expect } from '@playwright/test'

const name = () => `name-${Date.now()}`;
const email = () => `name-${Date.now()}-${Math.random()}@testo.com`;
test.describe('Registration', { tag: '@auth'}, () => {
    test('TC-001, Registration of new user', async ({ page }) => {
        await page.goto('/register');
        await page.getByTestId('auth-username').fill(name());
        await page.getByTestId('auth-email').fill(email());
        await page.getByTestId('auth-password').fill(`ValPass12^`);
        await page.getByTestId('register-confirm-password').fill(`ValPass12^`);
        await page.getByTestId('register-terms').click();
        await page.getByTestId('auth-submit').click();
        await expect(page.getByTestId('nav-profile')).toBeVisible();
    });
    test('TC-002, Registration with existing email', async ({ page }) => {
        const existingEmail = email();

        await page.goto('/register');
        await page.getByTestId('auth-username').fill(name());
        await page.getByTestId('auth-email').fill(existingEmail);
        await page.getByTestId('auth-password').fill(`ValPass12^`);
        await page.getByTestId('register-confirm-password').fill(`ValPass12^`);
        await page.getByTestId('register-terms').click();
        await page.getByTestId('auth-submit').click();
        await expect(page.getByTestId('nav-profile')).toBeVisible();

        await page.goto('/register');
        await page.getByTestId('auth-username').fill(name());
        await page.getByTestId('auth-email').fill(existingEmail);
        await page.getByTestId('auth-password').fill(`ValPass12^`);
        await page.getByTestId('register-confirm-password').fill(`ValPass12^`);
        await page.getByTestId('register-terms').click();
        await page.getByTestId('auth-submit').click();

        await expect(page.getByTestId('error-messages')).toHaveText(
        `body email або username вже зайняті`);
    });
    test('TC-003, Registration with invalid data', async ({ page }) => {
        await page.goto('/register');
        await page.getByTestId('auth-username').fill(name());
        await page.getByTestId('auth-email').pressSequentially(`testtesco.do`);
        await page.getByTestId('auth-password').fill(`ValPass12^`);
        await page.getByTestId('register-confirm-password').fill(`ValPass12^`);
        await page.getByTestId('register-terms').click();
        await page.getByTestId('auth-submit').click();
        await expect(page.getByTestId('nav-profile')).not.toBeVisible();
    });
});

test.describe('Login', { tag: `@login`}, () => {
    test('TC-004, Login with valid data', async ({ page }) => {
        const userEmail = email();

        await page.goto('/register');
        await page.getByTestId('auth-username').fill(name());
        await page.getByTestId('auth-email').fill(userEmail);
        await page.getByTestId('auth-password').fill(`ValPass12^`);
        await page.getByTestId('register-confirm-password').fill(`ValPass12^`);
        await page.getByTestId('register-terms').click();
        await page.getByTestId('auth-submit').click();
        await page.getByTestId('nav-profile').click();
        await page.getByRole('link', { name: 'Edit profile' }).click();
        await page.getByTestId('logout-button').click();
        await expect(page.getByTestId('nav-profile')).not.toBeVisible();

        await page.getByTestId('nav-sign-in').click();
        await page.getByTestId('auth-email').fill(userEmail);
        await page.getByTestId('auth-password').fill(`ValPass12^`);
        await page.getByTestId('auth-submit').click();
        await expect(page.getByTestId('nav-profile')).toBeVisible();
    });
    test('TC-005, Login with incorrect password', async ({ page }) => {
        const userEmail = email();

        await page.goto('/register');
        await page.getByTestId('auth-username').fill(name());
        await page.getByTestId('auth-email').fill(userEmail);
        await page.getByTestId('auth-password').fill(`ValPass12^`);
        await page.getByTestId('register-confirm-password').fill(`ValPass12^`);
        await page.getByTestId('register-terms').click();
        await page.getByTestId('auth-submit').click();
        await page.getByTestId('nav-profile').click();
        await page.getByRole('link', { name: 'Edit profile' }).click();
        await page.getByTestId('logout-button').click();
        await expect(page.getByTestId('nav-profile')).not.toBeVisible();

        await page.getByTestId('nav-sign-in').click();
        await page.getByTestId('auth-email').fill(userEmail);
        await page.getByTestId('auth-password').fill(`ValPass123^`);
        await page.getByTestId('auth-submit').click();
        await expect(page.getByText('email or password неправильні')).toBeVisible();
    });
    test('TC-005, Login with unknown email', async ({ page }) => {
        const userEmail = email();

        await page.goto('/register');
        await page.getByTestId('auth-username').fill(name());
        await page.getByTestId('auth-email').fill(userEmail);
        await page.getByTestId('auth-password').fill(`ValPass12^`);
        await page.getByTestId('register-confirm-password').fill(`ValPass12^`);
        await page.getByTestId('register-terms').click();
        await page.getByTestId('auth-submit').click();
        await page.getByTestId('nav-profile').click();
        await page.getByRole('link', { name: 'Edit profile' }).click();
        await page.getByTestId('logout-button').click();
        await expect(page.getByTestId('nav-profile')).not.toBeVisible();

        await page.getByTestId('nav-sign-in').click();
        await page.getByTestId('auth-email').fill(`new-${userEmail}`);
        await page.getByTestId('auth-password').fill(`ValPass12^`);
        await page.getByTestId('auth-submit').click();
        await expect(page.getByText('email or password неправильні')).toBeVisible();
    });
});