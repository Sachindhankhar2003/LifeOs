package com.lifeos.mobile.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.lifeos.mobile.data.DashboardRepository
import com.lifeos.mobile.data.api.GoalDto
import com.lifeos.mobile.data.api.ReminderDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class DashboardState {
    object Loading : DashboardState()
    data class Success(val goals: List<GoalDto>, val reminders: List<ReminderDto>) : DashboardState()
    data class Error(val message: String) : DashboardState()
}

class DashboardViewModel(private val repository: DashboardRepository = DashboardRepository()) : ViewModel() {
    private val _uiState = MutableStateFlow<DashboardState>(DashboardState.Loading)
    val uiState: StateFlow<DashboardState> = _uiState.asStateFlow()

    init {
        loadData()
    }

    fun loadData() {
        viewModelScope.launch {
            _uiState.value = DashboardState.Loading
            try {
                // Fetch in parallel if refactored, sequential for simplicity here
                val goals = repository.getGoals()
                val reminders = repository.getReminders()
                _uiState.value = DashboardState.Success(goals, reminders)
            } catch (e: Exception) {
                _uiState.value = DashboardState.Error(e.localizedMessage ?: "Failed to load dashboard data.")
            }
        }
    }
}
