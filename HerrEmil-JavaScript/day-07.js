const parseData = (data) =>
  data.split(/\r?\n/).map((bag) => {
    const [color, contents] = bag.split(" bags contain ");
    let containsList = contents
      .replace(".", "")
      .split(", ")
      .map((bag) => bag.replace(/ bags?/, ""))
      .map((bag) => ({
        [bag.substring(2)]: parseInt(bag.charAt(0), 10),
      }));

    if (bag.includes("no other bags.")) {
      containsList = [];
    }
    const parsedBag = {
      [color]: containsList.reduce(
        (prev, curr) => Object.assign(prev, curr),
        {}
      ),
    };

    return parsedBag;
  });

const canHoldColor = (rules, rule, targetColor) => {
  const contents = Object.values(rule)[0];
  // if rule contains targetColor, return true
  if (contents.hasOwnProperty(targetColor)) {
    return true;
  }
  // for each contains, find rule and check if it can hold color
  return !!Object.keys(contents).find((color) => {
    const childRule = rules.find((rule) => rule.hasOwnProperty(color));
    return canHoldColor(rules, childRule, targetColor);
  });
};

const solve1 = (bagRules) => {
  const canIncludeShinyGold = bagRules.filter((rule, index, rules) =>
    canHoldColor(rules, rule, "shiny gold")
  );
  return canIncludeShinyGold.length;
};

const bagCount = (bag, rules) => {
  const children = Object.entries(Object.values(bag)[0]);
  // if no children, return 1
  if (children.length === 0) {
    return 1;
  }
  console.log(children)
  // for each of it children, return number * recursive
  return children.map(([color, count]) => {
    // find rule by color
    const child = rules.find((rule) => rule[color]);
    console.log(child)
    return  (count * bagCount(child, rules))
  }).reduce((acc, curr) => acc + curr, 0)
};

const solve2 = (rules) => {
  // find shiny gold bag
  const shinyGold = rules.find((rule) => rule["shiny gold"]);
  console.log(shinyGold);

  return bagCount(shinyGold, rules);
};

module.exports.solve1 = solve1;
module.exports.solve2 = solve2;
module.exports.parseData = parseData;
