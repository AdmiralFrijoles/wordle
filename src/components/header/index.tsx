import GuideModal from "@/components/modal/GuideModal";
import RankingModal from "@/components/modal/RankingModal";
import SettingsModal from "@/components/modal/SettingsModal";
import ArchiveModal from "@/components/modal/ArchiveModal";
import CurrentUser from "@/components/header/CurrentUser";

export default function Header() {
    return (
        <div className="navbar border-slate-300 dark:border-slate-700">
            <div className="navbar-content px-5 short:h-auto">
                <div className="flex-1 flex justify-start mr-auto space-x-2">
                    <GuideModal/>
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