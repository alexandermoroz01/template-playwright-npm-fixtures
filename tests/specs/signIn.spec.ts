import { test, expect, acct } from '@fixtures/fixtures';

test.describe.configure({ mode: 'serial' })

test.describe('Sign In', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('Successful Login', async ({ 
        page,
        loginPage,
        dashboardPage,
        basePage
    }) => {
        await test.step(
            'Enter username: joachim+453459@systima.no - ' + 
            `Enter password: 123456789 - ` +
            `Click login button - ` +
            `User should be redirected to dashboard`, async () => {
                await loginPage.login({username: acct.test_user.username, password: acct.test_user.password});
                await expect(page).toHaveURL(dashboardPage.endpoint);
        });
    });
  
    test('Failed Login', async ({ 
        page,
        loginPage,
        dashboardPage,
        basePage
    }) => {
        await test.step(                
            'Enter invalid credentials - ' + 
            `Click login button - ` +
            `Error message should be displayed`, async () => {
                await loginPage.login({username: "test@test.com", password: "test"});
                await expect(loginPage.alertMsg).toBeVisible();
                await expect(loginPage.alertMsg).toHaveText("Feil brukernavn / passord");
                await expect(page).not.toHaveURL(dashboardPage.endpoint);
        });
    });
});