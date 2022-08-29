addLayer("p", {
    name: "Prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ff0000",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "PP", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
        if (hasMilestone("G", 4))
            return new Decimal(0.54)
        else
            return new Decimal(0.5)
    },
    softcap: new Decimal(1e9),
    softcapPower: new Decimal(0.85),
    gainMult() { // Calculate the multiplier for main currency from bonuses
      let mult = new Decimal(1)
      if (hasUpgrade('p', 14)) mult = mult.times(upgradeEffect('p', 14))
      if (hasUpgrade('C', 12)) mult = mult.times(upgradeEffect('C', 12))
      return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
      11: {
        title: "Slow, isn't it?",
        description: "your point gain is added by 4",
        cost: new Decimal(1),
      },
      12: {
        title: "now we're getting somewhere",
        description: "your point gain is multiplied by 2",
        cost: new Decimal(4),
        unlocked() { return (hasUpgrade('p', 11)) },
      },
      13: {
        title: "Oh no, it's growing!",
        description: "makes so that PP multiplies points gain",
        cost: new Decimal(12),
        unlocked() { return (hasUpgrade('p', 12)) },
        effect() {
            if (hasUpgrade('p', 25)) return player[this.layer].points.add(1).pow(0.675).min(1e15)
            else if (hasUpgrade('p', 24)) return player[this.layer].points.add(1).pow(0.67).min(1e12)
            else if (hasUpgrade('p', 23)) return player[this.layer].points.add(1).pow(0.6).min(1.5e9)
            else return player[this.layer].points.add(1).pow(0.55).min(1e4)
          },
          effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
      14: {
        title: "now we're getting somewhere... 2",
        description: "points boost PP gain",
        cost: new Decimal(30),
        unlocked() { return (hasUpgrade('p', 13)) },
        effect() {
        if (hasUpgrade('p', 22)) return player.points.add(1).pow(0.2)
        if (!hasUpgrade('p', 22)) return player.points.add(1).pow(0.142)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
      },
      15: {
        title: "it's not THAT op",
        description: "points boost points gain",
        cost: new Decimal(100),
        unlocked() { return (hasUpgrade('p', 14)) },
        effect() {
        if (hasUpgrade('p', 21)) return player.points.add(1).pow(0.28)
        if (!hasUpgrade('p', 21)) return player.points.add(1).pow(0.17)
        },
      effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
      },
      21: {
        title: "not op becomes more op",
        description: "(it's not THAT op) formula is better",
        cost: new Decimal(1000),
        unlocked() { return (hasUpgrade('C', 11)) },
      },
      22: {
        title: "we're definitely getting somewhere",
        description: "(now we're getting somewhere... 2) formula is better",
        cost: new Decimal(50000),
        unlocked() { return (hasUpgrade('C', 12)) },
      },
      23: {
        title: "Atom",
        description: "(Oh no, it's growing!) formula is better",
        cost: new Decimal(250000),
        unlocked() { return (hasUpgrade('C', 12)) },
      },
      24: {
        title: "Molecule",
        description: "(Oh no, it's growing!) formula is EVEN better, and it's hardcap starts later",
        cost: new Decimal(1.5e16),
        unlocked() { return (hasMilestone('G', 5)) },
      },
      25: {
        title: "PASSIVE GENERAION!!!! (+ Cells)",
        description: "passively generates 30% of PP per second and does the same thing as (Molecule) does",
        cost: new Decimal(3e18),
        unlocked() { return (hasMilestone('G', 5)) },
      },
    },
    passiveGeneration(){
  		if (hasUpgrade('p', 25)) return 0.3;
  		return 0;
    },
    doReset(resettingLayer) {
  if (layers[resettingLayer].row <= layers[this.layer].row) return; // standard guard clause to keep the layer from resetting itself

  let keptUpgrades = []
  if (hasMilestone("G", 3)) keptUpgrades.push(11, 12, 13, 14, 15)
  if (hasMilestone("G", 5)) keptUpgrades.push(21, 22, 23)
  if (hasMilestone("G", 6)) keptUpgrades.push(24, 25)

  layerDataReset(this.layer) // can have a second argument, an array for the features you want to keep (all upgrades, all clickables, all challenges, etc., but no specific ones)

  player[this.layer].upgrades.push(...keptUpgrades)
},
    branches: ["C", "G"],  // When this layer appears, a branch will appear from this layer to any layers here. Each entry can be a pair consisting of a layer id and a color.
})
addLayer("C", {
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#FFC0CB",
    requires() {return new Decimal(3000)},
    resource: "crystals",
    baseResource: "points",
    baseAmount() {return player.points},
    type: "static",
    exponent(){
        if (hasMilestone("G", 2))
            return new Decimal(1.15)
        else
            return new Decimal(1.3)
    },
    base: 5,
    roundUpCost: true,
    canBuyMax() {return hasMilestone("G", 0)},
    //directMult() {return new Decimal(player.c.otherThingy)},
    gainMult() { // Calculate the multiplier for main currency from bonuses
      let mult = new Decimal(1)
      return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
      let exp = new Decimal(1)
      return new Decimal(1)
    },
    row: 1,
    layerShown() {return true},
    upgrades: {
      11: {
        title: "Crystals = +points",
        description: "your point gain is multiplied by crystals and unlock a new PP upgrade",
        cost: new Decimal(1),
        effect() {
          if (hasUpgrade('C', 14)) return player[this.layer].points.add(2).pow(2.87).min(10000)
          else if (hasUpgrade('C', 13)) return player[this.layer].points.add(2).pow(1.4).min(50)
          else return player[this.layer].points.add(2).pow(1.2).min(30)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
      },
      12: {
        title: "Crystals = +PP",
        description: "your PP gain is multiplied by crystals and unlocks two new PP upgrades",
        cost: new Decimal(4),
        unlocked() { return (hasUpgrade('C', 11)) },
        effect() {
          if (hasUpgrade('C', 14)) return player[this.layer].points.add(2).pow(1.3).min(100)
          else return player[this.layer].points.add(2).pow(1.16).min(30)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
      },
      13: {
        title: "(Crystals = +points)²",
        description: "(Crystals = +points) formula is better and remove his first hardcap",
        cost: new Decimal(8),
        unlocked() { return (hasUpgrade('C', 12)) },
      },
      14: {
        title: "(Crystals = +points)³",
        description: "(Crystals = +points) formula is MASSIVELY better, remove his second hardcap and secretely boosts something",
        cost: new Decimal(13),
        unlocked() { return (hasMilestone("G", 4)) },
      },
    },
 // When this layer appears, a branch will appear from this layer to any layers here. Each entry can be a pair consisting of a layer id and a color.
    tooltipLocked() { // Optional, tooltip displays when the layer is locked
        return ("You will need " + this.requires() + " points to unlock the layer. You only have " + formatWhole(player.points))
    },
    canReset() {
        return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
    },
},
)
addLayer("G", {
    color: "#C0C0C0",
    requires() {return new Decimal(15000)},
    type: "none",
    gainMult() { // Calculate the multiplier for main currency from bonuses
      let mult = new Decimal(1)
      return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
      let exp = new Decimal(1)
      return new Decimal(1)
    },
    row: 1,
    layerShown() {return player.C.best.gte(2)},
    tooltipLocked() { // Optional, tooltip displays when the layer is locked
        return ("You will need " + this.requires() + " points to unlock the layer. You only have " + formatWhole(player.points))
    },
    milestones: {
      0: {requirementDescription: "3 crystals",
          done() {return player.C.best.gte(3)}, // Used to determine when to give the milestone
          effectDescription: "You can max buy crystals",
        },
      1: {requirementDescription: "7 crystals",
          done() {return player.C.best.gte(7)}, // Used to determine when to give the milestone
          effectDescription: "points gain 400% more",
          unlocked() { return (hasMilestone('G', 0)) },
        },
      2: {requirementDescription: "9 crystals",
          done() {return player.C.best.gte(9)}, // Used to determine when to give the milestone
          effectDescription: "crystals expoent formula is better",
          unlocked() { return (hasMilestone('G', 1)) },
      },
      3: {requirementDescription: "11 crystals",
          done() {return player.C.best.gte(11)}, // Used to determine when to give the milestone
          effectDescription: "keep the first row of PP upgrades in crystalize",
          unlocked() { return (hasMilestone('G', 2)) },
        },
      4: {requirementDescription: "12 crystals",
            done() {return player.C.best.gte(12)}, // Used to determine when to give the milestone
            effectDescription: "PP expoent formula is a bit better and unlocks a new crystal upgrade",
            unlocked() { return (hasMilestone('G', 3)) },
        },
      5: {requirementDescription: "19 crystals",
            done() {return player.C.best.gte(19)}, // Used to determine when to give the milestone
            effectDescription: "unlockes two new PP upgrades and keeps the first 3 row 2 PP upgrades",
            unlocked() { return (hasMilestone('G', 4)) },
        },
      6: {requirementDescription: "21 crystals",
            done() {return player.C.best.gte(21)}, // Used to determine when to give the milestone
            effectDescription: "Keeps all row 2 upgrades",
            unlocked() { return (hasMilestone('G', 5)) },
        },
    },
},
)
addLayer("a", {
    color: "yellow",
    resource: "achievement power",
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievementPopups: true,
    achievements: {
        11: {
            image: "",
            name: "Start your journey",
            done() {return (hasUpgrade('p', 11)) }, // This one is a freebie
            goalTooltip: "just start, you know how to", // Shows when achievement is not completed
            doneTooltip: "Good", // Showed when the achievement is completed
        },
        12: {
            name: "Do a crystalize",
            done() {return player.C.best.gte(1)},
            tooltip: "WOW, CRYSTALS!!", // Showed when the achievement is completed
            unlocked() {return (hasUpgrade('p', 11)) },
        },
        13: {
            name: "Synergy",
            done() {return (hasUpgrade('C', 11))},
            tooltip: "That's a good upgrade", // Showed when the achievement is completed
            unlocked() {return (hasUpgrade('p', 11)) },
        },
        14: {
            name: "that acomplishment gotta be useful",
            done() {return player.C.best.gte(3)},
            tooltip: "Congrats on your first acomplishment", // Showed when the achievement is completed
            unlocked() {return player.C.best.gte(1) },
        },
        15: {
            name: "Synergy²",
            done() {return (hasUpgrade('C', 12))},
            tooltip: "That's a good upgrade²", // Showed when the achievement is completed
            unlocked() {return (hasUpgrade('C', 11)) },
        },
        16: {
            name: "Good acomplishment",
            done() {return player.C.best.gte(9)},
            tooltip: "a bit OP, i'd say", // Showed when the achievement is completed
            unlocked() {return player.C.best.gte(3)},
          },
        17: {
            name: "isn't this upgrade gettting a little too OP?",
            done() {return (hasUpgrade('C', 14))},
            tooltip: "I may nerf it in a near future, or not", // Showed when the achievement is completed
            unlocked() {return (hasUpgrade('C', 12))},
          },
        21: {
            name: "Passive generation incoming",
            done() {return (hasUpgrade('p', 25))},
            tooltip: "youy don't need to click this button anymore :)", // Showed when the achievement is completed
            unlocked() {return player.C.best.gte(9)},
          },
        22: {
            name: "The endgame?",
            done() {return player.points.gte(5e30)},
            goalTooltip: "reach the endgame (5e30 points)", // Shows when achievement is not completed
            doneTooltip: "Nice", // Showed when the achievement is completed
            textStyle: {'color': '#04e050'},
            unlocked() {return (hasUpgrade('C', 14))},
          },
    },
},
)
