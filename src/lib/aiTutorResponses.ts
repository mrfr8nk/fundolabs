import { type Experiment, DIFFICULTY_LABELS } from "@/data/experiments";

export function getAITutorResponse(question: string, exp?: Experiment): string {
  const q = question.toLowerCase();

  if (q.includes("titration") || q.includes("acid-base") || q.includes("titre")) {
    return getResponse("titration", exp);
  }
  if (q.includes("ohm") || q.includes("v=ir") || q.includes("resistance") || q.includes("circuit")) {
    return getResponse("ohm", exp);
  }
  if (q.includes("balanced equation") || q.includes("chemical equation") || q.includes("balancing")) {
    return getResponse("equation", exp);
  }
  if (q.includes("safety") || q.includes("hazard") || q.includes("ppe")) {
    return getResponse("safety", exp);
  }
  if (q.includes("photoelectric") || q.includes("photon")) {
    return getResponse("photoelectric", exp);
  }
  if (q.includes("pendulum") || q.includes("period") || q.includes("oscillation")) {
    return getResponse("pendulum", exp);
  }
  if (q.includes("hello") || q.includes("hi ") || q.startsWith("hi")) {
    return getResponse("greeting", exp);
  }
  if (q.includes("rate") || q.includes("collision theory")) {
    return getResponse("rates", exp);
  }
  if (q.includes("electrolysis") || q.includes("electrode")) {
    return getResponse("electrolysis", exp);
  }
  if (q.includes("aim") || q.includes("purpose") || q.includes("objective")) {
    if (exp) return "The aim of this experiment is to " + exp.description.toLowerCase() + "\n\nThis helps you understand the underlying scientific principles through direct observation and measurement.";
  }
  if (q.includes("error") || q.includes("mistake") || q.includes("accurate")) {
    return getResponse("errors", exp);
  }
  if (q.includes("equation") || q.includes("formula")) {
    return getExperimentEquation(exp);
  }
  if (q.includes("result") || q.includes("expect")) {
    if (exp) return "Expected results for " + exp.title + ":\n\n" + exp.expectedResults;
  }

  return getDefaultResponse(question, exp);
}

function getResponse(type: string, exp?: Experiment): string {
  switch (type) {
    case "titration":
      return [
        "Great question about titration! Here is a step-by-step explanation:",
        "",
        "WHAT IS TITRATION?",
        "Titration is a technique to find the unknown concentration of a solution by reacting it with a solution of known concentration.",
        "",
        "KEY STEPS:",
        "1. Fill the burette with the NaOH solution",
        "2. Use a pipette to measure exactly 25.0 cm3 of H2SO4 into a conical flask",
        "3. Add 2-3 drops of phenolphthalein indicator (colourless in acid)",
        "4. Add NaOH dropwise from the burette, swirling constantly",
        "5. Stop when the solution turns permanently pale pink (the endpoint)",
        "6. Record the volume of NaOH used (the titre)",
        "",
        "KEY EQUATION:",
        "H2SO4 + 2NaOH -> Na2SO4 + 2H2O",
        "",
        "CALCULATING CONCENTRATION:",
        "c1V1/n1 = c2V2/n2",
        "",
        "ZIMSEC TIP: Always repeat the titration to get concordant titres (within 0.10 cm3). Record all readings to 2 decimal places.",
        "",
        "Would you like to know more about indicators or calculating unknown concentrations?",
      ].join("\n");

    case "ohm":
      return [
        "Ohm's Law is fundamental to O-Level Physics.",
        "",
        "OHM'S LAW: V = IR",
        "",
        "Where:",
        "V = Voltage (measured in Volts, V)",
        "I = Current (measured in Amperes, A)",
        "R = Resistance (measured in Ohms, Ohm)",
        "",
        "THE TRIANGLE METHOD:",
        "Cover what you want to find:",
        "To find V: V = I x R",
        "To find I: I = V / R",
        "To find R: R = V / I",
        "",
        "PRACTICAL EXAMPLE:",
        "If a 10 Ohm resistor has 3V across it:",
        "I = V/R = 3/10 = 0.3 A",
        "",
        "IN YOUR LAB:",
        "- Connect ammeter in SERIES (to measure current)",
        "- Connect voltmeter in PARALLEL (to measure voltage)",
        "- Plot V vs I graph: gradient = Resistance",
        "",
        "ZIMSEC EXAM TIP: The V-I graph for an ohmic conductor is a straight line through the origin. Non-ohmic conductors (like filament bulbs) have curved graphs.",
        "",
        "Shall I explain series and parallel circuits next?",
      ].join("\n");

    case "equation":
      return [
        "Balancing equations is a crucial ZIMSEC skill. Here is the method:",
        "",
        "RULES:",
        "1. Write the word equation first",
        "2. Write chemical formulae for all substances",
        "3. Count atoms on each side",
        "4. Add coefficients (big numbers) to balance - NEVER change the formulae",
        "5. Check that all atoms balance",
        "",
        "EXAMPLE: Burning magnesium",
        "Step 1: Magnesium + Oxygen -> Magnesium oxide",
        "Step 2: Mg + O2 -> MgO",
        "Step 3: Left: 1 Mg, 2 O | Right: 1 Mg, 1 O",
        "Step 4: 2Mg + O2 -> 2MgO",
        "Step 5: Left: 2 Mg, 2 O | Right: 2 Mg, 2 O (BALANCED)",
        "",
        "COMMON ZIMSEC EQUATIONS:",
        "2H2 + O2 -> 2H2O",
        "CaCO3 -> CaO + CO2 (thermal decomposition)",
        "Zn + H2SO4 -> ZnSO4 + H2 (metal + acid)",
        "NaOH + HCl -> NaCl + H2O (neutralisation)",
        "",
        "Would you like practice questions on balancing?",
      ].join("\n");

    case "safety":
      return [
        "Safety in the laboratory is essential! Here are the ZIMSEC lab safety rules:",
        "",
        "PERSONAL PROTECTIVE EQUIPMENT (PPE):",
        "- Lab coat: always wear it",
        "- Safety goggles: protect your eyes from splashes",
        "- Gloves: when handling corrosive chemicals",
        "",
        "GENERAL RULES:",
        "1. Never eat, drink or touch your face in the lab",
        "2. Tie back long hair when near flames",
        "3. Know where the fire extinguisher and eyewash station are",
        "4. Never smell chemicals directly - waft towards your nose",
        "5. Report ALL accidents and spillages immediately",
        "",
        "CHEMICAL HAZARDS:",
        "Corrosive: Burns skin and eyes (HCl, NaOH, H2SO4)",
        "Flammable: Catches fire easily (ethanol)",
        "Toxic: Poisonous (Pb compounds)",
        "Oxidising: Supports combustion (KMnO4)",
        "",
        "ZIMSEC EXAM NOTE: Questions often ask for TWO safety precautions - always give specific ones, not generic ones like 'be careful'!",
      ].join("\n");

    case "photoelectric":
      return [
        "The Photoelectric Effect is a key A-Level Physics topic!",
        "",
        "WHAT IS IT?",
        "When light of sufficient frequency hits a metal surface, electrons are emitted. This is called the photoelectric effect.",
        "",
        "KEY FACTS:",
        "- Below the threshold frequency (f0), NO electrons are emitted - regardless of intensity",
        "- Above f0, electrons are emitted INSTANTLY",
        "- Increasing intensity = more electrons (but same max KE)",
        "- Increasing frequency = faster electrons (higher max KE)",
        "",
        "THE EQUATION:",
        "E = hf = phi + 0.5mv_max squared",
        "",
        "Where:",
        "h = Planck's constant (6.63 x 10^-34 J s)",
        "f = frequency of light",
        "phi = work function (minimum energy to release an electron)",
        "0.5mv_max squared = maximum kinetic energy of emitted electron",
        "",
        "STOPPING POTENTIAL (Vs):",
        "The minimum voltage to stop the electrons:",
        "eVs = hf - phi",
        "",
        "ZIMSEC A-LEVEL TIP: Sketch the graph of stopping potential vs frequency - it is a straight line with gradient h/e and x-intercept = threshold frequency.",
        "",
        "Would you like to practice calculations?",
      ].join("\n");

    case "pendulum":
      return [
        "The simple pendulum is a classic ZIMSEC experiment!",
        "",
        "THEORY:",
        "For small angles (less than 10 degrees), the period T is:",
        "",
        "T = 2pi x sqrt(L/g)",
        "",
        "Where:",
        "T = period (time for ONE complete oscillation)",
        "L = length from pivot to centre of bob",
        "g = 9.81 m/s2 (acceleration due to gravity)",
        "",
        "KEY POINTS:",
        "- T is INDEPENDENT of mass and amplitude (for small angles)",
        "- T increases with longer string",
        "- T would decrease on the Moon (smaller g)",
        "",
        "EXPERIMENTAL METHOD:",
        "1. Measure L accurately from pivot to centre of bob",
        "2. Displace less than 10 degrees (small angle approximation)",
        "3. Time 20 complete oscillations -> T = total time/20",
        "4. Repeat 3 times and find mean T",
        "5. Calculate g = 4pi squared x L / T squared",
        "",
        "PLOTTING DATA:",
        "Plot T squared against L:",
        "- Gradient = 4pi squared / g",
        "- g = 4pi squared / gradient",
        "",
        "ZIMSEC EXAM TIP: Always time 20+ oscillations to reduce the effect of reaction time errors on your result.",
      ].join("\n");

    case "greeting":
      return [
        "Hello! I'm FundoBot, your AI science tutor!",
        "",
        "I'm here to help you master ZIMSEC Chemistry and Physics - from O-Level basics to A-Level advanced topics.",
        "",
        "I can help you with:",
        "- Chemistry: Titrations, organic chemistry, electrochemistry, rates of reaction, qualitative analysis and more",
        "- Physics: Ohm's Law, waves, mechanics, electricity, nuclear physics, quantum mechanics",
        "- Exam prep: Past paper practice, mark scheme tips, revision strategies",
        "- Lab reports: Writing observations, conclusions, and balanced equations",
        "",
        "What would you like to learn today? Type your question or click one of the quick prompts!",
      ].join("\n");

    case "rates":
      return [
        "Rates of reaction and collision theory are key for ZIMSEC Chemistry.",
        "",
        "WHAT AFFECTS REACTION RATE?",
        "",
        "1. TEMPERATURE: Higher temp -> more kinetic energy -> more collisions -> faster rate",
        "   Rule: Every 10 degrees C rise roughly doubles the rate.",
        "",
        "2. CONCENTRATION: More particles per unit volume -> more frequent collisions -> faster rate.",
        "",
        "3. SURFACE AREA: Smaller particles = greater surface area exposed -> more collisions -> faster rate.",
        "   Powder reacts faster than lumps.",
        "",
        "4. CATALYST: Provides an alternative reaction pathway with lower activation energy -> faster rate without being consumed.",
        "",
        "5. LIGHT: For photochemical reactions - photons provide activation energy.",
        "",
        "COLLISION THEORY:",
        "For a reaction to occur, particles must:",
        "- Collide with each other",
        "- Have sufficient energy (at least activation energy)",
        "- Have the correct orientation",
        "",
        "EXPERIMENT: Marble chips + HCl",
        "CaCO3 + 2HCl -> CaCl2 + H2O + CO2",
        "Measure CO2 produced: Steeper curve = faster rate",
        "",
        "ZIMSEC TIP: Always explain results in terms of collision theory - mention frequency of effective collisions!",
      ].join("\n");

    case "electrolysis":
      return [
        "Electrolysis is a core ZIMSEC Chemistry topic!",
        "",
        "DEFINITION:",
        "Electrolysis is the decomposition of an electrolyte (ionic compound) using electrical energy.",
        "",
        "KEY TERMS:",
        "- Electrolyte: Ionic compound that conducts electricity when molten or dissolved",
        "- Cathode (-): Negative electrode where REDUCTION occurs (cations gain electrons)",
        "- Anode (+): Positive electrode where OXIDATION occurs (anions lose electrons)",
        "",
        "MNEMONIC: OILRIG - Oxidation Is Loss, Reduction Is Gain",
        "MNEMONIC: ANCAT - ANions to ANOde, CATions to CATHode",
        "",
        "ELECTROLYSIS OF BRINE (NaCl solution):",
        "- Cathode: 2H+ (aq) + 2e- -> H2 (g) [hydrogen discharged, not Na]",
        "- Anode: 2Cl- (aq) -> Cl2 (g) + 2e- [chlorine discharged, not O2]",
        "- Remaining solution: NaOH (turns alkaline)",
        "",
        "TESTS FOR PRODUCTS:",
        "- H2: lit splint gives squeaky pop",
        "- Cl2: bleaches damp litmus paper",
        "",
        "ZIMSEC EXAM TIP: Questions often ask why hydrogen is discharged at the cathode instead of sodium - because hydrogen is below sodium in the reactivity/electrochemical series, so H+ ions are more easily reduced!",
      ].join("\n");

    case "errors":
      return [
        "Common sources of error in science experiments include:",
        "",
        "1. Parallax error when reading the meniscus in a burette or measuring cylinder",
        "2. Not rinsing apparatus with the correct solution before use",
        "3. Overshooting the endpoint by adding too much titrant",
        "4. Systematic errors from calibration of equipment",
        "5. Heat loss to the surroundings in calorimetry",
        "6. Reaction time errors when using a stopwatch",
        "",
        "TO IMPROVE ACCURACY:",
        "- Use a white tile when reading burettes",
        "- Take multiple readings and calculate a mean",
        "- Ensure equipment is clean and calibrated",
        "- Reduce environmental interference (draughts, light changes)",
        "",
        "ZIMSEC TIP: Questions asking for sources of error want SPECIFIC errors, not just 'human error'. Always state exactly what could go wrong and how it affects the result.",
      ].join("\n");

    default:
      return getDefaultResponse("", exp);
  }
}

function getExperimentEquation(exp?: Experiment): string {
  if (!exp) return "Please provide the experiment context for the relevant equation.";

  const equations: Record<string, string> = {
    "acid-base-titration": "H2SO4 + 2NaOH -> Na2SO4 + 2H2O\n\nThis shows that 1 mole of sulphuric acid reacts with 2 moles of sodium hydroxide.\n\nConcentration formula: c = n/V (mol/dm3)",
    "electrolysis-brine": "2NaCl + 2H2O -> Cl2 + H2 + 2NaOH\n\nAt cathode: 2H+ + 2e- -> H2\nAt anode: 2Cl- -> Cl2 + 2e-",
    "ohms-law": "V = IR\n\nV = voltage (volts), I = current (amperes), R = resistance (ohms)\nGradient of V-I graph = Resistance R",
    "pendulum": "T = 2pi x sqrt(L/g)\n\nwhere T = period (s), L = length (m), g = 9.81 m/s2\nRearranging: g = 4pi2 x L / T2",
    "hookes-law": "F = ke\n\nwhere F = force (N), k = spring constant (N/m), e = extension (m)\nGradient of F vs e graph = spring constant k",
    "rates-of-reaction": "Rate = 1/time\n\nFor CaCO3 + HCl:\nCaCO3 + 2HCl -> CaCl2 + H2O + CO2\nRate measured by mass loss or volume of CO2 collected per second",
    "refraction": "Snell's Law: n1 sin(i) = n2 sin(r)\n\nFor glass (n2=1.5) and air (n1=1):\nsin(i) / sin(r) = 1.5\nGradient of sin(i) vs sin(r) graph = refractive index n",
  };

  return equations[exp.slug] ?? "The key formula for " + exp.title + " is in your ZIMSEC textbook. The gradient of your experimental graph will give you the key constant. What specific calculation do you need help with?";
}

function getDefaultResponse(question: string, exp?: Experiment): string {
  const expContext = exp
    ? [
        "You are currently working on: " + exp.title,
        "Level: " + (exp.level === "o_level" ? "O-Level" : "A-Level") + " " + exp.subject,
        "",
      ].join("\n")
    : "";

  return [
    expContext,
    "Thank you for your question! As your ZIMSEC science tutor, I am here to help you understand Chemistry and Physics deeply.",
    "",
    "Your question: \"" + question + "\"",
    "",
    "Here is what I recommend:",
    "",
    "1. Start with the basics - Make sure you understand the fundamental concept first",
    "2. Link to experiments - Think about how this concept applies in the lab",
    "3. Practice with past papers - ZIMSEC often repeats similar question styles",
    "4. Draw diagrams - Visual representations help cement understanding",
    "",
    "RELATED ZIMSEC TOPICS TO EXPLORE:",
    "- Practical skills and experimental design",
    "- Data analysis and graphing",
    "- Evaluation of experimental results",
    "",
    "Could you be more specific? I can:",
    "- Explain concepts step by step",
    "- Work through calculations with you",
    "- Help write lab observations",
    "- Prepare you for ZIMSEC exams",
    "",
    "Try asking: 'Explain titration step by step' or 'What is Ohm's Law?'",
  ].join("\n");
}
