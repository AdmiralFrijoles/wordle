import GuideModal from "@/components/modal/GuideModal";
import RankingModal from "@/components/modal/RankingModal";
import SettingsModal from "@/components/modal/SettingsModal";
import ArchiveModal from "@/components/modal/ArchiveModal";
import CurrentUser from "@/components/header/CurrentUser";
import PuzzleButton from "@/components/header/PuzzleButton";
import {getPuzzleCount} from "@/lib/puzzle-service";
import {getAppSetting} from "@/lib/settings-service";
import { SETTING_APP_TITLE } from "@/constants/settings";
import Link from "next/link";

export default async function Header() {
    const puzzleCount = await getPuzzleCount();
    const headerTitle = await getAppSetting<string>(SETTING_APP_TITLE);

    return (
        <div className="navbar border-b-2 border-slate-200 dark:border-slate-700">
            <div className="navbar-content px-5 short:h-auto">
                <div className="flex-1 flex justify-start mr-auto space-x-2">
                    <GuideModal/>
                    {puzzleCount > 1 && <PuzzleButton/>}
                    <ArchiveModal/>
                </div>
                    <Link className="prevent-select mx-4 text-xl font-bold text-nowrap dark:text-white" href="/">
                        {headerTitle}
                    </Link>
                <div className="flex-1 flex justify-end ml-auto space-x-2">
                    <RankingModal/>
                    <CurrentUser/>
                    <SettingsModal/>
                </div>
            </div>
        </div>
    )
}