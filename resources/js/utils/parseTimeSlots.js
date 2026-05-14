// Utility to parse a department's available time string and return hourly slots
export function parseAvailableTime(availableTime) {
    if (!availableTime || typeof availableTime !== "string") return [];
    const raw = availableTime.trim();

    // Handle 'Whole Day' (8:00 AM - 5:00 PM)
    if (/whole\s*day/i.test(raw)) {
        return generateHourlySlots(8, 17); // 8..16 -> 8AM to 4PM
    }

    // Split on dash
    const parts = raw.split("-");
    if (parts.length < 2) return [];
    const left = parts[0].trim();
    const right = parts.slice(1).join("-").trim();

    const rightMatch = right.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?/i);
    const leftMatch = left.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?/i);
    if (!rightMatch || !leftMatch) return [];

    const rightPeriod = rightMatch[3] ? rightMatch[3].toUpperCase() : null;

    const startMin = timeMatchToMinutes(leftMatch, rightPeriod);
    const endMin = timeMatchToMinutes(rightMatch, null);
    if (startMin === null || endMin === null) return [];

    // Round start up to next full hour if minutes present
    const startHour = Math.ceil(startMin / 60);
    const endHour = Math.floor(endMin / 60);
    if (startHour >= endHour) return [];

    return generateHourlySlots(startHour, endHour);
}

function timeMatchToMinutes(match, inferPeriod) {
    if (!match) return null;
    let hour = parseInt(match[1], 10);
    const minute = match[2] ? parseInt(match[2], 10) : 0;
    let period = match[3] ? match[3].toUpperCase() : null;
    if (!period && inferPeriod) period = inferPeriod;
    if (!period) {
        // default heuristics: prefer AM for standard schedule
        period = "AM";
    }

    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour * 60 + minute;
}

function generateHourlySlots(startHourInclusive, endHourExclusive) {
    const slots = [];
    for (let h = startHourInclusive; h < endHourExclusive; h++) {
        slots.push(formatHourLabel(h));
    }
    return slots;
}

function formatHourLabel(hour24) {
    const period = hour24 >= 12 ? "PM" : "AM";
    let hour = hour24 % 12;
    if (hour === 0) hour = 12;
    return `${hour}:00 ${period}`;
}

export default parseAvailableTime;
