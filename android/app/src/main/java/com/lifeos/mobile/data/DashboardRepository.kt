package com.lifeos.mobile.data

import com.lifeos.mobile.data.api.ApiClient
import com.lifeos.mobile.data.api.GoalDto
import com.lifeos.mobile.data.api.ReminderDto

class DashboardRepository {
    suspend fun getGoals(): List<GoalDto> {
        return ApiClient.api.getGoals()
    }

    suspend fun getReminders(): List<ReminderDto> {
        return ApiClient.api.getReminders()
    }
}
