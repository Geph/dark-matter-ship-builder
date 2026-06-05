import { useEffect, useMemo, useState, useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import type { Ship, WeaponFacing } from '../lib/types';

import { emptyShip, getShip, recomputeShip, saveShip } from '../lib/storage';

import {

  withGrantedSystems,

  validateShip,

  syncFighterBays,

  removeFighterWeaponAt,

} from '../lib/rules';

import WizardProgress from '../components/builder/WizardProgress';

import ResourceHud from '../components/builder/ResourceHud';

import ShipDiagram from '../components/ShipDiagram';

import StepCrew from '../components/builder/StepCrew';

import StepDescribe from '../components/builder/StepDescribe';

import StepBuild from '../components/builder/StepBuild';

import StepName from '../components/builder/StepName';



export default function Builder() {

  const { id } = useParams();

  const navigate = useNavigate();



  const [ship, setShipState] = useState<Ship>(() => {

    if (id) {

      const existing = getShip(id);

      if (existing) return existing;

    }

    return emptyShip();

  });

  const [step, setStep] = useState(0);

  const [selectedFacing, setSelectedFacing] = useState<WeaponFacing>('Forward');

  const [configTarget, setConfigTarget] = useState<'mothership' | number>('mothership');

  const [savedAt, setSavedAt] = useState<string | null>(null);



  const fighterBays = syncFighterBays(ship);

  const showBayConfig = !ship.isFighterBuild && fighterBays.length > 0;



  useEffect(() => {

    if (!showBayConfig) {

      setConfigTarget('mothership');

    } else if (

      typeof configTarget === 'number' &&

      configTarget >= fighterBays.length

    ) {

      setConfigTarget('mothership');

    }

  }, [showBayConfig, fighterBays.length, configTarget]);



  const update = useCallback((mutator: (s: Ship) => Ship) => {

    setShipState((prev) => {

      const mutated = mutator(prev);

      const reconciled = { ...mutated, systems: withGrantedSystems(mutated) };

      return recomputeShip(reconciled);

    });

    setSavedAt(null);

  }, []);



  useEffect(() => {

    if (id && !getShip(id)) {

      navigate('/build', { replace: true });

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);



  const errors = useMemo(() => validateShip(ship), [ship]);



  const handleSave = () => {

    const saved = saveShip(ship);

    setShipState(saved);

    setSavedAt(new Date().toLocaleTimeString());

    if (!id) navigate(`/build/${saved.id}`, { replace: true });

  };



  const effectiveConfigTarget = ship.isFighterBuild ? 'mothership' : configTarget;



  return (

    <div className="max-w-6xl mx-auto px-4 py-6">

      <WizardProgress step={step} onJump={setStep} />



      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">

        <div className="space-y-6 min-w-0">

          {step === 0 && <StepCrew ship={ship} update={update} />}

          {step === 1 && <StepDescribe ship={ship} update={update} />}

          {step === 2 && (

            <StepBuild

              ship={ship}

              update={update}

              selectedFacing={selectedFacing}

              configTarget={effectiveConfigTarget}

            />

          )}

          {step === 3 && (

            <StepName ship={ship} update={update} onSave={handleSave} savedAt={savedAt} />

          )}



          <div className="no-print flex items-center justify-between pt-2">

            <button

              className="btn"

              disabled={step === 0}

              onClick={() => setStep((s) => Math.max(0, s - 1))}

            >

              ◂ Back

            </button>

            <div className="flex gap-2">

              <button className="btn btn-amber" onClick={handleSave}>

                {savedAt ? `Saved ${savedAt}` : 'Save'}

              </button>

              {step < 3 ? (

                <button className="btn btn-solid" onClick={() => setStep((s) => Math.min(3, s + 1))}>

                  Next ▸

                </button>

              ) : (

                <button className="btn btn-solid" onClick={() => navigate('/ships')}>

                  My Ships ▸

                </button>

              )}

            </div>

          </div>



          {errors.length > 0 && (

            <div className="no-print panel p-4 border-danger/50">

              <h4 className="font-display text-xs tracking-widest text-danger mb-2">

                ⚠ FLIGHT-READINESS WARNINGS

              </h4>

              <ul className="space-y-1 text-sm text-slate-300 list-disc pl-5">

                {errors.map((e, i) => (

                  <li key={i}>{e}</li>

                ))}

              </ul>

            </div>

          )}

        </div>



        <div className="no-print space-y-5 lg:sticky lg:top-20">

          <ResourceHud ship={ship} update={update} />



          {effectiveConfigTarget === 'mothership' ? (

            <ShipDiagram

              ship={ship}

              selectedFacing={selectedFacing}

              onSelectFacing={setSelectedFacing}

              onRemoveWeapon={(index) =>

                update((s) => ({ ...s, weapons: s.weapons.filter((_, i) => i !== index) }))

              }

              fighterBayTargets={

                showBayConfig

                  ? {

                      bays: fighterBays,

                      active: configTarget,

                      onSelect: setConfigTarget,

                    }

                  : undefined

              }

            />

          ) : (

            <ShipDiagram

              ship={ship}

              fighterBay={fighterBays[configTarget as number]}

              fighterBayIndex={(configTarget as number) + 1}

              selectedFacing={selectedFacing}

              onSelectFacing={setSelectedFacing}

              onRemoveWeapon={(index) =>

                update((s) => removeFighterWeaponAt(s, configTarget as number, index))

              }

              fighterBayTargets={

                showBayConfig

                  ? {

                      bays: fighterBays,

                      active: configTarget,

                      onSelect: setConfigTarget,

                    }

                  : undefined

              }

            />

          )}

        </div>

      </div>

    </div>

  );

}


