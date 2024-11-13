

import { PropsWithChildren } from "react"
import { Menu } from "react-feather"
import { useSession } from "next-auth/react"


type HeaderProps = {
    onMenuClick: () => void
} & PropsWithChildren


function Header({ onMenuClick, children }: HeaderProps) {

    const { data: session } = useSession()

    return (
        <div className="flex bg-[#594AE2] h-16 px-6 items-center flex-shrink-0">
            <button onClick={onMenuClick}><Menu color="#FFFFFF" /></button>
            <p className="text-2xl text-white ml-6" >{children}</p>
            {session && <p>Logged in as {session.user?.name}</p>}
        </div>
    )
}

export default Header