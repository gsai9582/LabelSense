import React, { useState } from 'react';
import { RegulatoryRadar } from './RegulatoryRadar';
import { ClauseRAGViewer } from './ClauseRAGViewer';
import { RuleExtractor } from './RuleExtractor';
import { REGULATORY_RADAR_UPDATES } from '../../data/regulatoryData';
import { RegulatoryUpdate, DeviceClass, TargetMarket } from '../../types';

export const SenseModule: React.FC = () => {
  const [updates] = useState<RegulatoryUpdate[]>(REGULATORY_RADAR_UPDATES);
  const [selectedUpdate, setSelectedUpdate] = useState<RegulatoryUpdate | null>(REGULATORY_RADAR_UPDATES[0]);
  const [selectedClass, setSelectedClass] = useState<DeviceClass | 'ALL'>('ALL');
  const [selectedMarket, setSelectedMarket] = useState<TargetMarket | 'ALL'>('ALL');
  const [promotedRules, setPromotedRules] = useState<string[]>(['MDR-BARRIER-REQ', 'FDA-UDI-MOD10']);

  const handlePromoteRule = (ruleCode: string) => {
    if (!promotedRules.includes(ruleCode)) {
      setPromotedRules([...promotedRules, ruleCode]);
    }
  };

  const handleAddRule = (newRule: any) => {
    setPromotedRules(prev => [...prev, newRule.ruleCode]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-190px)] min-h-[640px]">
      {/* Column 1: Regulatory Radar & Feeds (4 cols) */}
      <div className="lg:col-span-4 h-full">
        <RegulatoryRadar
          updates={updates}
          selectedUpdate={selectedUpdate}
          onSelectUpdate={setSelectedUpdate}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          selectedMarket={selectedMarket}
          setSelectedMarket={setSelectedMarket}
        />
      </div>

      {/* Column 2: Clause RAG & Legal Inspector (5 cols) */}
      <div className="lg:col-span-5 h-full">
        <ClauseRAGViewer
          selectedUpdate={selectedUpdate}
          onPromoteRule={handlePromoteRule}
          promotedRules={promotedRules}
        />
      </div>

      {/* Column 3: Automated Rule Extractor (3 cols) */}
      <div className="lg:col-span-3 h-full">
        <RuleExtractor onAddRule={handleAddRule} />
      </div>
    </div>
  );
};
