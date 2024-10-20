import { BaseColor, EntityType, Note, PrismaClient } from "@prisma/client"

export async function getStaticProps() {
    const prisma = new PrismaClient()
    const baseColors = await prisma.baseColor.findMany()
    const entityTypes = await prisma.entityType.findMany()
    const notes = await prisma.note.findMany()

    // const jsonNotes: TestNote[] = []
    // notes.forEach(n => {
    //     const blah: TestNote = JSON.parse(JSON.stringify(n))
    //     jsonNotes.push(blah)

    // })

    return { props: { baseColors, entityTypes, notes }}
}

// type TestNote = {
//     entityid: string,
//     dateTime: string,
//     text: string,
//     imageLink: string
// }

type TestProps = {
    baseColors: BaseColor[]
    entityTypes: EntityType[]
    notes: Note[]
}


export default function Test(props: TestProps) {
    return (
        <ul>
            <p>Base Colors</p>
            {props.baseColors.map((c) => <li key={c.name} > {c.value} </li>)}
            <p>Entity Types</p>
            {props.entityTypes.map((c) => <li key={c.typename} > {c.typename} </li>)}
            <p>Notes</p>
            {props.notes.map(n => <li key={n.entityid} > {n.text} </li>)}
        </ul>
    )
}