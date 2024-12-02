type DrawerProps = {
    isOpen: boolean
    position?: string
    children: React.ReactNode
}

function Drawer({ isOpen, position = 'left', children }: DrawerProps) {

    let drawerWidth = ''
    if (position === 'left') {
        drawerWidth = isOpen ? "translate-x-0 transition ease-in" : "translate-x-[-240px] transition ease-in"
    }
    else {
        drawerWidth = isOpen ?  "translate-x-0 transition ease-in" : "translate-x-[240px] transition ease-in"
    }

    const drawerPosition = position === 'left' ? 'absolute left-0' : 'absolute right-0'

    return (
        <div className={`${drawerWidth} ${drawerPosition} flex flex-col bg-slate-500 h-full w-60 `}>
            {children}
        </div>
    )
}

export default Drawer