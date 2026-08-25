/**
 * Прогрев кэша картинок после сборки.
 *
 * Next оптимизирует изображения по запросу: первый, кто попросит кадр в
 * нужном размере, ждёт, пока сервер его пересоберёт. На витрине это 22
 * картинки на главной, и на холодном кэше каждая стоит 100–450 мс. Платит за
 * это первый посетитель после каждого выката — ровно тот, кому мы меньше
 * всего хотим показать пустые плитки.
 *
 * Скрипт проходит по картам сайта, вынимает из разметки все ссылки вида
 * /_next/image и запрашивает их сам. Дальше кэш живёт месяц (minimumCacheTTL
 * в next.config), и живые посетители получают готовые файлы.
 *
 * Браузер не нужен: разбираем HTML регулярным выражением, потому что нам
 * нужны только адреса, а они лежат в srcset готовой строкой.
 *
 * Запуск: node scripts/warm-images.mjs [базовый-адрес]
 * По умолчанию http://localhost:3000 — то есть сразу после `next start`.
 */
const BASE = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')
const CONCURRENCY = 4

const text = async (url) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

/** Адреса страниц берём из карты сайта: она уже перечисляет всё, что есть. */
async function routes() {
  const xml = await text(`${BASE}/sitemap.xml`)
  const found = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  return [...new Set(found.map((u) => new URL(u).pathname))]
}

/** Ссылки на оптимизированные картинки из готовой разметки страницы. */
function imagesIn(html) {
  return [...html.matchAll(/\/_next\/image\?[^"'\s]+/g)]
    .map((m) => m[0].replace(/&amp;/g, '&'))
    .filter((u) => u.includes('url='))
}

async function run(tasks, worker) {
  const queue = [...tasks]
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    for (let item = queue.shift(); item; item = queue.shift()) await worker(item)
  })
  await Promise.all(workers)
}

const started = Date.now()
const paths = await routes()
const urls = new Set()

await run(paths, async (path) => {
  try {
    for (const img of imagesIn(await text(BASE + path))) urls.add(img)
  } catch (e) {
    console.warn('пропущено:', path, String(e.message))
  }
})

let done = 0
let failed = 0
await run([...urls], async (u) => {
  try {
    const res = await fetch(BASE + u)
    if (res.ok) {
      await res.arrayBuffer()
      done++
    } else failed++
  } catch {
    failed++
  }
})

console.log(
  `прогрето ${done} из ${urls.size} картинок на ${paths.length} страницах` +
    (failed ? `, не удалось ${failed}` : '') +
    ` — ${((Date.now() - started) / 1000).toFixed(1)} с`,
)
