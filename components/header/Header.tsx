
import { PropsWithChildren } from "react"
import { Menu } from "react-feather"
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'


type HeaderProps = {
    onMenuClick: () => void
} & PropsWithChildren


function Header({ onMenuClick, children }: HeaderProps) {

    return (
        <div className="flex bg-[#594AE2] h-16 px-6 items-center flex-shrink-0">
            <button onClick={onMenuClick}><Menu color="#FFFFFF" /></button>
            <p className="text-2xl text-white ml-6" >{children}</p>
            <div className="flex-grow flex justify-end" />
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    )
}

export default Header