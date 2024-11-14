import { InformationCircleIcon } from "@heroicons/react/24/outline";
import {Box} from "@chakra-ui/react";

export default function GuideModal() {
    return (
        <Box h={6} w={6} cursor="pointer">
            <InformationCircleIcon/>
        </Box>
    )
}