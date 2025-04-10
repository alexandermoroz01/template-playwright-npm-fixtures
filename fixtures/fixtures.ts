import { test as base } from '@playwright/test';
import ContactPage from '@pages/contacts.page';
import LoginPage from '@pages/login.page';
import DashboardPage from '@pages/dashboard.page';
import BasePage from '@pages/base.page';

import * as fs from 'fs';

const accountData = fs.readFileSync('./environment/accounts.json', 'utf-8');
const acct = JSON.parse(accountData);

type PageObjects = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  contactPage: ContactPage;
  basePage: BasePage;
};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use, testInfo) => {
    await use(new LoginPage(page, testInfo));
  },

  dashboardPage: async ({ page }, use, testInfo) => {
    await use(new DashboardPage(page, testInfo));
  },

  contactPage: async ({ page }, use, testInfo) => {
    await use(new ContactPage(page, testInfo));
  },

  basePage: async ({ page }, use, testInfo) => {
    await use(new BasePage(page, testInfo));
  }
});

export {acct};
export {expect} from '@playwright/test';
