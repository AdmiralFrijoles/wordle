import {ChartBarIcon} from "@heroicons/react/24/outline";
import {Box} from "@chakra-ui/react";
import {Tooltip} from "@/components/ui/tooltip";

export default function RankingModal() {
    return (
        <Tooltip showArrow openDelay={500} content="Stats & Ranking">
            <Box h={6} w={6}>
                <ChartBarIcon className="cursor-pointer animated"/>
            </Box>
        </Tooltip>
    )
}