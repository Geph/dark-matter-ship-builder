// ============================================================
// "Describe the Ship" flavor tables (Dark Matter Sci-Fi 5E,
// pp.215-217). Roll d100 or pick manually for each category.
// Each entry stores its d100 range for authentic rolling.
// Sourced from the rulebook PDF provided by the user.
// ============================================================

export interface FlavorEntry {
  /** Inclusive lower bound of the d100 range. */
  min: number;
  /** Inclusive upper bound (100 represented as 100). */
  max: number;
  text: string;
}

export interface FlavorTable {
  id: 'appearance' | 'condition' | 'interior' | 'unique';
  title: string;
  entries: FlavorEntry[];
}

export const APPEARANCE_TABLE: FlavorTable = {
  id: 'appearance',
  title: 'What Does the Ship Look Like?',
  entries: [
    { min: 1, max: 4, text: 'It resembles a galleon, with an open deck and full sails, all grown from elven ironwood.' },
    { min: 5, max: 8, text: "It's shaped like a flying saucer, with rooms laid out in concentric rings." },
    { min: 9, max: 12, text: 'This space train has no fewer than six cars attached, some still loaded with cargo.' },
    { min: 13, max: 16, text: "It's more like an asteroid with engines." },
    { min: 17, max: 20, text: "This retrofitted space station isn't aerodynamic but has tons of interior space." },
    { min: 21, max: 24, text: 'This old mining rig comes complete with an enormous drill on its nose.' },
    { min: 25, max: 28, text: 'Painted white with a red cross, this medical ship was designed to service disaster areas.' },
    { min: 29, max: 32, text: 'Designed to resemble an enormous crab, this ship can brave ocean depths and deep space alike.' },
    { min: 33, max: 36, text: 'This yacht was designed for comfort and style more than practicality.' },
    { min: 37, max: 40, text: 'The racing stripe, sponsor logos, and flame decals make it clear this was once a rally ship.' },
    { min: 41, max: 44, text: "Sleek and futuristic, this ship's hull is a single graceful curve of chrome." },
    { min: 45, max: 48, text: 'This bright yellow, rectangular ship was designed to ferry children to and from school.' },
    { min: 49, max: 52, text: 'The jagged chitin and hairy tendrils make this ship look like an enormous insect.' },
    { min: 53, max: 56, text: 'This was perhaps once a Low World submarine, now refitted with thrusters and a Dark Matter drive.' },
    { min: 57, max: 60, text: 'This ship features dozens of maximum-security cells for transporting dangerous criminals.' },
    { min: 61, max: 64, text: 'This ship was magically petrified or else carved entirely from marble.' },
    { min: 65, max: 68, text: 'The body of the ship is cramped, built around a single, enormous railgun.' },
    { min: 69, max: 72, text: 'Built from enormous magical crystals, this ship emits an unearthly hum at all times.' },
    { min: 73, max: 76, text: 'In lieu of a hull, someone has built this ship inside the corpse of a magically-preserved purple worm.' },
    { min: 77, max: 80, text: 'With enormous treads, this ship can shift into a land-crawler once it touches down.' },
    { min: 81, max: 84, text: 'A foul, sour stench clings to this industrial garbage-hauling ship, which features an enormous trash compactor.' },
    { min: 85, max: 88, text: 'With enormous claws tipped with void crystals, this ship burrows into the Void to jump across space.' },
    { min: 89, max: 92, text: 'Shaped like a disco ball, this ship is a multi-floor party cruiser, the height of luxury entertainment.' },
    { min: 93, max: 96, text: 'This great ironwood tree bears engines in its roots and various rooms about its trunk.' },
    { min: 97, max: 100, text: 'This ominous floating pyramid is inscribed with intricate, technological hieroglyphics.' },
  ],
};

export const CONDITION_TABLE: FlavorTable = {
  id: 'condition',
  title: "What's the Ship's Condition?",
  entries: [
    { min: 1, max: 10, text: "It's amazing this rusted piece of junk still flies." },
    { min: 11, max: 20, text: "Aside from the hole blasted in the cargo bay, it's in perfect condition." },
    { min: 21, max: 30, text: "It's absolutely infested with software bugs." },
    { min: 31, max: 40, text: 'Judging by the cobwebs and layers of dust, nobody has flown this thing in a long time.' },
    { min: 41, max: 50, text: 'The artificial gravity fails every ten minutes or so.' },
    { min: 51, max: 60, text: 'Something or someone might be living in the maintenance ducts.' },
    { min: 61, max: 70, text: 'About half of the ship is salvaged from another vessel, making it look like two ships in one.' },
    { min: 71, max: 80, text: 'Someone painted it a garish green and purple.' },
    { min: 81, max: 90, text: "It's got a couple of dents, but someone clearly took care of it and threw in some upgrades." },
    { min: 91, max: 100, text: "Fresh off the lot, it's still got that new-ship smell!" },
  ],
};

export const INTERIOR_TABLE: FlavorTable = {
  id: 'interior',
  title: "What's Inside the Ship?",
  entries: [
    { min: 1, max: 4, text: "The interior is lousy with smuggler's compartments, secret rooms, and hidden corridors. You'll never find them all." },
    { min: 5, max: 8, text: 'Everyone shares one crew cabin with a dozen or more hammocks.' },
    { min: 9, max: 12, text: "The captain's quarters adjoins a full-size board room for important meetings." },
    { min: 13, max: 16, text: 'Half of the cargo bay houses a rustic-looking bar.' },
    { min: 17, max: 20, text: 'A cryo bay allows the entire crew to be frozen for extended sublight flights.' },
    { min: 21, max: 24, text: 'An ornate chapel aboard the ship is dedicated to the Sun Above.' },
    { min: 25, max: 28, text: 'The engine room utilizes steam pistons to move the ship.' },
    { min: 29, max: 32, text: 'The interior is modeled in classical style with statues and columns.' },
    { min: 33, max: 36, text: 'The ship possesses an enormous aquarium of Poseidon Solution, suitable for nautilid passengers.' },
    { min: 37, max: 40, text: 'Each of the crew rooms can deploy from the ship as its own shuttle.' },
    { min: 41, max: 44, text: 'The armory is fully stocked with Low World swords, bows, and axes.' },
    { min: 45, max: 48, text: 'The center of the ship contains a courtyard and a traditional dojo.' },
    { min: 49, max: 52, text: 'The hallways are gnome-sized—barely five-feet tall.' },
    { min: 53, max: 56, text: 'Surveillance cameras monitor every corner of the ship, feeding back to a security room filled with glowing screens.' },
    { min: 57, max: 60, text: 'This ship contains a sprawling greenhouse, overgrown with alien flora.' },
    { min: 61, max: 64, text: "The mess hall contains a half dozen vending machines stocked with snacks and drinks from across the 'Verse." },
    { min: 65, max: 68, text: "An enormous purpose-built golem works in the engine room and Dark Matter core, but can't leave the ship." },
    { min: 69, max: 72, text: 'One of the crew quarters has been converted into a music studio with soundproof walls and recording equipment.' },
    { min: 73, max: 76, text: 'The cargo bay contains stables for horses and other livestock.' },
    { min: 77, max: 80, text: 'An entire room is a mess of wires and hardware, dedicated to robotics design and repair.' },
    { min: 81, max: 84, text: 'This ship has a five star restaurant experience in its dining hall, with tablecloths, fine silverware, and automaton waiters.' },
    { min: 85, max: 88, text: 'The medical bay is full of organic wrothian devices, including several floor-to-ceiling tanks of green fluid.' },
    { min: 89, max: 92, text: 'Shag carpets line most floors of the ship, and every room has a water bed.' },
    { min: 93, max: 96, text: 'With elegant gilding on the guns and hull and felt lining the interior, this ship looks designed for a king.' },
    { min: 97, max: 100, text: 'A series of dizzying gravity lifts connect the floors.' },
  ],
};

export const UNIQUE_TABLE: FlavorTable = {
  id: 'unique',
  title: "What's Unique About the Ship?",
  entries: [
    { min: 1, max: 4, text: "A cat, completely unaffected by gravity, lives aboard this ship and won't leave." },
    { min: 5, max: 8, text: 'A figurine of a skathári hula dancer has been Sovereign Glued to the dashboard.' },
    { min: 9, max: 12, text: "The pilot's seat is a literal throne." },
    { min: 13, max: 16, text: 'The mess hall has an infinite coffee dispenser.' },
    { min: 17, max: 20, text: 'Due to a botched repair job, the artificial gravity works upside down.' },
    { min: 21, max: 24, text: 'A ghost haunts the cargo bay.' },
    { min: 25, max: 28, text: 'This ship has no windows, just sensor screens.' },
    { min: 29, max: 32, text: 'The Dark Matter core produces gallons of mysterious ooze whenever it jumps.' },
    { min: 33, max: 36, text: 'Someone needs to hand-crank the engine to get it to start.' },
    { min: 37, max: 40, text: 'Instead of landing gear, several dozen automation legs help the ship touch down.' },
    { min: 41, max: 44, text: 'The ship relies on a pair of enormous dragon wings attached to its hull to fly in the atmosphere.' },
    { min: 45, max: 48, text: 'This ship is famous; it was once used in a historic heist.' },
    { min: 49, max: 52, text: 'The sound system installed in the bridge is insane.' },
    { min: 53, max: 56, text: 'Magical, hallucinogenic mushrooms sprout from the inside of the hull.' },
    { min: 57, max: 60, text: 'Artificial gravity in this ship pulls passengers to walls and ceilings, maximizing spatial efficiency.' },
    { min: 61, max: 64, text: 'In addition to its other weapons, the ship has a giant slingshot for launching junk.' },
    { min: 65, max: 68, text: "The ship computer's only interface is a pipe organ." },
    { min: 69, max: 72, text: 'A mob of wizmos live aboard the ship and maintain the engine. Without their pranks, meddling, and maintenance, the whole ship would promptly break down.' },
    { min: 73, max: 76, text: "The ship's life support produces atmosphere toxic only to elves." },
    { min: 77, max: 80, text: 'Confetti launchers on the outside of the ship are rigged to fire on a safe landing.' },
    { min: 81, max: 84, text: 'A strange hull modification makes the ship look like it has a moustache.' },
    { min: 85, max: 88, text: 'This ship was custom-built for a celebrity, whose likeness is still plastered everywhere in bas reliefs, statues, and frescos.' },
    { min: 89, max: 92, text: "There's a nest of thwirrels in the Dark Matter core. It's too dangerous to remove." },
    { min: 93, max: 96, text: 'Several systems on the ship rely on trained mimics to act as replacement components.' },
    { min: 97, max: 100, text: 'Whenever the Dark Matter engine jumps, someone aboard the ship receives a cryptic vision of the future.' },
  ],
};

export const FLAVOR_TABLES: FlavorTable[] = [
  APPEARANCE_TABLE,
  CONDITION_TABLE,
  INTERIOR_TABLE,
  UNIQUE_TABLE,
];

/** Roll d100 against a table and return the matching entry's text. */
export function rollFlavor(table: FlavorTable): string {
  const roll = Math.floor(Math.random() * 100) + 1; // 1..100
  const entry = table.entries.find((e) => roll >= e.min && roll <= e.max);
  return entry ? entry.text : table.entries[0].text;
}
