import { Product } from "@/contexts/ProductContext";

/**
 * Calculate similarity between two strings using Levenshtein distance
 * Returns a score between 0 (completely different) and 1 (identical)
 */
function calculateStringSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    // If strings are identical, return 1
    if (s1 === s2) return 1;

    // If one string contains the other, return high similarity
    if (s1.includes(s2) || s2.includes(s1)) {
        return 0.8;
    }

    // Calculate Levenshtein distance
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix: number[][] = [];

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    const distance = matrix[len1][len2];
    const maxLength = Math.max(len1, len2);

    // Convert distance to similarity score (0-1)
    return 1 - distance / maxLength;
}

/**
 * Extract keywords from a string for matching
 */
function extractKeywords(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2); // Filter out very short words
}

/**
 * Score a product against a search query
 * Returns a score between 0-100
 */
export function scoreProduct(product: Product, query: string): number {
    const queryLower = query.toLowerCase();
    const queryWords = extractKeywords(query);

    let brandScore = 0;
    let nameScore = 0;
    let categoryScore = 0;
    let descriptionScore = 0;

    // Brand matching (40% weight)
    if (product.brand.toLowerCase() === queryLower) {
        brandScore = 100;
    } else if (product.brand.toLowerCase().includes(queryLower)) {
        brandScore = 80;
    } else {
        brandScore = calculateStringSimilarity(product.brand, query) * 100;
    }

    // Name matching (30% weight)
    if (product.name.toLowerCase() === queryLower) {
        nameScore = 100;
    } else if (product.name.toLowerCase().includes(queryLower)) {
        nameScore = 85;
    } else {
        // Check for partial matches with query words
        const nameWords = extractKeywords(product.name);
        const matchingWords = queryWords.filter(qw =>
            nameWords.some(nw => nw.includes(qw) || qw.includes(nw))
        );
        const wordMatchRatio = matchingWords.length / queryWords.length;
        nameScore = Math.max(
            calculateStringSimilarity(product.name, query) * 100,
            wordMatchRatio * 80
        );
    }

    // Category matching (20% weight)
    if (product.category?.toLowerCase() === queryLower) {
        categoryScore = 100;
    } else if (product.category?.toLowerCase().includes(queryLower)) {
        categoryScore = 80;
    } else if (product.category) {
        categoryScore = calculateStringSimilarity(product.category, query) * 100;
    }

    // Description matching (10% weight)
    if (product.description?.toLowerCase().includes(queryLower)) {
        descriptionScore = 70;
    } else if (product.description) {
        const descWords = extractKeywords(product.description);
        const matchingWords = queryWords.filter(qw =>
            descWords.some(dw => dw.includes(qw) || qw.includes(dw))
        );
        descriptionScore = (matchingWords.length / queryWords.length) * 60;
    }

    // Calculate weighted score
    const totalScore = (
        brandScore * 0.4 +
        nameScore * 0.3 +
        categoryScore * 0.2 +
        descriptionScore * 0.1
    );

    return totalScore;
}

/**
 * Search result interface
 */
export interface SearchResult {
    exactMatches: Product[];
    similarProducts: Product[];
    hasResults: boolean;
    searchQuery: string;
}

/**
 * Search products with fuzzy matching and similarity scoring
 */
export function searchProducts(
    products: Product[],
    query: string,
    options?: {
        exactMatchThreshold?: number;
        similarityThreshold?: number;
        maxSimilarResults?: number;
    }
): SearchResult {
    const {
        exactMatchThreshold = 70,  // Score >= 70 is considered exact match
        similarityThreshold = 30,  // Score >= 30 is considered similar
        maxSimilarResults = 12     // Max similar products to show
    } = options || {};

    const queryLower = query.toLowerCase();

    // Score all products
    const scoredProducts = products.map(product => ({
        product,
        score: scoreProduct(product, query)
    }));

    // Sort by score (highest first)
    scoredProducts.sort((a, b) => b.score - a.score);

    // Separate exact matches from similar products
    const exactMatches: Product[] = [];
    const similarProducts: Product[] = [];

    for (const { product, score } of scoredProducts) {
        if (score >= exactMatchThreshold) {
            exactMatches.push(product);
        } else if (score >= similarityThreshold && similarProducts.length < maxSimilarResults) {
            similarProducts.push(product);
        }
    }

    return {
        exactMatches,
        similarProducts,
        hasResults: exactMatches.length > 0 || similarProducts.length > 0,
        searchQuery: query
    };
}

/**
 * Simple search for category filtering (backward compatibility)
 */
export function filterByCategory(products: Product[], category: string): Product[] {
    return products.filter(p =>
        p.category?.toLowerCase() === category.toLowerCase()
    );
}
