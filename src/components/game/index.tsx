"use client";

import {VStack, HStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {GameStates, Row} from "@/types";
import Keyboard from "@/components/game/keyboard";
import Key from "@/components/game/key";
import {lineHeights} from "@chakra-ui/react/dist/types/theme/tokens/line-heights";


export default function GamePanel() {
    const [rows, setRows] = useState<Row[]>([]);
    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const [text, setText] = useState("");
    const [solution, setSolution] = useState("");
    const [gameState, setGameState] = useState<keyof typeof GameStates>("Playing");

    function handleReset(){
        const temp: Row[] = [];
        for (let i = 0; i < 6; i++) {
            const row: Row = [
                {
                    value: "",
                    status: "Guessing",
                },
                {
                    value: "",
                    status: "Guessing",
                },
                {
                    value: "",
                    status: "Guessing",
                },
                {
                    value: "",
                    status: "Guessing",
                },
                {
                    value: "",
                    status: "Guessing",
                },
            ];
            temp.push(row);
        }
        setRows(temp);
        setCurrentRowIndex(0);
        //setSolution(loadSolution());
    }
    
    function handleLetterClick(letter: string) {
        if (text.length > 4) return;
        setText(text + letter);
    }

    function handleSubmit() {
        setText("");
        setCurrentRowIndex((prev) => prev + 1);
    }

    function deleteChar() {
        setText((prev) => text.substring(0, prev.length - 1));
    }

    useEffect(() => {
        handleReset();
    }, []);

    useEffect(() => {
        if (rows.length === 0) return;
        const currentRow = rows[currentRowIndex];
        for (let i = 0; i < currentRow.length; i++) {
            if (i < text.length) {
                currentRow[i].value = text[i];
            } else {
                currentRow[i].value = "";
            }
        }
        setRows([...rows]);
    }, [text]);

    return (
        <VStack justify="center" h="full" pb="8">
            <VStack pb="6">
                {rows.map((play, index) => (
                    <HStack key={index}>
                        {play.map((guess, idx) => (
                            <Key
                                key={idx}
                                value={guess.value}
                                status={guess.status}
                                onLetterClick={(letter: string) => handleLetterClick(letter)}
                                type="cell"
                            />
                        ))}
                    </HStack>
                ))}
            </VStack>
            <Keyboard
                onLetterClick={handleLetterClick}
                onSubmit={handleSubmit}
                rows={rows.slice(0, currentRowIndex)}
                onDelete={deleteChar}
            />
        </VStack>
    )
}