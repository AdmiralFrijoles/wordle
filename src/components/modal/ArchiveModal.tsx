﻿import {CalendarDaysIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";

export default function ArchiveModal() {
    return (
        <HeaderIcon tooltipContent="Play Previous Words">
            <CalendarDaysIcon className="dark:stroke-white"/>
        </HeaderIcon>
    )
}