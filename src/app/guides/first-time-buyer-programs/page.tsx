'use client';

import { useRouter } from 'next/navigation';
import { useRegional } from '@/contexts/RegionalContext';

export default function FirstTimeBuyerProgramsGuide() {
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
              <span className="text-3xl">🏠</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              First-Time Home Buyer Programs
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive guide to government programs, incentives, and financial assistance available to first-time buyers in {regionName}.
            </p>
            
            {/* Region Indicator */}
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                📍 {regionName}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="prose prose-lg max-w-none">

            {/* Canadian Programs */}
            {isCanada && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    🇨🇦 Canadian First-Time Home Buyer Programs
                  </h2>

                  {/* Federal Programs */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-green-900 mb-4">🏛️ Federal Programs (Available Nationwide)</h3>
                    
                    <div className="space-y-6">
                      <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                        <h4 className="text-lg font-bold text-green-900 mb-3">First-Time Home Buyer Incentive (FTHBI)</h4>
                        <div className="space-y-6 gap-4 mb-4">
                          <div>
                            <strong>What it is:</strong> Shared equity mortgage with Government of Canada
                          </div>
                          <div>
                            <strong>Amount:</strong> 5% for existing homes, 10% for new homes
                          </div>
                          <div>
                            <strong>Qualification:</strong> Household income under $120,000
                          </div>
                          <div>
                            <strong>Repayment:</strong> Pay back when you sell or after 25 years
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded border-l-4 border-green-500">
                          <strong>💰 Example:</strong> On a $400,000 home, the government contributes $40,000 (10% for new home), reducing your mortgage to $360,000. You repay the percentage when you sell.
                        </div>
                      </div>

                      <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                        <h4 className="text-lg font-bold text-blue-900 mb-3">Home Buyers' Plan (HBP)</h4>
                        <div className="space-y-6 gap-4 mb-4">
                          <div>
                            <strong>What it is:</strong> Withdraw from your RRSP tax-free for down payment
                          </div>
                          <div>
                            <strong>Amount:</strong> Up to $35,000 per person ($70,000 for couples)
                          </div>
                          <div>
                            <strong>Repayment:</strong> Must repay over 15 years starting year 2
                          </div>
                          <div>
                            <strong>Requirement:</strong> Must not have owned a home in past 4 years
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                          <strong>⚠️ Important:</strong> If you don't repay on schedule, the amount is added to your taxable income for that year.
                        </div>
                      </div>

                      <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                        <h4 className="text-lg font-bold text-purple-900 mb-3">First-Time Home Buyer Tax Credit</h4>
                        <div className="space-y-6 gap-4 mb-4">
                          <div>
                            <strong>What it is:</strong> Non-refundable tax credit
                          </div>
                          <div>
                            <strong>Amount:</strong> Up to $750 (15% of $5,000)
                          </div>
                          <div>
                            <strong>When:</strong> Claim on your tax return for purchase year
                          </div>
                          <div>
                            <strong>Eligibility:</strong> You or spouse must be first-time buyer
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Provincial Programs - Ontario */}
                  {currentRegion === 'ON' && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-blue-900 mb-4">🏛️ Ontario Provincial Programs</h3>
                      
                      <div className="space-y-6">
                        <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                          <h4 className="text-lg font-bold text-orange-900 mb-3">Land Transfer Tax Rebate for First-Time Buyers</h4>
                          <div className="space-y-6 gap-4 mb-4">
                            <div>
                              <strong>Amount:</strong> Up to $4,000 rebate
                            </div>
                            <div>
                              <strong>Applies to:</strong> Provincial Land Transfer Tax only
                            </div>
                            <div>
                              <strong>For Toronto buyers:</strong> Separate rebate up to $4,475 for municipal LTT
                            </div>
                            <div>
                              <strong>Requirement:</strong> Must be first-time buyer
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded border-l-4 border-orange-500">
                            <strong>💰 Toronto Example:</strong> On a $600,000 home, you could save up to $8,475 in combined provincial and municipal land transfer tax rebates.
                          </div>
                        </div>

                        <div className="border border-teal-200 rounded-lg p-6 bg-teal-50">
                          <h4 className="text-lg font-bold text-teal-900 mb-3">Ontario Renovates Program</h4>
                          <div className="space-y-6 gap-4 mb-4">
                            <div>
                              <strong>What it is:</strong> Forgivable loan for home repairs/accessibility
                            </div>
                            <div>
                              <strong>Amount:</strong> Up to $25,000
                            </div>
                            <div>
                              <strong>Eligibility:</strong> Income-tested, homeowners only
                            </div>
                            <div>
                              <strong>Use:</strong> Essential repairs, accessibility modifications
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Provincial Programs - BC */}
                  {currentRegion === 'BC' && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-blue-900 mb-4">🏛️ British Columbia Provincial Programs</h3>
                      
                      <div className="space-y-6">
                        <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                          <h4 className="text-lg font-bold text-green-900 mb-3">First Time Home Buyers Program (Property Transfer Tax Exemption)</h4>
                          <div className="space-y-6 gap-4 mb-4">
                            <div>
                              <strong>Full exemption:</strong> Homes up to $500,000
                            </div>
                            <div>
                              <strong>Partial exemption:</strong> Homes $500,000 - $525,000
                            </div>
                            <div>
                              <strong>Requirement:</strong> Must be Canadian citizen or permanent resident
                            </div>
                            <div>
                              <strong>Savings:</strong> Up to $8,000 on eligible homes
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded border-l-4 border-green-500">
                            <strong>💰 Example:</strong> On a $500,000 home, you save $8,000 in Property Transfer Tax (1% on first $200k + 2% on remaining $300k).
                          </div>
                        </div>

                        <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                          <h4 className="text-lg font-bold text-purple-900 mb-3">BC Home Owner Mortgage and Equity (HOME) Partnership</h4>
                          <div className="space-y-6 gap-4 mb-4">
                            <div>
                              <strong>What it is:</strong> Loan for up to 25% of home's value
                            </div>
                            <div>
                              <strong>Amount:</strong> Up to $150,000
                            </div>
                            <div>
                              <strong>Payment:</strong> Interest-free and payment-free for 10 years
                            </div>
                            <div>
                              <strong>Household income:</strong> Must be under $150,000
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded border-l-4 border-purple-500">
                            <strong>📍 Note:</strong> Available in select communities. Check eligibility areas on BC Housing website.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* US Programs */}
            {isUS && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    🇺🇸 US First-Time Home Buyer Programs
                  </h2>

                  {/* Federal Programs */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-green-900 mb-4">🏛️ Federal Programs (Available Nationwide)</h3>
                    
                    <div className="space-y-6">
                      <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                        <h4 className="text-lg font-bold text-blue-900 mb-3">FHA First-Time Home Buyer Loan</h4>
                        <div className="space-y-6 gap-4 mb-4">
                          <div>
                            <strong>Down payment:</strong> As low as 3.5%
                          </div>
                          <div>
                            <strong>Credit score:</strong> 580+ (500+ with 10% down)
                          </div>
                          <div>
                            <strong>Debt-to-income:</strong> Up to 57% with compensating factors
                          </div>
                          <div>
                            <strong>Mortgage insurance:</strong> Required for life of loan
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                          <strong>💰 Example:</strong> On a $300,000 home, you'd need just $10,500 down payment (3.5%) plus closing costs.
                        </div>
                      </div>

                      <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                        <h4 className="text-lg font-bold text-green-900 mb-3">VA Loans (Veterans)</h4>
                        <div className="space-y-6 gap-4 mb-4">
                          <div>
                            <strong>Down payment:</strong> $0 in most cases
                          </div>
                          <div>
                            <strong>Eligibility:</strong> Veterans, active military, surviving spouses
                          </div>
                          <div>
                            <strong>No PMI:</strong> No private mortgage insurance required
                          </div>
                          <div>
                            <strong>Funding fee:</strong> 2.3% for first-time use (can be financed)
                          </div>
                        </div>
                      </div>

                      <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                        <h4 className="text-lg font-bold text-yellow-900 mb-3">USDA Rural Development Loans</h4>
                        <div className="space-y-6 gap-4 mb-4">
                          <div>
                            <strong>Down payment:</strong> $0
                          </div>
                          <div>
                            <strong>Location:</strong> USDA-eligible rural and suburban areas
                          </div>
                          <div>
                            <strong>Income limits:</strong> Based on area median income
                          </div>
                          <div>
                            <strong>Property requirements:</strong> Must be primary residence
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded border-l-4 border-yellow-500">
                          <strong>📍 Check eligibility:</strong> Use USDA's online eligibility map to see if your target area qualifies.
                        </div>
                      </div>

                      <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                        <h4 className="text-lg font-bold text-purple-900 mb-3">Good Neighbor Next Door</h4>
                        <div className="space-y-6 gap-4 mb-4">
                          <div>
                            <strong>Discount:</strong> 50% off list price
                          </div>
                          <div>
                            <strong>Eligible professions:</strong> Teachers, firefighters, police officers, EMTs
                          </div>
                          <div>
                            <strong>Requirement:</strong> Must live in home for 36 months
                          </div>
                          <div>
                            <strong>Availability:</strong> HUD-owned properties in revitalization areas
                          </div>
                        </div>
                      </div>

                      <div className="border border-indigo-200 rounded-lg p-6 bg-indigo-50">
                        <h4 className="text-lg font-bold text-indigo-900 mb-3">IRA First-Time Home Buyer Withdrawal</h4>
                        <div className="space-y-6 gap-4 mb-4">
                          <div>
                            <strong>Amount:</strong> Up to $10,000 per person
                          </div>
                          <div>
                            <strong>Penalty:</strong> No 10% early withdrawal penalty
                          </div>
                          <div>
                            <strong>Taxes:</strong> Still subject to income tax (unless Roth IRA)
                          </div>
                          <div>
                            <strong>Couples:</strong> Each spouse can withdraw $10,000 ($20,000 total)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* State Programs */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">🏛️ State & Local Programs</h3>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                      <h4 className="text-lg font-bold text-blue-900 mb-3">Common State Program Types</h4>
                      <div className="space-y-6 gap-4">
                        <div>
                          <strong>Down Payment Assistance:</strong> Grants or low-interest loans for down payment and closing costs
                        </div>
                        <div>
                          <strong>Mortgage Credit Certificates:</strong> Federal tax credit for portion of mortgage interest paid
                        </div>
                        <div>
                          <strong>First-Time Buyer Bonds:</strong> Below-market interest rate mortgages
                        </div>
                        <div>
                          <strong>Closing Cost Assistance:</strong> Grants to help cover closing expenses
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
                      <h4 className="font-bold text-yellow-900 mb-2">🔍 How to Find Your State Programs</h4>
                      <ol className="text-yellow-800 space-y-2 list-decimal list-inside">
                        <li>Contact your state housing finance agency</li>
                        <li>Visit your state government website</li>
                        <li>Check with local housing authorities</li>
                        <li>Ask mortgage lenders about local programs</li>
                        <li>Contact HUD-approved housing counselors</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </>
            )}

            <hr className="my-8" />

            {/* Application Tips */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                📋 Application Tips & Requirements
              </h2>

              <div className="space-y-6 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-900 mb-3">✅ Preparation Checklist</h3>
                  <ul className="text-green-800 space-y-2">
                    <li>• Gather income documentation (pay stubs, tax returns)</li>
                    <li>• Obtain credit report and address any issues</li>
                    <li>• Save for down payment and closing costs</li>
                    <li>• Get pre-approved for mortgage</li>
                    <li>• Research programs before house hunting</li>
                    <li>• Find a {isCanada ? 'real estate professional' : 'real estate agent'} familiar with programs</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-red-900 mb-3">⚠️ Common Mistakes to Avoid</h3>
                  <ul className="text-red-800 space-y-2">
                    <li>• Applying for programs after finding a house</li>
                    <li>• Not reading all terms and conditions</li>
                    <li>• Missing application deadlines</li>
                    <li>• Assuming you don't qualify without checking</li>
                    <li>• Forgetting about {isCanada ? 'HST/GST rebates' : 'tax implications'}</li>
                    <li>• Not considering long-term commitments</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Regional Resources */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                🔗 {regionName} Resources
              </h2>

              {isCanada && (
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <strong>🏛️ Canada Mortgage and Housing Corporation (CMHC)</strong>
                    <p className="text-sm text-gray-600 mt-1">Official source for federal first-time buyer programs and mortgage information</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <strong>💰 Canada Revenue Agency (CRA)</strong>
                    <p className="text-sm text-gray-600 mt-1">Information on Home Buyers' Plan and tax credits</p>
                  </div>
                  {currentRegion === 'ON' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <strong>🏠 Ontario Housing Corporation</strong>
                      <p className="text-sm text-blue-700 mt-1">Ontario-specific programs and housing resources</p>
                    </div>
                  )}
                  {currentRegion === 'BC' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <strong>🏠 BC Housing</strong>
                      <p className="text-sm text-green-700 mt-1">BC HOME Partnership and other provincial programs</p>
                    </div>
                  )}
                </div>
              )}

              {isUS && (
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <strong>🏛️ HUD (Department of Housing and Urban Development)</strong>
                    <p className="text-sm text-gray-600 mt-1">Federal housing programs and HUD-approved housing counselors</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <strong>💰 State Housing Finance Agencies</strong>
                    <p className="text-sm text-gray-600 mt-1">Your state's housing programs and down payment assistance</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <strong>🏦 Fannie Mae & Freddie Mac</strong>
                    <p className="text-sm text-gray-600 mt-1">HomeReady and Home Possible low down payment programs</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Items */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
              <h3 className="font-bold text-yellow-900 mb-4">🎯 Your Next Steps</h3>
              <ol className="text-yellow-800 space-y-2 list-decimal list-inside">
                <li><strong>Assess your eligibility</strong> for the programs listed above</li>
                <li><strong>Calculate potential savings</strong> from each applicable program</li>
                <li><strong>Contact program administrators</strong> for detailed requirements and applications</li>
                <li><strong>Get pre-approved</strong> for your mortgage including any special programs</li>
                <li><strong>Inform your {isCanada ? 'realtor' : 'real estate agent'}</strong> about programs you plan to use</li>
                <li><strong>Apply early</strong> as some programs have limited funding or long processing times</li>
              </ol>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
              <p className="text-green-800 font-medium text-lg">
                <strong>💡 Remember:</strong> These programs can save you thousands of dollars and make homeownership more accessible. {isCanada ? 'Many Canadian programs can be combined for maximum benefit.' : 'Don\'t assume you don\'t qualify - many programs have flexible requirements.'}
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