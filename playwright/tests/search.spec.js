const { test, expect } = require('@playwright/test');

async function gotoHome(page) {
    await page.goto(
        'https://thuvienso.actvn.edu.vn/',
        {
            waitUntil: 'domcontentloaded',
            timeout: 120000
        }
    );
}

async function search(page, keyword) {

    await page.fill('#txt_search', keyword);

    await page.click('button.btn_orange_sm');

    await page.waitForLoadState('domcontentloaded');

    await page.waitForTimeout(2000);
}

test.describe('ACTVN SEARCH TEST', () => {

    test.beforeEach(async ({ page }) => {
        await gotoHome(page);
    });

    test('Search rỗng', async ({ page }) => {
        page.on('dialog', async dialog => {
            expect(dialog.message())
                .toContain('Vui lòng nhập từ khoá cần tìm vào.');
            await dialog.accept();
        });

        await page.click('button.btn_orange_sm');
    });

    test('Search chữ thường', async ({ page }) => {
        await search(page, 'bài giảng an toàn mạng');

        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search chữ hoa', async ({ page }) => {
        await search(page, 'BÀI GIẢNG AN TOÀN MẠNG');

        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search trộn hoa thường', async ({ page }) => {
        await search(page, 'Bài GiảNg An toàn MẠNG');

        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search có dấu', async ({ page }) => {
        await search(page, 'Bài giảng An toàn mạng');

        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search không dấu', async ({ page }) => {
        await search(page, 'Bai giang An toan mang');

        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search nhiều khoảng trắng giữa từ', async ({ page }) => {
        await search(page, 'Bài giảng      An toàn mạng');

        await expect(page.locator('#box_search_book_result'))
            .toContainText('Bài giảng An toàn mạng');
    });

    test('Search chuỗi rất dài', async ({ page }) => {
        await search(page, 'a'.repeat(500));

        await expect(page.locator('#box_search_main_result'))
            .toBeVisible();
    });

    test('Search từ khóa không tồn tại', async ({ page }) => {
        await search(page, 'h1search');

        await expect(page.locator('#box_search_book_result'))
            .toContainText('Dữ liệu đang cập nhật.');
    });

    const specialChars = [
        '!', '@', '#', '$', '%', '^',
        '&', '*', '(', ')', '_', '-',
        '<', '>', ',', '.', '/', '?',
        ';', ':', "'", '"', '[', ']',
        '{', '}', '\\', '|', '=', '+',
        '`', '~'
    ];

    specialChars.forEach(char => {
        test(`Search ký tự đặc biệt: ${char}`, async ({ page }) => {
            await search(page, char);

            //#?
            await expect(
                page.locator('#box_search_main_result')
            ).toBeVisible();

            //&<>/\'".
            await expect(page.locator('body'))
                .not.toContainText('403 Forbidden');

            //%
            await expect(page.locator('body'))
                .not.toContainText('400 Bad Request');
        });
    });
});