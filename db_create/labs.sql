-- Table: public.labs

-- DROP TABLE public.labs;
CREATE SEQUENCE IF NOT EXISTS labs_lid_seq;
CREATE TABLE IF NOT EXISTS public.labs
(
    labname text NOT NULL,
    admin text NOT NULL,
    department text NOT NULL,
    isvenn integer,
    lid integer NOT NULL DEFAULT nextval('labs_lid_seq'::regclass),
    disable integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.labs
    OWNER to ylwkyrhqofvgpb;    