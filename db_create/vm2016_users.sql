-- Table: public.vm2016_users

-- DROP TABLE public.vm2016_users;

CREATE TABLE IF NOT EXISTS public.vm2016_users
(
    id text NOT NULL,
    password text,
    name text,
    active integer,
    changepwd_id text,
    changepwd_status integer,
    email text,
    changepwd_date,
    lab text,
    surname,
    tel text,
    admin integer,
    admin_assign text,
    register_id text,
    disable integer,
    lang text,
    oninsuff integer,
    onfill integer,
    CONSTRAINT id_user PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- ALTER TABLE public.vm2016_users
--    OWNER to ylwkyrhqofvgpb;