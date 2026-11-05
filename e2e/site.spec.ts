import { expect, test, type Page } from "@playwright/test"

import { expectNoSeriousA11yIssues } from "./axe"

/** A 1×1 transparent PNG for every cover request. */
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64"
)

const work = (n: number) => ({
  key: `/works/OL${n}W`,
  title: `Buku ${n}`,
  cover_id: n,
  first_publish_year: 2000 + n,
  authors: [{ name: `Penulis ${n}` }],
})

/** Answer Open Library and its covers from fixtures, so specs never depend on it. */
async function stubOpenLibrary(page: Page) {
  await page.route("https://covers.openlibrary.org/**", (route) =>
    route.fulfill({ contentType: "image/png", body: PNG })
  )
  await page.route("https://openlibrary.org/**", (route) => {
    const url = new URL(route.request().url())
    const json = (body: unknown) =>
      route.fulfill({
        contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(body),
      })
    if (url.pathname.startsWith("/subjects/"))
      return json({ work_count: 2, works: [work(1), work(2)] })
    if (url.pathname === "/search.json")
      return json({
        numFound: 1,
        docs: [
          {
            key: "/works/OL307247W",
            title: "Bumi Manusia",
            author_name: ["Pramoedya Ananta Toer"],
            cover_i: 6643692,
            first_publish_year: 1980,
          },
        ],
      })
    if (url.pathname === "/works/OL307247W.json")
      return json({
        key: "/works/OL307247W",
        title: "Bumi Manusia",
        description: "Novel pertama Tetralogi Buru.",
        subjects: ["Fiksi Indonesia"],
        covers: [6643692],
        first_publish_date: "1980",
        authors: [{ author: { key: "/authors/OL1A" } }],
      })
    if (url.pathname === "/authors/OL1A.json")
      return json({ name: "Pramoedya Ananta Toer" })
    return route.fulfill({ status: 404, body: "" })
  })
}

test.beforeEach(async ({ page }) => {
  await stubOpenLibrary(page)
})

test("home shows a row of books per subject and credits Open Library", async ({
  page,
}) => {
  await page.goto("./")
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Katalog perpustakaan terbuka",
    })
  ).toBeVisible()
  const fiction = page.getByRole("region", { name: "Fiksi" })
  await expect(fiction.getByText("Buku 1")).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Data dan sampul buku: Open Library" })
  ).toBeVisible()
})

test("search leads to the results and on to the book", async ({ page }) => {
  await page.goto("./")
  await page
    .getByRole("navigation", { name: "Halaman" })
    .getByRole("button", { name: "Cari" })
    .click()
  const dialog = page.getByRole("dialog", { name: "Cari buku" })
  await dialog.getByRole("textbox", { name: "Cari buku" }).fill("pramoedya")
  await dialog.getByRole("button", { name: "Cari" }).click()

  await expect(
    page.getByRole("heading", { name: "Hasil pencarian: pramoedya" })
  ).toBeVisible()
  await expect(page.getByRole("status")).toHaveText("1 buku ditemukan")

  await page.getByRole("link", { name: /Bumi Manusia/ }).click()
  await expect(
    page.getByRole("heading", { level: 1, name: "Bumi Manusia" })
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Lihat di Open Library" })
  ).toHaveAttribute("href", "https://openlibrary.org/works/OL307247W")
})

test("switches to English and keeps it after a reload", async ({ page }) => {
  await page.goto("./")
  await page
    .getByRole("navigation", { name: "Halaman" })
    .getByRole("combobox", { name: "Bahasa" })
    .selectOption("en")
  await expect(
    page.getByRole("heading", { level: 1, name: "An open library catalog" })
  ).toBeVisible()
  await expect(page.locator("html")).toHaveAttribute("lang", "en")

  await page.reload()

  await expect(
    page.getByRole("heading", { level: 1, name: "An open library catalog" })
  ).toBeVisible()
})

test("the first Tab reaches 'skip to content', which moves focus", async ({
  page,
}) => {
  await page.goto("./")
  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("link", { name: "Lompat ke konten" })
  ).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("main")).toBeFocused()
})

for (const [label, path, ready] of [
  ["home", "./", "Buku 1"],
  ["books", "books/?subject=history", "Buku 1"],
  ["book", "book/?id=OL307247W", "Novel pertama Tetralogi Buru."],
] as const) {
  test(`${label} page has no serious accessibility issues, on desktop and at 360 px`, async ({
    page,
  }) => {
    await page.goto(path)
    await expect(page.getByText(ready).first()).toBeVisible()
    await expectNoSeriousA11yIssues(page, `${label}, desktop`)

    await page.setViewportSize({ width: 360, height: 740 })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    )
    expect(overflow, "no horizontal scroll at 360 px").toBe(false)
    await expectNoSeriousA11yIssues(page, `${label}, 360 px`)
  })
}
