/*
  Theme 1 (introduction to markets and market failure), from the MASTER
  course documents.

  Masters 1 to 22 - Economics as a Social Science through Economic
  Efficiency and Resource Allocation - read end to end against what each
  chapter already said. Like the other MASTER files it adds only what was
  missing or thinner than the source and is merged onto the END of each
  chapter.

  What it adds, chapter by chapter:

    Methodology and the   models and hypotheses; the day-care fines case;
    Economic Problem      why economics is not a laboratory science; sixteen
                          positive and normative statements classified; wants
                          against needs; factors of production in four
                          businesses; specialisation worked with numbers,
                          its costs and benefits for individuals and firms,
                          and job rotation.
    Rational Decision     the objectives of households, firms and government;
    Making                why each may not maximise; two worked cases.
    Production            reading opportunity cost off the frontier; a
    Possibility           technology pivot; free against economic goods;
    Frontiers             sustainability.
    Demand                individual to market demand; ceteris paribus;
                          joint, competitive and composite demand; shift
                          against movement scenarios; marginal utility.
    Supply and            competitive and joint supply; twelve shift
    Elasticity of Supply  scenarios; PES calculations; why the determinants
                          may fail; why PES is useful to a firm.
    Price Determination   market clearing; adjustment above and below the
    and the Price         equilibrium; fixed supply (Olympic tickets); the
    Mechanism             four cases; applied cases; evaluating supply and
                          demand analysis; effects on related markets.
    Price, Income and     a classroom elasticities experiment; PED and
    Cross Elasticities    revenue in practice; luxury watches and bread;
    of Demand             who bears a cost rise; YED and XED worked cases,
                          what an income change means for a firm, testing
                          the determinants, and the uses of each.
    Consumer and          why firms cannot price each buyer separately;
    Producer Surplus      price changes and surplus; where a producer's
                          minimum price comes from; four applied cases.
    Externalities         the cost-benefit curves; private and external
                          effects in the four cases; swimming; four
                          scenarios.
    Economic Systems      market, command and mixed economies: definitions,
                          advantages and disadvantages, and applied
                          questions on incentives.
    Public Goods and      information failure and its limits; merit and
    Information Gaps      demerit goods evaluated; public, quasi-public and
                          private goods; government provision weighed.
    Government            tax types and analysis; subsidies; regulation
    Intervention in       against eight market failures; tradable permits
    Markets               (and Kyoto); state provision; information
                          campaigns; minimum and maximum prices.
    Government Failure    maximum rents; more causes and the consequences.
*/

import { h, p, ul, ol, defn, det, worked, tip, table, chapter } from './econ-notes-build'

/* =============================================== METHODOLOGY AND THE ECONOMIC PROBLEM */

const methodology = chapter(
  h('Models, hypotheses and assumptions'),
  defn(
    'Model',
    'A hypothesis about behaviour that can be tested, supported, amended or rejected through empirical testing, usually with statistical methods.',
  ),
  p(
    'A hypothesis changes as evidence arrives. "Consumers always react to price cuts by demanding more" is too strong; "in most cases consumers will react to price cuts by demanding more" is the same hypothesis AMENDED to fit the evidence. A model is like an architect\'s model of a planned building: it lets people see how the real thing will look and raise objections before anything is built.',
  ),
  p(
    'Economists often attract criticism because models give conflicting predictions. Different models forecast very different consequences of Brexit, for instance, some strongly negative and some positive, because they rest on different assumptions.',
  ),
  defn('Assumptions', 'The assumed behaviour of consumers and businesses, such as that individuals want to maximise their satisfaction (utility).'),
  det(
    'When the assumption is wrong: the day-care fines study',
    'A day-care centre that had a problem with parents arriving late introduced a fine for lateness.',
    [
      'The assumption was that the fine would be a disincentive, so fewer parents would be late.',
      'In fact more parents arrived late. They treated the fine as a PRICE for extra childcare and were happy to pay it, and the moral pressure not to inconvenience staff disappeared.',
    ],
    'It is a standard illustration that incentives work through people\'s perceptions, and that models assuming people respond only to money can predict the wrong direction. It is also why behavioural economics matters.',
  ),
  p(
    'Ceteris paribus isolates one variable, for example how much quantity demanded changes when price changes. But in real life other things (such as incomes) change at the same time. This is a fundamental reason economics is unlikely to become a true laboratory science: controlled experiments that can be repeated are not possible, so economics relies on natural experiments, real events that cannot be rerun in the same conditions.',
  ),
  table(
    ['Advantage of models', 'Limitation of models'],
    [
      ['A framework for understanding economic events', 'Simplifications of reality that cannot capture every complexity'],
      ['They allow predictions, testing of theories and guidance for policy', 'Assumptions such as rational behaviour can be unrealistic and lead to inaccurate predictions'],
    ],
  ),

  h('Positive and normative: classifying statements'),
  p(
    'A POSITIVE statement can be tested against evidence, so it can be shown to be true or false (a positive statement can still be wrong). A NORMATIVE statement is a value judgement, an opinion. Positive statements usually have the form "if X happens, then Y will follow"; normative ones use words such as should, ought, must, think and would.',
  ),
  table(
    ['Statement', 'Type', 'Why'],
    [
      ['A fall in incomes will lead to a rise in demand for own-label supermarket food', 'Positive', 'A testable prediction'],
      ['Unemployment is more harmful than inflation', 'Normative', 'A judgement about which is worse'],
      ['Higher interest rates will reduce house prices', 'Positive', 'Can be checked against data'],
      ['The government should enforce minimum prices for beer to control alcohol consumption', 'Normative', 'Says what ought to be done'],
      ['A rise in average temperatures will increase demand for sun screen', 'Positive', 'A testable relationship'],
      ['The congestion charge should rise to £25', 'Normative', '"Should" signals an opinion'],
      ['A car scrappage scheme will lower the price of second-hand cars', 'Positive', 'An if-then prediction'],
      ['The government should increase the living wage to £9 an hour to reduce poverty', 'Normative', 'A policy judgement, even though it refers to a goal'],
      ['The retirement age should be raised to 70', 'Normative', 'A value judgement'],
      ['Income inequality exists in all countries', 'Positive', 'Testable, whether or not it turns out to be true'],
      ['Income inequalities should be reduced', 'Normative', 'A judgement about what is desirable'],
      ['People smoke less because of the higher price of cigarettes', 'Positive', 'A claim about cause and effect that data can test'],
    ],
  ),
  p(
    'Economists are interested in positive statements because they can be tested with statistics. They are interested in normative statements because they influence decisions, and because many can be MODELLED and turned into positive ones: "the government should raise the living wage" becomes "a 10% rise in the living wage will reduce the poverty rate by 5%", which can be tested.',
  ),

  h('Wants, needs and the economic problem'),
  defn('Need', 'Something essential to survival, such as food, water, warmth, clothing, shelter and sanitation.'),
  defn('Want', 'Something you would like to have but that is not essential for survival, such as a car, a phone or chocolate.'),
  p(
    'Economists exist because of scarcity: the gap between limited resources and theoretically limitless wants. After the financial crisis the Chancellor had to choose how to cut the deficit while facing unlimited demands for spending, which is the same problem at the level of the whole economy.',
  ),
  worked(
    'Use the basic economic problem to explain why a government may not fund HS2 now despite its obvious benefits.',
    'The government has a limited budget, roughly what it raises in taxation plus what it can borrow, and many competing uses for it. It must meet basic needs first, such as the NHS and the benefits that keep people from destitution, before spending on faster journeys, which are more a want. Every £1,000 spent on HS2 is £1,000 not spent on healthcare or relief: that is the opportunity cost.',
  ),
  p(
    'The four factors of production matter in both QUANTITY and QUALITY: a country can have a huge workforce that is mostly unskilled, or plenty of capital that is poor in quality. Each of the four appears in every business:',
  ),
  table(
    ['Business', 'Its factors of production'],
    [
      ['A supermarket chain', 'LABOUR: checkout staff, delivery drivers, bakers. LAND: the store sites, and natural resources such as fish. CAPITAL: tills, freezers. ENTERPRISE: the chief executive and managers'],
      ['A car manufacturer', 'LABOUR: factory workers, engineers, salespeople. LAND: the factory site and showrooms. CAPITAL: production lines. ENTERPRISE: the chief executive'],
      ['A high-street bank', 'LABOUR: bankers, cleaners. LAND: branches and head office. CAPITAL: computers. ENTERPRISE: the chief executive and directors'],
      ['A football club', 'LABOUR: players, groundsmen. LAND: the pitch and stadium. CAPITAL: mowers, training equipment. ENTERPRISE: the owners'],
    ],
  ),

  h('Specialisation worked with numbers'),
  defn('Specialisation', 'When individuals, firms or countries concentrate on producing one product or task.'),
  ul([
    'Two FORMS: by PRODUCT (concentrating on cars rather than cars and televisions) and by PROCESS (concentrating on one part of making a car, such as the wheels).',
    'Three LEVELS: an individual (teaching A level economics), a firm (a computer retailer that does not also sell pets) and a country (Britain in financial services, Barbados in holidays).',
    'Division of labour is the breaking down of production into many separate tasks, as in a fast-food restaurant, where one worker takes orders, one cooks and one fries.',
    'Workers are best allocated by RELATIVE opportunity cost: put each person where their skills are relatively greatest, so the training and talent forgone is least. An economics specialist teaching history wastes years of subject training.',
  ]),
  worked(
    'Countries A and B each have 400,000 workers and each makes 50 million toy helicopters a year, selling at £100. In A it takes 100,000 workers to make the shells and 300,000 to fit the electrics; in B it takes 300,000 for the shells and 100,000 for the electrics. Calculate income per head now, and after specialising and trading.',
    'Now: 50m × £100 = £5bn, so income per head = £5bn ÷ 400,000 = £12,500. After: A puts all 400,000 workers on shells (100,000 workers make 50m, so 400,000 make 200m shells) and B puts all 400,000 on electrics (200m fittings). Together they make 200m complete helicopters, so each ends up with 100m. Income = 100m × £100 = £10bn, and income per head = £10bn ÷ 400,000 = £25,000: DOUBLE. The difference in cost between A and B might reflect A having sophisticated capital for shells and B having a skilled vocational workforce for electrics.',
  ),
  p(
    'Specialisation raises the level and quality of output for three reasons: repetition improves skill and speed; time is saved by not switching tasks; and people concentrate on what they are best at.',
  ),
  table(
    ['Effect on the individual: advantages', 'Effect on the individual: disadvantages'],
    [
      ['Higher productivity supports higher wages and stronger bargaining power, because losing you would visibly cut output', 'Workers can be replaced by capital and lack occupational mobility if demand falls, even skilled workers such as tailors whose skills became obsolete'],
      ['Doing what you are good at may raise job satisfaction, and greater skill should reduce the risk of unemployment', 'Repeating the same task can bore workers and cut motivation, especially in low-skilled manual jobs'],
    ],
  ),
  table(
    ['Effect on the firm: advantages', 'Effect on the firm: disadvantages'],
    [
      ['Higher quality allows higher prices and revenue', 'Reliance on specialised workers: if one is ill or leaves, production may stop'],
      ['Lower unit costs, and lower training costs because staff stay longer', 'Skilled specialists can demand higher wages, knowing production would halt without them'],
      ['Better output can raise market power and help beat rivals', 'A narrow product range is vulnerable to a change in demand or a product becoming obsolete'],
    ],
  ),
  tip(
    'The judgement on specialisation for a firm depends on how much wages rise. If specialists force up pay by more than the productivity gain saves, the benefit is cancelled out.',
  ),
  ul([
    'JOB ROTATION cuts the risk of relying on one person (if the baker does not turn up, someone else can cover) and can raise motivation in repetitive jobs, which can offset the loss of specialisation gains.',
    'Countries specialise too. Saudi Arabia specialises in oil: the revenue buys imports of goods it does not make, and other countries get a vital input. It is investing in education, tourism and healthcare to diversify, because oil prices are volatile and oil will eventually run out.',
    'A country that becomes much more specialised, such as Egypt with its tourism colleges, gets more and better output from its resources, but risks labour immobility (as in the coal mines) and a lack of sustainability if what it specialises in is not renewable.',
  ]),
)

/* ======================================================= RATIONAL DECISION MAKING */

const rationalDecisionMaking = chapter(
  h('The objectives of the three economic agents'),
  table(
    ['Agent', 'Maximises', 'A trade-off it faces'],
    [
      [
        'Households',
        'UTILITY (satisfaction): they earn income to buy goods and services',
        'A household will not take an expensive luxury holiday if it means living in poverty for the rest of the year',
      ],
      [
        'Firms',
        'PROFIT (total revenue minus total cost), which can be reinvested to raise quality or cut costs, or paid out to owners',
        'New equipment has an upfront cost but makes production cheaper later',
      ],
      [
        'Government',
        'WELFARE: growth, lower inequality and unemployment, protecting the environment. It shapes resource allocation through state provision, subsidies and bans',
        'Money spent in one area is not available elsewhere',
      ],
    ],
  ),

  h('Why agents may not maximise'),
  table(
    ['Households may not maximise utility because of', 'Explanation'],
    [
      ['Social norms', 'Convention restricts choices. People tip in restaurants even when the service was poor'],
      [
        'Inertia and risk aversion',
        'People stick with what they know out of loyalty or ease. Risk aversion makes them avoid options that could give more satisfaction: some travellers avoided flying to the USA after 9/11 even though the holiday would have been enjoyable',
      ],
      ['Impulse', 'People take short-term choices that reduce long-term welfare, such as a poor diet or smoking'],
      ['Lack of information', 'People may not know that something is cheaper elsewhere, or which energy provider is cheapest, so they do not maximise within their budget'],
    ],
  ),
  ul([
    'FIRMS may not maximise profit because of inertia and loss aversion, a lack of information, or alternative objectives such as survival and satisficing.',
    'GOVERNMENTS may not maximise welfare because of the political cycle (decisions to win elections rather than for overall welfare), uncertainty about the future (financial deregulation was meant to promote growth and jobs but contributed to the financial crisis), and incentive problems (education is free yet many people do not use it as intended).',
  ]),
  worked(
    'Unusually heavy snow fell in April 2018, and in April 2019 bookings for short breaks in Leeds, normally popular at Easter, fell sharply. Why might this have happened, and is it rational?',
    'Consumers remembered the snow and expected it again. It is irrational: 2018 was an unusual year and did not make snow in 2019 any more likely. Decisions were driven by the most recent and vivid event rather than by the true probability, which is known as recency bias.',
  ),
  worked(
    'A firm such as The Body Shop uses ethical suppliers, which raises its costs. How can this still be rational?',
    'Consumers are willing to pay a premium for products seen as ethical, so the higher costs can be covered, and may even be exceeded, by higher revenue and profit. The firm is still maximising profit, but through a differentiated, higher-priced product.',
  ),
)

/* ===================================================== PRODUCTION POSSIBILITY FRONTIERS */

const ppf = chapter(
  h('Reading opportunity cost off the frontier'),
  p(
    'Suppose an economy makes only TVs and sunglasses and moves from point A to point B to produce more sunglasses. The opportunity cost is the number of TVs given up: (TV1 − TV2), because factors of production must be moved from TV production to make the extra (S2 − S1) sunglasses. "Trade-off" is sometimes used for the same idea: the benefit of more of one good is weighed against the output sacrificed of the other.',
  ),
  p(
    'The curve bows outwards because people and resources differ in what they are good at, and those skills are not perfectly interchangeable. Near full specialisation in sunglasses, the workers moved are the ones best at making TVs, so a large number of TVs is lost for a small number of extra sunglasses. Further from specialisation the same gain in sunglasses costs far fewer TVs.',
  ),

  h('Technology that helps only one good'),
  det(
    'A new machine that speeds up part of sunglasses production',
    'The frontier does not shift evenly: it pivots.',
    [
      'The OPPORTUNITY COST of sunglasses falls, because fewer TVs must be sacrificed for each extra pair.',
      'Sunglasses can now be made with fewer resources, so resources can be moved away from them to make more TVs as well: more of BOTH goods become possible at most points on the curve.',
      'The frontier swings out along the sunglasses axis but the TV intercept does not move.',
    ],
    'An economy that makes only TVs gains nothing from the invention, because it uses none of the improved process. This is why growth in capacity is not always shared evenly across what an economy produces.',
  ),

  h('Free goods, economic goods and sustainability'),
  defn('Free good', 'A good with zero opportunity cost: there is no scarcity attached to its production or consumption, as with air.'),
  defn(
    'Economic good',
    'A good that is scarce, so that its production or consumption has an opportunity cost. It is scarcity that makes it valuable and means people will pay for it.',
  ),
  det(
    'The sustainability of choices about scarcity',
    'Choices made now can change scarcity for people in the future.',
    [
      'Expanding oil production to meet rising demand in fast-growing Asian economies helps satisfy present wants, but uses up a finite resource and so increases its scarcity for future generations. That is not sustainable.',
      'There can be a conflict between scarcity now and scarcity later. Moving resources from capital goods to consumer goods meets more of today\'s wants. But if worn-out capital is not replaced, the PPF shifts INWARDS, and future generations can produce less.',
    ],
    'Technology and substitutes can reduce the problem: new energy sources can replace oil, and investment in clean technology can raise future capacity. The question is whether the resources and capital are being replaced as fast as they are used.',
  ),
)

/* ============================================================================= DEMAND */

const demand = chapter(
  h('From individual to market demand, and effective demand'),
  p(
    'Market demand is the sum of everyone\'s individual demand at each price: at 40p, add up how many cans of Coke each person would buy. Individual curves differ because people have different incomes, tastes and circumstances, so the market curve smooths out those differences into a single downward-sloping line, which this course draws as a straight line for simplicity.',
  ),
  p(
    'Wanting something is not demand. Someone who would love a Ferrari but has no money does not add to demand, because demand must be EFFECTIVE: the consumer must be both willing and able to pay, whether from income or from borrowed money.',
  ),
  det(
    'Is the law of demand useless if sales fall when the price falls?',
    'No: the law holds only ceteris paribus.',
    [
      'The inverse link between price and quantity demanded assumes that every other influence on demand stays the same.',
      'If ice-cream sales fall despite a price cut, it may simply be raining: demand has SHIFTED left for a non-price reason, which outweighs the movement along the curve.',
    ],
    'This is why a prediction from the model can fail without the model being wrong. It also explains why economists test relationships statistically, controlling for other factors, rather than reading single events.',
  ),

  h('Three types of demand'),
  table(
    ['Type', 'Meaning', 'Examples'],
    [
      ['Joint demand', 'Goods demanded together, which are complements: buying one means needing the other', 'Printers and ink; a games console and its games; a phone and its charger'],
      ['Competitive demand', 'Goods that compete to do the same job, which are substitutes', 'Galaxy and Dairy Milk; Red Bull and Monster; Uber and London taxis or buses'],
      ['Composite demand', 'A single good with several different uses', 'Oil (petrol, cooking, plastics); water (drinking, sanitation, agriculture); steel; milk; apples'],
    ],
  ),

  h('Shift or movement? Worked scenarios'),
  table(
    ['Scenario', 'Effect', 'Why'],
    [
      ['The price of Coco Pops falls (demand for Crunchy Nut)', 'Shift LEFT', 'A substitute got cheaper, so some buyers switch away'],
      ['The UK population rises', 'Shift RIGHT', 'More consumers at every price'],
      ['Health concerns grow about sugary cereals', 'Shift LEFT', 'A change in tastes'],
      ['The price of milk falls', 'Shift RIGHT', 'Milk is a complement, so the combined cost of the meal falls'],
      ['Crunchy Nut itself becomes dearer', 'No shift: a CONTRACTION along the curve', 'Only the good\'s own price has changed'],
      ['Holidays to Florida get much cheaper (demand for self-catering in Venice)', 'Shift LEFT', 'A substitute destination has become cheaper'],
      ['The price of holidays to Rome rises (demand for Venice)', 'Shift RIGHT', 'A substitute has become dearer, so some switch to Venice'],
      ['A food-poisoning outbreak in Venice makes the news', 'Shift LEFT', 'A fall in the popularity of the destination'],
    ],
  ),
  worked(
    'Waitrose cuts the price of its Honey Nut cereal from £2.50 to £2 while Crunchy Nut stays at £4. What happens to each, and why might the actual change in Honey Nut sales differ from the expected one?',
    'The two are substitutes. For Honey Nut there is a MOVEMENT (an extension of quantity demanded) because its own price changed. For Crunchy Nut there is a SHIFT left, because the price of a substitute (a non-price factor) changed. The actual change for Honey Nut could differ because ceteris paribus may not hold (for example negative publicity about Waitrose at the time) or because the two are not perfect substitutes, and brand loyalty to Crunchy Nut stops some buyers switching.',
  ),
  p(
    'Inferior goods are bought because better alternatives cannot be afforded. Bus travel outside London is an example: as incomes rise people buy cars or use taxis, so demand falls. The label is subjective, though. A holiday at a three-star resort might be inferior to a very wealthy household and a luxury to a working family.',
  ),

  h('Marginal utility, worked'),
  p(
    'The MARGINAL PRINCIPLE says economic agents decide by weighing the effect of small changes from where they are: shall I eat another chocolate bar, hire another worker, spend another £20bn on the NHS?',
  ),
  defn('Marginal utility', 'The additional utility gained from consuming one more unit of a good or service.'),
  defn(
    'Law of diminishing marginal utility',
    'As more units are consumed, the utility from each additional unit falls.',
  ),
  table(
    ['Chocolate bars', 'Total utility (utils)', 'Marginal utility (utils)'],
    [
      ['1', '20', '20'],
      ['2', '35', '15'],
      ['3', '41', '6'],
      ['4', '44', '3'],
      ['5', '46', '2'],
      ['6', '47', '1'],
    ],
  ),
  p(
    'Marginal utility = the change in total utility. The fourth bar adds 44 − 41 = 3 utils. Marginal utility can even go NEGATIVE: if a bar makes you feel ill, total utility falls.',
  ),
  det(
    'Why the marginal utility curve is the demand curve',
    'A consumer will buy as long as the marginal utility of the next unit, valued in money, is at least the price.',
    [
      'Marginal utility is the value the consumer puts on the next unit.',
      'If the price is above that value, the consumer will not buy it; if the price is below it, the consumer wants more.',
      'So the consumer stops where price = marginal utility, which traces out the downward-sloping demand curve.',
    ],
    'Utility cannot be measured directly, so this is a model of behaviour, not a measurement. Real consumers also face habits, limited information and budget constraints that the simple model ignores.',
  ),
)

/* ========================================================== SUPPLY AND ELASTICITY OF SUPPLY */

const supply = chapter(
  h('Types of supply, and what else shifts it'),
  p(
    'Producers decide whether to supply by looking at profit (total revenue minus total cost). Two relationships between goods affect supply:',
  ),
  table(
    ['Type of supply', 'Meaning and example', 'Effect of a rise in the price of the related good'],
    [
      [
        'Competitive supply',
        'Firms can use the same resources to make alternative products: a farmer can grow onions or peppers on the same land',
        'Resources switch to the product whose price rose, so the supply of the OTHER good falls (shifts left)',
      ],
      [
        'Joint supply',
        'One good is a by-product of making another: cattle produce both milk and leather',
        'A higher price for one raises output of both, so the supply of the by-product rises (shifts right)',
      ],
    ],
  ),
  p(
    'Movements and shifts work as for demand. A change in the good\'s own price causes a movement: an EXTENSION of supply when the price rises, a CONTRACTION when it falls. A change in a non-price factor, usually a cost of production, shifts the curve, so more or less is supplied at every price. The most important cause of shifts is a change in costs, which can fall because of technological progress, globalisation (production in lower-wage countries) or lower wages (for example, immigration widening the labour supply).',
  ),
  worked(
    'After a takeover a film studio\'s costs fall because many functions are combined. How should this affect its supply in theory, and why might consumers see no change in price in practice?',
    'In theory, lower costs mean higher profit at every price, so supply shifts right and firms, as profit maximisers, supply more. In practice the market is imperfectly competitive, so the firm is not forced to pass the cost saving on, and it may keep prices unchanged because charging what the market will bear maximises its profit.',
  ),
  worked(
    'Explain, using supply curves, why a machine costing £10,000 in 1970 could do what a calculator costing £100 in 1975, and about £5 today, can do.',
    'Technology has steadily improved, lowering the cost of production and shifting supply to the right again and again. With demand unchanged or growing more slowly, the equilibrium price falls each time, so essentially the same product now sells for a tiny fraction of its original price.',
  ),
  table(
    ['Event', 'Effect on supply', 'Reason'],
    [
      ['Extreme weather cuts the Dutch carrot harvest by 46%', 'Shift LEFT', 'Less can be produced at each price, so it is less profitable and producers cut back or leave'],
      ['New grass strains let Brazilian ranches feed more cattle per hectare', 'Shift RIGHT', 'Less land is needed, so costs fall and supply increases'],
      ['Government releases surplus public land for housing', 'Shift RIGHT', 'Developers face less competition for scarce land, so costs fall'],
      ['Ice-cream price rises because demand has risen', 'Movement: EXTENSION', 'A change in the good\'s own price'],
      ['Two Asian airlines enter the London to New York market', 'Shift RIGHT', 'More firms in the market'],
      ['Floods destroy cotton crops across Asia (clothing)', 'Shift LEFT', 'Higher input costs'],
      ['A council relaxes planning rules (new flats to rent)', 'Shift RIGHT', 'Lower regulatory costs'],
      ['Tighter environmental rules restrict where oil can be drilled', 'Shift LEFT', 'Higher costs and less output possible'],
      ['The world price of yeast rises (white bread)', 'Shift LEFT', 'A rise in input costs'],
      ['Technology reduces the plastic needed per water bottle', 'Shift RIGHT', 'Lower cost per unit'],
      ['Falling productivity among cocoa farmers (organic chocolate)', 'Shift LEFT', 'Higher cost of inputs'],
      ['A 10% tax on high-fat frozen foods, including pizza', 'Shift LEFT', 'The tax is a cost of supplying'],
    ],
  ),

  h('Price elasticity of supply: calculations'),
  worked(
    'A rise in price from £26 to £34 raises the supply of hoodies from 18,000 to 25,000. Calculate PES.',
    '%ΔQs = 7,000 ÷ 18,000 = 38.9%. %ΔP = 8 ÷ 26 = 30.8%. PES = 38.9 ÷ 30.8 = 1.26. It is above 1, so supply is elastic.',
  ),
  worked(
    '100,000 football shirts are sold a year and PES is 0.64. The price rises 10%. What happens to the quantity supplied?',
    'Quantity supplied rises by 0.64 × 10% = 6.4%, so new supply = 100,000 × 1.064 = 106,400 shirts. Supply is inelastic, so the quantity responds by less than the price.',
  ),
  worked(
    'Last year at £10 a seller supplied 342 talking clocks. PES is 0.84 and the price has fallen to £8.50. How many will be supplied?',
    'The price change is −15%, so the change in quantity supplied is 0.84 × −15% = −12.6%. New supply = 342 × (1 − 0.126) = about 299 clocks.',
  ),
  p(
    'PES is positive because supply slopes upwards. For UK housing PES is thought to be low, around 0.5: supply cannot respond in proportion to demand, so prices rise a lot over time. For a firm a high PES is desirable, because it can sell far more quickly when prices rise and cut back when prices fall.',
  ),
  det(
    'The same 20% rise in demand for cookies and for air travel',
    'The size of the price effect depends on how elastic supply is.',
    [
      'COOKIES: supermarkets can bake more easily and the ingredients are readily available. Supply is elastic, so quantity rises by more than the price does.',
      'AIR TRAVEL: planes are scarce and take months to build, and landing slots are limited unless new runways or airports are added. Supply is inelastic, so quantity can rise only a little and the price must rise substantially.',
    ],
    'In the long run air travel supply becomes more elastic, as aircraft are ordered and runways built, so the price effect shrinks over time.',
  ),

  h('When the determinants of PES do not apply'),
  table(
    ['Determinant', 'Why it may not hold'],
    [
      ['Spare factors of production', 'Spare capacity does not guarantee elastic supply if it cannot be fitted into the production process, as in knowledge-intensive sectors using highly specialised capital'],
      ['Stocks of the product', 'Stocks may be perishable, so holding plenty does not make supply elastic'],
      ['Time period', 'How far time raises elasticity depends on the industry. A cargo ship or a rail network can take many years to add, and firms must forecast demand long before the capital exists'],
    ],
  ),
  p(
    'Other examples: electricity cannot easily be stored, so a price spike cannot bring more supply quickly (new power stations only help in the long run); a lettuce crop failure can only be made good in the next growing season; a car maker can switch easily between models, a producer substitute, so its supply is elastic. Buffer stocks make supermarket, vehicle-part and medicine supply fairly elastic.',
  ),
  table(
    ['If a firm\'s PES is...', 'then PES is useful because...'],
    [
      [
        'Inelastic',
        'The firm can see it needs to raise its elasticity if demand is expected to rise: more machines for capacity, bigger stocks or refrigerators, larger warehouses, or more staff on flexible contracts. If demand surges and it runs out of product, its reputation suffers and customers go to rivals',
      ],
      [
        'Elastic',
        'Consumers can be told prices are unlikely to rise much because supply can expand easily, so there is no rush to buy, and more stable prices help them plan spending',
      ],
    ],
  ),
)

/* ============================================ PRICE DETERMINATION AND THE PRICE MECHANISM */

const marketEquilibrium = chapter(
  h('Reading the equilibrium on a diagram'),
  p(
    'The equilibrium is the point where the supply and demand curves cross. At that price the amount consumers want to buy equals the amount producers want to sell, so both sides are satisfied: nobody who is willing and able to pay the price is turned away, and no product is left unsold. That is why it is also called the MARKET CLEARING price. On a diagram, label the price P1 and the quantity Q1.',
  ),

  h('Why a price away from equilibrium cannot last'),
  table(
    ['', 'Price ABOVE equilibrium', 'Price BELOW equilibrium'],
    [
      ['What exists at that price', 'Excess supply: quantity supplied is greater than quantity demanded', 'Excess demand: quantity demanded is greater than quantity supplied'],
      [
        'Why it is not an equilibrium',
        'At a price this high there are fewer buyers willing to pay than there are firms wanting to sell',
        'At a price this low there are fewer firms willing to supply than there are buyers wanting to buy',
      ],
      ['What has to happen', 'The price must FALL', 'The price must RISE'],
      [
        'Movement along supply',
        'A CONTRACTION: firms are less willing to supply at the lower price',
        'An EXTENSION: firms are more willing to supply at the higher price',
      ],
      [
        'Movement along demand',
        'An EXTENSION: more people want to buy at the lower price',
        'A CONTRACTION: fewer people want to buy at the higher price',
      ],
    ],
  ),
  p(
    'The adjustment continues until quantity demanded equals quantity supplied and there are no shortages or surpluses. Neither curve moves during this process. The price slides ALONG both curves, which is why the words are extension and contraction, not shift.',
  ),

  h('When supply is fixed: two Olympic ticket cases'),
  worked(
    'In August 2016, on the day of the men\'s 100m final, reports suggested fans would pay as much as £2,000 for a ticket to the Olympic Stadium to see Usain Bolt try to win gold. The face value of the ticket was £90. Explain the gap using a supply and demand diagram.',
    'The hype around the race changed a non-price factor (tastes), so demand shifted right from D1 to D2. The stadium has a fixed number of seats and no more tickets could be released, so supply is vertical (perfectly inelastic). At the face value P1 there was therefore a large excess demand (the gap between the new quantity demanded and the fixed quantity supplied). That put heavy upward pressure on the price, which rose to P2. Because supply could not extend, the whole increase in demand appeared as a higher price and none as extra quantity.',
  ),
  worked(
    'At the Rio Olympics tickets to an archery session with a face value of £80 were reported on sale for as little as £20 on the day. Explain using a supply and demand diagram.',
    'At £80 (P1) quantity supplied, the fixed number of seats, was well above quantity demanded: an excess supply equal to Qs minus Qd. Seats cannot be withdrawn and unsold seats earn nothing once the session starts, so supply could not be cut back. The only way to fill them was for the price to fall to £20, at which quantity demanded rose to equal the seats available.',
  ),
  p(
    'Both cases show what a very low price elasticity of supply means in practice. When supply cannot change in the short run, a change in demand moves only the price.',
  ),

  h('The four cases of a change in equilibrium'),
  p(
    'The equilibrium changes when a non-price factor shifts the demand curve or the supply curve. The factors are the ones studied under the shifts of demand and supply.',
  ),
  table(
    ['Change and shift', 'Price and quantity', 'How the new equilibrium is reached'],
    [
      ['Increase in demand: D1 shifts right to D2', 'Price rises (P1 to P2) and quantity rises (Q1 to Q2)', 'Excess demand at P1 pushes the price up, and supply EXTENDS along the supply curve'],
      ['Decrease in demand: D1 shifts left to D2', 'Price falls and quantity falls', 'Excess supply at P1 pushes the price down, and supply CONTRACTS'],
      ['Increase in supply: S1 shifts right to S2', 'Price falls and quantity rises', 'Excess supply at P1 pushes the price down, and demand EXTENDS'],
      ['Decrease in supply: S1 shifts left to S2', 'Price rises and quantity falls', 'Excess demand at P1 pushes the price up, and demand CONTRACTS'],
    ],
  ),
  tip(
    'A memory aid: a shift in DEMAND moves price and quantity the SAME way (both up or both down). A shift in SUPPLY moves them in OPPOSITE ways. In every answer say which curve shifts and why, name the excess demand or excess supply at the old price, then describe the movement along the other curve.',
  ),

  h('Using the model on real markets'),
  worked(
    'Flats within 0.2 miles of a London tube station rent for considerably more than flats more than 0.5 miles away. Explain with supply and demand.',
    'A flat next to a station saves its tenant 20 minutes or more of walking every day, so demand for flats close to the station is higher: its demand curve lies further to the right than the curve for flats 0.6 miles away. At the original rent P1 there is excess demand for the closer flats, which bids the rent up, so their equilibrium price is higher.',
  ),
  worked(
    'During lockdown the price of petrol in the UK fell sharply. Why?',
    'Petrol is a DERIVED demand: it is wanted not for itself but because it powers cars, so demand for it depends on demand for car journeys. With lockdown there were far fewer journeys, a non-price factor, so demand for petrol fell massively. The demand curve shifted LEFT, creating excess supply at the old price, and the price fell a long way.',
  ),
  worked(
    'The popularity of Japanese TV dramas and cartoons in 2020 meant many more people wanted to visit Japan in 2021. Show the effect on the market for Japanese holidays.',
    'Japan became trendier because of a change in tastes, a non-price factor, so demand for Japanese holidays shifted right. At the old price P1 there is excess demand, which pushes the price up to P2. The higher price makes supplying more profitable, so airlines, hotels and tour operators have a greater incentive to supply, and the quantity supplied extends.',
  ),

  h('Evaluating supply and demand analysis'),
  table(
    ['Limitation', 'Explanation'],
    [
      [
        'Ceteris paribus may not hold',
        'The analysis assumes everything except the change named in the question is constant. In reality several things move at once. A rainy day may cut demand for ice cream, but a big event nearby may raise it by more, so the overall effect is the opposite of what the rain alone would suggest',
      ],
      [
        'The size of the change',
        'Changes in demand and supply range across a spectrum. A 2% rise in energy costs and a 200% rise would have very different effects on price and quantity. A diagram shows the direction of the change, not its size, which also depends on how elastic the curves are',
      ],
    ],
  ),
  worked(
    'The pound is expected to fall 10% against the euro. What could this do to UK car manufacturers that import parts from Europe, and why might it not happen?',
    'ANALYSIS: a 10% fall makes the rubber, glass and other parts from Western European suppliers more expensive in pounds. Costs of production rise, so the supply of cars shifts left. At the old price P1 there is now excess demand, so the price of cars rises and the quantity sold falls. EVALUATION (1): it depends on whether ceteris paribus holds. If demand for new cars is also falling because of a downturn after the pandemic, demand shifts left as well, so the quantity could fall even further (to Q3) and the price could be pushed down instead of up. EVALUATION (2): it depends on the size of the change. A 0.5% fall in sterling would barely move the equilibrium, while a 10% fall moves it a lot. It also depends on how large imported parts are as a share of total costs.',
  ),

  h('Effects on related markets'),
  p(
    'A change in one market can pass through to others, because the price of one good is a non-price factor for another. Worked chain: a rise in farm workers\' wages.',
  ),
  ol([
    'Higher wages raise farmers\' costs, so the supply of wool shifts left and the price of wool rises.',
    'Wool is a factor input into jumpers. Dearer wool makes jumpers more expensive and less profitable to produce, so the supply of jumpers shifts left and the price of jumpers rises.',
    'Some consumers switch to a substitute such as tracksuit tops. The price of tracksuit tops has not changed (yet); the rise in the price of a substitute is a non-price factor, so the demand for tracksuit tops shifts right.',
  ]),
  p(
    'The same logic works through competitive supply: if a rise in demand lifts the price of one good, firms can switch resources away from a good they could also make towards the one whose price rose, so the supply of the other good falls.',
  ),
  table(
    ['Why the chain may not happen', 'Explanation'],
    [
      ['Substitutability', 'The stronger the substitutes, the larger the shift in demand. If jumpers and tracksuit tops are not close substitutes, a jumper price rise will barely raise demand for tracksuit tops'],
      ['Ceteris paribus may not hold', 'Something else may change at the same time. A rise in the price of wool jumpers would normally cut demand for them, but if celebrity influencers start wearing them, demand could rise instead'],
      ['Component significance', 'The changed factor may be a small share of total cost. If labour is only a small proportion of the cost of producing wool, the supply of wool shifts very little'],
    ],
  ),
  worked(
    'Evaluate what a fall in the cost of producing cars would do to demand for public transport.',
    'ANALYSIS: cheaper production shifts the supply of cars right, so the price of cars falls. Cars are a substitute for public transport, so demand for public transport shifts LEFT. EVALUATION: many people cannot afford even a cheaper new car, so will not switch. Those who do buy new cars may already own cars and rarely use public transport. A cheaper purchase price does not reduce insurance, fuel or parking permits. The two are not perfect substitutes: city dwellers choose public transport for convenience, and commuters from outside London often cannot drive in because it would take far longer. It is also unclear how much consumers benefit, because the fall in production cost may be small and firms may not pass on the saving, keeping prices the same to earn extra profit.',
  ),
  tip(
    'In a related-markets question, name the LINK first (substitute, complement, factor input, derived demand, competitive or joint supply), then state which curve shifts and in which direction, then evaluate with substitutability, ceteris paribus and the size of the change.',
  ),
)

/* ============================================ PRICE, INCOME AND CROSS ELASTICITIES OF DEMAND */

const elasticDemand = chapter(
  h('A classroom experiment that shows all three elasticities'),
  p(
    'Imagine every student is a shopper with the same income, facing the same prices, who must spend the whole budget. In Round 1 the budget is £9 and seven goods are on offer: Coca Cola (£1), Pepsi (£1), a packet of crisps (50p), a 2-pint bottle of milk (£1), a loaf of bread (£1), a large chocolate bar (£2) and a fruit salad (£3). In Round 2 income stays at £9 but three prices rise: Coca Cola to £1.50 (higher labour costs), bread to £1.50 (a poor harvest) and the chocolate bar to £2.50 (dearer transport of cocoa). In Round 3 prices return to their Round 1 levels but income rises to £15. Adding up the whole class gives MARKET demand at each price and income.',
  ),
  table(
    ['Compare', 'Calculate', 'What you should find'],
    [
      [
        'Rounds 1 and 2',
        'PED for Coca Cola, bread and chocolate',
        'Coca Cola is price elastic because Pepsi is a close substitute. Bread is inelastic: a necessity with no direct substitute. Chocolate could go either way but should come out fairly elastic as a luxury',
      ],
      [
        'Rounds 1 and 3',
        'YED for all seven goods',
        'Necessities (milk, bread) have a low YED. Luxuries (chocolate and especially the fruit salad) have a high YED',
      ],
      [
        'Rounds 1 and 2',
        'XED for Coca Cola and Pepsi, Coca Cola and milk, chocolate and fruit salad, bread and milk',
        'Close substitutes (the soft drinks) have a high positive XED. Unrelated goods have a XED near zero: milk demand barely moves when the price of an unrelated good rises',
      ],
    ],
  ),
  p(
    'If Coca Cola does not come out elastic, one likely reason is that everybody had to spend the whole budget, so students kept buying a good they would otherwise have cut simply to use up their income. That makes demand look less elastic than it would be in real life.',
  ),
  worked(
    'Illustrative class totals (made up to show the method). Coca Cola demand falls from 20 to 8 cans when its price rises from £1 to £1.50, while Pepsi demand rises from 20 to 30 cans. In Round 3 chocolate bars bought rise from 10 to 22 when income rises from £9 to £15. Calculate the PED of Coca Cola, the XED of Pepsi with respect to Coca Cola, and the YED of chocolate.',
    'PED: %ΔQ = −12 ÷ 20 = −60% and %ΔP = +50%, so PED = −60 ÷ 50 = −1.2 (elastic). XED: Pepsi %ΔQ = +10 ÷ 20 = +50% and Coca Cola %ΔP = +50%, so XED = +1.0 (substitutes). YED: %ΔQ = +12 ÷ 10 = +120% and %ΔY = +6 ÷ 9 = +66.7%, so YED = +1.8 (a luxury).',
  ),

  h('PED and revenue in practice'),
  p(
    'Total revenue is price × quantity sold (TR = P × Q). With ELASTIC demand a price cut raises revenue because quantity rises more than proportionally; with INELASTIC demand a price rise raises revenue because quantity falls less than proportionally. Firms use this to set prices for different markets and times.',
  ),
  table(
    ['Situation', 'Why demand is more or less elastic', 'What the firm should do'],
    [
      [
        'A cigarette company',
        'Addiction makes demand price inelastic',
        'Charge a HIGH price: the fall in quantity is less than proportional, so revenue and profit rise',
      ],
      [
        'A train ticket from London to Leeds: £80.60 bought on the day, £15.50 booked ahead',
        'A passenger booking on the day needs to arrive soon and has few alternatives, so demand is inelastic. Someone booking a month ahead has time to compare car hire or a coach, so demand is more elastic',
        'Charge the high price on the day and the low price in advance. Each group pays a price matched to its elasticity, which maximises total revenue (a form of price discrimination)',
      ],
      [
        'A restaurant that is packed on Friday and Saturday evenings but quiet at other times',
        'Weekend demand is more inelastic than midweek demand',
        'Raise prices at the weekend and cut them midweek',
      ],
    ],
  ),
  worked(
    'A common-room vending machine sold 85 items a day at 40p. After the price rose to 70p it sold 80 a day. Explain the effect on revenue and why it happened.',
    'Revenue rose from £0.40 × 85 = £34 to £0.70 × 80 = £56, an increase of £22. Students cannot go to the shops in school time, so there are no close substitutes and demand is very inelastic: the price rose 75% but quantity fell only about 5.9%, a PED of about −0.08. Raising the price was a good decision.',
  ),
  worked(
    'A physiotherapist raises the price of an hour from £20 to £24 and weekly bookings fall from 37 to 29. Calculate the PED, explain it and say whether raising the price was a good idea.',
    '%ΔP = 4 ÷ 20 = +20%. %ΔQ = −8 ÷ 37 = −21.6%. PED = −21.6 ÷ 20 = −1.08, so demand is price elastic: quantity fell proportionally more than price rose. Revenue fell from £20 × 37 = £740 to £24 × 29 = £696, so on revenue grounds raising the price was not a good idea (the effect on profit would also depend on how much cost falls with fewer appointments).',
  ),
  worked(
    'The course notes quote estimates of PED of −0.6 for NHS adult dental treatment and −0.32 for prescriptions. What is the likely effect of a 10% rise in dental charges, and is raising prescription charges an effective way to raise revenue?',
    'Dental: quantity demanded falls by about 0.6 × 10% = 6%. Prescriptions: demand is inelastic, so a 10% rise cuts quantity by only about 3.2% and revenue rises by about 6.5% (1.10 × 0.968 = 1.065). It is effective at raising revenue because people still need their prescriptions, although that is a revenue point only and the fairness of the charge is a separate question.',
  ),
  worked(
    'The price of cigarettes rises by 30% and demand falls by 10%. Calculate the PED.',
    'PED = −10 ÷ 30 = −0.33. Demand is inelastic, so the price rise increases revenue.',
  ),

  h('Testing the determinants of PED: luxury watches and bread'),
  det(
    'Luxury watches',
    'At first sight demand is price ELASTIC: a luxury is a want, and a watch is a very expensive item that takes a large share of income.',
    [
      'Because it is a want, buyers can simply go without if the price rises.',
      'A watch costs a lot relative to most incomes, which also points to elastic demand.',
    ],
    [
      'It depends on the market definition. For one brand there are substitutes, so demand is elastic; for luxury watches as a whole there may be no close substitutes, so demand is less elastic.',
      'Buyers are generally wealthy, so for them a watch is a small share of income and demand is more inelastic. A once-off purchase that lasts for many years is also a small share of income per year.',
      'PED changes over time: more elastic if more luxury brands enter the market, more inelastic if brands build loyalty through advertising.',
    ],
  ),
  det(
    'Bread',
    'At first sight demand is price INELASTIC: bread is a need, a food item, and cheap, so it takes a small share of income.',
    [
      'It is a necessity, so people keep buying it when the price rises.',
      'It is cheap, so a price rise barely changes the household budget.',
    ],
    [
      'It depends on the definition. For bread as a whole demand is inelastic even though rice, cereal and vegetables are substitutes; for one brand of bread there are many close substitutes, so demand is more elastic.',
      'Bread is not needed for survival, and other foods or water may be more essential.',
      'For low-income households bread is a larger share of income, so their demand may be more elastic.',
    ],
  ),
  p(
    'Further points that qualify the determinants: consumer preferences change faster in a globalised world, so a measured PED can quickly become inaccurate; substitutes only matter if their quality is close; what counts as a necessity is subjective (chocolate is not needed to survive, while some people regard a good holiday as an absolute necessity); and some consumers never change habit, whatever the time period.',
  ),

  h('PED decides who bears a rise in costs'),
  p(
    'The effect of a shift in supply depends on PED. If costs rise when demand is INELASTIC, producers can pass most of the rise on, so the price increases a lot and the quantity falls very little. If demand is ELASTIC, consumers react strongly to the higher price, so the price rises only a little and the quantity falls a lot, leaving firms to absorb more of the cost.',
  ),
  worked(
    'Use PED to compare the effects of a 20% rise in production costs on the markets for Coca Cola and for petrol.',
    'ANALYSIS: supply shifts left in both markets. Coca Cola has many rival soft drinks, so demand is elastic: quantity falls more than proportionally and firms can pass on only a small price rise. Many people still need to fill their cars, so demand for petrol is inelastic: quantity falls less than proportionally and much more of the cost is passed on in the price. EVALUATION: this assumes the prices of rival soft drinks stay constant; Coca Cola may have loyal customers who stay even at a higher price; and a small price rise on a single can is a trivial share of income. A 20% rise in costs is also not the same as a 20% rise in price, because how much is passed on depends on elasticity.',
  ),

  h('Why PED is useful'),
  table(
    ['Use', 'Explanation'],
    [
      ['Total revenue', 'It tells a firm how to maximise revenue through price: on the ELASTIC part of the demand curve cut the price, on the INELASTIC part raise it'],
      ['Volatility of supply', 'Some markets have large swings in supply (harvests, for example). PED shows whether prices will swing a lot (inelastic demand) or stay fairly stable (elastic demand), and so whether firms can pass higher costs on'],
      ['Tax', 'It shows whether a tax can be passed on to consumers as a higher price. Cigarette demand is inelastic, so tax rises are largely passed on to smokers'],
      ['Sales and discounts', 'It shows whether a promotion will raise quantity enough to raise revenue'],
      ['Price discrimination', 'Groups with more inelastic demand can be charged higher prices to raise revenue, for example train commuters'],
      ['Trade unions', 'If a union knows demand for the industry\'s product is inelastic, it can push harder for higher wages, because firms can pass the cost on in prices without losing much quantity, and so without cutting back on labour'],
    ],
  ),

  h('Income elasticity: types of good and worked cases'),
  table(
    ['Type of good', 'YED value and meaning', 'Examples'],
    [
      ['Normal good (by sign)', 'YED > 0: demand rises as income rises', 'Clothes, restaurant meals, home improvement'],
      ['Inferior good (by sign)', 'YED < 0: demand falls as income rises', 'Bus journeys'],
      ['Luxury good, income elastic (by size)', 'YED > 1: demand changes proportionally MORE than income', 'Foreign travel, expensive handbags'],
      ['Necessity good, income inelastic (by size)', '0 < YED < 1: demand changes proportionally LESS than income', 'Food, toilet roll, deodorant'],
    ],
  ),
  p(
    'A good can be both a normal good and a luxury. "Normal" only means demand rises with income; "luxury" adds that it rises by MORE than income does. Every luxury is therefore a normal good, but a normal good is a luxury only if its YED is above 1.',
  ),
  worked(
    'Bread has an estimated YED of −0.6. What type of good is it?',
    'The YED is negative, so bread is an inferior good: as incomes rise people buy less of it. (Elsewhere bread is treated as a necessity: the classification depends on the country, the income group and the kind of bread.)',
  ),
  worked(
    'After an income fall of 15%, Tony buys 10% more minced beef. Calculate his YED and classify the good.',
    'YED = +10 ÷ −15 = −0.67. It is negative, so minced beef is an inferior good.',
  ),
  worked(
    'When incomes rise 10%, demand for sirloin steak rises 20%. What is the YED and what type of good is steak?',
    'YED = +20 ÷ +10 = +2. It is above 1, so steak is a luxury (income elastic) good.',
  ),
  worked(
    'Average incomes rise by 5%. The YED of a KitKat bar is +0.92 and of powdered milk −1.1. Before the rise 129,000 KitKat bars a day and 11,000 boxes of powdered milk a week were bought. Calculate the new levels of demand.',
    'KitKat: demand rises by 0.92 × 5% = 4.6%, so 129,000 × 1.046 = 134,934 bars. It is a normal good, and because YED is just under 1 sales grow slightly less than income. Powdered milk: demand changes by −1.1 × 5% = −5.5%, so 11,000 × 0.945 = 10,395 boxes. It is an inferior good.',
  ),
  p(
    'Reading estimated coefficients: private dental services at +2.5 are a luxury (strongly income elastic); rental film services at +0.8 are a normal good with income inelastic demand; supermarket own-label clothing at −1.5 is an inferior good.',
  ),

  h('What a change in income means for a firm'),
  table(
    ['Type of good', 'Income RISES', 'Income FALLS'],
    [
      [
        'Luxury (YED > 1)',
        'Demand rises more than proportionally, so revenue and profit rise significantly. Firms should raise their price elasticity of supply (capacity, stocks) to meet the expected surge',
        'Demand falls more than proportionally, so revenue and profit fall significantly. The signal is to diversify into other products to offset the lost profit, or to leave the industry',
      ],
      [
        'Necessity (0 < YED < 1)',
        'Demand rises less than proportionally, so revenue and profit rise only slightly. Firms might move into more profitable products, or invest to make their good more income elastic',
        'Demand falls less than proportionally, so revenue and profit fall only slightly. The firm is not much affected by its customers\' lower incomes',
      ],
      [
        'Inferior (YED < 0)',
        'Demand FALLS, so revenue and profit fall. The firm may leave for more profitable goods, and the outlook tells firms outside the industry not to enter',
        'Demand RISES, so revenue and profit rise. Firms should raise their price elasticity of supply to meet the rise, and the outlook tells outsiders to enter',
      ],
    ],
  ),

  h('Testing the determinants of YED'),
  table(
    ['Factor', 'Why YED may not be what it seems'],
    [
      ['Nature of the good', 'It depends on a country\'s income level: a car may be a necessity in a high-income country and a luxury in a low-income one'],
      ['Time period', 'There is a time lag before people change spending after an income change, and classifications shift over time: phones began as luxuries and are now treated as necessities'],
      ['Income is not the only factor', 'Quality, brand loyalty, advertising and the availability of substitutes also affect what people buy'],
      ['Temporary or permanent change', 'A one-off windfall may change consumption little (the permanent income hypothesis), whereas a permanent rise such as a pay rise or promotion alters spending patterns'],
      ['Size of the change', 'A 3% pay rise may have no observable effect on spending, whereas a 70% rise could transform it'],
    ],
  ),

  h('Why YED is useful'),
  table(
    ['Use', 'Explanation'],
    [
      ['Forecasting future demand', 'If incomes are forecast to rise and the firm knows its YED, it knows how much quantity demanded will rise or fall. Income elastic demand signals new firms to enter the industry; a negative YED signals existing firms to leave because profits are expected to fall'],
      ['Diversification', 'If demand is income inelastic or YED is negative, low or falling profit growth is expected, so the firm should diversify into income elastic goods'],
      ['Capacity and PES', 'With income elastic demand a firm should invest in capital, or hold more raw materials or finished output, to raise its price elasticity of supply ready for a large rise in demand'],
      ['Marketing', 'A firm with very income elastic demand will advertise where high-income customers are found, for example an upmarket shopping centre'],
    ],
  ),
  p(
    'In most economies real disposable income rises over time. That lets firms selling luxuries forecast strong future demand (foreign holidays have become far more popular in recent decades as living standards rose), while sellers of necessities such as toilet paper or toothpaste are much less affected. A notable exception: in lockdown incomes fell for many people yet toilet roll sales soared, because panic buying, not income, drove demand.',
  ),
  p(
    'A firm can also influence the YED of its product through marketing. Advertising can move a good from being seen as inferior to being seen as a luxury, and an inferior good may try to be seen as a necessity.',
  ),

  h('Cross elasticity: strength of the relationship'),
  table(
    ['XED and relationship', 'What makes the value large', 'Example'],
    [
      [
        'Positive: substitutes',
        'How close the substitutes are',
        'Samsung and Apple phones would have a higher positive XED than Apple and Nokia phones, so they are more strongly related',
      ],
      [
        'Negative: complements',
        'How strongly the goods go together',
        'Toothpaste and mouthwash would have a larger absolute negative XED than cakes and whipped cream, because cakes have many other toppings',
      ],
      ['Zero: unrelated', 'There is no link to measure', 'TVs and economics textbooks'],
    ],
  ),
  p(
    'The SIZE of the XED shows the strength of the link between a price change in one good and the change in demand for the other. A very large negative value, such as −10, points to near-perfect complements: for someone who never drinks tea without it, milk would fit.',
  ),
  worked(
    'The XED between steak and mustard is −0.2. What does it show?',
    'It is negative, so they are complements, but a value this close to zero means a weak relationship. When the price of steak rises, demand for mustard falls a little, yet mustard is also eaten with hot dogs and many other foods, so the two are far from perfect complements.',
  ),
  worked(
    'The price of salt rises by 3% and the XED between salt and chips is −1.7. What happens to demand for chips, and what is the relationship?',
    'Demand for chips changes by −1.7 × 3% = −5.1%. The goods are very close complements.',
  ),
  worked(
    'The price of butter rises by 6% and the XED between butter and margarine is +3. By how much does demand for margarine rise, and what is the relationship?',
    'Demand for margarine rises by 3 × 6% = 18%. They are very close substitutes.',
  ),
  worked(
    'A shop sells 100 fountain pens a week at 90p and 200 cartridges a week at 50p. It raises the price of pens to £1.25. The XED between pens and cartridges is −2. How many cartridges will it now sell?',
    'The pen price rises by 35 ÷ 90 = 38.9% (about 39%). Cartridge demand changes by −2 × 38.9% = −77.8% (about −78%), so weekly sales fall to about 200 × 0.22 = 44 cartridges.',
  ),
  table(
    ['Pair of goods', 'Relationship', 'Rough XED estimate'],
    [
      ['TVs and economics textbooks', 'Unrelated', '0'],
      ['A football club\'s shirt and shorts', 'Complements', 'About −0.5'],
      ['Games consoles and controllers', 'Close complements', 'About −1.5'],
      ['Chewing gum and books', 'Unrelated', '0'],
      ['Android and Apple phones', 'Substitutes', 'About +0.6'],
      ['A4 paper from two different shops', 'Very close substitutes', 'High and positive (about +1 or more)'],
      ['Fanta and Tango', 'Substitutes', 'About +0.7'],
    ],
  ),
  p('These are rough estimates of the likely size, not measured values.'),
  worked(
    'The price of ink cartridges rises from £12 to £15 because ink costs have risen. Analyse the effect on the market for printers priced at £25.',
    'Printers and ink are strong complements: neither is any use without the other, so buyers think of the bundle, which rises from £37 to £40. The price of printers has not changed at all, so this is a change in a NON-PRICE factor, the price of a complement. The dearer bundle shifts demand for printers LEFT, so the equilibrium price and quantity of printers both fall.',
  ),

  h('Testing the determinants of XED'),
  det(
    'The extent of substitutability',
    'When two goods are substitutes XED is positive: a price cut for one raises demand for it and lowers demand for the other.',
    [
      'Example: a budget trainer brand cuts its price well below that of a fashionable rival, yet its sales rise only marginally.',
    ],
    [
      'BRAND LOYALTY: consumers are less price sensitive than the theory suggests. If the rival is seen as more fashionable they may not switch even at a much lower price, which is why firms spend millions on advertising.',
      'INERTIA: habit and the ease of staying with the status quo make people reluctant to try alternatives.',
      'QUALITY: if one good is better designed or made, people stay for non-price reasons. Firms invest heavily in R&D to lower the XED of their product, so they can raise its price without losing demand.',
      'In the long run technology creates substitutes faster, and e-commerce lets a business start without a physical shop, lowering barriers to entry. XED values therefore tend to rise over time as consumers respond more to price changes.',
    ],
  ),
  defn(
    'Perfect complements',
    'Two goods that cannot be consumed without each other, so satisfaction comes only from consuming both together.',
  ),
  p(
    'Left and right shoes, or a computer and its operating system, are examples. Complements are WEAK when consumers do not need both to be satisfied: fries and ketchup can each be bought alone, and ketchup is not the only thing people eat with fries. How strongly goods are complements therefore depends on consumer tastes and preferences.',
  ),

  h('Related markets: subsidising public transport'),
  worked(
    'The government subsidises public transport to reduce congestion. Analyse the effect on the public transport market and on the car travel market, and say why the effect on car travel may not happen.',
    'ANALYSIS: the subsidy lowers firms\' costs, so the supply of public transport shifts right, the price falls and output rises, which benefits passengers. Public transport is a substitute for car travel, so its lower price makes some drivers switch and demand for car travel shifts LEFT. EVALUATION: SIZE: a small fall in fares may not be enough to change behaviour. NECESSITY: some people must drive, for example to get to work or to take children to school. QUALITY: some will not switch because of delays or because they dislike sharing a bus rather than having their own space.',
  ),

  h('Why XED is useful'),
  table(
    ['A firm with...', 'XED is useful because...'],
    [
      [
        'A large positive XED (many close substitutes)',
        'The firm must watch rivals\' prices because its demand can be hit hard (low-cost airlines, for example). It can cut its own price to take market share, consider price agreements with rivals (illegal where they fix prices) or a merger with a rival (horizontal integration). It can also try to LOWER the XED, by building brand loyalty through advertising, raising quality or adding features that set the product apart',
      ],
      [
        'A large negative XED (strong complements)',
        'The firm can form alliances or pricing arrangements with the maker of the complement to raise joint demand, revenue and profit',
      ],
      [
        'A weak (low) XED',
        'The goods are not closely related, so the firm need not pay much attention to the other firm\'s pricing',
      ],
    ],
  ),
  worked(
    'The products of your technology firm have a very strong positive XED. What does it show, how should you respond, and what could it allow you to do in the long run?',
    'It shows there are many close substitutes for your products. Cutting price would win demand from rivals, raising market share and potentially profit. The extra profit can fund R&D that raises quality and so reduces the number of close substitutes. That lowers XED, makes demand more inelastic and gives the firm more pricing power in the long run.',
  ),
)

/* ============================================================ CONSUMER AND PRODUCER SURPLUS */

const surplus = chapter(
  h('Why firms cannot charge each buyer their own price'),
  p(
    'Suppose a restaurant had no prices on its menus and charged each person the most they would pay for their usual order. The answers would range from a lowest to a highest figure with an average in between: people simply do not value a good in the same way, which is exactly what a demand curve says.',
  ),
  ul([
    'The IDEAL for a producer is to charge every consumer what they are willing to pay, which captures the most profit possible.',
    'The IDEAL for a consumer is to pay as little as possible, which lets them maximise utility within their budget constraint.',
    'In practice firms struggle to charge different prices because of imperfect information: they cannot see what each person would pay, and nobody admits to a high willingness to pay when they think they can get away with a low price.',
  ]),
  p(
    'So at any single market price some consumers pay less than they would have been prepared to pay. That gap is consumer surplus. Where a firm CAN separate groups it practises price discrimination and takes some of the surplus; charging every buyer their maximum would remove consumer surplus altogether.',
  ),
  worked(
    'A family usually pays about £1,500 for its Benidorm holiday, has paid as much as £1,900 and would pay up to £3,000 if it really had to. This year it finds the holiday it wants advertised at £600. Calculate its consumer surplus.',
    'Consumer surplus = willingness to pay − price actually paid = £3,000 − £600 = £2,400.',
  ),

  h('A change in price on the diagram (a standard four-mark question)'),
  ol([
    'A price RISE from P1 to P2 is a contraction along the demand curve, from Q1 to Q2.',
    'The consumer surplus triangle (above the price line, below the demand curve) shrinks. The lost area is a rectangle, because buyers who keep buying now pay more on every unit, plus a small triangle, because buyers priced out of the market lose their whole surplus.',
    'A price FALL is the reverse: an extension along the demand curve, more buyers and a larger consumer surplus triangle.',
  ]),
  table(
    ['How big is the change in consumer surplus?', 'Explanation'],
    [
      [
        'The extent of the price change',
        'A large rise from P1 to P2 prices many buyers out, a big contraction in quantity, so consumer surplus falls a lot. A slight change causes only a slight contraction and a small change in surplus',
      ],
      [
        'Price elasticity of demand',
        'With INELASTIC demand (cigarettes) consumers will pay very high prices, so quantity falls less than proportionally and only a small SHARE of the original surplus disappears. With ELASTIC demand (soft drinks) quantity falls more than proportionally, so a much larger share is lost. The pound amount can still be large with inelastic demand, because the buyers who stay pay more on every unit',
      ],
      [
        'The cause of the shift',
        'It depends on what moved: a cost increase shifts supply, while a change in the price of a complement shifts demand (see the cases below)',
      ],
    ],
  ),
  worked(
    'An import tax is placed on goods shipped into the UK from Brazil. Show the effect on price, output and consumer surplus.',
    'The tax raises the cost of supplying the goods, so supply shifts left from S1 to S2. The price rises from P1 to P2 and quantity falls from Q1 to Q2: a contraction along the demand curve, as buyers are less able to buy at the higher price. Consumer surplus falls by the area between the two price lines under the demand curve (a rectangle on the units still bought plus a triangle on the units no longer bought).',
  ),
  worked(
    'The price of ink rises. Show the effect on the price, output and consumer surplus in the printer market.',
    'Printers and ink are complements bought as a bundle, so dearer ink raises the cost of the bundle even though the printer\'s own price has not changed. Demand for printers shifts left from D1 to D2: consumers are prepared to pay a lower price for each quantity. The price and quantity of printers fall, and consumer surplus falls because the whole willingness-to-pay curve has shifted down and fewer units are bought.',
  ),

  h('Where a producer\'s minimum acceptable price comes from'),
  p(
    'Every producer has in mind the lowest price it will accept. It rests on the BREAK-EVEN price, and on the price at which profit is high enough to make production worthwhile, since it would be irrational to produce at a loss. Minimum prices differ between producers because firms have different costs and different ideas of a satisfactory profit, and entrepreneurs face different opportunity costs relative to the economic profit they could earn elsewhere. At any market price some producers would have accepted less than they receive. That gap is producer surplus.',
  ),
  worked(
    'An author\'s new book sells at a recommended price of £100, although the author would have been willing to sell it for £70. Calculate the producer surplus.',
    'Producer surplus = price received − minimum price acceptable = £100 − £70 = £30 per book.',
  ),

  h('A change in price and producer surplus'),
  p(
    'A price RISE increases producer surplus: the triangle between the price line and the supply curve grows (from P1AX to P2BX on the diagram), because producers receive more on every unit and more units are supplied. A price FALL reduces it. The size of the change depends on the following.',
  ),
  table(
    ['Depends on', 'Explanation'],
    [
      [
        'The extent of the price change',
        'A small rise means only a small increase in profitability, so only a few firms join the market and surplus rises a little. A large rise greatly increases profitability, so many firms join and surplus rises a lot',
      ],
      [
        'Price elasticity of supply',
        'With INELASTIC supply it is hard to produce more: few new firms enter and existing firms struggle to raise output, so quantity grows little. With ELASTIC supply many firms can enter and existing firms can produce much more, so quantity and surplus grow more',
      ],
      ['The cause of the shift', 'It depends on what moved: demand or supply (see the cases below)'],
    ],
  ),
  worked(
    'Over time DVD players have become obsolete. Show what has happened to producer surplus.',
    'Better alternatives mean consumers have stopped demanding DVD players, so demand shifts left from D1 to D2. The price falls from P1 to P2 and lower profitability gives producers an incentive to produce less, so output falls from Q1 to Q2. The producer surplus triangle shrinks from P1AX to P2BX.',
  ),
  worked(
    'A firm\'s wage costs fall. Show what happens to producer surplus.',
    'Lower wage costs reduce the cost of production, so supply shifts right from S1 to S2: firms are willing to accept a lower minimum price. The price falls from P1 to P2, but by less than costs have fallen, so each unit earns a bigger margin, and there is still an incentive to supply more. Output rises and producer surplus increases.',
  ),
)

/* ===================================================================== EXTERNALITIES */

const externalities = chapter(
  h('Where the cost-benefit curves come from'),
  p(
    'A supply and demand diagram can be relabelled as a cost-benefit diagram. Demand is the MARGINAL PRIVATE BENEFIT (MPB) curve: people demand a good for the benefit they get from consuming it, and the curve slopes DOWN because the extra benefit from each further unit falls as more is consumed. Supply is the MARGINAL PRIVATE COST (MPC) curve: the cost to firms of producing the good, which slopes UP because the extra cost of each further unit rises as more is produced. The free market equilibrium is where MPB = MPC.',
  ),
  p(
    'Market failure occurs whenever MPB differs from MSB or MPC differs from MSC, that is, whenever an externality exists. The socially optimum output is where MSB = MSC.',
  ),

  h('Private and external effects in the four cases'),
  table(
    ['Case and example', 'What is counted and what is ignored', 'Result'],
    [
      [
        'Negative externality of CONSUMPTION: smoking cigarettes',
        'COUNTED (private benefits): stress relief, liking the taste. IGNORED (external cost): passive smoking',
        'MSB is below MPB. Individuals consider only their own benefit and ignore the cost to third parties, so there is over-consumption',
      ],
      [
        'Negative externality of PRODUCTION: flights from London to New York',
        'COUNTED (private costs): fuel, aircraft, labour. IGNORED (external cost): global warming from greenhouse gas emissions',
        'MSC is above MPC. Firms consider only their own costs, so there is over-production',
      ],
      [
        'Positive externality of CONSUMPTION: education',
        'COUNTED (private benefits): higher future earnings, satisfaction from greater knowledge. IGNORED (external benefits): a more productive workforce, higher GDP and tax revenue, less crime and unemployment',
        'MSB is above MPB. Individuals ignore the benefit to third parties, so there is under-consumption',
      ],
      [
        'Positive externality of PRODUCTION: a firm investing heavily in R&D to make its production greener',
        'COUNTED (private costs): the very expensive R&D outlay and the cost of employing high-skilled engineers. IGNORED (external benefits, or a negative external cost): less environmental damage, less depletion of non-renewable resources, and lower costs for other firms that can use the breakthrough',
        'MSC is below MPC. Firms ignore the reduced costs to third parties, so there is under-production',
      ],
    ],
  ),
  worked(
    'List the private and external benefits of swimming and explain why it may be under-consumed.',
    'Private benefits: enjoyment and fitness. External benefits: better health (so less strain on health services), socialising that can make people better at work, and lower stress. The free market counts only the private benefits when individuals decide how much to swim, so MSB lies above MPB and swimming is under-consumed.',
  ),

  h('Four scenarios to draw and explain'),
  table(
    ['Scenario and type', 'Explanation', 'At the market equilibrium'],
    [
      [
        'Pollution from a firm\'s production process: negative externality of production (MSC > MPC)',
        'Waste pollutes the air, rivers and land and creates noise',
        'The market produces Qm, above the social optimum Q&ast;, so there is over-production of Qm − Q&ast;. It is allocatively inefficient because too many resources are used in production',
      ],
      [
        'Regeneration around a new housing estate: positive externality of production (MSC < MPC)',
        'New jobs, new businesses, a more attractive area, higher house prices and a changing local population',
        'Under-production of Q&ast; − Qm: too few resources are used in production',
      ],
      [
        'Immunisation of children: positive externality of consumption (MSB > MPB)',
        'It prevents life-threatening diseases such as whooping cough, measles and polio, and protects people who are not immunised. It is free in the UK, but in many countries people pay through a health provider or privately, which makes under-consumption more likely',
        'Under-consumption of Q&ast; − Qm: too few resources are allocated to vaccines',
      ],
      [
        'Smoking in public places: negative externality of consumption (MPB > MSB)',
        'It harms third parties through passive smoking, smell and litter',
        'Over-consumption of Qm − Q&ast;: too many resources are allocated to cigarettes',
      ],
    ],
  ),
  tip(
    'In every scenario label the market equilibrium Qm, Pm and the social optimum Q&ast;, P&ast;, shade the over- or under-provision between Qm and Q&ast;, and name the allocative inefficiency: too many resources, or too few, devoted to the good.',
  ),
)

/* =================================================================== ECONOMIC SYSTEMS */

const economicSystems = chapter(
  h('The market economy'),
  defn(
    'Market economy',
    'An economic system in which resources are allocated through the market forces of supply (firms) and demand (consumers), with no government involvement.',
  ),
  p(
    'A market economy is usually called capitalism: consumers and firms are motivated by maximising their own satisfaction and profit. Adam Smith put forward the "invisible hand" in The Wealth of Nations (1776): resources are allocated without the government having to direct them, which is an argument in favour of a market economy.',
  ),
  worked(
    'A baker is selling a loaf of bread for £5. What would happen?',
    'Another baker has the incentive to sell at a much lower price, for instance £1, so consumers switch from the dear loaf to the cheap one. The high price cannot be sustained, and prices fall until demand equals supply, with no government needing to set prices.',
  ),
  worked(
    'Explain why a pure free market would not achieve an optimal allocation of resources in healthcare.',
    'Healthcare is under-consumed, at Qm instead of Q&ast;. Individuals consider only their private benefits, such as a better quality of life, and ignore the external benefits to society, such as a more productive workforce. MSB (= MPB + external benefit) therefore lies above MPB, and the gap between Qm and Q&ast; is a welfare loss.',
  ),
  p(
    'This is why governments intervene: where the price mechanism fails to give the socially optimum allocation there is a welfare loss, and the government\'s aim is to maximise welfare.',
  ),
  h('Evaluating market economies'),
  table(
    ['Advantage', 'Explanation'],
    [
      ['Competition', 'Little red tape means more firms compete for consumers. That pushes prices down as firms minimise costs to gain an edge, and encourages them to expand output and gain economies of scale'],
      ['Quality and innovation', 'Firms invest in R&D to improve products and create new ones, raising consumer satisfaction and market share in the search for profit. Firms that fail to innovate lose out: Nokia fell far behind in mobile phones while Apple kept innovating'],
      ['Choice', 'R&D leads to greater variety, so more people\'s needs are met and quality of life rises'],
      ['Allocative efficiency', 'The price mechanism rations, incentivises and signals, so there is no lasting excess demand or excess supply'],
      ['Productive efficiency', 'Profit maximisation stops firms becoming slack and producing less efficiently than they could'],
      ['Entrepreneurship', 'The chance to make profit encourages people to start businesses, which raises employment and economic growth'],
      ['Productivity', 'Workers who know that working hard earns higher wages are motivated to gain new skills, so the economy becomes more productive over time'],
      ['Economic growth', 'The profit incentive and entrepreneurship matter a great deal in a globalised world where international competitiveness is vital, and overseas competition drives prices down'],
      ['Environmental standards', 'It can even be argued that demand for greener products grows over time, so firms that supply them gain a comparative advantage'],
    ],
  ),
  table(
    ['Disadvantage', 'Explanation'],
    [
      ['Market failure', 'Allocation is not always efficient (healthcare, education). The main aim is profit, so third-party costs and benefits are not always counted, especially long-term harms such as environmental damage or smoking'],
      ['Income inequality', 'Inequality tends to be larger in market-based economies (such as the US and India), especially where there is little social protection through benefits and healthcare. There is an incentive to work harder and gain skills, but inequality of opportunity limits it: not everyone can get a good education, the poor may have to go straight into work (a higher opportunity cost of studying) while the wealthy can afford to acquire skills'],
      ['Concentrated competition', 'Markets can come to be dominated by one or a few firms, perhaps through brand loyalty, so consumers are more likely to be exploited, for example through higher prices'],
      ['Public goods', 'A free market does not provide them at all because of the free rider problem'],
    ],
  ),

  h('The command economy'),
  defn(
    'Command economy',
    'An economic system in which resources are state owned and allocated centrally by the government.',
  ),
  p(
    'Karl Marx saw the free market as unstable. He argued that its profits come from exploiting labour, because workers are not paid the full value of their work, and he argued for common ownership of the means of production. In a command economy the government decides what is produced, how it is produced and who receives it. In Russia after the 1917 revolution, for example, factories were given production targets that fitted an overall plan for developing the economy. The state controls resources such as water and electricity, and prices and wages are set centrally.',
  ),
  worked(
    'Why is it not uncommon to hear of shortages of basic foods in command economies?',
    'The prices of basic foods such as bread are often kept artificially low. That creates excess demand, so there is not enough to meet people\'s needs.',
  ),
  table(
    ['Advantage', 'Explanation'],
    [
      ['Industrial power', 'The government can prioritise strategic industries and decide where resources are allocated'],
      ['Social welfare', 'If the government makes healthcare free for all, for example, welfare can rise and inequality be minimised, provided that is its priority'],
      ['Cheap necessities', 'Price caps on basic goods can prevent absolute poverty by letting everyone meet their basic needs'],
      ['No private monopolies', 'Prices are set by the government, so consumers are not exploited by one very large company'],
      ['Strategic alignment', 'The state can set a goal such as a clean environment and align all policy and industry behind it'],
      ['Economies of scale', 'If the state buys all resources it can buy more at a lower cost per unit, which can help keep prices low'],
    ],
  ),
  table(
    ['Disadvantage', 'Explanation'],
    [
      ['Inefficiency', 'With no competition costs are not minimised, there can be production delays and prices may be higher. Nobody can coordinate production, consumption and trade for a whole country, so efficient coordination is judged to be impossible'],
      ['Shortages', 'Artificially depressed prices for necessities create excess demand (queues and waiting lists for food and shelter), because the price mechanism cannot perform its functions'],
      ['Little innovation or choice', 'With no profit incentive or competition there is little reason to innovate, and consumers have little variety'],
      ['Low growth and competitiveness', 'With no profit motive people have less incentive to start or expand businesses, so there is less employment. Less innovative, lower quality products also mean fewer exports'],
      ['Black markets', 'Restrictions or bans on products push activity underground into unrecorded black markets, and the lack of regulation may also create negative externalities'],
    ],
  ),

  h('The mixed economy'),
  defn(
    'Mixed economy',
    'An economic system in which resources are allocated through a mixture of the market and direct public sector involvement.',
  ),
  p(
    'Most resources are owned by the private sector but some sectors are owned by the state, and the degree of public ownership varies between countries. Most countries favour the mixed economy because, often for political reasons, governments feel the need to intervene in some markets: they do not want people priced out of schools, or they do not want people using cocaine at all. After the fall of the Soviet Union many central and eastern European countries moved from a command towards a more market-based system.',
  ),
  p(
    'On the evidence, market-based economies have tended to show faster growth and higher living standards than command economies, because competition and the profit incentive push firms to minimise costs and raise quality, which supports exports and consumer satisfaction. Set against that are market failure and inequality, which is why almost every real economy is mixed.',
  ),

  h('Incentives and resource allocation: applied questions'),
  worked(
    'In a market system workers have an incentive to move to a booming industry. Is this always the case, what constrains them, and how could that worsen the allocation of resources?',
    'It is not always the case. OCCUPATIONAL immobility (workers lack the skills to switch jobs, and only those who can afford to retrain benefit) and GEOGRAPHICAL immobility (workers do not move to where jobs or higher pay are) hold them back. The resulting unemployment and misallocation of resources means the economy is operating inside its PPF, since labour is not fully and efficiently employed.',
  ),
  worked(
    'A firm in the crowded hand sanitiser market sees a surge in demand for televisions. Evaluate the role of incentives in its production decision.',
    'ANALYSIS: excess demand for TVs pushes their price up, which makes them more profitable, so profit-seeking firms move factors of production into them. More TVs are produced to meet consumer wants, moving towards allocative efficiency. EVALUATION: there is no profit incentive in a command economy, so a firm is unlikely to respond. Even in a free market the firm may be making sanitiser for a social objective, such as tackling the coronavirus, and be unwilling to switch. Its factors of production may not be substitutable into the TV market, and it has sunk costs in equipment and in training staff for sanitiser production.',
  ),
  worked(
    'Why might the UK have a more highly skilled and productive workforce than a command economy? Use incentives.',
    'In the UK there is an incentive to pursue education, because higher skills lead to a highly paid job that buys more goods and services and so raises utility, and once in work there is an incentive to be productive to win promotion. In a command economy there is little reason to study other than enjoyment, since there is no prospect of a better-paid job rewarding the effort, and even a higher income may not raise utility if choice is limited. The lack of a profit incentive also lets firms operate with a lot of slack.',
  ),
  p(
    'Friedrich Hayek argued that government intervention makes the market worse. After the 1929 crash, for example, he argued that central bank policy had helped cause it by keeping interest rates too low, encouraging "malinvestments": investments that were not economically worthwhile.',
  ),
)

/* ============================================================ PUBLIC GOODS AND INFORMATION GAPS */

const publicGoods = chapter(
  h('Information failure and its limits'),
  defn(
    'Information failure',
    'A situation in which a lack of information leads consumers (or producers) to make decisions that do not maximise their welfare, because they do not know what is good or bad for them.',
  ),
  table(
    ['Case', 'Analysis', 'Evaluation'],
    [
      [
        'Flu vaccinations (a merit good, MSB > MPB)',
        'Individuals may not understand the true benefits of the jab, so they under-consume and the market fails if left alone',
        'Does the government really know what is best for individuals? People may already be well aware of the benefits of being vaccinated',
      ],
      [
        'Cigarettes (a demerit good, MSB < MPB)',
        'People do not realise how harmful smoking is, so they over-consume',
        'The information is now widely available, so there are no excuses. The real problem may be addiction or behaviour, not a lack of information',
      ],
    ],
  ),
  worked(
    'Explain the problems that asymmetric information would cause if healthcare were provided in the private sector.',
    'Doctors understand medicine far better than patients, so a profit-maximising provider could advise treatments that patients do not need, which harms consumer welfare. Moral hazard is a second problem: insured patients may take greater risks because they know the cost will be met by their cover.',
  ),
  worked(
    'How has the internet affected information failure in recent years?',
    'It has reduced it dramatically. There is a mass of information online, so buyers can compare, for example, cars from dealers across the country. Products are also better labelled, partly because the law requires it (healthy-eating labels, for instance).',
  ),
  table(
    ['Evaluating merit and demerit goods', 'Explanation'],
    [
      [
        'Value judgement',
        'For some goods it is not clear whether they are demerit goods at all. Some people see contraception as a demerit good (a sin, according to the Catholic Church), while others see it as a merit good because it helps prevent the spread of sexually transmitted infections',
      ],
      [
        'Strength of the merit or demerit good',
        'The gap between MPB and MSB is far bigger for some goods. Heroin is a much stronger demerit good than fast food, so it needs stronger intervention',
      ],
      [
        'Information failure is reducing',
        'The internet, school education and national campaigns (Talk to FRANK on drugs, When the Fun Stops, Stop on gambling, Drinkaware on alcohol, Stoptober on smoking) have spread information. Yet many people carry on consuming these goods anyway',
      ],
      [
        'Which group consumes it',
        'Many people consume demerit goods in moderation without severe effects: unhealthy food is a treat for most, but a significant problem for a minority',
      ],
      [
        'Not worse than government failure',
        'A market failure may be less damaging than a failed intervention. If the government intervenes and the outcome is still not socially optimal, scarce public money has been wasted that could be better spent elsewhere, particularly where people already know the information and choose to consume anyway',
      ],
    ],
  ),

  h('Features of public and private goods'),
  table(
    ['Feature of a public good', 'Meaning', 'Example'],
    [
      [
        'Non-excludable',
        'People cannot be excluded from consuming the good even if they have not paid',
        'A lamppost: you cannot be stopped from using its light, and it would be impractical to charge everyone who walks past',
      ],
      [
        'Non-rival (non-diminishable)',
        'One person\'s consumption does not affect anyone else\'s',
        'Defence: protecting one citizen does not stop another being protected too',
      ],
      [
        'Non-rejectable',
        'Because the supply is collective, people cannot choose not to consume it',
        'A nuclear defence system: individuals cannot opt out',
      ],
    ],
  ),
  p(
    'A PURE public good has all of these features. Very few goods do (clean air and street lighting are possible examples), so the most common type is the QUASI-public good, which has some but not all of them: it is semi-rival or semi-excludable, or has just one of the two characteristics.',
  ),
  table(
    ['Good', 'Why it is quasi-public'],
    [
      [
        'A beach',
        'Non-excludable, because it is hard to stop people coming in (a public right of way), but rival: too many people harm other users\' enjoyment, although that depends on how big the beach is',
      ],
      [
        'The M25',
        'Semi-excludable: you need a driving licence, but once you have one anyone can use it, and a toll could be charged. It is rival at some times of day, because your driving affects the experience of other drivers',
      ],
      [
        'The police',
        'Non-excludable, because everyone benefits from criminals being locked up, but not entirely non-rival: officers dealing with one crime cannot be at another',
      ],
    ],
  ),
  p(
    'Because quasi-public goods are often semi-excludable, the free rider problem can sometimes be avoided by charging for use and excluding those who do not pay, as with a toll bridge.',
  ),
  p(
    'In reality almost all goods are private goods.',
  ),
  table(
    ['Feature of a private good', 'Meaning', 'Example'],
    [
      [
        'Rivalrous',
        'One person\'s consumption reduces what is left for others, because resources are scarce',
        'Ordering a pizza may mean it is no longer available to others; driving on a road uses up road space that another motorist cannot use at that time',
      ],
      [
        'Excludable',
        'Buyers who are not willing and able to pay can be kept out: no payment, no access',
        'Theatre shows, pay-per-view sport',
      ],
      [
        'Rejectable',
        'The consumer can choose not to consume it',
        'Items on the school menu: you can choose something else',
      ],
    ],
  ),

  h('How the government can respond, and whether it should'),
  table(
    ['Way to respond', 'Explanation'],
    [
      [
        'Make the good excludable and charge for it',
        'A toll on road users works because a road has some excludability. It does not work in every case: you cannot realistically ban someone from a street because they have not paid towards its street light, since the cost would be too high',
      ],
      [
        'Pay a private firm to provide the good',
        'The users of, for example, street lighting pay indirectly through taxation',
      ],
    ],
  ),
  table(
    ['Case for government provision', 'Explanation'],
    [
      ['The free rider problem', 'The private sector will not provide public goods, so there is a missing market (huge under-consumption), yet many of these goods are crucial to maximising social welfare'],
      ['A positive multiplier', 'Building infrastructure such as a dam creates jobs in the local area, which can set off a multiplier effect'],
      ['Economies of scale', 'The government can gain greatly from spending on a large scale, lowering average cost'],
      ['Avoids inequality', 'If you had to pay for the police, only wealthy areas would be protected'],
    ],
  ),
  table(
    ['Limit on government provision', 'Explanation'],
    [
      ['Technology', 'Goods are increasingly excludable (digital TV, newspaper paywalls), although the open-source movement, as with WikiLeaks, may have made some information a public good'],
      ['Cost', 'Building a dam costs money (an opportunity cost), and making a good excludable costs money too, for example collecting beach entrance fees'],
      ['Government failure', 'It is hard to get the right level of intervention for quasi-public goods. A toll could simply divert traffic onto other roads, moving congestion and pollution elsewhere. Large projects such as the 2012 London Olympics raise the question of whether public funds were well used'],
      ['Lost private sector efficiency and innovation', 'Government projects are often marked by slack and delays, which are very costly'],
      ['Tax collection', 'Many countries do not have the tax revenue to provide public goods'],
    ],
  ),
)

/* ============================================================ GOVERNMENT INTERVENTION IN MARKETS */

const intervention = chapter(
  h('Taxation: purposes, types and analysis'),
  p(
    'Governments tax for two reasons: to RAISE REVENUE, for example to fund merit goods and goods with positive externalities, and to REDUCE the consumption or production of goods with negative externalities and of demerit goods.',
  ),
  table(
    ['Type of tax', 'Explanation', 'Examples'],
    [
      ['Direct', 'Charged on a person\'s or firm\'s income or profit and paid by them directly to the government', 'Income tax, National Insurance, corporation tax'],
      ['Indirect', 'Charged on goods and services, collected by the seller and passed to the government', 'VAT, excise duties on fuel, alcohol and tobacco'],
    ],
  ),
  p(
    'A tax on a good raises the cost of supplying it, which is the main non-price factor shifting supply, so the supply curve shifts LEFT. The price rises from P1 to P2 and the quantity falls from Q1 to Q2. Government revenue is the rectangle whose height is the tax per unit (the gap between the price consumers pay and the price producers keep) and whose width is the new quantity Q2. Consumers and producers both bear part of the burden, and how it is shared depends on the elasticities: the more inelastic demand is relative to supply, the more of the tax consumers pay; the more inelastic supply is relative to demand, the more producers bear.',
  ),
  table(
    ['Case', 'Market failure', 'Effect of the tax'],
    [
      [
        'Negative externality of consumption (cigarettes)',
        'Over-consumption: Qm is above Q&ast;',
        'The tax shifts the supply curve (MPC) up to MPC + tax. The new equilibrium is at Q&ast;, with consumers paying the higher price Pt',
      ],
      [
        'Negative externality of production (a tax on airlines)',
        'Over-production: Qm is above Q&ast;',
        'The tax shifts MPC up to MPC + tax, which now matches MSC, so the new equilibrium is at the social optimum P&ast;, Q&ast;',
      ],
    ],
  ),
  table(
    ['Case for a tax', 'Explanation'],
    [
      ['It tackles the failure directly', 'It reduces the over-consumption or over-production'],
      ['It encourages less harmful substitutes', 'As the taxed good gets dearer buyers switch to substitutes such as e-cigarettes (no tar or carbon monoxide) or sugar-free drinks'],
      ['Elastic demand can mean a big fall', 'Young consumers of cigarettes and sugary drinks have low incomes, so their demand is likely to be elastic. A big enough tax-driven price rise cuts their consumption sharply, and they may never form the habit'],
      ['It is market based', 'The market still allocates resources, but the externality is internalised: the polluter pays'],
      ['It raises revenue', 'The money can be used to reduce the harm or to provide goods with positive externalities'],
    ],
  ),
  table(
    ['Limit on a tax', 'Explanation'],
    [
      ['It may be ineffective', 'If demand is inelastic, consumption is largely unchanged'],
      ['Information may work better', 'Where consumers are not price sensitive it can be more effective to shift the demand curve inwards by informing them'],
      ['The substitute may still be harmful', 'E-cigarettes still contain nicotine and other harmful chemicals, so switching to them does not remove the harm'],
      ['Shadow markets', 'High taxes and prices push some buyers to illegal sources, such as cigarettes smuggled in from abroad. The government loses revenue and the quality of the goods may be worse, which harms consumers'],
      ['Producers may not bear the tax', 'It may be passed on to consumers, who are not always the people causing the harm'],
      ['It may be regressive', 'These goods are often consumed more heavily by poorer households, a problem made worse by inelastic demand'],
      ['The right rate is hard to find', 'It needs an accurate estimate of the size of the externality, which is very difficult; get it wrong and consumption is not optimal'],
    ],
  ),

  h('Subsidies: purpose, analysis and problems'),
  p(
    'A subsidy aims to encourage consumption or production. Examples include the Common Agricultural Policy, local bus and train services, winter fuel payments, support for university tuition, childcare and affordable housing. Government assistance lowers firms\' costs, so profitability rises and supply shifts RIGHT. The price falls from P1 to P2 and the quantity rises from Q1 to Q2. The cost to the government is the subsidy per unit multiplied by the new quantity. Consumers and producers both benefit, and the split depends on the elasticities of supply and demand.',
  ),
  table(
    ['Case', 'Market failure', 'Effect of the subsidy'],
    [
      [
        'Positive externality of consumption (education)',
        'Under-consumption: Q&ast; is above Qm',
        'The subsidy shifts MPC down to MPC − subsidy. The new equilibrium is at Q&ast;, with consumers paying the lower price Ps',
      ],
      [
        'Positive externality of production (a new housing estate)',
        'Under-production: Q&ast; is above Qm',
        'The subsidy shifts MPC down to MPC − subsidy, so the new equilibrium is at the social optimum P&ast;, Q&ast;',
      ],
    ],
  ),
  table(
    ['Problem with a subsidy', 'Explanation'],
    [
      ['Expensive', 'It may have to be paid for by higher taxes, and the money could have been spent on something else, such as health or education (an opportunity cost)'],
      ['Producers may not react', 'If producers simply keep the subsidy as extra profit and do not raise supply, consumption does not rise'],
      ['Consumption may not rise', 'If demand is price inelastic, the quantity bought barely increases when the price falls'],
      ['Hard to know how big', 'It needs an accurate estimate of the size of the externality, which is very difficult; get it wrong and consumption is not optimal'],
    ],
  ),

  h('Regulation: how it is used against market failure'),
  table(
    ['Example', 'Why the market fails', 'How regulation responds'],
    [
      [
        'Smoking',
        'Smokers do not realise the damage to their bodies, and there is passive smoking, smell and litter',
        'Health warnings and images on packets, and a ban on smoking in enclosed public places and workplaces (in England, Wales and Northern Ireland since 2007). Both reduce demand',
      ],
      [
        'Alcohol',
        'Drinkers underestimate the harm of heavy drinking, and there is anti-social behaviour and noise',
        'Licensing rules restrict opening hours and who may sell, which reduces demand',
      ],
      [
        'Cocaine and other drugs',
        'Users underestimate the harm to their health and appearance, and addicts often turn to crime to pay for drugs',
        'A ban on drugs such as cocaine, heroin and cannabis. Supply shifts left because firms will not operate in illegal markets, and demand shifts in because few are willing to break the law',
      ],
      [
        'Car travel',
        'Drivers underestimate the benefit of seat belts and the danger of drink driving',
        'Compulsory seat belts (with fines), a drink-drive limit and compulsory driving licences',
      ],
      [
        'Pollution',
        'Firms ignore the cost of pollution to third parties',
        'Limits on emissions raise firms\' costs (R&D to meet the standards) and so reduce the supply of cars. A ban on sales of new petrol and diesel cars from a fixed future date changes demand and supply over time',
      ],
      [
        'Education',
        'Individuals are myopic and underestimate the benefits of education, and they ignore the benefit to third parties',
        'In England young people aged 16 to 18 must stay in full-time education, start an apprenticeship or traineeship, or work or volunteer for 20 hours or more a week while in part-time education or training',
      ],
      [
        'Healthcare',
        'Patients cannot tell whether the advice of doctors and nurses can be trusted (asymmetric information)',
        'Doctors and nurses must hold qualifications and a licence, which can be withdrawn for malpractice',
      ],
      [
        'Housing development',
        'Developers ignore overcrowding, congestion and lack of parking',
        'Planning rules require enough parking, green space and so on. This raises costs, shifting supply left and reducing building',
      ],
    ],
  ),
  table(
    ['Case for regulation', 'Explanation'],
    [
      ['Simple', 'It is easy to understand'],
      ['It sends a signal', 'A ban signals that behaviour is wrong'],
      ['Fairer', 'Otherwise wealthy people could simply pay to break a rule, such as drink driving. If an activity puts others at risk it should be disallowed completely'],
      ['The danger is great', 'For something as harmful as heroin an outright ban may be better than any price signal'],
      ['Revenue', 'Fines, such as for speeding, bring in money'],
    ],
  ),
  table(
    ['Limit on regulation', 'Explanation'],
    [
      ['It may not be enforceable', 'People cheat, so punishments are needed. Age limits on alcohol and tobacco are hard to enforce because an older friend can buy for a minor. Test purchases (young people paid to try to buy alcohol) backed by large fines or loss of the licence deter under-age sales'],
      ['Banning everything is inefficient', 'Banning cars from city centres cuts pollution but could harm business. The socially efficient level of pollution is not zero, and a tax can produce a more efficient outcome'],
      ['No incentive to improve', 'Once a limit is set there is no reward for polluting below it, so firms have no incentive to innovate beyond it'],
      ['Shadow economy', 'Prohibition pushes trade underground, gives criminal gangs more economic power, and illegal drugs may be of poorer quality'],
      ['Costly and slow', 'Enforcement is expensive, and laws have to pass through Parliament and take time to take effect'],
      ['Revenue', 'Taxes may be a better way to collect revenue than fines'],
    ],
  ),
  worked(
    'The government considers banning fast-food shops from serving children in the hour after school ends. Show the effect on a cost-benefit diagram and say how feasible it is.',
    'Fast food is a negative externality of consumption. The ban reduces demand (MPB shifts left) because children can no longer buy food in that hour, moving consumption towards Q&ast;. It would be difficult to enforce: there are several times as many fast-food outlets as premises with 24-hour alcohol licences, so monitoring them all would be far harder.',
  ),
  worked(
    'Suppose the government requires schools to serve meals with wooden rather than plastic cutlery and to include a healthy item such as half an avocado in every meal. Show the effect on a cost-benefit diagram and give a drawback for children.',
    'There are two externalities here: a negative externality of consumption (unhealthy eating) and a negative externality of production (plastic waste created in producing the meals), so the regulation has to take both into account. A drawback is that the price of school meals may rise, which is particularly harmful in a cost-of-living crisis.',
  ),

  h('Tradable pollution permits: the idea, the case for and the limits'),
  worked(
    'Residents of a new development are each allocated one car parking space. You travel to work by tube and have no family commitments. What might you do with your parking permit, and what does it show about tradable permits?',
    'You could sell it to a family that needs two spaces, for example because both parents work far from public transport. The permit goes to whoever values it most, and you gain from not using it. Tradable pollution permits work the same way: the government fixes the number of permits (the total pollution allowed), firms that need to pollute more than their permits allow buy more, and firms with spare permits sell them. The permit price is set where demand meets the fixed supply.',
  ),
  table(
    ['Case for permits', 'Explanation'],
    [
      ['The quantity is fixed', 'The government sets the number of permits (for example 100 units of CO2 a year) instead of letting the market decide how much to pollute, as a tax does. Even if demand for permits rises with economic growth the quantity stays the same, and as firms switch to cleaner technology the government can cut the number of permits'],
      ['It is market based', 'Firms are rewarded for cutting pollution because they can sell unused permits. The government may reduce supply to keep the permit price high, and cuts happen where they are cheapest'],
      ['The polluter pays', 'The charge falls on pollution, not output, so a large firm that is environmentally efficient pays less than a small firm that pollutes heavily'],
      ['Revenue', 'The government earns revenue if it sells permits rather than giving them away, and from fines on those who breach their limits'],
    ],
  ),
  table(
    ['Limit on permits', 'Explanation'],
    [
      ['The optimal level is unknown', 'Too few permits means under-production; too many means over-production'],
      ['Allocation is hard', 'Bigger firms and countries that find it easier to cut pollution benefit. China, for example, argues that the UK was allowed to pollute for many years, so China should be allowed more permits'],
      ['PED for permits', 'For large firms the price of a permit is a small share of total costs, so demand for permits is inelastic and they keep polluting at similar levels. Richer countries can buy permits from poorer ones, so pollution may not fall in some places'],
      ['Costly to enforce', 'There are administration costs and the need to check that pollution is within limits. Pollution is hard to measure and firms can hide it, and multinationals can move production to countries with lower environmental standards'],
      ['Political interference', 'Schemes need many countries to agree, and the countries that pollute most will not accept a scheme that harms their economies. Permits are therefore often oversupplied and cheap, and enforcement is weak. The US rejected the Kyoto Protocol (1997) and Canada later withdrew: why pay when you can simply leave?'],
    ],
  ),
  worked(
    'Show the effect of a tradable pollution permit scheme on a market failure diagram.',
    'Paying for permits (or investing to pollute less) raises private costs, so MPC shifts up from MPC1 to MPC2. At the same time less pollution means a smaller external cost, so MSC shifts down from MSC1 to MSC2. The gap between the two narrows and output moves towards the social optimum Q&ast;.',
  ),
  p(
    'A real case, the Kyoto Protocol (1997): industrialised countries agreed to cut greenhouse gas emissions by agreed percentages, using a permit trading system. The US, then the world\'s largest emitter with roughly a quarter of global emissions, rejected it in 2001 saying it would harm the US economy, which weakened the scheme even though most other countries agreed how to enforce it. The cuts were especially demanding for countries such as Japan whose industry was already energy efficient: Japan argued that more permits should be available and worried that Russia would hoard permits. Some progress was made at Doha in 2012, but China, whose emissions were rising rapidly with its growth, was not prepared to go further than Kyoto.',
  ),

  h('State provision'),
  table(
    ['Case for state provision', 'Explanation'],
    [
      ['Greater accessibility', 'Education and healthcare in the UK are free at the point of use, paid for through taxes, so everyone can use them and more positive externalities are enjoyed'],
      ['Greater equality', 'Everyone can afford to consume, whereas the poor could still miss out under a subsidy'],
      ['Economies of scale', 'Running the whole service can be cheaper than subsidising many private producers in a fragmented system'],
    ],
  ),
  table(
    ['Limit on state provision', 'Explanation'],
    [
      ['Cost', 'Providing a good free costs billions and has an opportunity cost. People are willing to pay for their private benefits (private schooling, private healthcare), so making it free is a big step'],
      ['Over-consumption', 'When a good is free, people who gain very little from it, for whom the cost of provision far exceeds the social benefit, still consume it, which leads to inefficiency'],
      ['Exploitation of the provision', 'People take it for granted and do not appreciate its true value: pupils who do not try at school, patients who book a doctor\'s appointment they do not really need'],
      ['Inefficiency', 'With no profit incentive there is likely to be organisational slack, and a lack of competition and incentive to innovate can leave quality low'],
      ['Reduced choice', 'Users have less choice than in a market with competing providers'],
    ],
  ),

  h('Information campaigns'),
  table(
    ['Campaign', 'What it does'],
    [
      ['Food labelling', 'The traffic-light system tells people at a glance whether a food is a healthy choice'],
      ['Talk to FRANK', 'Gives confidential advice on drugs'],
      ['When the Fun Stops, Stop', 'Encourages responsible gambling'],
      ['Cigarette pack messages', 'Slogans such as "Smoking damages your lungs" and shocking pictures'],
    ],
  ),
  table(
    ['Why a campaign can work', 'Why it may not'],
    [
      [
        'It reduces myopia and makes people realise the true value of what they consume, raising demand for merit goods and cutting demand for demerit goods',
        'People may already know the external costs and benefits (particularly in developed countries) but not care, so over- or under-consumption continues',
      ],
      [
        'Messages are easy to understand, as with traffic-light labels',
        'Campaigns are costly and time-consuming to run',
      ],
      [
        'Messages sit in very visible places such as the front of a cigarette packet, and a shocking picture, such as a patient on a ventilator, may be enough to stop someone buying a packet',
        'Do people listen? When food labels were introduced consumers read them often, but they look at them less now, so the impact has waned over time',
      ],
    ],
  ),

  h('Price controls: minimum and maximum prices'),
  table(
    ['', 'Minimum price', 'Maximum price'],
    [
      ['Where it is set', 'ABOVE the equilibrium price', 'BELOW the equilibrium price'],
      ['What it creates', 'Excess supply (a surplus): Qs − Qd', 'Excess demand (a shortage): Qd − Qs'],
      [
        'Why a government sets one',
        'To make sure producers get a good price, and to cut the quantity demanded of a harmful good',
        'To make sure consumers can afford the good or service',
      ],
      [
        'Examples',
        'The minimum wage, agricultural support, minimum unit pricing for alcohol',
        'Rent controls, price caps on energy and rail fares',
      ],
      [
        'Problems',
        'Unemployment in the case of a minimum wage (this assumes firms operate in a perfectly competitive labour market)',
        'A shortage that has to be allocated (first come first served, or rationing), and a black market is highly likely, for example concert tickets resold online. Rent controls can make housing more affordable but ultimately worsen the housing shortage',
      ],
    ],
  ),
  worked(
    'Why do countries introduce minimum prices for alcohol, and is it the best policy? (Scotland and Wales, for example, have introduced minimum unit pricing.)',
    'ANALYSIS: alcohol is a negative externality of consumption. A minimum price stops firms selling it below the floor, which cuts over-consumption and so reduces the market failure. EVALUATION: demand is likely to be inelastic because alcohol is addictive, so the policy may be ineffective. It is hard to know where to set the price: too low and there is still over-consumption, too high and there is under-consumption and a risk of unregulated black markets. It creates allocative inefficiency (price above marginal cost) and raises no tax revenue that could fund information campaigns. Regulation such as shorter opening hours or a higher legal drinking age, or a tax, may work better.',
  ),
  worked(
    'Evaluate, using a diagram, the effect of a price ceiling on consumer and producer surplus in the rental market.',
    'The ceiling is set below the equilibrium rent, so landlords supply fewer homes (a contraction of supply) while more people want to rent, which creates excess demand. Tenants who find a home pay less and gain a rectangle of consumer surplus, but those who would have rented at the equilibrium rent lose their surplus altogether, and producer surplus falls because landlords receive a lower price on fewer lets. The surplus on the lets that are no longer made is lost as a deadweight loss, so total surplus falls. If homes are rationed by queueing or luck rather than by willingness to pay, some of the remaining consumer surplus is also wasted.',
  ),
  worked(
    'Why do regulators cap prices in industries such as rail fares and energy, and what are the downsides?',
    'Few firms operate in these industries, so limited competition can lead to high prices, and a cap keeps basic necessities affordable. Cheaper rail travel also raises geographical mobility and can improve productivity. The downside is that a cap limits profit, which hurts consumers too, because they care about quality (punctuality and legroom on trains, for example) as well as price.',
  ),
)

/* ======================================================================= GOVERNMENT FAILURE */

const governmentFailure = chapter(
  h('A worked example: maximum rents'),
  p('Aim of the policy: to bring rents down to an affordable level. Why it fails:'),
  ul([
    'Fewer homes are available to rent, so there is excess demand for rental housing.',
    'A black market develops. Many landlords rent homes "off the books" for cash, which leads to more unsafe, unofficial lets and less tax revenue for the government.',
    'A shortage of homes can also cause a shortage of workers, because workers have nowhere to live.',
  ]),
  p('Other examples of government failure include subsidising or taxing too much or too little.'),

  h('More causes of government failure'),
  table(
    ['Cause', 'Explanation'],
    [
      ['Distortion of price signals', 'Price controls (a maximum rent) or subsidies can distort price signals, leading to over- or under-production and a misallocation of resources'],
      ['Unintended consequences', 'Negative effects that were not planned for. Making cannabis illegal, for example, can create a shadow market that is unregulated and linked to more crime'],
      ['Excessive administrative costs', 'Interventions involve costs of implementation, monitoring and enforcement'],
      ['Information gaps', 'Interventions may rest on incomplete or inaccurate information about the market. A decision to intervene may also look like government failure later: free school milk was provided for many years but was eventually withdrawn because the costs outweighed the benefits'],
      ['Unnecessary intervention (extension)', 'Sometimes the market corrects itself. It is argued, for example, that smokers use the NHS but die earlier, so may need fewer years of NHS care in total, although this is contested'],
      ['Politics (extension)', 'Spending is raised or cut before an election to win votes, and a government may shelve a major infrastructure project, such as a high-speed rail line, for fear of losing the votes of those who oppose it even when the economic case is strong. LOBBYING: groups try to persuade MPs to back or water down policy, for example an industry inviting an MP to an event. SHORT-TERMISM: a quick fix such as an extra motorway lane instead of investing in public transport. GOVERNMENT PHILOSOPHY: more interventionist governments accept the failures of policies such as rent controls as the price of protecting vulnerable groups, while more market-oriented governments see the same policies as failures'],
    ],
  ),

  h('Consequences of government failure'),
  table(
    ['Consequence', 'Explanation'],
    [
      ['Opportunity cost', 'Overspending in one area (over-subsidising a merit good, say) leaves less money to deal with market failure elsewhere, so choices must be made. Reviewing policies frequently is also costly'],
      ['Shadow markets', 'A price ceiling set too low (rent controls) or a ban on a good (drugs, weapons) can create unregulated markets that carry real risks: a rented home may not meet health and safety standards, or drugs may be dangerously impure. The government also loses tax revenue'],
      ['Unemployment', 'Over-taxation can cut output, which reduces the derived demand for labour and raises unemployment'],
      ['The extent of the failure', 'The socially optimal quantity is subjective and differs between governments. Missing Q&ast; by a small amount, when Q&ast; is itself uncertain, may not matter much, yet it is still labelled government failure'],
    ],
  ),
)

export const ECON_MASTER_T1_NOTES = {
  'Government Intervention in Markets': intervention,
  'Government Failure': governmentFailure,
  'Public Goods and Information Gaps': publicGoods,
  Externalities: externalities,
  'Economic Systems': economicSystems,
  'Consumer and Producer Surplus': surplus,
  'Price, Income and Cross Elasticities of Demand': elasticDemand,
  'Price Determination and the Price Mechanism': marketEquilibrium,
  'Supply and Elasticity of Supply': supply,
  Demand: demand,
  'Production Possibility Frontiers': ppf,
  'Economic Methodology and the Economic Problem': methodology,
  'Rational Decision Making': rationalDecisionMaking,
}
