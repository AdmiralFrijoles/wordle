import { Box, HStack, Text, Flex } from "@chakra-ui/react";
import GuideModal from "@/components/modal/GuideModal";
import RankingModal from "@/components/modal/RankingModal";
import SettingsModal from "@/components/modal/SettingsModal";
import ArchiveModal from "@/components/modal/ArchiveModal";
import CurrentUser from "@/components/header/CurrentUser";

export default function Header() {
    return (
        <Box as="nav" w="100%" borderBottom="1px" borderStyle="solid" borderColor="colorPalette.500" mb={6} p={2} px={4}>
            <HStack align="center" justify="space-between" w="100%">
                <Flex align="left" justify="left" grow="1" shrink="1" basis="0">
                    <GuideModal/>
                    <ArchiveModal/>
                </Flex>
                <Flex justify="revert" align="center">
                    <Text fontSize="2xl" fontWeight="bold">
                        Dojo Wordle
                    </Text>
                </Flex>
                <Flex align="right" justify="right" grow="1" shrink="1" basis="0">
                    <RankingModal/>
                    <CurrentUser/>
                    <SettingsModal/>
                </Flex>
            </HStack>
        </Box>
    )
}