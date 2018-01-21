-- Table: public.vm2016_orders

-- DROP TABLE public.vm2016_orders;
CREATE SEQUENCE IF NOT EXISTS vm2016_orders_id_seq;
CREATE TABLE IF NOT EXISTS public.vm2016_orders
(
    agent text,
    vendor text,
    catalognumber text,
    email text,
    requestoremail text,
    date date,
    status text,
    category text,
    lab text,
    insufficient integer,
    insuffdate date,
    quantity integer,
    id integer NOT NULL DEFAULT nextval('vm2016_orders_id_seq'::regclass),
    CONSTRAINT vm2016_orders_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- ALTER TABLE public.vm2016_orders
--    OWNER to ylwkyrhqofvgpb;