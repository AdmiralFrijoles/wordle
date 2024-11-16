import {UserCircleIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";

export default function CurrentUser() {
    return (
        <HeaderIcon tooltipContent="Sign In">
            <UserCircleIcon className="dark:stroke-white"/>
        </HeaderIcon>
    )
}