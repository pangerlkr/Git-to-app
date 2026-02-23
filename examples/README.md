# Examples

This directory contains example projects demonstrating the Gradle build configurations and project structures that Git-to-App can detect and build.

## 📂 Available Examples

### [Android](./android/)
A complete example of a native Android project with Gradle build files, including:
- Root-level and app-level `build.gradle` files
- `settings.gradle` for project configuration
- `gradle.properties` for build properties
- Gradle wrapper scripts (`gradlew` and `gradlew.bat`)
- Standard Android project structure

**Purpose**: Demonstrates the expected Gradle configuration for Android projects that Git-to-App workflows will detect and build.

## 🎯 Use Cases

These examples serve multiple purposes:

1. **Reference Documentation**: Learn what Gradle configurations Git-to-App expects
2. **Testing**: Use these examples to test Git-to-App's framework detection and build capabilities
3. **Templates**: Starting point for creating your own Android projects compatible with Git-to-App
4. **CI/CD Integration**: Understand how GitHub Actions workflows interact with Gradle build files

## 🚀 Quick Start

Each example directory contains:
- Complete build configuration files
- A dedicated README with usage instructions
- `.gitignore` for build artifacts
- All necessary files to run a successful build

Navigate to the specific example directory for detailed instructions.

## 🔗 Related Workflows

Git-to-App includes several GitHub Actions workflows that work with these examples:

- `.github/workflows/build-apk.yaml` - Build native Android apps
- `.github/workflows/android-build.yml` - CI/CD for Android projects
- `.github/workflows/build-react-native-apk.yaml` - Build React Native Android apps
- `.github/workflows/build-flutter-apk.yaml` - Build Flutter Android apps

## 📚 Learn More

- [Main Documentation](../README.md)
- [Setup Guide](../docs/SETUP.md)
- [Contributing](../CONTRIBUTING.md)
