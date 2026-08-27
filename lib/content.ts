/**
 * Строки интерфейса. Единственный источник текста.
 *
 * Три языка заданы клиентом: английский, русский, арабский.
 * Арабские строки — обычный литературный арабский, без транслитерации.
 * Всё, что выглядит как `— СЛОВО —`, — намеренная дыра под данные клиента.
 */

import type { Locale, PluralForms } from './i18n'

export const BRAND = 'GLASS'
export const BRAND_SUB = 'OWM'

/**
 * Изготовитель. Юридическое имя не переводится и не склоняется: во всех трёх
 * витринах стоит ровно так, как в документах.
 */
export const MAKER = 'ИП Лелари Светлана Витальевна'

/**
 * Внешние площадки бренда.
 *
 * Инстаграм назван в брифе действующей площадкой — до сих пор на него не вело
 * ни одной ссылки. Ссылка одна и живёт здесь, а не в разметке футера: смена
 * аккаунта не должна быть правкой вёрстки.
 */
export const SOCIAL = [
  { name: 'Instagram', href: 'https://www.instagram.com/glass.eyelashes/' },
] as const

/** Прайс от клиента не получен. Ноль в данных — это дыра, а не «бесплатно». */
export const PRICE_BLANK: Record<string, string> = {
  ru: '— ЦЕНА —',
  en: '— PRICE —',
  ar: '— السعر —',
}

export const BLANKS = {
  phone: '— ТЕЛЕФОН —',
  email: '— EMAIL —',
  address: '— АДРЕС —',
  inn: '— РЕКВИЗИТЫ —',
  /** Значение, которого у нас нет: материал, сертификат, порог доставки. */
  data: '— ДАННЫЕ —',
  /** Срок доставки. Считает перевозчик по адресу, у нас его нет. */
  term: '— СРОК —',
  /** Настоящий отзыв покупателя. Выдумывать отзывы бриф запрещает прямо. */
  review: '— ОТЗЫВ —',
} as const

type Dict = {
  meta: { title: string; description: string }
  nav: {
    shop: string
    lashes: string
    care: string
    tools: string
    about: string
    search: string
    searchHint: string
    cart: string
    favorites: string
    menu: string
    close: string
    account: string
  }
  home: {
    marquee: string
    /** Верхняя полоса: с чего бренд начинает знакомство. Не со скидки. */
    announce: string
    heroLine: string
    heroNote: string
    heroCta: string
    bestTitle: string
    newTitle: string
    categoriesTitle: string
    editorialTitle: string
    editorialBody: string
    editorialCta: string
    promoTitle: string
    promoBody: string
    all: string
  }
  /**
   * Продающая структура главной, присланная клиентом: желание → продукт →
   * образы → результат → качество → доверие → выбор → покупка.
   * Порядок ключей повторяет порядок блоков на странице.
   */
  blocks: {
    featureKicker: string
    featureCta: string
    looksTitle: string
    looks: { name: string; effect: string; spec: string }[]
    realTitle: string
    realNote: string
    realSteps: string[]
    whyTitle: string
    why: { title: string; body: string }[]
    baTitle: string
    baNote: string
    baBefore: string
    baAfter: string
    collectionsTitle: string
    collectionsNote: string
    reviewsTitle: string
    reviewsNote: string
    stepsTitle: string
    steps: { title: string; body: string }[]
    trustTitle: string
    trustNote: string
    trust: { title: string; body: string }[]
    finalTitle: string
    finalCta: string
    /** Подбор по длине и изгибу внутри блока образов. */
    finderTitle: string
    /** Заголовок того же подбора, когда он стоит отдельной секцией каталога. */
    finderExact: string
    /** Кнопка «положить всё нужное сразу» в блоке про нанесение. */
    kitCta: string
    kitDone: string
  }
  info: {
    about: {
      title: string
      lead: string
      /** Строка бренда о себе. Стоит между заголовком и текстом, набором крупнее. */
      claim: string
      body: string[]
    }
    contacts: { title: string; lead: string; phone: string; address: string }
    delivery: {
      title: string
      lead: string
      body: string[]
      /** Способы доставки таблицей: чем везут, куда, за сколько и почём. */
      methodsTitle: string
      methodsCols: { name: string; zone: string; time: string; cost: string }
      methods: { name: string; zone: string; time: string; cost: string }[]
    }
    returns: { title: string; lead: string; body: string[] }
    privacy: { title: string; lead: string; body: string[] }
  }
  notFound: { title: string; note: string; cta: string; home: string }
  catalog: {
    title: string
    filters: string
    sort: string
    sortPopular: string
    sortPriceUp: string
    sortPriceDown: string
    sortNew: string
    reset: string
    apply: string
    found: string
    empty: string
    emptyHint: string
    inStock: string
    outOfStock: string
    availability: string
    /** Подпись кнопки возврата к началу списка. Читается только с экрана. */
    toList: string
    price: string
    category: string
    length: string
    curl: string
    volume: string
    from: string
    to: string
    breadcrumbs: string
    /** Подпись под заголовком раздела: что вообще лежит в каталоге. */
    lead: string
    /** «21 позиция» — формы слова, выбор формы делает Intl.PluralRules. */
    items: PluralForms
    /** Заголовок ряда снятых фильтров. */
    active: string
    /** Что делает крестик на чипе выбранного фильтра. */
    removeFilter: string
    /** Ряд входов в категории под заголовком раздела. */
    sections: string
  }
  product: {
    add: string
    added: string
    unavailable: string
    description: string
    specs: string
    delivery: string
    deliveryBody: string
    care: string
    related: string
    gallery: string
    zoom: string
    prev: string
    next: string
    photoBlank: string
    variant: string
    sku: string
    /** Лента истории просмотра в карточке товара. */
    recent: string
    /** Заголовок секции с раскрывающимися блоками: не дублирует «Описание». */
    about: string
    /** Как наносить и снимать. Данные бренда, только у ресниц. */
    usage: string
    usageBody: string[]
    /** Предупреждение бренда: клей продаётся отдельно. */
    noGlue: string
    specMaterial: string
    specMaterialValue: string
    specSkin: string
    specSkinValue: string
    specCountry: string
    specCountryValue: string
    specMaker: string
  }
  /** Избранное: страница со списком отмеченных товаров. */
  favorites: {
    title: string
    lead: string
    empty: string
    emptyHint: string
  }
  cart: {
    title: string
    empty: string
    toShop: string
    item: string
    qty: string
    remove: string
    promo: string
    promoApply: string
    promoOk: string
    promoBad: string
    subtotal: string
    shipping: string
    shippingFree: string
    total: string
    checkout: string
    country: string
    method: string
    courier: string
    pickup: string
    cdek: string
    post: string
    /** Пока прайса нет, суммы не считаются — эта строка объясняет почему. */
    pricePending: string
  }
  search: {
    loading: string
    all: string
    suggestions: string
    emptyHint: string
  }
  badges: { hit: string; new: string; sale: string }
  promo: { copy: string; copied: string }
  region: { title: string; note: string; confirm: string }
  actions: { quickAdd: string; undo: string; removed: string }
  footer: {
    lang: string
    currency: string
    country: string
    care: string
    delivery: string
    payment: string
    returns: string
    contacts: string
    offer: string
    privacy: string
    rights: string
    social: string
    /** Возврат к началу страницы из нижней полосы футера. */
    toTop: string
    subscribeTitle: string
    subscribeNote: string
    subscribeCta: string
    subscribeOk: string
    /** Сервис рассылки не подключён — говорим это прямо, а не молчим. */
    subscribeOff: string
    /** Адрес не похож на адрес. Своя строка вместо системной подсказки браузера. */
    subscribeBad: string
  }
  /**
   * Личный кабинет. Пока это только раскладка: сервера за ней нет, и
   * `note` говорит об этом прямо — так же, как `subscribeOff` про рассылку.
   */
  account: {
    title: string
    note: string
    signIn: string
    signUp: string
    signOut: string
    sections: { profile: string; orders: string; addresses: string; returns: string }
    profile: {
      lead: string
      name: string
      surname: string
      email: string
      phone: string
      birthday: string
      birthdayHint: string
      save: string
      security: string
      password: string
      passwordChange: string
    }
    orders: {
      lead: string
      number: string
      date: string
      status: string
      sum: string
      track: string
      items: string
      repeat: string
      empty: string
      emptyCta: string
    }
    addresses: {
      lead: string
      add: string
      main: string
      makeMain: string
      recipient: string
      country: string
      city: string
      street: string
      zip: string
      phone: string
      save: string
      cancel: string
      edit: string
      remove: string
      empty: string
    }
    returns: {
      lead: string
      order: string
      item: string
      reason: string
      reasons: string[]
      comment: string
      photos: string
      photosHint: string
      photosPick: string
      photosRemove: string
      send: string
      sent: string
    }
    auth: {
      lead: string
      email: string
      password: string
      passwordRepeat: string
      forgot: string
      noAccount: string
      hasAccount: string
    }
  }
  /** Полоса условий над футером: только то, что известно наверняка. */
  promise: { shipping: string; worldwide: string; cost: string }
}

const ru: Dict = {
  meta: {
    title: 'GLASS — ресницы и материалы для наращивания',
    description:
      'GLASS OWM — пучковые ресницы, клей, инструменты и уход. Доставка по России СДЭК, по миру — почтой.',
  },
  nav: {
    shop: 'Каталог',
    lashes: 'Ресницы',
    care: 'Уход',
    tools: 'Инструменты',
    about: 'О бренде',
    search: 'Поиск',
    searchHint: 'Название, длина, изгиб',
    cart: 'Корзина',
    favorites: 'Избранное',
    menu: 'Меню',
    close: 'Закрыть',
    account: 'Кабинет',
  },
  home: {
    marquee: 'Заметно · Точно · Каждый раз',
    announce: 'Новая коллекция уже в продаже',
    heroLine: 'Взгляд,\nкоторый влюбляет',
    heroNote: 'Безупречный взгляд без визита в салон.',
    heroCta: 'Найти свой образ',
    bestTitle: 'За ними возвращаются',
    newTitle: 'Новое',
    categoriesTitle: 'Категории',
    editorialTitle: 'Точность, которую видно вблизи',
    editorialBody:
      'Пучки отсортированы по длине и изгибу. Рука не ищет.',
    editorialCta: 'О бренде',
    promoTitle: 'Промокод',
    promoBody: '−10% на заказ',
    all: 'Весь каталог',
  },
  blocks: {
    featureKicker: 'Начните отсюда',
    featureCta: 'Открыть карточку',
    looksTitle: 'Найдите свой образ',
    looks: [
      { name: 'NATURAL', effect: 'Мягкий, незаметный', spec: '8–11 мм · изгиб C · 10D' },
      { name: 'WISPY', effect: 'Воздушный, с просветом', spec: 'микс 8–14 мм · изгиб C' },
      { name: 'CAT EYE', effect: 'Удлинённый к виску', spec: '14 мм · изгиб C и L' },
      { name: 'VOLUME', effect: 'Плотный, заметный', spec: '20D · лента и микс' },
    ],
    realTitle: 'Как это выглядит',
    realNote: 'Четыре кадра съёмки бренда: коробка, пучки, нанесение, готовый образ.',
    realSteps: ['Упаковка', 'Пучки', 'Лицо', 'Образ'],
    whyTitle: 'Почему эти ресницы',
    why: [
      { title: 'FLAT BASE', body: 'Плоское основание ложится вдоль линии роста.' },
      { title: 'CARBON BLACK', body: 'Угольно-чёрный без постороннего оттенка.' },
      { title: '10D / 20D', body: 'Два объёма: база и плотность.' },
      { title: 'REUSABLE', body: 'Линия FLAMBOYANCE рассчитана на повторное ношение.' },
    ],
    baTitle: 'До и после',
    baNote: 'Пара кадров одного глаза. Съёмку ждём от клиента.',
    baBefore: 'До',
    baAfter: 'После',
    collectionsTitle: 'Коллекции',
    collectionsNote: 'Шесть коллекций. Каждая — своя коробка.',
    reviewsTitle: 'Отзывы',
    reviewsNote:
      'Отзывы не выдуманы и не подставлены: сюда встанут настоящие — с фото и именем.',
    stepsTitle: 'Как наносить',
    steps: [
      { title: 'Подбери размер', body: 'Короткие — во внутренний угол, длинные — во внешний.' },
      { title: 'Нанеси', body: 'Каплю клея на основание, пучок — под свою ресницу.' },
      { title: 'Зафиксируй', body: 'Прижми пинцетом и дай схватиться.' },
    ],
    trustTitle: 'Качество',
    trustNote: 'То, что подтверждено. Остальное ждёт данных от бренда.',
    trust: [
      { title: 'Цвет', body: 'Угольно-чёрный' },
      { title: 'Основание', body: 'Плоское' },
      { title: 'Материал', body: 'Синтетический шёлк' },
      { title: 'Производство', body: 'Китай' },
      { title: 'Комплектация', body: 'Ресницы. Клей отдельно' },
      { title: 'Сертификаты', body: BLANKS.data },
    ],
    finalTitle: 'Твой взгляд.\nТвой образ.',
    finalCta: 'Выбрать ресницы',
    finderTitle: 'Или подберите точнее',
    finderExact: 'Подбор по длине и изгибу',
    kitCta: 'Собрать набор',
    kitDone: 'Набор в корзине',
  },
  info: {
    about: {
      title: 'О бренде',
      lead: 'Профессиональный бренд пучковых ресниц. Создан визажистом Светланой Лелари в 2021 году.',
      claim: 'Открой миру свой взгляд.',
      body: [
        'GLASS EYELASHES — абсолютно новый подход к производству пучковых ресниц для визажистов и любителей макияжа. Роскошный объём, угольно-чёрный цвет и идеальный изгиб — это про нас.',
        'Мы собираем воедино все преимущества мгновенного наращивания и делаем его простым и доступным каждому. Каждый пучок идеально отклеивается от ленты, не теряя своего объёма.',
        'Линейки BASIC и CLASSIC различаются объёмом: 10D и 20D. Длины — 8, 11 и 14 мм, изгиб C. Отдельно идут палетки-миксы и многоразовая лента FLAMBOYANCE.',
      ],
    },
    contacts: {
      title: 'Контакты',
      lead: 'Пишите по любому вопросу — ответим в рабочее время.',
      phone: 'Телефон',
      address: 'Адрес',
    },
    delivery: {
      title: 'Доставка и оплата',
      lead: 'По России и СНГ — СДЭК. В остальные страны — Почта России.',
      body: [
        'СНГ — Беларусь, Казахстан, Азербайджан, Армения, Кыргызстан, Узбекистан и Таджикистан.',
        'Выбор между курьером и пунктом выдачи есть там, где работает СДЭК. В остальные страны — только по адресу.',
        `Способы оплаты и порог бесплатной доставки: ${BLANKS.data}`,
      ],
      methodsTitle: 'Чем и куда',
      methodsCols: { name: 'Перевозчик', zone: 'Куда', time: 'Срок', cost: 'Стоимость' },
      methods: [
        {
          name: 'СДЭК — курьером',
          zone: 'Россия и СНГ',
          time: BLANKS.term,
          cost: 'На оформлении, по адресу',
        },
        {
          name: 'СДЭК — до пункта выдачи',
          zone: 'Россия и СНГ',
          time: BLANKS.term,
          cost: 'На оформлении, ниже курьерской',
        },
        {
          name: 'Почта России',
          zone: 'Турция, Испания, ОАЭ',
          time: BLANKS.term,
          cost: 'На оформлении, по стране назначения',
        },
      ],
    },
    returns: {
      title: 'Возврат',
      lead: 'Условия возврата задаёт бренд.',
      body: [
        'Ресницы, клей и праймер относятся к товарам личной гигиены: вскрытую упаковку вернуть нельзя.',
        `Порядок возврата нераспечатанного товара и сроки: ${BLANKS.data}`,
      ],
    },
    privacy: {
      title: 'Конфиденциальность',
      lead: 'Что сайт хранит и зачем.',
      body: [
        'Корзина, избранное, валюта и страна хранятся только в браузере покупателя и на сервер не уходят.',
        `Оператор персональных данных, цели обработки и порядок отзыва согласия: ${BLANKS.data}`,
      ],
    },
  },
  notFound: {
    title: 'Страницы нет',
    note: 'Ссылка устарела или в адресе опечатка.',
    cta: 'В каталог',
    home: 'На главную',
  },
  catalog: {
    title: 'Каталог',
    filters: 'Фильтры',
    sort: 'Сортировка',
    sortPopular: 'Популярные',
    sortPriceUp: 'Сначала дешевле',
    sortPriceDown: 'Сначала дороже',
    sortNew: 'Новинки',
    reset: 'Сбросить',
    apply: 'Показать',
    found: 'Найдено',
    toList: 'К началу списка',
    empty: 'Ничего не нашлось',
    emptyHint: 'Снимите часть фильтров или измените запрос.',
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',
    availability: 'Наличие',
    price: 'Цена',
    category: 'Категория',
    length: 'Длина',
    curl: 'Изгиб',
    volume: 'Объём',
    from: 'От',
    to: 'До',
        breadcrumbs: 'Хлебные крошки',
    lead: 'Ресницы, уход и инструменты бренда.',
    items: { one: 'позиция', few: 'позиции', many: 'позиций', other: 'позиции' },
    active: 'Выбрано',
    removeFilter: 'Убрать фильтр',
    sections: 'Разделы каталога',
  },
  product: {
    add: 'В корзину',
    added: 'В корзине',
    unavailable: 'Нет в наличии',
    description: 'Описание',
    specs: 'Характеристики',
    delivery: 'Доставка',
    deliveryBody:
      'По России — СДЭК, до двери или до пункта выдачи. По миру — Почтой России. Стоимость считается на оформлении заказа.',
    care: 'Уход',
    related: 'С этим берут',
    gallery: 'Галерея',
    zoom: 'Открыть во весь экран',
    prev: 'Предыдущий кадр',
    next: 'Следующий кадр',
    photoBlank: '— ФОТО —',
    variant: 'Вариант',
    sku: 'Артикул',
    recent: 'Недавно смотрели',
    about: 'О товаре',
    usage: 'Применение',
    usageBody: [
      'Наносите клей равномерно и по всей длине накладных ресниц. Используйте пинцет, чтобы аккуратно приложить ресницы к своим, начиная от центра и плавно двигаясь к концам: это поможет избежать неравномерного распределения.',
      'Снимать накладные ресницы нужно осторожно, чтобы не повредить свои собственные. Используйте средство для снятия макияжа или косметическое масло, чтобы размягчить клей.',
      'Не тяните за ресницы — это может привести к повреждениям.',
    ],
    noGlue: 'Клей не входит в комплект.',
    specMaterial: 'Материал',
    specMaterialValue: 'Синтетический шёлк',
    specSkin: 'Тип кожи',
    specSkinValue: 'Для всех типов кожи',
    specCountry: 'Страна производства',
    specCountryValue: 'Китай',
    specMaker: 'Изготовитель',
  },
  favorites: {
    title: 'Избранное',
    lead: 'Отмеченное сердцем остаётся здесь — на этом устройстве, без регистрации.',
    empty: 'Пока пусто',
    emptyHint: 'Сердце на карточке товара откладывает его сюда.',
  },
  cart: {
    title: 'Корзина',
    empty: 'Корзина пуста',
    toShop: 'В каталог',
    item: 'Товар',
    qty: 'Количество',
    remove: 'Убрать',
    promo: 'Промокод',
    promoApply: 'Применить',
    promoOk: 'Промокод применён',
    promoBad: 'Такого промокода нет',
    subtotal: 'Товары',
    shipping: 'Доставка',
    shippingFree: 'Бесплатно',
    total: 'Итого',
    checkout: 'Оформить заказ',
    country: 'Страна',
    method: 'Способ доставки',
    courier: 'Курьером',
    pickup: 'До пункта выдачи',
    cdek: 'СДЭК',
    post: 'Почта России',
    pricePending: 'Прайс ещё не проставлен — итог не считается, оформление недоступно.',
  },
  search: {
    loading: 'Ищем…',
    all: 'Показать все результаты',
    emptyHint: 'Проверьте написание или попробуйте другое слово.',
    suggestions: 'Подсказки',
  },
  badges: { hit: 'Хит', new: 'New', sale: 'Скидка' },
  promo: { copy: 'Скопировать промокод', copied: 'Скопировано' },
  region: {
    title: 'Регион доставки',
    note: 'От него зависят валюта и способ доставки.',
    confirm: 'Подтвердить',
  },
  actions: { quickAdd: 'В корзину', undo: 'Вернуть', removed: 'Убрали из корзины' },
  footer: {
    lang: 'Язык',
    currency: 'Валюта',
    country: 'Страна',
    care: 'Помощь',
    delivery: 'Доставка и оплата',
    payment: 'Оплата',
    returns: 'Возврат',
    contacts: 'Контакты',
    offer: 'Оферта',
    privacy: 'Конфиденциальность',
    rights: 'Все права защищены',
    social: 'Соцсети',
    toTop: 'Наверх',
    subscribeTitle: 'Письма о новом',
    subscribeNote: 'Новые линейки и поступления. Не чаще раза в месяц.',
    subscribeCta: 'Подписаться',
    subscribeOk: 'Готово. Проверьте почту.',
    subscribeOff: 'Рассылка ещё не подключена.',
    subscribeBad: 'Проверьте адрес: похоже, в нём опечатка.',
  },
  account: {
    title: 'Кабинет',
    note: 'Кабинет ещё не подключён к серверу: раскладка готова, но ничего не сохраняется и никуда не отправляется.',
    signIn: 'Войти',
    signUp: 'Регистрация',
    signOut: 'Выйти',
    sections: { profile: 'Профиль', orders: 'Заказы', addresses: 'Адреса', returns: 'Возврат' },
    profile: {
      lead: 'Имя и телефон нужны курьеру, почта — чтобы прислать номер отправления.',
      name: 'Имя',
      surname: 'Фамилия',
      email: 'Email',
      phone: 'Телефон',
      birthday: 'Дата рождения',
      birthdayHint: 'Необязательно. Нужна только для поздравления.',
      save: 'Сохранить',
      security: 'Безопасность',
      password: 'Пароль',
      passwordChange: 'Сменить пароль',
    },
    orders: {
      lead: 'Заказы не выдуманы и не подставлены: сюда встанут настоящие — с номером, статусом и трек-номером.',
      number: 'Заказ',
      date: 'Дата',
      status: 'Статус',
      sum: 'Сумма',
      track: 'Трек-номер',
      items: 'Состав',
      repeat: 'Повторить заказ',
      empty: 'Заказов пока нет',
      emptyCta: 'В каталог',
    },
    addresses: {
      lead: 'Сохранённый адрес не приходится вводить заново при каждом заказе.',
      add: 'Добавить адрес',
      main: 'Основной',
      makeMain: 'Сделать основным',
      recipient: 'Получатель',
      country: 'Страна',
      city: 'Город',
      street: 'Улица, дом, квартира',
      zip: 'Индекс',
      phone: 'Телефон',
      save: 'Сохранить',
      cancel: 'Отмена',
      edit: 'Изменить',
      remove: 'Удалить',
      empty: 'Адресов пока нет',
    },
    returns: {
      lead: 'Ресницы, клей и праймер — товары личной гигиены: вскрытую упаковку вернуть нельзя.',
      order: 'Номер заказа',
      item: 'Товар',
      reason: 'Причина',
      reasons: ['Не подошла длина', 'Не подошёл изгиб', 'Повреждена упаковка', 'Пришло не то', 'Другое'],
      comment: 'Что случилось',
      photos: 'Фотографии',
      photosHint: 'Перетащите файлы сюда или выберите на устройстве. До пяти кадров.',
      photosPick: 'Выбрать файлы',
      photosRemove: 'Убрать кадр',
      send: 'Отправить заявку',
      sent: 'Заявка не ушла: приём возвратов ещё не подключён.',
    },
    auth: {
      lead: 'Заказы, адреса и возвраты хранятся в кабинете.',
      email: 'Email',
      password: 'Пароль',
      passwordRepeat: 'Пароль ещё раз',
      forgot: 'Забыли пароль?',
      noAccount: 'Нет аккаунта? Зарегистрируйтесь',
      hasAccount: 'Уже есть аккаунт? Войдите',
    },
  },
  promise: {
    shipping: 'СДЭК по России и СНГ',
    worldwide: 'Почтой в остальные страны',
    cost: 'Стоимость — на оформлении',
  },
}

const en: Dict = {
  meta: {
    title: 'GLASS — lash clusters and supplies',
    description:
      'GLASS OWM — cluster lashes, adhesive, tools and aftercare. CDEK across Russia, postal shipping worldwide.',
  },
  nav: {
    shop: 'Shop',
    lashes: 'Lashes',
    care: 'Care',
    tools: 'Tools',
    about: 'About',
    search: 'Search',
    searchHint: 'Name, length, curl',
    cart: 'Cart',
    favorites: 'Saved',
    menu: 'Menu',
    close: 'Close',
    account: 'Account',
  },
  home: {
    marquee: 'Noticed · Exact · Every time',
    announce: 'The new collection is in',
    heroLine: 'A look\nyou fall for',
    heroNote: 'A flawless look without the salon.',
    heroCta: 'Find your look',
    bestTitle: 'The ones people come back for',
    newTitle: 'New in',
    categoriesTitle: 'Categories',
    editorialTitle: 'Precision you see up close',
    editorialBody:
      'Clusters are sorted by length and curl. Your hand never searches.',
    editorialCta: 'About the brand',
    promoTitle: 'Promo code',
    promoBody: '−10% off the order',
    all: 'Everything',
  },
  blocks: {
    featureKicker: 'Start here',
    featureCta: 'Open the product',
    looksTitle: 'Find your signature look',
    looks: [
      { name: 'NATURAL', effect: 'Soft, barely there', spec: '8–11 mm · C curl · 10D' },
      { name: 'WISPY', effect: 'Airy, with gaps', spec: '8–14 mm mix · C curl' },
      { name: 'CAT EYE', effect: 'Longer to the temple', spec: '14 mm · C and L curl' },
      { name: 'VOLUME', effect: 'Dense, unmistakable', spec: '20D · strip and mix' },
    ],
    realTitle: 'How it looks',
    realNote: 'Four frames of the brand’s own footage: the box, the clusters, the application, the finished look.',
    realSteps: ['Box', 'Clusters', 'Face', 'Look'],
    whyTitle: 'Why these lashes',
    why: [
      { title: 'FLAT BASE', body: 'A flat base sits along the lash line.' },
      { title: 'CARBON BLACK', body: 'Carbon black with no other cast.' },
      { title: '10D / 20D', body: 'Two volumes: a base and a fill.' },
      { title: 'REUSABLE', body: 'The FLAMBOYANCE line is made to be worn again.' },
    ],
    baTitle: 'Before and after',
    baNote: 'Two frames of one eye. Awaiting the brand shoot.',
    baBefore: 'Before',
    baAfter: 'After',
    collectionsTitle: 'Collections',
    collectionsNote: 'Six collections. Each in its own box.',
    reviewsTitle: 'Reviews',
    reviewsNote: 'Nothing here is invented: real reviews go in, with a photo and a name.',
    stepsTitle: 'How to apply',
    steps: [
      { title: 'Pick the size', body: 'Short in the inner corner, long in the outer.' },
      { title: 'Apply', body: 'A drop on the base, the cluster under your own lash.' },
      { title: 'Set', body: 'Press with tweezers and let it take.' },
    ],
    trustTitle: 'Quality',
    trustNote: 'What is confirmed. The rest is waiting on the brand.',
    trust: [
      { title: 'Colour', body: 'Carbon black' },
      { title: 'Base', body: 'Flat' },
      { title: 'Material', body: 'Synthetic silk' },
      { title: 'Made in', body: 'China' },
      { title: 'In the box', body: 'Lashes. Glue sold separately' },
      { title: 'Certificates', body: BLANKS.data },
    ],
    finalTitle: 'Your eyes.\nYour look.',
    finalCta: 'Choose your lashes',
    finderTitle: 'Or pick it exactly',
    finderExact: 'Pick by length and curl',
    kitCta: 'Build the kit',
    kitDone: 'Kit is in the cart',
  },
  info: {
    about: {
      title: 'About',
      lead: 'A professional cluster-lash brand. Founded in 2021 by the makeup artist Svetlana Lelari.',
      claim: 'Open your eyes to the world.',
      body: [
        'GLASS EYELASHES is a genuinely new approach to making cluster lashes, for makeup artists and for anyone who does their own. Rich volume, coal-black colour and an exact curl — that is us.',
        'We take everything that makes extensions worth having and make it simple and available to everyone. Every cluster lifts off the strip cleanly, without losing its volume.',
        'BASIC and CLASSIC differ by volume: 10D and 20D. Lengths are 8, 11 and 14 mm, C curl. Mixed trays and the reusable FLAMBOYANCE strip sit alongside them.',
      ],
    },
    contacts: {
      title: 'Contact',
      lead: 'Write to us about anything — we answer during working hours.',
      phone: 'Phone',
      address: 'Address',
    },
    delivery: {
      title: 'Shipping & payment',
      lead: 'CDEK across Russia and the CIS. Russian Post elsewhere.',
      body: [
        'The CIS means Belarus, Kazakhstan, Azerbaijan, Armenia, Kyrgyzstan, Uzbekistan and Tajikistan.',
        'The choice between a courier and a pickup point exists where CDEK operates. Everywhere else it is to the address only.',
        `Payment methods and the free-shipping threshold: ${BLANKS.data}`,
      ],
      methodsTitle: 'What goes where',
      methodsCols: { name: 'Carrier', zone: 'Where', time: 'Time', cost: 'Cost' },
      methods: [
        {
          name: 'CDEK — courier',
          zone: 'Russia and the CIS',
          time: BLANKS.term,
          cost: 'At checkout, from the address',
        },
        {
          name: 'CDEK — pickup point',
          zone: 'Russia and the CIS',
          time: BLANKS.term,
          cost: 'At checkout, below courier',
        },
        {
          name: 'Russian Post',
          zone: 'Türkiye, Spain, the UAE',
          time: BLANKS.term,
          cost: 'At checkout, by destination',
        },
      ],
    },
    returns: {
      title: 'Returns',
      lead: 'Return terms are set by the brand.',
      body: [
        'Lashes, adhesive and primer are personal-care goods: an opened package cannot be returned.',
        `The procedure for unopened goods and the time limits: ${BLANKS.data}`,
      ],
    },
    privacy: {
      title: 'Privacy',
      lead: 'What the site stores and why.',
      body: [
        'Cart, saved items, currency and country stay in the browser and never reach a server.',
        `The data controller, the purposes of processing and how to withdraw consent: ${BLANKS.data}`,
      ],
    },
  },
  notFound: {
    title: 'Page not found',
    note: 'The link is outdated or the address has a typo.',
    cta: 'Go to shop',
    home: 'Home',
  },
  catalog: {
    title: 'Shop',
    filters: 'Filters',
    sort: 'Sort',
    sortPopular: 'Most popular',
    sortPriceUp: 'Price, low to high',
    sortPriceDown: 'Price, high to low',
    sortNew: 'Newest',
    reset: 'Clear',
    apply: 'Show',
    found: 'Found',
    toList: 'Back to the top of the list',
    empty: 'Nothing found',
    emptyHint: 'Clear a filter or change the search.',
    inStock: 'In stock',
    outOfStock: 'Sold out',
    availability: 'Availability',
    price: 'Price',
    category: 'Category',
    length: 'Length',
    curl: 'Curl',
    volume: 'Volume',
    from: 'From',
    to: 'To',
        breadcrumbs: 'Breadcrumbs',
    lead: 'Lashes, aftercare and tools by the brand.',
    items: { one: 'item', other: 'items' },
    active: 'Selected',
    removeFilter: 'Remove filter',
    sections: 'Catalog sections',
  },
  product: {
    add: 'Add to cart',
    added: 'In cart',
    unavailable: 'Sold out',
    description: 'Description',
    specs: 'Details',
    delivery: 'Shipping',
    deliveryBody:
      'Across Russia — CDEK, to your door or to a pickup point. Worldwide — postal service. Cost is calculated at checkout.',
    care: 'Care',
    related: 'Goes with',
    gallery: 'Gallery',
    zoom: 'Open full screen',
    prev: 'Previous image',
    next: 'Next image',
    photoBlank: '— PHOTO —',
    variant: 'Option',
    sku: 'SKU',
    recent: 'Recently viewed',
    about: 'About this product',
    usage: 'How to use',
    usageBody: [
      'Apply the glue evenly along the whole length of the lash band. Use tweezers to place the cluster against your own lashes, starting at the centre and moving smoothly towards the ends — that keeps the spacing even.',
      'Remove the lashes gently so you do not damage your own. Soften the glue with makeup remover or a cosmetic oil first.',
      'Never pull the lashes off — that is how damage happens.',
    ],
    noGlue: 'Glue is not included.',
    specMaterial: 'Material',
    specMaterialValue: 'Synthetic silk',
    specSkin: 'Skin type',
    specSkinValue: 'All skin types',
    specCountry: 'Country of manufacture',
    specCountryValue: 'China',
    specMaker: 'Manufacturer',
  },
  favorites: {
    title: 'Saved',
    lead: 'Whatever you mark with a heart stays here — on this device, no sign-up needed.',
    empty: 'Nothing here yet',
    emptyHint: 'The heart on a product card puts it aside for you.',
  },
  cart: {
    title: 'Cart',
    empty: 'Your cart is empty',
    toShop: 'Go to shop',
    item: 'Item',
    qty: 'Qty',
    remove: 'Remove',
    promo: 'Promo code',
    promoApply: 'Apply',
    promoOk: 'Promo code applied',
    promoBad: 'No such promo code',
    subtotal: 'Items',
    shipping: 'Shipping',
    shippingFree: 'Free',
    total: 'Total',
    checkout: 'Checkout',
    country: 'Country',
    method: 'Shipping method',
    courier: 'Courier',
    pickup: 'Pickup point',
    cdek: 'CDEK',
    post: 'Russian Post',
    pricePending: 'Prices are not in yet — the total is not calculated and checkout is off.',
  },
  search: {
    loading: 'Searching…',
    all: 'Show all results',
    emptyHint: 'Check the spelling or try another word.',
    suggestions: 'Suggestions',
  },
  badges: { hit: 'Hit', new: 'New', sale: 'Sale' },
  promo: { copy: 'Copy promo code', copied: 'Copied' },
  region: {
    title: 'Delivery region',
    note: 'It sets the currency and the shipping method.',
    confirm: 'Confirm',
  },
  actions: { quickAdd: 'Add to cart', undo: 'Undo', removed: 'Removed from cart' },
  footer: {
    lang: 'Language',
    currency: 'Currency',
    country: 'Country',
    care: 'Help',
    delivery: 'Shipping & payment',
    payment: 'Payment',
    returns: 'Returns',
    contacts: 'Contact',
    offer: 'Terms',
    privacy: 'Privacy',
    rights: 'All rights reserved',
    social: 'Social',
    toTop: 'Back to top',
    subscribeTitle: 'News by email',
    subscribeNote: 'New lines and restocks. No more than once a month.',
    subscribeCta: 'Subscribe',
    subscribeOk: 'Done. Check your inbox.',
    subscribeOff: 'The mailing list is not connected yet.',
    subscribeBad: 'Check the address — it looks like a typo.',
  },
  account: {
    title: 'Account',
    note: 'The account is not wired to a server yet: the layout is ready, but nothing is saved or sent anywhere.',
    signIn: 'Sign in',
    signUp: 'Create account',
    signOut: 'Sign out',
    sections: { profile: 'Profile', orders: 'Orders', addresses: 'Addresses', returns: 'Returns' },
    profile: {
      lead: 'The courier needs a name and a phone; the email is where the tracking number goes.',
      name: 'First name',
      surname: 'Last name',
      email: 'Email',
      phone: 'Phone',
      birthday: 'Date of birth',
      birthdayHint: 'Optional. Used only to send birthday wishes.',
      save: 'Save',
      security: 'Security',
      password: 'Password',
      passwordChange: 'Change password',
    },
    orders: {
      lead: 'Orders are neither invented nor staged: real ones will stand here — with a number, a status and a tracking number.',
      number: 'Order',
      date: 'Date',
      status: 'Status',
      sum: 'Total',
      track: 'Tracking number',
      items: 'Items',
      repeat: 'Order again',
      empty: 'No orders yet',
      emptyCta: 'To the catalogue',
    },
    addresses: {
      lead: 'A saved address does not have to be typed again with every order.',
      add: 'Add an address',
      main: 'Default',
      makeMain: 'Make default',
      recipient: 'Recipient',
      country: 'Country',
      city: 'City',
      street: 'Street, building, flat',
      zip: 'Postcode',
      phone: 'Phone',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      remove: 'Delete',
      empty: 'No addresses yet',
    },
    returns: {
      lead: 'Lashes, adhesive and primer are personal-care goods: an opened package cannot be returned.',
      order: 'Order number',
      item: 'Item',
      reason: 'Reason',
      reasons: ['Wrong length', 'Wrong curl', 'Damaged package', 'Wrong item arrived', 'Something else'],
      comment: 'What happened',
      photos: 'Photos',
      photosHint: 'Drop files here or pick them from your device. Up to five frames.',
      photosPick: 'Choose files',
      photosRemove: 'Remove frame',
      send: 'Send the request',
      sent: 'Nothing was sent: return intake is not wired up yet.',
    },
    auth: {
      lead: 'Orders, addresses and returns live in the account.',
      email: 'Email',
      password: 'Password',
      passwordRepeat: 'Password again',
      forgot: 'Forgotten your password?',
      noAccount: 'No account? Create one',
      hasAccount: 'Already have an account? Sign in',
    },
  },
  promise: {
    shipping: 'CDEK across Russia and the CIS',
    worldwide: 'Russian Post elsewhere',
    cost: 'Cost is set at checkout',
  },
}

const ar: Dict = {
  meta: {
    title: 'GLASS — رموش ومستلزمات التركيب',
    description:
      'GLASS OWM — رموش عناقيد ولاصق وأدوات وعناية. شحن عبر CDEK داخل روسيا وبالبريد إلى كل العالم.',
  },
  nav: {
    shop: 'المتجر',
    lashes: 'الرموش',
    care: 'العناية',
    tools: 'الأدوات',
    about: 'عن العلامة',
    search: 'بحث',
    searchHint: 'الاسم أو الطول أو التجعيد',
    cart: 'السلة',
    favorites: 'المفضلة',
    menu: 'القائمة',
    close: 'إغلاق',
    account: 'حسابي',
  },
  home: {
    marquee: 'ملحوظة · دقيقة · في كل مرة',
    announce: 'المجموعة الجديدة متوفرة الآن',
    heroLine: 'نظرة\nتأسر القلب',
    heroNote: 'إطلالة مثالية دون زيارة الصالون.',
    heroCta: 'اعثري على إطلالتكِ',
    bestTitle: 'ما يعود إليه الناس',
    newTitle: 'وصل حديثاً',
    categoriesTitle: 'الفئات',
    editorialTitle: 'دقة تُرى عن قرب',
    editorialBody:
      'العناقيد مرتّبة حسب الطول والتجعيد. لا تبحث اليد.',
    editorialCta: 'عن العلامة',
    promoTitle: 'رمز الخصم',
    promoBody: 'خصم 10% على الطلب',
    all: 'كل المنتجات',
  },
  blocks: {
    featureKicker: 'ابدئي من هنا',
    featureCta: 'فتح المنتج',
    looksTitle: 'اعثري على إطلالتك',
    looks: [
      { name: 'NATURAL', effect: 'ناعمة وغير ملحوظة', spec: '8–11 مم · انحناء C · 10D' },
      { name: 'WISPY', effect: 'خفيفة بفراغات', spec: 'ميكس 8–14 مم · انحناء C' },
      { name: 'CAT EYE', effect: 'ممتدّة نحو الصدغ', spec: '14 مم · انحناء C و L' },
      { name: 'VOLUME', effect: 'كثيفة وواضحة', spec: '20D · شريط وميكس' },
    ],
    realTitle: 'كيف تبدو',
    realNote: 'أربع لقطات من تصوير العلامة: العلبة والخصلات والتطبيق والإطلالة النهائية.',
    realSteps: ['العلبة', 'العناقيد', 'الوجه', 'الإطلالة'],
    whyTitle: 'لماذا هذه الرموش',
    why: [
      { title: 'FLAT BASE', body: 'قاعدة مسطّحة تستقر على خط الرموش.' },
      { title: 'CARBON BLACK', body: 'أسود فحمي بلا أي مسحة أخرى.' },
      { title: '10D / 20D', body: 'كثافتان: أساس وتعبئة.' },
      { title: 'REUSABLE', body: 'خط FLAMBOYANCE مصنوع لإعادة الاستخدام.' },
    ],
    baTitle: 'قبل وبعد',
    baNote: 'صورتان للعين نفسها. بانتظار تصوير العلامة.',
    baBefore: 'قبل',
    baAfter: 'بعد',
    collectionsTitle: 'المجموعات',
    collectionsNote: 'ست مجموعات. لكل واحدة علبتها.',
    reviewsTitle: 'التقييمات',
    reviewsNote: 'لا شيء هنا مُختلق: تأتي تقييمات حقيقية بصورة واسم.',
    stepsTitle: 'طريقة الوضع',
    steps: [
      { title: 'اختاري المقاس', body: 'القصير للزاوية الداخلية والطويل للخارجية.' },
      { title: 'ضعي', body: 'قطرة على القاعدة، والعنقود تحت رمشكِ.' },
      { title: 'ثبّتي', body: 'اضغطي بالملقط واتركيه يتماسك.' },
    ],
    trustTitle: 'الجودة',
    trustNote: 'ما هو مؤكَّد. والباقي بانتظار العلامة.',
    trust: [
      { title: 'اللون', body: 'أسود فحمي' },
      { title: 'القاعدة', body: 'مسطّحة' },
      { title: 'الخامة', body: 'حرير صناعي' },
      { title: 'بلد الصنع', body: 'الصين' },
      { title: 'محتويات العلبة', body: 'رموش. اللاصق يُباع منفصلًا' },
      { title: 'الشهادات', body: BLANKS.data },
    ],
    finalTitle: 'عيناكِ.\nإطلالتكِ.',
    finalCta: 'اختاري رموشكِ',
    finderTitle: 'أو اختاري بدقة',
    finderExact: 'اختيار حسب الطول والانحناء',
    kitCta: 'تجهيز الطقم',
    kitDone: 'الطقم في السلة',
  },
  info: {
    about: {
      title: 'عن العلامة',
      lead: 'علامة احترافية لرموش العناقيد. أسّستها خبيرة المكياج سفيتلانا ليلاري عام 2021.',
      claim: 'افتحي عينيك على العالم.',
      body: [
        'GLASS EYELASHES نهج جديد تمامًا في صناعة رموش العناقيد، لخبيرات المكياج ولكل من تضع مكياجها بنفسها. كثافة فاخرة ولون أسود فحمي وانحناء مثالي — هذا ما نحن عليه.',
        'نجمع كل مزايا التركيب الفوري ونجعله بسيطًا ومتاحًا للجميع. كل خصلة ترتفع عن الشريط بنظافة، دون أن تفقد كثافتها.',
        'يختلف خطّا BASIC و CLASSIC في الكثافة: 10D و 20D. الأطوال 8 و11 و14 مم بانحناء C. وإلى جانبهما علب الميكس وشريط FLAMBOYANCE القابل لإعادة الاستخدام.',
      ],
    },
    contacts: {
      title: 'التواصل',
      lead: 'اكتبي إلينا في أي أمر — نردّ خلال ساعات العمل.',
      phone: 'الهاتف',
      address: 'العنوان',
    },
    delivery: {
      title: 'الشحن والدفع',
      lead: 'CDEK داخل روسيا ورابطة الدول المستقلة. وبالبريد الروسي إلى بقية الدول.',
      body: [
        'رابطة الدول المستقلة هي بيلاروس وكازاخستان وأذربيجان وأرمينيا وقيرغيزستان وأوزبكستان وطاجيكستان.',
        'الاختيار بين مندوب ونقطة استلام متاح حيث يعمل CDEK. وإلى بقية الدول إلى العنوان فقط.',
        `طرق الدفع وحدّ الشحن المجاني: ${BLANKS.data}`,
      ],
      methodsTitle: 'ماذا وإلى أين',
      methodsCols: { name: 'الناقل', zone: 'إلى أين', time: 'المدة', cost: 'التكلفة' },
      methods: [
        {
          name: 'CDEK — مندوب',
          zone: 'روسيا ورابطة الدول المستقلة',
          time: BLANKS.term,
          cost: 'عند إتمام الطلب، حسب العنوان',
        },
        {
          name: 'CDEK — نقطة استلام',
          zone: 'روسيا ورابطة الدول المستقلة',
          time: BLANKS.term,
          cost: 'عند إتمام الطلب، أقل من المندوب',
        },
        {
          name: 'البريد الروسي',
          zone: 'تركيا وإسبانيا والإمارات',
          time: BLANKS.term,
          cost: 'عند إتمام الطلب، حسب بلد الوصول',
        },
      ],
    },
    returns: {
      title: 'الإرجاع',
      lead: 'تحدّد العلامة شروط الإرجاع.',
      body: [
        'الرموش واللاصق والبرايمر من مواد العناية الشخصية: لا تُرجَع العبوة بعد فتحها.',
        `آلية إرجاع غير المفتوح ومدّته: ${BLANKS.data}`,
      ],
    },
    privacy: {
      title: 'الخصوصية',
      lead: 'ما يحفظه الموقع ولماذا.',
      body: [
        'تبقى السلة والمفضلة والعملة والدولة داخل المتصفّح ولا تصل إلى أي خادم.',
        `المسؤول عن البيانات وأغراض المعالجة وطريقة سحب الموافقة: ${BLANKS.data}`,
      ],
    },
  },
  notFound: {
    title: 'الصفحة غير موجودة',
    note: 'الرابط قديم أو في العنوان خطأ إملائي.',
    cta: 'إلى المتجر',
    home: 'الرئيسية',
  },
  catalog: {
    title: 'المتجر',
    filters: 'التصفية',
    sort: 'الترتيب',
    sortPopular: 'الأكثر رواجاً',
    sortPriceUp: 'السعر من الأقل',
    sortPriceDown: 'السعر من الأعلى',
    sortNew: 'الأحدث',
    reset: 'مسح',
    apply: 'عرض',
    found: 'النتائج',
    toList: 'إلى أول القائمة',
    empty: 'لا توجد نتائج',
    emptyHint: 'أزل بعض عوامل التصفية أو غيّر البحث.',
    inStock: 'متوفر',
    outOfStock: 'نفد',
    availability: 'التوفر',
    price: 'السعر',
    category: 'الفئة',
    length: 'الطول',
    curl: 'التجعيد',
    volume: 'الكثافة',
    from: 'من',
    to: 'إلى',
        breadcrumbs: 'مسار التنقل',
    lead: 'رموش وعناية وأدوات من العلامة.',
    items: { zero: 'منتج', one: 'منتج', two: 'منتجان', few: 'منتجات', many: 'منتجًا', other: 'منتج' },
    active: 'المحدد',
    removeFilter: 'إزالة الفلتر',
    sections: 'أقسام الكتالوج',
  },
  product: {
    add: 'أضف إلى السلة',
    added: 'في السلة',
    unavailable: 'نفد',
    description: 'الوصف',
    specs: 'التفاصيل',
    delivery: 'الشحن',
    deliveryBody:
      'داخل روسيا عبر CDEK، إلى الباب أو إلى نقطة الاستلام. وإلى بقية العالم بالبريد. تُحتسب التكلفة عند إتمام الطلب.',
    care: 'العناية',
    related: 'يُشترى معه',
    gallery: 'الصور',
    zoom: 'عرض بملء الشاشة',
    prev: 'الصورة السابقة',
    next: 'الصورة التالية',
    photoBlank: '— صورة —',
    variant: 'الخيار',
    sku: 'رقم المنتج',
    recent: 'شوهد مؤخراً',
    about: 'عن المنتج',
    usage: 'طريقة الاستخدام',
    usageBody: [
      'وزّعي اللاصق بالتساوي على طول شريط الرموش. استخدمي الملقط لوضع الخصلة على رموشك، ابدئي من المنتصف وتحرّكي بهدوء نحو الأطراف — هكذا يبقى التوزيع متساويًا.',
      'انزعي الرموش بلطف حتى لا تتضرّر رموشك الطبيعية. ليّني اللاصق أولًا بمزيل المكياج أو بزيت تجميلي.',
      'لا تشدّي الرموش — هذا ما يسبّب الضرر.',
    ],
    noGlue: 'اللاصق غير مرفق.',
    specMaterial: 'الخامة',
    specMaterialValue: 'حرير صناعي',
    specSkin: 'نوع البشرة',
    specSkinValue: 'لكل أنواع البشرة',
    specCountry: 'بلد التصنيع',
    specCountryValue: 'الصين',
    specMaker: 'الجهة المصنّعة',
  },
  favorites: {
    title: 'المفضلة',
    lead: 'ما تضع عليه قلباً يبقى هنا — على هذا الجهاز، دون تسجيل.',
    empty: 'لا شيء بعد',
    emptyHint: 'القلب على بطاقة المنتج يضعه جانباً لك.',
  },
  cart: {
    title: 'السلة',
    empty: 'السلة فارغة',
    toShop: 'إلى المتجر',
    item: 'المنتج',
    qty: 'الكمية',
    remove: 'إزالة',
    promo: 'رمز الخصم',
    promoApply: 'تطبيق',
    promoOk: 'تم تطبيق الرمز',
    promoBad: 'هذا الرمز غير موجود',
    subtotal: 'المنتجات',
    shipping: 'الشحن',
    shippingFree: 'مجاني',
    total: 'الإجمالي',
    checkout: 'إتمام الطلب',
    country: 'الدولة',
    method: 'طريقة الشحن',
    courier: 'توصيل للباب',
    pickup: 'نقطة استلام',
    cdek: 'CDEK',
    post: 'البريد الروسي',
    pricePending: 'لم تُدرج الأسعار بعد — لا يُحتسب الإجمالي وإتمام الطلب معطّل.',
  },
  search: {
    loading: 'جارٍ البحث…',
    all: 'عرض كل النتائج',
    emptyHint: 'تحقّق من الإملاء أو جرّب كلمة أخرى.',
    suggestions: 'الاقتراحات',
  },
  badges: { hit: 'الأكثر مبيعاً', new: 'جديد', sale: 'خصم' },
  promo: { copy: 'نسخ رمز الخصم', copied: 'تم النسخ' },
  region: {
    title: 'منطقة الشحن',
    note: 'تحدّد العملة وطريقة الشحن.',
    confirm: 'تأكيد',
  },
  actions: { quickAdd: 'أضف إلى السلة', undo: 'تراجع', removed: 'أُزيل من السلة' },
  footer: {
    lang: 'اللغة',
    currency: 'العملة',
    country: 'الدولة',
    care: 'المساعدة',
    delivery: 'الشحن والدفع',
    payment: 'الدفع',
    returns: 'الإرجاع',
    contacts: 'التواصل',
    offer: 'الشروط',
    privacy: 'الخصوصية',
    rights: 'جميع الحقوق محفوظة',
    social: 'التواصل الاجتماعي',
    toTop: 'إلى الأعلى',
    subscribeTitle: 'رسائل عن الجديد',
    subscribeNote: 'خطوط جديدة ووصول جديد. مرة في الشهر على الأكثر.',
    subscribeCta: 'اشتراك',
    subscribeOk: 'تم. تفقّدي بريدكِ.',
    subscribeOff: 'القائمة البريدية غير مفعّلة بعد.',
    subscribeBad: 'تحقّقي من العنوان — يبدو أن فيه خطأً.',
  },
  account: {
    title: 'حسابي',
    note: 'الحساب غير موصول بخادم بعد: التصميم جاهز، لكن لا شيء يُحفَظ أو يُرسَل.',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    signOut: 'تسجيل الخروج',
    sections: { profile: 'الملف', orders: 'الطلبات', addresses: 'العناوين', returns: 'الإرجاع' },
    profile: {
      lead: 'المندوب يحتاج الاسم والهاتف، والبريد هو مكان وصول رقم التتبّع.',
      name: 'الاسم',
      surname: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      birthday: 'تاريخ الميلاد',
      birthdayHint: 'اختياري. للتهنئة فقط.',
      save: 'حفظ',
      security: 'الأمان',
      password: 'كلمة المرور',
      passwordChange: 'تغيير كلمة المرور',
    },
    orders: {
      lead: 'الطلبات ليست مُختلَقة ولا موضوعة: ستقف هنا طلبات حقيقية — برقم وحالة ورقم تتبّع.',
      number: 'الطلب',
      date: 'التاريخ',
      status: 'الحالة',
      sum: 'الإجمالي',
      track: 'رقم التتبّع',
      items: 'المحتويات',
      repeat: 'إعادة الطلب',
      empty: 'لا توجد طلبات بعد',
      emptyCta: 'إلى الكتالوج',
    },
    addresses: {
      lead: 'العنوان المحفوظ لا يُكتَب من جديد مع كل طلب.',
      add: 'إضافة عنوان',
      main: 'الافتراضي',
      makeMain: 'جعله الافتراضي',
      recipient: 'المستلم',
      country: 'الدولة',
      city: 'المدينة',
      street: 'الشارع والمبنى والشقة',
      zip: 'الرمز البريدي',
      phone: 'الهاتف',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      remove: 'حذف',
      empty: 'لا توجد عناوين بعد',
    },
    returns: {
      lead: 'الرموش واللاصق والبرايمر من مواد العناية الشخصية: لا تُرجَع العبوة بعد فتحها.',
      order: 'رقم الطلب',
      item: 'المنتج',
      reason: 'السبب',
      reasons: ['الطول غير مناسب', 'الانحناء غير مناسب', 'العبوة تالفة', 'وصل منتج آخر', 'سبب آخر'],
      comment: 'ماذا حدث',
      photos: 'الصور',
      photosHint: 'اسحب الملفات إلى هنا أو اخترها من جهازك. حتى خمس صور.',
      photosPick: 'اختيار الملفات',
      photosRemove: 'إزالة الصورة',
      send: 'إرسال الطلب',
      sent: 'لم يُرسَل شيء: استقبال طلبات الإرجاع غير موصول بعد.',
    },
    auth: {
      lead: 'الطلبات والعناوين والإرجاع تُحفَظ في الحساب.',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      passwordRepeat: 'كلمة المرور مرة أخرى',
      forgot: 'نسيت كلمة المرور؟',
      noAccount: 'لا تملك حساباً؟ أنشئ حساباً',
      hasAccount: 'لديك حساب؟ سجّل الدخول',
    },
  },
  promise: {
    shipping: 'CDEK داخل روسيا ورابطة الدول المستقلة',
    worldwide: 'بالبريد الروسي إلى بقية الدول',
    cost: 'التكلفة عند إتمام الطلب',
  },
}

export const CONTENT: Record<Locale, Dict> = { ru, en, ar }
