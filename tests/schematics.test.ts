import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ShipHullSchematic from '../src/components/ShipHullSchematic';
import { emptyShip, recomputeShip } from '../src/lib/storage';
import { setWeaponFacing, addWeapon } from '../src/lib/rules';

test('schematic telemetry distinguishes intact, damaged, critical and zero hull', () => {
  for (const [mhp, label] of [[100,'HULL INTACT'],[75,'HULL DAMAGED'],[30,'HULL CRITICAL'],[0,'HULL AT ZERO']] as const) {
    const html = renderToStaticMarkup(createElement(ShipHullSchematic, {size:'Transport',mhp,maxMhp:100,shields:0,maxShields:12,weapons:[]}));
    assert.ok(html.includes(label));
    assert.ok(html.includes('SHIELDS DEPLETED'));
    assert.ok(!html.includes('NaN'));
  }
});

test('unshielded craft and installed weapons have explicit accessible labels', () => {
  const html = renderToStaticMarkup(createElement(ShipHullSchematic, {size:'Fighter',mhp:20,maxMhp:20,shields:0,maxShields:0,weapons:[{name:'Phase Beam',facing:'Forward'}]}));
  assert.ok(html.includes('NO SHIELDS'));
  assert.ok(html.includes('Forward: 1 mounted weapon'));
  assert.ok(html.includes('charge, not facing'));
});

test('editing a fixed weapon facing cannot bypass mounting rules', () => {
  const ship = addWeapon(recomputeShip({...emptyShip(),players:4}), 'Phase Beam');
  assert.equal(setWeaponFacing(ship, 0, 'Turret'), ship);
  assert.equal(setWeaponFacing(ship, 0, 'Port').weapons[0].facing, 'Port');
});
