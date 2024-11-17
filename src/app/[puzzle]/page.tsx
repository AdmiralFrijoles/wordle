"use server";

import GamePanel from "@/components/game";
import {notFound} from "next/navigation";
import {getPuzzleBySlug} from "@/lib/puzzle-service";

export default async function Page({params}: {params: Promise<{puzzle: string}>}) {
    const slug = (await params).puzzle;
    const puzzle = await getPuzzleBySlug(slug)

    if (!puzzle) {
        return notFound()
    }

    return (
        <GamePanel />
    );
}