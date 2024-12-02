import { PropsWithChildren, useState } from "react";
import Header from "../header/Header";
import Drawer from "../drawer/Drawer";
import Link from "next/link";

export default function Layout({ children }: PropsWithChildren) {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    return (
        <div className="h-full flex flex-col">
            <Header onMenuClick={() => { setIsDrawerOpen(!isDrawerOpen) }}>Go To Heliconia</Header>
            <div className="flex-grow relative overflow-hidden">
                <Drawer isOpen={isDrawerOpen} position="left">
                    <Link href="/">Home</Link>
                    <Link href="/plantDatabase">Plant Database</Link>
                    <Link href="/settings">Settings</Link>
                    <Link href="/about">About</Link>
                </Drawer>
                {children}
            </div>
        </div>
    )
}