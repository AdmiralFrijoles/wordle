"use client";

import {Cog6ToothIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import {useDisclosure} from "@nextui-org/use-disclosure";
import BaseModal from "@/components/modal/ModalBase";
import SettingsToggle from "@/components/settings/SettingsToggle";
import {useSettings} from "@/providers/SettingsProvider";
import {alertError} from "@/lib/alerts";
import {APP_VERSION} from "@/constants";
import {useGlobalModal} from "@/providers/GlobalModalProvider";
import {Button} from "@nextui-org/react";

export default function SettingsModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const settings = useSettings();
    const changelogModal = useGlobalModal("changelog");

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
                    <div className="flex justify-between gap-4 py-3">
                        <div className="mt-0 text-left text-gray-500 dark:text-gray-300">
                            <p className="leading-none">App Version</p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                                v{APP_VERSION}
                            </p>
                        </div>
                        {changelogModal &&
                            <Button
                                onPress={changelogModal.onOpenChange}
                                className="min-w-24 h-9 flex shrink-0 rounded-md p-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                            What&#39;s New
                            </Button>}
                    </div>
                </div>
            </BaseModal>
        </>
    )
}