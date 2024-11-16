import {CharStatus, Row} from "@/types";
import {Button, Center, HStack, Text, VStack} from "@chakra-ui/react";
import {useEffect, useMemo} from "react";
import {BackspaceIcon} from "@heroicons/react/24/outline";
import Key from "@/components/game/key";

const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"]
];

type KeyboardKeyProps = {
    value: string;
    onLetterClick: (letter: string) => void;
    onSubmit: () => void;
    onDelete: () => void;
    status: CharStatus;
}

function KeyboardKey({
                         value,
                         onLetterClick,
                         onSubmit,
                         onDelete,
                         status
}: KeyboardKeyProps) {
    if (value === "ENTER")
        return (
            <Button border="2px"
                    variant="plain"
                    type="button"
                    className="cursor-pointer"
                    bg="transparent"
                    borderStyle="solid"
                    borderWidth="2px"
                    borderColor="white"
                    h={{
                        base: 8,
                        md: 10,
                        lg: "var(--chakra-font-sizes-6xl)"
                    }}
                    rounded="sm"
                    onClick={onSubmit}
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
                        ENTER
                    </Text>
                </Center>
            </Button>
        )
    else if (value === "DELETE") {
        return (
            <Button onClick={onDelete}
                    border="2px"
                    variant="plain"
                    type="button"
                    className="cursor-pointer"
                    bg="transparent"
                    borderStyle="solid"
                    borderWidth="2px"
                    borderColor="white"
                    w={{
                        base: 8,
                        sm: 10,
                        md: 12
                    }}
                    h={{
                        base: 8,
                        md: 10,
                        lg: "var(--chakra-font-sizes-6xl)"
                    }}
                    rounded="sm"
            >
                <Center h="full">
                    <BackspaceIcon strokeWidth="3"/>
                </Center>
            </Button>
        )
    }
    else
        return (<Key value={value}
                     onLetterClick={onLetterClick}
                     status={status}
                     type="keyboard"/>);
}

type Props = {
    onLetterClick: (letter: string) => void;
    onSubmit: () => void;
    onDelete: () => void;
    rows: Row[];
};

export default function Keyboard({
                                     onLetterClick,
                                     onSubmit,
                                     onDelete,
                                     rows
}: Props) {
    const cells = useMemo(() => rows.flat(), [rows]);

    const checkStatus = (key: string) => {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].value === key && cells[i].status === "Absent")
                return "Absent" as CharStatus;
        }
        return "Guessing" as CharStatus;
    };

    useEffect(() => {
        function listener(e: KeyboardEvent) {
            if (e.code === "Enter") {
                onSubmit();
            } else if (e.code === "Backspace") {
                onDelete();
            } else {
                const key = e.key.toUpperCase();
                if (key.length === 1 && key >= "A" && key <= "Z")
                    onLetterClick(key);
            }
        }
        window.addEventListener("keyup", listener);
        return () => {
            window.removeEventListener("keyup", listener);
        };
    })

    return (
        <VStack>
            {keyboardLayout.map((row, rowIndex) => (
                <HStack key={rowIndex} align="center" justify="center">
                    {row.map(key => (
                        <KeyboardKey key={key}
                                     value={key}
                                     onLetterClick={onLetterClick}
                                     onSubmit={onSubmit}
                                     onDelete={onDelete}
                                     status={checkStatus(key)}/>
                    ))}
                </HStack>
            ))}
        </VStack>
    );
}

