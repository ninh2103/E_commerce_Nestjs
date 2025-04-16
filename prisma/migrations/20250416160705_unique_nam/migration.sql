-- DropIndex
DROP INDEX "Role_name_key";


create unique index "Role_name_unique" on "Role" ("name") where "deletedAt" is null;

