/* ==========================================================================
   VetNet Diagrams: the content file.  Add or edit diagrams HERE (no coding needed).

   HOW TO ADD A DIAGRAM  (copy one block below, paste it before the last "];", change the text):

   {
     id: "myid",              // short, unique, no spaces
     subj: "phys",            // subject id: anat phys bioc pharm micro para path nutr pubh gen lpm lpt gyn surg med ext clin farm
     title: "Title shown in the list",
     layout: "snake",         // "snake" = steps in rows with arrows | "cycle" = steps in a circle | "list" = boxes with no order
     cols: 4,                 // snake and list only: boxes per row on a big screen (3 to 5 looks best)
     note: "One helpful line under the picture (optional)",
     nodes: [
       ["Box title (keep it short)", "What it means: the fact the student reads when they tap it.", "Test question clue: 'Tap the step that ...'"],
       ["Next box", "Its explanation.", "Its clue."]
     ]
   },

   RULES:  every line inside nodes ends with a comma except the last one.
           Keep each text inside double quotes " ". If you need a quote inside the text, use a single quote '.
           2 to 12 boxes per diagram is best. Check facts against your syllabus before adding.
   If the page shows fewer diagrams than expected, a comma or quote is missing. Open the browser
   console (F12) and look for a red message.
   ========================================================================== */
window.VETNET_DIAGRAMS = [
  {
    id: "heart", subj: "phys", title: "Blood flow through the heart", layout: "snake", cols: 4,
    note: "After the venae cavae, the blood goes back to the right atrium, so the circuit repeats.",
    nodes: [
      ["Right atrium", "Receives deoxygenated blood from the cranial and caudal venae cavae and the coronary sinus.", "Receives blood from the venae cavae"],
      ["Tricuspid (right AV) valve", "Three cusps. Stops blood flowing back from the right ventricle into the right atrium.", "Valve between the right atrium and right ventricle"],
      ["Right ventricle", "Pumps blood to the lungs at low pressure, so its wall is thinner than the left.", "Pumps blood to the lungs"],
      ["Pulmonary (semilunar) valve", "Sits between the right ventricle and the pulmonary trunk.", "Valve at the start of the pulmonary trunk"],
      ["Lungs", "Gas exchange: CO2 leaves the blood, O2 enters it.", "Where gas exchange happens"],
      ["Pulmonary veins", "Carry oxygenated blood to the left atrium. They are the veins that carry oxygenated blood.", "Veins that carry oxygenated blood"],
      ["Left atrium", "Receives oxygenated blood from the pulmonary veins.", "Receives blood from the pulmonary veins"],
      ["Mitral (left AV) valve", "Two cusps (bicuspid). Myxomatous mitral valve disease is a common heart disease of older small-breed dogs.", "Valve with two cusps between left atrium and left ventricle"],
      ["Left ventricle", "Thickest wall. Pumps blood to the whole body at high pressure.", "Has the thickest muscular wall"],
      ["Aortic (semilunar) valve", "Sits between the left ventricle and the aorta.", "Valve at the start of the aorta"],
      ["Aorta and body (systemic circulation)", "Delivers oxygenated blood to the tissues through arteries, arterioles and capillaries.", "Carries oxygenated blood to the body"],
      ["Venae cavae", "Return deoxygenated blood from the body to the right atrium.", "Return blood from the body to the heart"]
    ]
  },
  {
    id: "energy", subj: "bioc", title: "Glucose to ATP (overview)", layout: "snake", cols: 4,
    note: "A simple overview of energy metabolism. In ruminants most glucose is made by gluconeogenesis, because rumen microbes ferment carbohydrates to volatile fatty acids.",
    nodes: [
      ["Glucose (6 carbons)", "The main fuel for most tissues. The brain depends heavily on it.", "The starting six-carbon fuel"],
      ["Glycolysis (cytosol)", "Glucose to 2 pyruvate. Net gain 2 ATP and 2 NADH. It needs no oxygen.", "Happens in the cytosol and gives a net 2 ATP"],
      ["Pyruvate (3 carbons)", "Becomes lactate when oxygen is short. With oxygen it enters the mitochondrion.", "Becomes lactate when oxygen is short"],
      ["Acetyl-CoA", "Made by pyruvate dehydrogenase in the mitochondrial matrix. It releases CO2 and NADH, and needs thiamine (vitamin B1).", "Made by pyruvate dehydrogenase, which needs thiamine"],
      ["TCA (Krebs) cycle", "In the mitochondrial matrix. Per acetyl-CoA: 3 NADH, 1 FADH2, 1 GTP and 2 CO2.", "Gives 3 NADH, 1 FADH2 and 1 GTP per acetyl-CoA"],
      ["Electron transport chain", "On the inner mitochondrial membrane. Oxygen is the final electron acceptor. Most ATP is made here (oxidative phosphorylation).", "Oxygen is the final electron acceptor"],
      ["ATP (about 30 to 32 per glucose)", "Modern textbooks give about 30 to 32 ATP per glucose. Older books say 36 to 38.", "The overall yield per glucose"]
    ]
  },
  {
    id: "adme", subj: "pharm", title: "What the body does to a drug (ADME)", layout: "snake", cols: 3,
    note: "Pharmacokinetics in five steps. Theory only.",
    nodes: [
      ["Administration", "Routes: oral, intravenous, intramuscular, subcutaneous, topical. The intravenous route gives 100% bioavailability.", "The route by which the drug enters the body"],
      ["Absorption", "The drug moves from the site of administration into the blood. It depends on the route, lipid solubility and pH.", "The drug moves from the site of administration into blood"],
      ["Distribution", "The drug goes from blood to the tissues. Plasma protein binding, blood flow and barriers such as the blood-brain barrier matter.", "The drug moves from blood to tissues"],
      ["Metabolism (biotransformation)", "Mainly in the liver: phase I (oxidation, cytochrome P450) and phase II (conjugation, e.g. glucuronidation). Cats are poor at glucuronidation, so they are sensitive to paracetamol.", "Mainly in the liver; cats are poor at glucuronidation"],
      ["Excretion", "Mainly by the kidney. Also bile, milk and lungs. Excretion in milk and tissue residues is why withdrawal periods matter in food animals.", "Removal of the drug and its metabolites, mainly by the kidney"]
    ]
  },
  {
    id: "fasc", subj: "para", title: "Life cycle of Fasciola (liver fluke)", layout: "cycle",
    note: "Fasciola needs a snail intermediate host, so snail control and fencing off wet pastures help to break the cycle.",
    nodes: [
      ["Adult fluke in bile ducts", "Final hosts: cattle, buffalo, sheep and goats. It causes fascioliasis (liver fluke disease).", "The adult stage, in the bile ducts of the final host"],
      ["Eggs passed in faeces", "Operculated, yellowish-brown eggs. They need water to develop and hatch.", "Eggs leave the host in the faeces"],
      ["Miracidium", "A free-swimming ciliated larva that hatches in water and penetrates a snail.", "Ciliated larva that hatches in water and finds a snail"],
      ["Snail (Lymnaea) stages", "Lymnaea snails are the intermediate host. Sporocyst, redia and cercaria develop inside.", "Intermediate host where sporocyst and redia develop"],
      ["Cercaria", "A tailed larva that leaves the snail and swims to vegetation.", "Tailed larva that leaves the snail"],
      ["Metacercaria on grass", "The encysted, infective stage on plants or in water. Animals are infected by swallowing it.", "The infective stage, found encysted on grass"],
      ["Young fluke migrates in the liver", "The young flukes burrow through the intestinal wall and liver tissue to the bile ducts. This causes the acute damage.", "Burrows through the liver tissue and reaches the bile ducts"]
    ]
  },
  {
    id: "inflam", subj: "path", title: "Acute inflammation: sequence", layout: "snake", cols: 4,
    note: "Cardinal signs: rubor (redness), calor (heat), tumor (swelling) and dolor (pain). Virchow added functio laesa (loss of function).",
    nodes: [
      ["Injury or infection", "Tissue damage or microbes trigger the response through chemical mediators such as histamine.", "The trigger"],
      ["Vasodilation", "Arterioles dilate and blood flow rises. This causes redness (rubor) and heat (calor).", "Causes redness and heat"],
      ["Increased vascular permeability", "Fluid and protein leak out of venules, forming exudate and causing swelling (tumor).", "Leakage of protein-rich fluid causes swelling"],
      ["Margination and rolling", "Neutrophils slow down, roll along the vessel wall and stick to it (selectins and integrins).", "Neutrophils slow and stick to the vessel wall"],
      ["Emigration (diapedesis)", "White cells squeeze between endothelial cells and leave the vessel.", "White cells leave the vessel through its wall"],
      ["Chemotaxis and phagocytosis", "Cells move along a chemical gradient to the site and engulf and kill microbes.", "Cells follow chemical signals and engulf microbes"],
      ["Outcome", "Resolution and repair, abscess formation, or progression to chronic inflammation.", "Resolution, abscess or chronic inflammation"]
    ]
  },
  {
    id: "prox", subj: "nutr", title: "Proximate analysis of feed (Weende)", layout: "snake", cols: 4,
    note: "The proximate principles are moisture, ash, crude protein, ether extract, crude fibre and nitrogen-free extract.",
    nodes: [
      ["Feed sample", "A representative, ground sample is the start. A poor sample ruins every later result.", "The starting material"],
      ["Moisture (oven drying)", "Dried in a hot-air oven at about 100 to 105 degrees C. The loss in weight is moisture. What remains is dry matter.", "Oven drying gives this and then dry matter"],
      ["Ash (muffle furnace)", "Burn the sample at about 550 to 600 degrees C. The residue is total ash (minerals).", "Burning in a muffle furnace gives this"],
      ["Crude protein (Kjeldahl)", "Nitrogen is measured and multiplied by 6.25, since protein is about 16% nitrogen.", "Nitrogen multiplied by 6.25"],
      ["Ether extract (Soxhlet)", "Fat is extracted with ether in a Soxhlet apparatus.", "Extracted with ether in a Soxhlet apparatus"],
      ["Crude fibre", "Residue left after boiling in dilute acid and then dilute alkali. It is mostly cellulose and lignin.", "Residue after acid and then alkali digestion"],
      ["Nitrogen-free extract (NFE)", "Found by difference: 100 minus (moisture + ash + CP + EE + CF). It mostly represents soluble carbohydrates.", "Calculated by difference, not measured"]
    ]
  },
  {
    id: "chain", subj: "pubh", title: "Chain of infection (zoonosis example: rabies)", layout: "cycle",
    note: "Break any link in the chain and transmission stops.",
    nodes: [
      ["Infectious agent", "The organism: bacteria, virus, parasite or fungus. Example: rabies virus.", "The disease-causing organism"],
      ["Reservoir", "Where the agent lives and multiplies. For rabies in India: dogs (and wildlife).", "Where the agent normally lives"],
      ["Portal of exit", "The way the agent leaves the reservoir. Rabies: saliva.", "The way the agent leaves the reservoir"],
      ["Mode of transmission", "Direct (bite), indirect (fomites, vectors, food, water) or airborne. Rabies: bite.", "How the agent travels to the new host"],
      ["Portal of entry", "How the agent enters the new host. Rabies: a bite wound or broken skin.", "How the agent enters the new host"],
      ["Susceptible host", "An unvaccinated animal or person. Vaccination of dogs and post-exposure prophylaxis protect hosts.", "Someone without immunity who can become infected"]
    ]
  },
  {
    id: "mendel", subj: "gen", title: "Monohybrid cross (Mendel)", layout: "snake", cols: 3,
    note: "Mendel's pea experiment. T = tall (dominant), t = dwarf (recessive).",
    nodes: [
      ["Parents: TT (tall) x tt (dwarf)", "Pure lines. Each parent gives one allele, so every F1 plant is Tt.", "Pure tall crossed with pure dwarf"],
      ["F1: all Tt, all tall", "Genotype Tt, phenotype tall. The dwarf trait is hidden but not lost. This shows dominance.", "Every F1 plant is tall but carries the hidden allele"],
      ["F1 x F1: Tt x Tt", "Gametes: T and t from each parent (law of segregation).", "Cross between two F1 plants"],
      ["F2 phenotype: 3 tall : 1 dwarf", "The classical monohybrid phenotypic ratio.", "The phenotypic ratio in F2"],
      ["F2 genotype: 1 TT : 2 Tt : 1 tt", "The genotypic ratio in F2.", "The genotypic ratio in F2"],
      ["Test cross: Tt x tt gives 1 : 1", "A cross with the recessive parent shows whether a dominant-looking individual is TT or Tt. If Tt, offspring are 1 tall : 1 dwarf.", "Cross with the recessive parent to find the genotype"]
    ]
  },
  {
    id: "dairy", subj: "lpm", title: "Dairy cow: production cycle", layout: "cycle",
    note: "Aim for a calving interval of about 12 to 13 months.",
    nodes: [
      ["Calving", "The start of a new lactation. Provide a clean, dry calving area and watch for retained placenta.", "Start of the new lactation"],
      ["Colostrum feeding", "The calf needs colostrum as early as possible (best within the first hours). It gives antibodies, because calves are born with almost none.", "First milk, rich in antibodies, for the newborn calf"],
      ["Peak lactation", "Milk yield peaks some weeks after calving (roughly weeks 4 to 8). Feed a high-energy ration.", "Milk yield is highest here"],
      ["Breeding (rebreeding)", "The cow is bred again after the voluntary waiting period (often around 60 days). Heat detection is key.", "The cow is inseminated again"],
      ["Late lactation", "Milk yield declines while the cow is pregnant.", "Milk yield declines during pregnancy"],
      ["Dry period", "About 60 days without milking. It lets the udder tissue renew and the cow rebuild body condition.", "Rest from milking before the next calving"]
    ]
  },
  {
    id: "milk", subj: "lpt", title: "Market milk processing line", layout: "snake", cols: 4,
    note: "The alkaline phosphatase test checks that milk was properly pasteurised.",
    nodes: [
      ["Reception and testing", "Platform tests: temperature, acidity, clot-on-boiling or alcohol test, and adulterants. Weigh and sample.", "Platform tests on arriving milk"],
      ["Filtration and clarification", "Removes visible dirt and cells with a filter or a clarifier (centrifuge).", "Removes visible dirt and sediment"],
      ["Standardisation", "Adjusts fat and SNF to the required level.", "Adjusting fat and SNF"],
      ["Homogenisation", "Breaks fat globules into smaller ones under high pressure, preventing cream line formation.", "Breaks up the fat globules"],
      ["Pasteurisation", "HTST: 72 degrees C for 15 seconds. LTLT (holder): 63 degrees C for 30 minutes. It kills non-spore pathogens.", "HTST 72 degrees C for 15 seconds"],
      ["Cooling", "Cool quickly to about 4 to 5 degrees C to prevent growth of surviving bacteria.", "Rapid chilling to about 4 to 5 degrees C"],
      ["Packaging and cold storage", "Fill into clean pouches or bottles, then keep in the cold chain until sold.", "Filling and keeping in the cold chain"]
    ]
  },
  {
    id: "estrous", subj: "gyn", title: "Bovine oestrous cycle (about 21 days)", layout: "cycle",
    note: "The cow is polyoestrous, so she cycles all year. The usual cycle length is about 21 days (18 to 24).",
    nodes: [
      ["Pro-oestrus", "Follicles grow and oestrogen rises. The cow begins to show interest in other cows.", "Follicle growth and rising oestrogen"],
      ["Oestrus (heat)", "Standing to be mounted. The LH surge occurs. Heat lasts about 12 to 18 hours.", "The cow stands to be mounted"],
      ["Met-oestrus", "Ovulation occurs about 10 to 14 hours after the end of heat. The corpus luteum starts to form. There may be a bloody mucus discharge.", "Ovulation and early corpus luteum formation"],
      ["Dioestrus", "The longest phase. The corpus luteum is mature and secretes progesterone.", "The longest phase, with progesterone dominant"],
      ["Luteolysis", "If the cow is not pregnant, the uterus releases PGF2 alpha and the corpus luteum regresses, so a new cycle starts.", "PGF2 alpha makes the corpus luteum regress"]
    ]
  },
  {
    id: "wound", subj: "surg", title: "Phases of wound healing", layout: "snake", cols: 4,
    note: "First intention: a clean, sutured wound. Second intention: an open wound that heals by granulation and contraction.",
    nodes: [
      ["Haemostasis", "Immediate. Vasoconstriction and a platelet plug and fibrin clot stop bleeding.", "Stopping the bleeding"],
      ["Inflammatory phase", "Roughly the first few days. Neutrophils then macrophages clean the wound (debridement).", "Neutrophils and macrophages clean the wound"],
      ["Proliferative phase", "Fibroblasts lay down collagen, new capillaries form granulation tissue, and the wound edges contract and epithelialise.", "Granulation tissue forms and the wound contracts"],
      ["Maturation (remodelling)", "Starts around weeks 2 to 3 and can last for months. Collagen is reorganised. The scar reaches about 80% of normal skin strength.", "The scar is remodelled and gets stronger"]
    ]
  },
  {
    id: "milkfever", subj: "med", title: "Milk fever (parturient hypocalcaemia) in cows", layout: "snake", cols: 4,
    note: "Treatment is an emergency. Give calcium borogluconate slowly and listen to the heart while giving it.",
    nodes: [
      ["Calving and start of lactation", "Most cases occur within 1 to 3 days after calving, mainly in high-yielding older dairy cows.", "The time of risk"],
      ["Calcium drains into colostrum", "Colostrum removes more calcium than the cow can mobilise from bone and gut.", "Calcium is lost into the first milk"],
      ["Blood calcium falls", "Hypocalcaemia reduces nerve and muscle function, including the smooth muscle of the gut and the heart.", "Low blood calcium"],
      ["Stage 1", "Restless, excitable, tremors, stiff gait and loss of appetite.", "Excited, tremor, stiff gait; still standing"],
      ["Stage 2", "Cannot stand. Sternal recumbency with the head turned into the flank (S-shaped neck), cold ears and legs, dry muzzle.", "Sternal recumbency with S-shaped neck"],
      ["Stage 3", "Lateral recumbency, bloat, weak pulse, coma and death if untreated.", "Lateral recumbency and coma"],
      ["Treatment", "Slow intravenous calcium borogluconate (for example 20 to 25 percent solution), then nurse the cow and prevent relapse.", "Slow intravenous calcium borogluconate"]
    ]
  },
  {
    id: "adoption", subj: "ext", title: "Stages of the adoption process", layout: "snake", cols: 5,
    note: "These are the classical stages. Rogers later renamed them knowledge, persuasion, decision, implementation and confirmation.",
    nodes: [
      ["Awareness", "The farmer first hears about a new practice, for example artificial insemination, but has little information.", "First hears about the new practice"],
      ["Interest", "The farmer seeks more information and asks questions.", "Seeks more information"],
      ["Evaluation", "The farmer mentally weighs the practice against his or her own situation: cost, benefit and risk.", "Weighs cost, benefit and risk mentally"],
      ["Trial", "The farmer tries it on a small scale, for example on one animal.", "Tries it on a small scale"],
      ["Adoption", "The farmer decides to use it fully and continues.", "Takes it up fully"]
    ]
  },
  {
    id: "adopters", subj: "ext", title: "Adopter categories (Rogers)", layout: "snake", cols: 5,
    note: "Percentages are Rogers' figures for a normally distributed population.",
    nodes: [
      ["Innovators (2.5%)", "Venturesome. They are the first to try new ideas, often have contacts outside the village.", "The first and most venturesome 2.5%"],
      ["Early adopters (13.5%)", "Respected opinion leaders. Others look to them for advice.", "Respected opinion leaders"],
      ["Early majority (34%)", "Deliberate. They adopt just before the average farmer.", "34% who adopt just before the average"],
      ["Late majority (34%)", "Sceptical. They adopt after most others, often because of pressure from peers.", "Sceptical 34% who adopt after the average"],
      ["Laggards (16%)", "Traditional, last to adopt, and they often look to the past.", "The last 16%, traditional"]
    ]
  },
  {
    id: "exam", subj: "clin", title: "Clinical examination: order of steps", layout: "snake", cols: 4,
    note: "A dog's normal rectal temperature is about 38.3 to 39.2 degrees C (101 to 102.5 degrees F).",
    nodes: [
      ["History (anamnesis)", "Ask the owner: signalment, vaccination, feeding, deworming, duration and course of the illness.", "Questions to the owner"],
      ["General examination", "Temperature, pulse, respiration, mucous membranes, hydration, body condition, lymph nodes.", "Temperature, pulse, respiration and mucous membranes"],
      ["Systemic examination", "System by system using inspection, palpation, percussion and auscultation.", "Inspection, palpation, percussion and auscultation by system"],
      ["Provisional diagnosis", "A working diagnosis and list of differentials from history and findings.", "A working diagnosis"],
      ["Laboratory and imaging", "Blood, faecal and urine tests, radiography or ultrasound to confirm the diagnosis.", "Tests that confirm the diagnosis"],
      ["Treatment and advice", "Treat, counsel the owner, and note any withdrawal periods in food animals.", "Treatment and owner advice"],
      ["Records", "Keep clear case records. They matter for follow-up, legal reasons and ethics.", "Keeping case records"]
    ]
  },
  {
    id: "biosec", subj: "farm", title: "Farm biosecurity routine", layout: "snake", cols: 3,
    note: "Prevention is cheaper than treatment. Keep the routine written and followed by all workers.",
    nodes: [
      ["Controlled entry", "Visitor register, footbath at the gate, vehicle disinfection and restricted access to animal sheds.", "Footbaths and a visitor register"],
      ["Quarantine of new animals", "Keep new stock separate, usually for 2 to 4 weeks, and observe and test before mixing.", "New animals are kept apart before joining the herd"],
      ["Vaccination and deworming", "Follow a written calendar for the area's common diseases and keep the records.", "Following a vaccination and deworming calendar"],
      ["Cleaning and disinfection", "Clean first, then disinfect, because dirt inactivates many disinfectants. Use all-in all-out in poultry and pigs.", "Clean first, then disinfect"],
      ["Waste and carcass disposal", "Burial, incineration or composting, away from water sources. Never leave carcasses in the open.", "Safe handling of dead animals and manure"],
      ["Health records and monitoring", "Daily observation, mortality and production records. Report unusual deaths early.", "Daily observation and records to detect disease early"]
    ]
  },
  {
    id: "cranial", subj: "anat", title: "The 12 cranial nerves", layout: "list", cols: 4,
    note: "Memory aid: Some Say Money Matters, But My Brother Says Big Brains Matter More (S = sensory, M = motor, B = both).",
    nodes: [
      ["I Olfactory", "Sensory. Smell. The dog has a very large olfactory area.", "Sensory nerve for smell"],
      ["II Optic", "Sensory. Vision, from the retina to the brain.", "Carries vision from the retina"],
      ["III Oculomotor", "Motor. Most eye muscles, and pupil constriction and lens accommodation (parasympathetic).", "Moves most eye muscles and constricts the pupil"],
      ["IV Trochlear", "Motor. Supplies the dorsal oblique muscle of the eye.", "Supplies the dorsal oblique muscle"],
      ["V Trigeminal", "Both. Sensation of the face. Motor to the muscles of mastication.", "Sensation of the face and motor to chewing muscles"],
      ["VI Abducens", "Motor. Lateral rectus and the retractor bulbi.", "Supplies lateral rectus and retractor bulbi"],
      ["VII Facial", "Both. Muscles of facial expression, taste from the front of the tongue, and tear and salivary secretion.", "Muscles of facial expression"],
      ["VIII Vestibulocochlear", "Sensory. Hearing (cochlear part) and balance (vestibular part).", "Hearing and balance"],
      ["IX Glossopharyngeal", "Both. Pharynx, taste from the back of the tongue, and the parotid gland.", "Taste from the back of the tongue and the pharynx"],
      ["X Vagus", "Both. Parasympathetic supply to the thoracic and abdominal organs. It also supplies the larynx and pharynx.", "Parasympathetic supply to the thorax and abdomen"],
      ["XI Accessory", "Motor. Trapezius, sternocephalicus and brachiocephalicus muscles.", "Supplies trapezius and sternocephalicus"],
      ["XII Hypoglossal", "Motor. The muscles of the tongue.", "Moves the tongue"]
    ]
  },
  {
    id: "gitract", subj: "anat", title: "Path of food in the dog (simple stomach)", layout: "snake", cols: 4,
    note: "The dog is a carnivore, so its large intestine is short and it has a single simple stomach.",
    nodes: [
      ["Mouth", "Teeth tear and cut. The carnassial teeth are the upper fourth premolar and lower first molar. Adult dogs have 42 teeth.", "Has the carnassial teeth"],
      ["Pharynx and oesophagus", "Swallowing moves food down the oesophagus to the stomach.", "Tube that carries food to the stomach"],
      ["Stomach", "A simple stomach with cardiac, fundic and pyloric regions. Gastric dilatation-volvulus (bloat) is an emergency in deep-chested breeds.", "Simple stomach, site of GDV"],
      ["Duodenum", "First part of the small intestine. Bile and pancreatic ducts open here.", "Receives bile and pancreatic juice"],
      ["Jejunum and ileum", "Most digestion and absorption of nutrients takes place here.", "Main site of absorption"],
      ["Caecum and colon", "The caecum is small in the dog. The colon absorbs water.", "Absorbs water; the caecum is small in dogs"],
      ["Rectum", "Stores faeces before defaecation. The anal sacs open beside the anus.", "Last part before the anus"],
      ["Anus", "The terminal opening. The anal sacs are on each side and can become impacted.", "Terminal opening"]
    ]
  },
  {
    id: "embryo", subj: "anat", title: "Early embryonic development", layout: "snake", cols: 4,
    nodes: [
      ["Zygote", "The fertilised egg, one cell, formed in the oviduct.", "The single fertilised cell"],
      ["Cleavage and morula", "Rapid cell divisions with no growth give a solid ball of cells called the morula.", "A solid ball of cells"],
      ["Blastocyst", "A hollow ball with an inner cell mass (becomes the embryo) and a trophoblast (becomes the placenta).", "Has an inner cell mass and a trophoblast"],
      ["Gastrulation", "The three germ layers form: ectoderm, mesoderm and endoderm.", "The three germ layers form"],
      ["Ectoderm", "Gives the nervous system, skin epidermis, hair and hooves.", "Gives the nervous system and skin"],
      ["Mesoderm", "Gives muscle, bone, blood, heart, kidney and the reproductive tract.", "Gives muscle, bone, heart and kidney"],
      ["Endoderm", "Gives the lining of the gut and respiratory tract, and organs such as the liver and pancreas.", "Gives the lining of the gut and the liver"],
      ["Organogenesis", "Organs form from the three layers. Interference at this stage can cause congenital defects.", "Organs form from the germ layers"]
    ]
  },
  {
    id: "mammary", subj: "anat", title: "Path of milk in the cow's udder", layout: "snake", cols: 3,
    note: "The udder has four quarters, each with its own teat, and no connection between quarters.",
    nodes: [
      ["Alveoli", "Tiny sacs lined by milk-secreting cells. Oxytocin makes the myoepithelial cells around them contract.", "Where milk is made"],
      ["Small ducts", "Collect milk from groups of alveoli.", "Collect milk from the alveoli"],
      ["Large lactiferous ducts", "Join the small ducts and lead down to the gland cistern.", "Large ducts leading to the cistern"],
      ["Gland cistern (sinus)", "Stores milk above the teat.", "Storage above the teat"],
      ["Teat cistern", "Stores milk inside the teat, below the annular fold.", "Storage inside the teat"],
      ["Teat (streak) canal", "Ends at the teat orifice. A sphincter keeps it closed. This is the route by which mastitis bacteria enter.", "The route for mastitis bacteria"]
    ]
  },
  {
    id: "ecg", subj: "phys", title: "Conduction of the heartbeat", layout: "snake", cols: 4,
    note: "The ECG records this electrical activity: P wave (atrial depolarisation), QRS (ventricular) and T wave (ventricular repolarisation).",
    nodes: [
      ["SA node", "The natural pacemaker in the right atrial wall. It starts each beat.", "The natural pacemaker"],
      ["Atrial muscle", "The impulse spreads over both atria, which contract (P wave).", "Atria contract first"],
      ["AV node", "Delays the impulse so the ventricles fill before they contract.", "Delays the impulse"],
      ["Bundle of His", "Takes the impulse from the AV node into the interventricular septum.", "Connects the AV node to the septum"],
      ["Bundle branches", "Left and right branches run down each side of the septum.", "Left and right branches"],
      ["Purkinje fibres", "Spread the impulse quickly through the ventricular muscle.", "Spread the impulse through the ventricles"],
      ["Ventricular contraction", "The ventricles contract from the apex upwards (QRS), ejecting blood.", "Ventricles contract"]
    ]
  },
  {
    id: "urine", subj: "phys", title: "Urine formation in the nephron", layout: "snake", cols: 3,
    note: "Ruminants and dogs can concentrate urine well using the loop of Henle and ADH.",
    nodes: [
      ["Glomerular filtration", "Blood is filtered in the glomerulus into Bowman's capsule. Water, ions, glucose and small molecules pass. Proteins and cells do not.", "Blood is filtered into Bowman's capsule"],
      ["Proximal convoluted tubule", "About two thirds of the filtrate, including all the glucose and amino acids, is reabsorbed here.", "Reabsorbs most of the filtrate, and all the glucose"],
      ["Loop of Henle", "Creates a concentration gradient in the medulla (countercurrent multiplier).", "Makes the medullary concentration gradient"],
      ["Distal convoluted tubule", "Fine tuning: aldosterone controls sodium and potassium handling here.", "Aldosterone acts here"],
      ["Collecting duct", "ADH (vasopressin) makes it permeable to water, so urine becomes concentrated.", "ADH acts here to save water"],
      ["Ureter, bladder, urethra", "Urine is carried to the bladder, stored, and voided.", "Carries urine out of the body"]
    ]
  },
  {
    id: "rumenfer", subj: "phys", title: "Rumen fermentation and what the cow gets", layout: "snake", cols: 3,
    note: "Microbes let ruminants live on fibre and even non-protein nitrogen like urea.",
    nodes: [
      ["Feed (fibre, starch, protein)", "The cow eats forage and concentrate and then ruminates (chews the cud).", "What is eaten and then chewed again"],
      ["Microbial fermentation", "Rumen bacteria, protozoa and fungi break down fibre and starch without oxygen.", "Anaerobic breakdown by rumen microbes"],
      ["Volatile fatty acids", "Acetate, propionate and butyrate are the main energy source. They are absorbed through the rumen wall.", "Acetate, propionate and butyrate"],
      ["Propionate to glucose", "The liver converts propionate to glucose (gluconeogenesis). Acetate is used for milk fat.", "Used for gluconeogenesis; acetate for milk fat"],
      ["Gases (CO2 and methane)", "Removed by eructation (belching). Failure to belch causes bloat.", "Removed by belching; blocked in bloat"],
      ["Microbial protein", "Microbes pass on to the abomasum and small intestine and are digested, giving the cow protein.", "Microbes are digested later and give protein"]
    ]
  },
  {
    id: "reflex", subj: "phys", title: "The reflex arc", layout: "snake", cols: 4,
    note: "Example: withdrawal of the limb from a pin prick.",
    nodes: [
      ["Stimulus", "A change in the environment, such as a pin prick.", "The change that starts the reflex"],
      ["Receptor", "A sensory ending that detects the stimulus.", "Detects the stimulus"],
      ["Sensory (afferent) neuron", "Carries the impulse to the spinal cord via the dorsal root.", "Carries the impulse to the cord"],
      ["Integration centre", "The spinal cord (or brain stem). In a simple reflex it may use an interneuron.", "Spinal cord processing"],
      ["Motor (efferent) neuron", "Carries the impulse out of the spinal cord by the ventral root.", "Carries the impulse away from the cord"],
      ["Effector", "A muscle or gland that carries out the response.", "The muscle or gland that responds"],
      ["Response", "The animal withdraws the limb, quickly and without conscious thought.", "The limb is withdrawn"]
    ]
  },
  {
    id: "clot", subj: "phys", title: "Blood clotting (haemostasis)", layout: "snake", cols: 4,
    note: "Vitamin K is needed for factors II, VII, IX and X. Warfarin-type rodenticides block it.",
    nodes: [
      ["Vessel injury", "Exposed collagen and tissue factor start clotting.", "Exposed collagen starts the process"],
      ["Vasoconstriction", "The vessel narrows to reduce blood loss.", "The vessel narrows"],
      ["Platelet plug", "Platelets stick and aggregate at the injury (primary haemostasis).", "Platelets stick together"],
      ["Coagulation cascade", "The intrinsic and extrinsic pathways join in a common pathway and activate factor X.", "Intrinsic and extrinsic pathways"],
      ["Thrombin formation", "Prothrombin is converted to thrombin by factor Xa.", "Prothrombin becomes thrombin"],
      ["Fibrin formation", "Thrombin converts soluble fibrinogen into insoluble fibrin strands.", "Fibrinogen becomes fibrin"],
      ["Stable clot", "Fibrin traps red cells and platelets. Later the clot retracts and is dissolved (fibrinolysis).", "Fibrin mesh holds the platelet plug"]
    ]
  },
  {
    id: "dogma", subj: "bioc", title: "Central dogma of molecular biology", layout: "snake", cols: 3,
    note: "DNA makes RNA makes protein.",
    nodes: [
      ["DNA replication", "Semi-conservative. DNA polymerase copies the strand before the cell divides.", "Copying DNA before cell division"],
      ["DNA", "Double helix with the code for all proteins.", "Stores the genetic code"],
      ["Transcription", "RNA polymerase makes mRNA from the DNA template in the nucleus.", "DNA is copied into mRNA"],
      ["mRNA", "Carries the code to the ribosome. Three bases (a codon) code for one amino acid.", "Carries the code to the ribosome"],
      ["Translation", "Ribosomes read the mRNA and tRNA brings amino acids in the right order.", "Ribosomes build the protein"],
      ["Protein", "The finished polypeptide folds into a working protein or enzyme.", "The final product"]
    ]
  },
  {
    id: "urea", subj: "bioc", title: "Nitrogen: from amino acid to urea", layout: "snake", cols: 3,
    note: "Birds make uric acid instead of urea. Ruminants recycle some urea back to the rumen.",
    nodes: [
      ["Amino acid breakdown", "Amino acids lose their amino group by transamination and deamination.", "Amino group is removed"],
      ["Ammonia (toxic)", "Free ammonia is toxic, especially to the brain, so it must be detoxified quickly.", "Toxic to the brain"],
      ["Urea cycle in the liver", "Converts ammonia and CO2 into urea. Liver failure gives hyperammonaemia.", "Occurs in the liver"],
      ["Urea in blood", "Blood urea nitrogen (BUN) rises when the kidney fails.", "Measured as BUN"],
      ["Excretion by kidney", "Most urea leaves in the urine. Some is recycled to the rumen.", "Leaves in the urine"]
    ]
  },
  {
    id: "ketone", subj: "bioc", title: "Fat breakdown and ketone bodies", layout: "snake", cols: 3,
    nodes: [
      ["Fat mobilisation", "In energy shortage (for example early lactation), adipose tissue releases free fatty acids.", "Fat stores are released"],
      ["Fatty acids reach the liver", "Carried in the blood bound to albumin.", "Carried on albumin to the liver"],
      ["Beta oxidation", "In mitochondria, fatty acids are cut into 2-carbon acetyl-CoA units.", "Fatty acids are cut into acetyl-CoA"],
      ["Acetyl-CoA", "Normally enters the TCA cycle, which needs oxaloacetate from glucose.", "Enters the TCA cycle if oxaloacetate is available"],
      ["Ketone bodies", "When oxaloacetate is short, acetyl-CoA makes acetoacetate, beta-hydroxybutyrate and acetone.", "Made when oxaloacetate is short"],
      ["Ketosis", "High ketones in blood, milk and urine. Seen in early-lactation cows and pregnant ewes.", "Ketones build up in the blood"]
    ]
  },
  {
    id: "enzyme", subj: "bioc", title: "How an enzyme works", layout: "snake", cols: 3,
    note: "Enzymes lower the activation energy. They are not used up.",
    nodes: [
      ["Enzyme and substrate meet", "The substrate fits the active site (lock and key, or induced fit).", "Substrate meets the active site"],
      ["Enzyme-substrate complex", "The substrate is bound to the active site.", "The enzyme is bound to the substrate"],
      ["Transition state", "The enzyme lowers the activation energy.", "Activation energy is lowered"],
      ["Product formed", "The substrate is converted into the product.", "The substrate is converted"],
      ["Enzyme released", "The enzyme is unchanged and can work again.", "The enzyme is free to be reused"]
    ]
  },
  {
    id: "receptor", subj: "pharm", title: "Drug-receptor action", layout: "snake", cols: 3,
    nodes: [
      ["Drug reaches the receptor", "Receptors are usually proteins on or in cells.", "The drug arrives"],
      ["Binding", "Affinity is how strongly it binds.", "Affinity"],
      ["Agonist", "Binds and activates the receptor. It has affinity and efficacy.", "Binds and activates"],
      ["Antagonist", "Binds but does not activate, and blocks the agonist. Example: atropine blocks muscarinic receptors.", "Binds and blocks without activating"],
      ["Response", "The tissue responds: effect depends on dose (dose-response relationship).", "The tissue effect"]
    ]
  },
  {
    id: "abmech", subj: "pharm", title: "Antibiotic targets", layout: "list", cols: 3,
    note: "Theory only. Choice of antibiotic depends on culture, sensitivity and local guidelines.",
    nodes: [
      ["Cell wall synthesis", "Penicillins, cephalosporins. Bactericidal.", "Penicillins and cephalosporins"],
      ["30S ribosome", "Aminoglycosides (gentamicin) and tetracyclines.", "Aminoglycosides and tetracyclines"],
      ["50S ribosome", "Macrolides (erythromycin), lincosamides and chloramphenicol.", "Macrolides and lincosamides"],
      ["DNA gyrase", "Fluoroquinolones (enrofloxacin) block it.", "Fluoroquinolones"],
      ["Folate synthesis", "Sulphonamides with trimethoprim.", "Sulphonamides and trimethoprim"],
      ["Cell membrane", "Polymyxins (colistin) disrupt it.", "Polymyxins"]
    ]
  },
  {
    id: "withdraw", subj: "pharm", title: "Drug residues and withdrawal period", layout: "snake", cols: 3,
    note: "Follow the label withdrawal period for milk, meat and eggs.",
    nodes: [
      ["Drug given to a food animal", "Antibiotics and other drugs can leave residues.", "A drug is given to a dairy cow or a layer"],
      ["Residues in milk, meat or eggs", "Drug or metabolites may remain in the product.", "Drug stays in the product"],
      ["Withdrawal period observed", "Time between the last dose and safe use of the product.", "Waiting time before milk or meat is used"],
      ["Residue below MRL", "MRL is the maximum residue limit allowed.", "Maximum residue limit"],
      ["Product is safe to use", "Prevents allergy and antibiotic resistance in consumers.", "Safe for consumers"]
    ]
  },
  {
    id: "gstages", subj: "pharm", title: "Stages of general anaesthesia (Guedel)", layout: "snake", cols: 4,
    note: "Modern balanced anaesthesia passes through the stages quickly. Monitoring is always needed.",
    nodes: [
      ["Stage I: analgesia", "From the start to loss of consciousness.", "Analgesia, animal still conscious"],
      ["Stage II: excitement", "Loss of consciousness with involuntary movement, panting, and irregular breathing. Passed quickly with good induction.", "Delirium and excitement"],
      ["Stage III: surgical anaesthesia", "Planes 1 to 4. Surgery is done in the lighter planes with regular breathing and loss of reflexes.", "The stage where surgery is done"],
      ["Stage IV: overdose", "Respiratory and cardiac arrest. Reverse immediately.", "Medullary paralysis"]
    ]
  },
  {
    id: "gram", subj: "micro", title: "Gram staining steps", layout: "snake", cols: 3,
    note: "Gram positive = purple, Gram negative = pink or red.",
    nodes: [
      ["Crystal violet", "The primary stain colours all the cells purple.", "Primary stain"],
      ["Gram's iodine", "Acts as a mordant, fixing the stain in the cell.", "Mordant"],
      ["Decolouriser (alcohol or acetone)", "Washes the dye out of Gram-negative cells but not Gram-positive ones.", "Differentiating step"],
      ["Safranin", "The counterstain colours Gram-negative cells pink or red.", "Counterstain"],
      ["Result", "Gram-positive bacteria stay purple (thick peptidoglycan). Gram-negative bacteria look pink or red.", "Purple means Gram positive"]
    ]
  },
  {
    id: "growth", subj: "micro", title: "Bacterial growth curve", layout: "snake", cols: 4,
    nodes: [
      ["Lag phase", "Cells adapt and make enzymes. Little or no division.", "Adjustment, no division"],
      ["Log (exponential) phase", "Fastest, steady division. Cells are most sensitive to antibiotics.", "Fastest division"],
      ["Stationary phase", "Nutrients are depleted and wastes build up. New cells equal dying cells.", "Growth rate equals death rate"],
      ["Decline (death) phase", "More cells die than divide.", "More cells die than divide"]
    ]
  },
  {
    id: "immune", subj: "micro", title: "Adaptive immune response", layout: "snake", cols: 3,
    nodes: [
      ["Antigen enters", "A microbe or vaccine antigen enters the body.", "The foreign material"],
      ["Antigen presenting cell", "Macrophages and dendritic cells engulf it and show fragments on MHC.", "Shows the antigen to T cells"],
      ["T helper cell activation", "CD4 T cells recognise the antigen and release cytokines.", "CD4 cells are activated"],
      ["B cell activation", "B cells with matching receptors are stimulated.", "B cells are stimulated"],
      ["Plasma cells and antibodies", "Plasma cells secrete large amounts of antibody.", "Plasma cells make antibodies"],
      ["Memory cells", "Memory cells give a faster, stronger secondary response. This is the basis of vaccination.", "Provide the faster second response"]
    ]
  },
  {
    id: "virus", subj: "micro", title: "Virus replication cycle", layout: "snake", cols: 3,
    nodes: [
      ["Attachment", "The virus binds specific receptors on the host cell.", "Virus sticks to host receptors"],
      ["Penetration", "The virus enters the cell, by endocytosis or fusion.", "Enters the host cell"],
      ["Uncoating", "The capsid is removed and the nucleic acid is released.", "The genome is released"],
      ["Synthesis", "The host machinery makes viral genomes and proteins.", "The cell makes viral parts"],
      ["Assembly", "New virions are put together.", "New particles are assembled"],
      ["Release", "By budding or cell lysis. The cycle can start again.", "Virions leave the cell"]
    ]
  },
  {
    id: "haem", subj: "para", title: "Haemonchus contortus (barber pole worm) life cycle", layout: "cycle",
    note: "Direct life cycle: no intermediate host. Faecal egg counts and FAMACHA scoring are used in sheep and goats.",
    nodes: [
      ["Adult worm in abomasum", "A blood-sucking worm that causes anaemia and bottle jaw in sheep and goats.", "Adult stage in the abomasum"],
      ["Eggs in faeces", "Eggs pass out in the faeces and hatch on pasture.", "Eggs leave in the faeces"],
      ["L1 and L2 larvae", "Free-living, feeding on bacteria in the faeces.", "Free-living feeding larvae"],
      ["L3 infective larva", "Does not feed. Survives on grass in warm, moist weather. Swallowed by grazing animals.", "The infective stage on grass"],
      ["Ingested and exsheathed", "The sheath is lost in the rumen and the larva moves to the abomasum.", "Swallowed with grass"],
      ["L4 and adult", "Larvae mature in the abomasum. Egg production starts after about 2 to 3 weeks.", "Matures in the abomasum"]
    ]
  },
  {
    id: "babesia", subj: "para", title: "Babesia in cattle: transmission and cycle", layout: "snake", cols: 3,
    note: "Tick-borne red cell parasite. Signs: fever, anaemia, haemoglobinuria (red water).",
    nodes: [
      ["Infected tick bites", "Ticks such as Rhipicephalus (Boophilus) transmit Babesia bigemina and B. bovis.", "The vector feeds on the animal"],
      ["Sporozoites enter the blood", "Injected with tick saliva.", "Injected by the tick"],
      ["Invade red blood cells", "Sporozoites enter RBCs and become trophozoites.", "Enter the red cells"],
      ["Merozoites by binary fission", "Cells divide and rupture, giving anaemia and haemoglobinuria.", "Division and rupture of RBCs"],
      ["Tick ingests parasites", "A new tick feeds on infected blood.", "A tick takes up infected blood"],
      ["Development in the tick", "Sexual stages in the tick gut. Transmission to the next generation is through the eggs (transovarial).", "Spreads to the tick's offspring through eggs"]
    ]
  },
  {
    id: "eimeria", subj: "para", title: "Coccidia (Eimeria) life cycle", layout: "snake", cols: 3,
    note: "Heavy infection causes bloody diarrhoea in calves and chickens, especially in damp, crowded sheds.",
    nodes: [
      ["Oocyst in faeces", "Passed unsporulated and not yet infective.", "Passed unsporulated"],
      ["Sporulation outside", "In 1 to a few days, with warmth, moisture and oxygen, the oocyst becomes infective.", "Becomes infective outside the host"],
      ["Swallowed by host", "The animal swallows sporulated oocysts from feed, water or litter.", "Swallowed by the animal"],
      ["Schizogony", "Sporozoites invade gut cells and multiply asexually, destroying them.", "Asexual multiplication in gut cells"],
      ["Gametogony", "Sexual stages form and fertilise.", "Sexual stages"],
      ["New oocysts shed", "Oocysts pass in faeces and the cycle repeats.", "New oocysts pass out"]
    ]
  },
  {
    id: "hydatid", subj: "para", title: "Hydatid disease (Echinococcus granulosus)", layout: "cycle",
    note: "A zoonosis: humans are accidental intermediate hosts.",
    nodes: [
      ["Adult tapeworm in dog", "Lives in the small intestine of the dog (final host).", "The final host"],
      ["Eggs in dog faeces", "Eggs are shed in the faeces and contaminate pasture and water.", "Eggs shed by the dog"],
      ["Eaten by sheep, cattle or humans", "These are intermediate hosts.", "Intermediate host swallows the eggs"],
      ["Hydatid cyst in liver or lung", "Larvae form fluid-filled cysts with protoscolices.", "The cyst stage"],
      ["Dog eats infected offal", "Dogs fed raw offal are re-infected. Prevention: do not feed raw offal to dogs and dispose of it safely.", "How the dog becomes infected"]
    ]
  },
  {
    id: "celli", subj: "path", title: "Cell injury: from reversible to irreversible", layout: "snake", cols: 3,
    nodes: [
      ["Cause", "Hypoxia, toxins, microbes, physical injury or nutrient deficiency.", "The injurious agent"],
      ["Reversible injury", "Cell swelling and fatty change. The cell recovers if the cause is removed.", "Cell swelling and fatty change"],
      ["Point of no return", "Persistent injury leads to membrane damage and mitochondrial failure.", "The cell can no longer recover"],
      ["Necrosis", "Cell death with inflammation. The nucleus shows pyknosis, karyorrhexis and karyolysis.", "Cell death with inflammation"],
      ["Apoptosis", "A programmed, energy-requiring form of cell death, usually without inflammation.", "Programmed cell death"]
    ]
  },
  {
    id: "necrosis", subj: "path", title: "Types of necrosis", layout: "list", cols: 3,
    nodes: [
      ["Coagulative", "Solid organs, such as in infarcts. The architecture is kept for some days.", "Seen in infarcts"],
      ["Liquefactive", "Brain and abscesses. The tissue becomes a liquid mass.", "Brain and abscess"],
      ["Caseous", "A cheese-like mass, as in tuberculosis.", "Cheese-like, tuberculosis"],
      ["Fat necrosis", "Seen around the pancreas in pancreatitis, with chalky white areas.", "Pancreatitis"],
      ["Gangrene", "Necrosis with putrefaction. Dry, moist or gas gangrene.", "Necrosis with putrefaction"],
      ["Fibrinoid", "In blood vessel walls in immune damage.", "Vessel walls"]
    ]
  },
  {
    id: "neoplasia", subj: "path", title: "How a tumour develops and spreads", layout: "snake", cols: 3,
    nodes: [
      ["Carcinogen or mutation", "Chemicals, radiation and some viruses damage DNA.", "DNA is damaged"],
      ["Uncontrolled proliferation", "Cells escape normal growth control. Oncogenes are activated and tumour suppressors lost.", "Cells grow without control"],
      ["Angiogenesis", "The tumour stimulates new blood vessels to feed it.", "New blood vessels form"],
      ["Local invasion", "Cells invade nearby tissue.", "Spread into nearby tissue"],
      ["Metastasis", "Spread to distant sites through blood or lymph. This separates malignant from benign tumours.", "Distant spread"],
      ["Clinical effect", "Pressure, bleeding, loss of organ function, weight loss.", "The signs in the animal"]
    ]
  },
  {
    id: "virchow", subj: "path", title: "Virchow's triad of thrombosis", layout: "list", cols: 3,
    note: "Thrombosis happens when one or more of the three factors act.",
    nodes: [
      ["Endothelial injury", "The most important factor. Damaged vessel lining exposes collagen.", "Damage to the vessel lining"],
      ["Stasis or turbulence", "Slow or abnormal blood flow, as in heart disease.", "Slow or turbulent flow"],
      ["Hypercoagulability", "An increased tendency to clot, for example in some diseases.", "Blood clots too easily"]
    ]
  },
  {
    id: "nutrients", subj: "nutr", title: "Six classes of nutrients", layout: "list", cols: 3,
    nodes: [
      ["Water", "The most vital nutrient. Animals die sooner without water than without food.", "The most essential nutrient"],
      ["Carbohydrates", "Main energy source. Includes sugars, starch and fibre (cellulose).", "Main energy source"],
      ["Fats and oils", "Give about 2.25 times the energy of carbohydrate and supply essential fatty acids.", "Most concentrated source of energy"],
      ["Proteins", "Made of amino acids. Needed for growth, milk and eggs.", "Made of amino acids"],
      ["Minerals", "Macro minerals (calcium, phosphorus) and trace minerals (zinc, copper).", "Calcium and phosphorus"],
      ["Vitamins", "Fat-soluble (A, D, E, K) and water-soluble (B group, C).", "A, D, E, K are fat soluble"]
    ]
  },
  {
    id: "silage", subj: "nutr", title: "Making silage", layout: "snake", cols: 3,
    note: "Good silage smells pleasantly sour. A rotten or butyric smell means poor quality.",
    nodes: [
      ["Harvest at the right stage", "Maize at about the dough stage with roughly 30 to 35 percent dry matter. Grasses at early flowering.", "Cutting at the right stage"],
      ["Chop to short lengths", "Chopping helps compaction and release of sugar for fermentation.", "Cutting the crop into short pieces"],
      ["Fill and compact", "Pack well to remove air quickly.", "Remove air by packing"],
      ["Seal airtight", "Cover with plastic and weigh it down. Air spoils silage.", "Cover tightly"],
      ["Fermentation", "Lactic acid bacteria turn sugars into lactic acid. The pH drops to about 4 or less in a few weeks.", "Lactic acid lowers the pH"],
      ["Open and feed", "Feed from one face and reseal. Remove spoiled parts.", "Feeding out"]
    ]
  },
  {
    id: "ration", subj: "nutr", title: "Formulating a ration", layout: "snake", cols: 3,
    nodes: [
      ["Find the animal's requirements", "Based on species, weight, production and stage, using feeding standards.", "Needs of the animal"],
      ["Know the feed composition", "Use feed tables or laboratory analysis for dry matter, crude protein and energy.", "Nutrient content of each feed"],
      ["Choose feeds by cost and availability", "Select locally available, cheap feeds.", "Select feeds"],
      ["Balance the ration", "Use methods such as the Pearson square or trial and error to meet protein and energy.", "Pearson square is used here"],
      ["Check dry matter intake", "The ration should be palatable and within the animal's intake capacity.", "Make sure the animal can eat it"],
      ["Feed and monitor", "Watch milk yield, growth and body condition and adjust.", "Adjusting as needed"]
    ]
  },
  {
    id: "energy2", subj: "nutr", title: "Partition of feed energy", layout: "snake", cols: 3,
    note: "Each step has a loss.",
    nodes: [
      ["Gross energy (GE)", "Total heat of combustion of the feed.", "Total energy of the feed"],
      ["Digestible energy (DE)", "GE minus energy lost in the faeces.", "After faecal loss"],
      ["Metabolisable energy (ME)", "DE minus energy lost in urine and (in ruminants) methane.", "After urine and gas loss"],
      ["Net energy (NE)", "ME minus the heat increment.", "After heat increment"],
      ["Maintenance and production", "NE keeps the body going and makes milk, growth and work.", "Used for maintenance and production"]
    ]
  },
  {
    id: "triad", subj: "pubh", title: "Epidemiological triad", layout: "list", cols: 3,
    note: "Disease results from the interaction of the three.",
    nodes: [
      ["Agent", "The microbe, parasite or toxin that causes disease.", "The cause"],
      ["Host", "The animal or person. Age, species, immunity and nutrition matter.", "The affected animal"],
      ["Environment", "Climate, housing, crowding, vectors and management.", "Conditions around the animal"]
    ]
  },
  {
    id: "prevent", subj: "pubh", title: "Levels of prevention", layout: "snake", cols: 4,
    nodes: [
      ["Primordial", "Prevents risk factors from arising at all, for example good policy and sanitation.", "Prevent risk factors from arising"],
      ["Primary", "Prevents disease in healthy animals, for example vaccination.", "Vaccination"],
      ["Secondary", "Early detection and treatment, for example screening for brucellosis.", "Early detection and treatment"],
      ["Tertiary", "Limits damage and disability in animals that are already sick.", "Limits the damage of existing disease"]
    ]
  },
  {
    id: "outbreak", subj: "pubh", title: "Investigating a disease outbreak", layout: "snake", cols: 4,
    nodes: [
      ["Confirm the diagnosis", "Collect samples and confirm the disease with a laboratory.", "Confirm with laboratory tests"],
      ["Confirm the outbreak", "Is the number of cases above the usual level?", "Is it really an outbreak?"],
      ["Case definition", "Write a clear definition of a case.", "Clearly define a case"],
      ["Find cases", "Count cases, visit farms and check records.", "Search for more cases"],
      ["Describe by time, place, animal", "Draw an epidemic curve and map.", "Epidemic curve"],
      ["Form a hypothesis", "Guess the source and way of spread.", "Guess the source"],
      ["Control measures", "Isolation, movement control, vaccination, culling as needed.", "Stop the spread"],
      ["Report", "Inform the authorities and write the report.", "Notify and document"]
    ]
  },
  {
    id: "meatinsp", subj: "pubh", title: "Meat inspection sequence", layout: "snake", cols: 3,
    nodes: [
      ["Ante-mortem inspection", "Animals are inspected before slaughter at rest and in motion. Sick animals are separated.", "Before slaughter"],
      ["Slaughter and dressing", "Humane slaughter, bleeding, skinning and evisceration under hygiene.", "Slaughter"],
      ["Post-mortem inspection", "Inspect the head, viscera and carcass by looking, feeling and incising.", "After slaughter"],
      ["Judgement", "Fit for human consumption, partial condemnation, or total condemnation.", "The decision"],
      ["Stamping and disposal", "Pass the meat with a stamp and safely dispose of condemned material.", "Marking the fit meat"]
    ]
  },
  {
    id: "cellcycle", subj: "gen", title: "The cell cycle", layout: "cycle",
    note: "Mitosis keeps the chromosome number. Meiosis halves it.",
    nodes: [
      ["G1 phase", "The cell grows and makes proteins.", "Growth before DNA copying"],
      ["S phase", "DNA is replicated.", "DNA is copied"],
      ["G2 phase", "The cell prepares to divide.", "Preparation for mitosis"],
      ["Mitosis (PMAT)", "Prophase, metaphase, anaphase and telophase.", "Nuclear division"],
      ["Cytokinesis", "The cytoplasm divides into two daughter cells.", "The cytoplasm divides"]
    ]
  },
  {
    id: "meiosis", subj: "gen", title: "Meiosis", layout: "snake", cols: 3,
    note: "Gives four genetically different haploid gametes.",
    nodes: [
      ["Prophase I", "Homologous chromosomes pair and crossing over exchanges segments.", "Crossing over occurs"],
      ["Metaphase and anaphase I", "Homologous pairs line up and separate. Chromosome number is halved.", "Homologues separate"],
      ["Telophase I", "Two haploid cells result.", "Two haploid cells"],
      ["Meiosis II", "Sister chromatids separate, like mitosis.", "Sister chromatids separate"],
      ["Four haploid gametes", "Sperm or egg cells, genetically different.", "The final product"]
    ]
  },
  {
    id: "breeding", subj: "gen", title: "Breeding systems", layout: "list", cols: 3,
    nodes: [
      ["Inbreeding", "Mating of related animals. It increases homozygosity and can cause inbreeding depression.", "Mating related animals"],
      ["Line breeding", "A mild form of inbreeding to keep a good ancestor's genes.", "Mild inbreeding to keep an ancestor's genes"],
      ["Outbreeding", "Mating of unrelated animals.", "Mating unrelated animals"],
      ["Crossbreeding", "Mating of different breeds. It gives hybrid vigour (heterosis).", "Different breeds mated; heterosis"],
      ["Grading up", "Repeated use of purebred sires on local females to improve them.", "Improves local stock with purebred sires"],
      ["Selection", "Choosing the better animals as parents of the next generation.", "Choosing parents"]
    ]
  },
  {
    id: "gain", subj: "gen", title: "Genetic improvement cycle", layout: "cycle",
    nodes: [
      ["Record performance", "Milk yield, growth or egg numbers. Reliable records are the base.", "Collect data"],
      ["Estimate breeding value", "Use the records of the animal and relatives.", "Estimate genetic merit"],
      ["Select the best", "Choose animals with the best breeding values.", "Choose the best parents"],
      ["Mate the selected animals", "Use planned matings or AI.", "Plan matings"],
      ["Next generation", "The progeny show the genetic gain, which depends on heritability and selection intensity.", "New offspring"]
    ]
  },
  {
    id: "calf", subj: "lpm", title: "Calf rearing sequence", layout: "snake", cols: 3,
    nodes: [
      ["Colostrum", "As early as possible, within the first hours, and in good quantity. It gives immunity.", "First milk"],
      ["Whole milk or milk replacer", "Feed milk in measured amounts, in clean buckets.", "Main feed in the first weeks"],
      ["Introduce calf starter and good hay", "From the first weeks, so the rumen develops.", "Rumen development feed"],
      ["Deworm and vaccinate", "Follow the schedule of the area, and keep the pen dry.", "Health care"],
      ["Weaning", "When the calf eats enough starter, often at 2 to 3 months.", "Milk is withdrawn"],
      ["Grower heifer", "Good growth for breeding at the proper age and weight.", "Preparing for first breeding"]
    ]
  },
  {
    id: "broiler", subj: "lpm", title: "Broiler cycle (about 5 to 6 weeks)", layout: "snake", cols: 3,
    nodes: [
      ["Clean, disinfect, rest the shed", "All-in all-out management.", "Preparing the shed"],
      ["Chick placement and brooding", "Provide extra heat in the first weeks, around 32 to 35 degrees C and reduce it gradually.", "Warm brooding"],
      ["Vaccination", "Follow the local schedule such as Newcastle disease and infectious bursal disease.", "Disease prevention"],
      ["Growth and feeding", "Starter, grower and finisher feeds. Watch the feed conversion ratio.", "Feed changes with age"],
      ["Marketing", "Birds are sold at around 5 to 6 weeks.", "Birds are sold"],
      ["Cleaning and rest", "Clean the shed and rest before the next batch.", "Preparing for the next batch"]
    ]
  },
  {
    id: "layer", subj: "lpm", title: "Layer management phases", layout: "snake", cols: 3,
    nodes: [
      ["Brooding (0 to 8 weeks)", "Chick starter, warmth and vaccination.", "First weeks"],
      ["Growing (8 to 18 weeks)", "Control body weight. Grower ration.", "Growing pullets"],
      ["Pre-lay (about 16 to 18 weeks)", "Move to the laying house and give the pre-layer feed.", "Preparing to lay"],
      ["Laying begins (around 18 to 20 weeks)", "Layer ration with extra calcium for egg shells, and provide light.", "First eggs"],
      ["Peak production", "Production peaks a few months after the start of lay.", "Highest egg production"],
      ["Decline and culling", "Production falls with age and low producers are culled.", "Removal of poor layers"]
    ]
  },
  {
    id: "meatconv", subj: "lpt", title: "From muscle to meat", layout: "snake", cols: 4,
    nodes: [
      ["Slaughter and bleeding", "Blood supply stops. The muscle uses up oxygen.", "Blood supply stops"],
      ["Glycogen to lactic acid", "Anaerobic glycolysis makes lactic acid, so pH falls from about 7 to about 5.5.", "pH falls"],
      ["Rigor mortis", "ATP runs out and muscle becomes stiff.", "The muscle stiffens"],
      ["Ageing (conditioning)", "Enzymes soften the meat in chilled storage.", "Meat becomes tender"],
      ["Chilling", "Rapid chilling controls bacterial growth.", "Cooling"],
      ["DFD and PSE", "Stress before slaughter gives dark, firm, dry (DFD) meat. Fast pH fall at high temperature gives pale, soft, exudative (PSE) meat.", "Quality faults related to pH"]
    ]
  },
  {
    id: "butter", subj: "lpt", title: "Butter making", layout: "snake", cols: 4,
    nodes: [
      ["Cream separation", "A centrifugal separator splits milk into cream and skim milk.", "Splitting cream from milk"],
      ["Pasteurise the cream", "Heat treatment kills pathogens and enzymes.", "Heat treatment"],
      ["Cooling and ageing", "Cool to a low temperature before churning.", "Cooling the cream"],
      ["Churning", "Agitation breaks the fat globule membrane. Fat clumps together as butter grains. The liquid left is buttermilk.", "Butter grains form"],
      ["Washing", "Remove the remaining buttermilk.", "Washing the grains"],
      ["Working and salting", "Kneading forms a smooth body. Salt is added as required.", "Kneading and salting"],
      ["Packing and storage", "Pack and store in cold.", "Packaging"]
    ]
  },
  {
    id: "cheese", subj: "lpt", title: "Cheese making", layout: "snake", cols: 4,
    nodes: [
      ["Pasteurise the milk", "Remove harmful bacteria.", "Heat treatment of the milk"],
      ["Add starter and rennet", "The starter makes lactic acid. Rennet (chymosin) coagulates casein.", "Rennet is added"],
      ["Coagulum formation", "Milk sets into a gel (curd).", "Milk sets into curd"],
      ["Cutting and cooking the curd", "Cutting releases whey. Gentle heating helps shrink the curd.", "Cut to release whey"],
      ["Draining the whey", "The whey is removed and the curd is gathered.", "Separating whey"],
      ["Salting and pressing", "Salt flavours the cheese and controls microbes.", "Salting"],
      ["Ripening", "Enzymes and microbes develop flavour and texture.", "Flavour develops over time"]
    ]
  },
  {
    id: "calving", subj: "gyn", title: "Hormonal control of calving", layout: "snake", cols: 4,
    note: "Progesterone falls and oestrogen and PGF2 alpha rise before calving.",
    nodes: [
      ["Foetal hypothalamus and pituitary", "The foetus triggers the process when mature, by releasing ACTH.", "The foetus starts the process"],
      ["Foetal adrenal cortisol", "ACTH stimulates the adrenal to release cortisol.", "Cortisol is released"],
      ["Progesterone falls", "Placental enzymes convert progesterone to oestrogen.", "Progesterone block is lifted"],
      ["Oestrogen and PGF2 alpha rise", "PGF2 alpha makes the corpus luteum regress and increases uterine contractions.", "Prostaglandin rises"],
      ["Relaxin and cervical softening", "The pelvic ligaments and cervix relax.", "Softens the cervix"],
      ["Oxytocin release", "Pressure of the foetus on the cervix stimulates oxytocin (Ferguson reflex). Contractions become strong.", "Ferguson reflex"],
      ["Expulsion", "The foetus is expelled.", "Birth"]
    ]
  },
  {
    id: "stages", subj: "gyn", title: "Three stages of parturition", layout: "snake", cols: 3,
    nodes: [
      ["Stage 1: preparatory", "The cervix dilates. The cow is restless and may lift her tail. Uterine contractions begin.", "The cervix dilates and the cow is restless"],
      ["Stage 2: expulsion of the foetus", "Strong uterine and abdominal contractions. The water bag appears and the calf is delivered.", "The calf is born"],
      ["Stage 3: expulsion of the foetal membranes", "The placenta is normally passed within a few hours in the cow. If it is retained for longer than about 12 hours it is a retained placenta.", "The placenta is passed"]
    ]
  },
  {
    id: "ai", subj: "gyn", title: "Artificial insemination steps", layout: "snake", cols: 3,
    nodes: [
      ["Semen collection", "From a bull, with an artificial vagina or electro-ejaculator.", "Collecting semen"],
      ["Semen evaluation", "Check volume, motility, concentration and morphology.", "Checking quality"],
      ["Dilution (extension)", "Add an extender to get many doses.", "Making more doses"],
      ["Freezing and storage", "Frozen in straws and stored in liquid nitrogen at minus 196 degrees C.", "Storage in liquid nitrogen"],
      ["Thawing", "Thaw straws in warm water, about 35 to 37 degrees C, just before use.", "Warm water before use"],
      ["Insemination", "Deposit semen in the body of the uterus, or the cervix, at the right time in heat.", "Deposit in the uterus or cervix"]
    ]
  },
  {
    id: "dystocia", subj: "gyn", title: "Approach to dystocia", layout: "snake", cols: 3,
    note: "Always use clean gloves and lubricant. Call for help early.",
    nodes: [
      ["History and examination", "Time since labour started, and check the cow and the calf.", "First assessment"],
      ["Find the cause", "Maternal (e.g. small pelvis, uterine inertia) or foetal (e.g. size, malposture).", "Maternal or foetal cause"],
      ["Correction", "Repel the calf, rotate or correct posture, and lubricate.", "Correct the posture"],
      ["Traction", "Gentle traction, in time with straining, using obstetric chains or ropes.", "Pulling gently"],
      ["Caesarean section", "If correction fails or the calf is too large.", "If correction fails"],
      ["Care of dam and newborn", "Check for tears and retained membranes, give colostrum and antibiotics as needed.", "Aftercare"]
    ]
  },
  {
    id: "anaes", subj: "surg", title: "Anaesthesia: step by step", layout: "snake", cols: 4,
    nodes: [
      ["Pre-anaesthetic evaluation", "History, clinical examination and blood tests as needed. Assign an anaesthetic risk grade.", "Check the patient first"],
      ["Fasting", "Withhold food, as advised for the species, to reduce vomiting and regurgitation.", "Withhold food"],
      ["Premedication", "Sedatives and analgesics reduce anxiety and the dose of induction drug. Atropine may be used to reduce secretions.", "Given before induction"],
      ["Induction", "A rapid-acting drug is given, then the airway is secured with an endotracheal tube.", "Putting the animal to sleep"],
      ["Maintenance", "Inhalation (isoflurane) or injectable agents keep the animal at the required depth.", "Keeping the animal anaesthetised"],
      ["Monitoring", "Heart rate, respiration, mucous membrane colour, temperature and reflexes throughout.", "Watching vital signs"],
      ["Recovery", "Keep warm and watch until the animal can stand. Provide analgesia.", "Waking up safely"]
    ]
  },
  {
    id: "asepsis", subj: "surg", title: "Preparing for aseptic surgery", layout: "snake", cols: 3,
    nodes: [
      ["Sterilise instruments", "Autoclave at about 121 degrees C and 15 psi for 15 to 30 minutes, or use other approved methods.", "Autoclaving"],
      ["Surgeon scrub and gowning", "Scrub hands and arms, then wear gown, cap, mask and sterile gloves.", "Preparing the surgical team"],
      ["Patient site preparation", "Clip the hair, scrub and apply antiseptic from the centre outwards.", "Scrub from the centre outward"],
      ["Draping", "Sterile drapes isolate the surgical field.", "Isolating the field"],
      ["Aseptic technique during surgery", "Do not touch non-sterile objects. Handle tissue gently.", "Keeping the field sterile"],
      ["Post-operative care", "Keep the wound clean, prevent self-trauma and give analgesia.", "Looking after the wound"]
    ]
  },
  {
    id: "fracture", subj: "surg", title: "Stages of fracture healing", layout: "snake", cols: 4,
    note: "Rigid fixation and good blood supply speed up healing.",
    nodes: [
      ["Haematoma", "Bleeding at the fracture site forms a blood clot, and inflammation starts.", "A clot forms at the break"],
      ["Soft callus", "Granulation tissue and cartilage bridge the gap.", "Cartilage and fibrous tissue bridge the break"],
      ["Hard callus", "Woven bone replaces the cartilage and the fracture becomes stable.", "Woven bone forms"],
      ["Remodelling", "Bone is reshaped over months to the original structure.", "Bone returns to its original shape"]
    ]
  },
  {
    id: "wounds", subj: "surg", title: "Types of wounds", layout: "list", cols: 3,
    nodes: [
      ["Incised wound", "A clean cut with a sharp edge, such as a surgical wound. It bleeds freely.", "Clean cut with a sharp edge"],
      ["Lacerated wound", "Torn skin with irregular edges, caused by barbed wire or bites.", "Torn skin with irregular edges"],
      ["Contused wound", "Bruising from blunt trauma.", "Blunt trauma"],
      ["Punctured wound", "Narrow, deep wound, such as from a nail or a thorn. High risk of infection, including tetanus.", "Narrow and deep"],
      ["Abrasion", "Superficial skin loss from friction.", "Superficial skin loss"]
    ]
  },
  {
    id: "ketosis", subj: "med", title: "Ketosis in dairy cows", layout: "snake", cols: 3,
    nodes: [
      ["Negative energy balance", "Early lactation: energy demand is greater than intake.", "Energy use above intake"],
      ["Fat mobilisation", "Body fat is broken down.", "Fat is broken down"],
      ["Ketone bodies rise", "The liver makes ketones that spill into blood, milk and urine.", "Ketones appear in milk and urine"],
      ["Clinical signs", "Reduced appetite and milk, weight loss, and a sweet acetone smell on the breath. Some have nervous signs.", "Sweet breath smell"],
      ["Diagnosis", "Ketones in urine or milk by test strips, and in blood (BHB).", "Test strips"],
      ["Treatment", "Intravenous dextrose, propylene glycol by mouth, and better feeding.", "Glucose precursors"]
    ]
  },
  {
    id: "mastitis", subj: "med", title: "Mastitis in cows", layout: "snake", cols: 3,
    note: "Good milking hygiene and post-milking teat dips reduce mastitis.",
    nodes: [
      ["Bacteria reach the teat end", "From dirty bedding, hands or milking machine.", "Entry route"],
      ["Enter the teat canal", "Usually when the teat sphincter is open or damaged.", "Through the streak canal"],
      ["Infect the udder", "Bacteria multiply in the mammary gland.", "Bacteria multiply"],
      ["Inflammation", "Swelling, heat and pain, and milk changes such as clots and flakes (clinical mastitis).", "Clots and flakes in milk"],
      ["Subclinical mastitis", "No visible change. Detected by the California Mastitis Test (CMT) or somatic cell count.", "Found by CMT"],
      ["Treatment and control", "Treat as advised, observe the withdrawal period, and use teat dips and dry cow therapy.", "Teat dip and dry cow therapy"]
    ]
  },
  {
    id: "fmd", subj: "med", title: "Foot-and-mouth disease (FMD)", layout: "snake", cols: 3,
    note: "A highly contagious viral disease of cloven-hoofed animals. Vaccination is the main control in India.",
    nodes: [
      ["Virus exposure", "Spread by direct contact, aerosol, contaminated feed and vehicles.", "How it spreads"],
      ["Fever and dullness", "Rise in temperature and a drop in milk yield.", "First signs"],
      ["Vesicles", "Blisters on the tongue, lips, gums, teats and between the hooves.", "Blisters in the mouth and feet"],
      ["Rupture and erosion", "Blisters burst and leave painful erosions, with drooling and lameness.", "Drooling and lameness"],
      ["Complications", "Secondary infection, mastitis and death of young calves from heart damage.", "Calf mortality"],
      ["Control", "Regular vaccination, movement control and reporting to authorities.", "Vaccination"]
    ]
  },
  {
    id: "rabies", subj: "med", title: "Rabies pathogenesis", layout: "snake", cols: 3,
    note: "Rabies is nearly always fatal once signs appear. Vaccinate dogs and wash bite wounds thoroughly.",
    nodes: [
      ["Bite by a rabid animal", "The virus is in the saliva.", "Entry"],
      ["Local replication", "The virus multiplies in muscle near the wound.", "Stays at the wound first"],
      ["Spread along nerves", "Travels up peripheral nerves to the spinal cord and brain. The incubation period varies.", "Travels along the nerves"],
      ["Brain infection", "Encephalitis. Negri bodies may be seen in neurons.", "Negri bodies"],
      ["Spread to salivary glands", "The virus is shed in saliva.", "Infectious saliva"],
      ["Clinical signs", "Furious form (aggression) or dumb form (paralysis), then death.", "Furious or dumb form"]
    ]
  },
  {
    id: "comm", subj: "ext", title: "The communication process", layout: "cycle",
    note: "Berlo's model: Source, Message, Channel, Receiver (SMCR).",
    nodes: [
      ["Source", "The extension worker or vet who sends the message.", "The sender"],
      ["Message", "The content, in simple language and clear to the farmer.", "The content"],
      ["Channel", "The route: talk, demonstration, leaflet, radio, mobile phone.", "How the message travels"],
      ["Receiver", "The farmer who gets the message.", "The farmer who receives it"],
      ["Feedback", "The farmer's response tells the source whether the message was understood.", "The response that closes the loop"]
    ]
  },
  {
    id: "methods", subj: "ext", title: "Extension teaching methods", layout: "list", cols: 3,
    nodes: [
      ["Individual methods", "Farm and home visits, office calls and letters. Best for personal problems, but costly per farmer.", "Farm visit"],
      ["Group methods", "Method and result demonstrations, group meetings, training camps and field days. Good for skills.", "Demonstrations and training"],
      ["Mass methods", "Radio, television, newspapers, posters, exhibitions and mobile phone messages. Reach many people quickly.", "Radio, TV and mobile messages"]
    ]
  },
  {
    id: "progplan", subj: "ext", title: "Extension programme planning cycle", layout: "cycle",
    nodes: [
      ["Situation analysis", "Collect facts on the farmers, resources and the area.", "Study the area first"],
      ["Identify problems and needs", "Involve the farmers and rank the problems.", "Find the needs"],
      ["Set objectives", "Objectives should be specific and measurable.", "Define what you want to achieve"],
      ["Plan activities", "Methods, timing, resources and responsibility.", "Plan the work"],
      ["Implement", "Carry out the plan with the community.", "Do the work"],
      ["Evaluate", "Check results and use the findings in the next cycle.", "Review the results"]
    ]
  },
  {
    id: "tot", subj: "ext", title: "Transfer of technology: lab to land", layout: "snake", cols: 3,
    nodes: [
      ["Research institute", "Develops new technology, such as a vaccine or breed.", "Creates the technology"],
      ["Testing in the field", "On-farm trials and frontline demonstrations check that it works locally.", "Field trials"],
      ["Extension agencies", "Department staff, KVKs and others train field workers.", "Pass the technology on"],
      ["Farmer training and demonstration", "Show and teach the farmers how to use it.", "Teach the farmer"],
      ["Adoption", "Farmers use the technology.", "Farmers use it"],
      ["Feedback to research", "Farmer problems return to scientists, who refine the technology.", "Closes the loop"]
    ]
  },
  {
    id: "firstaid", subj: "clin", title: "First aid sequence for an injured animal", layout: "snake", cols: 3,
    note: "Protect yourself too. Injured animals may bite or kick.",
    nodes: [
      ["Safety and restraint", "Make the scene safe and restrain the animal gently, using a muzzle if needed.", "Keep safe"],
      ["Airway", "Make sure the airway is open.", "A"],
      ["Breathing", "Check breathing, and give oxygen if available.", "B"],
      ["Circulation and bleeding", "Check pulse and mucous membranes. Press on a bleeding wound with a clean pad.", "C"],
      ["Protect the wound and immobilise", "Cover wounds and splint suspected fractures.", "Cover and splint"],
      ["Transport to a clinic", "Move carefully and report what has been done.", "Move to a clinic"]
    ]
  },
  {
    id: "rx", subj: "clin", title: "Parts of a prescription", layout: "snake", cols: 3,
    note: "Write legibly and name the drug and dose clearly.",
    nodes: [
      ["Heading", "The vet's name, registration number, clinic address, and date.", "Vet and clinic details"],
      ["Patient details", "Owner name, animal species, age, sex and weight.", "Who is being treated"],
      ["Superscription (Rx)", "The symbol Rx, meaning take.", "The Rx symbol"],
      ["Inscription", "The drug name, strength and dose.", "Drug name and dose"],
      ["Subscription", "Directions to the pharmacist: dosage form and quantity.", "Directions for the pharmacist"],
      ["Signa", "Directions for the owner: how often, how long, and how to give.", "Directions for the owner"]
    ]
  },
  {
    id: "tubes", subj: "clin", title: "Blood collection tubes (common colours)", layout: "list", cols: 3,
    note: "Colours can vary by supplier. Check the label of your tubes.",
    nodes: [
      ["Purple (EDTA)", "Whole blood for haematology (CBC) and blood smears.", "Complete blood count"],
      ["Green (heparin)", "Plasma for some biochemistry tests.", "Heparin"],
      ["Red or yellow (clot activator)", "Serum for biochemistry and serology.", "Serum"],
      ["Grey (fluoride oxalate)", "Glucose and lactate measurement, since fluoride stops glycolysis.", "Glucose"],
      ["Blue (sodium citrate)", "Coagulation tests (PT, aPTT). Must be filled to the line.", "Coagulation tests"]
    ]
  },
  {
    id: "milking", subj: "farm", title: "Hygienic milking routine", layout: "snake", cols: 4,
    nodes: [
      ["Wash hands and clean the udder", "Wash with clean warm water and dry the teats.", "Hygiene first"],
      ["Pre-dip the teats", "Use a germicidal dip and wait the contact time.", "Teat dip before milking"],
      ["Fore-strip", "Draw a few squirts into a strip cup to see clots or flakes (mastitis).", "Check the first milk"],
      ["Wipe dry", "Dry each teat with its own clean towel.", "Dry the teats"],
      ["Milk quickly and fully", "Complete milking in about 5 to 8 minutes, using full hand or machine milking.", "Milking"],
      ["Post-milking teat dip", "Protects the teat while the canal is open.", "Dip after milking"],
      ["Feed so the cow stays standing", "Cows should stand for a while after milking.", "Keeps the teat canal closed"]
    ]
  },
  {
    id: "hatch", subj: "farm", title: "Hatchery process (chicken, about 21 days)", layout: "snake", cols: 3,
    nodes: [
      ["Egg collection and selection", "Collect often. Reject cracked or dirty eggs.", "Choose good hatching eggs"],
      ["Fumigation and storage", "Clean the eggs and store them in a cool place for no more than about a week.", "Short storage"],
      ["Setting in the incubator", "Temperature about 37.5 degrees C, with suitable humidity and turning.", "Incubator"],
      ["Candling", "Remove infertile and dead embryos by checking with a light.", "Check with light"],
      ["Transfer to hatcher", "Around day 18, with turning stopped.", "Moved to the hatcher"],
      ["Hatch, grade and vaccinate", "Chicks hatch around day 21 and are graded and given Marek's disease vaccine.", "Day-old chick handling"]
    ]
  },
  {
    id: "integrated", subj: "farm", title: "Integrated farming loop", layout: "cycle",
    note: "Waste from one part becomes input for another.",
    nodes: [
      ["Crops and fodder", "Grow food and fodder. Crop residues feed the animals.", "Plants for people and animals"],
      ["Livestock", "Provide milk, meat, eggs and draught power.", "Animals on the farm"],
      ["Dung and waste", "Collected daily.", "Manure"],
      ["Biogas or compost", "A biogas plant gives cooking gas and slurry. Composting also gives manure.", "Energy and fertiliser"],
      ["Manure back to the fields", "Improves soil and reduces fertiliser cost.", "Closes the loop"]
    ]
  }
];