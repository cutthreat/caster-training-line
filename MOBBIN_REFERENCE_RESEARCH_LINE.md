# Mobbin reference research — Линия

Дата: 2026-07-12  
Источник: Mobbin MCP через thread `019f539c-b73a-7e21-b5d6-724a9b81d2ac`  
Контур: Caster visual/UX + Anton trust/form gate

## Evidence

Mobbin smoke-test подтвердил категорию login: 60 screen references и 12 auth/sign-in flows. Для fintech/onboarding поиска были показаны названия Binance, Wise, Monzo, N26 и Qantas Airways. Индивидуальные screen/flow URL и ID не раскрылись, поэтому этот пакет не заявляет точного соответствия конкретному экрану.

Категорийные источники:

- [Mobile App Login Screen Examples](https://mobbin.com/explore/mobile/screens/login)
- [Mobile Login UX Designs](https://mobbin.com/explore/mobile/flows/logging-in)
- [Mobbin MCP](https://mobbin.com/mcp)

## Accepted patterns

Это переносимые продуктовые паттерны, а не копия бренда, текста или layout:

- пошаговый onboarding с видимым прогрессом;
- одна задача на экран;
- короткое объяснение перед чувствительным действием;
- trust-сигналы рядом с вводом данных;
- выбор типа сценария/документа до сложного ввода;
- ручной fallback или альтернативный способ продолжить;
- один ясный основной CTA;
- возможность вернуться назад без потери понятного состояния.

## Clean-room boundary

Не переносим exact screen, copy, assets, brand, visual rhythm или flow. Используем только principles, которые связываем с задачей «Линии» и проверяем через Caster/Anton acceptance.

## Applied to Линия

- заявка разделена на два коротких шага;
- добавлен progress indicator и back path;
- перед отправкой показывается формат заявки и trust notice;
- есть локальный fallback/receipt, но он маркирован как demo;
- основной CTA один на каждом шаге;
- backend/CRM receipt остаётся отдельным production gate.

## Limit

Пять fintech-названий были реально найдены внутри Mobbin, но индивидуальные карточки не были доступны в source-linked виде. Поэтому это `pattern_research_ready`, не `screen_exact_research_complete`.
