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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {terrain.map((t) => (
          <span
            key={t}
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#e3f2fd',
              color: '#1565c0',
              borderRadius: '16px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            {terrainMap[t] || t}
          </span>
        ))}
      </div>
    );
  };

  const getVehicleTypeColor = (vehicleType: string): string => {
    const colorMap: { [key: string]: string } = {
      'SHIP': '#1976d2',
      'INFWAR': '#d32f2f',
      'SPELLJAMMER': '#7b1fa2',
      'OBJECT': '#388e3c',
      'CREATURE': '#f57c00'
    };
    return colorMap[vehicleType] || '#6c757d';
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
        <div className="vehicle-header" style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: getVehicleTypeColor(content.vehicleType) + '20',
          borderRadius: '6px',
          borderLeft: `4px solid ${getVehicleTypeColor(content.vehicleType)}`
        }}>
          <h4 style={{ 
            margin: '0 0 1rem 0', 
            color: getVehicleTypeColor(content.vehicleType),
            fontSize: '1.1rem'
          }}>
            Vehicle Information
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <DetailRow name="Type" value={formatVehicleType(content.vehicleType)} />
            {content.size && <DetailRow name="Size" value={formatSize(content.size)} />}
          </div>
        </div>

        {/* Combat Statistics */}
        {(content.ac || content.hp) && (
          <div className="vehicle-combat" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#ffebee',
            borderRadius: '6px',
            borderLeft: '4px solid #f44336'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#c62828',
              fontSize: '1.1rem'
            }}>
              Combat Statistics
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {content.ac && <DetailRow name="Armor Class" value={content.ac} />}
              {content.hp && <DetailRow name="Hit Points" value={formatHitPoints(content.hp)} />}
            </div>
          </div>
        )}

        {/* Speed */}
        {content.speed && <SpeedDisplay speed={content.speed} />}

        {/* Capacity Information */}
        {(content.capCrew || content.capPassenger || content.capCargo) && (
          <div className="vehicle-capacity" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0f8ff',
            borderRadius: '6px',
            borderLeft: '4px solid #2196f3'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#1976d2',
              fontSize: '1.1rem'
            }}>
              Capacity
            </h4>
            <div style={{ fontSize: '0.95rem' }}>
              {formatCapacity(content.capCrew, content.capPassenger, content.capCargo)}
            </div>
          </div>
        )}

        {/* Terrain */}
        {content.terrain && content.terrain.length > 0 && (
          <div className="vehicle-terrain" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#e8f5e8',
            borderRadius: '6px',
            borderLeft: '4px solid #4caf50'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#2e7d32',
              fontSize: '1.1rem'
            }}>
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
          <div className="vehicle-description" style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ 
              color: '#495057', 
              marginBottom: '1rem',
              borderBottom: '2px solid #dee2e6',
              paddingBottom: '0.5rem'
            }}>
              Description
            </h4>
            <ContentEntries entries={content.entries} />
          </div>
        )}

        {/* Actions/Weapons */}
        {content.action && content.action.length > 0 && (
          <div className="vehicle-actions" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fff3e0',
            borderRadius: '6px',
            borderLeft: '4px solid #ff9800'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#f57c00',
              fontSize: '1.1rem'
            }}>
              Actions & Weapons
            </h4>
            {content.action.map((action: any, index: number) => (
              <div key={index} style={{ 
                marginBottom: '1rem',
                paddingLeft: '1rem',
                borderLeft: '3px solid #ffb74d'
              }}>
                {action.name && (
                  <h5 style={{ 
                    margin: '0 0 0.5rem 0',
                    fontWeight: 'bold',
                    color: '#ef6c00'
                  }}>
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
          <div className="vehicle-equipment" style={{
            padding: '1rem',
            backgroundColor: '#f3e5f5',
            borderRadius: '6px',
            borderLeft: '4px solid #9c27b0'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#7b1fa2',
              fontSize: '1.1rem'
            }}>
              Special Equipment
            </h4>
            <ContentEntries entries={content.equipment} />
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}