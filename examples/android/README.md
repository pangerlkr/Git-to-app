# Android Gradle Example Project

This directory contains example Gradle build files for a standard Android application. These files serve as reference templates for understanding the Gradle build configuration that Git-to-App expects when building Android projects.

## 📁 Project Structure

```
android/
├── app/
│   └── build.gradle          # App-level build configuration
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties
├── build.gradle              # Root-level build configuration
├── settings.gradle           # Project settings and module includes
├── gradle.properties         # Project-wide Gradle properties
├── gradlew                   # Gradle wrapper script (Unix)
├── gradlew.bat              # Gradle wrapper script (Windows)
└── .gitignore               # Git ignore rules for Android projects
```

## 🔧 Key Configuration Files

### `settings.gradle`
Defines the root project name and included modules. Uses modern Gradle 8.x plugin management with repository configuration.

### `build.gradle` (Root Level)
- Configures Android Gradle Plugin (AGP) version 8.2.0
- Sets Kotlin version 1.9.20
- Defines common project properties (compileSdk, targetSdk, minSdk)

### `gradle.properties`
- Enables AndroidX
- Configures Gradle JVM memory settings
- Sets Kotlin code style preferences

### `app/build.gradle`
Standard Android application module configuration with:
- **Namespace**: `com.example.gittoapp`
- **Compile SDK**: 34 (Android 14)
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34
- **Java Version**: 17
- **Build Types**: Debug and Release configurations
- **Dependencies**: AndroidX Core, AppCompat, Material Design, ConstraintLayout

## 🚀 Usage

### Building the Project

```bash
# Navigate to the android directory
cd examples/android

# Make gradlew executable (Linux/Mac)
chmod +x gradlew

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Clean build
./gradlew clean
```

### Using with Git-to-App

These Gradle files demonstrate the expected structure for Android projects that Git-to-App can detect and build:

1. **Framework Detection**: Git-to-App looks for `android/build.gradle` to identify native Android projects
2. **Build Configuration**: The `app/build.gradle` file defines how the APK is built
3. **Gradle Wrapper**: The `gradlew` scripts ensure consistent Gradle versions across environments

## 📋 Requirements

- **Java Development Kit (JDK)**: 17 or higher
- **Gradle**: 8.2 (included via wrapper)
- **Android SDK**: API level 34
- **Build Tools**: 34.0.0

## 🔗 Integration with CI/CD

This structure is compatible with Git-to-App's GitHub Actions workflows:
- `.github/workflows/build-apk.yaml`
- `.github/workflows/android-build.yml`

The workflows will:
1. Detect the `settings.gradle` or `build.gradle` files
2. Execute `gradlew` wrapper commands
3. Generate `local.properties` with Android SDK path
4. Build the APK using the specified task (assembleDebug/assembleRelease)

## 📝 Customization

To adapt these files for your project:

1. **Update namespace**: Change `com.example.gittoapp` in `app/build.gradle`
2. **Adjust SDK versions**: Modify `minSdk`, `compileSdk`, `targetSdk` in root `build.gradle`
3. **Add dependencies**: Include required libraries in `app/build.gradle`
4. **Configure signing**: Add signing configuration for release builds
5. **Update app name**: Change `rootProject.name` in `settings.gradle`

## 🛠️ Gradle Versions

This example uses:
- **Gradle**: 8.2
- **Android Gradle Plugin (AGP)**: 8.2.0
- **Kotlin**: 1.9.20

These versions are compatible with:
- Java 17+
- Android Studio Hedgehog (2023.1.1) and later

## 📚 Additional Resources

- [Gradle Documentation](https://docs.gradle.org/)
- [Android Gradle Plugin Documentation](https://developer.android.com/build)
- [Git-to-App Main Documentation](../../README.md)

## ⚠️ Notes

- This is a minimal example for reference purposes
- No actual Android application code (Activities, layouts, etc.) is included
- The build configuration follows modern Android best practices as of 2024
- For production apps, add proper signing configuration, ProGuard rules, and additional dependencies as needed
