import { Box, Center, Text } from "@chakra-ui/react";
import {CharStatus} from "@/types";

type Props = {
    value: string;
    onLetterClick?: (letter: string) => void;
    status: CharStatus;
    type: "keyboard" | "cell";
};

export default function Key({ value, status, onLetterClick, type }: Props) {
    function handleOnLetterClick() {
        if (onLetterClick) onLetterClick(value);
    }

    return (
        <Box
            className="cursor-pointer"
            bg={
                status === "Correct"
                    ? "green"
                    : status === "Present"
                        ? "orange"
                        : status === "Absent"
                            ? "gray.700"
                            : "transparent"
            }
            borderStyle="solid"
            borderWidth="2px"
            borderColor={
                status === "Correct"
                    ? "green"
                    : status === "Present"
                        ? "orange"
                        : status === "Absent"
                            ? "transparent"
                            : "white"
            }
            minW={
                type === "keyboard"
                    ? {
                        base: 6,
                        sm: 10,
                        md: 12
                    }
                    : 14
            }
            h={
                type === "keyboard"
                    ? {
                        base: 8,
                        md: 10,
                        lg: "var(--chakra-font-sizes-6xl)"
                    }
                    : 14
            }
            rounded="sm"
            transition="all"
            transitionDuration="500ms"
            onClick={handleOnLetterClick}
        >
            <Center h="full">
                <Text
                    fontWeight={"bold"}
                    fontSize={{
                        base: "xs",
                        lg: "xl",
                    }}
                    className="prevent-select"
                >
                    {value}
                </Text>
            </Center>
        </Box>
    );
}