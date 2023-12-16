import * as dotenv from 'dotenv'
dotenv.config()

import type {SearchResponse} from './customTypes'

if (process.env.ASINDATAAPI_KEY == null) {
    throw new Error('missing ASINDATAAPI_KEY');
}
if (process.env.AMAZON_AFFILIATE_ID == null) {
    throw new Error('missing AMAZON_AFFILIATE_ID');
}


class AmazonApi {
    api_key: string
    affiliate_id: string
    include_html: string = "false"
    output: "json" | "html" | "csv" = "json"
    exclude_sponsored: string = "true"
    api_url: string = 'https://api.asindataapi.com/request'
    constructor(api_key: string, affiliate_id: string) {
        this.api_key = api_key
        this.affiliate_id = affiliate_id
    }

    async search(amazon_domain: string, search_term: string): Promise<SearchResponse|null> {

        const callType = "search"

        // const response = await fetch(this.api_url, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         type: callType,
        //         api_key: this.api_key,
        //         associate_id: this.affiliate_id,
        //         amazon_domain: amazon_domain,
        //         search_term: search_term,
        //         exclude_sponsored: this.exclude_sponsored,
        //         include_html: this.include_html,
        //         output: this.output
        //     }),
        // });


        const queryParams = {
            type: callType,
            api_key: this.api_key,
            associate_id: this.affiliate_id,
            amazon_domain: amazon_domain,
            search_term: search_term,
            exclude_sponsored: this.exclude_sponsored,
            include_html: this.include_html,
            output: this.output
        };
        const queryString = new URLSearchParams(queryParams).toString();
        const urlWithQuery = `${this.api_url}?${queryString}`;
        const response = await fetch(urlWithQuery);

        let data = await response.json();

        if (response.ok) {
            return data as SearchResponse 
        } else {

            console.log("Request to api.asindataapi.com Failed.:",data)
            return null
        }

    }

    countryToDomain(countryCode: string|null): string {
        if(countryCode && countryCode in countryDomainList){
            return countryDomainList[countryCode]
        }
        return countryDomainList.US
    }
}


export const amazon = new AmazonApi(
    process.env.ASINDATAAPI_KEY,
    process.env.AMAZON_AFFILIATE_ID
)


const countryDomainList:{[key: string]: string} = {
    AD: 'amazon.es', // Andorra -> Spain
    AE: 'amazon.ae', // United Arab Emirates (the)
    // AF: '', // Afghanistan (goes to default)
    // AG: '', // Antigua and Barbuda (goes to default)
    // AI: '', // Anguilla (goes to default)
    // AL: '', // Albania (goes to default)
    // AM: '', // Armenia (goes to default)
    // AO: '', // Angola (goes to default)
    // AQ: '', // Antarctica (goes to default)
    // AR: '', // Argentina (goes to default)
    // AS: '', // American Samoa (goes to default)
    AT: 'amazon.de', // Austria -> Germany
    AU: 'amazon.com.au', // Australia
    // AW: '', // Aruba (goes to default)
    // AX: '', // Åland Islands (goes to default)
    // AZ: '', // Azerbaijan (goes to default)
    // BA: '', // Bosnia and Herzegovina (goes to default)
    // BB: '', // Barbados (goes to default)
    // BD: '', // Bangladesh (goes to default)
    // BE: '', // Belgium (goes to default)
    // BF: '', // Burkina Faso (goes to default)
    // BG: '', // Bulgaria (goes to default)
    // BH: '', // Bahrain (goes to default)
    // BI: '', // Burundi (goes to default)
    // BJ: '', // Benin (goes to default)
    // BL: '', // Saint Barthélemy (goes to default)
    // BM: '', // Bermuda (goes to default)
    // BN: '', // Brunei Darussalam (goes to default)
    // BO: '', // Bolivia (Plurinational State of) (goes to default)
    // BQ: '', // Bonaire, Sint Eustatius and Saba (goes to default)
    BR: 'amazon.com.br', // Brazil
    // BS: '', // Bahamas (the) (goes to default)
    // BT: '', // Bhutan (goes to default)
    // BV: '', // Bouvet Island (goes to default)
    // BW: '', // Botswana (goes to default)
    // BY: '', // Belarus (goes to default)
    // BZ: '', // Belize (goes to default)
    CA: 'amazon.ca', // Canada
    // CC: '', // Cocos (Keeling) Islands (the) (goes to default)
    // CD: '', // Congo (the Democratic Republic of the) (goes to default)
    // CF: '', // Central African Republic (the) (goes to default)
    // CG: '', // Congo (the) (goes to default)
    CH: 'amazon.de', // Switzerland -> Germany
    // CI: '', // Côte d'Ivoire (goes to default)
    CK: 'amazon.com.au', // Cook Islands (the) -> Australia
    // CL: '', // Chile (goes to default)
    // CM: '', // Cameroon (goes to default)
    CN: 'amazon.cn', // China
    // CO: '', // Colombia (goes to default)
    // CR: '', // Costa Rica (goes to default)
    // CU: '', // Cuba (goes to default)
    // CV: '', // Cabo Verde (goes to default)
    // CW: '', // Curaçao (goes to default)
    CX: 'amazon.com.au', // Christmas Island -> Australia
    // CY: '', // Cyprus (goes to default)
    // CZ: '', // Czechia (goes to default)
    DE: 'amazon.de', // Germany
    // DJ: '', // Djibouti (goes to default)
    // DK: '', // Denmark (goes to default)
    // DM: '', // Dominica (goes to default)
    // DO: '', // Dominican Republic (the) (goes to default)
    // DZ: '', // Algeria (goes to default)
    // EC: '', // Ecuador (goes to default)
    // EE: '', // Estonia (goes to default)
    // EG: '', // Egypt (goes to default)
    // EH: '', // Western Sahara (goes to default)
    // ER: '', // Eritrea (goes to default)
    ES: 'amazon.es', // Spain
    // ET: '', // Ethiopia (goes to default)
    // FI: '', // Finland (goes to default)
    // FJ: '', // Fiji (goes to default)
    // FK: '', // Falkland Islands (the) [Malvinas] (goes to default)
    // FM: '', // Micronesia (Federated States of) (goes to default)
    // FO: '', // Faroe Islands (the) (goes to default)
    FR: 'amazon.fr', // France
    // GA: '', // Gabon (goes to default)
    GB: 'amazon.co.uk', // United Kingdom of Great Britain and Northern Ireland (the)
    // GD: '', // Grenada (goes to default)
    // GE: '', // Georgia (goes to default)
    // GF: '', // French Guiana (goes to default)
    // GG: '', // Guernsey (goes to default)
    // GH: '', // Ghana (goes to default)
    GI: 'amazon.co.uk', // Gibraltar -> UK
    // GL: '', // Greenland (goes to default)
    // GM: '', // Gambia (the) (goes to default)
    // GN: '', // Guinea (goes to default)
    // GP: '', // Guadeloupe (goes to default)
    // GQ: '', // Equatorial Guinea (goes to default)
    // GR: '', // Greece (goes to default)
    // GS: '', // South Georgia and the South Sandwich Islands (goes to default)
    // GT: '', // Guatemala (goes to default)
    // GU: '', // Guam (goes to default)
    // GW: '', // Guinea-Bissau (goes to default)
    // GY: '', // Guyana (goes to default)
    // HK: '', // Hong Kong (goes to default)
    // HM: '', // Heard Island and McDonald Islands (goes to default)
    // HN: '', // Honduras (goes to default)
    // HR: '', // Croatia (goes to default)
    // HT: '', // Haiti (goes to default)
    // HU: '', // Hungary (goes to default)
    // ID: '', // Indonesia (goes to default)
    IE: 'amazon.co.uk', // Ireland -> UK
    // IL: '', // Israel (goes to default)
    IM: 'amazon.co.uk', // Isle of Man -> UK
    IN: 'amazon.in', // India
    IO: 'amazon.in', // British Indian Ocean Territory (the) -> India
    // IQ: '', // Iraq  (goes to default)
    // IR: '', // Iran (Islamic Republic of) (goes to default)
    // IS: '', // Iceland (goes to default)
    IT: 'amazon.it', // Italy
    // JE: '', // Jersey (goes to default)
    // JM: '', // Jamaica (goes to default)
    // JO: '', // Jordan (goes to default)
    JP: 'amazon.co.jp', // Japan
    // KE: '', // Kenya (goes to default)
    // KG: '', // Kyrgyzstan (goes to default)
    // KH: '', // Cambodia (goes to default)
    // KI: '', // Kiribati (goes to default)
    // KM: '', // Comoros (the) (goes to default)
    // KN: '', // Saint Kitts and Nevis (goes to default)
    // KP: '', // Korea (the Democratic People's Republic of) (goes to default)
    // KR: '', // Korea (the Republic of) (goes to default)
    // KW: '', // Kuwait (goes to default)
    // KY: '', // Cayman Islands (the) (goes to default)
    // KZ: '', // Kazakhstan (goes to default)
    // LA: '', // Lao People's Democratic Republic (the) (goes to default)
    // LB: '', // Lebanon (goes to default)
    // LC: '', // Saint Lucia (goes to default)
    LI: 'amazon.nl', // Liechtenstein -> Netherlands
    // LK: '', // Sri Lanka (goes to default)
    // LR: '', // Liberia (goes to default)
    // LS: '', // Lesotho (goes to default)
    // LT: '', // Lithuania (goes to default)
    LU: 'amazon.nl', // Luxembourg -> Netherlands
    // LV: '', // Latvia (goes to default)
    // LY: '', // Libya (goes to default)
    // MA: '', // Morocco (goes to default)
    MC: 'amazon.fr', // Monaco -> France
    // MD: '', // Moldova (the Republic of) (goes to default)
    // ME: '', // Montenegro (goes to default)
    // MF: '', // Saint Martin (French part) (goes to default)
    // MG: '', // Madagascar (goes to default)
    // MH: '', // Marshall Islands (the) (goes to default)
    // MK: '', // Republic of North Macedonia (goes to default)
    // ML: '', // Mali (goes to default)
    // MM: '', // Myanmar (goes to default)
    MN: 'amazon.cn', // Mongolia -> China
    // MO: '', // Macao (goes to default)
    // MP: '', // Northern Mariana Islands (the) (goes to default)
    // MQ: '', // Martinique (goes to default)
    // MR: '', // Mauritania (goes to default)
    // MS: '', // Montserrat (goes to default)
    MT: 'amazon.co.uk', // Malta -> UK
    // MU: '', // Mauritius (goes to default)
    // MV: '', // Maldives (goes to default)
    // MW: '', // Malawi (goes to default)
    MX: 'amazon.com.mx', // Mexico
    // MY: '', // Malaysia (goes to default)
    // MZ: '', // Mozambique (goes to default)
    // NA: '', // Namibia (goes to default)
    NC: 'amazon.com.au', // New Caledonia -> Australia
    // NE: '', // Niger (the) (goes to default)
    // NF: '', // Norfolk Island (goes to default)
    // NG: '', // Nigeria (goes to default)
    // NI: '', // Nicaragua (goes to default)
    NL: 'amazon.nl', // Netherlands (the)
    // NO: '', // Norway (goes to default)
    // NP: '', // Nepal (goes to default)
    // NR: '', // Nauru (goes to default)
    // NU: '', // Niue (goes to default)
    NZ: 'amazon.com.au', // New Zealand -> Australia
    // OM: '', // Oman (goes to default)
    // PA: '', // Panama (goes to default)
    // PE: '', // Peru (goes to default)
    // PF: '', // French Polynesia (goes to default)
    // PG: '', // Papua New Guinea (goes to default)
    // PH: '', // Philippines (the) (goes to default)
    // PK: '', // Pakistan (goes to default)
    // PL: '', // Poland (goes to default)
    // PM: '', // Saint Pierre and Miquelon (goes to default)
    // PN: '', // Pitcairn (goes to default)
    // PR: '', // Puerto Rico (goes to default)
    // PS: '', // Palestine, State of (goes to default)
    // PT: '', // Portugal (goes to default)
    // PW: '', // Palau (goes to default)
    // PY: '', // Paraguay (goes to default)
    // QA: '', // Qatar (goes to default)
    // RE: '', // Réunion (goes to default)
    // RO: '', // Romania (goes to default)
    // RS: '', // Serbia (goes to default)
    // RU: '', // Russian Federation (the) (goes to default)
    // RW: '', // Rwanda (goes to default)
    // SA: '', // Saudi Arabia (goes to default)
    // SB: '', // Solomon Islands (goes to default)
    // SC: '', // Seychelles (goes to default)
    // SD: '', // Sudan (the) (goes to default)
    // SE: '', // Sweden (goes to default)
    SG: 'amazon.sg', // Singapore
    // SH: '', // Saint Helena, Ascension and Tristan da Cunha (goes to default)
    // SI: '', // Slovenia (goes to default)
    // SJ: '', // Svalbard and Jan Mayen (goes to default)
    // SK: '', // Slovakia (goes to default)
    // SL: '', // Sierra Leone (goes to default)
    SM: 'amazon.it', // San Marino -> Italy
    // SN: '', // Senegal (goes to default)
    // SO: '', // Somalia (goes to default)
    // SR: '', // Suriname (goes to default)
    // SS: '', // South Sudan (goes to default)
    // ST: '', // Sao Tome and Principe (goes to default)
    // SV: '', // El Salvador (goes to default)
    // SX: '', // Sint Maarten (Dutch part) (goes to default)
    // SY: '', // Syrian Arab Republic (goes to default)
    // SZ: '', // Eswatini (goes to default)
    // TC: '', // Turks and Caicos Islands (the) (goes to default)
    // TD: '', // Chad (goes to default)
    // TF: '', // French Southern Territories (the) (goes to default)
    // TG: '', // Togo (goes to default)
    // TH: '', // Thailand (goes to default)
    // TJ: '', // Tajikistan (goes to default)
    // TK: '', // Tokelau (goes to default)
    // TL: '', // Timor-Leste (goes to default)
    // TM: '', // Turkmenistan (goes to default)
    // TN: '', // Tunisia (goes to default)
    // TO: '', // Tonga (goes to default)
    TR: 'amazon.com.tr', // Turkey
    // TT: '', // Trinidad and Tobago (goes to default)
    // TV: '', // Tuvalu (goes to default)
    TW: 'amazon.cn', // Taiwan (Province of China) -> China
    // TZ: '', // Tanzania, United Republic of (goes to default)
    // UA: '', // Ukraine (goes to default)
    // UG: '', // Uganda (goes to default)
    // UM: '', // United States Minor Outlying Islands (the) (goes to default)
    US: 'amazon.com', // United States of America (the)
    // UY: '', // Uruguay (goes to default)
    // UZ: '', // Uzbekistan (goes to default)
    VA: 'amazon.it' // Holy See (the) -> Italy
    // VC: '', // Saint Vincent and the Grenadines (goes to default)
    // VE: '', // Venezuela (Bolivarian Republic of) (goes to default)
    // VG: '', // Virgin Islands (British) (goes to default)
    // VI: '', // Virgin Islands (U.S.) (goes to default)
    // VN: '', // Viet Nam (goes to default)
    // VU: '', // Vanuatu (goes to default)
    // WF: '', // Wallis and Futuna (goes to default)
    // WS: '', // Samoa (goes to default)
    // YE: '', // Yemen (goes to default)
    // YT: '', // Mayotte (goes to default)
    // ZA: '', // South Africa (goes to default)
    // ZM: '', // Zambia (goes to default)
    // ZW: '' // Zimbabwe (goes to default)
  }