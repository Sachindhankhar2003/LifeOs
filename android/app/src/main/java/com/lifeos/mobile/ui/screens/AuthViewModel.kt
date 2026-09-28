package com.lifeos.mobile.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.lifeos.mobile.data.UserPreferences
import com.lifeos.mobile.data.api.ApiClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    object Success : AuthState()
    data class Error(val message: String) : AuthState()
}

class AuthViewModel(private val preferences: UserPreferences) : ViewModel() {
    private val _uiState = MutableStateFlow<AuthState>(AuthState.Idle)
    val uiState: StateFlow<AuthState> = _uiState.asStateFlow()

    fun login(token: String) {
        viewModelScope.launch {
            _uiState.value = AuthState.Loading
            try {
                // Here we would typically exchange credentials with backend.
                // Assuming a token was obtained or provided manually for initial scaffold:
                val mockAuthMap = mapOf("token" to token)
                // val response = ApiClient.api.login(mockAuthMap) // Not executing as next auth handles strictly
                
                preferences.saveToken(token)
                ApiClient.setToken(token)
                _uiState.value = AuthState.Success
            } catch (e: Exception) {
                _uiState.value = AuthState.Error(e.localizedMessage ?: "Login failed")
            }
        }
    }
}
