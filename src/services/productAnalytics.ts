import type { SearchResult } from "../clients/customTypes";


export interface ScoredProducts{
    
    title: string;
    asin: string;
    link: string;
    image: string;

    is_prime?: boolean;

    rating?: number;
    ratings_total?: number;

    priceSymbol: string;
    priceValue: number;
    quality:number
}


export function scoreSearchResults(searchResults:SearchResult[]):ScoredProducts[]{
    return []
}
