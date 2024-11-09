import Link from "next/link"

type DrawerProps = {
    isOpen: boolean
    position?: string
}

function Drawer({ isOpen, position = 'left' }: DrawerProps) {

    const drawerWidth = isOpen ? "translate-x-[-240px] transition ease-in" : "translate-x-0 transition ease-in"
    const drawerPosition = position === 'left' ? 'absolute left-0' : ''

    return (
        <div className={`${drawerWidth} ${drawerPosition} flex flex-col bg-slate-500 h-full overflow-hidden w-60 `}>
            <Link href="/">Home</Link>
            <Link href="/plantDatabase">Plant Database</Link>
            <Link href="/settings">Settings</Link>
            <Link href="/about">About</Link>
        </div>
    )
}

export default Drawer