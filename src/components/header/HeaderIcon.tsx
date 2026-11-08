"use client";

import React from "react";
import {Tooltip} from "@heroui/react";

type HeaderIconProps = {
    children: React.ReactNode;
    label: string;
    onPress?: () => void;
    type?: "button" | "submit";
}

export default function HeaderIcon({children, label, onPress, type = "button"}: HeaderIconProps) {
    return (
        <Tooltip content={label} delay={400} closeDelay={0}>
            <button
                type={type}
                aria-label={label}
                onClick={onPress}
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-fg-icon transition-colors hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-brand"
            >
                {children}
            </button>
        </Tooltip>
    );
}
