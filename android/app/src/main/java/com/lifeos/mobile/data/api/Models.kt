package com.lifeos.mobile.data.api

import kotlinx.serialization.Serializable

@Serializable
data class GoalDto(
    val id: Int,
    val title: String,
    val progress: Int,
    val status: String,
    val dueDate: String? = null
)

@Serializable
data class DecisionDto(
    val id: Int,
    val title: String,
    val status: String
)

@Serializable
data class ReminderDto(
    val id: String,
    val title: String,
    val status: String,
    val scheduledFor: String
)
