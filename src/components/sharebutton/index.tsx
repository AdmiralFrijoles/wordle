"use client";

import {useState} from "react";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    SharedSelection
} from "@heroui/react";
import {ChevronDownIcon, ShareIcon} from "@/components/icons";
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
        <div className="btn-primary flex h-[54px] items-stretch rounded-2xl">
            <Button className="h-full flex-1 gap-2.5 rounded-none rounded-l-2xl bg-transparent text-base font-bold text-white"
                    onPress={handleShare}
            >
                <ShareIcon size={20}/>
                {selectedOptionLabel}
            </Button>
            <div aria-hidden="true" className="my-3 w-px bg-white/25"/>
            <Dropdown placement="bottom-end" classNames={{content: "sheet-surface"}}>
                <DropdownTrigger>
                    <Button
                        aria-label="Share options"
                        className="h-full w-14 min-w-14 rounded-none rounded-r-2xl bg-transparent text-white"
                        isIconOnly
                    >
                        <ChevronDownIcon size={20}/>
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
                                      description={(<span className="text-[13px] text-fg-sub">{description}</span>)}
                        >
                            <span className="text-base font-semibold text-fg">{label}</span>
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}