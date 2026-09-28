package com.lifeos.mobile.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.lifeos.mobile.ui.screens.DashboardScreen
import com.lifeos.mobile.ui.screens.LoginScreen

sealed class Screen(val route: String, val title: String) {
    object Login : Screen("login", "Login")
    object Dashboard : Screen("dashboard", "Dashboard")
    object Chat : Screen("chat", "Chat")
    object Simulator : Screen("simulator", "Simulator")
    object Goals : Screen("goals", "Goals")
}

@Composable
fun LifeOsNavGraph(
    navController: NavHostController,
    modifier: Modifier = Modifier,
    startDestination: String = Screen.Login.route
) {
    NavHost(
        navController = navController,
        startDestination = startDestination,
        modifier = modifier
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            )
        }
        composable(Screen.Dashboard.route) {
            DashboardScreen()
        }
        composable(Screen.Chat.route) {
            // ChatScreen()
        }
        composable(Screen.Simulator.route) {
            // SimulatorScreen()
        }
        composable(Screen.Goals.route) {
            // GoalsScreen()
        }
    }
}
