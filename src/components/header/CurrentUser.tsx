import {Tooltip} from "@/components/ui/tooltip";
import {Box} from "@chakra-ui/react";
import {UserCircleIcon} from "@heroicons/react/24/outline";

export default function CurrentUser() {
    return (
        <Tooltip showArrow openDelay={500} content="Sign In">
            <Box h={6} w={6}>
                <UserCircleIcon className="cursor-pointer animated"/>
            </Box>
        </Tooltip>
    )
}