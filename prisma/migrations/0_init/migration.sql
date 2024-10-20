-- CreateTable
CREATE TABLE "basecolors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "basecolors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entitytypes" (
    "id" SERIAL NOT NULL,
    "typename" TEXT NOT NULL,

    CONSTRAINT "entitytypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT,
    "photographer" TEXT,
    "notes" TEXT,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "entityid" UUID NOT NULL,
    "datetime" TIMESTAMPTZ(6) NOT NULL,
    "text" TEXT NOT NULL,
    "imagelink" TEXT,

    CONSTRAINT "note_pkey" PRIMARY KEY ("datetime")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entitytype" INTEGER NOT NULL,
    "name" TEXT,
    "plantdef" INTEGER NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    "angle" REAL NOT NULL,
    "filloverride" TEXT,
    "strokeoverride" TEXT,
    "dateplanted" TIMESTAMPTZ(6),
    "acquiredfrom" TEXT,
    "timealtered" TIMESTAMPTZ(6) NOT NULL,
    "timeadded" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantcategories" (
    "name" TEXT NOT NULL,
    "shape" INTEGER NOT NULL,
    "fillcolor" TEXT NOT NULL,
    "strokecolor" TEXT NOT NULL,
    "iconurl" TEXT NOT NULL,

    CONSTRAINT "plantcategories_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "plantdefimage" (
    "plantdefid" INTEGER NOT NULL,
    "imageid" INTEGER NOT NULL,
    "isdefault" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "plantdefinition" (
    "id" SERIAL NOT NULL,
    "genus" TEXT,
    "species" TEXT,
    "variety" TEXT,
    "plantcategory" TEXT NOT NULL,
    "isedible" BOOLEAN NOT NULL,
    "form" INTEGER NOT NULL,
    "maxheight" INTEGER,
    "minheight" INTEGER,
    "habit" INTEGER,
    "minzone" INTEGER,
    "maxzone" INTEGER,
    "colorpredominant" INTEGER,
    "colormajor" INTEGER,
    "colorminor" INTEGER,
    "lightpreferencemin" INTEGER,
    "lightpreferencemax" INTEGER,
    "waterpreference" INTEGER,
    "notes" TEXT,
    "timeadded" TIMESTAMPTZ(6) NOT NULL,
    "timealtered" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "plantdefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantform" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "plantform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "username" TEXT NOT NULL,
    "scale" REAL NOT NULL,
    "offsetx" INTEGER NOT NULL,
    "offsety" INTEGER NOT NULL,
    "surveyslicesx" INTEGER NOT NULL,
    "surveyslicesy" INTEGER NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("username")
);

-- CreateIndex
CREATE UNIQUE INDEX "basecolors_name_key" ON "basecolors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "entitytypes_typename_key" ON "entitytypes"("typename");

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_entityid_fkey" FOREIGN KEY ("entityid") REFERENCES "entities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_entitytype_fkey" FOREIGN KEY ("entitytype") REFERENCES "entitytypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_plantdef_fkey" FOREIGN KEY ("plantdef") REFERENCES "plantdefinition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plantdefimage" ADD CONSTRAINT "plantdefimage_imageid_fkey" FOREIGN KEY ("imageid") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plantdefimage" ADD CONSTRAINT "plantdefimage_plantdefid_fkey" FOREIGN KEY ("plantdefid") REFERENCES "plantdefinition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plantdefinition" ADD CONSTRAINT "plantdefinition_colormajor_fkey" FOREIGN KEY ("colormajor") REFERENCES "basecolors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plantdefinition" ADD CONSTRAINT "plantdefinition_colorminor_fkey" FOREIGN KEY ("colorminor") REFERENCES "basecolors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plantdefinition" ADD CONSTRAINT "plantdefinition_colorpredominant_fkey" FOREIGN KEY ("colorpredominant") REFERENCES "basecolors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plantdefinition" ADD CONSTRAINT "plantdefinition_form_fkey" FOREIGN KEY ("form") REFERENCES "plantform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plantdefinition" ADD CONSTRAINT "plantdefinition_plantcategory_fkey" FOREIGN KEY ("plantcategory") REFERENCES "plantcategories"("name") ON DELETE NO ACTION ON UPDATE NO ACTION;

