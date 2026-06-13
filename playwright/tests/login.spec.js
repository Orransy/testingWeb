require('dotenv').config();
const { test, expect } = require('@playwright/test');

const VALID_USER = process.env.TEST_USERNAME;
const VALID_PASS = process.env.TEST_PASSWORD;

async function gotoHome(page) {
    await page.goto(
        'https://thuvienso.actvn.edu.vn/',
        {
            waitUntil: 'domcontentloaded',
            timeout: 120000
        }
    );

    await page.waitForSelector('#txtLoginUsername');
}

async function clickLogin(page) {
    await page.locator('button[onclick="login();"]').click();
    await page.waitForTimeout(3000);
}

test.describe('ACTVN LOGIN TEST', () => {

    test.beforeEach(async ({ page }) => {
        await gotoHome(page);
    });

    // TC01
    test('Login thành công', async ({ page }) => {

        await page.fill('#txtLoginUsername', VALID_USER);
        await page.fill('#txtLoginPassword', VALID_PASS);

        await clickLogin(page);

        await expect(page.url()).toContain('/account/welcome');
    });

    // TC02
    test('Password sai', async ({ page }) => {

        await page.fill('#txtLoginUsername', VALID_USER);
        await page.fill('#txtLoginPassword', 'wrongpassword');

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
        await expect(
            page.getByText('Mật khẩu chưa đúng!')
        ).toBeVisible();
    });

    // TC03
    test('Username sai', async ({ page }) => {

        await page.fill('#txtLoginUsername', 'wronguser');
        await page.fill('#txtLoginPassword', VALID_PASS);

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
        await expect(
            page.getByText('Tên đăng nhập không tồn tại!')
        ).toBeVisible();
    });

    // TC04
    test('Username và Password sai', async ({ page }) => {

        await page.fill('#txtLoginUsername', 'abc');
        await page.fill('#txtLoginPassword', 'xyz');

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
        await expect(
            page.getByText('Tên đăng nhập không tồn tại!')
        ).toBeVisible();
    });

    // TC05
    test('Username rỗng', async ({ page }) => {
        page.once('dialog', async dialog => {
            expect(dialog.message())
                .toContain('Bạn vui lòng nhập tên đăng nhập!');
            await dialog.accept();
        });
        
        await page.fill('#txtLoginPassword', VALID_PASS);

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
    });

    // TC06
    test('Password rỗng', async ({ page }) => {
        page.once('dialog', async dialog => {
            expect(dialog.message())
                .toContain('mật khẩu');
            await dialog.accept();
        });

        await page.fill('#txtLoginUsername', VALID_USER);

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
    });

    // TC07
    test('Username và Password rỗng', async ({ page }) => {
        page.once('dialog', async dialog => {
            expect(dialog.message())
                .toContain('tên đăng nhập');
            await dialog.accept();
        });

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
    });

    // TC08
    test('Username có khoảng trắng đầu', async ({ page }) => {

        await page.fill('#txtLoginUsername', ` ${VALID_USER}`);
        await page.fill('#txtLoginPassword', VALID_PASS);

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
        await expect(
            page.getByText('Tên đăng nhập không tồn tại!')
        ).toBeVisible();
    });

    // TC09
    test('Username có khoảng trắng cuối', async ({ page }) => {

        await page.fill('#txtLoginUsername', `${VALID_USER} `);
        await page.fill('#txtLoginPassword', VALID_PASS);

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
        await expect(
            page.getByText('Tên đăng nhập không tồn tại!')
        ).toBeVisible();
    });

    // TC11
    test('Password có khoảng trắng đầu', async ({ page }) => {

        await page.fill('#txtLoginUsername', VALID_USER);
        await page.fill('#txtLoginPassword', ` ${VALID_PASS}`);

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
        await expect(
            page.getByText('Mật khẩu chưa đúng!')
        ).toBeVisible();
    });

    // TC12
    test('Password có khoảng trắng cuối', async ({ page }) => {

        await page.fill('#txtLoginUsername', VALID_USER);
        await page.fill('#txtLoginPassword', `${VALID_PASS} `);

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
        await expect(
            page.getByText('Mật khẩu chưa đúng!')
        ).toBeVisible();
    });

    // TC10
    test('Username rất dài', async ({ page }) => {

        await page.fill('#txtLoginUsername', 'a'.repeat(300));
        await page.fill('#txtLoginPassword', VALID_PASS);

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
        await expect(
            page.getByText('Tên đăng nhập không tồn tại!')
        ).toBeVisible();
    });

    // TC13
    test('Password rất dài', async ({ page }) => {

        await page.fill('#txtLoginUsername', VALID_USER);
        await page.fill('#txtLoginPassword', 'a'.repeat(300));

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
        await expect(
            page.getByText('Mật khẩu chưa đúng!')
        ).toBeVisible();
    });

    // TC14
    test('SQL Injection', async ({ page }) => {

        await page.fill('#txtLoginUsername', "' OR 1=1 --");
        await page.fill('#txtLoginPassword', "' OR 1=1 --");

        await clickLogin(page);

        await expect(page.url()).not.toContain('/account/welcome');
    });

});