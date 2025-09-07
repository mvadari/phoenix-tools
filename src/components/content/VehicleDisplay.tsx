import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';
import { SpeedDisplay, DamageResistanceBlock } from './shared';

interface VehicleDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function VehicleDisplay({ result, content, onClose }: VehicleDisplayProps) {
  const formatSize = (size: string): string => {
    const sizeMap: { [key: string]: string } = {
      'T': 'Tiny', 'S': 'Small', 'M': 'Medium', 
      'L': 'Large', 'H': 'Huge', 'G': 'Gargantuan'
    };
    return sizeMap[size] || size;
  };

  const formatVehicleType = (vehicleType: string): string => {
    const typeMap: { [key: string]: string } = {
      'SHIP': 'Ship',
      'INFWAR': 'Infernal War Machine',
      'SPELLJAMMER': 'Spelljammer',
      'OBJECT': 'Magical Object',
      'CREATURE': 'Living Vehicle'
    };
    return typeMap[vehicleType] || vehicleType;
  };

  const formatTerrain = (terrain: string[]): React.ReactNode => {
    if (!terrain || terrain.length === 0) return null;

    const terrainMap: { [key: string]: string } = {
      'sea': 'Sea/Ocean',
      'coastal': 'Coastal',
      'river': 'River/Lake',
      'land': 'Land',
      'air': 'Air',
      'space': 'Space',
      'underground': 'Underground'
    };

    return (
      <div className="terrain-list">
        {terrain.map((t) => (
          <span
            key={t}
            className="terrain-tag"
          >
            {terrainMap[t] || t}
          </span>
        ))}
      </div>
    );
  };


  const formatCapacity = (capCrew?: number, capPassenger?: number, capCargo?: number): React.ReactNode => {
    const capacities: string[] = [];
    if (capCrew) capacities.push(`Crew: ${capCrew}`);
    if (capPassenger) capacities.push(`Passengers: ${capPassenger}`);
    if (capCargo) capacities.push(`Cargo: ${capCargo} tons`);
    
    if (capacities.length === 0) return null;
    
    return capacities.join(' • ');
  };

  const formatHitPoints = (hp: number | { [key: string]: number }): string => {
    if (typeof hp === 'number') return hp.toString();
    if (typeof hp === 'object' && hp !== null) {
      return Object.entries(hp).map(([key, value]) => `${key}: ${value}`).join(', ');
    }
    return String(hp);
  };

  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="vehicle-display">
        {/* Vehicle Type and Size */}
        <div className="vehicle-header" data-vehicle-type={content.vehicleType}>
          <h4>
            Vehicle Information
          </h4>
          <div className="vehicle-basic-info">
            <DetailRow name="Type" value={formatVehicleType(content.vehicleType)} />
            {content.size && <DetailRow name="Size" value={formatSize(content.size)} />}
          </div>
        </div>

        {/* Combat Statistics */}
        {(content.ac || content.hp) && (
          <div className="vehicle-combat">
            <h4>
              Combat Statistics
            </h4>
            <div className="combat-stats">
              {content.ac && <DetailRow name="Armor Class" value={content.ac} />}
              {content.hp && <DetailRow name="Hit Points" value={formatHitPoints(content.hp)} />}
            </div>
          </div>
        )}

        {/* Speed */}
        {content.speed && <SpeedDisplay speed={content.speed} />}

        {/* Capacity Information */}
        {(content.capCrew || content.capPassenger || content.capCargo) && (
          <div className="vehicle-capacity">
            <h4>
              Capacity
            </h4>
            <div className="capacity-info">
              {formatCapacity(content.capCrew, content.capPassenger, content.capCargo)}
            </div>
          </div>
        )}

        {/* Terrain */}
        {content.terrain && content.terrain.length > 0 && (
          <div className="vehicle-terrain">
            <h4>
              Operating Terrain
            </h4>
            {formatTerrain(content.terrain)}
          </div>
        )}

        {/* Damage Resistances */}
        <DamageResistanceBlock
          resist={content.resist}
          immune={content.immune}
          vulnerable={content.vulnerable}
          conditionImmune={content.conditionImmune}
        />

        {/* Vehicle Description */}
        {content.entries && (
          <div className="vehicle-description">
            <h4>
              Description
            </h4>
            <ContentEntries entries={content.entries} />
          </div>
        )}

        {/* Actions/Weapons */}
        {content.action && content.action.length > 0 && (
          <div className="vehicle-actions">
            <h4>
              Actions & Weapons
            </h4>
            {content.action.map((action: any, index: number) => (
              <div key={index} className="action-item">
                {action.name && (
                  <h5>
                    {action.name}
                  </h5>
                )}
                {action.entries && <ContentEntries entries={action.entries} />}
              </div>
            ))}
          </div>
        )}

        {/* Special Equipment */}
        {content.equipment && (
          <div className="vehicle-equipment">
            <h4>
              Special Equipment
            </h4>
            <ContentEntries entries={content.equipment} />
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}