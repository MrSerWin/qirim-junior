# Android API Level Configuration

## ✅ Current Configuration

Приложение настроено на **Android API Level 36 (Android 15)**, что соответствует требованиям Google Play Store.

### Настройки в [android/build.gradle](android/build.gradle)

```gradle
buildscript {
    ext {
        buildToolsVersion = "36.0.0"
        minSdkVersion = 24              // Минимальная версия Android 7.0
        compileSdkVersion = 36          // Android 15 (для компиляции)
        targetSdkVersion = 36           // Android 15 (целевая версия)
        ndkVersion = "27.1.12297006"
        kotlinVersion = "2.1.20"
    }
}
```

## Требования Google Play Store

С 31 августа 2024 года Google Play требует:
- **Minimum**: `targetSdkVersion >= 34` (Android 14)
- **Recommended**: `targetSdkVersion = 36` (Android 15) ✅

Наша конфигурация соответствует всем требованиям!

## Что означают эти версии

| Параметр | Значение | Описание |
|----------|----------|----------|
| **minSdkVersion** | 24 | Минимальная поддерживаемая версия (Android 7.0 Nougat, 2016) |
| **compileSdkVersion** | 36 | Версия SDK для компиляции (Android 15) |
| **targetSdkVersion** | 36 | Целевая версия для оптимизации (Android 15) |

## После изменения версий

Если вы изменили версии API, выполните:

```bash
# 1. Очистка build
cd android
./gradlew clean

# 2. Пересборка приложения
cd ..
npx react-native run-android

# Или для релиза
cd android
./gradlew assembleRelease
```

## Сборка для Play Store

### AAB (Android App Bundle) - рекомендуется

```bash
cd android
./gradlew bundleRelease
```

Файл будет создан: `android/app/build/outputs/bundle/release/app-release.aab`

### APK (Alternative)

```bash
cd android
./gradlew assembleRelease
```

Файл будет создан: `android/app/build/outputs/apk/release/app-release.apk`

## Подпись приложения

Убедитесь, что файл `android/app/keystore.jks` существует и правильно настроен в `android/gradle.properties` или `android/app/build.gradle`:

```gradle
signingConfigs {
    release {
        storeFile file('keystore.jks')
        storePassword 'your-store-password'
        keyAlias 'your-key-alias'
        keyPassword 'your-key-password'
    }
}
```

## Проверка версии в собранном APK/AAB

```bash
# Для APK
aapt dump badging android/app/build/outputs/apk/release/app-release.apk | grep targetSdkVersion

# Для AAB
bundletool dump manifest --bundle=android/app/build/outputs/bundle/release/app-release.aab | grep targetSdkVersion
```

Должно показать: `targetSdkVersion:'36'`

## Troubleshooting

### Ошибка: "App must target Android 14 (API level 34) or higher"

**Решение**:
1. Убедитесь, что в `android/build.gradle` установлено `targetSdkVersion = 36`
2. Выполните clean build:
   ```bash
   cd android && ./gradlew clean && cd ..
   npx react-native run-android
   ```

### Ошибка: Gradle не может скачать зависимости

**Решение**:
```bash
cd android
./gradlew --refresh-dependencies
```

### Устаревшие Gradle warnings

Gradle 9.0 используется для совместимости с React Native 0.82. Warnings о Gradle 10 можно игнорировать.

---

**Дата обновления**: 30 октября 2024
**Версия приложения**: 3.0.0
**Target API Level**: 36 (Android 15)
**Status**: ✅ Готово для публикации в Google Play Store
