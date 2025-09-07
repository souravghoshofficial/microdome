import { useEffect, useState } from "react";
import axios from "axios";
import { BuyNowCard, CourseSyllabus } from "../components";
import { loadRazorpayScript } from "../utils/razorpay";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";

const syllabus = {
  semester_i : 
[
{
"subject": "Introduction to the World of Microbes",
"topics": [
"Introduction, History and Scope of Microbiology: Concepts of microbes, their distribution, dimension. History and scope as a modern science. Branches of microbiology. Scientist contributions: Antony Von Leewenhoek, Edward Jenner, Spallanzani, Pasteur, Lister, Koch, Fleming, Iwanovsky. Theories of origin of life.",
"Cell Organization: Cell size, shape, arrangements, capsule, flagella, pili, detailed structure of cell envelopes, membranes, ribosomes, inclusions, nucleoid, plasma membrane, cell wall, extracellular matrix, mitochondria, chloroplasts, peroxisomes, and cytoskeleton.",
"Stains and Staining Techniques: Nature of dyes, principles, physical and chemical staining, simple, differential (Gram, Acid-fast), and structural staining for cell wall, endospore, flagella, capsule.",
"Microbial Nutrition and Culture Techniques: Nutritional requirements, types (autotrophs, heterotrophs, phototrophs, chemotrophs), physical factors affecting growth, types and components of media, isolation and cultivation methods, maintenance and stocking, cultivation of anaerobes.",
"Bacterial Growth: Concepts of microbial growth, measurement, batch and continuous culture, growth kinetics, growth curve, phases, diauxic growth, viable and total counts, turbidimetric estimation.",
"Sterilization and Aseptic Techniques: Definitions, evaluation methods, physical methods (moist/dry heat, filtration, radiation), chemical agents and their practical application, selection criteria."
],
},
{
"subject": "Food Fermentation Techniques",
"topics": [
  "Fermented Foods- Definition, types, advantages and health benefits.",
  "Milk Based Fermented Foods- Dahi, Yogurt, Buttermilk (Chhach) and cheese: Preparation of inoculums, types of microorganisms and production process.",
  "Grain Based Fermented Foods- Soy sauce, Bread, Idli and Dosa: Microorganisms and production process.",
  "Vegetable Based Fermented Foods- Pickels, Saeurkraut: Microorganisms and production process Fermented.",
  "Meat and Fis Types, microorganisms involved, fermentation process.",
  "Probiotic Foods- Definition, types, microorganisms and health benefits."
],
},
],

semester_ii : 
[
{
"subject": "Microbial Society: Diversity and Systematics",
"topics": [
"Microbial Systematics: Classification, nomenclature, species concepts, types of taxonomies, molecular and polyphasic taxonomy, chemotaxonomy.",
"Phylogeny of Prokaryotes: Diversity of Monera, Protista, Whittaker's system, domains, RNA world, endosymbiogenesis.",
"Accounts of Prokaryons: Thermophiles, methanogens, halophiles, cyanobacteria, Gram-positive/negative eubacteria, proteobacteria, spirochetes, actinomycetes.",
"Phycology: Algae classification and characteristics, applications in agriculture, industry, food, and the environment.",
"Eukaryotic Microbes: Fungi (major classes), protozoa (Giardia, Entamoeba, Plasmodium).",
"Virology: Discovery, morphology, classification, bacteriophage structure and life cycles (lytic, lysogenic), viroids, prions."
],
},
{
"subject": "Biosafety and Intellectual Property Rights",
"topics": [
"Biosafety: Introduction, safety cabinets, primary containment, biosafety levels and guidelines, GMOs/LMOs, environmental release, role of regulatory bodies (IBSC, RCGM, GEAC).",
"Intellectual Property Rights: Patents, trademarks, copyrights, industrial designs, traditional knowledge, geographical indications, types of patents, patentable matters, international treaties, patent filing procedure, licensing, infringement."
],
},
],

semester_iii : 
[
{
"subject": "Microbes and Environment",
"topics": [
"Microbial Habitats: Ecosystem structure/function, soil, water, air, microflora of humans and animals, extremophiles.",
"Biogeochemical Cycles: Microbial roles in carbon, nitrogen, phosphorus, sulfur, iron cycles.",
"Waste Management: Solid/liquid waste treatment, BOD, COD, treatment methods, nutrient cycling.",
"Microbial Bioremediation: Pesticide degradation, hydrocarbon degradation, biosurfactants.",
"Water Potability: Water treatment, potable water testing, MPN test, membrane filter, presence/absence tests."
],
},
{
"subject": "Microbes in Sustainable Agriculture and Development",
"topics": [
"Mineralization in Soil: Cellulose, hemicellulose, lignin, humus, phosphate, nitrate, silica, potassium.",
"Microbial Activity and Greenhouse Gases: Roles in CO2, methane, nitrous oxide etc.",
"Microbial Control: Biocontrol agents, mechanisms against pathogens, insects, weeds.",
"Biofertilization/Phytostimulation/Bioinsecticides: Types, combinations, PGPR, symbiotic/nonsymbiotic, phosphate solubilizers, PGPR, novel biofertilizers.",
"Secondary Agricultural Biotech: Biotech feed, silage, biomanure, biogas, biofuels, advantages and processing."
],
},
],
semester_iv : 
[
  {
    "subject": "Microbiology in Daily Life: Food and Industry",
    "topics": [
      "Factors governing microbial growth in foods; sources and types of food contamination",
      "Spoilage of vegetables, fruits, meat, eggs, milk, butter, bread, canned foods; food-borne intoxication and infections: botulism, aflatoxicosis, ergotism, cholera, salmonellosis",
      "Principles and methods of food preservation: physical (temperature, canning, drying, irradiation, etc.), chemical (salt, sugar, SO2, nitrites, antibiotics, bacteriocins, etc.), aseptic packaging",
      "Fermented foods: starter cultures, production of yogurt, acidophilus milk, dahi, cheese, dosa, sauerkraut, soy sauce; probiotics (health benefits, microorganisms used, market examples)",
      "Industrial microbiology: history, sources of industrial microbes, isolation, preservation, strain improvement",
      "Fermentation: solid vs. liquid, batch, fed-batch, continuous; bioreactors, measurement & control of fermentation parameters (pH, temperature, oxygen, foaming, aeration)",
      "Down-stream processing: cell disruption, filtration, centrifugation, solvent extraction, precipitation, lyophilization, spray drying",
      "Microbial production of industrial products: citric acid, ethanol, penicillin, vitamin B12, amylase, wine, beer, biopolymers, biomining, and bioleaching of ores"
    ],
  },
  {
    "subject": "Microbial Ecology and Agricultural Microbiology",
    "topics": [
      "Basic concepts: microbial ecology vs. macroecology, ecosystems, habitat and niche, populations, food chains, microbial communities and succession, r and k strategies, extreme environments, community resistance/resilience",
      "Microbial interactions: symbiosis, mutualism, commensalism, competition, amensalism, synergism, parasitism, predation (mathematical model)",
      "Quantitative ecology: diversity indices, sampling, culturability, total/viable counts, molecular analysis, metagenomics, measurement of metabolism (stable isotope probing)",
      "Plant-microbe interaction: beneficial and harmful microbes, rhizosphere/rhizoplane, phyllosphere/phylloplane",
      "Plant-pathogen interaction: entry, disease development (enzyme/toxin/hormone), resistance, important crop diseases, control methods",
      "Microbes and crop productivity: biofertilizers, plant growth promoting rhizobacteria, mycorrhiza, crop protection"
    ],
  },
],
semester_v : 
[
  {
    "subject": "Fundamental of Life Process: Water and Biomolecules",
    "topics": [
      "Structure/properties of water, phase diagram, ionic product, buffers, acids/bases (Arrhenius, Bronsted, Lewis theory), Henderson-Hasselbalch equation, biological relevance",
      "Carbohydrates: classification/properties, monosaccharides (isomerism, derivatives), disaccharides, reducing/non-reducing sugars, polysaccharides (storage, structural)",
      "Lipids: fatty acid types, structures, classification (triglycerides, phospholipids, sphingolipids etc.), functions, micelles, monolayers/bilayers, membrane structure, steroids/waxes",
      "Proteins: amino acid structure/properties, titration, structural levels, peptide unit, Ramachandran plot, hemoglobin structure",
      "Vitamins and enzymes: classification, characteristics, examples, enzyme structure (apoenzyme, cofactors, prosthetic group, coenzyme), mechanisms (lock and key, induced fit), enzyme kinetics (Michaelis-Menten, Km, allosteric), activity, inhibition"
    ],
  },
  {
    "subject": "Microbial Genetics",
    "topics": [
      "Genes/mutations: DNA/RNA structure, DNA topology, organization; mutation types/mechanisms, mutagens, mutants, reversion, suppression, Ames test, mutator genes",
      "Plasmids: types (F, R, col, Ti, linear, yeast), replication, partitioning, incompatibility, amplification, curing, host range, regulation",
      "Genetic exchange: transformation, conjugation (Hfr, F’), interrupted mating/time-of-entry/mapping, transduction (generalized, specialized, LFT/HFT), recombination/cotransduction",
      "Phage genetics: T4 features, lambda lytic/lysogenic switch",
      "Transposable elements: prokaryotic (insertion sequences, transposons), eukaryotic (yeast Ty, Drosophila P, maize Ac/Ds), uses of transposons"
    ],
  },
],
semester_vi:
[
  {
    "subject": "Immunology: Host Defense Versus Pathogen",
    "topics": [
      "Basics of innate and adaptive immunity; contributors to immunology",
      "Immune cells/organs: structure, functions (B, T, NK, macrophage, dendritic, stem cells; bone marrow, thymus, lymph node, spleen)",
      "Antigens: characteristics, T-dependent/independent types, epitopes, adjuvants, haptens, carrier",
      "Antibodies: types, structure, function, monoclonal antibody production/uses",
      "Major histocompatibility complex: organization, structure & function (MHC I/II)",
      "Complement system: components, activation pathways, biological consequences",
      "Immune response & hypersensitivity: generation of humoral/cell-mediated response, hypersensitivity types, ADCC",
      "Immunization: active/passive characteristics, functions",
      "Immunological techniques: precipitation, agglutination, immunodiffusion, immunoelectrophoresis, ELISA, ELISPOT, western blotting, immunofluorescence/electron microscopy"
    ],
  },
  {
    "subject": "Public Health and Medical Microbiology",
    "topics": [
      "Normal microflora (skin, respiratory, gastrointestinal, urogenital), host-pathogen interaction concepts (infection, invasion, pathogenicity, virulence, toxin types, carriers), epidemiology (epidemic, endemic, pandemic), disease cycle, herd immunity",
      "Bacterial diseases: symptoms, transmission, prevention (tuberculosis, typhoid, cholera, tetanus, syphilis)",
      "Viral diseases: symptoms, transmission, prevention (AIDS, dengue, chikungunya, Japanese encephalitis)",
      "Protozoan diseases: symptoms, transmission, prevention (malaria, kala-azar)",
      "Fungal diseases: cutaneous, systemic, opportunistic (candidiasis), transmission, prevention",
      "Antimicrobial agents: characteristics, mode of action (antibiotics from bacteria, actinomycetes, fungi), drug classes, mechanism, assays, resistance"
    ],
  },
  {
    "subject": "Molecular Biology",
    "topics": [
      "Nucleic acid structure (DNA, RNA), types, denaturation/renaturation, DNA topology, organization in prokaryotes, viruses, eukaryotes, organelle DNA",
      "DNA replication (prokaryotes/eukaryotes), models: bidirectional, unidirectional, rolling circle, theta, D-loop, enzymes, accessory proteins, repair",
      "Transcription (prokaryotes/eukaryotes), promoters, RNA polymerase, transcriptional units, factors",
      "Post-transcriptional processing: splicing, introns/exons, polyadenylation, capping, rRNA processing, RNA interference",
      "Translation (prokaryotes/eukaryotes): machinery, tRNA charging, initiation, elongation, termination, fidelity, inhibitors",
      "Gene regulation: prokaryotic/eukaryotic transcriptional regulation (lac/trp), chromatin structure, yeast mating type switching, Bacillus sporulation, DNA/histone modifications"
    ],
  },
],
};

const courseFeatures = [
  "Live interactive classes led by top educators.",
  "Unlimited access to recorded lectures after each live session.",
  "Dedicated doubt-clearing sessions and personalized mentoring.",
  "Detailed, well-structured notes provided for every topic.",
  "Practice with previous year questions and full-length mock tests.",
];

const ApiUrl = import.meta.env.VITE_BACKEND_URL;


const SemesterCourseLayout = () => {
  const { id } = useParams();
  const courses = useSelector((state) => state.courses.courses)
  const navigate = useNavigate();
  const semester = id.replace(/-/g, "_");

  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    const course = courses.find(c => c.linkAddress === id);
  if (course) {
    setCourseDetails(course);
  } else {
    setCourseDetails(null)
  }
    // axios
    //   .post(
    //     `${ApiUrl}/courses/get-course-details`,
    //     { linkAddress: id },
    //     { withCredentials: true }
    //   )
    //   .then((res) => {
    //     setCourseDetails(res.data.courseDetails);
    //   })
    //   .catch(() => {
    //     console.log("Error fetching course details");
    //   });
  }, [id, courses]);

  const isEnrolled = userData?.enrolledCourses.includes(courseDetails?._id);

  const handleEnrollClick = () => {
    if (!isLoggedIn) {
      toast.warn("Login to enroll");
      return;
    }
    if (isEnrolled) {
      navigate(`/my-courses/${courseDetails?._id}`);
      return;
    }
    // Redirect to Checkout page
    navigate(`/checkout/${id}`);
  };

    if(!courseDetails){
    return(
      <div className="w-full h-screen flex items-center justify-center">
        <p>No Course Found</p>
      </div>
    )
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mt-8 w-full lg:w-[92%] flex flex-col-reverse lg:flex-row justify-center lg:gap-10 lg:px-12 lg:py-6 mb-16">
        <ToastContainer />
        <div className="w-[90%] mx-auto lg:w-[60%] z-20 mt-16">
          <h3 className="mt-2 leading-10 text-2xl md:text-3xl font-bold">
            {courseDetails?.courseTitle}
          </h3>
          <h5 className="mt-2 w-[95%] text-[17px]">
            {courseDetails?.courseDescription}
          </h5>
          <div className="w-full mt-4">
            <CourseSyllabus syllabus={syllabus[semester]} />
          </div>
        </div>

        <div className="mt-16 lg:sticky h-fit top-32 w-[90%] mx-auto md:w-[50%] lg:w-[36%] z-20">
          <BuyNowCard
            courseFeatures={courseFeatures}
            actualPrice={courseDetails?.actualPrice}
            discountedPrice={courseDetails?.discountedPrice}
            imageUrl={courseDetails?.courseImage}
            handlePayment={handleEnrollClick} // now navigates to checkout
            isEnrolled={isEnrolled}
            mode={courseDetails?.mode.toUpperCase()}
          />
        </div>
      </div>
    </div>
  );
};

export default SemesterCourseLayout;