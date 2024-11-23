"use client";

import {useState} from "react";
import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    SharedSelection
} from "@nextui-org/react";
import {ChevronDownIcon, ShareIcon} from "@heroicons/react/24/outline";
import {alertError, alertSuccess} from "@/lib/alerts";
import {IUserPuzzleSolution} from "@/types";
import {Puzzle, Solution} from "@prisma/client";
import shareStats from "@/lib/share";
import {useSettings} from "@/providers/SettingsProvider";
import {useMount} from "react-use";

type Props = {
    appTitle: string;
    currentPuzzle: Puzzle;
    currentSolution: Solution;
    currentUserSolution: IUserPuzzleSolution;
    isHardMode: boolean;
    isDarkMode: boolean;
    isHighContrast: boolean;
}

export default function ShareButton(props: Props) {
    const [selectedOption, setSelectedOption] = useState<SharedSelection>(new Set(["markdown"]));
    const settings = useSettings();

    const actions = [{
        id: "markdown",
        label: "Share",
        description: "Includes markdown with links and styling. Useful when sharing in Discord or Slack.",
    }, {
        id: "basic",
        label: "Share (basic)",
        description: "Basic formatting without links or styling.",
    }];

    useMount(() => {
        setSelectedOption(new Set([settings.shareMode]));
    })

    function onSelectedOptionChanged(selection: SharedSelection) {
        setSelectedOption(selection);
        const shareMode = Array.from(selection)[0];
        settings.setShareMode(shareMode.toString());
    }

    function handleShareFailure() {
        alertError("Failed to share stats", 5000);
    }

    function handleShareToClipboard() {
        alertSuccess("Game copied to clipboard");
    }

    // Convert the Set to an Array and get the first value.
    const selectedOptionValue = Array.from(selectedOption)[0];
    const selectedOptionLabel = actions.find(action => action.id === selectedOptionValue)?.label;

    function handleShare() {
        const useMarkdown = selectedOptionValue === "markdown";
        shareStats(
            props.appTitle,
            props.currentPuzzle,
            props.currentSolution,
            props.currentUserSolution,
            props.isHardMode,
            props.isDarkMode,
            props.isHighContrast,
            handleShareToClipboard,
            handleShareFailure,
            useMarkdown
        );
    }

    return (
        <ButtonGroup variant="flat" fullWidth={true}>
            <Button className="flex w-full justify-start items-center rounded-l-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
                    onPress={handleShare}
            >
                <ShareIcon className="justify-start mr-2 h-6 w-6 cursor-pointer dark:stroke-white"/>
                <p className="justify-center text-center w-full">{selectedOptionLabel}</p>
            </Button>
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <Button
                        className="w-20 items-center justify-center rounded-r-md border border-transparent border-l-1 border-l-solid border-l-red bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
                        isIconOnly
                    >
                        <ChevronDownIcon width="1.5rem" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    disallowEmptySelection
                    aria-label="Share options"
                    selectedKeys={selectedOption}
                    selectionMode="single"
                    onSelectionChange={onSelectedOptionChanged}
                    className="max-w-[325px]"
                >
                    {actions.map(({id, label, description}) => (
                        <DropdownItem key={id} textValue={label}
                                      description={(<p className="text-small">{description}</p>)}
                        >
                            <p className="text-medium">{label}</p>
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </ButtonGroup>
    );
}