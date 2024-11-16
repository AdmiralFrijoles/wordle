import {ChartBarIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";

export default function RankingModal() {
    return (
        <HeaderIcon tooltipContent="Stats & Ranking">
            <ChartBarIcon className="dark:stroke-white"/>
        </HeaderIcon>
    )
}