import React, { useEffect, useState } from "react";
import parseAvailableTime from "../../../../../utils/parseTimeSlots";

export default function ArrivalTimePickerModal({
    isOpen = false,
    availableTime = "",
    onClose = () => {},
    onConfirm = (time) => {},
    maxSlots = 1,
    getSlotOccupancy = () => 0, // Function that returns count of bookings for a specific slot
}) {
    const [slots, setSlots] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const s = parseAvailableTime(availableTime || "");
            setSlots(s);
            setSelected(null);
        }
    }, [isOpen, availableTime]);

    if (!isOpen) return null;

    const isSlotFull = (slot) => {
        const occupancy = getSlotOccupancy(slot);
        return occupancy >= maxSlots;
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                }}
                onClick={onClose}
            />
            <div
                style={{
                    position: "relative",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    width: "100%",
                    maxWidth: "420px",
                    padding: "24px",
                    zIndex: 10,
                }}
            >
                {/* Header */}
                <p
                    style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#111827",
                        margin: "0 0 4px",
                    }}
                >
                    Select Arrival Time
                </p>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "20px",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6b7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span style={{ fontSize: "13px", color: "#6b7280" }}>
                        Department window: {availableTime}
                    </span>
                </div>

                {/* Empty state */}
                {slots.length === 0 && (
                    <p
                        style={{
                            fontSize: "13px",
                            color: "#9ca3af",
                            textAlign: "center",
                            padding: "16px 0",
                        }}
                    >
                        No available hourly slots.
                    </p>
                )}

                {/* Slot grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "8px",
                        marginBottom: "20px",
                    }}
                >
                    {slots.map((slot) => {
                        const isSelected =
                            selected?.trim().toLowerCase() ===
                            slot?.trim().toLowerCase();
                        const slotFull = isSlotFull(slot);
                        const occupancy = getSlotOccupancy(slot);

                        return (
                            <div key={slot} style={{ position: "relative" }}>
                                <button
                                    type="button"
                                    disabled={slotFull && !isSelected}
                                    onClick={() => {
                                        if (!slotFull || isSelected) {
                                            setSelected((prev) =>
                                                prev?.trim().toLowerCase() ===
                                                slot?.trim().toLowerCase()
                                                    ? null
                                                    : slot,
                                            );
                                        }
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "9px 8px",
                                        borderRadius: "8px",
                                        border: isSelected
                                            ? "1.5px solid #2563eb"
                                            : slotFull
                                              ? "1px solid #fca5a5"
                                              : "1px solid #e5e7eb",
                                        backgroundColor: isSelected
                                            ? "#2563eb"
                                            : slotFull
                                              ? "#fee2e2"
                                              : "#f9fafb",
                                        color: isSelected
                                            ? "#ffffff"
                                            : slotFull
                                              ? "#991b1b"
                                              : "#374151",
                                        fontWeight: isSelected ? "500" : "400",
                                        fontSize: "13px",
                                        textAlign: "center",
                                        cursor:
                                            slotFull && !isSelected
                                                ? "not-allowed"
                                                : "pointer",
                                        transition: "all 0.15s",
                                        opacity:
                                            slotFull && !isSelected ? 0.6 : 1,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (
                                            !isSelected &&
                                            (!slotFull || !slotFull)
                                        ) {
                                            if (!slotFull) {
                                                e.currentTarget.style.backgroundColor =
                                                    "#eff6ff";
                                                e.currentTarget.style.borderColor =
                                                    "#93c5fd";
                                                e.currentTarget.style.color =
                                                    "#1d4ed8";
                                            }
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.backgroundColor =
                                                slotFull
                                                    ? "#fee2e2"
                                                    : "#f9fafb";
                                            e.currentTarget.style.borderColor =
                                                slotFull
                                                    ? "#fca5a5"
                                                    : "#e5e7eb";
                                            e.currentTarget.style.color =
                                                slotFull
                                                    ? "#991b1b"
                                                    : "#374151";
                                        }
                                    }}
                                >
                                    {slot}
                                </button>
                                {slotFull && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "-18px",
                                            right: "0",
                                            fontSize: "10px",
                                            backgroundColor: "#dc2626",
                                            color: "white",
                                            padding: "2px 6px",
                                            borderRadius: "3px",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Full
                                    </div>
                                )}
                                {maxSlots > 1 && (
                                    <div
                                        style={{
                                            fontSize: "10px",
                                            color: slotFull
                                                ? "#991b1b"
                                                : "#6b7280",
                                            marginTop: "2px",
                                        }}
                                    >
                                        {occupancy}/{maxSlots}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Divider */}
                <div
                    style={{
                        borderTop: "1px solid #f3f4f6",
                        marginBottom: "16px",
                    }}
                />

                {/* Actions */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "8px",
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: "8px 18px",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            backgroundColor: "#ffffff",
                            color: "#6b7280",
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (selected) onConfirm(selected);
                        }}
                        disabled={!selected}
                        style={{
                            padding: "8px 18px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: selected ? "#2563eb" : "#e5e7eb",
                            color: selected ? "#ffffff" : "#9ca3af",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: selected ? "pointer" : "not-allowed",
                            transition: "all 0.15s",
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
