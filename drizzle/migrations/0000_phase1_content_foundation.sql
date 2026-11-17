-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Shared updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Videos
CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id text NOT NULL UNIQUE CHECK (youtube_id ~ '^[A-Za-z0-9_-]{6,20}$'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 300),
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Dumpster Diving',
  published_at timestamptz NOT NULL DEFAULT now(),
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX videos_published_idx ON public.videos (is_published, published_at DESC);
GRANT SELECT ON public.videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published videos are public" ON public.videos
  FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Admins manage videos" ON public.videos
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Discoveries (Our Finds)
CREATE TABLE public.discoveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  summary text NOT NULL DEFAULT '',
  story text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Other Discoveries',
  condition text CHECK (condition IN ('New','Like New','Good','Used','For Parts or Repair')),
  estimated_value_gbp numeric(10,2) CHECK (estimated_value_gbp IS NULL OR estimated_value_gbp >= 0),
  image_urls text[] NOT NULL DEFAULT '{}',
  video_youtube_id text,
  status text NOT NULL DEFAULT 'other' CHECK (status IN ('sold','donated','kept','other')),
  location text,
  found_on date,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX discoveries_published_idx ON public.discoveries (is_published, found_on DESC);
GRANT SELECT ON public.discoveries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discoveries TO authenticated;
GRANT ALL ON public.discoveries TO service_role;
ALTER TABLE public.discoveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published discoveries are public" ON public.discoveries
  FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Admins manage discoveries" ON public.discoveries
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER discoveries_updated_at BEFORE UPDATE ON public.discoveries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Newsletter subscribers (private)
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (char_length(email) <= 255),
  consent_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'website',
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage subscribers" ON public.newsletter_subscribers
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Contact messages (private)
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) <= 255),
  subject text NOT NULL DEFAULT 'General enquiry' CHECK (char_length(subject) <= 150),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 3000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX contact_messages_created_idx ON public.contact_messages (created_at DESC);
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage contact messages" ON public.contact_messages
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Site settings (public read, admin write)
CREATE TABLE public.site_settings (
  key text PRIMARY KEY CHECK (key ~ '^[a-z0-9_]+$'),
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings are public" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (key, value) VALUES
  ('socials', '{"youtube": "https://www.youtube.com/@CoupleofDumpsters"}'::jsonb);

-- Seed: real finds featured in Couple of Dumpsters videos
INSERT INTO public.discoveries (slug, title, summary, story, category, image_urls, video_youtube_id, found_on, is_featured) VALUES
('luxury-bathroom-skip', 'A skip full of luxury bathroom gear', 'Behind a plumbing shop, a skip packed with shower units and bathroom fittings.', 'Three of us, one plumbing shop and a skip absolutely full of luxury bathroom and shower units. Branded products and expensive kit that had simply been thrown out. Watch the video to see exactly what we pulled out and what happened next.', 'Home & Furniture', ARRAY['https://i.ytimg.com/vi/2PXdVbAMak4/maxresdefault.jpg'], '2PXdVbAMak4', '2026-11-13', true),
('dunelm-homeware-haul', 'Bedding, lampshades and soft furnishings', 'A retailer''s skip full of homeware far too good to be thrown away.', 'Behind a Dunelm store we found luxury bedding, lampshades, home furniture, soft furnishings and loads of homeware that looked far too good for landfill. One of our biggest homeware finds so far.', 'Home & Furniture', ARRAY['https://i.ytimg.com/vi/hDr2txNQPXM/maxresdefault.jpg'], 'hDr2txNQPXM', '2026-11-16', true),
('charity-shop-tagged-clothes', 'Brand-new clothes, tags still on', 'Sealed, brand-new clothing sitting in a charity shop bin.', 'Sealed, brand-new clothes with the tags still on, plus a box nobody expected, all sitting in a charity shop bin. Everything was taken with permission, and anything we did not keep was donated or passed on. Nothing went to waste.', 'Fashion & Clothing', ARRAY['https://i.ytimg.com/vi/G9ZJ1yyvc9k/maxresdefault.jpg'], 'G9ZJ1yyvc9k', '2026-11-11', true),
('christmas-crackers-haul', 'Boxes upon boxes of Christmas crackers', 'A festive find: more Christmas crackers than we could count.', 'We went out expecting the usual and found boxes upon boxes of Christmas crackers and festive surprises. Perfectly good items saved from going to waste, one dive at a time.', 'Household Items', ARRAY['https://i.ytimg.com/vi/5bxAB2xOets/maxresdefault.jpg'], '5bxAB2xOets', '2026-11-08', false),
('range-nutcrackers-tennis-toys', 'Nutcrackers and boxed tennis toys', 'Christmas nutcrackers and summer toys outside The Range.', 'Outside The Range we found Christmas nutcrackers, boxed summer tennis toys and plenty of other unexpected goodies. Decorations and toys that could easily make someone''s day.', 'Toys & Games', ARRAY['https://i.ytimg.com/vi/lsoSbfFpe1E/maxresdefault.jpg'], 'lsoSbfFpe1E', '2026-11-02', false);

-- Seed: the channel's latest real videos
INSERT INTO public.videos (youtube_id, title, description, published_at, category, is_featured) VALUES
('hDr2txNQPXM', 'We Found a GOLDMINE… And Nobody Wanted It! [Dumpster Diving]', 'Today we’re checking out a dumpster behind Dunelm, and what we discovered was absolutely unbelievable!

We’re talking luxury bedding, lampshades, home furniture, soft furnishings and loads of beautiful homeware that looks far too good to be thrown away.

Come along for another adventure as we uncover what big retailers are throwing out. You just never know what you’re going to find when you go dumpster diving!', '2026-11-16T13:58:49+00:00', 'Big Hauls', true),
('Y1qzx-Rwvcg', '3 BIN ROBBERS vs THE RANGE! THIS SKIP WAS INSANE! [DUMPSTER DIVING]', 'The Bin Robbers are back! This time we’ve hit The Range and what we discovered in this skip was absolutely insane.

Three skeleton masks, one massive skip and what looks like a jackpot of household products, electricals and luxury homeware.

Join us for another adventure as we uncover what retailers throw away.', '2026-11-15T12:33:00+00:00', 'Dumpster Diving', false),
('dcH-uD4OqQ4', 'DUMPSTER DIVING ‘I HAD TO COME BACK’ 🍀💸', 'I had to come back! What I found this time was a whole luxury bathroom suite sitting inside a skip.

Expensive bathroom fittings and luxury fixtures just waiting to be discovered. Watch until the end to see exactly what we found and what we’re going to do with it.', '2026-11-14T12:46:02+00:00', 'Dumpster Diving', false),
('2PXdVbAMak4', 'WE FOUND A £10,000 JACKPOT IN A SKIP?! 😱 LUXURY BATHROOM GEAR WORTH A FORTUNE! [Dumpster Diving]', 'Three of us, one plumbing shop and a skip absolutely full of luxury bathroom and shower units!

Expensive bathroom gear, luxury showers and branded products. Watch until the end to see exactly what we’ve uncovered.', '2026-11-13T13:08:48+00:00', 'Big Hauls', true),
('uOm1I89qaHU', 'WE WENT DUMPSTER DIVING AT THE AIRPORT… WAS NOT EXPECTING THIS 😳✈️ [Dumpster Diving]', 'We took dumpster diving to a whole new level. This time we’re heading to Gatwick Airport to see what we can find!

We had absolutely no idea what we were going to come across, but things took a very unexpected turn.', '2026-11-12T14:00:10+00:00', 'Dumpster Diving', false),
('XFXArPqwpPI', 'Dumpster diving at the airport ✈️', 'A quick look behind the scenes of our airport dive.', '2026-11-12T09:04:14+00:00', 'Shorts', false),
('G9ZJ1yyvc9k', 'I WENT DUMPSTER DIVING AT A CHARITY SHOP..THIS IS WHAT I FOUND…[Dumpster Diving]', 'I couldn''t believe what was sitting in this charity shop bin: sealed, brand-new clothes with the tags still on, and a box I did not expect to find.

Everything in this video was taken with permission. Any items I don''t keep get donated or passed on. Nothing goes to waste.', '2026-11-11T13:45:13+00:00', 'Charity Finds', true),
('NBH1xyH5HB8', 'I Checked EVRI’S Skip and THIS is What I Found 😳-Dumpster Diving', 'Customer parcels piled high in a dumpster outside an EVRi depot. Is this really how customer deliveries are being handled?

If you’re waiting for an EVRi delivery, or have experienced problems with missing or delayed parcels, let us know in the comments on YouTube.', '2026-11-10T13:29:48+00:00', 'Investigations', false),
('nKqZWMnq1UI', 'THE RANGE SECURITY WENT MENTAL! DUMPSTER DIVING GOING WRONG', 'Not every dive goes to plan. Thank you all so much for the support.', '2026-11-09T14:48:48+00:00', 'Dumpster Diving', false),
('5bxAB2xOets', 'WOW MEGA CHRISTMAS HAUL! THIS IS SHOCKING! -DUMPSTER DIVING', 'We went out dumpster diving expecting the usual finds, but this was something else entirely.

Boxes upon boxes of Christmas crackers and festive surprises. Saving perfectly good items from going to waste, one dive at a time.', '2026-11-08T12:49:19+00:00', 'Big Hauls', false),
('dC8wZNWKYIM', 'DUMPSTER DIVING on Bonfire Night… WHAT DID WE FIND?!', 'We headed to Lewes, East Sussex, for what we thought would be an ordinary night of dumpster diving, and accidentally arrived during the world-famous Lewes Bonfire Night celebrations.

Roads closed, crowds in the streets and fireworks lighting up the sky, plus a little of the town''s fascinating history.', '2026-11-07T15:00:08+00:00', 'Dumpster Diving', false),
('kno8627_QAw', '😱 WE WENT DUMPSTER DIVING AT THE SHOPPING MALL… WHAT A SHOCKING FIND! [DUMPSTER DIVING]', 'We headed to the shopping mall for another dumpster diving adventure. From TK Maxx to M&S Food, we uncovered some unbelievable discarded items, but the biggest surprise was still waiting for us.

Every rescue is another item saved from going to waste.', '2026-11-06T13:02:47+00:00', 'Dumpster Diving', false),
('JCRPkMuqRVc', 'CRAZY HAUL AT THIS STORE! SCORING MEGA -DUMPSTER DIVING', 'Checking out a dumpster behind Dunelm: luxury bedding, lampshades, home furniture, soft furnishings and loads of homeware far too good to be thrown away.', '2026-11-05T15:17:39+00:00', 'Big Hauls', false),
('7XD83tBbvsQ', 'EVRi CAUGHT OUT! 😱 STOP SENDING YOUR PARCELS 📦 !-Dumpster Diving Audits', 'What started as an ordinary day turned into a shocking discovery, and things quickly escalated when the police were called.

Environmental responsibility matters. Watch until the end to see how it all unfolds.', '2026-11-04T14:00:03+00:00', 'Investigations', false),
('lsoSbfFpe1E', 'THE RANGE THREW ALL THIS AWAY?! 😱 CHRISTMAS DECORATIONS & BOXES OF TENNIS TOYS! MEGA JACKPOT!', 'A treasure trove of Christmas nutcrackers, boxed summer tennis toys and loads of unexpected goodies outside The Range.

Christmas decorations and perfectly good toys that could make someone''s day. Saving what we can, one skip at a time.', '2026-11-02T14:00:10+00:00', 'Big Hauls', false)
ON CONFLICT (youtube_id) DO NOTHING;