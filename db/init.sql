CREATE EXTENSION citext;

CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;

CREATE TABLE "users" (
    "id" integer DEFAULT nextval('users_id_seq') NOT NULL,
    "display_name" character varying NOT NULL,
    "email" citext NOT NULL,
    "username" character varying NOT NULL,
    "company" character varying,
    "avatar" character varying,
    "github_id" character varying,
    "github_access_token" character varying,
    "github_refresh_token" character varying,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_id" PRIMARY KEY ("id"),
    CONSTRAINT "users_email" UNIQUE ("email"),
    CONSTRAINT "users_username" UNIQUE ("username"),
    CONSTRAINT "users_github_id" UNIQUE ("github_id")
) WITH (oids = false);


CREATE SEQUENCE organizations_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;

CREATE TABLE "organizations" (
    "id" integer DEFAULT nextval('organizations_id_seq') NOT NULL,
    "name" character varying NOT NULL,
    "slug" character varying NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organizations_id" PRIMARY KEY ("id"),
    CONSTRAINT "organizations_slug" UNIQUE ("slug")
) WITH (oids = false);



CREATE TABLE "organizations_users" (
    "organization_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "role" character varying DEFAULT 'member' NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organizations_users_organization_id_user_id" UNIQUE ("organization_id", "user_id"),
    CONSTRAINT "organizations_users_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "organizations_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);




CREATE SEQUENCE projects_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;

CREATE TABLE "projects" (
    "id" integer DEFAULT nextval('projects_id_seq') NOT NULL,
    "name" character varying NOT NULL,
    "creator_id" integer NOT NULL,
    "organization_id" integer NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "projects_id" PRIMARY KEY ("id"),
    CONSTRAINT "projects_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);




CREATE SEQUENCE apis_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;

CREATE TABLE "apis" (
    "id" integer DEFAULT nextval('apis_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "asyncapi" text NOT NULL,
    "computed_asyncapi" jsonb NOT NULL,
    "version" character varying NOT NULL,
    "link_provider" character varying,
    "link_repo_id" integer,
    "link_path" character varying,
    "link_ref" character varying,
    "project_id" integer,
    "creator_id" integer NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "apis_id" PRIMARY KEY ("id"),
    CONSTRAINT "apis_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "apis_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

CREATE SEQUENCE repos_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;

CREATE TABLE "repos" (
    "id" integer DEFAULT nextval('repos_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "url" character varying NOT NULL,
    "provider" character varying NOT NULL,
    "provider_id" integer NOT NULL,
    "hook_id" integer,
    "organization_id" integer NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "repos_id" PRIMARY KEY ("id"),
    CONSTRAINT "repos_url" UNIQUE ("url"),
    CONSTRAINT "repos_organization_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

CREATE SEQUENCE invitations_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;

CREATE TABLE "invitations" (
    "id" integer DEFAULT nextval('invitations_id_seq') NOT NULL,
    "organization_id" integer NOT NULL,
    "inviter_id" integer NOT NULL,
    "email" citext NOT NULL,
    "role" character varying NOT NULL,
    "status" character varying NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "invitations_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "invitations_inviter_id_fkey" FOREIGN KEY (inviter_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);
