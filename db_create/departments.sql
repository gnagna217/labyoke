-- Table: public.departments

-- DROP TABLE public.departments;
CREATE SEQUENCE IF NOT EXISTS departments_id_seq;
CREATE TABLE public.departments
(
    id integer NOT NULL DEFAULT nextval('departments_id_seq'::regclass),
    departmentname text NOT NULL,
    status text,
    CONSTRAINT departments_pkey PRIMARY KEY (departmentname, id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- ALTER TABLE public.departments
--    OWNER to ylwkyrhqofvgpb;