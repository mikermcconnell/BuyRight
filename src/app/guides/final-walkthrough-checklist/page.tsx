'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  EyeIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  FireIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  LightBulbIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

export default function FinalWalkthroughChecklistGuide() {
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const toggleCheck = (itemId: string) => {
    setCheckedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const systemChecks = [
    {
      id: 'electrical',
      title: 'Electrical System',
      icon: BoltIcon,
      color: 'yellow',
      items: [
        { id: 'lights', text: 'Turn on all light switches and fixtures' },
        { id: 'outlets', text: 'Test electrical outlets with phone charger or small device' },
        { id: 'ceiling-fans', text: 'Check ceiling fans operate and change speeds' },
        { id: 'garage-door', text: 'Test garage door opener and safety features' },
        { id: 'doorbell', text: 'Ring doorbell to ensure it works' },
        { id: 'gfci', text: 'Test GFCI outlets in bathrooms and kitchen (push test/reset buttons)' }
      ]
    },
    {
      id: 'plumbing',
      title: 'Plumbing & Water',
      icon: WrenchScrewdriverIcon,
      color: 'blue',
      items: [
        { id: 'faucets', text: 'Turn on all faucets - check hot and cold water' },
        { id: 'water-pressure', text: 'Check water pressure in showers and sinks' },
        { id: 'toilets', text: 'Flush all toilets and check they refill properly' },
        { id: 'leaks', text: 'Look under sinks for any leaks or water damage' },
        { id: 'water-heater', text: 'Check water heater is running (should be warm/hot)' },
        { id: 'sprinklers', text: 'Test sprinkler system if present' }
      ]
    },
    {
      id: 'hvac',
      title: 'Heating & Cooling',
      icon: FireIcon,
      color: 'orange',
      items: [
        { id: 'thermostat', text: 'Test thermostat - try heating and cooling modes' },
        { id: 'air-flow', text: 'Check air flow from all vents in each room' },
        { id: 'air-filter', text: 'Look at air filter condition' },
        { id: 'unit-running', text: 'Listen for HVAC unit running when thermostat is adjusted' },
        { id: 'temp-change', text: 'Feel for temperature change from vents' }
      ]
    },
    {
      id: 'appliances',
      title: 'Included Appliances',
      icon: HomeIcon,
      color: 'green',
      items: [
        { id: 'refrigerator', text: 'Check refrigerator is cold and freezer is frozen' },
        { id: 'dishwasher', text: 'Run dishwasher through a quick cycle' },
        { id: 'stove-oven', text: 'Test stove burners and oven (turn on briefly)' },
        { id: 'microwave', text: 'Test built-in microwave' },
        { id: 'washer-dryer', text: 'Test washer and dryer if included' },
        { id: 'garbage-disposal', text: 'Run garbage disposal with water' }
      ]
    },
    {
      id: 'doors-windows',
      title: 'Doors & Windows',
      icon: HomeIcon,
      color: 'gray',
      items: [
        { id: 'doors-open-close', text: 'Open and close all doors (interior and exterior)' },
        { id: 'door-locks', text: 'Test all door locks and deadbolts' },
        { id: 'windows-open', text: 'Open and close several windows' },
        { id: 'window-locks', text: 'Check window locks work' },
        { id: 'sliding-doors', text: 'Test sliding patio doors' }
      ]
    }
  ];

  const additionalChecks = [
    'Walk through and verify agreed-upon repairs were completed',
    'Check that seller removed all their belongings',
    'Confirm included items (appliances, fixtures) are still present',
    'Look for any new damage since your last visit',
    'Check that house keys, garage remotes, and manuals are available',
    'Take photos of any issues you find',
    'Make note of anything that needs immediate attention'
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'orange':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'green':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const totalItems = systemChecks.reduce((total, system) => total + system.items.length, 0);
  const checkedCount = checkedItems.length;
  const progressPercent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className="duolingo-container min-h-screen py-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Journey</span>
          </button>
          
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--duolingo-green)' }}>
            <ClipboardDocumentListIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="duolingo-title mb-4">Final Walkthrough Checklist</h1>
          <p className="duolingo-subtitle max-w-3xl mx-auto">
            Test all utilities and major systems before closing. Use this interactive checklist 
            to make sure everything works as expected.
          </p>
        </div>

        {/* Progress */}
        <div className="duolingo-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Walkthrough Progress</h2>
            <span className="text-lg font-bold" style={{ color: 'var(--duolingo-green)' }}>
              {progressPercent}%
            </span>
          </div>
          
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progressPercent}%`,
                backgroundColor: 'var(--duolingo-green)'
              }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600">
            {checkedCount} / {totalItems} items checked
          </div>
        </div>

        {/* System Checks */}
        <div className="space-y-6 mb-8">
          {systemChecks.map((system) => {
            const IconComponent = system.icon;
            const colorClasses = getColorClasses(system.color);
            const systemChecked = system.items.filter(item => checkedItems.includes(item.id)).length;
            const systemTotal = system.items.length;
            
            return (
              <div key={system.id} className={`p-6 rounded-lg border-2 ${colorClasses}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-3">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold">{system.title}</h3>
                  </div>
                  <span className="text-sm font-medium">
                    {systemChecked}/{systemTotal}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {system.items.map((item) => {
                    const isChecked = checkedItems.includes(item.id);
                    return (
                      <div 
                        key={item.id}
                        className="flex items-center p-3 bg-white rounded-lg border cursor-pointer hover:border-green-300 transition-colors"
                        onClick={() => toggleCheck(item.id)}
                      >
                        <div className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-all
                          ${isChecked 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-green-400'
                          }
                        `}>
                          {isChecked && <CheckCircleIcon className="w-3 h-3" />}
                        </div>
                        <span className={`text-sm ${isChecked ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                          {item.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Checks */}
        <div className="duolingo-card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Things to Check</h3>
          
          <div className="space-y-2">
            {additionalChecks.map((check, index) => (
              <div key={index} className="flex items-start text-sm text-gray-700">
                <ExclamationTriangleIcon className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                {check}
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="duolingo-card mb-8">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <div className="flex items-start">
              <LightBulbIcon className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">💡 Walkthrough Tips</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Bring your agent and take notes/photos of any issues</li>
                  <li>• Don't expect perfection - focus on major functionality</li>
                  <li>• Test things you'll use daily (lights, water, heat/AC)</li>
                  <li>• If something major doesn't work, discuss with your agent immediately</li>
                  <li>• Remember this is your last chance to address issues before closing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className="duolingo-card">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">✅</span>
            Ready for Your Walkthrough?
          </h2>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Use this checklist during your final walkthrough. Most issues are minor, 
              but it's important to test everything before you get the keys.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="duolingo-button"
              >
                Back to Closing Process
              </button>
              
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
              >
                Print Checklist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}