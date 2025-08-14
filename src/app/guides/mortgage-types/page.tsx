'use client';

import { useRouter } from 'next/navigation';
import { useRegional } from '@/contexts/RegionalContext';

export default function MortgageTypesGuide() {
  const router = useRouter();
  const { currentRegion, regionalContent } = useRegional();
  
  // Determine if user is in Canada or US
  const isCanada = currentRegion === 'ON' || currentRegion === 'BC';
  const isUS = currentRegion?.includes('-'); // US regions have format like CA-US, NY-US
  
  const regionName = currentRegion === 'ON' ? 'Ontario, Canada' 
                   : currentRegion === 'BC' ? 'British Columbia, Canada'
                   : isUS ? 'United States'
                   : 'your region';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-colors"
          >
            <span className="mr-2">←</span>
            <span>Back to Journey</span>
          </button>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📖</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Mortgage Types Guide
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Understanding mortgage types, programs, and requirements for first-time buyers in {currentRegion === 'ON' ? 'Ontario, Canada' : currentRegion === 'BC' ? 'British Columbia, Canada' : 'the United States'}.
            </p>
            
            {/* Region Indicator */}
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                📍 {currentRegion === 'ON' ? 'Ontario, Canada' : currentRegion === 'BC' ? 'British Columbia, Canada' : currentRegion?.includes('-') ? 'United States' : 'Region-specific guide'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Fixed vs Variable Rate Mortgages (Universal) */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                🏠 Fixed-Rate vs Variable-Rate Mortgages
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-900 mb-3">Fixed-Rate Mortgages</h3>
                  <p className="text-gray-700 mb-4">Your interest rate stays the same for the entire {isCanada ? 'term' : 'loan period'}.</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-green-800">
                      <strong>✓ Pros:</strong> Predictable payments, protection from rate increases
                    </div>
                    <div className="text-red-800">
                      <strong>✗ Cons:</strong> Higher initial rates, no benefit from rate drops
                    </div>
                  </div>
                  
                  {isCanada && (
                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                      <strong>🇨🇦 Canadian Note:</strong> Fixed rates typically available for 1-10 year terms, then mortgage must be renewed.
                    </div>
                  )}
                  
                  {isUS && (
                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                      <strong>🇺🇸 US Note:</strong> Fixed rates locked for the entire 15-30 year loan period.
                    </div>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">Variable-Rate Mortgages</h3>
                  <p className="text-gray-700 mb-4">Interest rate {isCanada ? 'fluctuates with the prime rate' : 'adjusts based on market conditions'}.</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-green-800">
                      <strong>✓ Pros:</strong> Lower initial rates, benefit from rate decreases
                    </div>
                    <div className="text-red-800">
                      <strong>✗ Cons:</strong> Payment uncertainty, risk of rate increases
                    </div>
                  </div>
                  
                  {isCanada && (
                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                      <strong>🇨🇦 Canadian Note:</strong> Rate changes immediately with prime rate changes. Common with 25-30 year amortizations.
                    </div>
                  )}
                  
                  {isUS && (
                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                      <strong>🇺🇸 US Note:</strong> Often called ARMs (Adjustable Rate Mortgages). May have initial fixed periods (e.g., 5/1 ARM).
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="my-8" />

            {/* Canadian Specific Content */}
            {isCanada && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    🇨🇦 Canadian Mortgage Programs & Requirements
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                      <h3 className="text-xl font-bold text-red-900 mb-3">CMHC Insurance (Required for &lt;20% Down Payment)</h3>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div><strong>When required:</strong> Down payment less than 20%</div>
                        <div><strong>Cost:</strong> 0.6% - 4.5% of mortgage amount</div>
                      </div>
                      <p className="text-red-800">
                        <strong>Key Point:</strong> In Canada, mortgage default insurance through CMHC, Genworth, or Canada Guaranty is mandatory for high-ratio mortgages (over 80% loan-to-value).
                      </p>
                    </div>

                    <div className="border border-green-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-green-900 mb-3">First-Time Home Buyer Programs</h3>
                      <div className="space-y-3">
                        <div className="bg-green-50 p-4 rounded">
                          <strong>First-Time Home Buyer Incentive (Federal):</strong>
                          <p className="text-sm text-green-800 mt-1">Shared equity mortgage with Government of Canada (5-10% of purchase price)</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded">
                          <strong>Home Buyers' Plan (HBP):</strong>
                          <p className="text-sm text-green-800 mt-1">Withdraw up to $35,000 from RRSP for down payment</p>
                        </div>
                        {currentRegion === 'ON' && (
                          <div className="bg-blue-50 p-4 rounded">
                            <strong>Ontario Specific - Land Transfer Tax Rebate:</strong>
                            <p className="text-sm text-blue-800 mt-1">Up to $4,000 rebate for first-time buyers</p>
                          </div>
                        )}
                        {currentRegion === 'BC' && (
                          <div className="bg-blue-50 p-4 rounded">
                            <strong>BC Specific - First Time Home Buyers Program:</strong>
                            <p className="text-sm text-blue-800 mt-1">Property transfer tax exemption for homes under $500,000</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Canadian Mortgage Key Terms</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <strong>Amortization Period:</strong> Total time to pay off mortgage (usually 25-30 years)
                        </div>
                        <div>
                          <strong>Mortgage Term:</strong> Length of current rate/conditions (1-10 years, typically 5)
                        </div>
                        <div>
                          <strong>Prime Rate:</strong> Base interest rate set by banks, used as reference for variable-rate mortgages (typically Bank of Canada rate + 2.2%)
                        </div>
                        <div>
                          <strong>Stress Test:</strong> Must qualify at higher rate (Bank of Canada 5-year benchmark or contract rate + 2%)
                        </div>
                        <div>
                          <strong>Renewal:</strong> At term end, renegotiate rate and conditions (not refinancing)
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                      <h4 className="font-bold text-yellow-900 mb-2">🚨 Important Canadian Requirements</h4>
                      <ul className="text-yellow-800 space-y-1">
                        <li>• <strong>Minimum 5% down payment</strong> (10% for homes over $500,000)</li>
                        <li>• <strong>Maximum 39% Total Debt Service ratio</strong> (all debts including mortgage)</li>
                        <li>• <strong>Maximum 32% Gross Debt Service ratio</strong> (housing costs only)</li>
                        <li>• <strong>Stress test qualification</strong> at higher interest rate</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* US Specific Content */}
            {isUS && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    🇺🇸 US Government-Backed Mortgage Programs
                  </h2>

                  <div className="space-y-6">
                    <div className="border border-blue-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-blue-900 mb-3">FHA Loans (Federal Housing Administration)</h3>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div><strong>Down payment:</strong> As low as 3.5%</div>
                        <div><strong>Credit score:</strong> 580+ (500+ with 10% down)</div>
                        <div><strong>Loan limits:</strong> Vary by county</div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <strong className="text-green-700">Pros:</strong>
                          <span className="text-gray-700 ml-2">Lower down payment, flexible credit requirements</span>
                        </div>
                        <div>
                          <strong className="text-red-700">Cons:</strong>
                          <span className="text-gray-700 ml-2">Mortgage insurance required for life of loan</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-green-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-green-900 mb-3">VA Loans (Veterans Affairs)</h3>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div><strong>Down payment:</strong> $0 in most cases</div>
                        <div><strong>Credit score:</strong> No minimum (lender-dependent)</div>
                        <div><strong>Eligibility:</strong> Veterans, active military, surviving spouses</div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <strong className="text-green-700">Pros:</strong>
                          <span className="text-gray-700 ml-2">No down payment, no PMI, competitive rates</span>
                        </div>
                        <div>
                          <strong className="text-red-700">Cons:</strong>
                          <span className="text-gray-700 ml-2">VA funding fee, property restrictions</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-yellow-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-yellow-900 mb-3">USDA Loans (Rural Development)</h3>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div><strong>Down payment:</strong> $0</div>
                        <div><strong>Credit score:</strong> 640+ typically</div>
                        <div><strong>Location:</strong> USDA-eligible rural areas</div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <strong className="text-green-700">Pros:</strong>
                          <span className="text-gray-700 ml-2">No down payment, competitive rates</span>
                        </div>
                        <div>
                          <strong className="text-red-700">Cons:</strong>
                          <span className="text-gray-700 ml-2">Geographic restrictions, income limits</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-purple-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-purple-900 mb-3">Conventional Loans</h3>
                      <p className="text-gray-700 mb-4">Not backed by government, offered by private lenders.</p>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <strong>Conforming Loans:</strong>
                          <p className="text-sm text-gray-600">Meet Fannie Mae/Freddie Mac guidelines. 2024 limit: $766,550 (higher in expensive areas)</p>
                        </div>
                        <div>
                          <strong>Non-conforming/Jumbo:</strong>
                          <p className="text-sm text-gray-600">Exceed conforming loan limits. Stricter requirements, higher rates.</p>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded">
                        <strong>Requirements:</strong> 3-20% down payment, 620+ credit score, PMI if less than 20% down
                      </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                      <h4 className="font-bold text-blue-900 mb-2">💡 US First-Time Buyer Programs</h4>
                      <ul className="text-blue-800 space-y-1">
                        <li>• <strong>Good Neighbor Next Door:</strong> 50% discount for teachers, firefighters, police, EMTs</li>
                        <li>• <strong>State & Local Programs:</strong> Down payment assistance, tax credits (varies by state)</li>
                        <li>• <strong>HomeReady/Home Possible:</strong> Low down payment conventional options</li>
                        <li>• <strong>IRA First-Time Buyer Withdrawal:</strong> Up to $10,000 penalty-free</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            <hr className="my-8" />

            {/* Decision Framework (Universal but region-aware) */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                🤔 How to Choose the Right Mortgage in {regionName}
              </h2>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h4 className="font-bold text-blue-900 mb-4">Key Questions to Ask Yourself:</h4>
                <div className="space-y-4">
                  <div>
                    <strong className="text-blue-900">1. How stable is my income and employment?</strong>
                    <p className="text-blue-800 text-sm mt-1">Fixed-rate provides predictability; variable offers potential savings if you can handle payment fluctuations.</p>
                  </div>
                  
                  <div>
                    <strong className="text-blue-900">2. How much can I put down?</strong>
                    <ul className="text-blue-800 text-sm mt-1 ml-4">
                      {isCanada ? (
                        <>
                          <li>• Less than 20% → CMHC insurance required</li>
                          <li>• 20% or more → Avoid mortgage insurance</li>
                        </>
                      ) : (
                        <>
                          <li>• Less than 3.5% → Limited options, consider FHA</li>
                          <li>• 3.5%-19% → FHA or conventional with PMI</li>
                          <li>• 20% or more → Best rates, no PMI</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <strong className="text-blue-900">3. What's my credit score?</strong>
                    <ul className="text-blue-800 text-sm mt-1 ml-4">
                      {isCanada ? (
                        <>
                          <li>• 680+ → Best rates available</li>
                          <li>• 600-679 → Good rates from most lenders</li>
                          <li>• Below 600 → Limited options, work on improving credit first</li>
                        </>
                      ) : (
                        <>
                          <li>• 740+ → Best rates on any program</li>
                          <li>• 620-739 → Most programs available</li>
                          <li>• 580-619 → FHA loans available</li>
                          <li>• Below 580 → Limited options</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {isCanada && (
                    <div>
                      <strong className="text-blue-900">4. Can I pass the mortgage stress test?</strong>
                      <p className="text-blue-800 text-sm mt-1">You must qualify at the higher of: Bank of Canada 5-year benchmark rate OR your contract rate + 2%.</p>
                    </div>
                  )}

                  {isUS && (
                    <div>
                      <strong className="text-blue-900">4. Am I eligible for special programs?</strong>
                      <p className="text-blue-800 text-sm mt-1">Veterans (VA loans), rural buyers (USDA), or those needing lower down payments (FHA) have specialized options.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-bold text-green-900 mb-4">📋 Next Steps for {regionName}</h4>
                <ol className="text-green-800 space-y-2 list-decimal list-inside">
                  <li><strong>Get quotes from 3+ lenders</strong> including banks, credit unions, and mortgage brokers</li>
                  <li><strong>Compare total costs</strong> over the {isCanada ? 'term and amortization period' : 'life of the loan'}</li>
                  {isCanada ? (
                    <>
                      <li><strong>Understand the stress test</strong> and ensure you qualify</li>
                      <li><strong>Consider mortgage term length</strong> (shorter terms = more renewals, longer terms = rate security)</li>
                      <li><strong>Factor in CMHC insurance costs</strong> if putting less than 20% down</li>
                    </>
                  ) : (
                    <>
                      <li><strong>Check government program eligibility</strong> (FHA, VA, USDA)</li>
                      <li><strong>Factor in PMI costs</strong> if putting less than 20% down</li>
                      <li><strong>Consider points</strong> to reduce your interest rate</li>
                    </>
                  )}
                  <li><strong>Speak with a {isCanada ? 'mortgage professional' : 'HUD-approved housing counselor'}</strong> for personalized advice</li>
                </ol>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <p className="text-yellow-800 font-medium text-lg">
                <strong>Remember:</strong> The "best" mortgage is the one that fits YOUR specific financial situation and goals in {regionName}. {isCanada ? 'Consider both the rate and the mortgage term length.' : 'Don\'t just focus on the interest rate - consider the total cost over time.'}
              </p>
            </div>

            <div className="text-center mt-8">
              <button 
                onClick={() => router.back()}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                ← Back to Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}