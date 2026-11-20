/*
  Theme 3.4 (market structures), from the MASTER course documents.

  Monopoly, Monopolistic Competition and Oligopoly, read end to end against
  what each chapter already said. (Perfect Competition and Contestable
  Markets were covered earlier, in econ-notes-firm-master.js.) Like the other
  MASTER files it adds only what was missing or thinner than the source and
  is merged onto the END of each chapter.

  What it adds, chapter by chapter:

    Monopoly               the model's assumptions and how to test a firm
                           against them; a scorecard on the four efficiencies
                           and on consumer welfare; the natural monopoly
                           subsidy and nationalisation arguments; perfect
                           price discrimination worked in a table; when
                           monopoly beats perfect competition.
    Monopolistic           testing real industries (hairdressers, hotels)
    Competition            against the assumptions; the exit story; a consumer
                           welfare scorecard.
    Oligopoly              a worked concentration ratio and its limits;
                           strategic alliances and tacit collusion; why
                           collusion breaks down; a firm payoff matrix worked
                           through; efficiency and consumer welfare scorecards.
*/

import { h, p, ul, defn, det, worked, tip, table, chapter } from './econ-notes-build'

/* ====================================================================== MONOPOLY */

const monopoly = chapter(
  h('The assumptions of the monopoly model'),
  table(
    ['Assumption', 'What it means'],
    [
      ['A single seller', 'One firm is the whole industry'],
      ['No substitutes', 'There are no firms selling similar products either, which gives the firm its market power'],
      ['High barriers to entry and exit', 'The firm can use its market power without fear of new entrants'],
      ['Short-run profit maximisation', 'It produces where MC = MR'],
    ],
  ),
  tip(
    'If an exam asks whether a firm shows monopoly behaviour, test it against these four assumptions in turn. Royal Mail, for example, is the sole deliverer of letters to every household, but email is an increasingly strong substitute, so it fails the "no substitutes" test.',
  ),
  p(
    'Monopoly power comes from two broad sources. LEGAL: the government grants a licence (the BBC was originally the only TV broadcaster) or a patent, which gives a fixed period of exclusive rights to reward R&D. GROWTH AND TAKEOVERS: a firm may outcompete or acquire its rivals until it dominates, sometimes called a competitive monopoly.',
  ),
  p(
    'Because the monopolist IS the industry it faces the downward-sloping market demand curve. To sell more it must cut the price, and if it raises the price it sells less. It can therefore set price OR output but not both: it is a price MAKER.',
  ),

  h('A scorecard for monopoly'),
  table(
    ['Efficiency', 'Achieved?', 'Why'],
    [
      ['Productive', 'No', 'The firm deliberately restricts output below the minimum efficient scale to keep prices high'],
      ['Allocative', 'No', 'It charges above marginal cost (P > MC), so too few resources go to the good'],
      [
        'Dynamic',
        'Uncertain',
        'Traditional theory says no: with no competition there is no pressure to invest in R&D. But the supernormal profit may fund innovation designed to keep barriers high and prevent future entry',
      ],
      ['X-efficiency', 'No', 'Without competitive pressure, organisational slack can develop'],
    ],
  ),
  table(
    ['Consumer welfare feature', 'Present?', 'Why'],
    [
      ['Low prices', 'No', 'Market power and barriers let the firm restrict output and charge high prices without fear of entry'],
      ['High quality', 'Unlikely', 'Consumers have nowhere else to go, so there is little incentive to improve. Supernormal profit may still be spent on innovation to protect the barriers'],
      ['Choice', 'No', 'There is only one firm'],
    ],
  ),

  h('Natural monopoly: regulation, subsidy and nationalisation'),
  defn(
    'Natural monopoly',
    'An industry with such large economies of scale that only one firm is viable: it is more efficient to have a single firm than several.',
  ),
  p(
    'Eurostar is a good example: the cost of the track and infrastructure is huge but the marginal cost of carrying one more passenger is small, so average cost keeps falling as output rises. A natural monopoly is still productively inefficient (not at the minimum of AC) and allocatively inefficient (P > MC), though it is closer to both than an industry split among many small firms.',
  ),
  p(
    'There is a strong case for regulating natural monopolies because they often supply essentials, such as water. The government can force the firm to charge the allocatively efficient price. But at that price the firm makes an economic LOSS, and since it would then want to leave the industry, the government must pay a SUBSIDY equal to the loss per unit multiplied by output.',
  ),
  det(
    'The cost of subsidy and nationalisation',
    'Both solve the pricing problem but create a different inefficiency.',
    [
      'With a subsidy the firm can only ever earn normal profit, so it has no incentive to control costs: if costs rise, the government simply pays more. The firm may also misreport its costs.',
      'NATIONALISATION (the state runs the industry) lets economies of scale be enjoyed without the firm exploiting consumers, because it is no longer a profit maximiser. Governments have taken train operators into public ownership for this kind of reason.',
      'The drawback is again X-inefficiency, because there is no profit incentive.',
    ],
    'The regulator also needs good information to set the right price, and may suffer regulatory capture, where it comes to serve the interests of the industry it oversees. Regulation can work: the risk of fines deters firms from lying about costs, and committees scrutinise public spending.',
  ),
  table(
    ['Advantages of a natural monopoly', 'Disadvantages'],
    [
      ['Avoids wasteful duplication of resources, so costs and probably prices are lower', 'A profit-maximising monopolist will still restrict output, leaving allocative inefficiency and high prices, which matters most for essential goods'],
      ['Nationalisation allows economies of scale without consumer exploitation', 'X-inefficiency where there is no profit incentive'],
      ['Regulation can achieve allocative efficiency through a pricing rule and a subsidy for the gap between average cost and price', 'The regulator needs enough information to set the rule, a regulated firm has no reason to cut costs, and regulatory capture may leave the regulator not independent'],
    ],
  ),

  h('Perfect price discrimination, worked'),
  p(
    'Compare perfect competition and monopoly with constant marginal cost. Under perfect competition price is lower and output higher, consumers keep all the surplus and there is no deadweight loss. Under monopoly output is lower and price higher, part of the consumer surplus becomes supernormal profit, and a deadweight loss appears. Even so the monopolist leaves consumers with some surplus. The only way to take it is to charge each consumer according to their willingness to pay.',
  ),
  table(
    ['Quantity', 'Price (£)', 'Total revenue (£)', 'Marginal revenue (£)', 'Average revenue (£)'],
    [
      ['1', '10', '10', '10', '10.00'],
      ['2', '9', '19', '9', '9.50'],
      ['3', '8', '27', '8', '9.00'],
      ['4', '7', '34', '7', '8.50'],
    ],
  ),
  p(
    'When every unit sells at its own price, each extra unit adds exactly its price to revenue, so MR equals the price: the demand curve becomes the marginal revenue curve. The firm now produces the perfectly competitive output, eliminating the deadweight loss, but ALL the surplus goes to the firm and consumer surplus is zero. This is perfect (first-degree) price discrimination. Total welfare equals that under perfect competition, but its distribution is entirely different.',
  ),
  p(
    'It is rarely realistic, though bespoke goods such as commissioned art or personalised jewellery come close, with the price negotiated between buyer and seller. An auction is NOT first-degree discrimination: the winner pays about what the second-highest bidder was willing to pay, not their own maximum. Partial (third-degree) discrimination is far more common: the firm splits the market into groups, such as age groups or peak and off-peak travellers, and charges more in the market with inelastic demand and less in the one with elastic demand, so total supernormal profit exceeds what a single price would give. It works because buses and cinemas can separate customers by age and the tickets cannot be resold.',
  ),

  h('More on evaluating monopoly'),
  table(
    ['Disadvantages (analysis)', 'Advantages (evaluation)'],
    [
      [
        'HIGH PRICES: market power is used to charge more, with productive and allocative inefficiency. With price discrimination consumers may have no surplus at all',
        'LOWER prices than perfect competition are possible where economies of scale are large; perfect price discrimination is unlikely; in a natural monopoly one firm is the most efficient arrangement',
      ],
      [
        'NO INCENTIVE to reinvest profits, because barriers to entry protect the firm',
        'DYNAMIC efficiency: supernormal profit can fund R&D, and a large domestic monopoly may compete more effectively against large foreign firms in world markets',
      ],
      [
        'REGULATION creates inefficiency: a firm forced to price at the efficient level never earns supernormal profit and so has no incentive to be X-efficient',
        'REGULATION can work: fines deter lies about costs, and public spending is scrutinised',
      ],
    ],
  ),
  det(
    'When a monopoly is better than perfect competition',
    'Draw the two market structures on the same diagram with different cost curves.',
    [
      'A monopoly can exploit huge economies of scale, so its marginal and average cost curves lie well below those of a large number of small competitive firms.',
      'The small deadweight loss from restricting output can then be outweighed by the gain in productive efficiency and the very large supernormal profit.',
      'It is even possible to draw the diagram so that the monopoly price is LOWER than the competitive price.',
    ],
    'This needs genuinely large economies of scale and a monopolist that passes some of the saving on, rather than keeping it all as profit. Without scale economies, the standard result of higher price and lower output holds.',
  ),
)

/* ============================================================ MONOPOLISTIC COMPETITION */

const monopolisticCompetition = chapter(
  h('Testing real industries against the assumptions'),
  p(
    'Perfect competition and monopoly are the two ends of the spectrum and few real industries match either strictly. To decide whether an industry is monopolistically competitive, test it against each assumption in turn:',
  ),
  table(
    ['Assumption', 'Hairdressers', 'Hotels'],
    [
      [
        'Differentiated products',
        'Yes: the style, the service, the atmosphere, extras on offer',
        'Yes: pool, games room, air conditioning, quality of the bed',
      ],
      [
        'Many small firms',
        'Yes: several on almost every high street',
        'Largely: many independent hotels, but a few large chains dominate parts of the market, which weakens the fit',
      ],
      [
        'No barriers to entry',
        'Yes: little more than scissors, a mirror and a chair to start',
        'Fairly: a small hotel in a lesser-known area can start modestly, though capital costs are higher',
      ],
      [
        'Short-run profit maximisers',
        'Higher prices at weekends and lower prices for children suggest firms set price to extract more',
        'Higher prices in the holidays suggest the same',
      ],
    ],
  ),
  p(
    'The firm is NOT a price taker. Because its product differs slightly from its rivals\', it has a little market power and can raise its price without losing all its customers. But with many close substitutes available, demand is elastic: the demand curve slopes down fairly gently.',
  ),

  h('Why a loss cannot last: the exit story'),
  p(
    'The chapter shows how supernormal profit attracts entry. The mirror image applies to a firm making a loss in the short run, where AC exceeds AR at the profit-maximising output.',
  ),
  ul([
    'There are no barriers to exit, so firms leave the market.',
    'Departures reduce the number of firms, so the demand facing each remaining firm rises and its AR curve shifts right, pushing price up.',
    'The process continues until AR is tangent to AC again, at a new price and output where firms earn only normal profit. So neither supernormal profit nor losses can persist in the long run.',
  ]),
  p(
    'Firms compete mainly by making their product as distinctive as possible, to build loyalty: through modest advertising, after-sales service, a good location or better quality. This makes the firm\'s demand more inelastic by reducing the competition it faces.',
  ),

  h('A scorecard for consumer welfare'),
  table(
    ['Feature', 'Present?', 'Why'],
    [
      [
        'Low prices',
        'No',
        'Firms cannot exploit consumers, but prices are still fairly high, because the costs of differentiating a product on a small scale of output are high',
      ],
      [
        'High quality',
        'Yes, with a caveat',
        'The only thing between each firm and a perfectly elastic demand curve is its product\'s distinctiveness, so firms work to make it better. But with no supernormal profit there may be little funding for R&D, which limits real innovation',
      ],
      ['High choice', 'Yes', 'Many small firms selling differentiated products'],
    ],
  ),
  table(
    ['Advantages', 'Disadvantages'],
    [
      ['Choice: consumers enjoy a wide variety', 'Inefficiency: product differentiation causes allocative and productive inefficiency, because too many varieties are produced for any firm to charge a price equal to marginal cost'],
      ['Quality: competition for loyalty drives quality improvements', 'Meaningful innovation may be limited by the lack of profit'],
      ['Prices: firms cannot earn supernormal profit, as entry would compete it away', 'Prices are still higher than under perfect competition, because of the costs of small-scale differentiated production'],
    ],
  ),
)

/* ================================================================== OLIGOPOLY */

const oligopoly = chapter(
  h('Concentration ratios: a worked case and their limits'),
  defn('Market concentration ratio', 'The percentage share of the market held by a given number of the largest firms.'),
  table(
    ['Channel', '% of viewers, 2000', '% of viewers, 2016'],
    [
      ['BBC1', '27', '21'],
      ['BBC2', '11', '7'],
      ['ITV', '29', '17'],
      ['Channel 4', '11', '7'],
      ['Channel 5', '6', '5'],
      ['Others', '16', '43'],
    ],
  ),
  worked(
    'Calculate the four-firm concentration ratio for UK television viewing in 2000 and in 2016, and explain the change.',
    'BBC1 and BBC2 are one firm, the BBC. 2000: BBC (27 + 11 = 38) + ITV 29 + Channel 4 11 + Channel 5 6 = 84%. 2016: BBC (21 + 7 = 28) + ITV 17 + Channel 4 7 + Channel 5 5 = 57%. The market became much less concentrated, because many households now subscribe to satellite services such as Sky or watch streaming services such as Netflix, which sit in the "Others" row.',
  ),
  p(
    'A high concentration ratio suggests limited competition, because a few firms control the market. But the measure has two weaknesses that are worth using as evaluation:',
  ),
  table(
    ['Criticism', 'Explanation'],
    [
      [
        'The market is hard to define',
        'The three-firm ratio for The Sun, The Mirror and The Daily Express is low if all newspapers are counted, but high if the market is tabloids only. What matters is whether readers would switch: a reader is unlikely to move from the Mirror to a broadsheet when its price rises, because the product is different',
      ],
      [
        'It ignores how the share is split',
        'Two industries can both have a four-firm ratio of 80% yet behave very differently if shares are 50%, 10%, 10% and 10% in one and 20% each in the other. The first has one dominant firm; the second has four equals',
      ],
    ],
  ),

  h('More on collusion and why it breaks down'),
  table(
    ['Form', 'Explanation', 'Example'],
    [
      [
        'Tacit collusion and price leadership',
        'No formal agreement, but firms follow the pricing of a dominant or established firm, which helps them avoid detection by regulators',
        'UK energy suppliers have been criticised for charging very similar prices close to the regulated cap with no formal agreement. Similar prices may also just reflect similar costs and the cap itself, so such cases are hard to prove',
      ],
      [
        'Strategic alliances',
        'Not strictly collusion, but firms working together more loosely',
        'The big airline alliances (Star Alliance, oneworld and SkyTeam) divide up routes between members so that fewer members fly the same routes, limiting competition between them',
      ],
    ],
  ),
  ul([
    'Collusion is most likely to hold when firms have SIMILAR COSTS, so none has a natural advantage to exploit, and when ALL the firms in the industry are in the agreement, so none outside it needs to be matched.',
    'It tends to break down because the colluding firms earn supernormal profit, and each is tempted to cut its price to steal market share and raise its own profit further.',
    'Once one firm cuts, the others must respond to avoid losing share, and prices can spiral downwards in a PRICE WAR. The supermarkets, which price-match or beat each other, are the standard example.',
    'The threat of price wars is also why prices stay rigid: a small rise in costs is absorbed as lower supernormal profit rather than risking a price change that upsets the equilibrium.',
  ]),

  h('Game theory worked on a firm example'),
  p(
    'Vue and Cineworld both charge a high price for cinema tickets. Cineworld is thinking of cutting its price to win customers but does not know whether Vue would match. The payoffs are total revenue (Cineworld, Vue) in £m:',
  ),
  table(
    ['', 'Vue: low price', 'Vue: high price'],
    [
      ['Cineworld: low price', '5, 5', '15, 1'],
      ['Cineworld: high price', '1, 15', '10, 10'],
    ],
  ),
  worked(
    'What is Cineworld\'s best strategy, how does the matrix show why firms want to collude, and why may collusion not hold?',
    'Whatever Vue does, Cineworld does better with a LOW price (5 against 1 if Vue cuts; 15 against 10 if Vue holds), so low price is its dominant strategy. The same is true for Vue, so both cut and end up at 5 each: the Nash equilibrium. Both would do better at the high-price outcome (10 each), so they have a strong incentive to collude. But each also has an incentive to CHEAT: if the other holds the high price, undercutting raises its own revenue from 10 to 15. Collusion is therefore fragile.',
  ),
  tip(
    'In an exam use the dilemma in three steps: show that colluding at a high price maximises joint profit; show that one firm gains by cutting its price and taking the other\'s market share; then show that the rival responds, leaving lower prices and lower profits for both.',
  ),

  h('Oligopoly scorecards'),
  table(
    ['Efficiency', 'Achieved?', 'Why'],
    [
      ['Productive', 'No', 'Firms restrict output to keep prices high'],
      ['Allocative', 'No', 'Collusion holds price above the allocatively efficient level'],
      ['Dynamic', 'Yes, likely', 'Substantial supernormal profit pays for R&D and non-price competition'],
      ['X-efficiency', 'No, possibly', 'Price and output barely change even when firms\' costs differ, so slack can develop'],
    ],
  ),
  table(
    ['Consumer welfare', 'Present?', 'Why'],
    [
      ['Low prices', 'No', 'Collusion sets prices high to maximise joint profit, although if it breaks down a price war can benefit consumers'],
      ['High quality', 'Yes', 'Firms compete on non-price factors and have the profit to invest heavily in R&D, which builds brand loyalty'],
      ['Choice', 'Uncertain', 'There are several firms, but the dominant ones sell similar products, and that similarity is what makes them interdependent'],
    ],
  ),
)

export const ECON_MASTER_T3_NOTES = {
  Oligopoly: oligopoly,
  Monopoly: monopoly,
  'Monopolistic Competition': monopolisticCompetition,
}
