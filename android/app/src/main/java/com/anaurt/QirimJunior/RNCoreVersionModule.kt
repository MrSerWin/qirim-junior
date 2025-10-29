package com.anaurt.QirimJunior

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class RNCoreVersionModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "RNCoreVersion"
    }

    override fun getConstants(): MutableMap<String, Any> {
        val constants: MutableMap<String, Any> = HashMap()
        try {
            val packageInfo = reactApplicationContext.packageManager.getPackageInfo(
                reactApplicationContext.packageName,
                0
            )
            constants["appVersion"] = packageInfo.versionName ?: "2.0.0"
            constants["buildNumber"] = packageInfo.versionCode.toString()
        } catch (e: Exception) {
            constants["appVersion"] = "2.0.0"
            constants["buildNumber"] = "2"
        }
        return constants
    }
}
