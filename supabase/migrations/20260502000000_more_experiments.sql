-- Add more ZIMSEC-aligned experiments (O-Level and A-Level, Chemistry and Physics)

insert into public.experiments (slug, title, subject, level, description, difficulty, duration_minutes) values

-- Chemistry O-Level
('making-salts', 'Making Salts', 'chemistry', 'o_level', 'Prepare pure dry specimens of soluble and insoluble salts by neutralisation, precipitation and direct combination.', 2, 30),
('molar-volume-gas', 'Molar Volume of Gas', 'chemistry', 'o_level', 'Determine the molar volume of a gas at RTP by collecting hydrogen over water.', 3, 35),
('displacement-reactions', 'Displacement Reactions', 'chemistry', 'o_level', 'Investigate the reactivity series by displacing metals from salt solutions using zinc, iron and copper.', 2, 20),
('precipitation-reactions', 'Precipitation Reactions', 'chemistry', 'o_level', 'Produce insoluble salts by mixing solutions and identify precipitates by colour.', 2, 20),
('tests-for-gases', 'Tests for Gases', 'chemistry', 'o_level', 'Identify hydrogen, oxygen, carbon dioxide, ammonia and chlorine using chemical tests.', 1, 20),
('paper-chromatography', 'Paper Chromatography', 'chemistry', 'o_level', 'Separate and identify coloured substances in ink, food colouring and leaf pigments using Rf values.', 1, 25),
('water-purification', 'Water Purification', 'chemistry', 'o_level', 'Demonstrate filtration, sedimentation, chlorination and distillation to purify water samples.', 2, 30),
('electrolysis-brine', 'Electrolysis of Brine', 'chemistry', 'o_level', 'Electrolyse concentrated sodium chloride solution and test the products at each electrode.', 2, 30),
('thermal-decomposition', 'Thermal Decomposition', 'chemistry', 'o_level', 'Heat carbonates, hydroxides and nitrates and identify the gaseous products of decomposition.', 2, 25),
('fractional-distillation', 'Fractional Distillation', 'chemistry', 'o_level', 'Separate ethanol and water mixtures using a fractionating column and record temperature curves.', 2, 30),
('rusting-investigation', 'Conditions for Rusting', 'chemistry', 'o_level', 'Investigate the conditions necessary for rusting and evaluate methods of corrosion protection.', 1, 20),
('indicator-colors', 'Indicators and pH Scale', 'chemistry', 'o_level', 'Classify solutions as acid, alkali or neutral using litmus, methyl orange and universal indicator.', 1, 15),

-- Chemistry A-Level
('enthalpy-neutralisation', 'Enthalpy of Neutralisation', 'chemistry', 'a_level', 'Measure the heat released when an acid neutralises an alkali using a polystyrene calorimeter.', 3, 35),
('buffer-solutions', 'Buffer Solutions', 'chemistry', 'a_level', 'Prepare an ethanoic acid/sodium ethanoate buffer and measure its resistance to pH change.', 4, 40),
('equilibrium-constants', 'Equilibrium Constants (Kc)', 'chemistry', 'a_level', 'Determine Kc for the esterification of ethanol and ethanoic acid at different temperatures.', 4, 45),
('electrode-potentials', 'Electrode Potentials', 'chemistry', 'a_level', 'Construct electrochemical cells and measure EMF to determine standard electrode potentials.', 4, 40),
('organic-synthesis', 'Organic Synthesis — Aspirin', 'chemistry', 'a_level', 'Synthesise aspirin from salicylic acid and acetic anhydride then test purity using melting point.', 4, 50),
('spectroscopy-analysis', 'Spectroscopic Analysis (IR & MS)', 'chemistry', 'a_level', 'Interpret infrared and mass spectra to identify organic functional groups and molecular fragments.', 5, 40),
('kinetics-rate-laws', 'Kinetics and Rate Laws', 'chemistry', 'a_level', 'Determine reaction order and rate constant from clock reaction data and graphical analysis.', 5, 45),
('transition-metal-complexes', 'Transition Metal Complexes', 'chemistry', 'a_level', 'Prepare cobalt(III) amine complexes and observe colour changes due to ligand field effects.', 4, 45),
('redox-titration', 'Redox Titration with KMnO4', 'chemistry', 'a_level', 'Determine iron(II) concentration by titrating with standard potassium manganate(VII) solution.', 4, 35),
('enthalpy-combustion', 'Enthalpy of Combustion', 'chemistry', 'a_level', 'Determine the enthalpy of combustion of alcohols using a bomb-style spirit lamp calorimeter.', 3, 35),

-- Physics O-Level
('hookes-law', 'Hooke''s Law', 'physics', 'o_level', 'Investigate the extension of a spring with increasing load and determine the spring constant k.', 1, 20),
('specific-heat-capacity', 'Specific Heat Capacity', 'physics', 'o_level', 'Determine the specific heat capacity of a metal block and water using an immersion heater.', 2, 30),
('sound-waves', 'Speed of Sound in Air', 'physics', 'o_level', 'Measure the speed of sound using echo timing and resonance in a closed pipe.', 2, 25),
('diffraction-grating', 'Diffraction Grating', 'physics', 'o_level', 'Measure wavelengths of light using a diffraction grating and the grating equation nλ = d sin θ.', 3, 25),
('resistance-wire', 'Resistance of a Wire', 'physics', 'o_level', 'Investigate how the resistance of a wire depends on its length, cross-sectional area and material.', 2, 25),
('magnetic-field-mapping', 'Magnetic Field Mapping', 'physics', 'o_level', 'Map the magnetic field pattern around bar magnets and current-carrying wires using iron filings and a compass.', 1, 20),
('moments-balance', 'Moments and Balance', 'physics', 'o_level', 'Verify the principle of moments using a metre rule and various masses on a pivot.', 1, 20),
('pressure-liquid', 'Pressure in Liquids', 'physics', 'o_level', 'Investigate how pressure in a liquid depends on depth and density using a manometer.', 2, 20),
('thermal-expansion', 'Thermal Expansion', 'physics', 'o_level', 'Measure the linear and volumetric expansion of solids and liquids with temperature.', 2, 25),
('parallel-series-circuits', 'Series and Parallel Circuits', 'physics', 'o_level', 'Compare current, voltage and resistance in series and parallel circuits using ammeters and voltmeters.', 2, 25),
('convex-lens-focal', 'Focal Length of a Convex Lens', 'physics', 'o_level', 'Determine the focal length of a convex lens using the thin lens formula and measuring object/image distances.', 2, 20),
('density-determination', 'Density of Solids and Liquids', 'physics', 'o_level', 'Determine densities using mass balance and measuring cylinder by displacement method.', 1, 15),

-- Physics A-Level
('photoelectric-effect', 'Photoelectric Effect', 'physics', 'a_level', 'Investigate the relationship between frequency of light and maximum KE of emitted photoelectrons.', 4, 40),
('radioactive-decay', 'Radioactive Decay Simulation', 'physics', 'a_level', 'Model exponential decay using dice and derive half-life and decay constant.', 3, 30),
('standing-waves', 'Standing Waves on a String', 'physics', 'a_level', 'Produce stationary waves on a vibrating string and verify the relationship f = (1/2L)√(T/μ).', 3, 30),
('capacitor-discharge', 'Capacitor Charge and Discharge', 'physics', 'a_level', 'Investigate capacitor charge and discharge through a resistor and determine the time constant RC.', 3, 35),
('centripetal-force', 'Centripetal Force', 'physics', 'a_level', 'Verify the relationship F = mv²/r for circular motion using a whirling bung apparatus.', 3, 30),
('interference-patterns', 'Interference Patterns — Young''s Slits', 'physics', 'a_level', 'Measure the wavelength of laser light using Young''s double-slit experiment.', 4, 35),
('nuclear-binding-energy', 'Nuclear Binding Energy', 'physics', 'a_level', 'Calculate binding energies per nucleon from mass defect data and interpret the binding energy curve.', 5, 35),
('doppler-effect', 'Doppler Effect', 'physics', 'a_level', 'Observe frequency shift from a moving source and verify the Doppler formula.', 3, 25),
('internal-resistance', 'Internal Resistance of a Cell', 'physics', 'a_level', 'Determine the EMF and internal resistance of a cell using a variable resistance and graphical method.', 3, 30),
('g-freefall', 'Free-Fall and Acceleration due to Gravity', 'physics', 'a_level', 'Determine g using an electronic timing gate and free-fall apparatus to high precision.', 3, 25)

on conflict (slug) do nothing;

-- Add a saved_experiments table for user saves and shares
create table if not exists public.saved_experiments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  notes text,
  saved_at timestamptz not null default now(),
  unique (user_id, experiment_id)
);
alter table public.saved_experiments enable row level security;
create policy "users manage own saved experiments"
  on public.saved_experiments for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Add share_token to lab_sessions for sharing
alter table public.lab_sessions add column if not exists share_token text unique default null;
alter table public.lab_sessions add column if not exists is_public boolean not null default false;
create policy "public lab sessions readable via share token"
  on public.lab_sessions for select to anon
  using (is_public = true);
