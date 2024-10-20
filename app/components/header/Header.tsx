import { PropsWithChildren } from "react"
import { Menu } from "react-feather"



type HeaderProps = {
    onMenuClick: () => void
} & PropsWithChildren


function Header({ onMenuClick, children }: HeaderProps) {

    return (
        <div className="flex bg-[#594AE2] h-16 px-6 items-center">
            <button onClick={onMenuClick}><Menu color="#FFFFFF" /></button>
            <p className="text-2xl text-white ml-6" >{children}</p>
        </div>
    )
}

export default Header