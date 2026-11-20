import QUESTIONS from '../data/plan-questions'
import { BUILT_PLANS } from './econ-plans-built'

/*
  Essay plans, built ONLY from the Economics notes.

  The questions are every exam question in the teaching spreadsheet (205 of
  them, Year 12 and Year 13). A plan is the shape a strong answer takes on a
  page: two columns of chains, each chain a short line of reasoning with an
  arrow between steps, a bank diagram where one belongs, and a judgement.

    left   the analysis column (what happens, why it helps, the causes)
    right  the evaluation column (limits, counter-points, the other side)

  Every step is a point the notes make, in the notes' own terms. Where the
  notes give an example (Nissan in Sunderland, the credit crunch, Singapore)
  the plan uses it; no example is brought in from outside the notes.

  A question with no plan yet is still listed so none is missed: it opens as
  "plan it yourself" and says which part of the notes it needs.

  Chain diagrams are slide ids of the diagram bank (data/diagram-bank.json).
  `hover` gives, per curve, what specifically shifts it in THIS chain.
*/

// one chain: a title, the steps in order, and an optional diagram
const c = (title, steps, d) => ({ title, steps, d })
const dia = (ids, hover) => ({ ids, hover })

const GLOBALISATION_CAUSES = {
  cols: ['Causes of globalisation', 'Limits: why it may not keep driving globalisation'],
  left: [
    c(
      'Cheaper transport and communication',
      [
        'Containerisation cut the cost of shipping a unit to a fraction of its value',
        'The internet lets firms coordinate production, services and finance at negligible cost',
        'Distant production becomes viable, so the cost of supplying traded goods falls',
        'Trade and capital flows grow faster than GDP: globalisation',
      ],
      dia([20], { S: ['Cheaper shipping and communication lower the cost of supplying goods that cross borders'] }),
    ),
    c(
      'Trade liberalisation and the growth of TNCs',
      [
        'WTO rounds and regional agreements cut tariffs (about 40% in 1947 to under 5% in developed economies)',
        'Imports are cheaper and exporters reach bigger markets',
        'TNCs organise production across many countries to cut costs, find new markets and gain scale',
        'More trade, FDI and global supply chains',
      ],
      dia([223]),
    ),
    c(
      'Political change and deregulation of finance',
      [
        "The opening of China, the end of the Soviet system and India's reforms added billions of workers and consumers",
        'Removal of capital controls lets money move to wherever returns are highest',
        'A much bigger world market, with FDI and portfolio flows rising',
        'Economies become more integrated and interdependent',
      ],
    ),
  ],
  right: [
    c(
      'Liberalisation has run out of road',
      [
        'Little scope is left to cut tariffs further',
        'Tariffs on goods such as steel, countries leaving trading blocs (the UK) and trade wars cut trade',
        'DEGLOBALISATION: trade grows more slowly or falls',
      ],
      dia([222]),
    ),
    c(
      'Transport and communication gains are uneven and can reverse',
      [
        'Landlocked countries gain less from containerisation; shipping costs have risen and become unpredictable',
        'Firms RESHORE production, and automation reduces the need to produce in low-wage countries',
        'Many people in developing countries still have no internet access',
        'Technology alone does not guarantee deeper integration',
      ],
    ),
  ],
  judge:
    'Containerisation and the internet made globalisation possible; liberalisation and political change drove it at speed. The notes show the political causes are the least secure, since trade tensions can reverse them, so the most lasting cause is technological: cheaper transport and communication.',
  notes: ['Globalisation'],
}

const PLANS = {
  /* ------------------------------------------------ globalisation and trade */
  151: GLOBALISATION_CAUSES,
  154: { ...GLOBALISATION_CAUSES, judge: 'The most significant factor is cheaper transport and communication, because it is the one the others depend on. Trade liberalisation and political change are weaker factors because both can be reversed by trade wars and tension between major economies.' },

  152: {
    cols: ['Good for a developed economy', 'Bad for a developed economy'],
    left: [
      c(
        'Selling high-value goods and services',
        [
          'A few expensive exports (Swiss watches, UK financial services) bring in a lot of money',
          'Exports (X) rise',
          'AD shifts right from AD1 to AD2, and the multiplier amplifies it',
          'Real GDP and employment rise; trade surpluses for Germany and Switzerland; the current account improves',
        ],
        dia([180], { AD: ['Higher exports (X) as the economy sells more high-value goods and services abroad', 'The multiplier then amplifies the initial rise in X'] }),
      ),
      c(
        'Access to raw materials',
        [
          'Developed economies import materials they cannot produce, or would rather buy cheaply',
          'Costs of production fall',
          'SRAS shifts right',
          'Higher output and a lower price level; more and better inputs, lower prices and more choice for consumers',
        ],
        dia([188], { AS: ['Cheaper imported raw materials lower firms\' costs of production'] }),
      ),
    ],
    right: [
      c(
        'Deindustrialisation',
        [
          'Manufactured goods can be made more cheaply elsewhere, so manufacturing declines',
          'Workers are occupationally and geographically immobile',
          'Structural and regional unemployment, and hysteresis',
          'X - M falls and unemployment rises, so AD falls and the current account deficit widens',
        ],
        dia([184], { AD: ['Lower net exports (X - M) as imports of cheaper manufactures replace home production', 'Lower consumption as unemployment rises in the affected regions'] }),
      ),
      c(
        'Contagion and imported inflation',
        [
          'CONTAGION: economic problems spread between linked economies (US mortgage defaults reached UK banks in the financial crisis)',
          'A conflict that raises world oil prices raises costs for importing countries',
          'SRAS shifts left',
          'Cost-push inflation and lower output',
        ],
        dia([185], { AS: ['Higher world oil prices raise the cost of production for every importing firm'] }),
      ),
    ],
    judge:
      'The gains are large in aggregate but the losses fall on identifiable groups (low-skill manufacturing workers, former industrial regions) who are not compensated. The UK gained from inward FDI (Nissan in Sunderland) and migration but lost through regional unemployment from deindustrialisation and the spread of the credit crunch. Whether globalisation is good depends on who gains, and on whether the government redistributes the gains.',
    notes: ['Globalisation'],
  },

  153: {
    cols: ['Good for a developing economy', 'Bad for a developing economy'],
    left: [
      c(
        'Higher exports and FDI',
        [
          'Export-led growth (China, Vietnam); exports raise AD',
          'The multiplier amplifies the effect',
          'MNC investment and cheaper capital imports improve infrastructure and productive capacity (China builds infrastructure in sub-Saharan Africa)',
          'LRAS shifts right: higher output and a lower price level',
        ],
        dia([180, 176], { AD: ['Higher exports as the country sells more abroad'], LRAS: ['Better infrastructure and capital from MNC investment raise productive capacity'] }),
      ),
      c(
        'Human capital and tax revenue',
        [
          'Workers for MNCs learn new skills; people who work abroad bring skills home (a Malawian nurse in the NHS)',
          'Productivity and the quality of labour rise',
          'New jobs raise income tax revenue',
          'The government can pay for poverty reduction such as clean water supplies',
        ],
      ),
    ],
    right: [
      c(
        'Primary sector dependence',
        [
          'Globalisation pushes developing countries towards primary production, where they have a comparative advantage',
          'Prebisch-Singer: demand for primary goods is income inelastic, for manufactures income elastic, so the terms of trade decline',
          'They must export more to buy the same imports: more extraction and more negative externalities',
          'Primary prices are volatile (inelastic supply and demand), which harms farmers with no other income',
        ],
        dia([63], { MPC: ['Extraction costs the firm pays: labour, equipment, energy'], MSC: ['External costs of extraction: damaged land, pollution, resource depletion'] }),
      ),
      c(
        'Exploitation by MNCs and brain drain',
        [
          'MNCs use complex tax arrangements to avoid local tax, use capital in place of labour or bring in expatriate staff',
          'Less employment and tax revenue than promised',
          'Doctors, nurses, teachers and engineers emigrate for higher pay: quantity and quality of labour fall',
          'LRAS shifts left, and fewer merit goods can be delivered',
        ],
        dia([175], { LRAS: ['Human capital flight: the most productive workers emigrate', 'Resource depletion and damage from extraction reduce capacity'] }),
      ),
    ],
    judge:
      'The route to development is to move away from primary products by building a NEW comparative advantage, which needs heavy investment in education and training (as in Singapore). Globalisation helps if the gains are used that way; it harms if the country stays locked into primary exports. Diversification takes decades and needs finance, infrastructure and stable institutions, and infant industries may need protection while they develop.',
    notes: ['Globalisation', 'Terms of Trade'],
  },

  155: {
    cols: ['Policy and how it helps', 'Limits of the policy'],
    left: [
      c(
        'Supply-side policy: education and training',
        [
          'Job losses are concentrated regionally and by skill, and workers are immobile, so structural unemployment persists',
          'Education and training raise skills and mobility and build a new comparative advantage (Singapore)',
          'LRAS shifts right: higher output and lower unemployment',
        ],
        dia([188], { AS: ['Better education and training raise the quality of labour', 'Investment in infrastructure raises productive capacity'], LRAS: ['Better education and training raise the quality of labour', 'Investment in infrastructure raises productive capacity'] }),
      ),
      c(
        'Fiscal policy: redistribute the gains',
        [
          'The gains from globalisation are large in aggregate but fall unevenly: low-skill workers and old industrial regions lose',
          'Progressive taxation and benefits, funded by the extra tax revenue growth brings, compensate the losers',
          'Inequality falls and demand in the hit regions is supported',
        ],
      ),
    ],
    right: [
      c(
        'Supply-side effects are slow and costly',
        ['Diversification takes decades and needs finance, infrastructure and stable institutions', 'Retraining may not match the jobs that exist, so the adjustment stays slow'],
      ),
      c(
        'Governments compete for investment',
        [
          'Competition for FDI pushes governments to cut corporation tax: a race to the bottom that erodes the revenue redistribution needs',
          'TNCs use transfer pricing to shift profits, and capital mobility limits the ability to tax capital',
          'International cooperation (the OECD minimum corporate tax) can restore some control',
        ],
      ),
    ],
    judge: 'Supply-side policy is the better long-run answer because it tackles the cause (immobility and lost comparative advantage), but it is slow; fiscal redistribution helps quickly but its revenue is under pressure from tax competition.',
    notes: ['Globalisation', 'Supply-Side Policy'],
  },

  156: {
    cols: ['Gains for the global economy', 'Costs for the global economy'],
    left: [
      c(
        'Specialisation and trade',
        [
          'Countries specialise where their opportunity cost is lowest and trade',
          'World output rises and both countries consume beyond their PPF',
          'Larger markets give economies of scale; imports bring lower prices and more choice',
          'Higher global output and living standards',
        ],
        dia([221]),
      ),
      c(
        'Competition, FDI and technology transfer',
        [
          'Import competition forces firms to cut costs and prices (less X-inefficiency)',
          'FDI and imported capital goods bring know-how',
          'Productivity and productive potential rise worldwide',
          'Export-led growth in China and Vietnam',
        ],
        dia([206]),
      ),
    ],
    right: [
      c(
        'Interdependence and unequal gains',
        [
          'Problems spread between linked economies (contagion); supply shocks travel along long supply chains',
          'Losers (low-skill manufacturing workers, old industrial regions) are concentrated and slow to adjust',
          'Structural unemployment and widening inequality',
        ],
        dia([185], { AS: ['A shock to world supply (a factory fire, a shipping disruption, a conflict raising oil prices) raises costs of production everywhere'] }),
      ),
      c(
        'Environment and tax competition',
        [
          'More output and transport means more emissions; production relocates to countries with weaker regulation',
          'Governments compete for FDI by cutting corporation tax; TNCs use transfer pricing',
          'Falling tax revenue and weaker environmental protection',
        ],
        dia([63]),
      ),
    ],
    judge: 'The gains are large in aggregate and well established; the losses are concentrated and uncompensated. The judgement is about distribution: whether globalisation is good depends on who is asked and on whether governments redistribute the gains.',
    notes: ['Globalisation', 'International Trade'],
  },

  158: {
    cols: ['Effects of more protectionism', 'The case for it, and limits on the damage'],
    left: [
      c(
        'A tariff raises prices and causes a net welfare loss',
        [
          'The tariff raises the price from P1 to P2',
          'Consumption falls, domestic production rises and imports fall',
          'Consumer surplus falls by more than producers and the government gain: deadweight loss (production and consumption inefficiency)',
          'Higher prices fall hardest on the poor, and costs rise for firms that use imported inputs',
        ],
        dia([222]),
      ),
      c(
        'Retaliation and a trade war',
        [
          'Trading partners respond in kind (the Smoot-Hawley tariff of 1930, the 2018 US-China tariffs)',
          'Exporters lose markets',
          'Global trade and specialisation fall; resources stay in industries with no comparative advantage',
          'Lower world output; slower productivity growth as firms face less competition (X-inefficiency)',
        ],
      ),
    ],
    right: [
      c(
        'Some protection can be justified',
        [
          'Infant industries need shelter to reach scale; sunset industries need a managed decline; strategic industries (food, energy, defence)',
          'Tariffs raise revenue and may reduce a current account deficit',
          'But governments cannot pick winners, protected industries rarely grow up, and the cost per job saved is very high',
        ],
      ),
      c(
        'How much damage depends on elasticities and size',
        [
          'If demand for imports and domestic supply are price inelastic, quantities change little, so the loss is smaller and the tariff mostly raises revenue',
          'A large country can push the world price down and shift part of the cost onto foreign exporters',
          'Developing countries may be worse off when richer countries tariff their exports',
        ],
      ),
    ],
    judge: 'The gains from free trade are aggregate and the losses concentrated, so protection is net harmful for the global economy, especially if it provokes retaliation. A temporary, targeted, time-limited measure with a credible exit is the one case that can be defended.',
    notes: ['Protectionism and Trade Restrictions', 'International Trade'],
  },

  157: {
    cols: ['How absolute advantage can lead to growth', 'Why it may not'],
    left: [
      c(
        'Specialise where it can produce more with the same resources',
        [
          'A country with an absolute advantage produces MORE of a good than another using the same resources',
          'Kenya specialises in goods that use intensively the factors it has in plentiful supply (Heckscher-Ohlin), for example land and labour for agricultural goods',
          'World output rises and trade lets Kenya consume beyond its production possibility curve',
          'Higher consumption and living standards',
        ],
        dia([218]),
      ),
      c(
        'Exports, economies of scale and technology transfer',
        [
          'A larger export market lets firms gain economies of scale and lowers long-run average cost',
          'Exports raise AD and the multiplier amplifies it; FDI and imported capital bring technology',
          'Higher output and productivity: economic growth',
        ],
        dia([180], { AD: ['Higher exports as Kenyan firms sell to larger world markets'] }),
      ),
    ],
    right: [
      c(
        'Comparative, not absolute, advantage determines the gains',
        [
          'Gains from trade come from lower OPPORTUNITY COST (Ricardo), so a country can gain even if it is absolutely worse at everything',
          'The theory assumes no transport costs, constant returns, perfect factor mobility and no trade barriers',
          'In practice distance, tariffs, exchange rates and factor immobility limit the gains',
        ],
      ),
      c(
        'Primary product dependency',
        [
          'Specialising in primary goods exposes Kenya to volatile prices (inelastic supply and demand)',
          'Prebisch-Singer: the terms of trade decline over time',
          'It must export more to afford the same imports; growth may not be sustainable',
        ],
      ),
    ],
    judge: 'Absolute advantage can raise output and growth, but the notes stress that it is comparative advantage that decides who gains from trade, and the gains are not always shared fairly. Growth is most likely if Kenya moves beyond primary products to build a new comparative advantage.',
    notes: ['International Trade', 'Terms of Trade'],
  },

  160: {
    cols: ['Effect on consumers and manufacturers', 'Limits and counter-points'],
    left: [
      c(
        'Consumers pay more',
        [
          'The tariff raises the price of imported clothing',
          'Quantity demanded contracts and consumer surplus falls',
          'Low-income households spend a larger share of income on clothes, so the burden is regressive',
        ],
        dia([222]),
      ),
      c(
        'Domestic manufacturers gain',
        [
          'Imports become dearer relative to home-made clothing',
          'Domestic output rises along the supply curve; producer surplus and employment rise',
          'A protected infant industry may reach scale',
        ],
      ),
    ],
    right: [
      c(
        'Elasticity decides the effect',
        [
          'If demand for imports is inelastic, consumers keep buying them, so the tariff mostly raises prices and revenue',
          'If domestic supply is price inelastic, manufacturers cannot expand quickly, so little spending shifts to home production',
        ],
      ),
      c(
        'Protection can entrench inefficiency',
        [
          'Sheltered firms face less competition, so costs rise (X-inefficiency) and there is little incentive to invest',
          'Infant industries rarely grow up; tariffs on imported inputs raise costs; retaliation is possible',
        ],
      ),
    ],
    judge: 'Consumers lose more than manufacturers gain, so there is a net welfare loss. A temporary, targeted tariff could help a young clothing industry if it is time-limited and combined with investment, but protection often becomes permanent.',
    notes: ['Protectionism and Trade Restrictions'],
  },

  163: {
    cols: ['Effects of the growth of trading blocs', 'Why the effect may be smaller or harmful'],
    left: [
      c(
        'Trade creation',
        [
          'Members remove tariffs on each other; production shifts from high-cost home producers to lower-cost members',
          'Consumer surplus rises, with economies of scale from a larger market, more competition and more FDI',
          'More trade among members and stronger bargaining power in world negotiations',
        ],
        dia([223]),
      ),
      c(
        'Regional patterns of trade strengthen',
        [
          'Lower transaction costs and no tariffs make intra-bloc trade cheaper than trade with outsiders',
          'Trade between neighbours grows and supply chains form inside the region',
          'Global trade shifts towards regional blocks',
        ],
      ),
    ],
    right: [
      c(
        'Trade diversion',
        [
          'A common external tariff shifts production from a LOW-cost non-member to a HIGHER-cost member',
          'Welfare falls: consumers pay more than under free trade',
          'The bloc benefits only if creation exceeds diversion (B + D - E)',
        ],
      ),
      c(
        'Fragmentation of world trade',
        [
          'Blocs discriminate, which conflicts with the WTO principle of non-discrimination, and may undermine multilateral liberalisation',
          'Overlapping deals with different rules of origin (the spaghetti bowl) raise compliance costs',
          'Small non-member developing countries face diversion without offsetting access',
        ],
      ),
    ],
    judge: 'A bloc raises welfare only if trade creation outweighs diversion, which is more likely when members are already efficient and the external tariff is low. Supporters call blocs building blocks and critics stumbling blocks; the evidence in the notes is mixed, and non-members lose most.',
    notes: ['Trading Blocs and the WTO'],
  },

  165: {
    cols: ['Benefits of more integration', 'Drawbacks and limits'],
    left: [
      c(
        'Trade creation and a larger market',
        [
          'Removing barriers lets members use comparative advantage',
          'Economies of scale from selling to more customers; more competition lowers prices and helps those on low incomes',
          'Lower transaction costs and a better allocation of resources',
        ],
        dia([223]),
      ),
      c(
        'Freedom of movement and investment',
        [
          'In a common market labour and capital move freely',
          'Labour shortages are filled and FDI is attracted to the larger market',
          'Higher output and employment',
        ],
      ),
    ],
    right: [
      c(
        'Trade diversion and unequal gains',
        [
          'A common external tariff can divert trade from cheaper non-members to higher-cost members',
          'Benefits go to developed more than developing countries, which tend to be left specialising in primary commodities (Prebisch-Singer)',
        ],
      ),
      c(
        'Brain drain and unemployment',
        [
          'Poorer members lose their best workers to richer ones where pay is higher',
          'Workers in some sectors are occupationally immobile and become unemployed',
          'Interdependence spreads problems between members',
        ],
      ),
    ],
    judge: 'Integration is likely to benefit sub-Saharan African members if creation outweighs diversion and if they use the larger market to diversify beyond primary goods; the risks are unequal gains and brain drain.',
    notes: ['Trading Blocs and the WTO'],
  },

  171: {
    cols: ['Policies to raise competitiveness', 'Limits of each policy'],
    left: [
      c(
        'Supply-side policies raise productivity',
        [
          'Education and training, infrastructure, R&D tax credits and competition policy',
          'Output per worker rises, so unit labour costs fall (wage / productivity)',
          'Price and non-price competitiveness improve, so exports rise',
          'LRAS shifts right and export-led growth follows',
        ],
        dia([188], { AS: ['Higher productivity from education, investment and technology', 'Better infrastructure lowers firms\' costs and delivery times'], LRAS: ['Higher productivity from education, investment and technology', 'Better infrastructure lowers firms\' costs and delivery times'] }),
      ),
      c(
        'A depreciation of the exchange rate',
        [
          'A fall in the pound cuts the foreign-currency price of UK exports, roughly 10% for a 10% fall if sterling prices are held',
          'Exports become cheaper abroad and imports dearer at home',
          'Net exports rise, so AD shifts right',
        ],
        dia([199], { S: ['Lower interest rates or capital outflows lead to more pounds being sold'], D: ['Lower demand for UK exports and assets'] }),
      ),
    ],
    right: [
      c(
        'Supply-side measures are slow and cost money',
        [
          'They take years to work and the UK has had slow productivity growth since 2008',
          'Lower corporation tax and deregulation risk a race to the bottom on the standards competitiveness depends on',
        ],
      ),
      c(
        'A depreciation has limits',
        [
          'Exporters that use imported inputs see their costs rise, and import prices raise inflation',
          'The gain is temporary if it feeds into inflation, and competitors can match it',
          'It does nothing for non-price competitiveness (quality, reliability, brand)',
        ],
      ),
    ],
    judge: 'Supply-side policy is the more effective and durable route because it raises productivity and non-price competitiveness; a depreciation gives a quick boost to price competitiveness only. Which matters more depends on whether the UK competes mainly on price or quality.',
    notes: ['International Competitiveness', 'Exchange Rates'],
  },
}

/* ------------------------------------------------------------ the bank */

// Which part of the notes a question draws on, for the filter and the empty state.
const AREAS = [
  ['Trade and globalisation', /globalis|protection|trading bloc|integration|tariff|absolute advantage|competitiveness|exchange rate|sterling|currency|current account|net trade|exports/i],
  ['Inflation, money and banks', /inflation|interest rate|CPI|MPC|quantitative|deflation|banks|financial|forward markets|microfinance/i],
  ['Fiscal policy and growth', /fiscal|deficit|austerity|government expenditure|tax rates|tax revenue|supply-side|productivity|growth|GDP|multiplier|infrastructure|consumption|savings|investment|house prices|real wages|recession|unemployment|Phillips|trade-offs|macroeconomic objectives|conflicts/i],
  ['Market failure and intervention', /intervention|externalit|market failure|public good|merit|tax on|maximum price|carbon|plastic|nuclear|over-fishing|fishing|emissions|unintended|free market|state-funded|private costs|social optimum|asymmetric|electronic waste|energy/i],
  ['Firms, markets and competition', /monopol|oligopol|collusi|contestab|concentration|price discrimination|merger|PED|YED|PES|elastic|competition|profit|price and non|economies of scale|market share|integration within|retailers|business|firms|Starbucks|coffee|rational|demand for|supply of|prices|price of|vet insurance|streaming/i],
  ['Labour, inequality and development', /labour|wage|inequality|poverty|aid|development|Fairtrade|debt relief|cocoa|nationalisation|migration|immigration|Rwanda|Kenya|Ghana|Angola|Nigeria|Mozambique|Indonesia|Ivory/i],
]
export const areaOf = (q) => AREAS.find(([, re]) => re.test(q))?.[0] || 'Other'
export const PLAN_AREAS = [...AREAS.map((a) => a[0]), 'Other']

export const MARK_SPLIT = {
  5: { kaa: 5, evaluation: 0 },
  8: { kaa: 6, evaluation: 2 },
  10: { kaa: 6, evaluation: 4 },
  12: { kaa: 8, evaluation: 4 },
  15: { kaa: 9, evaluation: 6 },
  25: { kaa: 16, evaluation: 9 },
}
// About 1.2 minutes a mark, as the exam allows.
export const minutesFor = (marks) => Math.round(marks * 1.2)

export const PLAN_BANK = QUESTIONS.map((q) => ({
  ...q,
  area: areaOf(q.q),
  plan: PLANS[Number(q.id.slice(1))] || BUILT_PLANS[Number(q.id.slice(1))] || null,
}))
