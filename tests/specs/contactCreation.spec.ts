import {test, expect, acct} from '@fixtures/fixtures';
test.describe.configure({ mode: 'serial' })

test.describe('Contact Creation', () => {

    test.beforeEach(async ({ page, loginPage }) => {
        await page.goto('/login');
        await loginPage.login({username: acct.test_user.username, password: acct.test_user.password});
    });

    test('Validation', async ({ 
        dashboardPage,
        contactPage,
        basePage
    }) => {
        await test.step('Menu -> Kontakter', async () => {
            await basePage.click(dashboardPage.kontakterBtn);
        });

        await test.step('Click "Ny kontakt" button', async () => {
            await basePage.click(contactPage.nyKontaktBtn);
            await expect(contactPage.leverandorInput).not.toBeEmpty({timeout: 30000});
        });

        await test.step('Click "Opprett kontakt" button - ' +
            'Contact creation should fail - ' +
            'Red validation error should appear under "Navn" field', async () => {
                await basePage.click(contactPage.opprettKontaktBtn);
                await expect(contactPage.errorLabelByText(`Vennligst skriv inn navn`)).toBeVisible();
        });
    });
    test('Success', async ({ 
        dashboardPage,
        contactPage,
        basePage
    }) => {
        let testData = `test+${Date.now()}`;

        await test.step('Menu -> Kontakter', async () => {
            await basePage.click(dashboardPage.kontakterBtn);
        });

        await test.step('Click "Ny kontakt" button', async () => {
            await basePage.click(contactPage.nyKontaktBtn);
            await expect(contactPage.leverandorInput).not.toBeEmpty({timeout: 30000});
        });

        await test.step('Enter "Test" in "Navn" field', async () => {
            await basePage.fill(contactPage.navnInput, testData)
        });

        await test.step('Click "Opprett kontakt" button - ' +
            'Contact should be created - ' +
            'Green success message: "Ny kontakt lagret."', async () => {
                await basePage.click(contactPage.opprettKontaktBtn);
                await expect(contactPage.popupMsg).toBeVisible();
                await expect(contactPage.popupMsg).toContainText('Ny kontakt lagret.');
                await basePage.fill(contactPage.sokInput, testData);
                await expect(contactPage.navnByText(testData)).toBeVisible();
        });
    });
});