import GuideModal from "@/components/modal/GuideModal";
import RankingModal from "@/components/modal/RankingModal";
import SettingsModal from "@/components/modal/SettingsModal";
import ArchiveModal from "@/components/modal/ArchiveModal";
import CurrentUser from "@/components/header/CurrentUser";
import PuzzleButton from "@/components/header/PuzzleButton";
import {PrismaClient} from "@prisma/client";

export default async function Header() {
    const prisma = new PrismaClient();
    const hasMultiplePuzzles: boolean = (await prisma.puzzle.count({
        where: {isPublic: true}
    })) > 1;

    return (
        <div className="navbar border-slate-300 dark:border-slate-700">
            <div className="navbar-content px-5 short:h-auto">
                <div className="flex-1 flex justify-start mr-auto space-x-2">
                    <GuideModal/>
                    {hasMultiplePuzzles && <PuzzleButton/>}
                    <ArchiveModal/>
                </div>
                <p className="prevent-select mx-4 text-xl font-bold text-nowrap dark:text-white">
                    Dojo Wordle
                </p>
                <div className="flex-1 flex justify-end ml-auto space-x-2">
                    <RankingModal/>
                    <CurrentUser/>
                    <SettingsModal/>
                </div>
            </div>
        </div>
    )
}