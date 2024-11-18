"use client";

import {LinkIcon} from "@heroicons/react/24/outline";
import {Tooltip} from "@nextui-org/react";
import {alertSuccess} from "@/lib/alerts";

type Props = {
    link: string
}

export default function PuzzleLinkButton({link}: Props) {

    async function handleCopyLink() {
        try {
            const absoluteLink = new URL(link, window.location.href);
            await navigator.clipboard.writeText(absoluteLink.href);
            alertSuccess("Copied!");
        } catch (e) {
            console.error("Failed to copy to clipboard:", e);
        }
    }

    return (
        <div onClick={handleCopyLink}>
            <Tooltip content="Copy link to this puzzle." placement="bottom">
                <LinkIcon className="dark:stroke-white cursor-pointer animated ml-2 h-4 w-4 stroke-[2.5px]"/>
            </Tooltip>
        </div>
    )
}