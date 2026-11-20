// Essay plan specs, part 2: externalities, government intervention, inflation,
// monetary and fiscal policy, public goods and the free market (questions 51
// to 110). Chains are read from the notes (see plan-refs.mjs).
import { D, E, S } from './plan-refs.mjs'

const EXT = 'Externalities'
const PGI = 'Public Goods and Information Gaps'
const GIM = 'Government Intervention in Markets'
const GF = 'Government Failure'
const GIE = 'Government Intervention and Equity'
const ES = 'Economic Systems'
const PDM = 'Price Determination'
const INF = 'Inflation'
const MP = 'Monetary Policy'
const FP = 'Fiscal Policy'
const PET = 'Public Expenditure and Taxation'
const ND = 'The National Debt'
const MO = 'Macroeconomic Objectives'
const MPGC = 'Macroeconomic Policies in a Global Context'
const SSP = 'Supply-Side Policy'
const EMP = 'Employment and Unemployment'
const CIR = 'The Circular Flow'
const CAD = 'Components of Aggregate Demand'
const OG = 'Output Gaps and the Trade Cycle'
const LMI = 'Labour Market Issues'
const WD = 'Wage Determination'
const PED = 'Price, Income and Cross Elasticities'
const CEG = 'Causes and Effects of Economic Growth'

// Cards used again and again in the intervention questions.
const tax = (t) => D(GIM, 'Indirect tax', { t, d: [68] })
const taxLimits = E(GIM, 'Indirect tax', { t: 'Why a tax may not work' })
const permits = D(GIM, 'Tradable permits', { t: 'Tradable pollution permits' })
const permitsLimits = E(GIM, 'Tradable permits', { t: 'Why permits may not work' })
const regulation = (t) => D(GIM, 'Regulation', { t })
const regulationLimits = E(GIM, 'Regulation', { t: 'Why regulation may not work' })
const info = D(GIM, 'Information provision', { t: 'Information provision' })
const infoLimits = E(GIM, 'Information provision', { t: 'Why information may not change behaviour' })
const subsidy = D(GIM, 'Subsidy', { t: 'A subsidy', d: [58] })
const subsidyLimits = E(GIM, 'Subsidy', { t: 'Why a subsidy may not work' })
const unintended = D(GF, 'Unintended consequences', { t: 'Unintended consequences' })
const enforcement = D(GF, 'Administrative and enforcement costs', { t: 'Administrative and enforcement costs' })
const govInfo = D(GF, 'Information failure in government', { t: 'The government lacks the information to set it right' })
const negExt = (t) => S(EXT, 'Negative production externality', { t })
const costs = S(EXT, 'Private and external effects in the four c', { t: 'Private and external costs and benefits' })

export const SPECS_2 = {
  51: {
    cols: ['Policies to reduce youth unemployment', 'Limits of each policy'],
    left: [D(SSP, 'Young people not in education, employment or training', { t: 'Young people not in education, employment or training' }), D(SSP, 'Education and training', { t: 'Education and training' }), D(SSP, 'Tax and benefit reform', { t: 'Tax and benefit reform' })],
    right: [E(SSP, 'Young people not in education, employment or training', { t: 'Why NEET policies may not work' }), E(SSP, 'Education and training', { t: 'Why training may not work' }), D(EMP, 'Structural unemployment', { t: 'Structural unemployment takes time to fix' })],
    judge: 'Youth unemployment is largely structural (skills and experience), so education, training and help into work are the main policies, but they are slow and costly. Demand-side policy helps when the cause is cyclical.',
  },
  52: {
    cols: ['The external costs of over-fishing', 'Why they are hard to judge'],
    left: [negExt('External costs of over-fishing'), costs],
    right: [S(EXT, 'Where the cost-benefit curves come from', { t: 'Valuing the external cost is difficult' }), D(PGI, 'The free rider problem', { t: 'Why no one will protect the stock' })],
    judge: 'Over-fishing imposes external costs on other fishers and future generations through falling stocks and lost income, which the market ignores. They are real but hard to value, so the social cost curve is an estimate.',
  },
  53: {
    cols: ['Two external benefits of public service broadcasting', ''],
    left: [S(EXT, 'Positive consumption externality', { t: 'External benefits of consumption' }), D(PGI, 'Merit goods - under-consumed', { t: 'A merit good' })],
    right: [],
  },
  54: {
    cols: ['Private and external costs of producing plastic', 'Limits'],
    left: [negExt('The external costs of plastic production'), costs],
    right: [S(EXT, 'Where the cost-benefit curves come from', { t: 'Valuing external costs is difficult' }), D(EXT, 'Government intervention to correct externalities', { t: 'Correcting the externality' })],
    judge: 'Private costs are the firm\'s own costs of materials, labour and energy; external costs are the pollution and waste borne by others. The gap between them is the reason for intervention, though external costs are hard to value.',
  },
  55: {
    cols: ['Private and external costs of power station construction', 'Limits'],
    left: [negExt('The external costs of power station construction'), costs],
    right: [S(EXT, 'Where the cost-benefit curves come from', { t: 'Valuing external costs is difficult' }), govInfo],
    judge: 'A power station has large private costs for the firm and external costs for others, such as pollution and disruption, so building it only when private benefits exceed private costs overlooks the social cost.',
  },
  56: {
    cols: ['How reducing emissions moves the market towards the social optimum', 'Limits'],
    left: [negExt('Emissions are an external cost'), D(EXT, 'Government intervention to correct externalities', { t: 'Internalising the externality' })],
    right: [E(EXT, 'Government intervention to correct externalities', { t: 'Why a voluntary cut may not reach the optimum' })],
  },
  57: {
    cols: ['Private and external benefits', 'Limits'],
    left: [S(EXT, 'Positive consumption externality', { t: 'Positive consumption externality' }), D(PGI, 'Merit goods - under-consumed', { t: 'Merit goods are under-consumed' })],
    right: [E(PGI, 'Merit goods - under-consumed', { t: 'Why the benefits may be smaller than assumed' })],
    judge: 'The viewer gains private benefits; others gain from a better-informed society, which the market does not count, so educational content is under-consumed without support.',
  },
  58: {
    cols: ['Under-provided: external benefits are ignored', 'Over-provided: external costs are ignored'],
    left: [S(EXT, 'The other two cases', { t: 'Positive production externalities' })],
    right: [negExt('Negative production externalities'), costs],
    judge: 'Nuclear power has a clear external cost in the risk of accident and waste, and an external benefit in low-carbon energy. Which outweighs which is hard to measure, and the government may lack the information to say.',
  },
  59: {
    cols: ['Likely impact of a recession', 'Limits'],
    left: [D(EMP, 'Cyclical (demand-deficient) unemployment', { t: 'Unemployment rises', d: [184] }), S(OG, 'The trade cycle', { t: 'The trade cycle' }), D(FP, 'Automatic stabilisers', { t: 'Automatic stabilisers' })],
    right: [S(OG, 'Evaluating how much output gaps matter', { t: 'How much do output gaps matter?' })],
    judge: 'A recession cuts output, raises unemployment and cuts tax revenue, widening the deficit, but its impact depends on its depth and on the policy response; automatic stabilisers soften it.',
  },
  61: {
    cols: ['How asymmetric information leads to market failure in health', ''],
    left: [D(PGI, 'Information gaps', { t: 'Information gaps' }), S(PGI, 'Two named consequences', { t: 'Two named consequences' })],
    right: [],
  },
  62: {
    cols: ['How the tax could work', 'Why it may not work'],
    left: [tax('An indirect tax on packaging'), S(GIM, 'Taxation: purposes, types and analysis', { t: 'Taxation: purposes, types and analysis' })],
    right: [taxLimits, S(PED, 'Why PED is useful', { t: 'PED decides how much consumption falls' }), unintended, enforcement],
    judge: 'A tax raises the price and cuts use of plastic packaging, raises revenue, and makes the producer pay the external cost. How far it works depends on how elastic demand is and whether substitutes exist, and it may be regressive.',
  },
  63: {
    cols: ['Advantages of an indirect tax on disposable cups', 'Limits'],
    left: [tax('A tax raises the price of cups')],
    right: [taxLimits],
  },
  64: {
    cols: ['How a tax on sugar could work', 'Why it may not work'],
    left: [tax('An indirect tax on sugary drinks and food'), S(GIM, 'Taxation: purposes, types and analysis', { t: 'Taxation: purposes, types and analysis' })],
    right: [taxLimits, S(PED, 'Why PED is useful', { t: 'Inelastic demand limits the fall in consumption' }), unintended],
    judge: 'A sugar tax raises prices, cuts consumption and raises revenue, but the fall is small if demand is inelastic and the tax is regressive. It works best alongside information and reformulation.',
  },
  65: {
    cols: ['How regulating profits affects consumers and suppliers', 'Limits'],
    left: [regulation('Regulation of a natural monopoly'), S(GIE, 'Regulating natural monopoly', { t: 'Regulating natural monopoly' })],
    right: [regulationLimits, D(GF, 'Regulatory capture and political incentives', { t: 'Regulatory capture' })],
    judge: 'Capping profit protects consumers from high prices, but if it is too tight suppliers have less incentive to invest and the regulator risks being captured or lacking information.',
  },
  66: {
    cols: ['Measures to increase competition', 'Limits'],
    left: [S(GIE, 'Promoting competition beyond merger contro', { t: 'Promoting competition' }), D('Contestability', 'Barriers to entry that reduce contestability', { t: 'Barriers to entry' })],
    right: [E(GIE, 'Does competition policy work?', { t: 'Does competition policy work?' })],
    judge: 'Lowering barriers to entry and promoting competition can cut prices, but in a market with high fixed costs and a network, new entrants may not appear, so competition alone may not be enough.',
  },
  67: {
    cols: ['Why the CPI basket is updated', ''],
    left: [S(INF, 'Problems with measuring inflation', { t: 'Problems with measuring inflation' })],
    right: [],
  },
  68: {
    cols: ['How CPI is measured', ''],
    left: [S(INF, 'Measuring inflation: CPI', { t: 'How CPI is measured' })],
    right: [],
  },
  69: {
    cols: ['Two reasons for the rise in inflation', ''],
    left: [D(INF, 'Demand-pull inflation', { t: 'Demand-pull inflation', d: [182] }), D(INF, 'Cost-push inflation', { t: 'Cost-push inflation', d: [185] })],
    right: [],
  },
  70: {
    cols: ['Factors the MPC considers', 'Limits'],
    left: [S(MP, 'Inflation targets: symmetric against asymmetric', { t: 'The inflation target' }), D(MP, 'The interest rate channels', { t: 'How rates transmit to AD' })],
    right: [S(OG, 'Why the output gap is hard to measure', { t: 'The output gap is hard to measure' }), E(MP, 'The interest rate channels', { t: 'Time lags and limits' })],
    judge: 'The MPC weighs inflation against its target first, then the output gap, wage growth and the state of the labour market; each is measured with error, so decisions rely on forecasts.',
  },
  71: {
    cols: ['How interest rates control inflation', 'Why they may not work'],
    left: [D(MP, 'The interest rate channels', { t: 'The interest rate channels' }), S(MP, 'The transmission mechanism', { t: 'The transmission mechanism' })],
    right: [E(MP, 'The interest rate channels', { t: 'Why transmission may be slow and weak' }), D(INF, 'Cost-push inflation', { t: 'Rates cannot fix cost-push inflation' }), S(MP, 'More on evaluating monetary policy', { t: 'More on evaluating monetary policy' })],
    judge: 'Raising rates cuts AD and so demand-pull inflation, but it is slow, blunt and does nothing for cost-push inflation from energy or import prices. It is effective against demand-pull inflation and weak against supply shocks.',
  },
  72: {
    cols: ['Two reasons for the rise in inflation', 'Evaluation'],
    left: [D(INF, 'Demand-pull inflation', { t: 'Demand-pull inflation', d: [182] }), D(INF, 'Cost-push inflation', { t: 'Cost-push inflation', d: [185] })],
    right: [S(INF, 'The causes of inflation in 2022', { t: 'The causes of inflation in 2022' })],
  },
  73: {
    cols: ['How high inflation affects the objectives', 'Limits'],
    left: [S(INF, 'Costs of inflation', { t: 'Costs of inflation' }), D(MO, 'Growth vs inflation', { t: 'Growth against inflation' }), D(MO, 'Unemployment vs inflation', { t: 'Unemployment against inflation' })],
    right: [S(INF, 'Evaluating: how serious is the inflation?', { t: 'How serious is the inflation?' }), S(INF, 'Benefits of a low, stable rate', { t: 'Benefits of a low, stable rate' })],
    judge: 'High inflation harms growth, saving and competitiveness and can make policy objectives conflict, but how serious it is depends on how high, how stable and how well it is anticipated.',
  },
  74: {
    cols: ['Effects of high inflation on consumers and workers', 'Limits'],
    left: [S(INF, 'Costs of inflation', { t: 'Costs of inflation' })],
    right: [S(INF, 'Evaluating: how serious is the inflation?', { t: 'How serious is the inflation?' })],
    judge: 'High inflation cuts the real value of savings and incomes unless pay keeps up, so fixed-income households and savers lose most; workers with bargaining power are protected.',
  },
  75: {
    cols: ['Impact of inflation on the UK economy', 'Limits'],
    left: [S(INF, 'Costs of inflation', { t: 'Costs of inflation' }), D(MO, 'Growth vs inflation', { t: 'Growth against inflation' })],
    right: [S(INF, 'Evaluating: how serious is the inflation?', { t: 'How serious is the inflation?' }), S(INF, 'More on the benefits of a little inflation', { t: 'The benefits of a little inflation' })],
    judge: 'Inflation harms the UK economy when it is high and unpredictable, by eroding savings and competitiveness; a low stable rate is beneficial, so the impact depends on the rate.',
  },
  76: {
    cols: ['Methods to increase tax revenue', 'Limits'],
    left: [S(FP, 'Types of taxation', { t: 'Types of taxation' }), D(FP, 'The Laffer curve', { t: 'The Laffer curve', d: [209] }), D(PET, 'Direct against indirect taxation', { t: 'Direct against indirect taxation' })],
    right: [E(FP, 'The Laffer curve', { t: 'Why higher rates may not raise revenue' }), E(PET, 'Direct against indirect taxation', { t: 'Why indirect taxes can be regressive' })],
    judge: 'Raising rates or widening the base raises revenue, but beyond a point higher rates reduce effort and increase avoidance, so revenue may fall, and indirect taxes fall hardest on the poor.',
  },
  77: {
    cols: ['How a freeze in income tax thresholds affects AD', 'Limits'],
    left: [D(CAD, 'Real disposable income', { t: 'Lower real disposable income' }), D(FP, 'Discretionary fiscal policy', { t: 'Discretionary fiscal policy' })],
    right: [E(CAD, 'Real disposable income', { t: 'Why consumption may fall by less' })],
  },
  78: {
    cols: ['Policies to reduce the impact of higher energy prices', 'Limits'],
    left: [D(GIM, 'Maximum price (price ceiling)', { t: 'A maximum price', d: [49] }), subsidy, regulation('Regulation of energy suppliers')],
    right: [E(GIM, 'Maximum price (price ceiling)', { t: 'Why a price cap may create a shortage' }), subsidyLimits, unintended],
    judge: 'Price caps and subsidies protect households quickly but cost money, weaken the signal to use less energy and can cause shortages. Longer-term policy that raises supply is more lasting.',
  },
  79: {
    cols: ['Effects of an increase in the national minimum wage', 'Limits'],
    left: [S(LMI, 'The national minimum wage', { t: 'The national minimum wage' }), D(WD, 'The minimum wage under monopsony', { t: 'The minimum wage under monopsony' })],
    right: [E(WD, 'The minimum wage under monopsony', { t: 'Why it may raise unemployment' })],
  },
  80: {
    cols: ['Micro effects of a maximum price for energy', 'Limits'],
    left: [D(GIM, 'Maximum price (price ceiling)', { t: 'A maximum price', d: [49] })],
    right: [E(GIM, 'Maximum price (price ceiling)', { t: 'Why a price cap may create a shortage' }), S(GF, 'A worked example: maximum rents', { t: 'A worked example: maximum rents' }), unintended],
    judge: 'A maximum price below the market price lowers the price consumers pay but creates excess demand and a shortage, reducing supply and the incentive to invest, so those who get energy gain and others lose.',
  },
  81: {
    cols: ['Ways to reduce carbon emissions', 'Limits'],
    left: [tax('A carbon tax'), permits, regulation('Regulation and standards'), subsidy],
    right: [taxLimits, permitsLimits, regulationLimits, unintended],
    judge: 'A tax and tradable permits work through the price mechanism and raise revenue; regulation sets a clear limit but is costly to enforce. The best policy combines them, since each has a weakness.',
  },
  82: {
    cols: ['Ways to reduce excess demand for health care', 'Limits'],
    left: [D(GIM, 'State provision', { t: 'State provision' }), subsidy, info],
    right: [E(GIM, 'State provision', { t: 'Why state provision may not reduce waiting' }), enforcement, govInfo],
    judge: 'Because care is free at the point of use demand exceeds supply, so options are to raise supply, ration by price or reduce demand through information; each has costs, and the government lacks the information to find the best.',
  },
  83: {
    cols: ['How intervention can correct failure in education', 'Limits'],
    left: [D(PGI, 'Merit goods - under-consumed', { t: 'Education as a merit good' }), D(GIM, 'State provision', { t: 'State provision' }), subsidy, info],
    right: [E(PGI, 'Merit goods - under-consumed', { t: 'Why education may still be under-consumed' }), E(GIM, 'State provision', { t: 'Why state provision may not work' }), govInfo],
    judge: 'Education is a merit good with external benefits and information gaps, so intervention can raise consumption, but the government can fail through cost, poor information and misdirected spending.',
  },
  84: {
    cols: ['Policy options for over-fishing', 'Limits'],
    left: [permits, regulation('Quotas and regulation'), tax('A tax on catches'), subsidy],
    right: [permitsLimits, regulationLimits, enforcement],
    judge: 'Tradable permits and quotas cap the catch directly; a tax uses the price mechanism. All depend on monitoring boats at sea, which is costly, so enforcement decides success.',
  },
  85: {
    cols: ['Methods to reduce the environmental damage of TV consumption', 'Limits'],
    left: [tax('A tax on energy use'), regulation('Regulation and standards'), info],
    right: [taxLimits, regulationLimits, infoLimits],
    judge: 'Taxes and standards on energy use can cut damage, and information can change habits, but viewers have inelastic demand and effects are small, so the benefit depends on how large the external cost really is.',
  },
  86: {
    cols: ['Ways to reduce the market failure from plastic waste', 'Limits'],
    left: [tax('A tax on plastic'), regulation('A ban or standards'), info],
    right: [taxLimits, regulationLimits, infoLimits, unintended],
    judge: 'A tax makes producers and users bear the cost; regulation and bans are blunt but certain. Information alone is weak. The best mix depends on elasticity and on how easily substitutes can be used.',
  },
  87: {
    cols: ['Ways to protect consumers in utilities', 'Limits'],
    left: [S(GIE, 'Regulating natural monopoly', { t: 'Regulating natural monopoly' }), regulation('Regulation of prices and standards'), info],
    right: [regulationLimits, D(GF, 'Regulatory capture and political incentives', { t: 'Regulatory capture' })],
    judge: 'Price regulation and information protect consumers where firms have market power, but the regulator needs good information and can be captured by the industry it regulates.',
  },
  88: {
    cols: ['Policies to reduce single-use plastic bags', 'Likely success'],
    left: [tax('A charge on bags'), regulation('A ban'), info],
    right: [taxLimits, regulationLimits],
    judge: 'A charge works well where demand is elastic and substitutes exist, as with carrier bags; a ban is certain but harder to enforce; success depends on enforcement and culture.',
  },
  89: {
    cols: ['Ways to control household energy bills', 'Limits'],
    left: [D(GIM, 'Maximum price (price ceiling)', { t: 'A price cap', d: [49] }), subsidy, regulation('Regulation of suppliers'), info],
    right: [E(GIM, 'Maximum price (price ceiling)', { t: 'Why a price cap may create a shortage' }), subsidyLimits, unintended],
    judge: 'A price cap and a subsidy cut bills quickly but weaken the signal to use less and cost money; regulation and information are slower. The right choice depends on whether the aim is short-term relief or lower bills over time.',
  },
  90: {
    cols: ['Ways to reduce emissions from road transport', 'Limits'],
    left: [tax('A fuel or carbon tax'), subsidy, regulation('Emission standards'), permits],
    right: [taxLimits, subsidyLimits, regulationLimits],
    judge: 'Taxes on fuel make drivers face the external cost; subsidies to electric vehicles and standards change what is available. Demand is inelastic in the short run, so effects build over time.',
  },
  91: {
    cols: ['Methods to reduce electronic waste', 'Limits'],
    left: [regulation('Regulation: recycling and standards'), tax('A tax on disposal'), info, permits],
    right: [regulationLimits, taxLimits, infoLimits],
    judge: 'Regulation can force recycling, a tax makes people face the cost of disposal, and information changes habits. Waste crosses borders, which makes enforcement hard.',
  },
  92: {
    cols: ['Impact of a large deficit and national debt', 'When it may not matter'],
    left: [D(ND, 'Why a high national debt matters', { t: 'Why a high national debt matters' }), S(ND, 'The national debt', { t: 'The national debt' })],
    right: [D(ND, 'The r against g condition', { t: 'The r against g condition' }), S(ND, 'When is debt sustainable?', { t: 'When is debt sustainable?' }), D(ND, 'Case study: the Greek debt crisis', { t: 'The Greek debt crisis' })],
    judge: 'A large debt means higher interest payments and less room for future spending, but it is sustainable if growth exceeds the interest rate and the government borrows in its own currency; the debt-to-GDP ratio matters more than the level.',
  },
  93: {
    cols: ['Why a deficit and debt could be a concern', 'Why it may not be'],
    left: [D(ND, 'Why a high national debt matters', { t: 'Why a high national debt matters' })],
    right: [D(ND, 'The r against g condition', { t: 'The r against g condition' }), E(ND, 'Why a high national debt matters', { t: 'When debt is not a problem' })],
    judge: 'A deficit and debt are a concern if interest costs rise faster than growth, but if borrowing funds investment and growth is above the interest rate, debt as a share of GDP can fall.',
  },
  94: {
    cols: ['Features of a public good', 'Why it may not be a pure public good'],
    left: [S(PGI, 'Public goods', { t: 'Public goods' }), D(PGI, 'The free rider problem', { t: 'The free rider problem' })],
    right: [S(PGI, 'Quasi-public goods', { t: 'Quasi-public goods' }), S(PGI, 'Features of public and private goods', { t: 'Features of public and private goods' })],
    judge: 'A beach is non-excludable in some places and non-rival until crowded, so it is better described as a quasi-public good than a pure public good.',
  },
  95: {
    cols: ['Effects of austerity on the objectives', 'Limits'],
    left: [D(MPGC, 'Austerity and its effects', { t: 'Austerity and its effects' }), S(ND, 'Measures to reduce a deficit', { t: 'Measures to reduce a deficit' })],
    right: [E(MPGC, 'Austerity and its effects', { t: 'Why austerity may reduce growth' }), S(MO, 'Reading the UK\'s macro record', { t: 'Reading the UK\'s macro record' })],
    judge: 'Austerity cuts the deficit but also cuts AD, growth and sometimes raises unemployment; the benefit depends on whether lower debt raises confidence and on whether the economy has spare capacity.',
  },
  96: {
    cols: ['Features of a public good', 'Why it may not be a pure public good'],
    left: [S(PGI, 'Public goods', { t: 'Public goods' }), D(PGI, 'The free rider problem', { t: 'The free rider problem' })],
    right: [S(PGI, 'Quasi-public goods', { t: 'Quasi-public goods' }), S(PGI, 'Features of public and private goods', { t: 'Features of public and private goods' })],
    judge: 'A public park is non-excludable and mostly non-rival, but it can become crowded and can be fenced and charged for, so it is better described as a quasi-public good.',
  },
  97: {
    cols: ['Features of a public good', 'Why it may not be a pure public good'],
    left: [S(PGI, 'Public goods', { t: 'Public goods' }), D(PGI, 'The free rider problem', { t: 'The free rider problem' })],
    right: [S(PGI, 'Quasi-public goods', { t: 'Quasi-public goods' }), S(PGI, 'Features of public and private goods', { t: 'Features of public and private goods' })],
    judge: 'TV content can be made excludable by subscription or encryption, so it is not a pure public good; broadcast television funded by licence fee or adverts is closer to one.',
  },
  98: {
    cols: ['Effects of higher government spending', 'Limits'],
    left: [D(FP, 'Discretionary fiscal policy', { t: 'Discretionary fiscal policy', d: [180] }), D(CIR, 'What makes the multiplier large', { t: 'What makes the multiplier large', d: [182] }), D(FP, 'Does the type of spending change what happens', { t: 'Does the type of spending change the effect?' })],
    right: [E(CIR, 'Why the multiplier may be smaller', { t: 'Why the multiplier may be smaller' }), S(PET, 'Crowding out and crowding in', { t: 'Crowding out and crowding in' }), D(ND, 'Why a high national debt matters', { t: 'The cost to the national debt' })],
    judge: 'Higher government spending raises AD, output and jobs through the multiplier, and more if it is spent on infrastructure that lifts supply. The effect is smaller if the economy is near full capacity, and it adds to the debt.',
  },
  99: {
    cols: ['Fiscal policies for a recession', 'Limits'],
    left: [D(FP, 'Automatic stabilisers', { t: 'Automatic stabilisers' }), D(FP, 'Discretionary fiscal policy', { t: 'Discretionary fiscal policy', d: [180] }), D(FP, 'Case study: furlough', { t: 'Case study: the furlough scheme' }), D(FP, 'Case study: Eat Out to Help Out', { t: 'Case study: Eat Out to Help Out' })],
    right: [E(FP, 'Discretionary fiscal policy', { t: 'Why discretionary policy may not work' }), E(FP, 'Case study: furlough', { t: 'Limits of the furlough scheme' }), D(ND, 'Why a high national debt matters', { t: 'The cost to the national debt' })],
    judge: 'In a recession, automatic stabilisers act at once and targeted spending supports demand, but time lags, the rising debt and uncertainty about size limit what discretionary policy can achieve.',
  },
  100: {
    cols: ['How cutting tax rates could raise growth', 'Limits'],
    left: [D(FP, 'The Laffer curve', { t: 'The Laffer curve', d: [209] }), S(FP, 'Fiscal policy on the supply side', { t: 'Fiscal policy on the supply side' }), D(SSP, 'Tax and benefit reform', { t: 'Tax and benefit reform' })],
    right: [E(FP, 'The Laffer curve', { t: 'Why lower rates may not raise revenue' }), E(SSP, 'Tax and benefit reform', { t: 'Why tax cuts may not raise growth' }), D(ND, 'Why a high national debt matters', { t: 'The cost to the national debt' })],
    judge: 'Lower tax rates raise incentives and disposable income, so they can lift growth, but the effect is uncertain and slow, it reduces revenue unless the economy is above the revenue-maximising rate, and it can widen inequality.',
  },
  101: {
    cols: ['What is meant by an unintended consequence', ''],
    left: [D(GF, 'Unintended consequences', { t: 'Unintended consequences' })],
    right: [],
  },
  102: {
    cols: ['How more bank lending could reverse deflation', 'Why it may not'],
    left: [S(INF, 'Deflation', { t: 'Deflation' }), D(MP, 'QE The central bank', { t: 'Quantitative easing' })],
    right: [S(MP, 'When transmission fails: the liquidity trap', { t: 'The liquidity trap' }), E(MP, 'QE The central bank', { t: 'Why QE may not work' })],
    judge: 'More lending can raise spending and break a deflationary spiral, but in a liquidity trap banks hold the money and households and firms will not borrow, so it may not reverse deflation without other policy.',
  },
  103: {
    cols: ['Disadvantages of a free market in health care', 'Why a free market may still work'],
    left: [D(PGI, 'Information gaps', { t: 'Information gaps' }), D(PGI, 'Merit goods - under-consumed', { t: 'Health care as a merit good' }), S(ES, 'Evaluating market economies', { t: 'Evaluating market economies' })],
    right: [S(ES, 'The role of the state in a mixed economy', { t: 'The role of the state in a mixed economy' }), D(ES, 'How much should the state do?', { t: 'How much should the state do?' })],
    judge: 'A free market under-provides health care because of information gaps and external benefits, and leaves the poor unable to pay, so most economies use a mixed system.',
  },
  104: {
    cols: ['Advantages of a free market in education', 'Limits'],
    left: [D(ES, 'Adam Smith’s invisible hand', { t: 'The invisible hand' }), S(ES, 'The market economy', { t: 'The market economy' })],
    right: [E(ES, 'Adam Smith’s invisible hand', { t: 'Why the invisible hand may fail' }), D(PGI, 'Merit goods - under-consumed', { t: 'Education is a merit good' }), D(PDM, 'Does the price mechanism allocate resources well', { t: 'Does the price mechanism allocate resources well?' })],
    judge: 'A free market gives choice and competition, which can raise quality, but education is a merit good with external benefits, so a free market under-provides it to the poor.',
  },
  105: {
    cols: ['Two characteristics of private ownership', ''],
    left: [S(ES, 'The market economy', { t: 'The market economy' })],
    right: [],
  },
  106: {
    cols: ['Disadvantages of a free market for TV content', 'Why it may still work'],
    left: [D(PDM, 'Externalities break the signal', { t: 'Externalities break the signal' }), D(PGI, 'Merit goods - under-consumed', { t: 'Merit goods are under-consumed' }), D(PDM, 'Information gaps break the rationing function', { t: 'Information gaps break the rationing function' })],
    right: [S(ES, 'Evaluating market economies', { t: 'Evaluating market economies' }), D(ES, 'Adam Smith’s invisible hand', { t: 'The invisible hand' })],
    judge: 'A free market gives choice but may under-provide programmes with external benefits and over-provide content that harms, so there is a case for some public provision and regulation.',
  },
  107: {
    cols: ['How QE works in a recession', 'Why it may not work'],
    left: [D(MP, 'QE The central bank', { t: 'Quantitative easing' }), S(MP, 'Quantitative easing, step by step', { t: 'Quantitative easing, step by step' })],
    right: [E(MP, 'QE The central bank', { t: 'Why QE may not work' }), S(MP, 'When transmission fails: the liquidity trap', { t: 'The liquidity trap' })],
    judge: 'QE lowers long-term rates and raises asset prices and liquidity, which supports demand, but banks may hold the money, it raises wealth inequality and the evidence on its size is mixed.',
  },
  108: {
    cols: ['How QE can prevent deflation', 'Why it may not'],
    left: [D(MP, 'QE The central bank', { t: 'Quantitative easing' }), S(INF, 'Deflation', { t: 'Deflation' })],
    right: [E(MP, 'QE The central bank', { t: 'Why QE may not work' })],
    judge: 'QE adds money and lowers yields, which raises spending and expectations of inflation, so it can prevent deflation, but only if banks lend and people spend.',
  },
  109: {
    cols: ['Benefits of relaxing immigration laws', 'Costs and limits'],
    left: [D(SSP, 'Immigration policy', { t: 'Immigration policy' }), D(CEG, 'Causes of potential growth', { t: 'More labour raises potential output' })],
    right: [E(SSP, 'Immigration policy', { t: 'Why immigration may not raise performance' })],
    judge: 'More immigration adds to the labour force and potential output and fills skills gaps, but pressure on housing and public services and wage effects for some workers limit the gain.',
  },
  110: {
    cols: ['Macroeconomic policies to reduce inflation', 'Limits'],
    left: [S(FP, 'Fiscal policy on the supply side', { t: 'Fiscal policy' }), D(SSP, 'Infrastructure', { t: 'Infrastructure' }), D(SSP, 'Education and training', { t: 'Education and training' })],
    right: [E(FP, 'Discretionary fiscal policy', { t: 'Why fiscal policy may not work' }), E(SSP, 'Education and training', { t: 'Why supply-side policy is slow' })],
    judge: 'Cutting government spending or raising taxes reduces demand-pull inflation, while supply-side policy lowers costs over time; both are slower and have costs, which is why monetary policy is used first.',
  },
}
