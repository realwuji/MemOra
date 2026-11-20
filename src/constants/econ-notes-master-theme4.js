/*
  Theme 4.1 (international economics), from the MASTER course documents.

  Globalisation, Absolute and Comparative Advantage, Protectionism, Economic
  Integration, Exchange Rates and International Competitiveness, read end to
  end against what each chapter already said. Like econ-notes-firm-master.js
  and econ-notes-master-theme2.js, it adds only what was missing or thinner
  than the source and is merged onto the END of each chapter.

  What it adds, chapter by chapter:

    Globalisation          why it may be slowing; the benefits and costs for
                           developed economies (including contagion); the
                           benefits and costs for developing economies; the
                           long-term route to development.
    International Trade    absolute and comparative advantage worked with
                           numbers; the range of mutually beneficial terms of
                           trade; Heckscher-Ohlin; more limits on the theory.
    Terms of Trade         a worked index calculation and skewed bargaining.
    Protectionism          the tariff and quota diagrams area by area; winners
                           and losers; capital controls and technical barriers;
                           more for and against; when a tariff works.
    Trading Blocs, WTO     the features of each stage; trade creation and
                           diversion on the diagram; monetary union conditions;
                           the full benefits and drawbacks; WTO conflicts.
    Exchange Rates         what moves a floating rate; shorting and hedging;
                           the ERM and Black Wednesday; floating against
                           fixed; the J-curve and Marshall-Lerner in detail;
                           appreciation evaluated.
    International          non-wage labour costs; unit labour cost worked; why
    Competitiveness        UK unit labour costs are high; more factors.
*/

import { h, p, ul, ol, defn, det, worked, tip, table, chapter } from './econ-notes-build'

/* ================================================================ GLOBALISATION */

const globalisation = chapter(
  h('Where globalisation is most advanced, and why it may be slowing'),
  p(
    'Globalisation is most visible in financial markets, commodity markets (oil, coffee, tin, gold), insurance and credit, motor vehicles and consumer electronics, and increasingly in sport and entertainment. One result is a world with many more multinational companies (MNCs) producing and selling across borders. But each of the causes of globalisation has a limit:',
  ),
  table(
    ['Cause', 'Why it may not keep driving globalisation'],
    [
      [
        'Trade liberalisation',
        'There is little scope left to cut tariffs further. DEGLOBALISATION has been a more recent trend, with tariffs on goods such as steel and some countries leaving trading blocs, as the UK did. Trade wars have also reduced trade',
      ],
      [
        'Cheaper transport',
        'Containerisation (standard steel boxes) cut freight costs through economies of scale, and cheap air travel has transformed aviation. But landlocked countries gain less, shipping costs have risen and become unpredictable in some periods, which has led some firms to RESHORE production, and automation reduces the need to make things in low-wage countries',
      ],
      [
        'Cheaper communication',
        'The internet lets firms and consumers buy and communicate worldwide at low cost. But many people in developing countries still have no access to it',
      ],
      [
        'Political change',
        'The opening of economies once closed to world markets, such as the end of the Soviet system and the opening of China, added huge numbers of workers and consumers. Trade tensions between major economies can reverse some of that',
      ],
    ],
  ),

  h('The impact on developed economies'),
  table(
    ['Benefit', 'Explanation'],
    [
      [
        'Selling high-value goods and services',
        'A few expensive exports, such as luxury watches from Switzerland, bring in a lot of money. High-value exports have helped produce large trade surpluses in countries such as Germany and Switzerland and have created many jobs. Specialisation raises output and tax revenue, and developed economies can often negotiate favourable trade terms',
      ],
      [
        'Access to raw materials',
        'Developed economies can import materials they cannot produce or would rather buy cheaply. This gives greater quantity and quality of inputs and lower prices and more choice for consumers',
      ],
      [
        'Access to skilled and unskilled labour',
        'Skilled migrants fill shortages, for example doctors, nurses and agricultural workers; migrants are also typically willing to work for lower wages than domestic workers',
      ],
      [
        'Inward foreign direct investment',
        'Nissan\'s car factory in Sunderland created many jobs in a less prosperous part of the UK',
      ],
    ],
  ),
  table(
    ['Cost', 'Explanation'],
    [
      [
        'Deindustrialisation',
        'Manufactured goods can be made more cheaply elsewhere, so the manufacturing sector declines. The result can be structural and regional unemployment, hysteresis, occupational and geographical immobility and a wider current account deficit',
      ],
      [
        'Contagion and imported inflation',
        'CONTAGION is the spread of economic problems from one country to another. A conflict that pushes up world oil prices raises petrol prices and inflation in importing countries. In the financial crisis, US mortgage defaults spread to the UK because banks lend heavily to one another',
      ],
      ['Environmental damage', 'Moving goods around the world creates large emissions'],
    ],
  ),
  p(
    'Applied to the UK: it has gained from inward FDI and immigration, but has lost from high regional unemployment caused by deindustrialisation, and from the spread of the credit crunch, which cut growth.',
  ),

  h('The impact on developing economies'),
  table(
    ['Benefit', 'Explanation'],
    [
      ['Higher exports', 'Exports raise AD, and the multiplier amplifies the effect'],
      [
        'Better infrastructure and capital',
        'MNC investment has improved infrastructure and productive capacity. China, for instance, has built infrastructure in many sub-Saharan African countries in return for preferential access to raw materials. Developing countries can also import more advanced capital from the EU and USA, which raises AS, output and lowers the price level',
      ],
      [
        'Human capital',
        'Workers for MNCs learn new skills, and people who work abroad, such as a Malawian nurse working in the NHS, may bring those skills home',
      ],
      ['More tax revenue', 'Income tax from new jobs can pay for poverty reduction, such as clean water supplies'],
    ],
  ),
  table(
    ['Cost', 'Explanation'],
    [
      [
        'Primary sector dependence',
        'Globalisation pushes developing countries towards primary production, where they have a comparative advantage. The Prebisch-Singer hypothesis suggests that their terms of trade then decline, because demand for primary goods is income inelastic and for manufactures income elastic. To keep buying the same imports they must export more, which means more extraction and more negative externalities. Primary prices are also very volatile, because supply swings and demand is inelastic, which harms farmers who have no other income',
      ],
      [
        'Resource depletion and externalities',
        'Countries that depend on a resource are vulnerable when it runs out, which shifts AS left. Extraction damages land and human capital, lowering AS in the long term',
      ],
      [
        'Human capital flight',
        'Workers migrate abroad in search of higher pay. The most productive workers, such as doctors, nurses, teachers, engineers and civil servants, are those most able to deliver merit goods, so the quantity and quality of labour and AS fall',
      ],
      [
        'Exploitation by MNCs',
        'MNCs often use complex tax and accounting arrangements to avoid paying tax locally, so they exploit natural resources without adding much to the tax base. They may use capital in place of labour, or bring in expatriate staff for skilled jobs, so less employment is created than promised',
      ],
    ],
  ),
  det(
    'The route to development',
    'A developing economy needs to move away from dependence on primary products.',
    [
      'It must diversify, which means building a NEW comparative advantage.',
      'Comparative advantage depends on factor endowments, and low technology and skill levels tend to trap developing countries in low-skilled, labour-intensive production.',
      'The way out is heavy investment in education and training, as Singapore has done with great success.',
    ],
    'Diversification takes decades and needs finance, infrastructure and stable institutions. The infant industries involved may need protection while they develop, which conflicts with free trade rules.',
  ),
)

/* ============================================================ INTERNATIONAL TRADE */

const internationalTrade = chapter(
  h('Absolute advantage, worked through'),
  p(
    'Take two countries that each make only cars and bananas and split their resources 50:50. The US makes 100 cars and 50 bananas; Ecuador makes 50 cars and 100 bananas.',
  ),
  table(
    ['', 'Cars', 'Bananas'],
    [
      ['US (50:50)', '100', '50'],
      ['Ecuador (50:50)', '50', '100'],
      ['World total', '150', '150'],
    ],
  ),
  p(
    'The US has an ABSOLUTE advantage in cars and Ecuador in bananas, so each specialises: the US produces 200 cars and Ecuador 200 bananas. World output rises from 150 of each to 200 of each, so more wants can be met. If they then trade 100 cars for 100 bananas, each country consumes 100 cars and 100 bananas, which is beyond what either could reach on its own production possibility curve. The line showing what a country can consume after trade is its TRADING POSSIBILITY CURVE, which lies outside its PPC.',
  ),

  h('Comparative advantage, worked through'),
  p(
    'Ricardo showed that trade pays even when one country is absolutely better at making both goods. The UK makes 300 petrol and 300 clothes; Senegal makes 100 petrol and 200 clothes, each at a 50:50 split.',
  ),
  table(
    ['Opportunity cost of', 'UK', 'Senegal'],
    [
      ['1 unit of petrol', '1 clothes', '2 clothes'],
      ['1 unit of clothes', '1 petrol', '0.5 petrol'],
    ],
  ),
  p(
    'The UK has a lower opportunity cost of petrol (1 clothes against 2), so it has the comparative advantage in petrol; Senegal has the lower opportunity cost of clothes (0.5 petrol against 1), so its comparative advantage is in clothes. The UK has the absolute advantage in BOTH goods, but trade still benefits both.',
  ),
  worked(
    'The UK and Senegal specialise (the UK makes 600 petrol, Senegal 400 clothes) and agree to trade at 1 clothes = 0.75 petrol. Show that both gain if Senegal exports 250 clothes.',
    'Senegal sends 250 clothes and receives 250 × 0.75 = 187.5 petrol, so it consumes 150 clothes and 187.5 petrol. Before trade it had 200 clothes and 100 petrol, and since for Senegal 1 petrol is worth 2 clothes, the gain of 87.5 petrol is worth about 175 clothes against a loss of 50 clothes. The UK keeps 600 − 187.5 = 412.5 petrol and gains 250 clothes, against 300 and 300 before: it gains 112.5 petrol (worth the same in clothes at its 1:1 cost) and loses 50 clothes. Each country now consumes beyond its production possibility curve.',
  ),
  det(
    'The range of terms of trade that benefit both countries',
    'The terms of trade are the rate at which the goods exchange.',
    [
      'Senegal can make clothes at home at a cost of 0.5 petrol each, so it will accept any exchange rate giving MORE than 0.5 petrol per clothes.',
      'The UK can make clothes at home at a cost of 1 petrol each, so it will accept any rate that costs it LESS than 1 petrol per clothes.',
      'Anything between 0.5 and 1 petrol per clothes benefits both. At 0.75 the gains are shared; at 0.6 the UK gains much more than Senegal, though Senegal is still better off than without trade.',
    ],
    'In practice the rate depends on bargaining power, and developed countries often negotiate terms that favour them, which is why the gains from trade are not always shared fairly.',
  ),
  worked(
    'Italy can produce 1,000 TVs or 4,000 bottles of wine; China can produce 5,000 TVs or 5,000 bottles of wine. Using comparative advantage, show how both gain from trade.',
    'China has an absolute advantage in both goods, so compare opportunity costs. Italy: 1 wine costs 0.25 TVs. China: 1 wine costs 1 TV. Italy has the comparative advantage in wine and China in TVs. If they trade at 1 wine = 0.5 TVs, Italy receives 0.5 TVs for a wine it could only turn into 0.25 TVs at home, and China gets wine for 0.5 TVs instead of 1. These terms favour China but still benefit Italy, and both can consume more of both goods than before trade.',
  ),

  h('The Heckscher-Ohlin model: where comparative advantage comes from'),
  p(
    'The model argues that countries specialise in goods that use intensively the factors of production they have in plentiful supply.',
  ),
  table(
    ['A country with plenty of...', 'tends to specialise in...'],
    [
      ['Labour', 'Labour-intensive goods and services'],
      ['Skilled labour', 'High-value goods and services'],
      ['Sophisticated capital', 'Manufactured goods'],
      ['Land', 'Agricultural goods'],
    ],
  ),

  h('Further limitations of the theory'),
  ul([
    'EXCHANGE RATES: a country may make goods it has no comparative advantage in because its exchange rate has been held at an artificial level.',
    'PROTECTIONISM: tariffs and other barriers can keep a country producing goods in which it lacks comparative advantage.',
    'DISTANCE: countries may import from a nearer producer without comparative advantage because transport costs are lower.',
    'DIFFERENT PRODUCTS: the theory assumes products are identical (homogeneous), but goods from different countries differ in quality and brand, so it is hard to say who has the advantage in a like-for-like comparison.',
    'FACTOR IMMOBILITY: the theory assumes resources shift quickly into the area of advantage. They do not: a PE teacher cannot easily become an economics teacher, and a car plant cannot become a vineyard.',
  ]),
)

/* =================================================================== TERMS OF TRADE */

const termsOfTrade = chapter(
  h('What a change in the terms of trade means, and a worked example'),
  p(
    'An IMPROVEMENT in a country\'s terms of trade means it can export a smaller volume of goods to buy the same volume of imports; a DETERIORATION means it has to export more to afford the same imports.',
  ),
  worked(
    'A country\'s export price index was 104.2 in 2010 and 107.9 in 2020; its import price index was 102.1 in 2010 and 106.8 in 2020. Calculate the change in its terms of trade and say what it means.',
    '2010: 104.2 ÷ 102.1 × 100 = 102.1. 2020: 107.9 ÷ 106.8 × 100 = 101.0. The terms of trade have deteriorated by about 1% (from 102.1 to 101.0), because import prices rose slightly faster than export prices. The country must export a slightly greater volume to afford the same imports.',
  ),
  p(
    'The terms of trade agreed between two countries can also be skewed. Where one country has much more bargaining power, as developed countries often do, it can secure terms that give it most of the gains from trade.',
  ),
)

/* ===================================================================== PROTECTIONISM */

const protectionism = chapter(
  h('The tariff diagram, area by area'),
  p(
    'The convention is to draw the WORLD supply curve as perfectly elastic: world suppliers have a comparative advantage and can meet any quantity the domestic market demands. Without a tariff the country buys at the world price. The tariff raises the price foreign firms must charge, which is shown as an upward shift of the world supply curve to the tariff-inclusive price. Label the areas as follows:',
  ),
  table(
    ['Variable', 'Effect of the tariff'],
    [
      ['Price', 'Rises from P1 to P2'],
      ['Consumption', 'Falls from Q2 to Q4: a contraction along the demand curve'],
      ['Domestic production', 'Rises from Q1 to Q3, as more home firms can supply profitably at the higher price'],
      ['Imports', 'Fall from (Q2 − Q1) to (Q4 − Q3)'],
      ['Consumer surplus', 'Falls by A + B + C + D, because consumers pay more and buy less'],
      ['Producer surplus', 'Rises by area A'],
      ['Government revenue', 'Area C (the tariff per unit multiplied by the remaining imports)'],
      [
        'Deadweight loss',
        'B + D. B is PRODUCTION inefficiency: output made at home that foreign firms could make more efficiently. D is CONSUMPTION inefficiency: consumers who valued the good above the old price but below the new one no longer buy it',
      ],
    ],
  ),
  table(
    ['Winners', 'Losers'],
    [
      [
        'Domestic producers: more market share and revenue',
        'Consumers: higher prices and a smaller quantity',
      ],
      [
        'The government: tariff revenue, a smaller current account deficit, and less spent on benefits as domestic firms employ more people',
        'Foreign firms: lower exports and profits',
      ],
      [
        'Workers in the protected industry: less unemployment and possibly higher wages',
        'Domestic exporters: they may suffer retaliatory tariffs in the long run',
      ],
    ],
  ),

  h('The quota diagram'),
  defn('Quota', 'A physical limit on the quantity of a good that may be imported.'),
  p(
    'Foreign firms can no longer supply unlimited amounts, so the supply curve facing the market becomes domestic supply plus the permitted quantity of imports (a kinked supply curve).',
  ),
  table(
    ['Variable', 'Effect of the quota'],
    [
      ['Price', 'Rises from P1 to P2'],
      ['Consumption', 'Falls from Q2 to Q3'],
      ['Domestic production', 'Rises from Q1 to Q4'],
      ['Imports', 'Fall from (Q2 − Q1) to (Q3 − Q4)'],
      ['Foreign producers still selling', 'They gain a producer surplus of area C, because they are selling at a higher price than before. Unlike a tariff, no revenue goes to the government (unless it auctions the licences)'],
      ['Consumer surplus', 'Falls by A + B + C + D'],
      ['Domestic producer surplus', 'Rises by area A'],
      ['Deadweight loss', 'B + D, as with a tariff'],
    ],
  ),
  p(
    'Winners from a quota are domestic producers and workers, the government through a lower current account deficit and lower unemployment, and foreign firms that still sell into the market at the higher price. Losers are consumers, foreign firms that are shut out, and domestic exporters who may face retaliation. Domestic producers can also become X-inefficient once they are sheltered from competition.',
  ),

  h('More forms of protection, with examples'),
  table(
    ['Type', 'Explanation', 'Example'],
    [
      ['Embargo', 'A ban on imports (or on all trade) in certain goods or with a country', 'The UK ceasing to buy energy from Russia'],
      [
        'Technical barriers to trade',
        'Labelling rules, strict standards for quality and ingredients, and bureaucracy including health, safety and environmental requirements. They raise firms\' costs, and developing countries often find them hard to meet',
        'Refusing chlorine-washed chicken in a trade deal with the US, which protects domestic farmers; banning certain airlines from EU airspace; requiring nutritional labelling',
      ],
      [
        'Export subsidies',
        'A payment to lower producers\' costs and raise exports, which also works to cut imports',
        'The EU\'s Common Agricultural Policy used export subsidies in the past',
      ],
      ['Capital controls', 'Limits on the amount of money that can move in or out of the country', 'Restrictions on moving funds abroad during a currency crisis'],
    ],
  ),

  h('More on the case for and against protection'),
  table(
    ['For', 'Against'],
    [
      [
        'SUNSET industries: protection prevents mass structural unemployment while workers retrain, for example a diesel-car worker learning to build electric cars. A declining industry also shrinks naturally as fewer young people join and older workers retire',
        'ALLOCATIVE inefficiency (areas B and D), and protection can stop new firms entering or prevent the structural change the economy needs',
      ],
      [
        'DUMPING: firms sell abroad below cost because a buffer stock or minimum price scheme has left them with surplus stock, or to drive out competitors, gain market share and raise prices later',
        'X-INEFFICIENCY and DYNAMIC inefficiency: with no foreign competition domestic firms become slack, raising costs and giving no incentive to invest in R&D',
      ],
      [
        'TAX REVENUE: income, corporation and VAT as well as the tariff itself',
        'REGRESSIVE: low-income households spend a larger share of income on goods such as food and clothing',
      ],
      [
        'STRATEGIC industries: a country can lose a war quickly if it lacks food or steel',
        'COST-PUSH inflation: tariffs on imported inputs raise costs; a steel tariff makes stainless steel cookers dearer and can reduce their exports',
      ],
      [
        'NEGATIVE externalities: keeping out illegal drugs, dangerous foods, polluting cars or unsafe airlines. Less trade also means less transport pollution',
        'RETALIATION: a trade war can lose a country its foreign markets. How much depends on the size of the economy and how much it trades with the partner',
      ],
    ],
  ),
  det(
    'Will a tariff actually work?',
    'Its effectiveness depends on two elasticities.',
    [
      'The PRICE ELASTICITY OF DEMAND for imports: if it is inelastic, consumers keep buying the imports after the tariff, so imports fall little, and the tariff mostly raises revenue and prices.',
      'The PRICE ELASTICITY OF SUPPLY of domestic producers: if it is inelastic, domestic firms cannot easily expand output, so the tariff does not switch spending to home production.',
    ],
    'Other points matter too: what the government does with the revenue, how much the country trades with the targeted partner, and the fact that developing countries may be worse off when richer countries impose tariffs on their exports.',
  ),
)

/* ================================================================ TRADING BLOCS AND THE WTO */

const tradingBlocs = chapter(
  h('What economic integration is, and the features of each stage'),
  defn(
    'Economic integration',
    'An agreement among countries in a region to reduce and eventually remove tariff and non-tariff barriers to the free flow of goods, services and factors of production between their economies.',
  ),
  p(
    'Since the Second World War many countries have coordinated their trade policy in blocs. The underlying aim is to let members exploit comparative advantage and specialisation within a larger market.',
  ),
  table(
    ['Stage', 'No internal trade barriers', 'Common external tariff', 'Free movement of factors', 'Common currency', 'Common fiscal policy'],
    [
      ['Free trade area', 'Yes', '', '', '', ''],
      ['Customs union', 'Yes', 'Yes', '', '', ''],
      ['Single (common) market', 'Yes', 'Yes', 'Yes', '', ''],
      ['Monetary union', 'Yes', 'Yes', 'Yes', 'Yes', ''],
      ['Economic (fiscal) union', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
    ],
  ),
  ul([
    'FREE TRADE AREA: members use no protectionist measures between themselves but each sets its own tariffs on outsiders. The UK belonged to one, the European Free Trade Association (EFTA), before joining the EU in 1973, and several members left EFTA to join the EU. NAFTA (since replaced by USMCA) is another example.',
    'CUSTOMS UNION: members also set a COMMON external tariff on non-members. This is necessary to stop goods being routed through the member with the lowest tariff: if Germany taxed American cars at 10% and France at 2%, a firm would send them to France and sell them on into Germany.',
    'COMMON (SINGLE) MARKET: free trade in factor markets as well, such as free movement of labour. The EU also has common rules and regulations, and laws on government procurement so that governments do not always buy from firms in their own country, which lets comparative advantage operate in the public sector too.',
    'MONETARY UNION: a common market with a single currency or permanently fixed exchange rates, such as the eurozone, where the European Central Bank sets interest rates.',
    'FISCAL (FULL ECONOMIC) UNION: a central body has some power over taxation and spending, as in a country with several regions. The UK, with four nations and a government at Westminster controlling many taxes and much spending, is an example.',
  ]),

  h('Trade creation and trade diversion on the diagram'),
  table(
    ['Trade CREATION (a customs union removes a tariff on a more efficient producer)', 'Effect'],
    [
      ['Consumer surplus', 'Rises by A + B + C + D as prices fall'],
      ['Domestic producer surplus', 'Falls by area A, because home firms make less'],
      ['Government revenue', 'Falls by area C, the lost tariff revenue'],
      ['Net gain to society', 'B + D, from comparative advantage and economies of scale'],
    ],
  ),
  p(
    'Trade DIVERSION arises when trade shifts from a more efficient non-member to a less efficient member. Suppose the UK imports steel and before joining a customs union buys from Japan, the cheapest source, with the same tariff on Japan and Germany. Once German steel enters tariff-free, trade is diverted from Japan to Germany, even though Germany is a higher-cost producer.',
  ),
  table(
    ['Trade DIVERSION', 'Effect'],
    [
      ['Consumer surplus', 'Rises by A + B + C + D (prices fall)'],
      ['Government revenue', 'Falls by C + E. C is passed to consumers; E is a pure loss, the extra cost of buying from a less efficient producer'],
      ['Net effect', 'B + D − E'],
    ],
  ),
  tip(
    'A customs union is therefore only beneficial overall if B + D is larger than E. Even so, the extra competition from being in the union can drive efficiency, innovation and lower prices in the long run.',
  ),

  h('Monetary union: when does it work?'),
  table(
    ['Benefit', 'Cost'],
    [
      [
        'Lower TRANSACTION costs: no losing money converting currencies (convert £100 into €120, spend none of it, convert back and you get less than £100)',
        'Members lose the exchange rate as a shock absorber. In a recession a country\'s currency would normally depreciate, helped by lower FDI and interest rate falls, boosting exports. That cannot happen with a shared currency. In the eurozone crisis southern members performed poorly while northern members did well',
      ],
    ],
  ),
  p(
    'A further cost is labour market inflexibility: language barriers, for instance, stop workers moving from Spain, where unemployment is higher, to Germany, where it is lower, so labour mobility cannot do the adjusting that the exchange rate no longer can.',
  ),
  p(
    'For a monetary union to succeed, members need SIMILAR economic conditions, so one interest rate suits them all, and FLEXIBLE product and labour markets, including free movement of labour, so adjustment can happen without exchange rate changes. A fiscal union helps further by transferring money to regions in difficulty.',
  ),

  h('Regional trade agreements: the full balance'),
  table(
    ['Benefit', 'Drawback'],
    [
      ['Trade creation', 'Trade diversion'],
      ['Lower transaction costs, for example no currency exchange', 'Interdependence: problems spread between members'],
      ['Economies of scale from selling to more customers, giving consumers more choice', 'Environmental harm from higher trade and production'],
      ['More competition, making firms more efficient and prices lower, which helps those on low incomes', 'Unemployment in some sectors, among workers who are occupationally immobile'],
      ['Freedom of movement can fill labour shortages', 'Brain drain: poorer members lose their best workers to richer ones where pay is higher'],
      ['Better allocation of resources by comparative advantage', 'They benefit developed more than developing countries, which tend to be left specialising in primary commodities (Prebisch-Singer)'],
    ],
  ),

  h('The WTO: scope and conflicts with regional blocs'),
  p(
    'The WTO promotes free trade by encouraging the removal of protectionism, especially tariffs. It organises trade negotiations and acts as judge in disputes: every member must follow its rules and those who break them can face trade sanctions. It covers services and intellectual property rights as well as goods, and has well over 160 members.',
  ),
  ul([
    'A common external tariff conflicts with the WTO\'s principle of non-discrimination: there is free trade inside the bloc but protection against outsiders.',
    'Agreement is very hard to reach because any single country can block a deal.',
    'The WTO is said to be dominated by developed countries with vested interests, so developing countries rarely get a fair deal.',
  ]),
  p(
    'The effect of the WTO\'s work, the removal of a tariff, is shown on the same tariff diagram used in the protectionism chapter, read in reverse: price falls, consumption and imports rise, and domestic production falls.',
  ),
)

/* ===================================================================== EXCHANGE RATES */

const exchangeRates = chapter(
  h('What moves a floating rate, and converting currencies'),
  table(
    ['', 'Increase in DEMAND for sterling', 'Increase in SUPPLY of sterling'],
    [
      [
        'Reasons',
        'Higher demand for UK exports (for instance because incomes abroad are rising); inward investment (FDI); a rise in Bank Rate, which attracts hot money inflows',
        'Higher imports (for instance because UK incomes are rising), since importers sell pounds to buy foreign currency; a fall in Bank Rate, which causes hot money outflows',
      ],
      ['Result', 'Sterling appreciates', 'Sterling depreciates'],
    ],
  ),
  p(
    'A cut in interest rates can therefore raise consumption and investment directly and raise net exports through the lower exchange rate.',
  ),
  worked(
    'With £1 = 19.33 South African rand, how many rand does Jack get for £250? He returns with 85 rand: what is that worth in pounds?',
    '£250 × 19.33 = 4,832.50 rand. 85 ÷ 19.33 = £4.40. To convert pounds into the other currency multiply by the rate; to convert back, divide.',
  ),

  h('Speculation, shorting and hedging'),
  defn(
    'Speculation',
    'Buying or selling a currency in the expectation that its value will rise or fall, often "trading on news" about the economy.',
  ),
  defn(
    'Shorting',
    'A bet that an asset\'s value will fall. A broker borrows the currency, sells it at the current price (say £20), and later buys it back at the lower price (say £15), returns it and keeps the £5 difference. Shorting sterling means selling it in the hope of buying it back cheaper.',
  ),
  defn('Hedging', 'Protecting yourself against risk, such as a fall in the exchange rate, in effect by taking out insurance. Insurance costs money.'),
  ul([
    'An airline may hedge against volatile fuel prices by buying the fuel it expects to need months in advance.',
    'A US hotel chain that will need to pay a French cheese supplier €50,000 in six months worries that the dollar may fall, making the cheese dearer. It can agree a forward exchange rate now, so the cost in dollars is fixed whatever the dollar does.',
    'Fixed exchange rates mean firms do not need to hedge, which saves the cost.',
  ]),

  h('Fixed rates: why intervene and how'),
  table(
    ['Situation', 'Why the government wants it', 'How the central bank holds the rate'],
    [
      [
        'Keeping the currency LOW (a devaluation, as China has been accused of)',
        'To make exports cheap and boost export industries',
        'If demand pushes the rate up, buy foreign currency (selling its own) and cut interest rates, causing hot money outflows',
      ],
      [
        'Keeping the currency HIGH (a revaluation)',
        'To make imports cheaper',
        'If the currency is pushed down, buy its own currency using foreign reserves and raise interest rates to attract hot money',
      ],
    ],
  ),
  det(
    'Why does China tend to fix its rate against the dollar?',
    'The USA has been the main destination for Chinese exports.',
    [
      'A stable, low rate against the dollar keeps Chinese goods cheap for American buyers and removes exchange rate risk.',
      'The US has argued that this artificial devaluation is anti-competitive and has blamed it for the decline of American manufacturing, which has led to retaliation and trade disputes.',
    ],
    'Both effects can be exaggerated: China has also allowed the yuan to move in a managed way, and many factors besides the exchange rate explain the changes in US manufacturing.',
  ),

  h('Case study: the Exchange Rate Mechanism and Black Wednesday'),
  p(
    'The European Exchange Rate Mechanism (ERM) was a system of fixed but adjustable exchange rates for EU currencies, started in 1979, with all currencies quoted against the German mark. Realignments were allowed where a rate was obviously wrong.',
  ),
  ol([
    'The UK joined in October 1990 at £1 = DM2.95. Many believed sterling was overvalued. The authorities had to intervene if it fell below £1 = DM2.78.',
    'It was the wrong time: the UK was just entering a recession. Interest rates should have been cut to stimulate growth, but had to be kept high to defend the exchange rate.',
    'Sterling came under pressure. After the fall of the Berlin Wall large investment flowed into Germany, raising the mark and lowering the pound against it, and speculators who thought sterling overvalued sold it short, expecting the UK to leave the ERM.',
    'The government sold foreign currency to buy sterling and raised interest rates sharply, even though the economy was in recession, to attract hot money and raise demand for pounds.',
    'It could not hold. On 16 September 1992, "Black Wednesday", the UK left the ERM. Sterling fell by around 15% against the mark and has floated ever since, and speculators made large profits.',
  ]),
  tip(
    'To explain why the pound fell: speculators sold sterling in huge volumes, so the SUPPLY of pounds rose far beyond the demand, and the central bank\'s buying of pounds from limited reserves and its higher interest rates were not enough to offset it.',
  ),

  h('Floating against fixed: the full comparison'),
  table(
    ['Floating: advantages', 'Floating: disadvantages'],
    [
      [
        'ADJUSTS to external shocks: if exports fall because of a recession abroad, demand for pounds falls and the pound depreciates, cushioning the loss by making exports cheaper',
        'It depends on what the authorities do with their freedom: without a rate to defend they may cut interest rates too far, causing inflation that squeezes living standards',
      ],
      [
        'MONETARY POLICY is free to pursue domestic objectives, with no need to set rates to defend a target',
        'A country may lean on a LOW currency to stay competitive and neglect supply-side policy, although productivity and skills attract more stable FDI than an unsustainably low rate does',
      ],
      [
        'It CUSHIONS trade changes: a rise in incomes raises imports and the supply of pounds, so the pound falls and net exports fall by less',
        'Exchange-rate-sensitive sectors can suffer hysteresis: when the currency appreciates demand for their output falls, the derived demand for labour falls, and occupational immobility can cause structural unemployment. Even infant industries that might have benefited can struggle against rivals with large economies of scale',
      ],
    ],
  ),
  table(
    ['Fixed: advantages', 'Fixed: disadvantages'],
    [
      [
        'LESS UNCERTAINTY: stable prices for exports and imports encourage trade',
        'It needs large FOREIGN EXCHANGE RESERVES to defend the rate, which have an opportunity cost',
      ],
      [
        'LOWER COSTS of trade: firms do not have to pay for hedging',
        'Other countries may RETALIATE against an artificially low rate, as the US and EU have threatened with tariffs on Chinese goods',
      ],
      [
        'PRODUCTIVITY: firms cannot rely on depreciation to stay competitive, so must raise productivity through training and capital',
        'LOSS of control of monetary policy, which must serve the exchange rate target. It is also open to SPECULATIVE ATTACKS',
      ],
    ],
  ),

  h('The J-curve and the Marshall-Lerner condition in more detail'),
  table(
    ['Why a depreciation first WORSENS the current account', 'Explanation'],
    [
      ['Information failure', 'Buyers do not see the change at once and keep buying in similar volumes, so export revenue falls and the import bill rises'],
      ['Necessity', 'Some goods must still be imported whatever their price, such as oil, so import spending rises'],
      ['Contracts', 'Much trade is on long-term contracts (the UK buys gas on 10-year contracts), so volumes cannot switch quickly. Export demand rises less than proportionally and export revenue falls'],
    ],
  ),
  p(
    'The recovery stage of the curve follows as information failure fades, domestic firms begin making goods that were previously imported, and contracts expire.',
  ),
  p(
    'The Marshall-Lerner condition concerns VALUE, not volume. Net exports = (PX × QX) − (PM × QM). After a depreciation, if import demand is inelastic the import bill RISES (a higher price, with volumes falling by less in proportion). If export demand is inelastic, export revenue FALLS (a lower foreign price, with volumes rising by less in proportion). The current account therefore improves only if the sum of the two elasticities exceeds 1.',
  ),
  table(
    ['How much a depreciation helps depends on', 'Why'],
    [
      ['The size of the change', 'A small movement has a small effect'],
      ['The time period', 'Short-term movements rarely harm the economy; a sustained change exposes underlying weakness and affects investor confidence'],
      ['The industry', 'Firms reliant on imported raw materials, usually in manufacturing, are hit hardest'],
      ['Spare capacity', 'With spare capacity and a significant multiplier the economy gains and the effect on prices is small, provided it does not depend heavily on imports'],
      ['Which currency', 'The UK trades mostly with the EU, so a rise of the pound against the euro hurts UK manufacturers most'],
      ['Non-price factors', 'If exports are high quality and well differentiated, the exchange rate matters much less'],
    ],
  ),
  table(
    ['Costs of a depreciation', 'Explanation'],
    [
      ['Inflation', 'Demand-pull from higher net exports and the multiplier, and cost-push from dearer imported inputs such as raw materials'],
      ['Consumer welfare', 'Imports cost more, so material living standards fall. People may have to buy lower-quality domestic goods and have less variety to choose from'],
      ['Overseas travel', 'Foreign holidays become dearer'],
    ],
  ),

  h('Appreciation: winners, losers and what it depends on'),
  table(
    ['Drawbacks of an appreciation', 'Benefits of an appreciation'],
    [
      [
        'Exports become more expensive and imports cheaper, so net exports fall; unemployment rises and actual growth is lower',
        'Less demand-pull inflation, cheaper imports and less cost-push inflation (cheaper imported inputs). Foreign travel is more affordable for UK holidaymakers',
      ],
    ],
  ),
  p(
    'Whether an appreciation helps or hurts depends on the currency it is against (against major trading partners it is more damaging), incomes overseas, how long it lasts, the J-curve (if export demand is inelastic the damage is smaller), and non-price competitiveness. A sustained appreciation can even force firms to raise their productivity to survive.',
  ),
)

/* ===================================================== INTERNATIONAL COMPETITIVENESS */

const internationalCompetitiveness = chapter(
  h('Labour costs in full, and unit labour costs worked'),
  p(
    'Labour is a large share of most firms\' total costs, so it strongly affects competitiveness both at home and abroad. Wages are not the only labour cost. Others are recruiting and training workers, employer National Insurance contributions, redundancy payments and benefits in kind.',
  ),
  defn('Unit labour cost', 'The average cost of labour per unit of output: total labour cost ÷ output.'),
  worked(
    'A firm has labour costs of £250,000 and produces 1,500 products. Calculate its unit labour cost. How can its labour costs be falling while wages are rising?',
    '£250,000 ÷ 1,500 = £166.67 per product. If output per worker per hour (productivity) rises faster than wages, the labour cost of each unit falls even though workers are paid more.',
  ),
  det(
    'Why are unit labour costs relatively high in the UK?',
    'These are the arguments usually made.',
    [
      'A high cost of living, especially housing, pushes wages up so that workers can afford a minimum standard of living.',
      'The National Living Wage stops employers paying very low wages, and this also lifts pay further up the scale to preserve differentials.',
      'Relatively high taxes fund extensive public services, which raises non-wage labour costs.',
      'Productivity is comparatively low: because of weaker infrastructure and lower investment in physical capital than in countries such as Germany, and it is argued by some that strong employment protection reduces the pressure to work hard.',
    ],
    'Each is contested. Higher wages can reflect higher skills, and strong employment protection can raise productivity by encouraging investment in training. The most robust point is the productivity gap.',
  ),

  h('More factors that determine competitiveness'),
  table(
    ['Factor', 'Explanation'],
    [
      ['Education and the ability to attract skilled labour', 'A more skilled workforce is more productive and produces better-quality goods. Skilled workers from abroad can fill skills gaps'],
      ['Flexibility of labour', 'Part-time and temporary contracts, and geographical and occupational mobility, reduce unit labour costs'],
      ['R&D and investment', 'More R&D produces higher-quality products; investment in new capital allows output at lower cost'],
      ['Infrastructure', 'Good airports and motorways keep costs down and improve delivery times'],
      [
        'Government policy',
        'A low income tax rate attracts skilled migrants; a low corporation tax rate attracts business investment. Excessive regulation (red tape), such as strict employment or environmental rules, raises costs and discourages firms from locating in the country',
      ],
      ['Economic stability', 'Low, stable inflation and sustainable growth give firms the confidence to invest'],
    ],
  ),
  p(
    'Being internationally competitive pays off in higher exports and growth, job creation and higher living standards in export industries, and FDI attracted by a competitive environment.',
  ),
)

export const ECON_MASTER_T4_NOTES = {
  'International Competitiveness': internationalCompetitiveness,
  'Exchange Rates': exchangeRates,
  'Trading Blocs and the WTO': tradingBlocs,
  'Protectionism and Trade Restrictions': protectionism,
  Globalisation: globalisation,
  'International Trade': internationalTrade,
  'Terms of Trade': termsOfTrade,
}
