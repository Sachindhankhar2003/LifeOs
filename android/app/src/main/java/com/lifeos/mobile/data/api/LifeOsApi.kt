package com.lifeos.mobile.data.api

import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Body
import retrofit2.http.Path

interface LifeOsApi {
    @GET("api/goals")
    suspend fun getGoals(): List<GoalDto>

    @GET("api/decisions")
    suspend fun getDecisions(): List<DecisionDto>

    @GET("api/reminders")
    suspend fun getReminders(): List<ReminderDto>

    @POST("api/auth/mobile-login")
    suspend fun login(@Body request: Map<String, String>): Map<String, String>
}
