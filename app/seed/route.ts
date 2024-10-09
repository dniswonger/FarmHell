// import bcrypt from 'bcrypt';
// import { db } from "@vercel/postgres";
// import fs from "node:fs";
// import { parse } from "csv-parse";

// const processFile = async (filename: string) => {
//   const records = [];
//   const parser = fs.createReadStream(filename).pipe(
//     parse({
//       bom: true,
//       columns: true,
//     })
//   );
//   for await (const record of parser) {
//     // Work with each record
//     records.push(record);
//   }
//   return records;
// };

// const processFilePipeDelimited = async (filename: string) => {
//   const records = [];
//   const parser = fs.createReadStream(filename).pipe(
//     parse({
//       columns: true,
//       delimiter: "|",
//     })
//   );
//   for await (const record of parser) {
//     // Work with each record
//     records.push(record);
//   }
//   return records;
// };

// const client = await db.connect();

// async function seedBaseColors() {
//   const baseColors = await processFile(`./app/lib/basecolors.csv`);

//   await client.sql`
//     CREATE TABLE IF NOT EXISTS basecolors (
//       id SERIAL PRIMARY KEY,
//       name TEXT NOT NULL UNIQUE,
//       value TEXT NOT NULL
//     );
//   `;

//   const insertedBaseColors = await Promise.all(
//     baseColors.map(async (color) => {
//       return client.sql`
//         INSERT INTO basecolors (id, name, value)
//         VALUES (${color.Id}, ${color.Name}, ${color.Value})
//         ON CONFLICT (id) DO NOTHING;
//       `;
//     })
//   );

//   return insertedBaseColors;
// }

// async function seedEntityTypes() {
//   const entityTypes = await processFile(`./app/lib/entity_type.csv`);

//   await client.sql`
//       CREATE TABLE IF NOT EXISTS entitytypes (
//         id SERIAL PRIMARY KEY,
//         typename TEXT NOT NULL UNIQUE
//       );
//     `;

//   const insertedEntityTypes = await Promise.all(
//     entityTypes.map(async (eType) => {
//       return client.sql`
//           INSERT INTO entitytypes (id, typename)
//           VALUES (${eType.Id}, ${eType.TypeName})
//           ON CONFLICT (id) DO NOTHING;
//         `;
//     })
//   );

//   return insertedEntityTypes;
// }

// async function seedPlantCategories() {
//   const categories = await processFile(`./app/lib/plant_categories.csv`);

//   await client.sql`
//       CREATE TABLE IF NOT EXISTS plantcategories (
//         name TEXT NOT NULL PRIMARY KEY,
//         shape INTEGER NOT NULL,
//         fillcolor TEXT NOT NULL,
//         strokecolor TEXT NOT NULL,
//         iconurl TEXT NOT NULL
//       );
//     `;

//   const insertedCategories = await Promise.all(
//     categories.map(async (cat) => {
//       return client.sql`
//           INSERT INTO plantcategories (name, shape, fillcolor, strokecolor, iconurl)
//           VALUES (${cat.Name}, ${cat.Shape}, ${cat.FillColor}, ${cat.StrokeColor}, ${cat.IconUrl})
//           ON CONFLICT (name) DO NOTHING;
//         `;
//     })
//   );

//   return insertedCategories;
// }

// async function seedPlantForms() {
//   const forms = await processFile(`./app/lib/plant_form.csv`);

//   await client.sql`
//       CREATE TABLE IF NOT EXISTS plantform (
//        id SERIAL PRIMARY KEY,
//        name TEXT NOT NULL
//       );
//     `;

//   const insertedForms = await Promise.all(
//     forms.map(async (form) => {
//       return client.sql`
//           INSERT INTO plantform (id, name)
//           VALUES (${form.Id}, ${form.Name.trim()})
//           ON CONFLICT (id) DO NOTHING;
//         `;
//     })
//   );

//   return insertedForms;
// }

// async function seedPlantDefinitions() {
//   const definitions = await processFile(`./app/lib/plant_definition.csv`);

//   await client.sql`
//       CREATE TABLE IF NOT EXISTS plantdefinition (
//         id SERIAL PRIMARY KEY,
//         genus TEXT,
//         species TEXT,
//         variety TEXT,
//         plantcategory TEXT NOT NULL REFERENCES plantcategories(name),
//         isedible BOOLEAN NOT NULL,
//         form INTEGER NOT NULL REFERENCES plantform(id),
//         maxheight INTEGER,
//         minheight INTEGER,
//         habit INTEGER,
//         minzone INTEGER,
//         maxzone INTEGER,
//         colorpredominant INTEGER REFERENCES basecolors(id),
//         colormajor INTEGER REFERENCES basecolors(id),
//         colorminor INTEGER REFERENCES basecolors(id),
//         lightpreferencemin INTEGER,
//         lightpreferencemax INTEGER,
//         waterpreference INTEGER,
//         notes TEXT,
//         timeadded TIMESTAMP WITH TIME ZONE NOT NULL,
//         timealtered TIMESTAMP WITH TIME ZONE NOT NULL
//       );
//     `;
//   const insertedPlantDefinitions = await Promise.all(
//     definitions.map(async (def) => {
//       return client.sql`
//           INSERT INTO plantdefinition (id, genus, species, variety, plantcategory, isedible, form, maxheight, minheight, habit, minzone, maxzone, colorpredominant, colormajor, colorminor, lightpreferencemin, lightpreferencemax, waterpreference, notes, timeadded, timealtered)
//           VALUES (${def.Id}, ${def.Genus}, ${def.Species}, ${def.Variety}, ${
//         def.PlantCategory
//       }, ${def.IsEdible === "True" ? 1 : 0}, ${def.Form}, ${
//         def.MaxHeight === "" ? null : def.MaxHeight
//       }, ${def.MinHeight === "" ? null : def.MinHeight}, ${
//         def.Habit === "" ? null : def.Habit
//       }, ${def.MinZone === "" ? null : def.MinZone}, ${
//         def.MaxZone === "" ? null : def.MaxZone
//       }, ${def.ColorPredominant === "" ? null : def.ColorPredominant}, ${
//         def.ColorMajor === "" ? null : def.ColorMajor
//       }, ${def.ColorMinor === "" ? null : def.ColorMinor}, ${
//         def.LightPreferenceMin === "" ? null : def.LightPreferenceMin
//       }, ${def.LightPreferenceMax === "" ? null : def.LightPreferenceMax}, ${
//         def.WaterPreference === "" ? null : def.WaterPreference
//       }, null, ${def.TimeAdded}, ${def.TimeAltered})
//           ON CONFLICT (id) DO NOTHING;
//         `;
//     })
//   );

//   return insertedPlantDefinitions;
// }

// async function seedImage() {
//   const images = await processFilePipeDelimited(`./app/lib/image.csv`);

//   await client.sql`
//       CREATE TABLE IF NOT EXISTS image (
//         id SERIAL PRIMARY KEY,
//         url TEXT NOT NULL,
//         source TEXT,
//         photographer TEXT ,
//         notes TEXT
//       );
//     `;

//   const insertedImages = await Promise.all(
//     images.map(async (image) => {
//       return client.sql`
//           INSERT INTO image (id, url, source, photographer, notes)
//           VALUES (${image.Id}, ${image.Url}, ${image.Source}, ${image.Photographer}, ${image.Notes})
//           ON CONFLICT (id) DO NOTHING;
//         `;
//     })
//   );

//   return insertedImages;
// }

// async function seedPlantDefImage() {
//   const defImages = await processFile(`./app/lib/plant_def_image.csv`);
//   // console.log(defImages);
//   await client.sql`
//       CREATE TABLE IF NOT EXISTS plantdefimage (
//         plantdefid INTEGER REFERENCES plantdefinition(id) NOT NULL,
//         imageid INTEGER REFERENCES image(id) NOT NULL,
//         isdefault BOOLEAN NOT NULL
//       );
//     `;

//   const insertedPlantDefImages = await Promise.all(
//     defImages.map(async (defImage) => {
//       console.log(defImage);
//       return client.sql`
//           INSERT INTO plantdefimage (plantdefid, imageid, isdefault)
//           VALUES (${defImage.PlantDefId}, ${defImage.ImageId}, ${
//         defImage.IsDefault === "True" ? 1 : 0
//       })
//         `;
//     })
//   );

//   return insertedPlantDefImages;
// }

// async function seedEntities() {
//   const entities = await processFile(`./app/lib/entity.csv`);

//   await client.sql`
//       CREATE TABLE IF NOT EXISTS entities (
//         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//         entitytype INTEGER NOT NULL REFERENCES entitytypes(id),
//         name TEXT,
//         plantdef INTEGER NOT NULL REFERENCES plantdefinition(id),
//         x FLOAT4 NOT NULL,
//         y FLOAT4 NOT NULL,
//         width FLOAT4 NOT NULL,
//         height FLOAT4 NOT NULL,
//         angle FLOAT4 NOT NULL,
//         filloverride TEXT,
//         strokeoverride TEXT,
//         dateplanted TIMESTAMP WITH TIME ZONE,
//         acquiredfrom TEXT,
//         timealtered TIMESTAMP WITH TIME ZONE NOT NULL,
//         timeadded TIMESTAMP WITH TIME ZONE NOT NULL
//       );
//     `;

//   const insertedEntities = await Promise.all(
//     entities.map(async (entity) => {
//       return client.sql`
//           INSERT INTO entities (id, entitytype, name, plantdef, x, y, width, height, angle, filloverride, strokeoverride, dateplanted, acquiredfrom, timealtered, timeadded)
//           VALUES (${entity.Id}, ${entity.EntityType}, ${
//         entity.Name === "" ? null : entity.Name
//       }, ${entity.PlantDef}, ${entity.X}, ${entity.Y}, ${entity.Width}, ${
//         entity.Height
//       }, ${entity.Angle}, ${
//         entity.FillOverride === "" ? null : entity.FillOverride
//       }, ${entity.StrokeOverride === "" ? null : entity.StrokeOverride}, ${
//         entity.DatePlanted === "" ? null : entity.DatePlanted
//       }, ${entity.AcquiredFrom === "" ? null : entity.AcquiredFrom}, ${
//         entity.TimeAltered
//       }, ${entity.TimeAdded})
//           ON CONFLICT (id) DO NOTHING;
//         `;
//     })
//   );

//   return insertedEntities;
// }

// async function seedNotes() {
//   const notes = await processFile(`./app/lib/note.csv`);

//   await client.sql`
//       CREATE TABLE IF NOT EXISTS note (
//        entityid uuid NOT NULL REFERENCES entities(id),
//        datetime TIMESTAMP WITH TIME ZONE NOT NULL PRIMARY KEY,
//        text TEXT NOT NULL,
//        imagelink TEXT
//       );
//     `;

//   const insertedNotes = await Promise.all(
//     notes.map(async (note) => {
//       return client.sql`
//           INSERT INTO note (entityid, datetime, text, imagelink)
//           VALUES (${note.EntityId}, ${note.DateTime}, ${note.Text}, ${
//         note.ImageLink === "" ? null : note.ImageLink
//       })
//           ON CONFLICT (datetime) DO NOTHING;
//         `;
//     })
//   );

//   return insertedNotes;
// }

// async function seedSettings() {
//   const settings = await processFile(`./app/lib/settings.csv`);

//   await client.sql`
//       CREATE TABLE IF NOT EXISTS settings (
//        username TEXT NOT NULL PRIMARY KEY,
//        scale FLOAT4 NOT NULL,
//        offsetx INTEGER NOT NULL,
//        offsety INTEGER NOT NULL,
//        surveyslicesx INTEGER NOT NULL,
//        surveyslicesy INTEGER NOT NULL
//       );
//     `;

//   const insertedSettings = await Promise.all(
//     settings.map(async (setting) => {
//       console.log(setting);
//       return client.sql`
//           INSERT INTO settings (username, scale, offsetx, offsety, surveyslicesx, surveyslicesy)
//           VALUES (${setting.Username}, ${setting.Scale}, ${setting.OffsetX}, ${setting.OffsetY}, ${setting.SurveySlicesX}, ${setting.SurveySlicesY})
//           ON CONFLICT (username) DO NOTHING;
//         `;
//     })
//   );

//   return insertedSettings;
// }

export async function GET() {
  // try {
  //   await client.sql`BEGIN`;

  //   await seedBaseColors();
  //   await seedEntityTypes();
  //   await seedPlantCategories();
  //   await seedPlantForms();
  //   await seedPlantDefinitions();
  //   await seedImage();
  //   await seedPlantDefImage();
  //   await seedEntities();
  //   await seedNotes();
  //   await seedSettings();

  //   await client.sql`COMMIT`;

  //   return Response.json({ message: "Database seeded successfully" });
  // } catch (error) {
  //   await client.sql`ROLLBACK`;
  //   return Response.json({ error }, { status: 500 });
  // }
  return Response.json({
    message:
      "Uncomment this file and remove this line. You can delete this file when you are finished.",
  });
}
