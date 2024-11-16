import {InformationCircleIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";

export default function GuideModal() {
    return (
        <HeaderIcon tooltipContent="How To Play">
            <InformationCircleIcon className="dark:stroke-white"/>
        </HeaderIcon>
    )
}