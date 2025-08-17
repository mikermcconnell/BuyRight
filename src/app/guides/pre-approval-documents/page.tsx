'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useRegional } from '@/contexts/RegionalContext';
import {
  DocumentTextIcon,
  CurrencyDollarIcon,
  IdentificationIcon,
  ChartBarIcon,
  HomeIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import BuyRightLogo from '@/components/ui/BuyRightLogo';

export default function PreApprovalDocumentsGuide() {
  const router = useRouter();
  const { currentRegion } = useRegional();

  const documentCategories = [
    {
      id: 'income',
      title: 'Income Documentation',
      icon: CurrencyDollarIcon,
      color: 'green',
      documents: [
        {
          name: 'Pay Stubs',
          description: 'Most recent 2-3 pay stubs showing year-to-date earnings',
          required: true,
          notes: 'Must be current within 30 days'
        },
        {
          name: 'Employment Letter',
          description: 'Letter from employer confirming position, salary, and employment status',
          required: true,
          notes: 'Should include start date and whether position is permanent'
        },
        {
          name: 'Tax Returns (T1 General)',
          description: 'Last 2 years of complete tax returns with Notice of Assessment',
          required: true,
          notes: 'Required for all applicants, including co-borrowers'
        },
        {
          name: 'T4 Slips',
          description: 'T4 slips for the last 2 years',
          required: true,
          notes: 'One for each employer during the tax year'
        },
        {
          name: 'Self-Employment Income',
          description: 'Business financial statements, tax returns for 2+ years',
          required: false,
          notes: 'Required if self-employed or have business income'
        },
        {
          name: 'Other Income Sources',
          description: 'Rental income, investment income, pension, disability benefits',
          required: false,
          notes: 'Documentation varies by income type'
        }
      ]
    },
    {
      id: 'assets',
      title: 'Assets & Down Payment',
      icon: ChartBarIcon,
      color: 'blue',
      documents: [
        {
          name: 'Bank Statements',
          description: 'Last 3 months of statements for all accounts',
          required: true,
          notes: 'Checking, savings, investment accounts'
        },
        {
          name: 'Investment Statements',
          description: 'RRSP, TFSA, investment portfolio statements',
          required: true,
          notes: 'Needed if using investments for down payment'
        },
        {
          name: 'Gift Letter',
          description: 'Signed letter if receiving gift funds for down payment',
          required: false,
          notes: 'Must include donor relationship and confirmation funds are a gift'
        },
        {
          name: 'Proof of Sale',
          description: 'If selling current home to fund purchase',
          required: false,
          notes: 'Purchase agreement or listing agreement'
        }
      ]
    },
    {
      id: 'debts',
      title: 'Debt & Credit Information',
      icon: DocumentTextIcon,
      color: 'red',
      documents: [
        {
          name: 'Credit Report',
          description: 'Recent credit report (lender will also pull their own)',
          required: false,
          notes: 'Good to review beforehand for accuracy'
        },
        {
          name: 'Loan Statements',
          description: 'Car loans, student loans, personal loans, lines of credit',
          required: true,
          notes: 'Current balance and monthly payment amounts'
        },
        {
          name: 'Credit Card Statements',
          description: 'Recent statements showing balances and minimum payments',
          required: true,
          notes: 'All active credit cards'
        },
        {
          name: 'Child Support/Alimony',
          description: 'Court orders or agreements for support payments',
          required: false,
          notes: 'Both payments made and received'
        }
      ]
    },
    {
      id: 'identification',
      title: 'Identification & Personal',
      icon: IdentificationIcon,
      color: 'purple',
      documents: [
        {
          name: 'Government-Issued ID',
          description: 'Driver\'s license or passport for all applicants',
          required: true,
          notes: 'Must be current and valid'
        },
        {
          name: 'Social Insurance Number',
          description: 'SIN card or documentation',
          required: true,
          notes: 'For credit check and employment verification'
        },
        {
          name: 'Void Cheque',
          description: 'Void cheque from primary bank account',
          required: true,
          notes: 'For setting up automatic payments'
        },
        {
          name: 'Separation/Divorce Papers',
          description: 'Legal documents if applicable',
          required: false,
          notes: 'May affect financial obligations'
        }
      ]
    }
  ];

  const additionalTips = [
    {
      title: 'Organization Tips',
      tips: [
        'Create a dedicated folder for all documents',
        'Make copies before submitting originals',
        'Scan documents for digital backups',
        'Organize documents by category'
      ]
    },
    {
      title: 'Timeline Considerations',
      tips: [
        'Start gathering docs 2-3 weeks early',
        'Employment letters may take time to obtain',
        'Tax returns available from CRA if needed',
        'Pre-approval valid for 60-120 days'
      ]
    },
    {
      title: 'Common Mistakes to Avoid',
      tips: [
        'Avoid large deposits during application',
        'Ensure document dates are current',
        'Don\'t close credit accounts early',
        'Be honest about all income and debts'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-900',
          icon: 'text-green-600'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-900',
          icon: 'text-blue-600'
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-900',
          icon: 'text-red-600'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-900',
          icon: 'text-purple-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-900',
          icon: 'text-gray-600'
        };
    }
  };

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
          
          {/* BuyRight Branding */}
          <div className="mb-6">
            <BuyRightLogo size="lg" className="justify-center" />
          </div>
          
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--duolingo-green)' }}>
            <DocumentTextIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="duolingo-title mb-4">📋 What Papers Do I Need for the Bank?</h1>
          <p className="duolingo-subtitle max-w-2xl mx-auto">
            Here's exactly what documents you'll need to bring to get approved for your home loan. Get these ready and you'll breeze through the process!
          </p>
        </div>

        {/* Quick Overview */}
        <div className="duolingo-card mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What to Expect</h3>
              <p className="text-gray-700 text-sm mb-3">
                Lenders need to verify your income, assets, debts, and identity to assess your ability to repay a mortgage. 
                Having these documents ready will make the pre-approval process much faster and smoother.
              </p>
              <div className="space-y-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-1">📋</div>
                  <div className="text-xs font-medium text-green-800">Income Docs</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-xs font-medium text-blue-800">Asset Proof</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-xs font-medium text-red-800">Debt Info</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-1">🆔</div>
                  <div className="text-xs font-medium text-purple-800">ID & Personal</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Categories */}
        {documentCategories.map((category) => {
          const colorClasses = getColorClasses(category.color);
          const IconComponent = category.icon;
          
          return (
            <div key={category.id} className="duolingo-card mb-8">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${colorClasses.bg} ${colorClasses.border} border`}>
                  <IconComponent className={`w-6 h-6 ${colorClasses.icon}`} />
                </div>
                <h2 className="duolingo-title mb-0">{category.title}</h2>
              </div>
              
              <div className="space-y-4">
                {category.documents.map((doc, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 ${colorClasses.bg} ${colorClasses.border}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <h3 className={`font-semibold ${colorClasses.text}`}>{doc.name}</h3>
                      </div>
                    </div>
                    <p className={`text-sm ${colorClasses.text} mb-2`}>{doc.description}</p>
                    {doc.notes && (
                      <p className="text-xs text-gray-600 italic">
                        💡 {doc.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Additional Tips */}
        <div className="duolingo-card mb-8">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">💡</span>
            Pro Tips for Success
          </h2>
          
          <div className="space-y-6">
            {additionalTips.map((section, index) => (
              <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start text-sm text-yellow-800">
                      <CheckCircleIcon className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Information */}
        {currentRegion && (
          <div className="duolingo-card mb-8">
            <h2 className="duolingo-title mb-4 flex items-center">
              <span className="text-2xl mr-3">🏠</span>
              Regional Considerations
            </h2>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                {currentRegion === 'ON' ? 'Ontario' : 
                 currentRegion === 'BC' ? 'British Columbia' : 
                 currentRegion} Specific Requirements
              </h3>
              
              {currentRegion === 'ON' && (
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Land Transfer Tax calculator and rebate information may be required</p>
                  <p>• First-Time Home Buyer Incentive documentation if applicable</p>
                  <p>• Ontario Home Ownership Savings Plan (HOSP) statements if used</p>
                </div>
              )}
              
              {currentRegion === 'BC' && (
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Property Transfer Tax and First-Time Home Buyers' exemption forms</p>
                  <p>• BC Home Owner Mortgage and Equity (HOME) Partnership documentation</p>
                  <p>• Foreign buyer tax considerations if applicable</p>
                </div>
              )}
              
              {currentRegion?.startsWith('US') && (
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• W-2 forms instead of T4 slips</p>
                  <p>• 1040 tax returns instead of T1 General</p>
                  <p>• Social Security Number instead of SIN</p>
                  <p>• State-specific first-time buyer programs may have additional requirements</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Document Checklist */}
        <div className="duolingo-card">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">✅</span>
            Ready to Apply?
          </h2>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Once you have all required documents organized, you're ready to submit your pre-approval application!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="duolingo-button"
              >
                Continue with Pre-Approval
              </button>
              
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
              >
                Print This Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}