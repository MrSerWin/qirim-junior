# Android Signing Configuration - Qirim Junior

## ✅ Настройка завершена

Android приложение настроено для автоматической подписи release сборок.

## 📦 Файлы

### Keystore
- **Файл**: `android/app/keystore.jks`
- **Источник**: `keys/keystore.jks`
- **Алиас**: `upload`
- **Пароль**: (см. `keys/key.txt`)
- **Размер**: 2.6KB

### Конфигурация
- **gradle.properties**: `android/gradle.properties` (строки 46-50)
- **build.gradle**: `android/app/build.gradle` (строки 95-102, 109)

## 🔧 Настройки

### android/gradle.properties
```properties
# Release signing config
QIRIM_UPLOAD_STORE_FILE=keystore.jks
QIRIM_UPLOAD_KEY_ALIAS=upload
QIRIM_UPLOAD_STORE_PASSWORD=PASSWORD
QIRIM_UPLOAD_KEY_PASSWORD=PASSWORD
```

### android/app/build.gradle
```gradle
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
```

## 🚀 Использование

### Сборка подписанного APK
```bash
npm run build:android
```

**Результат**: `android/app/build/outputs/apk/release/app-release.apk` (~62MB)

### Сборка подписанного AAB (для Google Play)
```bash
npm run build:android:bundle
```

**Результат**: `android/app/build/outputs/bundle/release/app-release.aab` (~45MB)

### Установка на устройство
```bash
npm run build:android:install
```

## 🔐 Безопасность

### .gitignore
Keystore файлы защищены от коммита в git:

```gitignore
# В .gitignore (строка 37)
*.keystore
!debug.keystore
```

**ВАЖНО**:
- ✅ `android/app/keystore.jks` - **НЕ** попадет в git
- ✅ `android/gradle.properties` - **ПОПАДЕТ** в git (содержит пароли)
- ⚠️  **РЕКОМЕНДАЦИЯ**: Для production используйте environment variables или CI/CD secrets

## 🔑 Информация о ключе

### Просмотр информации о keystore
```bash
keytool -list -v -keystore android/app/keystore.jks -alias upload
# Пароль: PASSWORD
```

### Экспорт сертификата (уже сделано)
```bash
keytool -export -rfc -alias upload \
  -file keys/upload_certificate.pem \
  -keystore keys/keystore.jks
```

Файл сертификата: `keys/upload_certificate.pem` (1.2KB)

## ✅ Проверка сборки

### Проверка APK
```bash
# Убедитесь что APK подписан
unzip -l android/app/build/outputs/apk/release/app-release.apk | grep META-INF

# Должны быть файлы:
# META-INF/UPLOAD.SF
# META-INF/UPLOAD.RSA
# META-INF/MANIFEST.MF
```

### Размеры
- **APK**: ~62MB (с ProGuard)
- **AAB**: ~45MB (меньше на 27%)

## 📝 Google Play Upload

1. Откройте [Google Play Console](https://play.google.com/console)
2. Выберите **Qırım Junior**
3. **Production → Create new release**
4. Загрузите `app-release.aab`
5. Release notes:

```
Версия 3.0.0 (Build 10)

✨ Новое:
- Полностью переписано на React Native с New Architecture
- Адаптивные иконки для Android 8+
- Улучшенная синхронизация с сервером
- Оптимизирована производительность

🐛 Исправлено:
- Открытие ссылок на Android 11+
- Отображение изображений стихов
- Различные мелкие улучшения
```

## 🔄 Обновление keystore (если потребуется)

### Создание нового keystore
```bash
cd keys

keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore keystore-new.jks \
  -alias upload \
  -keyalg RSA \
  -keysize 2048 \
  -validity 9125

# Экспорт сертификата
keytool -export -rfc \
  -alias upload \
  -file upload_certificate_new.pem \
  -keystore keystore-new.jks

cd ..
```

### Замена keystore
```bash
# Бэкап старого
mv android/app/keystore.jks android/app/keystore.jks.backup

# Копирование нового
cp keys/keystore-new.jks android/app/keystore.jks

# Обновите пароли в android/gradle.properties
```

## ⚠️ ВАЖНО

1. **НЕ ТЕРЯЙТЕ keystore!**
   - Без него невозможно обновить приложение в Google Play
   - Храните резервную копию в безопасном месте

2. **НЕ ПУБЛИКУЙТЕ пароли в открытом доступе**
   - Храните в password manager
   - Используйте CI/CD secrets для автоматизации

3. **Для каждого приложения - отдельный keystore**
   - Не переиспользуйте один keystore для разных приложений

## 📚 Дополнительно

- [Официальная документация Android](https://developer.android.com/studio/publish/app-signing)
- [React Native Signing](https://reactnative.dev/docs/signed-apk-android)
- [Google Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756)

---

**Конфигурация создана**: 29 октября 2025
**Версия приложения**: 3.0.0 (Build 10)
