# Qırım Junior v3.0.0

Сборник детских стихотворений современных крымскотатарских поэтов.

> Qırımtatar zemaneviy şairleriniñ bala şiirleri cıyıntıĝı.

## 📱 О приложении

Мобильное приложение для чтения детских стихотворений на крымскотатарском языке с поддержкой латиницы и кириллицы.

**Основные возможности:**
- 📚 Коллекция детских стихов крымскотатарских поэтов
- 🔤 Переключение между латиницей и кириллицей
- 🎨 Красочные иллюстрации к стихам
- 🔍 Фильтрация по авторам и темам
- 📱 Работает полностью оффлайн
- 🔄 Синхронизация с сервером

## 🚀 Быстрый старт

### Для разработки

```bash
# Установка зависимостей
npm install
cd ios && pod install && cd ..

# Запуск Metro bundler
npm start

# Запуск на Android
npm run android

# Запуск на iOS
npm run ios
```

### Для production сборки

```bash
# Android (AAB для Google Play)
npm run build:android:bundle

# Android (APK для тестирования)
npm run build:android

# iOS (через Xcode)
npm run build:ios:release
# Затем: open ios/qirim_junior.xcworkspace
```

**Все команды сборки:** [BUILD_COMMANDS.md](BUILD_COMMANDS.md) 📋

## 📦 Технологии

- **React Native** 0.82 с New Architecture
- **TypeScript** для типобезопасности
- **WatermelonDB** для локального хранения
- **React Navigation** 7 для навигации
- **React Native Reanimated** 4 для анимаций
- **Hermes Engine** для оптимизации

## 📁 Структура проекта

```
qirim-junior/
├── src/
│   ├── components/       # Переиспользуемые компоненты
│   ├── screens/          # Экраны приложения
│   ├── navigation/       # Навигация
│   ├── services/         # Бизнес-логика и API
│   ├── database/         # WatermelonDB модели и схемы
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Утилиты
│   ├── theme/            # Тема и стили
│   ├── types/            # TypeScript типы
│   └── assets/           # Изображения и иконки
├── android/              # Android нативный код
├── ios/                  # iOS нативный код
└── data/                 # Начальные данные стихов
```

## 🔧 Доступные команды

### Разработка
```bash
npm start                 # Запуск Metro bundler
npm run android           # Запуск на Android
npm run ios               # Запуск на iOS
npm run lint              # Проверка кода
npm run test              # Запуск тестов
npm run kill              # Убить Metro bundler
```

### Сборка
```bash
npm run build:android              # Android APK
npm run build:android:bundle       # Android AAB
npm run build:android:install      # Установка release
npm run build:ios:release          # iOS release
npm run build:all                  # Все сразу
```

### Обслуживание
```bash
npm run clean              # Полная очистка
npm run clean:android      # Очистка Android
npm run clean:ios          # Очистка iOS
npm run icons              # Генерация иконок
```

## 📚 Документация

- [BUILD_COMMANDS.md](BUILD_COMMANDS.md) - Шпаргалка команд сборки
- [PRODUCTION_BUILD.md](PRODUCTION_BUILD.md) - Подробное руководство по production сборке
- [RELEASE_NOTES_v3.0.md](RELEASE_NOTES_v3.0.md) - Что нового в версии 3.0
- [ICONS_README.md](ICONS_README.md) - Документация по иконкам

## 🆚 Версия

**Текущая версия:** 3.0.0 (Build 10)

- iOS: CFBundleShortVersionString в Info.plist
- Android: versionName в build.gradle
- npm: version в package.json

## 🔄 Синхронизация

Приложение синхронизируется с сервером для получения новых стихов:
- API: `https://junior.ana-yurt.com/api/?action=poems`
- Автоматическая синхронизация раз в 24 часа
- Ручная синхронизация через pull-to-refresh

## 🎨 Иконки

Все иконки приложения генерируются автоматически:

```bash
npm run icons
```

Подробнее: [ICONS_README.md](ICONS_README.md)

## 🐛 Troubleshooting

### Metro bundler не запускается
```bash
npm run kill
npm start
```

### Проблемы со сборкой
```bash
npm run clean
```

### Android build failed
```bash
npm run clean:android
npm run build:android
```

### iOS build failed
```bash
npm run clean:ios
open ios/qirim_junior.xcworkspace
```

## 🤝 Участники

- **Разработка:** Servin Osmanov
- **Контент:** Qirim.Jr команда
- **Дизайн:** Qirim.Jr
- **Техническая поддержка:** Tito.site, AnaYurt

## 🔗 Ссылки

- Website: https://qirimjr.org
- Facebook: https://www.facebook.com/qirimjunior
- Developer: https://eumerov.com
- Portal: https://ana-yurt.com

## 📄 Лицензия

© 2025 Qırım Junior. Все права защищены.

---

**Сделано с ❤️ для детей Крыма**
