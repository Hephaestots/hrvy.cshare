CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

BEGIN TRANSACTION;

CREATE TABLE "Activities" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Activities" PRIMARY KEY,
    "Title" TEXT NULL,
    "Date" TEXT NOT NULL,
    "Description" TEXT NULL,
    "Category" TEXT NULL,
    "City" TEXT NULL,
    "Venue" TEXT NULL
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20211221173659_InitialCreate', '6.0.1');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "AspNetRoles" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_AspNetRoles" PRIMARY KEY,
    "Name" TEXT NULL,
    "NormalizedName" TEXT NULL,
    "ConcurrencyStamp" TEXT NULL
);

CREATE TABLE "AspNetUsers" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_AspNetUsers" PRIMARY KEY,
    "DisplayName" TEXT NULL,
    "Bio" TEXT NULL,
    "UserName" TEXT NULL,
    "NormalizedUserName" TEXT NULL,
    "Email" TEXT NULL,
    "NormalizedEmail" TEXT NULL,
    "EmailConfirmed" INTEGER NOT NULL,
    "PasswordHash" TEXT NULL,
    "SecurityStamp" TEXT NULL,
    "ConcurrencyStamp" TEXT NULL,
    "PhoneNumber" TEXT NULL,
    "PhoneNumberConfirmed" INTEGER NOT NULL,
    "TwoFactorEnabled" INTEGER NOT NULL,
    "LockoutEnd" TEXT NULL,
    "LockoutEnabled" INTEGER NOT NULL,
    "AccessFailedCount" INTEGER NOT NULL
);

CREATE TABLE "AspNetRoleClaims" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY AUTOINCREMENT,
    "RoleId" TEXT NOT NULL,
    "ClaimType" TEXT NULL,
    "ClaimValue" TEXT NULL,
    CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "AspNetRoles" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserClaims" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY AUTOINCREMENT,
    "UserId" TEXT NOT NULL,
    "ClaimType" TEXT NULL,
    "ClaimValue" TEXT NULL,
    CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserLogins" (
    "LoginProvider" TEXT NOT NULL,
    "ProviderKey" TEXT NOT NULL,
    "ProviderDisplayName" TEXT NULL,
    "UserId" TEXT NOT NULL,
    CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider", "ProviderKey"),
    CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserRoles" (
    "UserId" TEXT NOT NULL,
    "RoleId" TEXT NOT NULL,
    CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId"),
    CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "AspNetRoles" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserTokens" (
    "UserId" TEXT NOT NULL,
    "LoginProvider" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Value" TEXT NULL,
    CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name"),
    CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON "AspNetRoleClaims" ("RoleId");

CREATE UNIQUE INDEX "RoleNameIndex" ON "AspNetRoles" ("NormalizedName");

CREATE INDEX "IX_AspNetUserClaims_UserId" ON "AspNetUserClaims" ("UserId");

CREATE INDEX "IX_AspNetUserLogins_UserId" ON "AspNetUserLogins" ("UserId");

CREATE INDEX "IX_AspNetUserRoles_RoleId" ON "AspNetUserRoles" ("RoleId");

CREATE INDEX "EmailIndex" ON "AspNetUsers" ("NormalizedEmail");

CREATE UNIQUE INDEX "UserNameIndex" ON "AspNetUsers" ("NormalizedUserName");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20211224070434_IdentityAdded', '6.0.1');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "ActivityAttendees" (
    "UserId" TEXT NOT NULL,
    "ActivityId" TEXT NOT NULL,
    "IsHost" INTEGER NULL,
    "Id" TEXT NOT NULL,
    CONSTRAINT "PK_ActivityAttendees" PRIMARY KEY ("UserId", "ActivityId"),
    CONSTRAINT "FK_ActivityAttendees_Activities_ActivityId" FOREIGN KEY ("ActivityId") REFERENCES "Activities" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_ActivityAttendees_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_ActivityAttendees_ActivityId" ON "ActivityAttendees" ("ActivityId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20211229005342_ActivityAttendee', '6.0.1');

COMMIT;

BEGIN TRANSACTION;

ALTER TABLE "Activities" ADD "IsCancelled" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "ef_temp_ActivityAttendees" (
    "UserId" TEXT NOT NULL,
    "ActivityId" TEXT NOT NULL,
    "Id" TEXT NOT NULL,
    "IsHost" INTEGER NOT NULL,
    CONSTRAINT "PK_ActivityAttendees" PRIMARY KEY ("UserId", "ActivityId"),
    CONSTRAINT "FK_ActivityAttendees_Activities_ActivityId" FOREIGN KEY ("ActivityId") REFERENCES "Activities" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_ActivityAttendees_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

INSERT INTO "ef_temp_ActivityAttendees" ("UserId", "ActivityId", "Id", "IsHost")
SELECT "UserId", "ActivityId", "Id", IFNULL("IsHost", 0)
FROM "ActivityAttendees";

COMMIT;

PRAGMA foreign_keys = 0;

BEGIN TRANSACTION;

DROP TABLE "ActivityAttendees";

ALTER TABLE "ef_temp_ActivityAttendees" RENAME TO "ActivityAttendees";

COMMIT;

PRAGMA foreign_keys = 1;

BEGIN TRANSACTION;

CREATE INDEX "IX_ActivityAttendees_ActivityId" ON "ActivityAttendees" ("ActivityId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20211229020007_IsCancelledActivity', '6.0.1');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "ef_temp_ActivityAttendees" (
    "UserId" TEXT NOT NULL,
    "ActivityId" TEXT NOT NULL,
    "IsHost" INTEGER NOT NULL,
    CONSTRAINT "PK_ActivityAttendees" PRIMARY KEY ("UserId", "ActivityId"),
    CONSTRAINT "FK_ActivityAttendees_Activities_ActivityId" FOREIGN KEY ("ActivityId") REFERENCES "Activities" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_ActivityAttendees_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

INSERT INTO "ef_temp_ActivityAttendees" ("UserId", "ActivityId", "IsHost")
SELECT "UserId", "ActivityId", "IsHost"
FROM "ActivityAttendees";

COMMIT;

PRAGMA foreign_keys = 0;

BEGIN TRANSACTION;

DROP TABLE "ActivityAttendees";

ALTER TABLE "ef_temp_ActivityAttendees" RENAME TO "ActivityAttendees";

COMMIT;

PRAGMA foreign_keys = 1;

BEGIN TRANSACTION;

CREATE INDEX "IX_ActivityAttendees_ActivityId" ON "ActivityAttendees" ("ActivityId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20211229031537_FactoActivityAttendee', '6.0.1');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "Photos" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Photos" PRIMARY KEY,
    "Url" TEXT NULL,
    "IsMain" INTEGER NOT NULL,
    "UserId" TEXT NULL,
    CONSTRAINT "FK_Photos_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id")
);

CREATE INDEX "IX_Photos_UserId" ON "Photos" ("UserId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20220101180203_PhotoFeature', '6.0.1');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "Comments" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Comments" PRIMARY KEY,
    "Body" TEXT NOT NULL,
    "AuthorId" TEXT NULL,
    "ActivityId" TEXT NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    CONSTRAINT "FK_Comments_Activities_ActivityId" FOREIGN KEY ("ActivityId") REFERENCES "Activities" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Comments_AspNetUsers_AuthorId" FOREIGN KEY ("AuthorId") REFERENCES "AspNetUsers" ("Id")
);

CREATE INDEX "IX_Comments_ActivityId" ON "Comments" ("ActivityId");

CREATE INDEX "IX_Comments_AuthorId" ON "Comments" ("AuthorId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20220104015513_CommentEntity', '6.0.1');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "UserFollowings" (
    "ObserverId" TEXT NOT NULL,
    "TargetId" TEXT NOT NULL,
    CONSTRAINT "PK_UserFollowings" PRIMARY KEY ("ObserverId", "TargetId"),
    CONSTRAINT "FK_UserFollowings_AspNetUsers_ObserverId" FOREIGN KEY ("ObserverId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_UserFollowings_AspNetUsers_TargetId" FOREIGN KEY ("TargetId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_UserFollowings_TargetId" ON "UserFollowings" ("TargetId");

CREATE TABLE "ef_temp_Comments" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Comments" PRIMARY KEY,
    "ActivityId" TEXT NULL,
    "AuthorId" TEXT NULL,
    "Body" TEXT NULL,
    "CreatedAt" TEXT NOT NULL,
    CONSTRAINT "FK_Comments_Activities_ActivityId" FOREIGN KEY ("ActivityId") REFERENCES "Activities" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Comments_AspNetUsers_AuthorId" FOREIGN KEY ("AuthorId") REFERENCES "AspNetUsers" ("Id")
);

INSERT INTO "ef_temp_Comments" ("Id", "ActivityId", "AuthorId", "Body", "CreatedAt")
SELECT "Id", "ActivityId", "AuthorId", "Body", "CreatedAt"
FROM "Comments";

COMMIT;

PRAGMA foreign_keys = 0;

BEGIN TRANSACTION;

DROP TABLE "Comments";

ALTER TABLE "ef_temp_Comments" RENAME TO "Comments";

COMMIT;

PRAGMA foreign_keys = 1;

BEGIN TRANSACTION;

CREATE INDEX "IX_Comments_ActivityId" ON "Comments" ("ActivityId");

CREATE INDEX "IX_Comments_AuthorId" ON "Comments" ("AuthorId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20220104061105_FollowersFollowingFeature', '6.0.1');

COMMIT;

