import { test, expect, acct } from '@fixtures/fixtures';
import moment from "moment";

test.describe.configure({ mode: 'serial' })

const invoiceData = {
    contact: "Systima AS",
    amount: "100",
    invoiceDate: "01.01.2024",
    dueDate: "15.01.2024",
    account: "1000 Utvikling, ervervet"
};

test.describe('Create Purchase', () => {

    test.beforeEach(async ({ page, loginPage }) => {
        await page.goto('/login');
        await loginPage.login({username: acct.test_user.username, password: acct.test_user.password});
    });

    test('Create Purchase', async ({ 
        page,
        dashboardPage,
        basePage
    }) => {
        await test.step('Menu -> Bokføring -> Bokfør andre filer', async () => {
            await basePage.click(dashboardPage.bokforingBtn);
            await basePage.click(dashboardPage.bokforAndreFilerBtn);
            await expect(page).toHaveURL(/\/purchase/);
        });

        await test.step(
            'Contact: Select "Systima AS" from "Kontakt (Valgfri ved kvittering)" - ' + 
            'Amount: Enter "100" in "Totalt beløp inkl. mva*" - ' + 
            'Invoice Date: Enter "01.01.2024" in "Fakturadato *" - ' + 
            'Due Date: Enter "15.01.2024" in "Forfallsdato" - ' + 
            'Account: Select "1000 Utvikling, ervervet" in "Konto *" - ', async () => {
                await dashboardPage.selectKontaktDropdown(invoiceData.contact);
                await basePage.fill(dashboardPage.totaltBelopInklMvaInput, invoiceData.amount);
                await basePage.fill(dashboardPage.facturadatoInput, String(moment(invoiceData.invoiceDate, 'DD.MM.YYYY').add(1, 'd').format('DD.MM.YYYY')));
                await basePage.fill(dashboardPage.fortallsdatoInput, String(moment(invoiceData.dueDate, 'DD.MM.YYYY').add(1, 'd').format('DD.MM.YYYY')));
                await dashboardPage.selectKontoDropdown(invoiceData.account);
        });

        await test.step(
            'Click "Bokfør" button - ' +
            'Green success message displays: "Bilag opprettet med bilagsnr. [vouchernb]" - ' +
            'Form should be cleared', async () => {
                await basePage.click(dashboardPage.bokforBtn);
                await expect.soft(dashboardPage.popupMsg).toBeVisible();
                await expect.soft(dashboardPage.popupMsg).toContainText("Bilag opprettet med bilagsnr.");
                await expect.soft(dashboardPage.kontaktInput).toBeEmpty();
                await expect.soft(dashboardPage.totaltBelopInklMvaInput).toBeEmpty();
                await expect.soft(dashboardPage.facturadatoInput).toBeEmpty();
                await expect.soft(dashboardPage.fortallsdatoInput).toBeEmpty();
                await expect(dashboardPage.kontoInput).toBeEmpty();
        });
    });
});