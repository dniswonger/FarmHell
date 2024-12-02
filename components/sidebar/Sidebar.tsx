import { useSidebar } from "./useSidebar";
import Drawer from "@/components/drawer/Drawer";

export default function Sidebar() {

    const { currentEntity } = useSidebar()

    console.log('entity', currentEntity)

    return (
      
            <Drawer isOpen={currentEntity != null} position="right">
                <p>{currentEntity?.acquiredfrom}</p>
            </Drawer>
       
    )
}