import {Cog6ToothIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";

export default function SettingsModal() {
    return (
        <HeaderIcon tooltipContent="Settings">
            <Cog6ToothIcon className="dark:stroke-white"/>
        </HeaderIcon>
    )
}