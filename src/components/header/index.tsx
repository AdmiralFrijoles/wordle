import { Box, HStack, Text, Flex } from "@chakra-ui/react";
import GuideModal from "@/components/modal/GuideModal";
import RankingModal from "@/components/modal/RankingModal";
import SettingsModal from "@/components/modal/SettingsModal";

export default function Header() {
    return (
        <Box as="nav" w="100%" borderBottom="2px" borderColor={"white"} mb={6} p={2} px={4}>
            <HStack align="center" justify="space-between" w="100%">
                <Flex align="left" justify="left" grow="1" shrink="1" basis="0">
                    <GuideModal/>
                </Flex>
                <Flex justify="revert" align="center">
                    <Text fontSize="2xl" fontWeight="bold">
                        Dojo Wordle
                    </Text>
                </Flex>
                <Flex align="right" justify="right" grow="1" shrink="1" basis="0">
                    <RankingModal/>
                    <SettingsModal/>
                </Flex>
            </HStack>
        </Box>
    )
}