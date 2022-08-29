let modInfo = {
	name: "The GCI Tree",
	id: "mymod",
	author: "nobody",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.2",
	name: "Beta",
}

let changelog = `<h1>Changelog:</h1><br><br>

	<h3>v1.0 beta</h3><br><br>

		- Added Crystalize.<br>
		- Added Acomplishments.<br>
		- Added 4 crystal upgrades.<br>
		- Added 10 PP upgrades.<br>
		- Added 9 achievements.<br>
		- Added 7 Milestones.<br>
		- Changed endgame from 3,000 points to 5e30 points.<br>
		- Changed so that the next upgrade only appears when you have bought the last one.<br>
		- Added 1 softcap.<br>
		- Added hardcaps for some upgrades.
		`


let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)
	let gain = new Decimal(1)
	if (hasUpgrade('p', 11)) gain = gain.add(4)
	if (hasUpgrade('p', 12)) gain = gain.mul(2)
	if (hasMilestone("G", 1)) gain = gain.mul(5)
	if (hasUpgrade('p', 13)) gain = gain.times(upgradeEffect('p', 13))
	if (hasUpgrade('p', 15)) gain = gain.times(upgradeEffect('p', 15))
	if (hasUpgrade('C', 11)) gain = gain.times(upgradeEffect('C', 11))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("5e30"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
