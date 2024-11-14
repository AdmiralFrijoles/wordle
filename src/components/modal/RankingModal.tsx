import { ChartBarIcon } from "@heroicons/react/24/outline";
import {Box} from "@chakra-ui/react";

export default function RankingModal() {
    return (
        <Box h={6} w={6} cursor="pointer">
            <ChartBarIcon/>
        </Box>
    )
}