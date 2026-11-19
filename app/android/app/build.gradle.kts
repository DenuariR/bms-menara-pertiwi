plugins {
    id("com.android.application")
    id("kotlin-android")
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.menarapertiwi.dcm"
    compileSdk = flutter.compileSdkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }

    defaultConfig {
        applicationId = "com.menarapertiwi.dcm"
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    signingConfigs {
        create("release") {
            val propsFile = rootProject.file("key.properties")
            if (propsFile.exists()) {
                val props = java.util.Properties().apply { propsFile.inputStream().use { load(it) } }
                storeFile = file(props.getProperty("storeFile") ?: "release.jks")
                storePassword = props.getProperty("storePassword") ?: ""
                keyAlias = props.getProperty("keyAlias") ?: ""
                keyPassword = props.getProperty("keyPassword") ?: ""
            }
        }
    }

    buildTypes {
        release {
            signingConfig = if (rootProject.file("key.properties").exists()) signingConfigs.getByName("release") else signingConfigs.getByName("debug")
            isMinifyEnabled = false
            isShrinkResources = false
        }
    }
}

flutter {
    source = "../.."
}
