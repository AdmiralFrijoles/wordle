import {InformationCircleIcon} from "@heroicons/react/24/outline";
import {Box} from "@chakra-ui/react";
import {Tooltip} from "@/components/ui/tooltip";

export default function GuideModal() {
    return (
        <Tooltip showArrow openDelay={500} content="View the how to play guide">
            <Box h={6} w={6} mx="1">
                <InformationCircleIcon className="cursor-pointer animated"/>
            </Box>
        </Tooltip>
    )
}