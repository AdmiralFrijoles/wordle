import {Cog6ToothIcon} from "@heroicons/react/24/outline";
import {Box} from "@chakra-ui/react";
import {Tooltip} from "@/components/ui/tooltip";

export default function SettingsModal() {
    return (
        <Tooltip showArrow openDelay={500} content="Settings">
            <Box h={6} w={6}>
                <Cog6ToothIcon className="cursor-pointer animated"/>
            </Box>
        </Tooltip>
    )
}