package com.lifeos.mobile.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF2563EB), // blue-600
    onPrimary = Color.White,
    primaryContainer = Color(0xFFEFF6FF), // blue-50
    onPrimaryContainer = Color(0xFF1E3A8A), // blue-900
    secondary = Color(0xFF475569), // slate-600
    onSecondary = Color.White,
    background = Color(0xFFF8FAFC), // slate-50
    onBackground = Color(0xFF0F172A), // slate-900
    surface = Color.White,
    onSurface = Color(0xFF0F172A), // slate-900
    surfaceVariant = Color(0xFFF1F5F9), // slate-100
    onSurfaceVariant = Color(0xFF64748B), // slate-500
    outline = Color(0xFFE2E8F0), // slate-200
)

// LifeOS enforces a white minimal theme, but we can provide a basic dark mapping if requested
private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF3B82F6), // blue-500
    onPrimary = Color.White,
    background = Color(0xFF0F172A), // slate-900
    onBackground = Color(0xFFF8FAFC), // slate-50
    surface = Color(0xFF1E293B), // slate-800
    onSurface = Color(0xFFF8FAFC),
    outline = Color(0xFF334155), // slate-700
)

@Composable
fun LifeOSTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = false, // disabled to keep LifeOS branding
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
