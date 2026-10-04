import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyShip, recomputeShip, saveShip, getShip, importShips, listShips } from '../src/lib/storage';
import { budgetForLevel, withGrantedSystems, computeCreditsSpent, computeShieldPoints, dmEngineUpgradeCost, canInstallUpgrade, validateShip, canInstallSystem, canInstallFighterSystem, canEquipWeaponOnFighterClass, slotsUsed, fighterSlotCapacity, fighterSlotsUsed, fighterBayMhp, fighterBayShieldPoints, fighterBayLoadoutBillableCost, setFighterBayCatalogId, gunnerAttackBonus, setFighterBuildHull, addWeapon } from '../src/lib/rules';
import { SHIP_STATS_BY_LEVEL, SHIELD_POINTS_BY_SIZE, MAP_SIZE_FEET } from '../src/data/shipStats';
import { SYSTEMS_BY_ID } from '../src/data/systems';
import { UPGRADES_BY_ID } from '../src/data/upgrades';
import { WEAPONS_BY_NAME } from '../src/data/weapons';
import { FIGHTER_CATALOG, defaultFighterBayLoadout, normalizeFighterBayType } from '../src/data/fighters';
import { CREW_ACTIONS, isActionAvailable, emergencyRepairDice } from '../src/data/crewActions';
import { FLAVOR_TABLES } from '../src/data/flavorTables';
import { parseShipImportFile, shipsToJson } from '../src/lib/shipTransfer';
import { shipToText } from '../src/lib/exportText';
import { MEGA_SPELLS, MEGA_SPELLS_BY_ID } from '../src/data/megaSpells';
import type { Ship } from '../src/lib/types';

const store = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', { value: {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
} });

function shipAt(level = 1): Ship {
  const ship = { ...emptyShip(), level, players: 4, crewRoles: ['pilot'] };
  return recomputeShip({ ...ship, systems: withGrantedSystems(ship) });
}

test('a fresh build already has its free starting systems and shields', () => {
  const ship = emptyShip();
  assert.equal(slotsUsed(ship), 4);
  assert.equal(ship.shieldPoints, 8);
  assert.equal(computeCreditsSpent(ship), 0);
});

test('Mega spells match the p. 401 catalog and key corrected effects', () => {
  assert.deepEqual([1,2,3,4,5].map((level) => MEGA_SPELLS.filter((s) => s.level === level).length), [4,4,3,3,2]);
  assert.equal(MEGA_SPELLS_BY_ID['conjure-asteroid'].damage, 'No direct damage');
  assert.equal(MEGA_SPELLS_BY_ID['meteoroid-shower'].damage, '2d4 Mega Bludgeoning');
  assert.equal(MEGA_SPELLS_BY_ID['shield-burst'].damage, '5d8 Mega Lightning');
  assert.equal(MEGA_SPELLS_BY_ID['eldritch-rift'].damage, '3d6 Mega Bludgeoning');
  assert.equal(MEGA_SPELLS_BY_ID['dark-matter-override'].save, 'Wis');
  assert.match(MEGA_SPELLS_BY_ID['dark-matter-override'].description, /blind void jump/);
  assert.equal(MEGA_SPELLS_BY_ID['antimatter-nova'], undefined);
  const ship = shipAt();
  ship.crewMembers.gunner = { name:'', skillModifier:0, attackBonus:0, megaSpells:['antimatter-nova'] };
  assert.ok(validateShip(ship).some((e) => e.includes('Unverified legacy spell')));
});

test('text export includes corrected fighter stats and loadout', () => {
  const ship = shipAt(8);
  ship.systems['fighter-bay'] = 1;
  const next = setFighterBayCatalogId(ship, 0, 'sabre');
  next.fighterBays[0].pilotLevel = 8;
  const text = shipToText(recomputeShip(next));
  assert.match(text, /FIGHTER BAYS/);
  assert.match(text, /MHP: 40 • AC: 13 • SP: 0/);
  assert.match(text, /Phase Beam \[Forward\]/);
});

test('all 20 level rows match printed p. 218, including shield advancement within sizes', () => {
  const sp = [8,8,10,10,12,12,12,14,14,14,16,16,16,18,18,18,20,20,20,20];
  const slots = [14,15,16,17,18,18,19,20,20,21,22,22,23,24,24,25,26,26,27,28];
  const ac = [14,14,15,15,15,16,16,16,17,17,17,18,18,18,19,19,19,20,20,20];
  const engines = [1,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7];
  const cargo = [8,11,17,25,40,55,80,120,180,260,400,600,800,1000,2000,3000,4000,6000,8000,12000];
  const passengers = [4,5,6,7,8,11,15,18,22,25,30,45,60,75,90,105,120,150,180,210];
  SHIP_STATS_BY_LEVEL.forEach((row, i) => {
    const ship = shipAt(i + 1);
    assert.deepEqual([ship.mhp,ship.ac,ship.shieldPoints,ship.totalSlots,ship.darkMatterClass,ship.cargo,ship.passengers,ship.speed,ship.maneuverability],
      [20*(i+1),ac[i],sp[i],slots[i],engines[i],cargo[i],passengers[i],3000,90]);
    assert.equal(row.size, i<4?'Personal':i<10?'Transport':i<16?'Corvette':'Frigate');
    assert.deepEqual(validateShip(ship), []);
  });
});

test('budget, free systems and slot costs use p. 218', () => {
  assert.equal(budgetForLevel(5, 4), 6400);
  const ship = shipAt(5);
  assert.equal(computeCreditsSpent(ship), 0);
  assert.equal(slotsUsed(ship), 5);
  const bought = { ...ship, systems: {...ship.systems, 'gunner-bay': 2}, weapons:[{name:'Phase Beam',facing:'Forward' as const}], upgrades:['afterburners'] };
  assert.equal(computeCreditsSpent(bought), 2400);
  assert.equal(slotsUsed(bought), 8);
});

test('Expanded Shielding changes coverage, not SP; no generator means no ordinary shields', () => {
  const ship = { ...shipAt(3), upgrades:['expanded-shielding'] };
  assert.equal(computeShieldPoints(ship),10);
  assert.equal(computeShieldPoints({...ship,systems:{}}),0);
  assert.equal(SHIELD_POINTS_BY_SIZE.Fighter,4);
  assert.match(MAP_SIZE_FEET.Capital,/2,500/);
});

test('cargo and passenger upgrades double once, including repeated recomputation and removal', () => {
  const ship = recomputeShip({...shipAt(5),upgrades:['expanded-hold','expanded-quarters','cruising-engines']});
  assert.deepEqual([ship.cargo,ship.passengers,ship.speed],[80,16,3000]);
  assert.equal(recomputeShip(ship).cargo,80);
  assert.equal(recomputeShip({...ship,upgrades:[]}).cargo,40);
});

test('engine replacement purchases only the target class', () => {
  assert.equal(dmEngineUpgradeCost({...shipAt(),upgradedDmClass:3}),5000);
  assert.equal(dmEngineUpgradeCost({...shipAt(),upgradedDmClass:4}),52000);
  assert.equal(dmEngineUpgradeCost({...shipAt(8),upgradedDmClass:3}),0);
});

test('Hypercapacitor can be installed twice but other upgrades only once', () => {
  const ship = {...shipAt(),upgrades:['hypercapacitor']};
  assert.equal(canInstallUpgrade(ship,UPGRADES_BY_ID.hypercapacitor).ok,true);
  const twice = {...ship,upgrades:['hypercapacitor','hypercapacitor']};
  assert.equal(canInstallUpgrade(twice,UPGRADES_BY_ID.hypercapacitor).ok,false);
  assert.equal(computeCreditsSpent(twice),6000);
  assert.ok(validateShip({...ship,upgrades:['afterburners','afterburners']}).some(e=>e.includes('maximum 1')));
});

test('fighter pilot role grants its bay and respects level prerequisites', () => {
  const ship = {...shipAt(5),crewRoles:['pilot','pilot-fighter']};
  const granted = withGrantedSystems(ship);
  assert.equal(granted['fighter-bay'],1);
  assert.equal(computeCreditsSpent({...ship,systems:granted}),0);
  assert.ok(validateShip({...shipAt(),crewRoles:['pilot','captain']}).some(e=>e.includes('level 5')));
  assert.ok(validateShip({...shipAt(),systems:{}}).some(e=>e.includes('Missing required')));
});

test('system prerequisites and repeat caps apply both during installation and validation', () => {
  assert.equal(canInstallSystem(shipAt(),SYSTEMS_BY_ID['arcane-cannon']).ok,false);
  assert.equal(canInstallSystem({...shipAt(5),systems:{'fighter-bay':2}},SYSTEMS_BY_ID['fighter-bay']).ok,false);
  const ship = setFighterBayCatalogId({...shipAt(5),systems:{...shipAt(5).systems,'fighter-bay':1}},0,'sabre');
  const bay = ship.fighterBays[0];
  assert.equal(canInstallFighterSystem(bay,SYSTEMS_BY_ID['arcane-cannon']).ok,false);
  assert.equal(canInstallFighterSystem(bay,SYSTEMS_BY_ID['escape-pod-fighter']).ok,false);
  bay.systems['arcane-cannon']=1;
  assert.ok(validateShip(ship).some(e=>e.includes('Arcane Cannon requires Transport')));
});

test('p. 211 permits fighter Railguns but excludes NPC and frame attacks from purchases', () => {
  assert.equal(canEquipWeaponOnFighterClass(WEAPONS_BY_NAME.Railgun).ok,true);
  assert.equal(addWeapon(shipAt(),'Dark Pulse').weapons.length,0);
  assert.equal(addWeapon(shipAt(),'Uchigatana').weapons.length,0);
  assert.equal(addWeapon(shipAt(),'Phase Beam','Turret').weapons.length,0);
});

test('every catalog loadout fits its actual capacity and stock equipment has no surcharge', () => {
  for (const hull of FIGHTER_CATALOG) {
    const bay={type:'catalog' as const,catalogId:hull.id,displayName:'',...defaultFighterBayLoadout(hull.id)};
    assert.ok(fighterSlotsUsed(bay)<=fighterSlotCapacity(bay),hull.id);
    assert.equal(fighterBayLoadoutBillableCost(bay),0,hull.id);
    if (bay.weapons[0]?.facing==='Forward') bay.weapons[0].facing='Aft';
    assert.equal(fighterBayLoadoutBillableCost(bay),0,'Changing facing is not another purchase');
  }
});

test('Saber stock, player MHP, Hovercar slots, and Saucer shields match pp. 239–243', () => {
  const ship=setFighterBayCatalogId({...shipAt(5),systems:{'fighter-bay':1}},0,'sabre');
  const bay=ship.fighterBays[0];
  assert.equal(fighterBayMhp(bay),20);
  assert.equal(fighterBayMhp({...bay,pilotLevel:10}),50);
  assert.equal(fighterSlotCapacity({...bay,catalogId:'flying-car'}),2);
  assert.equal(fighterBayShieldPoints({...bay,catalogId:'saucer'}),8);
  assert.equal(fighterBayShieldPoints({...bay,systems:{'shield-generator':1}}),4);
  assert.equal(computeCreditsSpent(ship),2700); // 850 CR bay + 1,850 CR Saber.
  const fighter = recomputeShip(setFighterBuildHull({...shipAt(),isFighterBuild:true},'flying-car'));
  assert.deepEqual([fighter.totalSlots,fighter.cargo,fighter.passengers],[2,.5,7]);
});

test('explicitly removed fighter equipment stays removed after normalization', () => {
  const bay={type:'catalog' as const,catalogId:'sabre',displayName:'',systems:{},weapons:[]};
  assert.deepEqual(normalizeFighterBayType(bay).weapons,[]);
  assert.deepEqual(normalizeFighterBayType(bay).systems,{});
});

test('current crew actions replace obsolete edition rules', () => {
  for(const id of ['captain-brace','pilot-dogfighting','pilot-ram','engineer-direct-power','engineer-overcharge','gunner-switch-weapon']) assert.ok(!CREW_ACTIONS.some(a=>a.id===id));
  const evasive=CREW_ACTIONS.find(a=>a.id==='pilot-evasive')!;
  assert.equal(evasive.dc,15);
  assert.equal(isActionAvailable(evasive,{...shipAt(20),size:'Capital'}).ok,true);
  assert.equal(CREW_ACTIONS.find(a=>a.id==='dogfighter-targeted')?.type,'description');
  assert.ok(CREW_ACTIONS.some(a=>a.id==='captain-full-power-shields'));
  assert.deepEqual([1,3,4,20].map(emergencyRepairDice),[1,1,2,10]);
});

test('zero is a valid attack bonus, and skill modifier is not an attack bonus', () => {
  const ship={...shipAt(20),crewMembers:{gunner:{name:'',skillModifier:8,attackBonus:0,megaSpells:[]}}};
  assert.equal(gunnerAttackBonus(ship),0);
  assert.equal(gunnerAttackBonus({...ship,crewMembers:{}}),0);
});

test('flavor d100 tables have exactly one result for every possible roll', () => {
  for(const table of FLAVOR_TABLES) for(let n=1;n<=100;n++) assert.equal(table.entries.filter(e=>e.min<=n&&e.max>=n).length,1);
});

test('saved ships recalculate corrected stats on read without compounding upgrades', () => {
  store.clear(); const ship=saveShip({...shipAt(3),upgrades:['expanded-hold','expanded-shielding']});
  assert.equal(getShip(ship.id)?.shieldPoints,10);
  assert.equal(getShip(ship.id)?.cargo,34);
  assert.equal(saveShip(getShip(ship.id)!).cargo,34);
});

test('export/import preserves loadouts, creates new identities, and validates the whole batch', () => {
  store.clear(); const ship=shipAt(5); ship.name='Test ship';
  const parsed=parseShipImportFile(shipsToJson([ship]));
  assert.equal(importShips(parsed),1);
  assert.notEqual(listShips()[0].id,ship.id);
  assert.deepEqual(listShips()[0].systems,ship.systems);
  assert.throws(()=>importShips([ship,{...ship,systems:{'fighter-bay':1e20}}]),/Invalid ship import/);
  assert.equal(listShips().length,1);
});

test('malformed imports fail before expensive work or persistence', () => {
  const ship=shipAt();
  for(const bad of [
    {...ship,level:0}, {...ship,level:Number.POSITIVE_INFINITY}, {...ship,systems:{'fighter-bay':-2}},
    {...ship,systems:{'fighter-bay':0.5}}, {...ship,weapons:[{name:'Ram',facing:'Bogus'}]},
    {...ship,crewMembers:{pilot:null}}, {...ship,shipImageDataUrl:'https://tracking.example/image'},
    {...ship,shipImageDataUrl:'data:image/svg+xml;base64,AAAA'}, {...ship,upgrades:'bad'},
  ]) assert.throws(()=>parseShipImportFile(JSON.stringify(bad)),/Invalid ship import/);
  assert.throws(()=>parseShipImportFile('{"id":"x","name":"y","size":"Personal"}'),/Invalid ship import/);
  assert.throws(()=>parseShipImportFile(shipsToJson([ship]).replace('"systems": {','"systems": {"__proto__":1,')),/reserved key/);
  assert.throws(()=>parseShipImportFile(JSON.stringify(Array(101).fill(ship))),/at most 100/);
  assert.throws(()=>parseShipImportFile(' '.repeat(10*1024*1024+1)),/exceeds 10 MB/);
});
