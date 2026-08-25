/**
 * Подписка на письма.
 *
 * Сервиса рассылки у бренда пока нет, и форма, которая молча глотает адрес, —
 * хуже отсутствующей формы. Поэтому точка подстановки одна и явная:
 * переменная окружения SUBSCRIBE_URL. Пока её нет, ручка честно отвечает 501,
 * и форма показывает это словами.
 *
 * Когда сервис появится (Unisender, Sendsay, свой бэкенд), достаточно задать
 * SUBSCRIBE_URL — адрес уйдёт туда как { email } и ничего больше менять
 * не придётся.
 */
export async function POST(request: Request) {
  let email = ''
  try {
    email = String(((await request.json()) as { email?: unknown }).email ?? '').trim()
  } catch {
    return Response.json({ error: 'bad-request' }, { status: 400 })
  }

  // Проверка на границе доверия, а не в браузере: type="email" обходится.
  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(email) || email.length > 254) {
    return Response.json({ error: 'bad-email' }, { status: 400 })
  }

  const endpoint = process.env.SUBSCRIBE_URL
  if (!endpoint) return Response.json({ error: 'not-configured' }, { status: 501 })

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  return Response.json({ ok: res.ok }, { status: res.ok ? 200 : 502 })
}
