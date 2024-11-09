import { PropsWithChildren, useState } from "react";
import Header from "../header/Header";
import Drawer from "../drawer/Drawer";

export default function Layout({ children }: PropsWithChildren) {


    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    return (
        <div className="relative h-full">
            <Header onMenuClick={() => { setIsDrawerOpen(!isDrawerOpen) }}>Go To Heliconia</Header>
            <Drawer isOpen={isDrawerOpen} position="left" />
            {children}
        </div>
    )
}