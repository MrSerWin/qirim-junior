# Production Build Guide - Qirim Junior v3.0.0

Инструкции по созданию production сборки для iOS и Android.

## Версия

- **Version**: 3.0.0
- **Build Number**: 10

## Быстрый старт с npm скриптами

Доступны удобные команды для быстрой сборки:

```bash
# Полная очистка и переустановка зависимостей
npm run clean

# Генерация всех иконок
npm run icons

# Android сборки
npm run build:android           # APK (для тестирования)
npm run build:android:bundle    # AAB (для Google Play)
npm run build:android:install   # Установка release на устройство

# iOS сборка
npm run build:ios:release       # Release сборка в симуляторе

# Сборка всего за раз
npm run build:all              # Android AAB + инструкции для iOS
```

## Подготовка

### 1. Проверка версий

Версии обновлены в следующих файлах:
- ✅ `package.json` - version: "3.0.0"
- ✅ `ios/qirim_junior/Info.plist` - CFBundleShortVersionString: "3.0.0", CFBundleVersion: "10"
- ✅ `android/app/build.gradle` - versionName: "3.0.0", versionCode: 10

### 2. Production оптимизации

- ✅ ProGuard включен для Android release сборок
- ✅ Hermes engine включен (по умолчанию в React Native 0.82)
- ✅ Созданы все иконки приложения (iOS + Android adaptive icons)
- ✅ Logger utility создан для условного логирования

### 3. Очистка перед сборкой

```bash
# Быстрая очистка (рекомендуется)
npm run clean

# Или вручную:
npm run kill
rm -rf node_modules
rm -rf ios/Pods
rm -rf android/build
rm -rf android/app/build
npm install
cd ios && pod install && cd ..
```

## iOS Production Build

### Вариант 1: Archive через Xcode (рекомендуется)

1. Откройте проект в Xcode:
   ```bash
   open ios/qirim_junior.xcworkspace
   ```

2. Выберите схему **qirim_junior** и устройство **Any iOS Device (arm64)**

3. Проверьте настройки:
   - **Product → Scheme → Edit Scheme → Run → Build Configuration → Release**
   - **Signing & Capabilities** - настройте signing с вашим Apple Developer аккаунтом

4. Создайте архив:
   - **Product → Archive**
   - Дождитесь завершения архивирования
   - В Organizer нажмите **Distribute App**
   - Выберите **App Store Connect** или **Ad Hoc** для тестирования

5. Загрузка в App Store:
   - Выберите **Upload**
   - Дождитесь успешной загрузки
   - Перейдите в App Store Connect для настройки релиза

### Вариант 2: CLI Build

```bash
# Release build
npx react-native run-ios --configuration Release
```

### Создание IPA файла

```bash
cd ios

# Clean build
xcodebuild clean -workspace qirim_junior.xcworkspace -scheme qirim_junior

# Archive
xcodebuild archive \
  -workspace qirim_junior.xcworkspace \
  -scheme qirim_junior \
  -configuration Release \
  -archivePath build/qirim_junior.xcarchive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/qirim_junior.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist
```

## Android Production Build

### 1. Создание keystore (первый раз)

Если у вас еще нет release keystore:

```bash
cd android/app

keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore qirim-junior-release.keystore \
  -alias qirim-junior \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

cd ../..
```

**ВАЖНО**: Сохраните пароли в безопасном месте!

### 2. Настройка gradle для подписи

Создайте файл `android/gradle.properties` (если еще нет) и добавьте:

```properties
QIRIM_UPLOAD_STORE_FILE=qirim-junior-release.keystore
QIRIM_UPLOAD_KEY_ALIAS=qirim-junior
QIRIM_UPLOAD_STORE_PASSWORD=your_store_password
QIRIM_UPLOAD_KEY_PASSWORD=your_key_password
```

Обновите `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('QIRIM_UPLOAD_STORE_FILE')) {
                storeFile file(QIRIM_UPLOAD_STORE_FILE)
                storePassword QIRIM_UPLOAD_STORE_PASSWORD
                keyAlias QIRIM_UPLOAD_KEY_ALIAS
                keyPassword QIRIM_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### 3. Сборка APK

```bash
cd android

# Clean build
./gradlew clean

# Build release APK
./gradlew assembleRelease

cd ..
```

APK будет находиться в: `android/app/build/outputs/apk/release/app-release.apk`

### 4. Сборка AAB (для Google Play)

```bash
cd android

# Build release bundle
./gradlew bundleRelease

cd ..
```

AAB будет находиться в: `android/app/build/outputs/bundle/release/app-release.aab`

### 5. Тестирование release сборки

```bash
# Установка на подключенное устройство
cd android
./gradlew installRelease
cd ..
```

## Проверка перед релизом

### Чеклист

- [ ] Обновлена версия во всех конфигурационных файлах
- [ ] Проверено на реальных устройствах (iOS + Android)
- [ ] Проверена работа оффлайн
- [ ] Проверена синхронизация с сервером
- [ ] Проверены все экраны и навигация
- [ ] Проверены фильтры по авторам и темам
- [ ] Проверена смена языка (латиница/кириллица)
- [ ] Проверены все ссылки в разделе "О нас"
- [ ] Иконки приложения отображаются корректно
- [ ] Проверена работа на разных размерах экранов
- [ ] Нет утечек памяти при навигации
- [ ] Release сборка работает без ошибок
- [ ] ProGuard не ломает функциональность (Android)

### Тестирование производительности

```bash
# Android - проверка размера APK
ls -lh android/app/build/outputs/apk/release/app-release.apk

# Android - проверка размера AAB
ls -lh android/app/build/outputs/bundle/release/app-release.aab

# iOS - проверка размера IPA
ls -lh ios/build/qirim_junior.ipa
```

## Загрузка в сторы

### iOS App Store

1. Откройте [App Store Connect](https://appstoreconnect.apple.com)
2. Выберите приложение **Qırım Junior**
3. Создайте новую версию **3.0.0**
4. Загрузите билд через Xcode Organizer или Transporter
5. Заполните информацию о релизе:
   - Что нового в версии 3.0.0
   - Скриншоты (если обновлялся дизайн)
   - Описание
6. Отправьте на ревью

### Google Play Store

1. Откройте [Google Play Console](https://play.google.com/console)
2. Выберите **Qırım Junior**
3. Перейдите в **Production → Create new release**
4. Загрузите AAB файл
5. Заполните release notes на русском и крымскотатарском
6. Проверьте все настройки
7. Начните развертывание

## Что нового в версии 3.0.0

**Основные изменения:**
- ✨ Полностью переписано на React Native 0.82 с New Architecture
- 🎨 Новые адаптивные иконки для Android
- 🔄 Улучшенная синхронизация с сервером
- 🌐 Исправлено открытие ссылок на Android
- 📱 Оптимизирована производительность
- 🐛 Исправлены мелкие баги

## Troubleshooting

### iOS: Archive failed

```bash
# Очистка derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Переустановка pods
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

### Android: Signing failed

Проверьте, что:
- keystore файл существует в `android/app/`
- Пароли правильные в `gradle.properties`
- Alias правильный

### Android: ProGuard errors

Добавьте правила в `android/app/proguard-rules.pro`:

```proguard
# WatermelonDB
-keep class ** extends com.nozbe.watermelondb.** { *; }

# React Native
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.proguard.annotations.KeepGettersAndSetters *;
}
```

## Контакты

При возникновении проблем:
- GitHub Issues: [ссылка на репозиторий]
- Email: [контактный email]
