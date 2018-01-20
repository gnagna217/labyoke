-- Table: public.vm2016_agentsshare

-- DROP TABLE public.vm2016_agentsshare;
CREATE SEQUENCE IF NOT EXISTS vm2016_agentsshare_rid_seq;
CREATE TABLE IF NOT EXISTS public.vm2016_agentsshare
(
    agent text NOT NULL,
    vendor text NOT NULL,
    catalognumber text NOT NULL,
    location text,
    email text NOT NULL,
    date date,
    status text,
    quantity integer,
    insufficient integer,
    insuffdate date,
    price integer,
    id integer,
    rid integer NOT NULL DEFAULT nextval('vm2016_agentsshare_rid_seq'::regclass),
    CONSTRAINT p_rid PRIMARY KEY (rid)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- ALTER TABLE public.vm2016_agentsshare
--    OWNER to ylwkyrhqofvgpb;