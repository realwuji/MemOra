// Essay plan specs, part 1: rational choice, the economic problem, demand and
// supply, elasticity, consumption, investment, multiplier, trade, GDP and
// unemployment. Keys are question numbers (src/data/plan-questions.js).
// Chains are read from the notes (see plan-refs.mjs); only the judgement and
// the column labels are written here.
import { D, E, S } from './plan-refs.mjs'

const RDM = 'Rational Decision Making'
const EM = 'Economic Methodology'
const CSI = 'Consumption, Savings and Investment'
const CAD = 'Components of Aggregate Demand'
const CIR = 'The Circular Flow'
const DEM = 'Demand'
const SUP = 'Supply and Elasticity of Supply'
const PED = 'Price, Income and Cross Elasticities'
const AS = 'Aggregate Supply'
const EG = 'Economic Growth'
const EMP = 'Employment and Unemployment'
const EXR = 'Exchange Rates'
const IC = 'International Competitiveness'
const FIG = 'Factors Influencing Growth'
const SSP = 'Supply-Side Policy'
const PGI = 'Public Goods and Information Gaps'
const BOP = 'The Balance of Payments'

export const SPECS_1 = {
  0: {
    cols: ['Rational: people pursue their own satisfaction', 'Not rational: norms, biases and altruism'],
    left: [S(RDM, 'objectives of the three economic agents', { t: 'Consumers aim to maximise utility' })],
    right: [D(RDM, 'Social norms, habit and inertia', { t: 'Tipping as a social norm' }), D(RDM, 'Loss aversion, altruism and biases', { t: 'Altruism and biases' })],
    judge: 'A one-off tip brings no material gain, so on a narrow self-interest view it is hard to call rational. The notes show people also act on social norms and altruism, so if satisfaction counts what others think and the pleasure of giving, tipping is rational in the broad sense.',
  },
  1: {
    cols: ['How the health care market shows the economic problem', ''],
    left: [S(EM, 'basic economic problem', { t: 'Scarcity forces choice' }), D(EM, 'opportunity cost matters', { t: 'Every choice has an opportunity cost' })],
    right: [],
  },
  2: {
    cols: ['Effects on the allocation of resources', 'Limits to the effect'],
    left: [D(EM, 'opportunity cost matters', { t: 'The resources used had other uses' }), D(SSP, 'Education and training', { t: 'Education raises the quantity and quality of labour' })],
    right: [E(SSP, 'Education and training', { t: 'Why education may not raise output' })],
    judge: 'A student who drops out wastes the resources spent on the place, which had an opportunity cost, and the economy gains less skilled labour. The effect is small unless drop-out is common and the missing skills are ones the economy needs.',
  },
  3: {
    cols: ['Two reasons consumers do not switch', 'Evaluation'],
    left: [D(RDM, 'Social norms, habit and inertia', { t: 'Inertia and habit' }), D(RDM, 'Bounded rationality and bounded self-control', { t: 'Limited information and attention' })],
    right: [E(RDM, 'Social norms, habit and inertia', { t: 'Why inertia may not explain it all' })],
    judge: 'Inertia and limited information (bounded rationality) together explain why consumers stay with a supplier when cheaper offers exist; the notes add that nudges can counter this.',
  },
  4: {
    cols: ['Rational for the fishing company', 'Irrational for society'],
    left: [S(RDM, 'objectives of the three economic agents', { t: 'Firms aim to maximise profit' })],
    right: [S('Externalities', 'Negative production externality', { t: 'The external cost the firm ignores' }), E('Business Objectives', 'Consequences', { t: 'Why profit maximising may not be the aim' })],
    judge: 'For each company, fishing as much as possible is rational because it ignores the external cost to others; for society the result is over-fishing. It is rational privately but not socially, which is the case for intervention.',
  },
  5: {
    cols: ['It is irrational', 'It is rational'],
    left: [D(RDM, 'Bounded rationality and bounded self-control', { t: 'Buying a bag without weighing the cost' }), D(RDM, 'Social norms, habit and inertia', { t: 'Habit' })],
    right: [S(RDM, 'objectives of the three economic agents', { t: 'A rational consumer weighs cost against convenience' }), D(RDM, 'Rules of thumb (heuristics)', { t: 'Rules of thumb save time' })],
    judge: 'Buying a bag is rational if the convenience is worth the price; it is irrational only if the shopper forgets or ignores the cost, which habit and limited attention make likely.',
  },
  6: {
    cols: ['Reasons customers do not switch', 'Evaluation'],
    left: [D(RDM, 'Social norms, habit and inertia', { t: 'Inertia and habit' }), D(RDM, 'Bounded rationality and bounded self-control', { t: 'Bounded rationality' }), D(RDM, 'Rules of thumb', { t: 'Rules of thumb' })],
    right: [E(RDM, 'Bounded rationality and bounded self-control', { t: 'Why this may not explain it' })],
    judge: 'The strongest reason is inertia: the saving may be small relative to the effort. The notes show behavioural reasons, not ignorance alone, explain why many stay with a provider.',
  },
  7: {
    cols: ['Rational behaviour', 'Not rational behaviour'],
    left: [S(RDM, 'objectives of the three economic agents', { t: 'Subscribers maximise utility' })],
    right: [D(RDM, 'Social norms, habit and inertia', { t: 'Inertia keeps subscriptions running' }), D(RDM, 'Loss aversion, altruism and biases', { t: 'Biases and loss aversion' })],
    judge: 'Subscribers act rationally when they weigh the benefit against the monthly price, but habit and inertia mean many keep paying for a service they rarely use, which is not rational.',
  },
  8: {
    cols: ['Likely effects of higher house prices', 'Limits'],
    left: [D(CSI, 'Wealth effects', { t: 'Wealth effect on consumption' }), D(CAD, 'Wealth', { t: 'Higher wealth raises AD' })],
    right: [E(CSI, 'Wealth effects', { t: 'Why consumption may not rise' }), D(CSI, 'Interest rates', { t: 'Interest rates and borrowing' })],
    judge: 'Higher house prices raise wealth and confidence, so consumption and AD rise, but the effect depends on whether owners spend the gain and on interest rates; it also helps owners more than renters.',
  },
  9: {
    cols: ['Two influences on household consumption', ''],
    left: [D(CAD, 'Real disposable income', { t: 'Real disposable income' }), D(CAD, 'Interest rates', { t: 'Interest rates' })],
    right: [],
  },
  10: {
    cols: ['Likely effects of an increase in consumption', 'Limits'],
    left: [D(CAD, 'Consumer confidence', { t: 'Confidence raises spending today' }), D(CIR, 'What makes the multiplier large', { t: 'What makes the multiplier large', d: [182] })],
    right: [E(CIR, 'Why the multiplier may be smaller', { t: 'Why the effect may be smaller' }), E(CSI, 'Interest rates', { t: 'Interest rates may limit it' })],
    judge: 'More consumption raises AD, output and jobs, and the multiplier amplifies it, but if spending is on imports or the economy has no spare capacity, the gain is smaller and prices rise.',
  },
  11: {
    cols: ['A factor that influences saving', ''],
    left: [D(CAD, 'Interest rates (on saving)', { t: 'The interest rate on saving' })],
    right: [],
  },
  12: {
    cols: ['Likely effects of higher real wages', 'Limits'],
    left: [D(CAD, 'Real disposable income', { t: 'Higher real income raises consumption' }), D(CIR, 'What makes the multiplier large', { t: 'What makes the multiplier large', d: [182] })],
    right: [E(CIR, 'Why the multiplier may be smaller', { t: 'Why the effect may be smaller' }), D(AS, 'Wage rates', { t: 'Higher wages raise firms\' costs' })],
    judge: 'Higher real wages raise incomes and consumption, but if they exceed productivity growth they raise firms\' costs and shift SRAS left; the gain depends on whether pay rises are matched by productivity.',
  },
  13: {
    cols: ['Two influences on investment', ''],
    left: [D(CSI, 'The determinants of investment', { t: 'The determinants of investment' }), D(CAD, 'Business confidence', { t: 'Business confidence and animal spirits' })],
    right: [],
  },
  14: {
    cols: ['Reasons the price is rising', 'Limits'],
    left: [D(SUP, 'Costs of production', { t: 'Supply falls: higher costs of production', d: [21] }), D(DEM, 'Population and demographics', { t: 'Demand rises: population and demographics', d: [19] })],
    right: [D(PED, 'Nature of the product', { t: 'Inelastic demand lets the price rise further' }), D(PED, 'Availability of close substitutes', { t: 'Substitutes limit the rise' })],
    judge: 'Prices rise when demand shifts right or supply shifts left. Higher costs of supply are the likelier cause, and how far the price rises depends on how inelastic demand is.',
  },
  15: {
    cols: ['Likely causes of an increase in net exports', 'Limits'],
    left: [D(CAD, 'The exchange rate', { t: 'A lower exchange rate' }), D(CAD, 'Real income abroad and at home', { t: 'Higher incomes abroad' }), D(CAD, 'Non-price competitiveness and protectionism', { t: 'Non-price competitiveness' })],
    right: [E(CAD, 'The exchange rate', { t: 'Why a lower exchange rate may not raise net exports' })],
  },
  16: {
    cols: ['Reasons treatment prices are rising', 'Limits'],
    left: [D(SUP, 'Costs of production', { t: 'Supply falls: costs of staff, equipment and energy rise', d: [21] }), D(DEM, 'Population and demographics', { t: 'Demand rises: an ageing population', d: [19] }), D(PGI, 'Information gaps', { t: 'Asymmetric information: patients rely on the provider' })],
    right: [D(PED, 'Nature of the product', { t: 'Demand for health care is inelastic' }), D(PED, 'Availability of close substitutes', { t: 'Substitutes (the NHS) limit price rises' })],
    judge: 'Price rises come from rising costs and rising demand. Demand is inelastic because treatment is a necessity, so providers can pass costs on, although the NHS as a substitute limits how far.',
  },
  18: {
    cols: ['Reasons the market price of streaming is rising', 'Limits'],
    left: [D(SUP, 'Costs of production', { t: 'Supply falls: the cost of making and licensing content rises', d: [21] }), D(DEM, 'Advertising and tastes', { t: 'Demand rises: advertising and tastes', d: [19] })],
    right: [S('Oligopoly', 'Characteristics', { t: 'A few large firms with price-setting power' }), D(PED, 'Availability of close substitutes', { t: 'Close substitutes limit how far the price can rise' })],
    judge: 'Rising content costs and strong demand explain the rise, and a market with a few large providers gives them the power to pass it on; substitutes and the fear of losing subscribers limit it.',
  },
  19: {
    cols: ['Two factors that influenced demand for rail travel', ''],
    left: [D(DEM, 'Income', { t: 'Income' }), D(DEM, 'Related goods - substitutes and complements', { t: 'Related goods: car travel, flights and complements' })],
    right: [],
  },
  20: {
    cols: ['Why demand for such goods rises when incomes fall behind prices', 'Limits'],
    left: [S(PED, 'Income elasticity: types of good', { t: 'Inferior goods: demand rises as real income falls' }), D(DEM, 'Related goods - substitutes and complements', { t: 'Consumers switch to cheaper substitutes' })],
    right: [E(DEM, 'Related goods - substitutes and complements', { t: 'Why switching may not happen' })],
  },
  21: {
    cols: ['Two factors that change the international price of coffee beans', ''],
    left: [D(SUP, 'Weather, shocks and expectations', { t: 'Weather and shocks to supply', d: [21] }), D(DEM, 'Income', { t: 'Rising incomes raise demand', d: [19] })],
    right: [],
  },
  22: {
    cols: ['How a change in the value of exports affects growth', 'Limits'],
    left: [D(CAD, 'The exchange rate', { t: 'The exchange rate and net exports' }), D(CIR, 'What makes the multiplier large', { t: 'What makes the multiplier large', d: [182] })],
    right: [E(CAD, 'The exchange rate', { t: 'Why exports may not rise' }), E(CAD, 'Real income abroad and at home', { t: 'Why higher incomes abroad may not help' })],
    judge: 'Higher export revenue raises AD and growth, magnified by the multiplier, but the effect depends on how responsive exports are to the exchange rate and on demand abroad, and a weaker pound also raises import costs.',
  },
  23: {
    cols: ['How a rise in the value of exports affects the economy', 'Limits'],
    left: [D(CAD, 'Real income abroad and at home', { t: 'Higher incomes abroad raise export demand' }), D(CIR, 'What makes the multiplier large', { t: 'What makes the multiplier large', d: [182] })],
    right: [E(CAD, 'Real income abroad and at home', { t: 'Why higher incomes abroad may not help' }), E(CAD, 'The exchange rate', { t: 'Why a lower exchange rate may not raise exports' })],
    judge: 'A rise in exports raises AD, output and employment and improves the current account. The gain is larger with spare capacity and a high multiplier, and smaller if exporters rely on imported inputs.',
  },
  24: {
    cols: ['Influences on net trade', 'Limits'],
    left: [D(CAD, 'The exchange rate', { t: 'The exchange rate' }), D(IC, 'Productivity and unit labour costs', { t: 'Productivity and unit labour costs' }), D(CAD, 'Real income abroad and at home', { t: 'Income at home and abroad' })],
    right: [S(BOP, 'The Marshall-Lerner condition', { t: 'The Marshall-Lerner condition' }), D(IC, 'Non-price factors', { t: 'Non-price competitiveness matters more than price' }), E(CAD, 'The exchange rate', { t: 'Why the exchange rate may not decide it' })],
    judge: 'The exchange rate gets most attention, but over time productivity and non-price competitiveness decide whether exports can compete. A weaker pound helps only if the Marshall-Lerner condition holds and takes time to work.',
  },
  25: {
    cols: ['How depreciation could raise future growth', 'Why growth may not rise'],
    left: [S(EXR, 'Effects of a depreciation', { t: 'Exports become cheaper and imports dearer' }), D(CAD, 'The exchange rate', { t: 'Net exports raise AD' })],
    right: [S(BOP, 'The J-curve effect', { t: 'The J-curve: the balance may worsen first' }), D(AS, 'Exchange rates', { t: 'Imported inputs cost more: SRAS shifts left' })],
    judge: 'A lower pound helps growth through net exports, but only after the J-curve delay and if exports respond; dearer imported inputs raise costs and inflation, so the net effect on future growth is modest unless productivity also improves.',
  },
  26: {
    cols: ['How a fall in the pound affects AD', 'Limits'],
    left: [S(EXR, 'Effects of a depreciation', { t: 'Effects of a depreciation' }), D(CAD, 'The exchange rate', { t: 'Net exports raise AD' })],
    right: [E(CAD, 'The exchange rate', { t: 'Why AD may not rise much' })],
  },
  27: {
    cols: ['Factors influencing AD in Ghana', 'Limits'],
    left: [D(CAD, 'Real disposable income', { t: 'Real disposable income' }), D(CAD, 'Interest rates', { t: 'Interest rates', at: 1 }), D(CAD, 'Business confidence', { t: 'Business confidence' })],
    right: [D(CAD, 'Real income abroad and at home', { t: 'Income abroad drives net exports' }), E(CAD, 'Interest rates', { t: 'Why interest rates may not matter much' })],
    judge: 'Consumption is the largest part of AD, so real income matters most; exports and investment depend on world demand, confidence and access to credit.',
  },
  28: {
    cols: ['Two causes of high transport costs between African countries', ''],
    left: [D(FIG, 'Infrastructure', { t: 'Poor infrastructure' }), D(SSP, 'Infrastructure', { t: 'Low investment in transport links' })],
    right: [],
  },
  29: {
    cols: ['Effects of dearer gas on the firm', 'What the firm can do about it'],
    left: [D(AS, 'Costs of raw materials and energy', { t: 'Costs of production rise' })],
    right: [S(PED, 'PED decides who bears a rise in costs', { t: 'Can the firm pass the cost on?' })],
    judge: 'Dearer gas raises costs and cuts profit. How much depends on whether the firm can pass the rise on, which the notes show depends on the price elasticity of demand for its product.',
  },
  30: {
    cols: ['Why demand may be elastic', 'Why demand may be inelastic'],
    left: [D(PED, 'Availability of close substitutes', { t: 'Many substitutes for a festival' }), D(PED, 'Proportion of income spent on the good', { t: 'A large share of income' })],
    right: [D(PED, 'Nature of the product', { t: 'A unique event with loyal fans' }), D(PED, 'Time', { t: 'Time to switch' })],
    judge: 'For most festivals demand is elastic because there are many alternatives and the ticket is a large share of income; for a unique line-up with loyal fans it may be less elastic.',
  },
  31: {
    cols: ['Two reasons PED for electricity changes over time', ''],
    left: [D(PED, 'Time', { t: 'Time: demand is more elastic in the long run' }), D(PED, 'Availability of close substitutes', { t: 'Substitutes appear: solar, heat pumps' })],
    right: [],
  },
  32: {
    cols: ['Why a PED of -0.5 matters to universities', ''],
    left: [S(PED, 'Why PED is useful', { t: 'Inelastic demand: raising fees raises revenue' })],
    right: [],
  },
  33: {
    cols: ['Why YED is useful to a business', ''],
    left: [S(PED, 'Why YED is useful', { t: 'Why YED is useful' })],
    right: [],
  },
  34: {
    cols: ['Are they substitutes?', 'Limits'],
    left: [S(PED, 'Cross elasticity: strength of the relation', { t: 'Positive cross elasticity means substitutes' }), D(PED, 'Why XED matters', { t: 'Why XED matters' })],
    right: [D(PED, 'The extent of substitutability', { t: 'How close are the substitutes?' })],
    judge: 'If a rise in the price of one holiday raises demand for the other, they are substitutes; the size of the cross elasticity shows how close, and unique features of each destination weaken it.',
  },
  35: {
    cols: ['Two factors that decrease the multiplier', ''],
    left: [D(CIR, 'Why the multiplier may be smaller than calculated', { t: 'Why the multiplier may be smaller than calculated' })],
    right: [],
  },
  36: {
    cols: ['Is demand price inelastic and income elastic?', 'Limits'],
    left: [D(PED, 'Availability of close substitutes', { t: 'Substitutes make demand price elastic' }), S(PED, 'Income elasticity: types of good', { t: 'Income elasticity: types of good' })],
    right: [D(PED, 'Nature of the product', { t: 'A convenience good may be inelastic' })],
    judge: 'Delivered food has many substitutes (cooking at home, eating out), so demand is probably price elastic, and as a convenience good demand rises with income, making it income elastic.',
  },
  37: {
    cols: ['Two factors that raise the multiplier', ''],
    left: [D(CIR, 'What makes the multiplier large', { t: 'What makes the multiplier large' })],
    right: [],
  },
  38: {
    cols: ['Why PES is useful to Sainsbury\'s', ''],
    left: [D(SUP, 'Spare capacity', { t: 'Spare capacity' }), D(SUP, 'Ability to store stock', { t: 'Ability to store stock' })],
    right: [],
  },
  39: {
    cols: ['Is the supply of uranium price elastic?', 'Limits'],
    left: [D(SUP, 'Time period', { t: 'Time period' }), D(SUP, 'Barriers to entry', { t: 'Barriers to entry' })],
    right: [D(SUP, 'Spare capacity', { t: 'Spare capacity' }), D(SUP, 'Factor mobility and substitutability', { t: 'Factor mobility' })],
    judge: 'Supply of uranium is likely inelastic in the short run because mines take years to open and the barriers to entry are high; it is more elastic over a longer period.',
  },
  40: {
    cols: ['Why productivity is measured this way', ''],
    left: [S(EG, 'GNI per capita (PPP)', { t: 'PPP lets comparisons between countries be fair' }), S(SSP, 'productivity puzzle', { t: 'The productivity puzzle' })],
    right: [],
  },
  41: {
    cols: ['Limitations of GDP for comparing living standards', 'Why GDP is still useful'],
    left: [S(EG, 'GNI per capita (PPP)', { t: 'Differences in prices: PPP' }), S(EG, 'Why recorded GDP understates output', { t: 'Unrecorded output' }), D(EG, 'Does a rise in real GDP always mean higher living standards', { t: 'Real GDP does not always mean higher living standards' })],
    right: [S('Measures and Strategies for Development', 'Measuring development', { t: 'Better measures exist: the HDI' }), E(EG, 'Does a rise in real GDP always mean higher living standards', { t: 'The case for GDP' })],
    judge: 'GDP per head is a useful starting point but misses unrecorded output, distribution, the environment and quality of life, so comparing the UK with a developing country needs PPP and measures such as the HDI.',
  },
  42: {
    cols: ['Limitations of GDP over time', 'Why GDP is still useful'],
    left: [D(EG, 'Does a rise in real GDP always mean higher living standards', { t: 'Real GDP does not always mean higher living standards' }), S(EG, 'Why recorded GDP understates output', { t: 'Unrecorded output' })],
    right: [E(EG, 'Does a rise in real GDP always mean higher living standards', { t: 'The case for GDP' })],
    judge: 'Over time, GDP ignores changes in quality, hours worked, the environment and the distribution of income, but it remains the best single measure of output.',
  },
  43: {
    cols: ['Likely benefits of population growth', ''],
    left: [D(FIG, 'Demographic factors', { t: 'Demographic factors' }), D('Causes and Effects of Economic Growth', 'Causes of potential growth', { t: 'More labour raises potential output' })],
    right: [],
  },
  44: {
    cols: ['GDP as a measure of living standards', 'Why it may not be effective'],
    left: [S(EG, 'Measuring growth', { t: 'What GDP measures' })],
    right: [D(EG, 'Does a rise in real GDP always mean higher living standards', { t: 'Real GDP does not always mean higher living standards' }), D(EG, 'The Easterlin paradox', { t: 'The Easterlin paradox: more income, not more happiness' }), S(EG, 'Why recorded GDP understates output', { t: 'Unrecorded output' })],
    judge: 'GDP per head is the most used measure and rises with income and employment, but it is an incomplete guide to living standards: it omits distribution, unpaid work and well-being, so it should be read alongside other measures.',
  },
  45: {
    cols: ['Benefits of specialising in fishing', 'Risks'],
    left: [D(EM, 'Specialisation', { t: 'Specialisation raises output and efficiency' })],
    right: [E(EM, 'Specialisation', { t: 'Why specialisation may not help' }), D(FIG, 'Primary product dependency', { t: 'Dependence on one primary product' }), S('Terms of Trade', 'The Prebisch-Singer hypothesis', { t: 'Prebisch-Singer: falling terms of trade' })],
    judge: 'Specialising in fishing can raise output through comparative advantage, but dependence on one primary product exposes an economy to price swings and the over-fishing of a resource that can run out.',
  },
  46: {
    cols: ['How a fall in real incomes affects happiness', 'Limits'],
    left: [D(EG, 'The Easterlin paradox', { t: 'The Easterlin paradox' })],
    right: [D(EG, 'Does a rise in real GDP always mean higher living standards', { t: 'Real GDP and living standards' })],
    judge: 'A fall in real income is likely to reduce happiness for people near subsistence, but the Easterlin paradox suggests that above a basic level changes in income have less effect than relative income, so the effect depends on where people start.',
  },
  47: {
    cols: ['How a rise in real income affects happiness', 'Limits'],
    left: [D(EG, 'The Easterlin paradox', { t: 'The Easterlin paradox' })],
    right: [D(EG, 'Does a rise in real GDP always mean higher living standards', { t: 'Real GDP and living standards' })],
    judge: 'In a rich country like the UK, the Easterlin paradox suggests that higher real income raises happiness only a little once basic needs are met, because people compare themselves with others.',
  },
  48: {
    cols: ['Benefits of Dubai specialising in oil', 'Risks'],
    left: [D(EM, 'Specialisation', { t: 'Specialisation raises output and efficiency' })],
    right: [E(EM, 'Specialisation', { t: 'Why specialisation may not help' }), D(FIG, 'Primary product dependency', { t: 'Dependence on one primary product' })],
    judge: 'Specialising in oil brings large export revenue, but dependence on one commodity makes the economy exposed to falls in its price and to the resource running out, so diversification reduces the risk.',
  },
  49: {
    cols: ['Why the claimant count and the ILO measure differ', ''],
    left: [S(EMP, 'Measuring unemployment', { t: 'Measuring unemployment' })],
    right: [],
  },
  50: {
    cols: ['How a recession raises unemployment', 'Limits'],
    left: [D(EMP, 'Cyclical (demand-deficient) unemployment', { t: 'Cyclical unemployment', d: [184] })],
    right: [E(EMP, 'Cyclical (demand-deficient) unemployment', { t: 'Why unemployment may not rise' }), D(EMP, 'Real wage inflexibility', { t: 'Wage rigidity makes it worse' })],
    judge: 'A recession cuts AD and the demand for labour, so unemployment normally rises, by more where real wages are inflexible; the rise may be smaller where firms hold on to workers or people leave the labour force.',
  },
}
