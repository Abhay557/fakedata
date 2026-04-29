/**
 * Type definitions for mockgen557
 */

export namespace data {
    export interface User {
        id: string;
        fullName: string;
        firstName: string;
        lastName: string;
        middleName: string;
        age: string;
        gender: string;
        email: string;
        phone: string;
        username: string;
        password: string;
        birthDate: string;
        bloodGroup: string;
        height: number;
        weight: number;
        domain: string;
        ip: string;
        macaddress: string;
        address: {
            street: string;
            city: string;
            state: string;
            country: string;
            zipCode: number;
            coordinates: {
                latitude: string;
                longitude: string;
            };
        };
        university: string;
        bank: {
            nameOnCard: string;
            cardNumber: string;
            cardType: string;
            cardExpiry: string;
            cardCvv: string;
        };
        occupation: {
            title: string;
            salary: string;
            department: string;
        };
        family_status: string;
        hobbies: string[];
        technology_profile: {
            devices: {
                additional_devices: string[];
                smartphone: string;
            };
            phone_preferences: {
                critical_features: string[];
                primary_uses: string[];
            };
            interest: string[];
        };
    }

    export function user(): User;
    export function users(count?: number): User[];
    export function getEmail(): { email: string };
    export function getUsername(): { username: string };
    export function getPassword(length?: number): { password: string };
    export function getZipCode(): { zipCode: number };
    export function getCoordinates(): { latitude: string; longitude: string };
    export function getCity(): { city: string };
    export function getStateCode(): { stateCode: string };
    export function creditcard(): {
        nameOnCard: string;
        cardNumber: string;
        cardType: string;
        cardExpiry: string;
        cardCvv: string;
    };
    export function address(): {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: number;
        ip: string;
        macaddress: string;
        coordinates: { latitude: string; longitude: string };
    };
    export function resume(count?: number): any[];
    export function biodata(count?: number): any[];
}

export namespace fun {
    export interface Pokemon {
        id: number;
        name: string;
        "Type 1": string;
        "Type 2": string;
        Total: number;
        HP: number;
        Attack: number;
        Defense: number;
        "Sp. Atk": number;
        "Sp. Def": number;
        Speed: number;
        Generation: number;
        Legendary: boolean;
    }

    export interface Joke {
        id: number;
        type: string;
        setup: string;
        punchline: string;
    }

    export function joke(): Joke;
    export function jokesByType(type: string): Joke | { error: string };
    export function fact(): { fact: string };
    export function fortune(): { fortune: string };
    export function pickup(): { pickup: string };
    export function quote(): { quote: string; author: string };
    export function pokemon(): Pokemon;
    export function pokemonByType(type: string): Pokemon | { error: string };
}

export namespace anime {
    export interface AnimeQuote {
        anime: string;
        quote: string;
        character: string;
        id: number;
    }

    export function quote(): AnimeQuote;
    export function quotesByShow(animeName: string): AnimeQuote | { error: string };
    export function fact(): { question: string; answers: string };
}

export namespace animals {
    export function random(): { animal: string };
    export function catFact(): { fact: string };
    export function dogFact(): { fact: string };
}
