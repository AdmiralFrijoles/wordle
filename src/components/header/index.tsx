import GuideModal from "@/components/modal/GuideModal";
import RankingModal from "@/components/modal/RankingModal";
import SettingsModal from "@/components/modal/SettingsModal";
import ArchiveModal from "@/components/modal/ArchiveModal";
import CurrentUser from "@/components/header/CurrentUser";
import PuzzleSelectModal from "@/components/modal/PuzzleSelectModal";
import {getPuzzleCount} from "@/lib/puzzle-service";
import {getAppSetting} from "@/lib/settings-service";
import { SETTING_APP_TITLE } from "@/constants/settings";
import Link from "next/link";

export default async function Header() {
    const headerTitle = await getAppSetting<string>(SETTING_APP_TITLE) ?? "Wordle";
    const puzzleCount = await getPuzzleCount();

    return (
        <header className="w-full shrink-0 sm:border-b sm:border-line">
            <div className="mx-auto flex h-[60px] max-w-[1120px] items-center justify-between gap-4 pr-1.5 pl-[18px] sm:h-[68px] sm:px-6">
                <Link className="prevent-select truncate text-[21px] font-extrabold tracking-[-0.02em] text-fg sm:text-[22px]"
                      href="/">
                    {headerTitle}
                </Link>
                <nav aria-label="Game menu" className="flex gap-0.5 sm:gap-1">
                    <GuideModal/>
                    <RankingModal appTitle={headerTitle}/>
                    <CurrentUser/>
                    <SettingsModal/>
                </nav>
            </div>
            <PuzzleSelectModal hasMultiplePuzzles={puzzleCount > 1}/>
            <ArchiveModal/>
        </header>
    )
}
