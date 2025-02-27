import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";

interface DamageInputs {
  medicalBills: number;
  futureMedicalExpenses: number;
  propertyDamage: number;
  lostWages: number;
  futureLostWages: number;
  generalDamagesMultiplier: number;
}

const CarAccidentSettlementCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<DamageInputs>({
    medicalBills: 0,
    futureMedicalExpenses: 0,
    propertyDamage: 0,
    lostWages: 0,
    futureLostWages: 0,
    generalDamagesMultiplier: 1.5
  });

  const handleInputChange = (field: keyof DamageInputs, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    setInputs(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const calculateSettlement = () => {
    const economicDamages = 
      inputs.medicalBills +
      inputs.futureMedicalExpenses +
      inputs.propertyDamage +
      inputs.lostWages +
      inputs.futureLostWages;

    const totalDamages = economicDamages * inputs.generalDamagesMultiplier;
    return totalDamages;
  };

  const MoneyInput = ({ label, field }: { label: string; field: keyof DamageInputs }) => {
    const [localValue, setLocalValue] = React.useState('');

    const handleBlur = () => {
      const numValue = localValue === '' ? 0 : parseFloat(localValue.replace(/,/g, ''));
      handleInputChange(field, numValue.toString());
    };

    React.useEffect(() => {
      if (inputs[field] === 0 && localValue === '') return;
      setLocalValue(inputs[field].toLocaleString('en-US', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      }));
    }, [inputs[field]]);

    return (
      <div className="mb-8">
        <label htmlFor={field} className="block text-base font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <Input
            id={field}
            name={field}
            type="text"
            inputMode="numeric"
            className="pl-7 pr-4 py-3 text-lg"
            placeholder="0.00"
            value={localValue}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9.]/g, '');
              if (raw === '' || /^\d*\.?\d{0,2}$/.test(raw)) {
                setLocalValue(raw);
              }
            }}
            onBlur={handleBlur}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="bg-gray-100 min-h-screen p-4 md:p-8">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Car Accident Settlement Calculator
                </h1>
                <p className="text-lg text-slate-600">
                  Estimate the potential value of your car accident settlement claim
                </p>
              </div>
              
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <div>
                    <MoneyInput label="Medical Bills" field="medicalBills" />
                    <MoneyInput label="Property Damage" field="propertyDamage" />
                    <MoneyInput label="Future Lost Wages" field="futureLostWages" />
                  </div>
                  <div>
                    <MoneyInput label="Future Medical Expenses" field="futureMedicalExpenses" />
                    <MoneyInput label="Lost Wages" field="lostWages" />
                    <div className="mb-8">
                      <label htmlFor="generalDamagesMultiplier" className="block text-base font-medium text-gray-700 mb-2">
                        General Damages Multiplier
                      </label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="generalDamagesMultiplier"
                          type="range"
                          min="1.5"
                          max="5"
                          step="0.01"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          value={inputs.generalDamagesMultiplier}
                          onChange={(e) => handleInputChange('generalDamagesMultiplier', e.target.value)}
                        />
                        <span className="text-lg font-medium text-gray-900 min-w-[4rem]">
                          {inputs.generalDamagesMultiplier.toFixed(2)}x
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-medium text-blue-900">Estimated Settlement:</span>
                  <span className="text-3xl font-bold text-blue-600">
                    ${calculateSettlement().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>Note: This calculator provides a rough estimate of potential settlement value. Actual compensation may vary based on specific circumstances, liability, insurance coverage, and other factors. Consult with a legal professional for accurate evaluation of your case.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CarAccidentSettlementCalculator; 