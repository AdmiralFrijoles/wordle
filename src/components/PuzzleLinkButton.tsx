"use client";

import {Tooltip} from "@heroui/react";
import {alertSuccess} from "@/lib/alerts";
import {LinkIcon} from "@/components/icons";

type Props = {
    link: string
}

export default function PuzzleLinkButton({link}: Props) {

    async function handleCopyLink() {
        try {
            const absoluteLink = new URL(link, window.location.origin);
            await navigator.clipboard.writeText(absoluteLink.href);
            alertSuccess("Link copied");
        } catch (e) {
            console.error("Failed to copy to clipboard:", e);
        }
    }

    return (
        <Tooltip content="Copy link to this puzzle" placement="bottom" delay={400} closeDelay={0}>
            <button type="button" aria-label="Copy link to this puzzle" onClick={handleCopyLink}
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-fg-sub transition-colors hover:bg-hover hover:text-fg">
                <LinkIcon size={16}/>
            </button>
        </Tooltip>
    )
}
