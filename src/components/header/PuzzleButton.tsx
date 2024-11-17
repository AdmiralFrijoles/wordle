import {PuzzlePieceIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";

export default function PuzzleButton() {
    return (
        <HeaderIcon tooltipContent="Choose Puzzle">
            <PuzzlePieceIcon className="dark:stroke-white"/>
        </HeaderIcon>
    )
}