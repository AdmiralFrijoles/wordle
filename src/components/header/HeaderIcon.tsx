"use client";

import React from "react";
import {Tooltip} from "@heroui/react";

type HeaderIconProps = {
    children: React.ReactNode;
    tooltipContent: React.ReactNode | null | undefined;
}

export default function HeaderIcon({children, tooltipContent}: HeaderIconProps) {
    if (tooltipContent) {
        return (
            <Tooltip showArrow content={tooltipContent}>
                <div className="h-6 w-6 cursor-pointer animated">
                    {children}
                </div>
            </Tooltip>
        )
    } else {
        return (
            <div className="h-6 w-6 cursor-pointer animated">
                {children}
            </div>
        )
    }
}