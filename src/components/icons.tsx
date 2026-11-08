import React from "react";

type IconProps = {
    size?: number;
    strokeWidth?: number;
    className?: string;
};

function Icon({size = 22, strokeWidth = 1.8, className, children}: IconProps & { children: React.ReactNode }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
             aria-hidden="true" className={className}>
            {children}
        </svg>
    );
}

export function HelpIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="9"/>
            <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"/>
            <path d="M12 17h.01"/>
        </Icon>
    );
}

export function StatsIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M5 20V11"/>
            <path d="M12 20V4"/>
            <path d="M19 20v-6"/>
        </Icon>
    );
}

export function UserIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="8.5" r="3.5"/>
            <path d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5"/>
        </Icon>
    );
}

export function SettingsIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M4 7h9"/>
            <path d="M19 7h1"/>
            <circle cx="16" cy="7" r="2.5"/>
            <path d="M4 17h3"/>
            <path d="M13 17h7"/>
            <circle cx="10" cy="17" r="2.5"/>
        </Icon>
    );
}

export function ChevronLeftIcon(props: IconProps) {
    return <Icon strokeWidth={2} {...props}><path d="M15 6l-6 6 6 6"/></Icon>;
}

export function ChevronRightIcon(props: IconProps) {
    return <Icon strokeWidth={2} {...props}><path d="M9 6l6 6-6 6"/></Icon>;
}

export function ChevronDownIcon(props: IconProps) {
    return <Icon strokeWidth={2.2} {...props}><path d="M6 9l6 6 6-6"/></Icon>;
}

export function CalendarIcon(props: IconProps) {
    return (
        <Icon strokeWidth={2} {...props}>
            <rect x="3.5" y="5" width="17" height="15" rx="3"/>
            <path d="M3.5 10h17"/>
            <path d="M8 3v4"/>
            <path d="M16 3v4"/>
        </Icon>
    );
}

export function LinkIcon(props: IconProps) {
    return (
        <Icon strokeWidth={2} {...props}>
            <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/>
            <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>
        </Icon>
    );
}

export function BoltIcon(props: IconProps) {
    return <Icon strokeWidth={2.2} {...props}><path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/></Icon>;
}

export function BackspaceIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"/>
            <path d="M12.5 9.5l5 5"/>
            <path d="M17.5 9.5l-5 5"/>
        </Icon>
    );
}

export function CloseIcon(props: IconProps) {
    return (
        <Icon strokeWidth={2} {...props}>
            <path d="M6 6l12 12"/>
            <path d="M18 6L6 18"/>
        </Icon>
    );
}

export function ShareIcon(props: IconProps) {
    return (
        <Icon strokeWidth={2} {...props}>
            <path d="M12 3v12"/>
            <path d="M7 8l5-5 5 5"/>
            <path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>
        </Icon>
    );
}

export function ClockIcon(props: IconProps) {
    return (
        <Icon strokeWidth={2} {...props}>
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v5l3 2"/>
        </Icon>
    );
}
