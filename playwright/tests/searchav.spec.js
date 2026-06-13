require('dotenv').config();
const { test, expect } = require('@playwright/test');

const USERNAME = process.env.TEST_USERNAME;
const PASSWORD = process.env.TEST_PASSWORD;

async function gotoHome(page) {
    await page.goto(
        'https://thuvienso.actvn.edu.vn/',
        {
            waitUntil: 'domcontentloaded',
            timeout: 120000
        }
    );
}

async function openAdvancedSearch(page) {
    await page.click('#search2');

    await expect(
        page.locator('#tipSearch2')
    ).toBeVisible();
}

async function advancedSearch(
    page,
    keyword,
    searchType,
    searchField
) {
    await openAdvancedSearch(page);

    await page.fill('#txt_search', keyword);

    await page.locator(
        `input[name="search_keyword2"][value="${searchType}"]`
    ).check();

    await page.locator(
        `input[name="search_keyword3"][value="${searchField}"]`
    ).check();

    await page.click('button.btn_orange_sm');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
}

async function searchBySource(page, keyword, source) {

    await page.fill('#txt_search', keyword);

    await page.selectOption('#typesearch', source);

    await page.click('button.btn_orange_sm');

    await page.waitForLoadState('domcontentloaded');
}

async function clickLogin(page) {
    await page.locator('button[onclick="login();"]').click();
    await page.waitForTimeout(3000);
}

test.describe('ADVANCED SEARCH TEST', () => {

    test.beforeEach(async ({ page }) => {
        await gotoHome(page);
    });

    test('Search chính xác theo tất cả các trường', async ({ page }) => {
        await advancedSearch(
            page,
            'Bài giảng An toàn mạng',
            '2',
            '0'
        );

        await expect(page)
            .toHaveURL(/typesearch3=2&typesearch4=0/);
        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search chính xác theo tiêu đề', async ({ page }) => {
        await advancedSearch(
            page,
            'Bài giảng An toàn mạng',
            '2',
            '1'
        );

        await expect(page)
            .toHaveURL(/typesearch3=2&typesearch4=1/);
        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search chính xác theo nội dung', async ({ page }) => {
        await advancedSearch(
            page,
            'Bài giảng An toàn mạng',
            '2',
            '2'
        );

        await expect(page)
            .toHaveURL(/typesearch3=2&typesearch4=2/);
        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search chính xác theo từ khóa', async ({ page }) => {
        await advancedSearch(
            page,
            'Bài giảng An toàn mạng',
            '2',
            '3'
        );

        await expect(page)
            .toHaveURL(/typesearch3=2&typesearch4=3/);
        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search ít nhất một từ - tất cả các trường', async ({ page }) => {
        await advancedSearch(
            page,
            'Bài giảng An toàn mạng',
            '3',
            '0'
        );

        await expect(page)
            .toHaveURL(/typesearch3=3&typesearch4=0/);
        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search ít nhất một từ - tiêu đề', async ({ page }) => {
        await advancedSearch(
            page,
            'Bài giảng An toàn mạng',
            '3',
            '1'
        );

        await expect(page)
            .toHaveURL(/typesearch3=3&typesearch4=1/);
        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search ít nhất một từ - nội dung', async ({ page }) => {
        await advancedSearch(
            page,
            'Bài giảng An toàn mạng',
            '3',
            '2'
        );

        await expect(page)
            .toHaveURL(/typesearch3=3&typesearch4=2/);
        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search ít nhất một từ - từ khóa', async ({ page }) => {
        await advancedSearch(
            page,
            'Bài giảng An toàn mạng',
            '3',
            '3'
        );

        await expect(page)
            .toHaveURL(/typesearch3=3&typesearch4=3/);
        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search TVS Trường', async ({ page }) => {
        await searchBySource(
            page,
            'Bài giảng An toàn mạng',
            '1'
        );

        await expect(page.url())
            .toContain('/tim-kiem/');
    });

    test('Search TaiLieuVN', async ({ page }) => {
        await searchBySource(
            page,
            'Bài giảng An toàn mạng',
            '2'
        );

        await expect(page.url())
            .toContain('/tailieuvn/tim-kiem/');
    });

    test('Search TV đa phương tiện', async ({ page }) => {
        await searchBySource(
            page,
            'Bài giảng An toàn mạng',
            '4'
        );

        await expect(page.url())
            .toContain('/tvm/tim-kiem/');
    });

    test('Tìm tài liệu nội bộ khi chưa đăng nhập', async ({ page }) => {
        await page.fill('#txt_search',
            'Giáo trình Luật pháp An toàn thông tin - Học viện Kỹ thuật mật mã');

        await page.click('button.btn_orange_sm');

        await page.waitForLoadState('domcontentloaded');

        await expect(page.locator('#box_search_main_result'))
            .toBeVisible();
        await expect(page.locator('#box_search_book_result'))
            .not.toContainText('Giáo trình Luật pháp An toàn thông tin - Học viện Kỹ thuật mật mã');
    });

    test('Tìm tài liệu nội bộ khi đã đăng nhập', async ({ page }) => {
        await page.fill('#txtLoginUsername', USERNAME);
        await page.fill('#txtLoginPassword', PASSWORD);

        await clickLogin(page);

        await page.fill('#txt_search',
            'Giáo trình Luật pháp An toàn thông tin - Học viện Kỹ thuật mật mã');

        await page.click('button.btn_orange_sm');

        await page.waitForLoadState('domcontentloaded');

        await expect(page.locator('#box_search_main_result'))
            .toBeVisible();
        await expect(page.locator('#box_search_book_result'))
            .toContainText('Giáo trình Luật pháp An toàn thông tin - Học viện Kỹ thuật mật mã');
    });
});