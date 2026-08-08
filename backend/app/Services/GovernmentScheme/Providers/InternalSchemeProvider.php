<?php

declare(strict_types=1);

namespace App\Services\GovernmentScheme\Providers;

/**
 * Curated in-app feed of national and Gujarat state agriculture schemes.
 *
 * Used until a live government API is wired in — swap the DI binding in
 * ServiceServiceProvider to point at a real source without touching any
 * controller or the sync flow.
 */
class InternalSchemeProvider implements SchemeDataProviderInterface
{
    public function name(): string
    {
        return 'internal';
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function fetch(array $filters = []): array
    {
        $records = [
            [
                'code' => 'PM-KISAN',
                'title' => 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
                'category' => 'income-support',
                'description' => 'Direct income support of ₹6,000 per year paid in three equal instalments to all landholding farmer families.',
                'benefits' => ['₹6,000 per year in three instalments', 'Direct Benefit Transfer to bank account'],
                'eligibility_criteria' => [
                    'requires_profile' => false,
                    'states' => [],
                    'farmer_categories' => ['marginal', 'small', 'semi_medium', 'medium', 'large'],
                ],
                'documents_required' => ['Aadhaar Card', 'Bank Passbook'],
                'state' => null,
                'deadline' => null,
                'apply_url' => 'https://pmkisan.gov.in/',
                'official_link' => 'https://pmkisan.gov.in/',
                'is_active' => true,
            ],
            [
                'code' => 'PMFBY',
                'title' => 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
                'category' => 'insurance',
                'description' => 'Crop insurance scheme covering kharif and rabi crops against natural calamities, pests and diseases at a nominal premium.',
                'benefits' => ['Low premium: 2% kharif, 1.5% rabi', 'Full sum insured on crop loss', 'Loss assessment within 30 days'],
                'eligibility_criteria' => [
                    'requires_profile' => true,
                    'states' => [],
                    'min_land_acres' => 0.25,
                    'farmer_categories' => ['marginal', 'small', 'semi_medium', 'medium'],
                ],
                'documents_required' => ['Aadhaar Card', 'Land Records', 'Bank Passbook'],
                'state' => null,
                'deadline' => '2026-09-30',
                'apply_url' => 'https://pmfby.gov.in/',
                'official_link' => 'https://pmfby.gov.in/',
                'is_active' => true,
            ],
            [
                'code' => 'KCC',
                'title' => 'Kisan Credit Card Scheme',
                'category' => 'credit',
                'description' => 'Adequate, timely and hassle-free short-term credit support to farmers for cultivation, post-harvest and consumption needs.',
                'benefits' => ['Revolving credit up to ₹3 lakh', 'Interest subvention of 2-3%', 'Repayment holiday and flexible limits'],
                'eligibility_criteria' => [
                    'requires_profile' => true,
                    'states' => [],
                    'farmer_categories' => ['marginal', 'small', 'semi_medium', 'medium', 'large'],
                ],
                'documents_required' => ['Aadhaar Card', 'Land Records', 'Bank Passbook', 'Passport Photo'],
                'state' => null,
                'deadline' => null,
                'apply_url' => 'https://www.nabard.org/content1.aspx?id=595&catid=8',
                'official_link' => 'https://www.nabard.org/',
                'is_active' => true,
            ],
            [
                'code' => 'SOIL-HEALTH-CARD',
                'title' => 'Soil Health Card Scheme',
                'category' => 'advisory',
                'description' => 'Issues soil health cards to farmers with nutrient status of their holding and dosage recommendations for better yields.',
                'benefits' => ['Free soil health card', 'Nutrient-wise recommendations', 'Fertiliser subsidy eligibility'],
                'eligibility_criteria' => [
                    'requires_profile' => false,
                    'states' => [],
                    'farmer_categories' => ['marginal', 'small', 'semi_medium', 'medium', 'large'],
                ],
                'documents_required' => ['Aadhaar Card', 'Land Records'],
                'state' => null,
                'deadline' => null,
                'apply_url' => 'https://soilhealth.dac.gov.in/',
                'official_link' => 'https://soilhealth.dac.gov.in/',
                'is_active' => true,
            ],
            [
                'code' => 'PM-KUSUM',
                'title' => 'PM-KUSUM Solar Pump Scheme',
                'category' => 'energy',
                'description' => 'Subsidised installation of standalone solar pumps and solarisation of grid-connected agricultural pumps for farmers.',
                'benefits' => ['Up to 60% subsidy on solar pumps', 'Free solar power for irrigation', 'Additional income from surplus power'],
                'eligibility_criteria' => [
                    'requires_profile' => true,
                    'states' => [],
                    'min_land_acres' => 0.5,
                    'max_land_acres' => 12.0,
                    'farmer_categories' => ['marginal', 'small', 'semi_medium', 'medium'],
                ],
                'documents_required' => ['Aadhaar Card', 'Land Records', 'Bank Passbook', 'Electricity Bill'],
                'state' => null,
                'deadline' => '2026-12-31',
                'apply_url' => 'https://pmkusum.mnre.gov.in/',
                'official_link' => 'https://pmkusum.mnre.gov.in/',
                'is_active' => true,
            ],
            [
                'code' => 'PMKSY-PDMC',
                'title' => 'Per Drop More Crop (PDMC)',
                'category' => 'irrigation',
                'description' => 'Financial assistance for drip and sprinkler micro-irrigation systems to improve water use efficiency.',
                'benefits' => ['Up to 55% subsidy on micro-irrigation', 'Enhanced water-use efficiency', 'Higher yield per drop'],
                'eligibility_criteria' => [
                    'requires_profile' => true,
                    'states' => ['Gujarat'],
                    'min_land_acres' => 0.5,
                    'farmer_categories' => ['marginal', 'small', 'semi_medium', 'medium', 'large'],
                ],
                'documents_required' => ['Aadhaar Card', 'Land Records', 'Bank Passbook'],
                'state' => 'Gujarat',
                'deadline' => '2026-08-31',
                'apply_url' => 'https://pmksy.gov.in/microirrigation/',
                'official_link' => 'https://pmksy.gov.in/',
                'is_active' => true,
            ],
            [
                'code' => 'RKVY',
                'title' => 'Rashtriya Krishi Vikas Yojana (RKVY)',
                'category' => 'infrastructure',
                'description' => 'State-level funding for agricultural infrastructure, farm mechanisation, and crop diversification projects.',
                'benefits' => ['State-level project grants', 'Farm mechanisation support', 'Value-chain infrastructure'],
                'eligibility_criteria' => [
                    'requires_profile' => false,
                    'states' => [],
                    'farmer_categories' => ['marginal', 'small', 'semi_medium', 'medium', 'large'],
                ],
                'documents_required' => ['Aadhaar Card'],
                'state' => null,
                'deadline' => null,
                'apply_url' => 'https://rkvy.nic.in/',
                'official_link' => 'https://rkvy.nic.in/',
                'is_active' => true,
            ],
            [
                'code' => 'MUKHYAMANTRI-DUGDHA',
                'title' => 'Mukhyamantri Pashu Dhana Vikas Yojana',
                'category' => 'livestock',
                'description' => 'Gujarat state scheme supporting smallholder dairy farmers with animal purchase assistance and fodder development.',
                'benefits' => ['Assistance for dairy animal purchase', 'Fodder development support', 'Free health camps for livestock'],
                'eligibility_criteria' => [
                    'requires_profile' => true,
                    'states' => ['Gujarat'],
                    'max_land_acres' => 4.94,
                    'farmer_categories' => ['marginal', 'small'],
                ],
                'documents_required' => ['Aadhaar Card', 'Bank Passbook'],
                'state' => 'Gujarat',
                'deadline' => '2026-10-15',
                'apply_url' => 'https://animalhusbandry.gujarat.gov.in/',
                'official_link' => 'https://animalhusbandry.gujarat.gov.in/',
                'is_active' => true,
            ],
        ];

        if (isset($filters['state']) && $filters['state'] !== '') {
            $state = strtolower((string) $filters['state']);
            $records = array_values(array_filter(
                $records,
                fn (array $record): bool => $record['state'] === null
                    || strtolower((string) $record['state']) === $state,
            ));
        }

        if (isset($filters['category']) && $filters['category'] !== '') {
            $category = (string) $filters['category'];
            $records = array_values(array_filter(
                $records,
                fn (array $record): bool => $record['category'] === $category,
            ));
        }

        return $records;
    }
}
