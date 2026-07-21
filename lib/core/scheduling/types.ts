/**
 * Operating Calendar & Scheduling Types
 * Defines the daily briefs, weekly cadences, and content publishing schedules
 */

export interface TimeWindow {
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  timezone: string; // e.g., "Asia/Kolkata"
}

export interface BriefingItem {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  owners?: string[];
  data_sources?: string[];
  required_signals?: string[];
}

export interface DailyBrief {
  id: string;
  time: string; // HH:mm
  timezone: string;
  title: string;
  description: string;
  items: BriefingItem[];
  target_audience?: string[];
  frequency: "daily" | "weekday" | "weekend";
}

export interface WeeklyCadence {
  id: string;
  day_of_week: number; // 0-6, Monday-Sunday
  time: string; // HH:mm
  timezone: string;
  title: string;
  description: string;
  focus_areas: string[];
  owners?: string[];
  department?: string;
  duration_minutes: number;
}

export interface ContentPublishSchedule {
  id: string;
  channel: string; // "email", "slack", "website", "social", etc.
  day_of_week: number; // 0-6
  time: string; // HH:mm
  timezone: string;
  content_type: string;
  template: string;
  frequency: "weekly" | "biweekly" | "monthly";
  target_audience?: string[];
  default_status: "draft" | "scheduled" | "published";
}

export interface ScheduleInstance {
  id: string;
  schedule_id: string;
  schedule_type: "daily_brief" | "weekly_cadence" | "content_publish";
  scheduled_time: Date;
  actual_time?: Date;
  status: "pending" | "in_progress" | "completed" | "cancelled" | "rescheduled";
  created_at: Date;
  completed_at?: Date;
  data?: Record<string, any>;
  participants?: string[];
  notes?: string;
  errors?: string[];
}

export interface OperatingCalendar {
  id: string;
  organization_id: string;
  timezone: string; // Primary timezone
  daily_briefs: DailyBrief[];
  weekly_cadences: WeeklyCadence[];
  content_schedules: ContentPublishSchedule[];
  blackout_dates?: Date[]; // Dates when no scheduling occurs
  metadata?: Record<string, any>;
}

export interface SchedulerConfig {
  timezone: string;
  enable_notifications: boolean;
  notification_lead_time_minutes: number;
  auto_start_recurring: boolean;
  max_concurrent_events: number;
}
