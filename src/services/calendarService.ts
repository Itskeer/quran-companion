"use client";

import { islamicCalendarEvents, type CalendarEvent } from "@/data/calendarEvents";
import { gregorianToHijri, hijriToGregorian } from "@/services/hijriCalendar";

export function getUpcomingEvents(): CalendarEvent[] {
  const now = new Date();
  const hijriNow = gregorianToHijri(now);
  const in30Days = new Date(now);
  in30Days.setDate(in30Days.getDate() + 30);
  const hijri30 = gregorianToHijri(in30Days);

  return islamicCalendarEvents.filter((event) => {
    if (hijriNow.year !== hijri30.year) {
      return true;
    }
    return (
      event.hijriMonth > hijriNow.month ||
      (event.hijriMonth === hijriNow.month && event.hijriDay >= hijriNow.day) ||
      (event.hijriMonth === hijri30.month && event.hijriDay <= hijri30.day)
    );
  });
}

export function getNextEvent(): CalendarEvent | null {
  const now = new Date();
  const hijriNow = gregorianToHijri(now);

  const upcoming = islamicCalendarEvents
    .map((event) => {
      const eventDate = hijriToGregorian(
        hijriNow.year,
        event.hijriMonth,
        event.hijriDay
      );
      if (eventDate < now) {
        return { event, date: hijriToGregorian(hijriNow.year + 1, event.hijriMonth, event.hijriDay) };
      }
      return { event, date: eventDate };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return upcoming.length > 0 ? upcoming[0].event : null;
}

export function getDaysUntilEvent(event: CalendarEvent): number {
  const hijriNow = gregorianToHijri(new Date());
  const eventDate = hijriToGregorian(
    hijriNow.year,
    event.hijriMonth,
    event.hijriDay
  );

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate < now) {
    const nextYearEvent = hijriToGregorian(
      hijriNow.year + 1,
      event.hijriMonth,
      event.hijriDay
    );
    const diff = nextYearEvent.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  const diff = eventDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getEventById(id: string): CalendarEvent | undefined {
  return islamicCalendarEvents.find((e) => e.id === id);
}
