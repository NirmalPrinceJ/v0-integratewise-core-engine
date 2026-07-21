/**
 * Operating Calendar Engine
 * Manages daily briefs, weekly cadences, and content publishing schedules
 */

import type {
  DailyBrief,
  WeeklyCadence,
  ContentPublishSchedule,
  OperatingCalendar,
  ScheduleInstance,
  SchedulerConfig,
} from "./types";

export class OperatingCalendarEngine {
  private calendar: OperatingCalendar;
  private config: SchedulerConfig;
  private instances: Map<string, ScheduleInstance> = new Map();

  constructor(calendar: OperatingCalendar, config: SchedulerConfig) {
    this.calendar = calendar;
    this.config = config;
  }

  /**
   * Get all daily briefs
   */
  getDailyBriefs(): DailyBrief[] {
    return this.calendar.daily_briefs;
  }

  /**
   * Get daily brief by time
   */
  getDailyBriefAt(hour: number, minute: number): DailyBrief | undefined {
    const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    return this.calendar.daily_briefs.find((b) => b.time === timeStr);
  }

  /**
   * Get all weekly cadences
   */
  getWeeklyCadences(): WeeklyCadence[] {
    return this.calendar.weekly_cadences;
  }

  /**
   * Get weekly cadences for a specific day
   */
  getWeeklyCadencesForDay(dayOfWeek: number): WeeklyCadence[] {
    return this.calendar.weekly_cadences.filter((c) => c.day_of_week === dayOfWeek);
  }

  /**
   * Get content publishing schedules for a channel
   */
  getContentSchedulesForChannel(channel: string): ContentPublishSchedule[] {
    return this.calendar.content_schedules.filter((s) => s.channel === channel);
  }

  /**
   * Get all scheduled events for a given date
   */
  getScheduledEventsForDate(date: Date): ScheduleInstance[] {
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split("T")[0];
    const events: ScheduleInstance[] = [];

    // Add daily briefs
    for (const brief of this.calendar.daily_briefs) {
      if (brief.frequency === "daily" || (brief.frequency === "weekday" && dayOfWeek >= 1 && dayOfWeek <= 5) || (brief.frequency === "weekend" && (dayOfWeek === 0 || dayOfWeek === 6))) {
        const [hours, minutes] = brief.time.split(":").map(Number);
        const scheduledTime = new Date(date);
        scheduledTime.setHours(hours, minutes, 0, 0);

        events.push({
          id: `daily_${brief.id}_${dateStr}`,
          schedule_id: brief.id,
          schedule_type: "daily_brief",
          scheduled_time: scheduledTime,
          status: "pending",
          created_at: new Date(),
          data: brief,
        });
      }
    }

    // Add weekly cadences
    for (const cadence of this.calendar.weekly_cadences) {
      if (cadence.day_of_week === dayOfWeek) {
        const [hours, minutes] = cadence.time.split(":").map(Number);
        const scheduledTime = new Date(date);
        scheduledTime.setHours(hours, minutes, 0, 0);

        events.push({
          id: `cadence_${cadence.id}_${dateStr}`,
          schedule_id: cadence.id,
          schedule_type: "weekly_cadence",
          scheduled_time: scheduledTime,
          status: "pending",
          created_at: new Date(),
          data: cadence,
        });
      }
    }

    // Add content publishing schedules
    for (const content of this.calendar.content_schedules) {
      if (content.day_of_week === dayOfWeek) {
        const [hours, minutes] = content.time.split(":").map(Number);
        const scheduledTime = new Date(date);
        scheduledTime.setHours(hours, minutes, 0, 0);

        events.push({
          id: `content_${content.id}_${dateStr}`,
          schedule_id: content.id,
          schedule_type: "content_publish",
          scheduled_time: scheduledTime,
          status: content.default_status === "draft" ? "pending" : "scheduled",
          created_at: new Date(),
          data: content,
        });
      }
    }

    return events.sort((a, b) => a.scheduled_time.getTime() - b.scheduled_time.getTime());
  }

  /**
   * Get upcoming events
   */
  getUpcomingEvents(days: number = 7): ScheduleInstance[] {
    const events: ScheduleInstance[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      // Skip blackout dates
      if (this.calendar.blackout_dates?.some((d) => d.toDateString() === date.toDateString())) {
        continue;
      }

      events.push(...this.getScheduledEventsForDate(date));
    }

    return events;
  }

  /**
   * Register a schedule instance
   */
  registerInstance(instance: ScheduleInstance): void {
    this.instances.set(instance.id, instance);
  }

  /**
   * Update instance status
   */
  updateInstanceStatus(
    instanceId: string,
    status: ScheduleInstance["status"],
    data?: Record<string, any>
  ): boolean {
    const instance = this.instances.get(instanceId);
    if (!instance) return false;

    instance.status = status;
    if (status === "completed") {
      instance.completed_at = new Date();
    }
    if (data) {
      instance.data = { ...instance.data, ...data };
    }

    this.instances.set(instanceId, instance);
    return true;
  }

  /**
   * Get instance by ID
   */
  getInstance(instanceId: string): ScheduleInstance | undefined {
    return this.instances.get(instanceId);
  }

  /**
   * Get all instances for a schedule
   */
  getInstancesForSchedule(scheduleId: string): ScheduleInstance[] {
    return Array.from(this.instances.values()).filter((i) => i.schedule_id === scheduleId);
  }

  /**
   * Get execution statistics
   */
  getExecutionStats() {
    const instances = Array.from(this.instances.values());
    const completed = instances.filter((i) => i.status === "completed");
    const pending = instances.filter((i) => i.status === "pending");
    const failed = instances.filter((i) => i.errors && i.errors.length > 0);

    return {
      total: instances.length,
      completed: completed.length,
      pending: pending.length,
      failed: failed.length,
      success_rate: completed.length / instances.length || 0,
      by_type: {
        daily_briefs: instances.filter((i) => i.schedule_type === "daily_brief").length,
        weekly_cadences: instances.filter((i) => i.schedule_type === "weekly_cadence").length,
        content_publishes: instances.filter((i) => i.schedule_type === "content_publish").length,
      },
    };
  }

  /**
   * Get next event
   */
  getNextEvent(): ScheduleInstance | undefined {
    const upcoming = this.getUpcomingEvents(30);
    return upcoming.find((e) => e.status === "pending");
  }

  /**
   * Generate schedule report
   */
  generateScheduleReport(startDate: Date, endDate: Date) {
    const events: ScheduleInstance[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      events.push(...this.getScheduledEventsForDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const briefsByDay: Record<string, DailyBrief[]> = {};
    const cadencesByDepartment: Record<string, WeeklyCadence[]> = {};
    const contentByChannel: Record<string, ContentPublishSchedule[]> = {};

    for (const brief of this.calendar.daily_briefs) {
      const day = new Date();
      day.setHours(parseInt(brief.time));
      const dayName = day.toLocaleString("en-US", { weekday: "long" });
      if (!briefsByDay[dayName]) briefsByDay[dayName] = [];
      briefsByDay[dayName].push(brief);
    }

    for (const cadence of this.calendar.weekly_cadences) {
      const dept = cadence.department || "general";
      if (!cadencesByDepartment[dept]) cadencesByDepartment[dept] = [];
      cadencesByDepartment[dept].push(cadence);
    }

    for (const content of this.calendar.content_schedules) {
      if (!contentByChannel[content.channel]) contentByChannel[content.channel] = [];
      contentByChannel[content.channel].push(content);
    }

    return {
      period: { start: startDate.toISOString(), end: endDate.toISOString() },
      total_events: events.length,
      briefs_by_day: briefsByDay,
      cadences_by_department: cadencesByDepartment,
      content_by_channel: contentByChannel,
      statistics: this.getExecutionStats(),
    };
  }
}

/**
 * Create default operating calendar
 */
export function createDefaultOperatingCalendar(): OperatingCalendar {
  return {
    id: "calendar_default",
    organization_id: "org_main",
    timezone: "Asia/Kolkata",
    daily_briefs: [
      {
        id: "brief_1",
        time: "08:00",
        timezone: "Asia/Kolkata",
        title: "Morning Standup",
        description: "Daily operational briefing with key metrics and actions",
        items: [
          { id: "item_1", title: "Revenue Status", description: "Current pipeline and deals", duration_minutes: 5 },
          { id: "item_2", title: "Customer Health", description: "At-risk accounts and opportunities", duration_minutes: 5 },
          { id: "item_3", title: "Actions Due Today", description: "Team commitments and deadlines", duration_minutes: 5 },
        ],
        target_audience: ["sales", "csm", "leadership"],
        frequency: "weekday",
      },
      {
        id: "brief_2",
        time: "10:00",
        timezone: "Asia/Kolkata",
        title: "Sales Brief",
        description: "Sales pipeline review and opportunities",
        items: [
          { id: "item_1", title: "Pipeline Update", description: "Deals by stage", duration_minutes: 10 },
          { id: "item_2", title: "Win/Loss Analysis", description: "Recent closed deals", duration_minutes: 5 },
        ],
        target_audience: ["sales"],
        frequency: "weekday",
      },
      {
        id: "brief_3",
        time: "12:00",
        timezone: "Asia/Kolkata",
        title: "CSM Brief",
        description: "Customer success metrics and health",
        items: [
          { id: "item_1", title: "Health Scores", description: "Account health overview", duration_minutes: 10 },
          { id: "item_2", title: "Expansion Opps", description: "Upsell opportunities", duration_minutes: 5 },
        ],
        target_audience: ["csm"],
        frequency: "weekday",
      },
      {
        id: "brief_4",
        time: "14:00",
        timezone: "Asia/Kolkata",
        title: "Finance Brief",
        description: "Financial metrics and reporting",
        items: [
          { id: "item_1", title: "ARR Tracking", description: "Revenue forecasting", duration_minutes: 10 },
          { id: "item_2", title: "Collections", description: "Payment status", duration_minutes: 5 },
        ],
        target_audience: ["finance", "leadership"],
        frequency: "weekday",
      },
      {
        id: "brief_5",
        time: "16:00",
        timezone: "Asia/Kolkata",
        title: "Operations Brief",
        description: "System health and operational metrics",
        items: [
          { id: "item_1", title: "System Status", description: "Uptime and performance", duration_minutes: 5 },
          { id: "item_2", title: "Integration Health", description: "Data sync status", duration_minutes: 5 },
        ],
        target_audience: ["operations", "engineering"],
        frequency: "weekday",
      },
      {
        id: "brief_6",
        time: "09:00",
        timezone: "Asia/Kolkata",
        title: "Weekend Summary",
        description: "Week review and next week planning",
        items: [
          { id: "item_1", title: "Weekly Recap", description: "Key wins and learnings", duration_minutes: 15 },
        ],
        target_audience: ["all"],
        frequency: "weekend",
      },
    ],
    weekly_cadences: [
      {
        id: "cadence_1",
        day_of_week: 1, // Monday
        time: "10:00",
        timezone: "Asia/Kolkata",
        title: "Sales Weekly Planning",
        description: "Sales team weekly sync and planning",
        focus_areas: ["Pipeline review", "Deal reviews", "Territory planning"],
        department: "sales",
        duration_minutes: 60,
      },
      {
        id: "cadence_2",
        day_of_week: 2, // Tuesday
        time: "10:00",
        timezone: "Asia/Kolkata",
        title: "CSM Weekly Sync",
        description: "Customer success team coordination",
        focus_areas: ["Health reviews", "Expansion planning", "Support issues"],
        department: "csm",
        duration_minutes: 45,
      },
      {
        id: "cadence_3",
        day_of_week: 3, // Wednesday
        time: "14:00",
        timezone: "Asia/Kolkata",
        title: "Marketing Planning",
        description: "Weekly marketing strategy and execution",
        focus_areas: ["Campaign status", "Content planning", "Lead generation"],
        department: "marketing",
        duration_minutes: 50,
      },
      {
        id: "cadence_4",
        day_of_week: 4, // Thursday
        time: "15:00",
        timezone: "Asia/Kolkata",
        title: "Product Planning",
        description: "Product roadmap and feature updates",
        focus_areas: ["Roadmap updates", "Customer feedback", "Release planning"],
        department: "product",
        duration_minutes: 60,
      },
      {
        id: "cadence_5",
        day_of_week: 5, // Friday
        time: "16:00",
        timezone: "Asia/Kolkata",
        title: "Week Wrap-up",
        description: "All-hands weekly review and celebration",
        focus_areas: ["Week review", "Wins celebration", "Next week preview"],
        department: "all",
        duration_minutes: 45,
      },
    ],
    content_schedules: [
      {
        id: "content_1",
        channel: "email",
        day_of_week: 1, // Monday
        time: "09:00",
        timezone: "Asia/Kolkata",
        content_type: "weekly_digest",
        template: "weekly_email_digest",
        frequency: "weekly",
        target_audience: ["all"],
        default_status: "scheduled",
      },
      {
        id: "content_2",
        channel: "slack",
        day_of_week: 3, // Wednesday
        time: "10:00",
        timezone: "Asia/Kolkata",
        content_type: "best_practices",
        template: "slack_tips",
        frequency: "weekly",
        target_audience: ["team"],
        default_status: "scheduled",
      },
      {
        id: "content_3",
        channel: "website",
        day_of_week: 2, // Tuesday
        time: "12:00",
        timezone: "Asia/Kolkata",
        content_type: "blog_post",
        template: "blog_template",
        frequency: "weekly",
        target_audience: ["public"],
        default_status: "draft",
      },
    ],
    blackout_dates: [],
    metadata: {
      created_at: new Date().toISOString(),
      version: "1.0.0",
    },
  };
}

export default OperatingCalendarEngine;
