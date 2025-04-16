
create unique index "Permission_path_method_unique" on "Permission" ("path", "method") where "deletedAt" is null;
