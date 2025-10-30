# App Icons - Qirim Junior

Все иконки приложения сгенерированы на основе `src/assets/imageLoadingPlaceholder.png`.

## Сгенерированные иконки

### iOS (AppIcon.appiconset)
Расположение: `ios/qirim_junior/Images.xcassets/AppIcon.appiconset/`

- **iPhone Notification (20pt)**: Icon-20@2x.png (40x40), Icon-20@3x.png (60x60)
- **iPhone Settings (29pt)**: Icon-29@2x.png (58x58), Icon-29@3x.png (87x87)
- **iPhone Spotlight (40pt)**: Icon-40@2x.png (80x80), Icon-40@3x.png (120x120)
- **iPhone App (60pt)**: Icon-60@2x.png (120x120), Icon-60@3x.png (180x180)
- **iPad Notification (20pt)**: Icon-20.png (20x20), Icon-20@2x.png (40x40)
- **iPad Settings (29pt)**: Icon-29.png (29x29), Icon-29@2x.png (58x58)
- **iPad Spotlight (40pt)**: Icon-40.png (40x40), Icon-40@2x.png (80x80)
- **iPad App (76pt)**: Icon-76.png (76x76), Icon-76@2x.png (152x152)
- **iPad Pro App (83.5pt)**: Icon-83.5@2x.png (167x167)
- **App Store**: Icon-1024.png (1024x1024)

### Android (Launcher Icons)
Расположение: `android/app/src/main/res/mipmap-*/`

- **mdpi**: ic_launcher.png (48x48), ic_launcher_round.png (48x48), ic_launcher_foreground.png (108x108)
- **hdpi**: ic_launcher.png (72x72), ic_launcher_round.png (72x72), ic_launcher_foreground.png (162x162)
- **xhdpi**: ic_launcher.png (96x96), ic_launcher_round.png (96x96), ic_launcher_foreground.png (216x216)
- **xxhdpi**: ic_launcher.png (144x144), ic_launcher_round.png (144x144), ic_launcher_foreground.png (324x324)
- **xxxhdpi**: ic_launcher.png (192x192), ic_launcher_round.png (192x192), ic_launcher_foreground.png (432x432)

### Android (Adaptive Icons - API 26+)
Расположение: `android/app/src/main/res/mipmap-anydpi-v26/`

- **ic_launcher.xml**: Adaptive icon конфигурация
- **ic_launcher_round.xml**: Adaptive icon конфигурация для круглой иконки
- **Фон**: Цвет #1DAEE8 (голубой из логотипа) - определен в `values/colors.xml`

### Android (Notification Icons)
Расположение: `android/app/src/main/res/drawable-*/`

- **mdpi**: ic_notification.png (24x24)
- **hdpi**: ic_notification.png (36x36)
- **xhdpi**: ic_notification.png (48x48)
- **xxhdpi**: ic_notification.png (72x72)
- **xxxhdpi**: ic_notification.png (96x96)

## Как регенерировать иконки

Если нужно обновить иконки:

1. Замените файл `src/assets/imageLoadingPlaceholder.png` на новую иконку
2. Запустите скрипт генерации:
   ```bash
   ./generate-icons.sh
   ```

## Требования

- macOS с установленным `sips` (встроенный инструмент)
- Исходное изображение должно быть квадратным (рекомендуется 1024x1024)
- Изображение должно иметь прозрачный фон или подходящий для иконки фон

## Примечания

- **iOS**: Contents.json автоматически обновляется с правильными именами файлов
- **Android Adaptive Icons**: На Android 8+ (API 26+) используются adaptive icons, которые заполняют весь тайл иконки. Иконка состоит из двух слоев:
  - **Background**: Сплошной голубой цвет (#1DAEE8)
  - **Foreground**: PNG изображение с прозрачным фоном
- **Android Legacy**: На старых версиях Android используются обычные PNG иконки (ic_launcher.png)
- **Android Notification**: Notification иконки используют цветную версию. Для production рекомендуется создать белую версию на прозрачном фоне
- **Форматы**: Все иконки сохраняются в формате PNG с сохранением прозрачности

## Дополнительные иконки

Если понадобятся дополнительные размеры или форматы:

1. Откройте `generate-icons.sh`
2. Добавьте новые команды `sips` с нужными размерами
3. Обновите соответствующие конфигурационные файлы (Contents.json для iOS)
