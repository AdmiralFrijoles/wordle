"use client";

import {Cog6ToothIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import {useDisclosure} from "@nextui-org/use-disclosure";
import BaseModal from "@/components/modal/ModalBase";
import SettingsToggle from "@/components/settings/SettingsToggle";
import {useSettings} from "@/providers/SettingsProvider";
import {alertError} from "@/lib/alerts";

export default function SettingsModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const settings = useSettings();

    function trySetIsHardMode(enabled: boolean) {
        if (!settings.canSetIsHardMode) {
            alertError("Hard Mode can only be enabled at the start!");
            return;
        }
        settings.setIsHardMode(enabled);
    }

    return (
        <>
            <HeaderIcon tooltipContent="Settings">
                <Cog6ToothIcon className="dark:stroke-white" onClick={onOpen}/>
            </HeaderIcon>
            <BaseModal title="Settings" isOpen={isOpen} onOpenChange={onOpenChange}>
                <div className="mt-2 flex flex-col divide-y">
                    <SettingsToggle
                        settingName="Hard Mode"
                        flag={settings.isHardMode}
                        handleFlag={trySetIsHardMode}
                        description="Any revealed hints must be used in subsequent guesses"
                    />
                    <SettingsToggle
                        settingName="Dark Mode"
                        flag={settings.isDarkMode}
                        handleFlag={settings.setIsDarkMode}
                    />
                    <SettingsToggle
                        settingName="High Contrast Mode"
                        flag={settings.isHighContrast}
                        handleFlag={settings.setIsHighContrast}
                        description="For improved color vision"
                    />
                </div>
            </BaseModal>
        </>
    )
}