import {CalendarDaysIcon} from "@heroicons/react/24/outline";
import {Box} from "@chakra-ui/react";
import {Tooltip} from "@/components/ui/tooltip";

export default function ArchiveModal() {
    return (
        <Tooltip showArrow openDelay={500} content="Play a previous day's game">
            <Box h={6} w={6} mx="1">
                <CalendarDaysIcon className="cursor-pointer animated"/>
            </Box>
        </Tooltip>
    )
}