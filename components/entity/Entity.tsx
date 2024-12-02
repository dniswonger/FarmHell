import { Entity as PrismaEntity } from "@prisma/client";
import Graphics from "../graphics/Graphics";
import { useMemo } from "react";
import { useSidebar } from "../sidebar/useSidebar";

type EntityProps = {
    entity: PrismaEntity
}

export default function Entity({ entity }: EntityProps) {

    const { loadEntity } = useSidebar()

    const internalEntity = useMemo(() => {
        return entity
    }, [entity])


    function handleEntityClick() {
        loadEntity(internalEntity)
    }



    return (
        <Graphics onClick={handleEntityClick} x={entity.x} y={entity.y} width={entity.width} height={entity.height} shape="circle" />
    )
}